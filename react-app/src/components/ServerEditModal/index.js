import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { editServer, getServer, getUserServers } from "../../store/server";
import "./EditServer.css";

function ServerEditModal({ server, serverId }) {
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user)
	const [newServer, setNewServer] = useState({ ...server })
	const [formErrors, setFormErrors] = useState({});
	const { closeModal } = useModal();

	const handleUpdate = async (e) => {
		setNewServer({ ...newServer, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		await dispatch(editServer(server.id, newServer))
			.then(() => {
				dispatch(getUserServers(sessionUser.id))
				dispatch(getServer(serverId));
				closeModal();
			});

	};

	return (
		<div className='edit-server-modal'>
			<div className='edit-server-modal-content'>
				<form className='edit-server-form' onSubmit={handleSubmit}>
					<h1 className='edit-server-header'>Edit A Server </h1>
					<p className='edit-server-para'>Your server is where your groups hang out. Personalize it to make it yours. </p>
					<div className='edit-server-form-group'>
						<span className='edit-server-form-label'>
							Server Name
						</span>
						<input style={{ height: '30px' }} className='modal-input'
							type="text"
							id="name"
							name="name"
							value={newServer.name}
							onChange={handleUpdate}
						/>
					</div>
					<br></br>
					<div className='edit-server-form-group'>
						<span className='edit-server-form-label'>
							Server Image
						</span>
						<br></br>
						<input style={{ height: '30px' }} className='modal-input'
							type="text"
							id="server_picture"
							name="server_picture"
							value={newServer.server_picture}
							onChange={handleUpdate}
						/>
						<div className='edit-server-error'>{formErrors.serverImage}</div>
					</div>
					<br></br>
					<div>
						<button
							disabled={!newServer.name}
							className={!newServer.name ? "disabled-btn" : "edit-server-form-button"} type="submit">Update Server</button>
						<span onClick={closeModal} className="channel-update-form-cancel">Cancel</span>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ServerEditModal;
