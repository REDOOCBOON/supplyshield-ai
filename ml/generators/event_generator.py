# event_generator.py
import random
from ml.config import config
from ml.generators.delivery_generator import get_date_for_month

def generate_external_events(supplier, months=60):
    profile = supplier["profile"]
    persona = supplier.get("persona", "Legacy Manufacturer")
    supplier_id = supplier["supplier_id"]
    
    events = []
    
    # Event probability based on profile
    if profile == "Premium":
        prob = 0.01
    elif profile == "Growing":
        prob = 0.03
    elif profile == "Stable":
        prob = 0.03
    elif profile == "Declining":
        prob = 0.08
    elif profile == "High Risk":
        prob = 0.12
    else:  # New
        prob = 0.05
        
    # Persona event adjustments
    if persona == "Crisis Prone":
        prob = min(0.30, prob * 2.5 + 0.05)
    elif persona in ["Enterprise Leader", "Compliance Champion"]:
        prob = max(0.005, prob * 0.4)
        
    event_templates = [
        {"title": "Factory Fire Incidents", "severity": "CRITICAL", "impact_score": 30},
        {"title": "Monsoon Flood Logistics Interruption", "severity": "HIGH", "impact_score": 25},
        {"title": "Labor Union Strike", "severity": "HIGH", "impact_score": 20},
        {"title": "Regional Port Congestion delays", "severity": "MEDIUM", "impact_score": 10},
        {"title": "Raw Material Supply Bottlenecks", "severity": "HIGH", "impact_score": 18},
        {"title": "Local Power Grid Failures", "severity": "MEDIUM", "impact_score": 12},
        {"title": "IT Operations Cyber Security Incident", "severity": "HIGH", "impact_score": 20},
        {"title": "Export Tariff Policy Shifts", "severity": "MEDIUM", "impact_score": 15}
    ]
    
    for m in range(1, months + 1):
        if random.random() < prob:
            tmpl = random.choice(event_templates)
            evt_id = f"EVT_{supplier_id}_{m:02d}"
            evt_date = get_date_for_month(m, day=random.randint(5, 25))
            
            events.append({
                "news_id": evt_id,
                "supplier_id": supplier_id,
                "title": f"{tmpl['title']} near operations hub",
                "severity": tmpl["severity"],
                "impact_score": tmpl["impact_score"],
                "date": evt_date,
                "month": f"Month_{m:02d}"
            })
            
    return events
