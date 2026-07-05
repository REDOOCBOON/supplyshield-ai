-- SQL Schema for SupplyShield AI

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id VARCHAR(50) PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    years_in_business INT NOT NULL,
    employees INT NOT NULL,
    tier VARCHAR(50) NOT NULL,
    profile VARCHAR(100) NOT NULL,
    persona VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    trust_score INT,
    risk_level VARCHAR(50),
    financial_score INT,
    delivery_score INT,
    quality_score INT,
    compliance_score INT,
    news_risk_score INT,
    failure_probability REAL,
    confidence REAL,
    last_updated VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS financial_history (
    record_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    month VARCHAR(50) NOT NULL,
    revenue REAL NOT NULL,
    expenses REAL NOT NULL,
    cash_flow REAL NOT NULL,
    profit_margin REAL NOT NULL,
    current_ratio REAL NOT NULL,
    debt_ratio REAL NOT NULL,
    working_capital REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    order_value REAL NOT NULL,
    quantity INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    month VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS delivery_history (
    delivery_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    order_id VARCHAR(50) REFERENCES orders(order_id) ON DELETE CASCADE,
    expected_date VARCHAR(50) NOT NULL,
    actual_date VARCHAR(50) NOT NULL,
    delay_days INT NOT NULL,
    on_time BOOLEAN NOT NULL,
    delivery_score REAL NOT NULL,
    month VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS quality_history (
    quality_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    month VARCHAR(50) NOT NULL,
    inspection_score REAL NOT NULL,
    defect_rate REAL NOT NULL,
    return_rate REAL NOT NULL,
    complaints INT NOT NULL
);

CREATE TABLE IF NOT EXISTS complaints (
    complaint_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    resolved BOOLEAN NOT NULL,
    month VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS compliance (
    compliance_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    month VARCHAR(50) NOT NULL,
    gst_compliant BOOLEAN NOT NULL,
    iso9001 BOOLEAN NOT NULL,
    iso14001 BOOLEAN NOT NULL,
    audit_score REAL NOT NULL,
    violations INT NOT NULL
);

CREATE TABLE IF NOT EXISTS external_events (
    news_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    impact_score INT NOT NULL,
    date VARCHAR(50) NOT NULL,
    month VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS predictions (
    supplier_id VARCHAR(50) PRIMARY KEY REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    trust_score INT NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    failure_probability REAL NOT NULL,
    delivery_delay_prediction REAL NOT NULL,
    prediction_confidence REAL NOT NULL,
    predicted_failure_months INT NOT NULL
);

CREATE TABLE IF NOT EXISTS recommendations (
    supplier_id VARCHAR(50) PRIMARY KEY REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_history_supplier ON financial_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_delivery_history_supplier ON delivery_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quality_history_supplier ON quality_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_complaints_supplier ON complaints(supplier_id);
CREATE INDEX IF NOT EXISTS idx_compliance_supplier ON compliance(supplier_id);
CREATE INDEX IF NOT EXISTS idx_external_events_supplier ON external_events(supplier_id);
