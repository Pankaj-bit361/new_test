import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

app = FastAPI()

# JWT Configuration
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-key-change-this-in-prod")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

# Helper Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Helper to format MongoDB docs
def format_doc(doc: dict) -> dict:
    if not doc:
        return doc
    doc["id"] = str(doc.pop("_id"))
    return doc

# Models
class Contact(BaseModel):
    name: str
    email: str
    company: str
    role: str
    status: str
    lastContacted: str = "Just now"

class Deal(BaseModel):
    name: str
    value: float
    stage: str
    probability: int
    company: str

@app.get("/api")
async def health_check():
    return {"status": "healthy", "message": "Nexus CRM API is running"}

@app.post("/api/auth/signup")
async def signup(user: UserSignup):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }
    result = await db.users.insert_one(new_user)
    token = create_access_token({"sub": user.email, "name": user.name})
    return {"token": token, "user": {"name": user.name, "email": user.email}}

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": db_user["email"], "name": db_user["name"]})
    return {"token": token, "user": {"name": db_user["name"], "email": db_user["email"]}}

@app.get("/api/stats")
async def get_stats():
    # In a real app, these would be calculated from the DB
    return {
        "totalRevenue": "$124,500",
        "revenueGrowth": "+14.5%",
        "activeDeals": 24,
        "newContacts": 142
    }

@app.get("/api/chart-data")
async def get_chart_data():
    return [
        {"name": "Jan", "revenue": 4000},
        {"name": "Feb", "revenue": 3000},
        {"name": "Mar", "revenue": 5000},
        {"name": "Apr", "revenue": 8000},
        {"name": "May", "revenue": 6000},
        {"name": "Jun", "revenue": 9000},
        {"name": "Jul", "revenue": 11000},
    ]

@app.get("/api/contacts")
async def get_contacts():
    contacts = await db.contacts.find().to_list(100)
    return [format_doc(c) for c in contacts]

@app.post("/api/contacts")
async def create_contact(contact: Contact):
    new_contact = contact.dict()
    result = await db.contacts.insert_one(new_contact)
    new_contact["id"] = str(result.inserted_id)
    return new_contact

@app.get("/api/deals")
async def get_deals():
    deals = await db.deals.find().to_list(100)
    return [format_doc(d) for d in deals]

@app.post("/api/deals")
async def create_deal(deal: Deal):
    new_deal = deal.dict()
    result = await db.deals.insert_one(new_deal)
    new_deal["id"] = str(result.inserted_id)
    return new_deal

# Seed data if empty
@app.on_event("startup")
async def seed_data():
    if await db.contacts.count_documents({}) == 0:
        from mock_data import mock_contacts, mock_deals
        await db.contacts.insert_many(mock_contacts)
        await db.deals.insert_many(mock_deals)
