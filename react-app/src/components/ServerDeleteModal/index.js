import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom"
import { useModal } from "../../context/Modal";
import { deleteServer, getServers } from "../../store/server";
import "./ServerDelete.css"

function ServerDeleteModal({ server }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();

	const handleDelete = async (e) => {
		e.preventDefault();

		await dispatch(deleteServer(server.id));
		await dispatch(getServers());
		closeModal();
		history.push(`/channels/@me`);

	}

	return (
		<div className='delete-server-modal'>
			<div className='delete-server-modal-content'>
				<form>
					<h1 className='delete-server-header'>Delete '{server.name}'</h1>
					<p className='delete-server-para'>Are you sure you want to delete <span style={{ fontWeight: 'bolder' }}>'{server.name}'</span>? This action cannot be undone.</p>
					<div>
						<span><button type="button" onClick={handleDelete} className="delete-server-form-button">Delete Server</button></span>
						<span onClick={closeModal} className="delete-form-cancel">Cancel</span>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ServerDeleteModal;
