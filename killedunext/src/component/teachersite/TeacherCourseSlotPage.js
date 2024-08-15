// src/component/teachersite/TeacherCourseSlotPage.js
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

const TeacherCourseSlotPage = () => {
    const { courseID } = useParams();
    const { currentUser, courseSlots, courses } = useContext(AppContext);
    const [slots, setSlots] = useState([]);
    const [questions, setQuestions] = useState([]); // Initial state as empty array
    const navigate = useNavigate();

    useEffect(() => {
        const course = courseSlots.find(cs => cs.courseID === parseInt(courseID));
        if (course) {
            setSlots(course.slots);
        }
    }, [courseID, courseSlots]);

    useEffect(() => {
        // Optional: Handle redirection if user is not logged in
        if (!currentUser) {
            setTimeout(() => {
                if (!currentUser) {
                    window.location.href = '/login'; // Redirect to login if not logged in
                }
            }, 1000);
        }
    }, [currentUser]);

    const handleSlotClick = (slotID) => {
        navigate(`/teacher-question-management/${slotID}`);
    };

    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:9999/courseQuestions');
                const courseQuestions = response.data.filter(q => q.courseID === parseInt(courseID));
                setQuestions(courseQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [courseID]);



    const getCourseSubjectName = (courseID) => {
        console.log("Courses data: ", courses); // Debugging line
        const courseName = courses.find(c => c.courseID === parseInt(courseID));
        return courseName ? courseName.subjectName : 'Course not found';
    }

    return (
        <div>
            <h2>Course: {getCourseSubjectName(courseID)}</h2>
            <h3>Slots</h3>
            <ul>
                {slots.map(slot => (
                    <li key={slot.slotID} onClick={() => handleSlotClick(slot.slotID)}>
                        Slot: {slot.slotID} <br />
                        {slot.date} - {slot.startTime} to {slot.endTime}
                        <p>{slot.description}</p>
                        <ul>
                            {slot.topics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                        Questions:
                        {Array.isArray(questions) && questions.filter(q => q.slotID === slot.slotID).map((question, index) => (
                            <li key={index}>
                                {question.question} 
                            </li>
                        ))}
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default TeacherCourseSlotPage;
