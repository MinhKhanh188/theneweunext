// src/components/LeftSideNavbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Example styled-component usage with Bootstrap classes
const NavbarContainer = styled.div`
  background-color: white;
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 15px;
  border-right: 1px solid #e1e1e1;
`;

const LeftSideNavbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };


    return (
      <NavbarContainer className="bg-light">
        <h5 className="text-center mb-4">Navigation</h5>
        <ul className="nav flex-column">
                <Link to="#" className="nav-link">
               {currentUser && currentUser.fullname}
                </Link>
            
          <li className="nav-item">
            <Link to="/teacher-dashboard" className="nav-link">
              Teacher Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/student-dashboard" className="nav-link">
              Student Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={handleLogout}>
              Login Screen
            </Link>
          </li>
          {/* Add more navigation items as needed */}
        </ul>
      </NavbarContainer>
    );
};

export default LeftSideNavbar;
