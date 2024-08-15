import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useParams } from 'react-router-dom';
import '../../css/StudentAnswerQuestion.css';

const TeacherViewStudentAnswer = () => {
    const { questionID } = useParams();
    const { currentUser, users } = useContext(AppContext);
    const [question, setQuestion] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState([]);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/courseQuestions/${questionID}`);
                setQuestion(response.data);

                const answerResponse = await axios.get(`http://localhost:9999/answerQuestion`);
                const filteredAnswers = answerResponse.data.filter(answer => answer.questionID === questionID);
                setStudentAnswers(filteredAnswers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (currentUser) {
            fetchQuestion();
        } else {
            setTimeout(() => {
                if (!currentUser) {
                    window.location.href = '/login';
                }
            }, 1000);
        }
    }, [questionID, currentUser]);

    const getNameAnsweredStudent = (answeredBy) => {
        const studentName = users.find(user => user.schoolID === answeredBy);
        return studentName ? studentName.fullname : 'Unknown';
    };

    return (
    <div>
        <div className="student-answer-container">
            <h2>Question: {question ? question.question : 'Loading...'}</h2>
            <h3>Student Answers:</h3>
            {studentAnswers.length === 0 ? (
                <div>
                    <img src="/otherImgae/no.png" alt="No Answers" />
                <h3>No students have answered this question yet.</h3>
                </div>
            ) : (
                studentAnswers.map((answer, index) => (
                    <div key={index}>
                        <span className="answer-personName">{getNameAnsweredStudent(answer.answeredBy)} (Group 2)</span><br />
                        <span className="answer-metadata">{answer.answeredAt}</span>

                        <div className="answer-item">
                            <div className="answer-content">
                                <p>{answer.answer}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

};

export default TeacherViewStudentAnswer;
