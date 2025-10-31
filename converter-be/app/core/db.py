from pymongo import MongoClient
from app.core.config import settings


client = MongoClient(settings.MONGO_URL)
users_db = client[settings.MONGO_DB_USERS]