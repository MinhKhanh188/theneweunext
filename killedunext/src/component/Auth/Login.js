// src/component/Auth/Login.js
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext"; // Adjust path based on your project structure
import { useNavigate } from "react-router-dom";
import "../../css/Login.css"; // Import the CSS file

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AppContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const user = await login(email, password);
            if (user) {
                if (user.role === 'teacher') {
                    navigate("/teacher-dashboard"); // Redirect to teacher dashboard
                } else if (user.role === 'student') {
                    navigate("/student-dashboard"); // Redirect to student dashboard
                } else {
                    setError("Invalid role");
                }
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <img src="/logo/logo-home.png" alt="FPT Education" /> {/* Add your logo here */}
            <h2>The social constructive learning tool</h2>
            <p>University system (FU)</p>
            <p>
                <strong>Sign in FEID</strong> {/* This part can be adjusted based on your needs */}
            </p>
            <p>khanhph176285@gmail.com</p>
            <p>GiapTuanHa157285@gmail.com</p>
            <p>hoannguyen176285@gmail.com</p>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Campus</label>
                        <select>
                            <option value="DA NANG">HÀ NỘI - HÒA LẠC</option>
                            <option value="DA NANG">ĐÀ NẴNG</option>
                            <option value="DA NANG">CẦN THƠ</option>
                            <option value="DA NANG">HỒ CHÍ MINH</option>
                            {/* Add more options if needed */}
                        </select>
                    </div>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;

