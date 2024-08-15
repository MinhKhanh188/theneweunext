// src/component/teachersite/TeacherQuestionManagementPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const TeacherQuestionManagementPage = () => {
    const { slotID } = useParams();
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const { addQuestion, deleteQuestion } = useContext(AppContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:9999/courseQuestions');
                const slotQuestions = response.data.filter(q => q.slotID === parseInt(slotID));
                setQuestions(slotQuestions);
                console.log('Fetched questions:', slotQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [slotID]);

    const handleAddQuestion = async () => {
        if (newQuestion.trim() === '') return;
        try {
            const newQuestionData = await addQuestion(11189, parseInt(slotID), newQuestion); // Replace 11189 with the actual courseID
            if (newQuestionData) {
                setQuestions(prevQuestions => [...prevQuestions, newQuestionData]);
                setNewQuestion('');
                console.log('Added question:', newQuestionData);
            } else {
                console.error("New question data is undefined");
            }
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };

    const handleDeleteQuestion = async (questionID) => {
        try {
            await deleteQuestion(11189, parseInt(slotID), questionID); // Replace 11189 with the actual courseID
            setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionID));
            console.log('Deleted question ID:', questionID);
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    }

    const handleQuestionClick = (questionID) => {
        navigate(`/teacher-view-student-answer/${questionID}`);
    };

    return (
        <div>
            <h2>Questions for Slot {slotID}</h2>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>
                        {question.question}
                        <button onClick={() => handleQuestionClick(question.id)}>View Answer</button>
                        <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Add a new question"
            />
            <button onClick={handleAddQuestion}>Add Question</button>
        </div>
    );
};

export default TeacherQuestionManagementPage;
