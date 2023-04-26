from app.models import db, environment, SCHEMA
from app.models.channel import Channel
from sqlalchemy.sql import text


def seed_channels():
    channels = [

    # Server 1 (App Academy)
    Channel(name='General Discussion', server_id=1),
    Channel(name='Random',server_id=1),
    Channel(name='Announcements', server_id=1 ),

    # Server 2 (PixelPal Devs)
    Channel(name='General',server_id=2),
    Channel(name='Help Channel',server_id=2),
    Channel(name='Movie Discussions',server_id=2),

    # Maplestory Channels
    Channel(name='General', server_id=3),
    Channel(name='Boss Drop Rates', server_id=3),

    # Fortnite Channels
    Channel(name='General', server_id=4),
    Channel(name='Squads', server_id=4),

    # World of Warcraft Channels
    Channel(name='General', server_id=5),
    Channel(name='Level Boosting', server_id=5),

    # Ducklings Channels
    Channel(name='General', server_id=6),
    Channel(name='Guild Activities', server_id=6),

    # Valorant Channels
    Channel(name='General', server_id=7),
    Channel(name='Teams', server_id=7),

    # NYU Channels
    Channel(name='General', server_id=8),
    Channel(name='Announcements', server_id=8),
    Channel(name='Homework', server_id=8),

    # Python Channels
    Channel(name='General', server_id=9),
    Channel(name='New Releases', server_id=9),

    # Leetcode Channels
    Channel(name="General", server_id=10),
    Channel(name="Data Structures", server_id=10),

    # Brown Uni Channels
    Channel(name='General', server_id=11),
    Channel(name='Homework', server_id=11),

    # Bloomberg Channels
    Channel(name='General', server_id=12),
    Channel(name='Job Board', server_id=12),

    # Google Channels
    Channel(name='General', server_id=13),
    Channel(name='Job Board', server_id=13),

    # TikTok Channels
    Channel(name='General', server_id=14),
    Channel(name='Viral Videos', server_id=14),

    # Robinhood Channels
    Channel(name='General', server_id=15),
    Channel(name='Investing', server_id=15),


    ]

    db.session.add_all(channels)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the messages table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channels"))

    db.session.commit()
