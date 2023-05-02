import React, { useEffect } from "react";
import forestgif from '../../static/forest-bg_2k.gif';
import mushgif from '../../static/mushroom-bg_2k.gif';
import placeholder from '../../static/placeholder.webp';
import { getServers, getUserServers, addServerMember, deleteServerMember } from '../../store/server';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import './ExploreServers.css';


function ExploreServers() {

    const history = useHistory();
    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.session.user);
    const allServers = useSelector(state => state.server.allServers);
    const userServers = useSelector(state => state.server.userServers);

    useEffect(() => {
        dispatch(getServers())
        dispatch(getUserServers(currentUser.id))
    }, [dispatch])


    if (!allServers || !userServers || !currentUser) {
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


    const allPublicServers = Object.values(allServers).filter(server => !server.name.includes("-"));

    const loadServer = (server) => {
        history.push(`/channels/${server.id}/${server.channels[0].id}`)
    }

    const handleJoin = async (server) => {
        await dispatch(addServerMember(server.id, currentUser.username))
            .then(() => {
                dispatch(getUserServers(currentUser.id))
            })
    }

    const handleLeave = async (server) => {
        await dispatch(deleteServerMember(server.id, currentUser.username))
            .then(() => {
                dispatch(getUserServers(currentUser.id))
            })
    }



    return (
        <div className="explore-div">

            <div className='top-banner'>
                <img src={forestgif} alt='top-banner' />
            </div>

            <div className='title-commun-div'>
                <span className='title-commun'>Featured Communities</span>
            </div>

            <div className="server-card-section">
                {allPublicServers.map(server => (
                    <div key={`server${server.id}`} className="server-card">
                        <div className='card-upper-bg'>
                            <img src={mushgif} alt='mushgif' />
                        </div>
                        <div className="explore-img" onClick={() => loadServer(server)}>
                            <img src={server.server_picture ? server.server_picture : placeholder} alt='serverimg' className="center-server-pic" />
                        </div>
                        <div className="card-gray-bg">
                            <span className="public-server-name" onClick={() => loadServer(server)}>{server.name}</span>
                            <div className="member-count-div">
                                <i className="fa-solid fa-users"></i>
                                <span className="public-server-member-count">
                                    {server.members.length > 1 ? `${server.members.length} members` : `${server.members.length} member`}
                                </span>
                            </div>
                            {!userServers[server.id] && (
                                <div className="join-ser-div" onClick={() => handleJoin(server)}>
                                    <span className="join-ser-card">Join Server</span>
                                </div>
                            )}
                            {userServers[server.id] && (
                                <div className="already-joined-div" onClick={() => handleLeave(server)}>
                                    <span className="already-joined-card">
                                        <i className="fa-solid fa-check"></i>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ExploreServers;
