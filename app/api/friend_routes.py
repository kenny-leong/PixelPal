from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db
from app.models.friend import Friend
from app.models.user import User

friend_routes = Blueprint('friends', __name__)

@friend_routes.route("/<int:id>", methods=['GET'])
@login_required
def get_all_friends(id):
    friends = Friend.query.filter(
        ((Friend.userId == id) | (Friend.friendId == id))
        & (Friend.status == 'accepted')
    ).all()

    return jsonify({'friends': [friend.to_dict() for friend in friends]})


@friend_routes.route("/users/<int:id>", methods=['GET'])
@login_required
def get_user_friends(id):
    friends = Friend.query.filter(
        ((Friend.userId == id) | (Friend.friendId == id)) & (Friend.status == 'accepted')
    ).all()

    friends_list = []
    for friend in friends:
        friend_dict = friend.to_dict()
        if friend_dict['userId'] != id:
            friend_dict['user'] = User.query.get(friend_dict['userId']).to_dict()
        elif friend_dict['friendId'] != id:
            friend_dict['user'] = User.query.get(friend_dict['friendId']).to_dict()
        friends_list.append(friend_dict)

    return jsonify({'friends': friends_list})
