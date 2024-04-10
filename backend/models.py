from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from DBInit import db

class User(db.Model):
    __tablename__ = 'User'
    userID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstName_en = db.Column(db.String(50), nullable=True)
    lastName_en = db.Column(db.String(50), nullable=True)
    firstName_su = db.Column(db.String(50), nullable=True)
    lastName_su = db.Column(db.String(50), nullable=True)
    firstName_tel = db.Column(db.String(200), nullable=True)
    lastName_tel = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

class Degree(db.Model):
    __tablename__ = 'Degree'
    degreeID = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.Integer, nullable=False)
    userID = db.Column(db.Integer, db.ForeignKey('User.userID'))

class AnswerSheet(db.Model):
    __tablename__ = 'AnswerSheet'
    answers = db.Column(String, nullable=False)
    answerID = db.Column(db.Integer, primary_key=True,autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('User.userID'))