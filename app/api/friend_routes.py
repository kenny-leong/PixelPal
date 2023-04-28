from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db
from app.models.friend import Friend
from app.models.user import User

friend_routes = Blueprint('friends', __name__)

# GET ALL FRIENDS OF A USER BY ID
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


# GET ALL FRIEND REQUESTS FOR CURRENT USER
@friend_routes.route("/requests", methods=['GET'])
@login_required
def get_friend_requests():
    current_user_id = current_user.id

    # Get all friend requests sent to the current user
    friend_requests = Friend.query.filter_by(friendId=current_user_id, status='pending').all()

    # Convert the friend requests to a dictionary
    friend_requests_list = []
    for friend_request in friend_requests:
        friend_request_dict = friend_request.to_dict()
        friend_request_dict['user'] = User.query.get(friend_request_dict['userId']).to_dict()
        friend_requests_list.append(friend_request_dict)

    return jsonify({'friend_requests': friend_requests_list})


# ADD A NEW FRIEND BY FRIEND ID (SEND A FRIEND REQUEST)
@friend_routes.route("/users/<int:friend_id>/add", methods=['POST'])
@login_required
def add_friend(friend_id):
    current_user_id = current_user.id

    # Check if a pending friendship request already exists between the users
    friendship = Friend.query.filter_by(userId=current_user_id, friendId=friend_id, status='pending').first()

    if friendship:
        return jsonify({'message': 'Friendship request already sent'})

    # Check if the friend already exists in the user's friend list
    friend_check = Friend.query.filter(
        ((Friend.userId == current_user_id) & (Friend.friendId == friend_id))
        | ((Friend.userId == friend_id) & (Friend.friendId == current_user_id) & (Friend.status == 'accepted'))
    ).first()

    if friend_check:
        return jsonify({'message': 'User is already a friend'})

    # Create a new friendship request
    new_friendship = Friend(userId=current_user_id, friendId=friend_id, status='pending')
    db.session.add(new_friendship)
    db.session.commit()

    return jsonify({'message': 'Friendship request sent'})


# BLOCK A USER
@friend_routes.route("/users/<int:friend_id>/block", methods=['POST'])
@login_required
def block_user(friend_id):
    current_user_id = current_user.id

    # Check if the friend exists in the user's friend list
    friendship = Friend.query.filter(
        ((Friend.userId == current_user_id) & (Friend.friendId == friend_id))
        | ((Friend.userId == friend_id) & (Friend.friendId == current_user_id))
    ).first()

    # If the friendship exists, update the status to "blocked"
    if friendship:
        friendship.status = 'blocked'
    # If the friendship doesn't exist, create a new friendship with status "blocked"
    else:
        new_friendship = Friend(userId=current_user_id, friendId=friend_id, status='blocked')
        db.session.add(new_friendship)

    db.session.commit()

    return jsonify({'message': 'User blocked'})


# REMOVE A FRIENDSHIP BY FRIEND ID
@friend_routes.route("/users/<int:friend_id>/remove", methods=['DELETE'])
@login_required
def remove_friend(friend_id):
    current_user_id = current_user.id

    # Check if the friend exists in the user's friend list
    friendship = Friend.query.filter(
        ((Friend.userId == current_user_id) & (Friend.friendId == friend_id))
        | ((Friend.userId == friend_id) & (Friend.friendId == current_user_id))
    ).first()

    if not friendship:
        return jsonify({'message': 'Friendship not found'})

    # Delete the friendship record
    db.session.delete(friendship)
    db.session.commit()

    return jsonify({'message': 'Friend removed'})
