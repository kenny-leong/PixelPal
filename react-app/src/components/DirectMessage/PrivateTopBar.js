import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ServerMembersSidebar from '../ServerMembersSidebar';
import { useModal } from "../../context/Modal";
import { useParams } from 'react-router-dom';
import { getServer } from '../../store/server';
import './PrivateTopBar.css';


function PrivateTopBar() {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const { serverId } = useParams();
    const server = useSelector(state => state.server.currentServer);



    useEffect(() => {
        dispatch(getServer(serverId))
      }, [dispatch, serverId]);

    if (!server) {
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

    // const handleThreads = (e) => {
    //     e.preventDefault();
    //     window.alert('Threads Feature Coming Soon...');
    // }

    // const handleNotifications = (e) => {
    //     e.preventDefault();
    //     window.alert('Notifications Feature Coming Soon...');
    // }

    // const handlePinned = (e) => {
    //     e.preventDefault();
    //     window.alert('Pinned Messages Feature Coming Soon...');
    // }

    //opens the server members sidebar component
    const openServerMemberSideBar = () => {
        setModalContent(<ServerMembersSidebar />);
    }


    return (
        <>
            <div className='channel-topbar-container'>
                <div className='channel-topbar-left-side'>
                    <div className='channel-name'>
                        <span className='at-symbol'>@</span>
                        <p className='channel-topbar-name private'>{server.name}</p>
                    </div>
                </div>
                <div className='channel-topbar-right-side'>
                    {/* <button className='threads-button' onClick={handleThreads}><i className="fa-solid fa-hashtag"></i></button>
                    <button className='threads-button' onClick={handleNotifications}><i className="fa-solid fa-bell-slash"></i></button>
                    <button className='threads-button' onClick={handlePinned}><i className="fa-solid fa-thumbtack"></i></button> */}
                    {/* <button className='threads-button' id="toggle-sidebar-button" onClick={() => openServerMemberSideBar()}><i className="fa-solid fa-users"></i></button> */}
                </div>
            </div>
        </>
    );
};

export default PrivateTopBar;
