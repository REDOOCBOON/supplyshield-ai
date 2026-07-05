# trust_score.py

def calculate_trust_score(financial, delivery, quality, compliance, external, sentiment):
    score = (
        financial * 0.30 +
        delivery * 0.25 +
        quality * 0.20 +
        compliance * 0.10 +
        external * 0.10 +
        sentiment * 0.05
    )
    return int(round(max(0, min(100, score))))

def get_risk_level(trust_score):
    if trust_score >= 90: return "LOW"
    elif trust_score >= 75: return "LOW"
    elif trust_score >= 60: return "MEDIUM"
    elif trust_score >= 40: return "HIGH"
    else: return "CRITICAL"

def calculate_failure_probability(trust_score, debt_ratio, cash_flow):
    base_prob = (100 - trust_score) / 100
    
    # Adjustments
    if cash_flow < 0:
        base_prob += 0.15
    if debt_ratio > 0.8:
        base_prob += 0.10
        
    return round(max(0.01, min(0.99, base_prob)), 2)
