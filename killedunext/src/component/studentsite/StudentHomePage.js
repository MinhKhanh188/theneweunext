// src/component/studentsite/StudentHomePage.js
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../../css/StudentHomePage.css"; // Import the CSS file

const StudentHomePage = () => {
    const { currentUser, fetchCourseSlots, courses } = useContext(AppContext);
    const [classes, setClasses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("SUMMER2024");
    const [activeTab, setActiveTab] = useState("COURSE");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("http://localhost:9999/classes");
                const studentClasses = response.data.filter(cls => cls.studentIDs.includes(currentUser.schoolID));
                setClasses(studentClasses);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        if (currentUser) {
            fetchClasses();
        } else {
            setTimeout(() => {
                if (!currentUser) {
                    window.location.href = '/login'; // Redirect to login if not logged in
                }
            }, 1000);
        }
    }, [currentUser]);

    const handleClassClick = async (classID, courseID) => {
        await fetchCourseSlots(classID);
        navigate(`/student-course/${courseID}`);
    };

    const getCourseName = (courseID) => {
        const course = courses.find(c => c.courseID === courseID);
        return course ? course.subjectName : '';
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSemesterChange = (event) => {
        setSelectedSemester(event.target.value);
    };

    return (
        <div className="student-home-page">
            <div className="header">
                <h2>Welcome, {currentUser?.fullname}</h2>
                <p>Online: 7900</p>
            </div>
            <div className="tabs">
                <div className={`tab ${activeTab === "COURSE" ? "active" : ""}`} onClick={() => handleTabClick("COURSE")}>COURSE</div>
                <div className={`tab ${activeTab === "PROJECT" ? "active" : ""}`} onClick={() => handleTabClick("PROJECT")}>PROJECT</div>
            </div>
            <div className="semester-dropdown">
                <label htmlFor="semester">SEMESTER</label>
                <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
                    <option value="SUMMER2024">SUMMER2024</option>
                    <option value="FALL2024">FALL2024</option>
                    <option value="WINTER2024">WINTER2024</option>
                </select>
            </div>
            <div>
                <h3>{activeTab === "COURSE" ? "COURSES" : "PROJECTS"}</h3>
                <div className="courses">
                    {classes.map(cls => (
                        <div key={cls.ClassID} className="course-card" onClick={() => handleClassClick(cls.ClassID, cls.CourseID)}>
                            <div className="course-id">
                                <h3>{getCourseName(cls.CourseID)}</h3>
                                <span>{cls.CourseID}</span>
                            </div>
                            <p>{cls.semester}</p>
                            <p>{cls.className}</p>
                            <p>edu_next_ltr_fpt_edu_02</p>
                            <a href="#" className="go-to-course">Go to course &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
            <div className="footer">
                APHL
            </div>
        </div>
    );
};

export default StudentHomePage;
