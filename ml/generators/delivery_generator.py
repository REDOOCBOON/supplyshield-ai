# delivery_generator.py
import random
from datetime import datetime, timedelta

def get_date_for_month(month_num, day=15):
    # Month 1 is Jan 2021
    year = 2021 + (month_num - 1) // 12
    month = 1 + (month_num - 1) % 12
    return f"{year}-{month:02d}-{day:02d}"

def generate_delivery_history(supplier, orders):
    profile = supplier["profile"]
    persona = supplier.get("persona", "Legacy Manufacturer")
    supplier_id = supplier["supplier_id"]
    
    deliveries = []
    
    # Establish base delivery performance parameters
    if profile == "Premium":
        base_delay_prob = 0.02
        delay_range = (0, 2)
    elif profile == "Growing":
        base_delay_prob = 0.06
        delay_range = (0, 5)
    elif profile == "Stable":
        base_delay_prob = 0.08
        delay_range = (0, 6)
    elif profile == "Declining":
        base_delay_prob = 0.18
        delay_range = (2, 10)
    elif profile == "High Risk":
        base_delay_prob = 0.35
        delay_range = (3, 20)
    else:  # New
        base_delay_prob = 0.12
        delay_range = (1, 8)
        
    # Persona delivery adjustments
    if persona in ["Enterprise Leader", "Customer Centric"]:
        base_delay_prob = max(0.005, base_delay_prob * 0.2)
        delay_range = (0, min(1, delay_range[1]))
    elif persona in ["Logistics Sensitive", "Crisis Prone"]:
        base_delay_prob = min(0.60, base_delay_prob * 1.4)
        delay_range = (delay_range[0], delay_range[1] + 3)
    elif persona == "Operationally Weak":
        base_delay_prob = min(0.60, base_delay_prob * 1.6)
        delay_range = (max(2, delay_range[0] + 1), delay_range[1] + 5)
        
    for idx, order in enumerate(orders):
        month_idx = idx + 1
        delivery_id = f"DEL_{supplier_id}_{month_idx:02d}"
        
        # Expected date around 15th of the month
        expected_dt_str = get_date_for_month(month_idx, day=15)
        expected_dt = datetime.strptime(expected_dt_str, "%Y-%m-%d")
        
        # Determine delay
        is_delayed = random.random() < base_delay_prob
        if is_delayed:
            delay_days = random.randint(delay_range[0], delay_range[1])
        else:
            delay_days = 0
            
        actual_dt = expected_dt + timedelta(days=delay_days)
        on_time = delay_days == 0
        
        # Calculate individual delivery score (0-100)
        # 0 days -> 100, each day of delay subtracts 5 points, capped at 20
        delivery_score = max(20, 100 - delay_days * 5)
        
        deliveries.append({
            "delivery_id": delivery_id,
            "supplier_id": supplier_id,
            "order_id": order["order_id"],
            "expected_date": expected_dt_str,
            "actual_date": actual_dt.strftime("%Y-%m-%d"),
            "delay_days": delay_days,
            "on_time": on_time,
            "delivery_score": delivery_score,
            "month": order["month"]
        })
        
    return deliveries
