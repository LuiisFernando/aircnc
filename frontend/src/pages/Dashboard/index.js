import React, { useEffect, useState } from 'react';

import api from '../../services/api';

import './styles.css';

export default function Dashboard() {
    const [spots, SetSpots] = useState();
    
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

    return (
        <>
            <ul className="spot-list">
                { spots && spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>
                )) }
            </ul>
        </>
    )
}