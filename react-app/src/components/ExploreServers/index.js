import React, { useEffect } from "react";
import forestgif from '../../static/forest-bg_2k.gif';
import { getServers, getUserServers } from '../../store/server';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import './ExploreServers.css';


function ExploreServers() {

    const history = useHistory();
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);
    const allServers = useSelector(state => state.server.allServers);
    const userServers = useSelector(state => state.server.userServers);

    useEffect(() => {
        dispatch(getServers())
        dispatch(getUserServers(sessionUser.id))
      }, [dispatch])


    return (
        <div className="explore-div">

            <div className='top-banner'>
                <img src={forestgif} alt='top-banner' />
            </div>

            <div className='title-commun-div'>
                <span className='title-commun'>Featured Communities</span>
            </div>

            {}
        </div>
    )
}

export default ExploreServers;
