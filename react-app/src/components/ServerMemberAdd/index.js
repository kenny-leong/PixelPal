import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { addServerMember, getServer, getServers } from "../../store/server";
import { getServerChannels } from "../../store/channels";
import { getUserFriends } from "../../store/friends";
import "./ServerCreate.css";

function ServerMemberAdd({ server }) {

	const members = server.members;
	const user = useSelector(state => state.session.user);
	const friends = useSelector(state => state.friends.userFriends)
	const { closeModal } = useModal();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUserFriends(user.id))
	}, [dispatch, user])


	if (!friends || !user) {
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

	const handleAdd = async (e, friend) => {
		e.preventDefault();

		await dispatch(addServerMember(server.id, friend))
			.then(() => {
				dispatch(getServers(user));
				dispatch(getServer(server.id));
				dispatch(getServerChannels(server.id));
				closeModal();
			})
	}

	return (
		<div className='create-server-modal'>
			<div className='create-server-modal-content'>
				<h1 className='create-server-header'>Add a Friend to {server.name}</h1>
				{friends.map(friend => (
					<>
						{!isMember(friend.user) ?
							<div onClick={(e) => handleAdd(e, friend.user)} className='friendslist-user-container' id="server-members-add-container" key={`member${friend.user.id}`}>
								<div className='friendslist-pic-username'>
									<div> <img className='friendslist-profile-image' src={friend.user.prof_pic} alt='profile_pic_user' /> </div>
									<div className='friendslist-username'> {friend.user.username.split("#")[0]} </div>
									<div className='friendslist-tag'> #{friend.user.username.split("#")[1]} </div>
								</div>
							</div>
							:
							""}
					</>
				))}
			</div >
		</div >
	);
}

export default ServerMemberAdd;
