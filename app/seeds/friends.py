from app.models import db, environment, SCHEMA
from sqlalchemy.sql import text
from app.models.friend import Friend

def seed_friends():
    friends = [

    #Demo Friends 1
    Friend(userId=1, friendId=2, status='accepted'),
    Friend(userId=1, friendId=3, status='accepted'),
    Friend(userId=1, friendId=4, status='accepted'),
    Friend(userId=1, friendId=5, status='accepted'),
    Friend(userId=1, friendId=6, status='accepted'),
    Friend(userId=1, friendId=7, status='accepted'),
    Friend(userId=1, friendId=8, status='accepted'),
    Friend(userId=1, friendId=9, status='accepted'),
    Friend(userId=1, friendId=10, status='accepted'),

    #Marnie Friends 2
    Friend(userId=2, friendId=3, status='accepted'),
    Friend(userId=2, friendId=4, status='accepted'),
    Friend(userId=2, friendId=5, status='accepted'),
    Friend(userId=2, friendId=6, status='accepted'),
    Friend(userId=2, friendId=7, status='accepted'),

    #Bobbie Friends 3
    Friend(userId=3, friendId=4, status='accepted'),
    Friend(userId=3, friendId=5, status='accepted'),
    Friend(userId=3, friendId=6, status='accepted'),
    Friend(userId=3, friendId=7, status='accepted'),

    #AK Friends 4
    Friend(userId=4, friendId=5, status='accepted'),
    Friend(userId=4, friendId=6, status='accepted'),
    Friend(userId=4, friendId=7, status='accepted'),

    #ZM Friends 5
    Friend(userId=5, friendId=6, status='accepted'),
    Friend(userId=5, friendId=7, status='accepted'),

    #RG Friends 6
    Friend(userId=6, friendId=7, status='accepted'),

    #FRIEND REQUESTS
    Friend(userId=20, friendId=1, status='pending'),
    Friend(userId=21, friendId=1, status='pending'),
    Friend(userId=22, friendId=1, status='pending'),
    Friend(userId=23, friendId=1, status='pending'),
    Friend(userId=24, friendId=1, status='pending'),
    Friend(userId=25, friendId=1, status='pending'),
    Friend(userId=26, friendId=1, status='pending'),
    Friend(userId=27, friendId=1, status='pending'),
    ]

    db.session.add_all(friends)
    db.session.commit()

def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
