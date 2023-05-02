import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { addServerMember, getServer } from "../../store/server";
import { getUserFriends } from "../../store/friends";
import "./ServerCreate.css";

function ServerMemberAdd({ server }) {

	const members = server.members;
	const currentUser = useSelector(state => state.session.user);
	const friends = useSelector(state => state.friends.userFriends)
	const { closeModal } = useModal();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUserFriends(currentUser.id))
	}, [dispatch, currentUser])


	if (!friends || !currentUser) {
		return (
			<div className='loading-animation'>
				<div className="center">
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
				</div>
			</div>
		)
	}

	const isMember = (friend) => {
		for (let member of members) {
			if (friend.id === member.id) return true;
		}
		return false;
	}

	const handleAdd = async (friend) => {

		console.log(friend)
		await dispatch(addServerMember(server.id, friend.user.username))
			.then(() => {
				dispatch(getServer(server.id));
				closeModal();
			})
	}

	return (
		<div className='create-server-modal'>
			<div className='create-server-modal-content'>
				<h1 className='create-server-header'>Add a Friend to {server.name}</h1>
				{friends.map(friend => (
					<>
						{!isMember(friend.user) && (
							<div onClick={() => handleAdd(friend)} className='friendslist-user-container' key={`member${friend.user.id}`}>
								<div className='friendslist-pic-username'>
									<div className="div-img">
										<img className='friendslist-profile-image' src={friend.user.prof_pic} alt='profile_pic_user' />
									</div>
									<div className='friendslist-username'>
										<span>{friend.user.username.split("#")[0]} </span>
									</div>
									<div className='friendslist-tag'>
										<span>#{friend.user.username.split("#")[1]} </span>
									</div>
								</div>
							</div>
						)}
					</>
				))}
			</div >
		</div >
	);
}

export default ServerMemberAdd;
