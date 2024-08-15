// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppContextProvider } from './context/AppContext';
import Login from './component/Auth/Login';
import TeacherHomePage from './component/teachersite/TeacherHomePage';
import StudentHomePage from './component/studentsite/StudentHomePage';
import TeacherCourseSlotPage from './component/teachersite/TeacherCourseSlotPage';
import StudentCourseSlotPage from './component/studentsite/StudentCourseSlotPage';
import StudentViewQuestion from './component/studentsite/StudentViewQuestion';
import StudentAnswerQuestion from './component/studentsite/StudentAnswerQuestion';
import TeacherQuestionManagementPage from './component/teachersite/TeacherQuestionManagementPage';
import TeacherViewStudentAnswer from './component/teachersite/TeacherViewStudentAnswer';
import LeftSideNavbar from './component/LeftSideNavbar';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <div style={{ display: 'flex' }}> {/* Container for layout */}
          <LeftSideNavbar /> {/* Left side navigation bar */}
          <div style={{ marginLeft: '250px', padding: '15px', width: '100%' }}> {/* Main content area */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/teacher-dashboard" element={<TeacherHomePage />} />
              <Route path="/student-dashboard" element={<StudentHomePage />} />
              <Route path="/teacher-course/:courseID" element={<TeacherCourseSlotPage />} />
              <Route path="/student-course/:courseID" element={<StudentCourseSlotPage />} />
              <Route path="/student-view-question/:slotID" element={<StudentViewQuestion />} />
              <Route path="/student-answer-question/:questionID" element={<StudentAnswerQuestion />} />
              <Route path="/teacher-question-management/:slotID" element={<TeacherQuestionManagementPage />} />
              <Route path="/teacher-view-student-answer/:questionID" element={<TeacherViewStudentAnswer />} />

              <Route path="/" element={<Login />} /> {/* Default route */}
            </Routes>
          </div>
        </div>
      </Router>
    </AppContextProvider>
  );
}

export default App;
