# config.py
# Shared configuration parameters for data generation

NUMBER_OF_SUPPLIERS = 200  # Default to 200 for fast high-fidelity prototype, configurable
YEARS = 5
MONTHS = 60
SEED = 42

INDUSTRIES = [
    {"name": "Automotive", "probability": 0.20},
    {"name": "Semiconductor", "probability": 0.18},
    {"name": "Steel", "probability": 0.12},
    {"name": "Chemical", "probability": 0.10},
    {"name": "Battery", "probability": 0.10},
    {"name": "Logistics", "probability": 0.10},
    {"name": "Packaging", "probability": 0.08},
    {"name": "Textile", "probability": 0.07},
    {"name": "Pharmaceutical", "probability": 0.05}
]

COUNTRIES = [
    {"name": "India", "probability": 0.35},
    {"name": "China", "probability": 0.20},
    {"name": "Germany", "probability": 0.10},
    {"name": "Japan", "probability": 0.10},
    {"name": "USA", "probability": 0.10},
    {"name": "South Korea", "probability": 0.08},
    {"name": "Vietnam", "probability": 0.07}
]

SUPPLIER_PROFILES = [
    {"name": "Premium", "probability": 0.10},
    {"name": "Growing", "probability": 0.20},
    {"name": "Stable", "probability": 0.35},
    {"name": "Declining", "probability": 0.15},
    {"name": "High Risk", "probability": 0.10},
    {"name": "New", "probability": 0.10}
]

PRODUCT_CATEGORIES = [
    "Raw Materials",
    "Electronic Components",
    "Mechanical Parts",
    "Chemical Agent",
    "Packaging Supplies",
    "Logistics Services"
]

SUPPLIER_PERSONAS = [
    "Enterprise Leader",
    "Fast Growing Startup",
    "Seasonal Supplier",
    "Innovation Driven",
    "Cost Efficient",
    "Logistics Sensitive",
    "Financially Fragile",
    "Operationally Weak",
    "Quality Focused",
    "Customer Centric",
    "Compliance Champion",
    "Recovering Supplier",
    "Market Leader",
    "Crisis Prone",
    "Legacy Manufacturer"
]

PERSONA_COMPATIBILITY = {
    "Premium": [
        ("Enterprise Leader", 0.30),
        ("Quality Focused", 0.20),
        ("Innovation Driven", 0.15),
        ("Customer Centric", 0.15),
        ("Compliance Champion", 0.10),
        ("Market Leader", 0.10)
    ],
    "Growing": [
        ("Fast Growing Startup", 0.35),
        ("Innovation Driven", 0.20),
        ("Cost Efficient", 0.15),
        ("Customer Centric", 0.15),
        ("Recovering Supplier", 0.15)
    ],
    "Stable": [
        ("Legacy Manufacturer", 0.25),
        ("Cost Efficient", 0.20),
        ("Logistics Sensitive", 0.20),
        ("Customer Centric", 0.20),
        ("Compliance Champion", 0.15)
    ],
    "Declining": [
        ("Financially Fragile", 0.40),
        ("Operationally Weak", 0.30),
        ("Legacy Manufacturer", 0.20),
        ("Crisis Prone", 0.10)
    ],
    "High Risk": [
        ("Financially Fragile", 0.45),
        ("Operationally Weak", 0.35),
        ("Crisis Prone", 0.20)
    ],
    "New": [
        ("Fast Growing Startup", 0.50),
        ("Innovation Driven", 0.30),
        ("Logistics Sensitive", 0.20)
    ]
}

SEASONAL_MULTIPLIERS = {
    "Automotive": [1.0, 0.95, 1.05, 1.1, 1.0, 0.9, 0.95, 1.0, 1.05, 1.15, 1.2, 1.1],
    "Semiconductor": [1.05, 1.1, 1.0, 0.95, 0.9, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.1],
    "Steel": [0.95, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.9, 0.95, 1.0, 1.05, 1.0],
    "Chemical": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    "Battery": [1.0, 1.05, 1.1, 1.05, 1.0, 0.95, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1],
    "Logistics": [1.1, 0.9, 1.0, 1.0, 1.05, 1.0, 0.95, 1.0, 1.1, 1.2, 1.25, 1.15],
    "Packaging": [1.0, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.05, 1.1, 1.15, 1.2, 1.1],
    "Textile": [0.9, 0.9, 1.0, 1.1, 1.15, 1.0, 0.9, 0.95, 1.05, 1.2, 1.25, 1.1],
    "Pharmaceutical": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
}
