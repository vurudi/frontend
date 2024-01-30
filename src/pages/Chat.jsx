import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Back from '../assets/back.svg';
import axios from 'axios';

const Chat = () => {
    const { user, authTokens } = useContext(AuthContext);
    const { name, password } = useParams();
    const navigateTo = useNavigate();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${process.env.REACT_APP_API_URL}/room/${name}/${password}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${authTokens.access}`
                }
            })
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(err => navigateTo("/"));
        };

        const timer = setInterval(() => {
            fetchData();
        }, 1000);

        fetchData();

        return () => clearInterval(timer);
    }, [authTokens, name, password, navigateTo]);

    const Send = async (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append("message", e.target.message.value);
        data.append("image", e.target.image.files[0]);

        await axios(`${process.env.REACT_APP_API_URL}/room/${name}/${password}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authTokens.access}`,
                "Content-Type": "multipart/form-data"
            },
            data: data
        });

        e.target.reset();

        let messagesContainer = document.getElementById("messagesContainer");
        messagesContainer.scrollTo(0, 0);
    };

    return (
        <>
            {/* ... rest of the component */}
        </>
    );
};

export default Chat;
