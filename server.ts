import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PORT = 3000;
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "edge2026";
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me_in_prod";

// Sanitize Supabase URL to avoid "Invalid path" errors
const sanitizeSupabaseUrl = (url: string) => {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
};

// Supabase Init
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString() || req.ip || "unknown";
  },
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: { error: "Too many login attempts. Please try again later." },
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString() || req.ip || "unknown";
  },
});

const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Limit payment verification
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"]?.toString() || req.ip || "unknown";
  },
});

// Middleware for Admin Authentication
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || req.body.token; // Handle both header and old body style
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Essential for Cloud Run / Reverse Proxies to get correct client IP
  app.set("trust proxy", 1);

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Vite needs inline scripts in dev
  }));

  app.use(cors({
    origin: process.env.NODE_ENV === "production" ? ["https://your-domain.com"] : true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }));
  
  app.use(express.json({ limit: "10kb" })); // Body size limit to prevent DDoS

  // Logging Middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      supabase: !!supabase,
      env: process.env.NODE_ENV || 'development'
    });
  });

  // Fetch Predictions (Security: betCode is NEVER returned here)
  app.get("/api/predictions", apiLimiter, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: "Storage service unavailable" });

    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("id, title, price, created_at, expected_odds")
        .order("id", { ascending: true });

      if (error) throw error;

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      
      const mappedData = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        created_at: p.created_at,
        expectedOdds: p.expected_odds,
        unlocked: false,
        betCode: ""
      }));

      res.json(mappedData);
    } catch (err: any) {
      console.error("Fetch Predictions Exception:", err.message);
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  // Secure Verification
  app.post("/api/verify-payment", paymentLimiter, async (req, res) => {
    const { reference, predictionId } = req.body;

    if (!PAYSTACK_SECRET) return res.status(503).json({ error: "Payment configuration missing" });
    if (!reference || !predictionId) return res.status(400).json({ error: "Invalid request parameters" });

    try {
      if (!supabase) throw new Error("Storage service unavailable");

      // 1. Check if this reference has ALREADY been used (Idempotency)
      const { data: existingPayment } = await supabase
        .from("successful_payments")
        .select("id")
        .eq("reference", reference)
        .single();
      
      if (existingPayment) {
        return res.status(403).json({ error: "This transaction reference has already been processed" });
      }

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
      );

      const payment = response.data.data;
      
      if (response.data.status && payment.status === "success") {
        // 2. Record the successful payment to prevent reuse
        await supabase.from("successful_payments").insert([{
          reference: reference,
          prediction_id: predictionId,
          amount: payment.amount / 100,
          customer_email: payment.customer.email
        }]);

        // 3. Fetch the sensitive code
        const { data, error } = await supabase
          .from("predictions")
          .select("bet_code")
          .eq("id", predictionId)
          .single();

        if (error) throw error;
        
        res.json({ 
          success: true, 
          betCode: data.bet_code,
          message: "Payment verified and recorded successfully" 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: payment?.gateway_response || "Payment verification failed" 
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Payment verification error" });
    }
  });

  app.post("/api/admin/login", loginLimiter, (req, res) => {
    const { username, password } = req.body;

    if (username?.toLowerCase()?.trim() === "admin" && password === ADMIN_PASS) {
      const token = jwt.sign(
        { user: "admin", role: "superadmin" },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Admin CRUD
  app.post("/api/admin/predictions", authenticateAdmin, async (req, res) => {
    const { prediction } = req.body;
    if (!supabase) return res.status(503).json({ error: "Database error" });

    try {
      const { data, error } = await supabase
        .from("predictions")
        .insert([{
          title: prediction.title,
          price: prediction.price,
          expected_odds: prediction.expectedOdds,
          bet_code: prediction.betCode
        }])
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/admin/predictions/:id", authenticateAdmin, async (req, res) => {
    const { updates } = req.body;
    const { id } = req.params;
    if (!supabase) return res.status(503).json({ error: "Database error" });

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.expectedOdds !== undefined) dbUpdates.expected_odds = updates.expectedOdds;
      if (updates.betCode !== undefined) dbUpdates.bet_code = updates.betCode;

      const { error } = await supabase
        .from("predictions")
        .update(dbUpdates)
        .eq("id", id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/predictions/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    if (!supabase) return res.status(503).json({ error: "Database error" });

    try {
      const { error } = await supabase
        .from("predictions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/predictions/bulk-delete", authenticateAdmin, async (req, res) => {
    const { ids } = req.body;
    if (!supabase) return res.status(503).json({ error: "Database error" });

    try {
      const { error } = await supabase
        .from("predictions")
        .delete()
        .in("id", ids);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Fallback Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("[Fatal Error]:", err.message);
    res.status(500).json({ error: "Internal server security violation or error" });
  });

  // Vite / Static Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
