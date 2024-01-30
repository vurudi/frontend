import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import "../styles/RegisterPage.scss";

const RegisterPage = () => {
    const { loginUser } = useContext(AuthContext);

    const apiURL = process.env.REACT_APP_API_URL || "http://vurudi100.pythonanywhere.com";

    const Submit = async (e) => {
        e.preventDefault();
        const data = { 'username': e.target.username.value, 'password': e.target.password.value };

        try {
            const response = await fetch(`${apiURL}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.ok) {
                    loginUser(e);
                } else {
                    alert("This Name Already Exists");
                }
            } else {
                console.error('Failed to register. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to register. Please try again.");
        }
    };

    return (
        <div id='login'>
            <Link id="register" to='/login'>Login</Link>
            <form onSubmit={Submit}>
                <h2>Register</h2>
                <input type="text" name='username' placeholder='Enter Username' />
                <input type="password" name="password" placeholder='Enter Password' />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
