import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Internal services
import { query, queryOne } from './src/services/db.service.ts';
import { runInference, InferenceFeatures } from './src/services/ml.service.ts';
import { signToken, verifyToken, requireAuth, AuthenticatedRequest } from './src/middleware/auth.middleware.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================================
// Gemini AI Client — lazy initialised only when key present
// ============================================================
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return aiClient;
}

// ============================================================
// Helper: Build ML feature vector from DB for one supplier
// ============================================================
async function buildFeaturesForSupplier(supplierId: string): Promise<InferenceFeatures | null> {
  // Financial – last 6 months average
  const finRows = await query<any>(
    `SELECT revenue, expenses, cash_flow, profit_margin, current_ratio, debt_ratio, working_capital
     FROM financial_history WHERE supplier_id = ? ORDER BY month DESC LIMIT 6`,
    [supplierId]
  );
  if (!finRows.length) return null;

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const avg_revenue       = avg(finRows.map((r: any) => r.revenue));
  const avg_expenses      = avg(finRows.map((r: any) => r.expenses));
  const avg_cash_flow     = avg(finRows.map((r: any) => r.cash_flow));
  const avg_margin        = avg(finRows.map((r: any) => r.profit_margin));
  const avg_current_ratio = avg(finRows.map((r: any) => r.current_ratio));
  const avg_debt_ratio    = avg(finRows.map((r: any) => r.debt_ratio));
  const avg_working_capital = avg(finRows.map((r: any) => r.working_capital));

  // Revenue trend: latest vs oldest in the window
  const finAll = await query<any>(
    `SELECT revenue FROM financial_history WHERE supplier_id = ? ORDER BY month ASC`,
    [supplierId]
  );
  const oldest = finAll[0]?.revenue ?? 1;
  const latest = finAll[finAll.length - 1]?.revenue ?? oldest;
  const rev_trend = (latest - oldest) / Math.max(1, oldest);

  // Delivery – last 6 months
  const delRows = await query<any>(
    `SELECT delay_days, on_time FROM delivery_history WHERE supplier_id = ? ORDER BY month DESC LIMIT 6`,
    [supplierId]
  );
  const avg_delay = avg(delRows.map((r: any) => r.delay_days));
  const max_delay = Math.max(...delRows.map((r: any) => r.delay_days));
  const late_rate = delRows.filter((r: any) => r.on_time === 0).length / Math.max(1, delRows.length);

  // Quality – last 6 months
  const qualRows = await query<any>(
    `SELECT inspection_score, defect_rate, return_rate, complaints
     FROM quality_history WHERE supplier_id = ? ORDER BY month DESC LIMIT 6`,
    [supplierId]
  );
  const avg_inspect    = avg(qualRows.map((r: any) => r.inspection_score));
  const avg_defect     = avg(qualRows.map((r: any) => r.defect_rate));
  const avg_return     = avg(qualRows.map((r: any) => r.return_rate));
  const total_complaints = qualRows.reduce((s: number, r: any) => s + r.complaints, 0);

  // Compliance – most recent record
  const compRow = await queryOne<any>(
    `SELECT gst_compliant, iso9001, iso14001, audit_score, violations
     FROM compliance WHERE supplier_id = ? ORDER BY month DESC LIMIT 1`,
    [supplierId]
  );
  const recentComp = await query<any>(
    `SELECT violations, audit_score FROM compliance WHERE supplier_id = ? ORDER BY month DESC LIMIT 6`,
    [supplierId]
  );
  const avg_audit       = avg(recentComp.map((r: any) => r.audit_score));
  const total_violations = recentComp.reduce((s: number, r: any) => s + r.violations, 0);

  // External events
  const evtRows = await query<any>(
    `SELECT impact_score FROM external_events WHERE supplier_id = ?`,
    [supplierId]
  );
  const event_count  = evtRows.length;
  const event_impact = evtRows.reduce((s: number, r: any) => s + r.impact_score, 0);

  return {
    supplier_id: supplierId,
    avg_revenue,
    avg_expenses,
    avg_cash_flow,
    avg_margin,
    avg_current_ratio,
    avg_debt_ratio,
    avg_working_capital,
    rev_trend,
    avg_delay,
    max_delay,
    late_rate,
    avg_inspect,
    avg_defect,
    avg_return,
    total_complaints,
    gst_compliant: compRow?.gst_compliant ?? 1,
    iso9001:       compRow?.iso9001 ?? 1,
    iso14001:      compRow?.iso14001 ?? 1,
    avg_audit,
    total_violations,
    event_count,
    event_impact
  };
}

// ============================================================
// POST /api/auth/login
// ============================================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password, company } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required.' });
  }

  // Demo credential validation — in production, hash comparison against user table
  const validUsers: Record<string, { password: string; role: string }> = {
    admin:     { password: 'admin123',    role: 'admin' },
    manager:   { password: 'manager123',  role: 'manager' },
    executive: { password: 'exec123',     role: 'executive' },
    analyst:   { password: 'analyst123',  role: 'analyst' }
  };

  const record = validUsers[username.toLowerCase()];
  if (!record || record.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = signToken({ username, company: company || 'SupplyShield Corp', role: record.role });
  res.json({ token, username, role: record.role, company: company || 'SupplyShield Corp' });
});

// ============================================================
// POST /api/auth/verify
// ============================================================
app.post('/api/auth/verify', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token is required.' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token.' });
  res.json(payload);
});

// ============================================================
// GET /api/dashboard
// ============================================================
app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const totals = await queryOne<any>(`SELECT COUNT(*) as total FROM suppliers`);
    const highRisk = await queryOne<any>(`SELECT COUNT(*) as cnt FROM suppliers WHERE risk_level = 'HIGH'`);
    const critical  = await queryOne<any>(`SELECT COUNT(*) as cnt FROM suppliers WHERE risk_level = 'CRITICAL'`);
    const avgTrust  = await queryOne<any>(`SELECT AVG(trust_score) as avg FROM suppliers`);
    const avgDel    = await queryOne<any>(`SELECT AVG(delivery_score) as avg FROM suppliers`);

    const revenueRow = await queryOne<any>(
      `SELECT SUM(revenue) as total FROM financial_history WHERE month = (SELECT MAX(month) FROM financial_history)`
    );

    // Risk distribution
    const riskDist = await query<any>(
      `SELECT risk_level, COUNT(*) as count FROM suppliers GROUP BY risk_level`
    );

    // Industry breakdown
    const industryDist = await query<any>(
      `SELECT industry, COUNT(*) as count, AVG(trust_score) as avg_trust FROM suppliers GROUP BY industry ORDER BY count DESC`
    );

    // Country breakdown
    const countryDist = await query<any>(
      `SELECT country, COUNT(*) as count FROM suppliers GROUP BY country ORDER BY count DESC LIMIT 7`
    );

    // Recent alerts: suppliers where risk changed to HIGH or CRITICAL
    const riskAlerts = await query<any>(
      `SELECT supplier_id, supplier_name, risk_level, trust_score, failure_probability, industry, country
       FROM suppliers WHERE risk_level IN ('HIGH','CRITICAL') ORDER BY trust_score ASC LIMIT 5`
    );

    res.json({
      total_suppliers:     totals?.total ?? 0,
      high_risk:           highRisk?.cnt ?? 0,
      critical:            critical?.cnt ?? 0,
      average_trust_score: Math.round(avgTrust?.avg ?? 0),
      average_delivery:    Math.round(avgDel?.avg ?? 0),
      monthly_procurement: Math.round((revenueRow?.total ?? 0) / 1_000_000 * 10) / 10,
      risk_distribution:   riskDist,
      industry_breakdown:  industryDist,
      country_breakdown:   countryDist,
      risk_alerts:         riskAlerts
    });
  } catch (err: any) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/suppliers  – search, filter, paginate
// ============================================================
app.get('/api/suppliers', async (req: Request, res: Response) => {
  try {
    const { search, industry, country, risk, status, page = '1', limit = '50' } = req.query;

    let sql = `SELECT * FROM suppliers WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      sql += ` AND (LOWER(supplier_name) LIKE ? OR LOWER(supplier_id) LIKE ? OR LOWER(city) LIKE ?)`;
      const q = `%${String(search).toLowerCase()}%`;
      params.push(q, q, q);
    }
    if (industry) { sql += ` AND LOWER(industry) = ?`; params.push(String(industry).toLowerCase()); }
    if (country)  { sql += ` AND LOWER(country)  = ?`; params.push(String(country).toLowerCase()); }
    if (risk)     { sql += ` AND LOWER(risk_level) = ?`; params.push(String(risk).toLowerCase()); }
    if (status)   { sql += ` AND LOWER(status) = ?`; params.push(String(status).toLowerCase()); }

    sql += ` ORDER BY trust_score ASC`;

    const pageNum  = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const offset   = (pageNum - 1) * limitNum;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const rows = await query<any>(sql, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/supplier/:id
// ============================================================
app.get('/api/supplier/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await queryOne<any>(`SELECT * FROM suppliers WHERE supplier_id = ?`, [req.params.id]);
    if (!supplier) return res.status(404).json({ error: `Supplier ${req.params.id} not found.` });
    res.json(supplier);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/supplier/:id/financial
// ============================================================
app.get('/api/supplier/:id/financial', async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      `SELECT * FROM financial_history WHERE supplier_id = ? ORDER BY month ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/supplier/:id/delivery
// ============================================================
app.get('/api/supplier/:id/delivery', async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      `SELECT * FROM delivery_history WHERE supplier_id = ? ORDER BY month ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/supplier/:id/quality
// ============================================================
app.get('/api/supplier/:id/quality', async (req: Request, res: Response) => {
  try {
    const quality    = await query<any>(`SELECT * FROM quality_history WHERE supplier_id = ? ORDER BY month ASC`, [req.params.id]);
    const compliance = await queryOne<any>(`SELECT * FROM compliance WHERE supplier_id = ? ORDER BY month DESC LIMIT 1`, [req.params.id]);
    const complaints = await query<any>(`SELECT * FROM complaints WHERE supplier_id = ? ORDER BY month DESC`, [req.params.id]);
    const orders     = await query<any>(`SELECT * FROM orders WHERE supplier_id = ? ORDER BY month DESC LIMIT 12`, [req.params.id]);
    res.json({ quality, compliance, complaints, orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/supplier/:id/events
// ============================================================
app.get('/api/supplier/:id/events', async (req: Request, res: Response) => {
  try {
    const events = await query<any>(
      `SELECT * FROM external_events WHERE supplier_id = ? ORDER BY date DESC`,
      [req.params.id]
    );
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/supplier/:id/timeline  (trust score over time)
// ============================================================
app.get('/api/supplier/:id/timeline', async (req: Request, res: Response) => {
  try {
    // Pull financial + delivery + quality + compliance for each month and compute trust score
    const fins  = await query<any>(`SELECT * FROM financial_history WHERE supplier_id = ? ORDER BY month ASC`, [req.params.id]);
    const dels  = await query<any>(`SELECT * FROM delivery_history WHERE supplier_id = ? ORDER BY month ASC`, [req.params.id]);
    const quals = await query<any>(`SELECT * FROM quality_history WHERE supplier_id = ? ORDER BY month ASC`, [req.params.id]);
    const comps = await query<any>(`SELECT * FROM compliance WHERE supplier_id = ? ORDER BY month ASC`, [req.params.id]);

    const timeline = fins.map((fin: any, i: number) => {
      const del  = dels[i]  || { delay_days: 0, on_time: 1 };
      const qual = quals[i] || { inspection_score: 80, defect_rate: 2, return_rate: 1, complaints: 0 };
      const comp = comps[i] || { audit_score: 80, gst_compliant: 1, iso9001: 1, iso14001: 1 };

      // Financial health score (simplified inline)
      const margin = fin.profit_margin;
      const fin_score = Math.min(100, Math.max(0,
        (margin > 0.2 ? 100 : margin > 0.1 ? 85 : margin >= 0 ? 70 : 40) * 0.40 +
        (fin.current_ratio >= 2 ? 100 : fin.current_ratio >= 1.5 ? 85 : fin.current_ratio >= 1 ? 60 : 30) * 0.30 +
        (fin.debt_ratio < 0.25 ? 100 : fin.debt_ratio < 0.5 ? 80 : fin.debt_ratio < 0.8 ? 60 : 30) * 0.30
      ));

      const delay_score = Math.max(0, 100 - del.delay_days * 8);
      const on_time_score = del.on_time ? 100 : 30;
      const del_score = on_time_score * 0.45 + delay_score * 0.30 + (del.on_time ? 100 : 20) * 0.25;

      const qual_score = Math.min(100, Math.max(0,
        qual.inspection_score * 0.40 +
        Math.max(0, 100 - qual.defect_rate * 10) * 0.35 +
        Math.max(0, 100 - qual.return_rate * 10) * 0.25
      ));

      const comp_score = Math.min(100, Math.max(0,
        comp.audit_score * 0.40 +
        (comp.gst_compliant ? 100 : 20) * 0.20 +
        (comp.iso9001 ? 100 : 20) * 0.20 +
        (comp.iso14001 ? 100 : 20) * 0.20
      ));

      const sentiment = Math.max(10, 100 - qual.complaints * 20);
      const external  = 100; // no per-month event lookup in timeline for performance

      const trust = Math.round(
        fin_score * 0.30 + del_score * 0.25 + qual_score * 0.20 +
        comp_score * 0.10 + external * 0.10 + sentiment * 0.05
      );

      return { month: fin.month, trust_score: Math.min(100, Math.max(0, trust)) };
    });

    res.json(timeline);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/alerts
// ============================================================
app.get('/api/alerts', async (req: Request, res: Response) => {
  try {
    const critical = await query<any>(
      `SELECT s.supplier_id, s.supplier_name, s.risk_level, s.trust_score, s.failure_probability,
              s.industry, s.country, e.title as event_title, e.severity as event_severity, e.date
       FROM suppliers s
       LEFT JOIN external_events e ON s.supplier_id = e.supplier_id
       WHERE s.risk_level IN ('CRITICAL','HIGH')
       ORDER BY s.trust_score ASC, e.date DESC
       LIMIT 20`
    );

    const alerts = critical.map((row: any, idx: number) => ({
      alert_id:    `ALT${String(idx + 1).padStart(4, '0')}`,
      supplier_id: row.supplier_id,
      title:       row.event_title || `Risk elevation detected for ${row.supplier_name}`,
      message:     `${row.supplier_name} (${row.industry}, ${row.country}) is at ${row.risk_level} risk — Trust Score ${row.trust_score}/100. Failure probability: ${Math.round(row.failure_probability * 100)}%.`,
      severity:    row.risk_level,
      time:        row.date || new Date().toISOString()
    }));

    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// GET /api/recommendations
// ============================================================
app.get('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      `SELECT r.supplier_id, r.recommendation, r.priority,
              s.supplier_name, s.industry, s.risk_level, s.trust_score
       FROM recommendations r
       JOIN suppliers s ON r.supplier_id = s.supplier_id
       ORDER BY CASE r.priority WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END ASC`
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// POST /api/predict   – real ML inference
// ============================================================
app.post('/api/predict', async (req: Request, res: Response) => {
  try {
    const { supplier_id } = req.body;
    if (!supplier_id) return res.status(400).json({ error: 'supplier_id is required.' });

    const supplier = await queryOne<any>(`SELECT * FROM suppliers WHERE supplier_id = ?`, [supplier_id]);
    if (!supplier) return res.status(404).json({ error: `Supplier ${supplier_id} not found.` });

    const features = await buildFeaturesForSupplier(supplier_id);
    if (!features) return res.status(422).json({ error: 'Insufficient historical data for inference.' });

    const result = await runInference(features);
    const rec = await queryOne<any>(`SELECT * FROM recommendations WHERE supplier_id = ?`, [supplier_id]);

    res.json({
      prediction: {
        supplier_id,
        trust_score:               result.trust_score,
        risk_level:                result.risk_level,
        failure_probability:       result.failure_probability,
        delivery_delay_prediction: result.delivery_delay_prediction,
        prediction_confidence:     0.85,
        predicted_failure_months:  result.risk_level === 'CRITICAL' ? 6 : result.risk_level === 'HIGH' ? 18 : 0
      },
      explainable: {
        supplier_id,
        top_factors: result.explanations
      },
      recommendation: rec || {
        supplier_id,
        recommendation: 'Continue standard monitoring cadence.',
        priority: 'Low'
      }
    });
  } catch (err: any) {
    console.error('Predict error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// POST /api/simulate  – mathematical propagation per PDD 2B
// ============================================================
app.post('/api/simulate', async (req: Request, res: Response) => {
  try {
    const { supplier_id, revenue_change, cash_flow_change, delivery_delay_change, complaints_change, defect_rate_change } = req.body;
    if (!supplier_id) return res.status(400).json({ error: 'supplier_id is required.' });

    const supplier = await queryOne<any>(`SELECT * FROM suppliers WHERE supplier_id = ?`, [supplier_id]);
    if (!supplier) return res.status(404).json({ error: `Supplier ${supplier_id} not found.` });

    // Build base features from DB
    const features = await buildFeaturesForSupplier(supplier_id);
    if (!features) return res.status(422).json({ error: 'Insufficient data for simulation.' });

    // Apply scenario deltas (PDD dependency chain: Revenue → CashFlow → WorkingCapital → FinancialScore → Trust)
    const revChange    = revenue_change    ?? 0;  // percent, e.g. -20 means -20%
    const cfChange     = cash_flow_change  ?? 0;  // percent
    const delayChange  = delivery_delay_change ?? 0;  // days added
    const complChange  = complaints_change ?? 0;  // count added
    const defectChange = defect_rate_change ?? 0; // percentage points added

    // Propagate changes through the dependency chain
    const simFeatures: InferenceFeatures = {
      ...features,
      avg_revenue:       features.avg_revenue       * (1 + revChange / 100),
      avg_cash_flow:     features.avg_cash_flow      * (1 + cfChange / 100),
      avg_working_capital: features.avg_working_capital * (1 + (revChange + cfChange) / 200),
      avg_delay:         features.avg_delay          + delayChange,
      max_delay:         features.max_delay          + Math.max(0, delayChange),
      late_rate:         Math.min(1, features.late_rate + delayChange * 0.05),
      total_complaints:  features.total_complaints   + complChange,
      avg_defect:        Math.max(0, features.avg_defect + defectChange),
      avg_return:        Math.max(0, features.avg_return  + defectChange * 0.6),
    };

    const result = await runInference(simFeatures);

    // Build action recommendation based on new simulated state
    let simulatedRec = 'Continue current operational strategy.';
    if (result.risk_level === 'CRITICAL') {
      simulatedRec = 'IMMEDIATE ACTION REQUIRED: Activate backup supply routes and pause procurement volume with this supplier.';
    } else if (result.risk_level === 'HIGH') {
      simulatedRec = 'Reduce procurement dependency and onboard alternative suppliers in the same category. Increase safety stock.';
    } else if (result.risk_level === 'MEDIUM') {
      simulatedRec = 'Initiate monthly review cadence. Build 15% safety buffer stock and monitor delivery telemetry.';
    }

    res.json({
      simulated_trust_score:    result.trust_score,
      simulated_risk_level:     result.risk_level,
      simulated_failure_prob:   result.failure_probability,
      simulated_delay:          result.delivery_delay_prediction,
      simulation_recommendation: simulatedRec,
      explanations:             result.explanations,
      baseline_trust_score:     supplier.trust_score,
      delta:                    result.trust_score - supplier.trust_score
    });
  } catch (err: any) {
    console.error('Simulate error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// POST /api/compare
// ============================================================
app.post('/api/compare', async (req: Request, res: Response) => {
  try {
    const { supplier_ids } = req.body;
    if (!Array.isArray(supplier_ids) || supplier_ids.length === 0) {
      return res.status(400).json({ error: 'supplier_ids array is required.' });
    }

    const results = await Promise.all(supplier_ids.map(async (id: string) => {
      const sup  = await queryOne<any>(`SELECT * FROM suppliers WHERE supplier_id = ?`, [id]);
      if (!sup) return null;
      const finRow  = await query<any>(`SELECT * FROM financial_history WHERE supplier_id = ? ORDER BY month DESC LIMIT 1`, [id]);
      const qualRow = await queryOne<any>(`SELECT * FROM quality_history WHERE supplier_id = ? ORDER BY month DESC LIMIT 1`, [id]);
      const compRow = await queryOne<any>(`SELECT * FROM compliance WHERE supplier_id = ? ORDER BY month DESC LIMIT 1`, [id]);
      const pred    = await queryOne<any>(`SELECT * FROM predictions WHERE supplier_id = ?`, [id]);
      return {
        supplier:    sup,
        financial:   finRow[0] || null,
        quality:     qualRow,
        compliance:  compRow,
        prediction:  pred
      };
    }));

    res.json(results.filter(Boolean));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// POST /api/chat   – AI Copilot (Gemini + rich DB context)
// ============================================================
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question, history } = req.body;
    if (!question) return res.status(400).json({ error: 'question is required.' });

    const client = getGeminiClient();

    // Build live context from DB
    const suppliers    = await query<any>(`SELECT * FROM suppliers ORDER BY trust_score ASC LIMIT 30`);
    const criticalList = suppliers.filter((s: any) => s.risk_level === 'CRITICAL' || s.risk_level === 'HIGH');
    const alerts       = await query<any>(
      `SELECT s.supplier_name, s.risk_level, e.title, e.severity FROM suppliers s LEFT JOIN external_events e ON s.supplier_id = e.supplier_id WHERE s.risk_level IN ('CRITICAL','HIGH') LIMIT 10`
    );

    const contextString = suppliers.map((s: any) =>
      `- ${s.supplier_name} (${s.supplier_id}): Industry=${s.industry}, Country=${s.country}, Trust=${s.trust_score}/100, Risk=${s.risk_level}, FailureProb=${Math.round(s.failure_probability * 100)}%, Financial=${s.financial_score}, Delivery=${s.delivery_score}, Quality=${s.quality_score}, Compliance=${s.compliance_score}`
    ).join('\n');

    if (!client) {
      // Offline heuristic fallback
      const q = question.toLowerCase();
      let answer = 'I am your SupplyShield AI Copilot. ';

      if (q.includes('critical') || q.includes('high risk') || q.includes('risky')) {
        answer += `Currently there are **${criticalList.length}** suppliers at elevated risk. The most critical are: ${criticalList.slice(0, 3).map((s: any) => `**${s.supplier_name}** (Trust: ${s.trust_score}, ${s.risk_level})`).join(', ')}.`;
      } else if (q.includes('safest') || q.includes('best') || q.includes('top')) {
        const top = [...suppliers].sort((a: any, b: any) => b.trust_score - a.trust_score).slice(0, 3);
        answer += `Your safest suppliers are: ${top.map((s: any) => `**${s.supplier_name}** (Trust: ${s.trust_score})`).join(', ')}.`;
      } else if (q.includes('compare')) {
        answer += `To compare suppliers, navigate to the Supplier Comparison view or ask me to compare specific supplier IDs.`;
      } else {
        answer += `Based on live telemetry:\n- **${criticalList.length}** suppliers are at HIGH or CRITICAL risk.\n- Average trust score across the network is **${Math.round(suppliers.reduce((a: number, s: any) => a + s.trust_score, 0) / suppliers.length)}/100**.\n\n*(Running in offline mode. Configure GEMINI_API_KEY to enable real-time AI reasoning.)*`;
      }
      return res.json({ answer });
    }

    const prompt = `You are the SupplyShield AI Copilot — an enterprise-grade supplier intelligence assistant.

LIVE SUPPLIER INTELLIGENCE DATABASE:
${contextString}

ACTIVE RISK ALERTS:
${JSON.stringify(alerts, null, 2)}

USER QUESTION: "${question}"

Provide a professional, structured, action-oriented response using Markdown. Reference specific suppliers, scores, and data from the database. Do not invent data not present above.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are SupplyShield AI, an enterprise supplier risk intelligence advisor.',
        temperature: 0.2
      }
    });

    res.json({ answer: response.text || 'No response received from AI model.' });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// Vite Dev / Static Production Hosting
// ============================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('SupplyShield AI starting in DEVELOPMENT mode on port', PORT);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, _res) => _res.sendFile(path.join(distPath, 'index.html')));
    console.log('SupplyShield AI starting in PRODUCTION mode on port', PORT);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SupplyShield AI is live → http://localhost:${PORT}`);
  });
}

startServer();
