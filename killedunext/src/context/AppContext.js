// src/context/AppContext.js
import React, { useEffect, useState, createContext, useCallback, useRef } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const sessionTimeoutRef = useRef(null);
    const [courseSlots, setCourseSlots] = useState([]);
    const [courses, setCourses] = useState([]);
    const [questions, setQuestions] = useState([]);
    
    const SESSION_TIMEOUT = 30 * 60 * 1000;// 30 minutes

    useEffect(() => {
        // Fetch users data or initialize as needed
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:9999/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
        fetchCourse();
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const fetchCourse = async () => {
        try {
            const response = await axios.get("http://localhost:9999/courses");
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        if (sessionTimeoutRef.current) {
            clearTimeout(sessionTimeoutRef.current);
        }
    }, []);

    const resetSessionTimeout = useCallback(() => {
        if (sessionTimeoutRef.current) {
            clearTimeout(sessionTimeoutRef.current);
        }
        sessionTimeoutRef.current = setTimeout(() => {
            logout();
        }, SESSION_TIMEOUT);
    }, [SESSION_TIMEOUT, logout]);

    useEffect(() => {
        const handleActivity = () => {
            resetSessionTimeout();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        resetSessionTimeout();

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            if (sessionTimeoutRef.current) {
                clearTimeout(sessionTimeoutRef.current);
            }
        };
    }, [resetSessionTimeout]);

    const login = useCallback(async (email, password) => {
        try {
            const user = users.find(user => user.email === email && user.password === password);
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                resetSessionTimeout();
                return user; // Return the user object after successful login
            }
            return null;
        } catch (error) {
            console.error("Error during login:", error);
            return null;
        }
    }, [users, resetSessionTimeout]);

    const fetchCourseSlots = async (classID) => {
        try {
            const response = await axios.get(`http://localhost:9999/slots?classID=${classID}`);
            setCourseSlots(response.data);
        } catch (error) {
            console.error("Error fetching course slots:", error);
        }
    };

    const fetchQuestions = async (courseID) => {
        try {
            const response = await axios.get(`http://localhost:9999/courseQuestions?courseID=${courseID}`);
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const addQuestion = async (courseID, slotID, questionText) => {
        try {
            const response = await axios.post(`http://localhost:9999/courseQuestions`, {
                courseID,
                slotID,
                question: questionText
            });
            setQuestions([...questions, response.data]);
            return response.data; // Ensure the added question data is returned
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };
    

    const deleteQuestion = async (courseID, slotID, questionID) => {
        try {
            await axios.delete(`http://localhost:9999/courseQuestions/${questionID}`);
            setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionID));
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    const contextValue = {
        currentUser,
        login,
        logout,
        users,
        courseSlots,
        courses,
        fetchCourseSlots,
        questions,
        fetchQuestions,
        addQuestion,
        deleteQuestion
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
