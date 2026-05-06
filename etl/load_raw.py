import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Read DB URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL)

# Load CSV
df = pd.read_csv("../data/raw/SuperStoreOrders - SuperStoreOrders.csv")

# Push to PostgreSQL
df.to_sql(
    "orders",
    engine,
    schema="raw",
    if_exists="append",
    index=False
)

print("Loaded into raw.orders")