import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from bson import ObjectId

app = FastAPI()

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
