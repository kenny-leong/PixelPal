from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import randint



# Adds a demo user, you can add other users here if you want
def seed_users():

    fake = Faker()


    users = [
    User(
        username='Demo#1234', email='demo@aa.io', password='password', prof_pic='https://w0.peakpx.com/wallpaper/199/848/HD-wallpaper-warrior-girl-trail-warrior-fantasy-girls-artist-artwork-digital-art-deviantart-sword.jpg'), #1
    User(
        username='Marnie#2345', email='marnie@aa.io', password='password', prof_pic='https://www.wallpaperflare.com/static/906/424/953/fantasy-art-swordsman-painting-fantasy-wallpaper.jpg'), #2
    User(
        username='Bobbie#2121', email='bobbie@aa.io', password='password', prof_pic='https://c4.wallpaperflare.com/wallpaper/80/190/554/fantasy-art-the-wheel-of-time-perrin-battle-wallpaper-preview.jpg'), #3
    User(
        username='akim#7070', email='aileenkim@gmail.com', password='password', prof_pic='https://p4.wallpaperbetter.com/wallpaper/210/251/600/guweiz-samurai-artwork-warrior-drawing-hd-wallpaper-preview.jpg'), #4
    User(
        username='zmarediya#0206', email='zainebmarediya@gmail.com', password='password', prof_pic='https://wallpapercave.com/wp/wp8716330.jpg'),#5
    User(
        username='rgoggin#0001', email='ryangoggin@gmail.com', password='password', prof_pic='https://cdn.pixabay.com/photo/2023/03/19/04/57/viking-7861902_1280.jpg'), #6
    User(
        username='kleong#0666', email='kennyleong@gmail.com', password='password', prof_pic='https://www.wallpaperup.com/uploads/wallpapers/2015/04/19/666548/e2a43730ebc8ef3b1d6ed9198f6ed678-700.jpg'), #7
    User(
        username='masano#0410', email='masano@gmail.com', password='password', prof_pic='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMY0U-qNu5EwDECombwDIZgPFQOIdw__ypXg&usqp=CAU', #8
    ),
    User(
        username='apan#1124', email='apan@gmail.com', password='password', prof_pic='https://img4.goodfon.com/wallpaper/nbig/c/28/fentezi-art-iaponiia-drakon-paren-oruzhie.jpg', #9
    ),
    User(
        username='poseidon#5555', email='poseidon@gmail.com', password='password', prof_pic='https://cdnb.artstation.com/p/assets/images/images/004/145/941/large/chong-wen-wang-20130830-jybart-fl-03.jpg?1480779986', #10
    )

    ]

    for i in range(100):
        username = f"{fake.user_name()}#{randint(1000, 9999)}"
        while User.query.filter_by(username=username).first() is not None:
            username = f"{fake.user_name()}#{randint(1000, 9999)}"
        email = fake.email()
        while User.query.filter_by(email=email).first() is not None:
            email = fake.email()
        password = 'password'
        users.append(User(username=username, email=email, password=password))



    db.session.add_all(users)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
