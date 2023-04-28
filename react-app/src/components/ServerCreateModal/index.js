import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import { useModal } from "../../context/Modal";
import { addServer } from "../../store/server";
import "./ServerCreate.css";

function ServerCreateModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();

	const [name, setName] = useState("");
	const [server_picture, setServerPicture] = useState("");

	const user = useSelector(state => state.session.user);

	const handleSubmit = async (e) => {
		e.preventDefault();

		await dispatch(addServer(name, user.id, false, user.username, server_picture))
			.then((res) => {
				history.push(`/channels/${res.id}/${res.channels[0].id}`)
				closeModal();
			})
	};

	return (
		<div className='create-server-modal'>
			<div className='create-server-modal-content'>
				<form className='create-server-form' onSubmit={handleSubmit}>
					<h1 className='create-server-header'>Create A Server </h1>
					<p className='create-server-para'>Your server is where your and your friends hang out. Make yours and start talking. </p>
					<div className='create-server-form-group'>
						<span className='create-server-form-label'>
							Server Name
						</span>
						<input style={{ height: '30px' }} className='modal-input'
							type="text"
							id="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<br></br>
					<div className='create-server-form-group'>
						<span className='create-server-form-label'>
							Server Image
						</span>
						<br></br>
						<input style={{ height: '30px' }} className='modal-input'
							type="text"
							id="server_picture"
							name="server_picture"
							value={server_picture}
							onChange={(e) => setServerPicture(e.target.value)}
						/>
					</div>
					<br></br>
					<div>
						<button
							disabled={!name}
							className={!name ? "disabled-btn" : "edit-server-form-button"} type="submit">Create Server</button>
						<span onClick={closeModal} className="channel-update-form-cancel">Cancel</span>
					</div>
				</form>
			</div >
		</div >
	);
}

export default ServerCreateModal;
