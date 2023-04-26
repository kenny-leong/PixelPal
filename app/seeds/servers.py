from app.models import db, User, Server, environment, SCHEMA
from sqlalchemy.sql import text
from app.models import User


# Adds a demo server, you can add other servers here if you want
def seed_servers():
    servers = [
        Server(
            owner_id=1,
            name="App Academy",
            server_picture='https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/603820afd31232aab368ea6f_New%20Red-logo-emblem.webp'
        ),

        Server(
            owner_id=4,
            name="PixelPal Devs",
            server_picture="https://i.etsystatic.com/isla/59fe03/54627963/isla_fullxfull.54627963_7qfexh6f.jpg?version=0"
        ),

        Server(
            owner_id=2,
            name="Maplestory",
            server_picture="https://static.wikia.nocookie.net/maplestory/images/0/0f/Mob_Guardian_Angel_Slime.png/revision/latest?cb=20210805090938"
        ),

        Server(
            owner_id=3,
            name="Fortnite",
            server_picture="https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png"
        ),

        Server(
            owner_id=1,
            name="World of Warcraft",
            server_picture="https://cdn.cdnlogo.com/logos/w/36/world-of-warcraft.svg"
        ),

        Server(
            owner_id=3,
            name="Ducklings",
            server_picture="https://art.pixilart.com/sr2cfb6008e221c.png"
        ),

        Server(
            owner_id=1,
            name="Valorant",
            server_picture="https://logos-download.com/wp-content/uploads/2021/01/Valorant_Logo.png"
        ),

        Server(
            owner_id=1,
            name="New York University",
            server_picture="https://yt3.ggpht.com/-RZYi5isxH_M/AAAAAAAAAAI/AAAAAAAAAAA/rmWpoe2qZzI/s900-c-k-no/photo.jpg"
        ),

        Server(
            owner_id=5,
            name="Python",
            server_picture="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png"
        ),

        Server(
            owner_id=3,
            name='Leetcode',
            server_picture='https://leetcode.com/static/images/LeetCode_logo_rvs.png'
        ),

        Server(
            owner_id=2,
            name='Brown University',
            server_picture='https://1000logos.net/wp-content/uploads/2022/05/Brown-University-Seal.png'
        ),

        Server(
            owner_id=3,
            name='Bloomberg',
            server_picture='https://play-lh.googleusercontent.com/_qTb7fdtj18tYn1AyKLX1-kGvhzgJctx9sHpxk95ktK0hn9ruGnkJZCRp39Asp1kG4A'
        ),

        Server(
            owner_id=5,
            name='Google',
            server_picture='https://blog.hubspot.com/hubfs/image8-2.jpg'
        ),

        Server(
            owner_id=4,
            name='TikTok',
            server_picture='https://1000logos.net/wp-content/uploads/2019/06/Tiktok_Logo.png'
        ),

        Server(
            owner_id=2,
            name='Robinhood',
            server_picture='https://upload.wikimedia.org/wikipedia/commons/b/b9/Robinhood_Logo.png'
        )

    ]

    users = User.query.all()


    # first_group = list(users) #demo bobbie marnie
    # second_group = list(users[0:3]) #demo bobbie marnie ak


    servers[0].members.extend(users)
    servers[1].members.extend(users)


    db.session.add_all(servers)
    db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.server RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM server")) #please note that server was put as singular in our model

    db.session.commit()
