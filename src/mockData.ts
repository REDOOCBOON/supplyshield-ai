import {
  Supplier,
  FinancialHistory,
  DeliveryHistory,
  Order,
  QualityRecord,
  ComplianceRecord,
  NewsEvent,
  Complaint,
  AIPrediction,
  ExplainableAI,
  Recommendation,
  RiskTimelineItem,
  DashboardSummary,
  Alert
} from './types';

export const suppliers: Supplier[] = [
  {
    supplier_id: "SUP0001",
    supplier_name: "Alpha Components Pvt Ltd",
    industry: "Automotive",
    country: "India",
    city: "Pune",
    years_in_business: 14,
    employees: 480,
    tier: "Tier-1",
    status: "ACTIVE",
    trust_score: 91,
    risk_level: "LOW",
    failure_probability: 0.08,
    confidence: 0.94,
    financial_score: 93,
    delivery_score: 90,
    quality_score: 95,
    compliance_score: 89,
    news_risk_score: 10,
    last_updated: "2026-07-01"
  },
  {
    supplier_id: "SUP0002",
    supplier_name: "ByteTech Semiconductors",
    industry: "Semiconductor",
    country: "Taiwan",
    city: "Hsinchu",
    years_in_business: 8,
    employees: 1200,
    tier: "Tier-1",
    status: "ACTIVE",
    trust_score: 78,
    risk_level: "MEDIUM",
    failure_probability: 0.22,
    confidence: 0.88,
    financial_score: 75,
    delivery_score: 82,
    quality_score: 85,
    compliance_score: 92,
    news_risk_score: 30,
    last_updated: "2026-06-28"
  },
  {
    supplier_id: "SUP0003",
    supplier_name: "ChemFlow Solutions",
    industry: "Chemical",
    country: "Germany",
    city: "Ludwigshafen",
    years_in_business: 25,
    employees: 350,
    tier: "Tier-2",
    status: "UNDER_REVIEW",
    trust_score: 54,
    risk_level: "HIGH",
    failure_probability: 0.58,
    confidence: 0.85,
    financial_score: 48,
    delivery_score: 55,
    quality_score: 62,
    compliance_score: 74,
    news_risk_score: 65,
    last_updated: "2026-07-02"
  },
  {
    supplier_id: "SUP0004",
    supplier_name: "Global Logistics Corp",
    industry: "Logistics",
    country: "USA",
    city: "Chicago",
    years_in_business: 30,
    employees: 5400,
    tier: "Tier-1",
    status: "ACTIVE",
    trust_score: 95,
    risk_level: "LOW",
    failure_probability: 0.03,
    confidence: 0.97,
    financial_score: 96,
    delivery_score: 94,
    quality_score: 92,
    compliance_score: 98,
    news_risk_score: 5,
    last_updated: "2026-07-03"
  },
  {
    supplier_id: "SUP0005",
    supplier_name: "Apex Battery Technologies",
    industry: "Battery",
    country: "China",
    city: "Shenzhen",
    years_in_business: 5,
    employees: 890,
    tier: "Tier-1",
    status: "UNDER_REVIEW",
    trust_score: 35,
    risk_level: "CRITICAL",
    failure_probability: 0.82,
    confidence: 0.91,
    financial_score: 28,
    delivery_score: 41,
    quality_score: 48,
    compliance_score: 50,
    news_risk_score: 85,
    last_updated: "2026-07-03"
  },
  {
    supplier_id: "SUP0006",
    supplier_name: "MedVitals Pharma",
    industry: "Pharmaceutical",
    country: "India",
    city: "Hyderabad",
    years_in_business: 18,
    employees: 620,
    tier: "Tier-2",
    status: "ACTIVE",
    trust_score: 88,
    risk_level: "LOW",
    failure_probability: 0.11,
    confidence: 0.92,
    financial_score: 85,
    delivery_score: 89,
    quality_score: 91,
    compliance_score: 94,
    news_risk_score: 15,
    last_updated: "2026-06-30"
  },
  {
    supplier_id: "SUP0007",
    supplier_name: "EcoWeave Textiles",
    industry: "Textile",
    country: "Vietnam",
    city: "Da Nang",
    years_in_business: 10,
    employees: 250,
    tier: "Tier-2",
    status: "ACTIVE",
    trust_score: 72,
    risk_level: "MEDIUM",
    failure_probability: 0.28,
    confidence: 0.82,
    financial_score: 70,
    delivery_score: 76,
    quality_score: 71,
    compliance_score: 80,
    news_risk_score: 40,
    last_updated: "2026-06-25"
  },
  {
    supplier_id: "SUP0008",
    supplier_name: "Prime Packaging Ltd",
    industry: "Packaging",
    country: "UK",
    city: "Birmingham",
    years_in_business: 16,
    employees: 180,
    tier: "Tier-2",
    status: "ACTIVE",
    trust_score: 89,
    risk_level: "LOW",
    failure_probability: 0.09,
    confidence: 0.93,
    financial_score: 87,
    delivery_score: 91,
    quality_score: 90,
    compliance_score: 88,
    news_risk_score: 12,
    last_updated: "2026-07-01"
  }
];

export const financialHistories: FinancialHistory[] = [
  // SUP0001
  {
    record_id: "FIN001",
    supplier_id: "SUP0001",
    month: "2026-06",
    revenue: 4200000,
    expenses: 3700000,
    cash_flow: 500000,
    profit_margin: 11.9,
    current_ratio: 2.1,
    debt_ratio: 0.38,
    working_capital: 1600000
  },
  {
    record_id: "FIN002",
    supplier_id: "SUP0001",
    month: "2026-05",
    revenue: 4000000,
    expenses: 3550000,
    cash_flow: 450000,
    profit_margin: 11.25,
    current_ratio: 2.0,
    debt_ratio: 0.40,
    working_capital: 1500000
  },
  {
    record_id: "FIN003",
    supplier_id: "SUP0001",
    month: "2026-04",
    revenue: 3800000,
    expenses: 3400000,
    cash_flow: 400000,
    profit_margin: 10.53,
    current_ratio: 1.9,
    debt_ratio: 0.42,
    working_capital: 1400000
  },
  // SUP0002
  {
    record_id: "FIN004",
    supplier_id: "SUP0002",
    month: "2026-06",
    revenue: 12500000,
    expenses: 11400000,
    cash_flow: 1100000,
    profit_margin: 8.8,
    current_ratio: 1.65,
    debt_ratio: 0.52,
    working_capital: 3100000
  },
  // SUP0003
  {
    record_id: "FIN005",
    supplier_id: "SUP0003",
    month: "2026-06",
    revenue: 3100000,
    expenses: 3250000,
    cash_flow: -150000,
    profit_margin: -4.8,
    current_ratio: 1.05,
    debt_ratio: 0.72,
    working_capital: 150000
  },
  // SUP0005
  {
    record_id: "FIN006",
    supplier_id: "SUP0005",
    month: "2026-06",
    revenue: 2200000,
    expenses: 2650000,
    cash_flow: -450000,
    profit_margin: -20.45,
    current_ratio: 0.85,
    debt_ratio: 0.88,
    working_capital: -350000
  }
];

export const deliveryHistories: DeliveryHistory[] = [
  // SUP0001
  {
    delivery_id: "DEL001",
    supplier_id: "SUP0001",
    order_id: "ORD1001",
    expected_date: "2026-06-01",
    actual_date: "2026-06-03",
    delay_days: 2,
    on_time: false,
    delivery_score: 82
  },
  {
    delivery_id: "DEL002",
    supplier_id: "SUP0001",
    order_id: "ORD1002",
    expected_date: "2026-06-15",
    actual_date: "2026-06-15",
    delay_days: 0,
    on_time: true,
    delivery_score: 95
  },
  {
    delivery_id: "DEL003",
    supplier_id: "SUP0001",
    order_id: "ORD1003",
    expected_date: "2026-06-28",
    actual_date: "2026-06-28",
    delay_days: 0,
    on_time: true,
    delivery_score: 97
  },
  // SUP0003 (Delayed delivery)
  {
    delivery_id: "DEL004",
    supplier_id: "SUP0003",
    order_id: "ORD3001",
    expected_date: "2026-06-10",
    actual_date: "2026-06-19",
    delay_days: 9,
    on_time: false,
    delivery_score: 45
  },
  // SUP0005 (Critical delivery failures)
  {
    delivery_id: "DEL005",
    supplier_id: "SUP0005",
    order_id: "ORD5001",
    expected_date: "2026-06-12",
    actual_date: "2026-06-27",
    delay_days: 15,
    on_time: false,
    delivery_score: 20
  }
];

export const orders: Order[] = [
  {
    order_id: "ORD1001",
    supplier_id: "SUP0001",
    order_value: 850000,
    quantity: 1200,
    category: "Battery",
    status: "Delivered"
  },
  {
    order_id: "ORD1002",
    supplier_id: "SUP0001",
    order_value: 450000,
    quantity: 600,
    category: "Automotive",
    status: "Delivered"
  },
  {
    order_id: "ORD1003",
    supplier_id: "SUP0001",
    order_value: 620000,
    quantity: 950,
    category: "Automotive",
    status: "Delivered"
  },
  {
    order_id: "ORD1004",
    supplier_id: "SUP0001",
    order_value: 1200000,
    quantity: 1500,
    category: "Battery",
    status: "In Transit"
  },
  {
    order_id: "ORD2001",
    supplier_id: "SUP0002",
    order_value: 3400000,
    quantity: 5000,
    category: "Semiconductor",
    status: "Delivered"
  },
  {
    order_id: "ORD3001",
    supplier_id: "SUP0003",
    order_value: 980000,
    quantity: 800,
    category: "Chemical",
    status: "Delivered"
  },
  {
    order_id: "ORD5001",
    supplier_id: "SUP0005",
    order_value: 2800000,
    quantity: 3500,
    category: "Battery",
    status: "Delayed"
  }
];

export const qualityRecords: QualityRecord[] = [
  {
    quality_id: "Q001",
    supplier_id: "SUP0001",
    inspection_score: 95,
    defect_rate: 1.2,
    return_rate: 0.4,
    complaints: 2
  },
  {
    quality_id: "Q002",
    supplier_id: "SUP0002",
    inspection_score: 88,
    defect_rate: 2.1,
    return_rate: 0.8,
    complaints: 5
  },
  {
    quality_id: "Q003",
    supplier_id: "SUP0003",
    inspection_score: 68,
    defect_rate: 6.8,
    return_rate: 3.2,
    complaints: 14
  },
  {
    quality_id: "Q005",
    supplier_id: "SUP0005",
    inspection_score: 51,
    defect_rate: 12.5,
    return_rate: 5.8,
    complaints: 24
  }
];

export const complianceRecords: ComplianceRecord[] = [
  {
    compliance_id: "CMP001",
    supplier_id: "SUP0001",
    gst_compliant: true,
    iso9001: true,
    iso14001: true,
    audit_score: 94,
    violations: 0
  },
  {
    compliance_id: "CMP002",
    supplier_id: "SUP0002",
    gst_compliant: true,
    iso9001: true,
    iso14001: false,
    audit_score: 86,
    violations: 1
  },
  {
    compliance_id: "CMP003",
    supplier_id: "SUP0003",
    gst_compliant: true,
    iso9001: false,
    iso14001: false,
    audit_score: 72,
    violations: 3
  },
  {
    compliance_id: "CMP005",
    supplier_id: "SUP0005",
    gst_compliant: false,
    iso9001: false,
    iso14001: false,
    audit_score: 48,
    violations: 6
  }
];

export const newsEvents: NewsEvent[] = [
  {
    news_id: "NEWS001",
    supplier_id: "SUP0001",
    title: "Factory Expansion",
    severity: "LOW",
    impact_score: 12,
    date: "2026-06-25"
  },
  {
    news_id: "NEWS002",
    supplier_id: "SUP0003",
    title: "Environmental Leak Fine",
    severity: "HIGH",
    impact_score: 75,
    date: "2026-07-02"
  },
  {
    news_id: "NEWS003",
    supplier_id: "SUP0005",
    title: "Severe Raw Material Shortage",
    severity: "CRITICAL",
    impact_score: 88,
    date: "2026-07-03"
  }
];

export const complaints: Complaint[] = [
  {
    complaint_id: "C001",
    supplier_id: "SUP0001",
    type: "Late Delivery",
    severity: "Medium",
    resolved: true
  },
  {
    complaint_id: "C002",
    supplier_id: "SUP0003",
    type: "Defective Batches",
    severity: "High",
    resolved: false
  },
  {
    complaint_id: "C003",
    supplier_id: "SUP0005",
    type: "Breach of SLA",
    severity: "Critical",
    resolved: false
  }
];

export const aiPredictions: Record<string, AIPrediction> = {
  "SUP0001": {
    supplier_id: "SUP0001",
    trust_score: 91,
    risk_level: "LOW",
    failure_probability: 0.08,
    delivery_delay_prediction: 2,
    prediction_confidence: 0.94,
    predicted_failure_months: 24
  },
  "SUP0002": {
    supplier_id: "SUP0002",
    trust_score: 78,
    risk_level: "MEDIUM",
    failure_probability: 0.22,
    delivery_delay_prediction: 4,
    prediction_confidence: 0.88,
    predicted_failure_months: 18
  },
  "SUP0003": {
    supplier_id: "SUP0003",
    trust_score: 54,
    risk_level: "HIGH",
    failure_probability: 0.58,
    delivery_delay_prediction: 9,
    prediction_confidence: 0.85,
    predicted_failure_months: 6
  },
  "SUP0004": {
    supplier_id: "SUP0004",
    trust_score: 95,
    risk_level: "LOW",
    failure_probability: 0.03,
    delivery_delay_prediction: 0,
    prediction_confidence: 0.97,
    predicted_failure_months: 36
  },
  "SUP0005": {
    supplier_id: "SUP0005",
    trust_score: 35,
    risk_level: "CRITICAL",
    failure_probability: 0.82,
    delivery_delay_prediction: 15,
    prediction_confidence: 0.91,
    predicted_failure_months: 2
  }
};

export const explainableAI: Record<string, ExplainableAI> = {
  "SUP0001": {
    supplier_id: "SUP0001",
    top_factors: [
      "Revenue increasing",
      "Excellent delivery history",
      "Low complaint rate",
      "Healthy cash flow"
    ]
  },
  "SUP0002": {
    supplier_id: "SUP0002",
    top_factors: [
      "High employee headcount",
      "Stable compliance audits",
      "Moderate defect rates",
      "Occasional shipping delays in Hsinchu port"
    ]
  },
  "SUP0003": {
    supplier_id: "SUP0003",
    top_factors: [
      "Declining current ratio (1.05)",
      "High environmental news risk",
      "Spike in product defect rate (6.8%)",
      "Active unresolved compliance complaints"
    ]
  },
  "SUP0005": {
    supplier_id: "SUP0005",
    top_factors: [
      "Negative working capital (-$350k)",
      "Extremely high defect rate (12.5%)",
      "Critical news alerts regarding lithium supply chain shortages",
      "Active SLA violation complaints"
    ]
  }
};

export const recommendations: Record<string, Recommendation> = {
  "SUP0001": {
    supplier_id: "SUP0001",
    recommendation: "Continue strategic partnership.",
    priority: "Low"
  },
  "SUP0002": {
    supplier_id: "SUP0002",
    recommendation: "Monitor shipping buffer periods; schedule secondary source audits.",
    priority: "Medium"
  },
  "SUP0003": {
    supplier_id: "SUP0003",
    recommendation: "Reduce dependency. Onboard alternative Tier-2 chemical manufacturers.",
    priority: "High"
  },
  "SUP0005": {
    supplier_id: "SUP0005",
    recommendation: "IMMEDIATE MITIGATION REQUIRED: Activate backup battery contracts, freeze additional orders.",
    priority: "Critical"
  }
};

export const riskTimelines: Record<string, RiskTimelineItem[]> = {
  "SUP0001": [
    { month: "Jan", trust_score: 94 },
    { month: "Feb", trust_score: 92 },
    { month: "Mar", trust_score: 89 },
    { month: "Apr", trust_score: 91 },
    { month: "May", trust_score: 90 },
    { month: "Jun", trust_score: 91 }
  ],
  "SUP0002": [
    { month: "Jan", trust_score: 85 },
    { month: "Feb", trust_score: 84 },
    { month: "Mar", trust_score: 81 },
    { month: "Apr", trust_score: 79 },
    { month: "May", trust_score: 78 },
    { month: "Jun", trust_score: 78 }
  ],
  "SUP0003": [
    { month: "Jan", trust_score: 70 },
    { month: "Feb", trust_score: 65 },
    { month: "Mar", trust_score: 62 },
    { month: "Apr", trust_score: 58 },
    { month: "May", trust_score: 55 },
    { month: "Jun", trust_score: 54 }
  ],
  "SUP0005": [
    { month: "Jan", trust_score: 60 },
    { month: "Feb", trust_score: 55 },
    { month: "Mar", trust_score: 48 },
    { month: "Apr", trust_score: 41 },
    { month: "May", trust_score: 38 },
    { month: "Jun", trust_score: 35 }
  ]
};

export const dashboardSummary: DashboardSummary = {
  total_suppliers: 5000,
  high_risk: 142,
  critical: 18,
  average_trust_score: 83,
  average_delivery: 94,
  monthly_procurement: 380000000
};

export const alerts: Alert[] = [
  {
    alert_id: "AL001",
    supplier_id: "SUP0005",
    title: "Critical Trust Score Drop",
    message: "Apex Battery Technologies trust score collapsed below 40 threshold.",
    severity: "CRITICAL",
    time: "2026-07-03T14:25:00Z"
  },
  {
    alert_id: "AL002",
    supplier_id: "SUP0003",
    title: "Environmental Liability Alert",
    message: "ChemFlow Solutions fined for local manufacturing leak in Ludwigshafen.",
    severity: "HIGH",
    time: "2026-07-02T09:15:00Z"
  },
  {
    alert_id: "AL003",
    supplier_id: "SUP0005",
    title: "Delivery Delay Warning",
    message: "Critical battery materials delayed over 15 days in Shenzhen port.",
    severity: "CRITICAL",
    time: "2026-06-27T11:40:00Z"
  },
  {
    alert_id: "AL004",
    supplier_id: "SUP0002",
    title: "Slight Defect Rate Elevation",
    message: "ByteTech Semiconductor inspection samples indicated minor visual defects.",
    severity: "MEDIUM",
    time: "2026-06-20T16:30:00Z"
  }
];
