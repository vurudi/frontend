import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/HomePage.scss";

const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const navigateTo = useNavigate();

    const [roomInfo, setRoomInfo] = useState({
        name: '',
        password: '',
        enterPassword: '',
    });

    const enterRoom = (e) => {
        e.preventDefault();
        navigateTo(`/${roomInfo.name}/${roomInfo.enterPassword}`);
    };

    const createRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/room/`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'name': roomInfo.name,
                    'password': roomInfo.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                data.status === 200 ? navigateTo(`/${roomInfo.name}/${roomInfo.password}`) : alert("This room already exists");
            } else {
                alert("Failed to create room. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to create room. Please try again.");
        }
    };

    return (
        <div id='enterRoom'>
            <button id='logout' onClick={logoutUser}>Logout</button>
            <form onSubmit={enterRoom}>
                <label htmlFor="room">Enter the room's name</label>
                <input type="text" name="room" placeholder='Room name...' value={roomInfo.name} onChange={(e) => setRoomInfo({ ...roomInfo, name: e.target.value })} />
                <input type="password" name="enterPassword" placeholder='Room Password...' value={roomInfo.enterPassword} onChange={(e) => setRoomInfo({ ...roomInfo, enterPassword: e.target.value })} />
                <button type="submit">Enter</button>
            </form>
            <form onSubmit={createRoom}>
                <h3>or <br /> Create room</h3>
                <label htmlFor="name">Enter the room's name</label>
                <input type="text" name="name" placeholder='Room Name...' value={roomInfo.name} onChange={(e) => setRoomInfo({ ...roomInfo, name: e.target.value })} />
                <input type="password" name="password" placeholder='Room Password...' value={roomInfo.password} onChange={(e) => setRoomInfo({ ...roomInfo, password: e.target.value })} />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default HomePage;
