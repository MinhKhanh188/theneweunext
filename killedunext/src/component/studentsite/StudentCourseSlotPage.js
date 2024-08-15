import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import "../../css/StudentCourseSlotPage.css"; // Import the CSS file

const StudentCourseSlotPage = () => {
    const { courseID } = useParams();
    const { currentUser, courseSlots } = useContext(AppContext);
    const [course, setCourse] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState("All Activities");
    const [selectedSlot, setSelectedSlot] = useState("Slot 1");
    const [className, setClassName] = useState("SE1827-NJ-APHL-SUMMER2024");
    const navigate = useNavigate();

    useEffect(() => {
        const course = courseSlots.find(cs => cs.courseID === parseInt(courseID));
        if (course) {
            setSlots(course.slots);
            setCourse(course); // Set the course state
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
        navigate(`/student-view-question/${slotID}`);
    };

    const handleActivityChange = (event) => {
        setSelectedActivity(event.target.value);
    };

    const handleSlotChange = (event) => {
        setSelectedSlot(event.target.value);
    };

    const handleClassNameChange = (event) => {
        setClassName(event.target.value);
    };

    return (
        <div className="student-course-slot-page">
            <div className="filters">
                <label htmlFor="activities">Filter activities</label>
                <select id="activities" value={selectedActivity} onChange={handleActivityChange}>
                    <option value="All Activities">All Activities</option>
                    <option value="Lectures">Lectures</option>
                    <option value="Assignments">Assignments</option>
                </select>

                <label htmlFor="slots">Jump slot</label>
                <select id="slots" value={selectedSlot} onChange={handleSlotChange}>
                    <option value="Slot 1">Slot 1</option>
                    <option value="Slot 2">Slot 2</option>
                    <option value="Slot 3">Slot 3</option>
                </select>

                <label htmlFor="className">Class name</label>
                <select id="className" value={className} onChange={handleClassNameChange}>
                    <option value="SE1827-NJ-APHL-SUMMER2024">SE1827-NJ-APHL-SUMMER2024</option>
                    <option value="SE1827-NJ-APHL-FALL2024">SE1827-NJ-APHL-FALL2024</option>
                </select>
            </div>

            <div className="buttons">
                <button className="learning-materials">LEARNING MATERIALS</button>
                <button className="assignments">ASSIGNMENTS</button>
            </div>

            {course && <h2>Course: {course.subjectName}</h2>}
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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentCourseSlotPage;
