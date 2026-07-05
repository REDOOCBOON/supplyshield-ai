# financial_generator.py
import random
from ml.config import config

def generate_financial_history(supplier, months=60):
    profile = supplier["profile"]
    persona = supplier.get("persona", "Legacy Manufacturer")
    industry = supplier.get("industry", "Automotive")
    supplier_id = supplier["supplier_id"]
    
    # Establish base revenue based on profile
    if profile == "Premium":
        base_revenue = random.uniform(10_000_000, 25_000_000)
        growth_rate = random.uniform(0.006, 0.014)  # ~8% to 18% annual
        base_debt_ratio = random.uniform(0.1, 0.4)
        base_current_ratio = random.uniform(1.8, 3.0)
    elif profile == "Growing":
        base_revenue = random.uniform(3_000_000, 8_000_000)
        growth_rate = random.uniform(0.012, 0.025)
        base_debt_ratio = random.uniform(0.3, 0.6)
        base_current_ratio = random.uniform(1.3, 2.0)
    elif profile == "Stable":
        base_revenue = random.uniform(4_000_000, 12_000_000)
        growth_rate = random.uniform(-0.002, 0.002)
        base_debt_ratio = random.uniform(0.2, 0.5)
        base_current_ratio = random.uniform(1.5, 2.2)
    elif profile == "Declining":
        base_revenue = random.uniform(3_000_000, 10_000_000)
        growth_rate = random.uniform(-0.015, -0.005)
        base_debt_ratio = random.uniform(0.5, 0.8)
        base_current_ratio = random.uniform(1.0, 1.4)
    elif profile == "High Risk":
        base_revenue = random.uniform(1_000_000, 5_000_000)
        growth_rate = random.uniform(-0.03, -0.015)
        base_debt_ratio = random.uniform(0.7, 1.2)
        base_current_ratio = random.uniform(0.6, 1.1)
    else:  # New
        base_revenue = random.uniform(500_000, 2_000_000)
        growth_rate = random.uniform(0.01, 0.04)
        base_debt_ratio = random.uniform(0.4, 0.7)
        base_current_ratio = random.uniform(1.1, 1.8)
        
    # Persona base adjustments
    if persona == "Market Leader":
        base_revenue *= 2.5
        growth_rate = max(0.005, growth_rate)
    elif persona == "Fast Growing Startup":
        base_revenue *= 0.4
        growth_rate = max(0.02, growth_rate * 1.5)
        base_debt_ratio = min(1.5, base_debt_ratio * 1.3)
    elif persona == "Financially Fragile":
        base_debt_ratio = min(1.8, base_debt_ratio * 1.3)
        base_current_ratio = max(0.5, base_current_ratio * 0.75)
    elif persona == "Cost Efficient":
        base_debt_ratio = max(0.05, base_debt_ratio * 0.8)
        base_current_ratio = min(4.0, base_current_ratio * 1.2)
        
    history = []
    
    current_revenue = base_revenue
    current_debt_ratio = base_debt_ratio
    current_current_ratio = base_current_ratio
    
    for m in range(1, months + 1):
        month_label = f"Month_{m:02d}"
        
        # Apply seasonality multiplier
        seasonal_multiplier = config.SEASONAL_MULTIPLIERS.get(industry, [1.0]*12)[(m-1)%12]
        if persona != "Seasonal Supplier":
            # standard noise for non-seasonal
            seasonal_multiplier = 1.0 + (seasonal_multiplier - 1.0) * 0.3
            
        # Apply trend + growth + monthly noise
        noise_limit = 0.07 if persona == "Crisis Prone" else 0.03
        revenue_noise = random.uniform(-noise_limit, noise_limit)
        
        # Calculate monthly target revenue with trend, seasonality, and noise
        current_revenue = max(50_000, base_revenue * ((1.0 + growth_rate) ** m) * seasonal_multiplier * (1.0 + revenue_noise))
        
        # Calculate expenses based on profit margin
        if profile == "Premium":
            profit_margin = random.uniform(0.15, 0.30)
        elif profile == "Growing":
            profit_margin = random.uniform(0.08, 0.20)
        elif profile == "Stable":
            profit_margin = random.uniform(0.05, 0.15)
        elif profile == "Declining":
            profit_margin = random.uniform(-0.05, 0.05)
        elif profile == "High Risk":
            profit_margin = random.uniform(-0.15, -0.02)
        else:  # New
            profit_margin = random.uniform(-0.10, 0.10)
            
        # Persona margin adjustments
        if persona == "Cost Efficient":
            profit_margin = min(0.35, profit_margin + random.uniform(0.05, 0.10))
        elif persona == "Innovation Driven":
            profit_margin = max(0.02, profit_margin - random.uniform(0.02, 0.05))
            
        expenses = current_revenue * (1.0 - profit_margin)
        
        # Cash Flow correlation with margin & revenue, adjusted by persona
        cf_multiplier = random.uniform(0.8, 1.2)
        if persona == "Financially Fragile":
            cf_multiplier = random.uniform(0.5, 0.8)
        elif persona == "Cost Efficient":
            cf_multiplier = random.uniform(1.0, 1.3)
            
        cash_flow = (current_revenue - expenses) * cf_multiplier
        
        # Adjust debt and current ratio gradually
        current_debt_ratio = max(0.01, min(2.0, current_debt_ratio * (1 - growth_rate * 0.5 + random.uniform(-0.02, 0.02))))
        current_current_ratio = max(0.1, min(5.0, current_current_ratio * (1 + growth_rate * 0.3 + random.uniform(-0.02, 0.02))))
        
        # Working capital is a function of current revenue & current ratio
        working_capital = (current_revenue / 12) * (current_current_ratio - 1.0)
        
        history.append({
            "record_id": f"REC_{supplier_id}_{m:02d}",
            "supplier_id": supplier_id,
            "month": month_label,
            "revenue": round(current_revenue, 2),
            "expenses": round(expenses, 2),
            "cash_flow": round(cash_flow, 2),
            "profit_margin": round(profit_margin, 4),
            "current_ratio": round(current_current_ratio, 2),
            "debt_ratio": round(current_debt_ratio, 2),
            "working_capital": round(working_capital, 2)
        })
        
    return history
