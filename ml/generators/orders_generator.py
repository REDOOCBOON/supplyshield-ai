# orders_generator.py
import random
from ml.config import config

def generate_orders(supplier, financials_history):
    supplier_id = supplier["supplier_id"]
    category = random.choice(config.PRODUCT_CATEGORIES)
    
    orders = []
    
    # We generate orders matching the monthly revenue roughly
    for idx, fin in enumerate(financials_history):
        month_idx = idx + 1
        order_id = f"ORD_{supplier_id}_{month_idx:02d}"
        
        # Order value is correlated with monthly revenue
        order_value = fin["revenue"] * random.uniform(0.7, 0.9)
        quantity = int(order_value / random.uniform(10, 200))
        
        # Decide status
        status = "Delivered" if month_idx < 60 else random.choice(["Delivered", "In Transit", "Delayed"])
        
        orders.append({
            "order_id": order_id,
            "supplier_id": supplier_id,
            "order_value": round(order_value, 2),
            "quantity": quantity,
            "category": category,
            "status": status,
            "month": fin["month"]
        })
        
    return orders
