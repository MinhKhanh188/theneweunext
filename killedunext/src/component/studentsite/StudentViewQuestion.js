// src/component/studentsite/StudentViewQuestion.js
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import {CommentOutlined } from '@ant-design/icons';

const StudentViewQuestion = () => {
    const { slotID } = useParams();
    const { currentUser } = useContext(AppContext);
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate(); // Hook for programmatic navigation

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/courseQuestions`);
                setQuestions(response.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        if (currentUser) {
            fetchQuestions();
        } else {
            setTimeout(() => {
                if (!currentUser) {
                    window.location.href = '/login'; // Redirect to login if not logged in
                }
            }, 1000);
        }
    }, [currentUser, slotID]);

    const filteredQuestions = questions.filter(q => q.slotID === parseInt(slotID));

    // Function to handle click on a question
    const handleQuestionClick = (questionID) => {
        navigate(`/student-answer-question/${questionID}`);
    };

    return (
        <div>
            <h2>Questions for Slot {slotID}</h2>
            <ul>
                {filteredQuestions.map((question, index) => (
                    <li key={index}>
                        {/* Use onClick to handle navigation */}
                        <span onClick={() => handleQuestionClick(question.id)}>
                        <CommentOutlined style={{ marginRight: '10px' }}/>
                            {question.question}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentViewQuestion;



