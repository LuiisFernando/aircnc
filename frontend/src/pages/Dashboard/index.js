import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';

import api from '../../services/api';

import './styles.css';

export default function Dashboard() {
    const [spots, SetSpots] = useState();
    const [requests, setRequests] = useState([]);
    
    const user_id = localStorage.getItem('user');

    const socket = useMemo(() =>  socketio('http://localhost:3333',{
        query: { user_id }
    }), [user_id]) 

    useEffect(() => {
        socket.on('booking_request', data => {
            setRequests([...requests, data])
        });
    }, [requests, socket]);

    async function loadSpots() {
        const user_id = localStorage.getItem('user');
        const response = await api.get('/dashboard', {
            headers: { user_id }
        });

        SetSpots(response.data);
    }

    useEffect(() => {
        loadSpots();
    }, []);

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);

        setRequests(requests.filter(request => request._id !== id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`);

        setRequests(requests.filter(request => request._id !== id));
    }

    return (
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> is requesting a book on <strong>{request.spot.company}</strong> to date: <strong>{request.date}</strong>
                        </p>
                        <button className="accept" onClick={() => handleAccept(request._id)}>ACCEPT</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>REJECT</button> 
                    </li>
                ))}
            </ul>
            <ul className="spot-list">
                { spots && spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `$${spot.price}/day` : 'FREE'}</span>
                    </li>
                )) }
            </ul>

            <Link to="/new">
                <button className="btn">Register new spot</button>
            </Link>
        </>
    )
}