from app.models import db, User, Server, environment, SCHEMA
from sqlalchemy.sql import text
from app.models import User
from random import randint, sample



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
            server_picture="https://e7.pngegg.com/pngimages/240/77/png-clipart-maplestory-mushroom-music-tutor-sight-reading-mushrooms-maple-hat.png"
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
            server_picture='https://e7.pngegg.com/pngimages/405/172/png-clipart-bloomberg-terminal-bloomberg-markets-bloomberg-television-bloomberg-businessweek-others-miscellaneous-purple.png'
        ),

        Server(
            owner_id=5,
            name='Google',
            server_picture='https://blog.hubspot.com/hubfs/image8-2.jpg'
        ),

        Server(
            owner_id=4,
            name='TikTok',
            server_picture='https://static.vecteezy.com/system/resources/previews/006/057/996/original/tiktok-logo-on-transparent-background-free-vector.jpg'
        ),

        Server(
            owner_id=2,
            name='Robinhood',
            server_picture='https://upload.wikimedia.org/wikipedia/commons/b/b9/Robinhood_Logo.png'
        )

    ]

    users = User.query.all()

    for server in servers:
        num_members = randint(20, 108)
        members = sample(users, num_members)
        server.members.extend(members)


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
