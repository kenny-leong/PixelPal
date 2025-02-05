from .db import db, environment, SCHEMA, add_prefix_for_prod

class Friend(db.Model):
    __tablename__ = 'friends'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    friendId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')


    def to_dict(self):
        return {
            'id': self.id,
            'friendId': self.friendId,
            'userId': self.userId,
            'status': self.status
        }
