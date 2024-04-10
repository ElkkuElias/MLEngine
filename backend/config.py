import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql://root:bakamoto@localhost:3306/project'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = "http://localhost:3000"
