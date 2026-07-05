# financial_score.py

def calculate_revenue_growth_score(growth_rate):
    # growth_rate is yearly or monthly. Let's assume annual equivalent.
    # monthly growth rate converted to annual: (1 + r)^12 - 1
    # For simplified mapping:
    g = growth_rate * 100
    if g >= 15: return 100
    elif g >= 10: return 90
    elif g >= 5: return 80
    elif g >= 0: return 70
    elif g >= -5: return 55
    elif g >= -10: return 40
    elif g >= -20: return 20
    else: return 10

def calculate_cash_flow_score(cash_flow, revenue):
    if revenue == 0: return 0
    ratio = cash_flow / revenue
    if ratio > 0.15: return 98
    elif ratio > 0.05: return 88
    elif ratio >= 0: return 75
    elif ratio > -0.10: return 50
    else: return 20

def calculate_debt_score(debt_ratio):
    if debt_ratio < 0.25: return 100
    elif debt_ratio <= 0.40: return 85
    elif debt_ratio <= 0.60: return 70
    elif debt_ratio <= 0.80: return 55
    elif debt_ratio <= 1.0: return 40
    else: return 20

def calculate_current_ratio_score(current_ratio):
    if current_ratio >= 2.0: return 100
    elif current_ratio >= 1.5: return 85
    elif current_ratio >= 1.2: return 70
    elif current_ratio >= 1.0: return 50
    else: return 20

def calculate_financial_score(record):
    # record contains revenue, expenses, cash_flow, profit_margin, current_ratio, debt_ratio, working_capital
    revenue = record["revenue"]
    cash_flow = record["cash_flow"]
    debt_ratio = record["debt_ratio"]
    current_ratio = record["current_ratio"]
    margin = record["profit_margin"]
    
    # We can infer monthly growth rate relative to baseline or calculate average
    # Since we need a score from metrics inside the record, let's treat the margin and ratios directly:
    rev_score = calculate_revenue_growth_score(margin) # use margin as proxy for growth direction
    cf_score = calculate_cash_flow_score(cash_flow, revenue)
    debt_score = calculate_debt_score(debt_ratio)
    curr_score = calculate_current_ratio_score(current_ratio)
    
    # Working capital score: positive vs negative
    wc_score = 90 if record["working_capital"] > 0 else 30
    
    # Margin score:
    margin_score = 100 if margin > 0.20 else 85 if margin > 0.10 else 70 if margin >= 0 else 40
    
    score = (
        rev_score * 0.20 +
        cf_score * 0.25 +
        margin_score * 0.15 +
        curr_score * 0.15 +
        wc_score * 0.10 +
        debt_score * 0.15
    )
    return round(max(0, min(100, score)), 1)
