export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  industry: string;
  country: string;
  city: string;
  years_in_business: number;
  employees: number;
  tier: string;
  profile: string;
  persona: string;
  status: string; // ACTIVE, INACTIVE, UNDER_REVIEW, BLACKLISTED
  trust_score: number;
  risk_level: string; // LOW, MEDIUM, HIGH, CRITICAL
  failure_probability: number;
  confidence: number;
  financial_score: number;
  delivery_score: number;
  quality_score: number;
  compliance_score: number;
  news_risk_score: number;
  last_updated: string;
}

export interface FinancialHistory {
  record_id: string;
  supplier_id: string;
  month: string;
  revenue: number;
  expenses: number;
  cash_flow: number;
  profit_margin: number;
  current_ratio: number;
  debt_ratio: number;
  working_capital: number;
}

export interface DeliveryHistory {
  delivery_id: string;
  supplier_id: string;
  order_id: string;
  expected_date: string;
  actual_date: string;
  delay_days: number;
  on_time: boolean;
  delivery_score: number;
}

export interface Order {
  order_id: string;
  supplier_id: string;
  order_value: number;
  quantity: number;
  category: string;
  status: string; // Delivered, In Transit, Processing, Delayed, Cancelled
}

export interface QualityRecord {
  quality_id: string;
  supplier_id: string;
  inspection_score: number;
  defect_rate: number;
  return_rate: number;
  complaints: number;
}

export interface ComplianceRecord {
  compliance_id: string;
  supplier_id: string;
  gst_compliant: boolean;
  iso9001: boolean;
  iso14001: boolean;
  audit_score: number;
  violations: number;
}

export interface NewsEvent {
  news_id: string;
  supplier_id: string;
  title: string;
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL
  impact_score: number;
  date: string;
}

export interface Complaint {
  complaint_id: string;
  supplier_id: string;
  type: string;
  severity: string;
  resolved: boolean;
}

export interface AIPrediction {
  supplier_id: string;
  trust_score: number;
  risk_level: string;
  failure_probability: number;
  delivery_delay_prediction: number;
  prediction_confidence: number;
  predicted_failure_months: number;
}

export interface ExplainableAI {
  supplier_id: string;
  top_factors: string[];
}

export interface Recommendation {
  supplier_id: string;
  recommendation: string;
  priority: string;
}

export interface RiskTimelineItem {
  month: string;
  trust_score: number;
}

export interface DashboardSummary {
  total_suppliers: number;
  high_risk: number;
  critical: number;
  average_trust_score: number;
  average_delivery: number;
  monthly_procurement: number;
}

export interface Alert {
  alert_id: string;
  supplier_id: string;
  title: string;
  message: string;
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL
  time: string;
}

export interface SimulationResult {
  simulated_trust_score: number;
  simulated_risk_level: string;
  simulation_recommendation: string;
}

export interface SimulatorInput {
  supplier_id: string;
  cash_flow_change: number;
  delivery_delay_change: number;
  complaints_change: number;
}

export interface SimulatorOutput {
  new_trust_score: number;
  risk: string;
  recommendation: string;
}

export interface AIChatRequest {
  question: string;
}

export interface AIChatResponse {
  answer: string;
}
