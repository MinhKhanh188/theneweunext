// src/component/studentsite/StudentAnswerQuestion.js
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useParams } from 'react-router-dom';
import '../../css/StudentAnswerQuestion.css';

const StudentAnswerQuestion = () => {
    const { questionID } = useParams();
    const { currentUser, users } = useContext(AppContext);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slotAnswered, setSlotAnswered] = useState([]);
    const [userVotes, setUserVotes] = useState({});
    const [selectedRating, setSelectedRating] = useState({});
    const [starRatings, setStarRatings] = useState([]);
    const [voteButtonClicked, setVoteButtonClicked] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/courseQuestions/${questionID}`);
                setQuestion(response.data);

                const answerResponse = await axios.get(`http://localhost:9999/answerQuestion`);
                const filteredAnswers = answerResponse.data.filter(answer => answer.questionID === questionID);
                setSlotAnswered(filteredAnswers);

                const votesResponse = await axios.get(`http://localhost:9999/studentStartedVotedAnswer`);
                setUserVotes(votesResponse.data.reduce((acc, vote) => {
                    acc[vote.answerID] = vote;
                    return acc;
                }, {}));

                fetchStarRatings(filteredAnswers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (currentUser) {
            fetchQuestion();
        } 
    }, [ questionID, slotAnswered]);

    useEffect(() => {
        if (currentUser) {
        } else {
            setTimeout(() => {
                if (!currentUser) {
                    window.location.href = '/login';
                }
            }, 1000);
        }
    }, [currentUser]);


    const fetchStarRatings = async (answers) => {
        try {
            const answerIds = answers.map(answer => answer.id);
            const response = await axios.get(`http://localhost:9999/studentStartedVotedAnswer?answerIDs=${answerIds.join(',')}`);
            setStarRatings(response.data);
        } catch (error) {
            console.error("Error fetching star ratings:", error);
        }
    };

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:9999/answerQuestion', {
                questionID,
                answer,
                answeredBy: currentUser.schoolID,
                answeredAt: new Date().toISOString()
            });

            console.log("Answer submitted successfully:", response.data);
            setAnswer('');

            const newVoteResponse = await axios.post(`http://localhost:9999/studentStartedVotedAnswer`, {
                answerID: response.data.id,
                rating: 0,
            });

            setUserVotes(prevVotes => ({
                ...prevVotes,
                [response.data.id]: newVoteResponse.data,
            }));

            fetchStarRatings([...slotAnswered, response.data]);
        } catch (error) {
            console.error("Error submitting answer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVoteAnswer = async (answerID, rating) => {
        try {
            const currentRatingResponse = await axios.get(`http://localhost:9999/studentStartedVotedAnswer`);
            const currentVote = currentRatingResponse.data.find(vote => vote.answerID === answerID);

            if (!currentVote) {
                console.error("No vote entry found for this answer.");
                return;
            }

            const updatedRating = currentVote.rating + rating;

            await axios.patch(`http://localhost:9999/studentStartedVotedAnswer/${currentVote.id}`, {
                rating: updatedRating,
            });

            setUserVotes(prevVotes => ({
                ...prevVotes,
                [answerID]: { ...currentVote, rating: updatedRating },
            }));

            console.log("Vote submitted successfully:", rating);

            const updatedStarRatings = starRatings.map(starRating => {
                if (starRating.answerID === answerID) {
                    return { ...starRating, rating: updatedRating };
                }
                return starRating;
            });
            setStarRatings(updatedStarRatings);
        } catch (error) {
            console.error("Error submitting vote:", error);
        }
    };

    const handleRatingClick = (answerID, rating) => {
        setSelectedRating(prevRatings => ({
            ...prevRatings,
            [answerID]: rating,
        }));
        handleVoteAnswer(answerID, rating);
        setVoteButtonClicked(voteButtonClicked === null );
    };

    const getNameAnsweredStudent = (answeredBy) => {
        const studentName = users.find(user => user.schoolID === answeredBy);
        return studentName ? studentName.fullname : 'Unknown';
    };

    const getStarRating = (answerID) => {
        const starRating = starRatings.find(star => star.answerID === answerID);
        return starRating ? starRating.rating : 0;
    };

    const handleVoteButtonClick = (answerID) => {
        setVoteButtonClicked(voteButtonClicked === answerID ? null : answerID);
    };

    return (
        <div className="student-answer-container">
            {question ? (
                <div>
                    <h2>Slot: {question.slotID} / Question: {question.question}</h2>
                    <form onSubmit={handleSubmitAnswer} className="answer-form">
                        <div className="form-group">
                            <textarea
                                value={answer}
                                onChange={handleAnswerChange}
                                required
                                disabled={isSubmitting}
                                className="form-control"
                            />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="submit-button">
                            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                        </button>
                    </form>
                </div>
            ) : (
                <p>Loading question...</p>
            )}
            <div>
                <h3>Answers:</h3>
                {slotAnswered.map((answer, index) => (
                    <div key={index} className="">

                        <span className="answer-personName">{getNameAnsweredStudent(answer.answeredBy)} (Group 2)</span><br />
                        <span className="answer-metadata">{answer.answeredAt}</span>

                        <div className="answer-item">
                            <div className="answer-content">
                                <p>{answer.answer}</p>
                            </div>
                            <div className="answer-details">
                                <button
                                    className="vote-button"
                                    onClick={() => handleVoteButtonClick(answer.id)}
                                >
                                    Vote
                                </button>
                                <div className="star-rating-container">
                                    <span className="star">{getStarRating(answer.id)}</span>
                                    <span style={{ fontSize: '200%', color: 'yellow' }}>★</span> 
                                </div>
                            </div>
                            {voteButtonClicked === answer.id && (
                                <div className="rating-section">
                                    <label>Rate this answer:</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <span
                                                key={rating}
                                                className={`star ${selectedRating[answer.id] >= rating ? 'selected' : ''}`}
                                                onClick={() => handleRatingClick(answer.id, rating)}
                                                onMouseEnter={() => setSelectedRating({ ...selectedRating, [answer.id]: rating })}
                                                onMouseLeave={() => setSelectedRating({ ...selectedRating, [answer.id]: 0 })}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentAnswerQuestion;
