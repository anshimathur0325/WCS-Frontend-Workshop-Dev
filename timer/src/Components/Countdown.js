// src/components/Countdown.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Countdown.css";

// Main Countdown component
function Countdown() {
    // State for holding all timers
    const [timers, setTimers] = useState([]);
    // State for the new timer's title input
    const [newTimerTitle, setNewTimerTitle] = useState("");
    // State for the new timer's category input
    const [newTimerCategory, setNewTimerCategory] = useState("");
    // State for the new timer's date and time input
    const [newTimerDateTime, setNewTimerDateTime] = useState("");

    // Object mapping categories to Bootstrap background color classes
    const categoryColors = {
        Meeting: "bg-primary",
        Birthday: "bg-danger",
        Reminder: "bg-success",
    };

    // useEffect to update timers every second using intervals
    useEffect(() => {
        // Object to keep track of interval IDs for each timer
        const intervalIds = {};

        // Function to update time remaining for each timer
        const updateTimers = () => {
            setTimers((prevTimers) =>
                prevTimers.map((timer) => {
                    // Calculate target time and current time in milliseconds
                    const targetTime = new Date(timer.targetDateTime).getTime();
                    const currentTime = new Date().getTime();
                    // Calculate the remaining time in seconds (not less than 0)
                    const timeRemaining = Math.max(
                        Math.floor((targetTime - currentTime) / 1000),
                        0
                    );

                    // If timer has reached zero, clear its interval and mark it as not running
                    if (timeRemaining === 0) {
                        clearInterval(intervalIds[timer.id]);
                        return { 
                            ...timer, 
                            isRunning: false, 
                            timeRemaining: 0 
                        };
                    }

                    // Otherwise, update the timer with the new time remaining
                    return { ...timer, timeRemaining };
                })
            );
        };

        // Set up intervals for each timer that is running and has time remaining
        timers.forEach((timer) => {
            if (timer.isRunning && timer.timeRemaining > 0) {
                intervalIds[timer.id] = setInterval(updateTimers, 1000);
            }
        });

        // Cleanup function to clear all intervals when component unmounts or timers change
        return () => {
            Object.values(intervalIds).forEach((intervalId) =>
                clearInterval(intervalId)
            );
        };
    }, [timers]);

    // Function to remove a timer based on its id
    const removeTimer = (timerId) => {
        setTimers((prevTimers) =>
            prevTimers.filter((timer) => timer.id !== timerId)
        );
    };

    // Helper function to calculate the remaining time (in seconds) for a given target time
    const calculateTimeRemaining = (targetTime) => {
        const currentTime = new Date().getTime();
        // Calculate the difference between target time and current time
        const timeDifference = //FINISH THIS (USE targetTime in your calculation)
        // Convert the difference to seconds, ensuring it's not negative
        const secondsRemaining = Math.max(Math.floor(timeDifference / 1000), 0);
        return secondsRemaining;
    };

    // Helper function to format seconds into days, hours, minutes, and seconds
    const formatTimeRemaining = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        // Calculate hours from the remaining seconds (comment indicates to finish calculation)
        const hours = //FINISH THIS 
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        // Return an object containing each time unit
        return {
            days,
            hours,
            minutes,
            seconds: remainingSeconds,
        };
    };

    // Function to add a new timer to the timers state
    const addTimer = () => {
        // Only add the timer if all fields have a value
        if (!newTimerTitle || !newTimerCategory || !newTimerDateTime) 
            return;
            
        // Convert the input date/time into a millisecond timestamp
        const targetDateTime = new Date(newTimerDateTime).getTime(); 
        
        // Create a new timer object with the provided values and initial state
        const newTimer = {
            id: timers.length + 1,
            category: newTimerCategory,
            targetDateTime,
            // Calculate the initial time remaining using the helper function
            timeRemaining: calculateTimeRemaining(targetDateTime), 
            isRunning: true,
            title: newTimerTitle,
            showTitleInput: false,
        };

        // Add the new timer to the list of timers
        setTimers([...timers, newTimer]);

        // Clear the input fields after adding the timer
        setNewTimerTitle("");
        setNewTimerCategory("");
        setNewTimerDateTime("");
    };

    // JSX to render the countdown app
    return (
        <div className="countdown-container">
            <div className="main-container">
                {/* Container for input elements */}
                <div className="input-container m-3">
                    <h1 className="text-center text-success">
                        {/* ADD A TITLE FOR YOUR TIMER APP */}
                    </h1>
                    {/* Input for the timer title */}
                    <input
                        type="text"
                        className="form-control m-2"
                        placeholder="Timer Title"
                        value={newTimerTitle}
                        onChange={(e) => setNewTimerTitle(e.target.value)}
                    />
                    {/* Dropdown for selecting the timer category */}
                    <select
                        className="form-select m-2"
                        value={newTimerCategory}
                        onChange={(e) => setNewTimerCategory(e.target.value)}
                    >
                        <option value="">Select a Category</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Birthday">Birthday</option>
                        {/* ADD AN OPTION FOR REMINDER (like birthday and meeting) */}
                    </select>
                    {/* Input for selecting the date and time for the timer */}
                    <input
                        className="form-control m-2"
                        type="datetime-local"
                        value={newTimerDateTime}
                        onChange={(e) => setNewTimerDateTime(e.target.value)}
                    />
                    {/* Button to add a new timer; disabled if any field is empty */}
                    <button
                        className="btn btn-primary m-2"
                        onClick={addTimer}
                        disabled={
                            !newTimerTitle ||
                            !newTimerCategory ||
                            !newTimerDateTime
                        }
                    >
                        Add Timer
                    </button>
                </div>
                {/* Container for displaying the list of timers */}
                <div className="timers-div m-auto d-flex">
                    {timers.map((timer) => {
                        // Format the time remaining for each timer
                        const timeRemaining = formatTimeRemaining(
                            timer.timeRemaining
                        );

                        return (
                            <div
                                key={timer.id}
                                className={`card m-4 ${
                                    categoryColors[timer.category] || ""
                                }`}
                            >
                                {/* Display timer title */}
                                <h3 className="card-title m-2 text-light">
                                    {timer.title}
                                </h3>
                                {/* Display timer category */}
                                <h4 className="card-title m-2 text-dark">
                                    {timer.category}
                                </h4>
                                {/* Card body displaying time components */}
                                <div className="card-body d-flex">
                                    {/* Only display days if greater than 0 */}
                                    {timeRemaining.days > 0 && (
                                        <div className="container bg-light text-dark rounded m-2">
                                            <div>
                                                <h1>
                                                    <strong>
                                                        {timeRemaining.days}
                                                    </strong>
                                                </h1>
                                            </div>
                                            <div>days </div>
                                        </div>
                                    )}
                                    {/* Container for hours */}
                                    <div className="container bg-light text-dark rounded m-2">
                                        <div>
                                            <h1>
                                                <strong>
                                                    {/* Display Hours */}
                                                    
                                                </strong>
                                            </h1>
                                        </div>
                                        <div>hours </div>
                                    </div>
                                    {/* Container for minutes */}
                                    <div className="container bg-light text-dark rounded m-2">
                                        <div>
                                            <h1>
                                                <strong>
                                                    {/* Display Minutes */}
                                                    
                                                </strong>
                                            </h1>
                                        </div>
                                        <div>minutes </div>
                                    </div>
                                    {/* Container for seconds */}
                                    <div className="container bg-light text-dark rounded m-2">
                                        <div>
                                            <h1>
                                                <strong>
                                                    {timeRemaining.seconds}
                                                </strong>
                                            </h1>
                                        </div>
                                        <div>seconds </div>
                                    </div>
                                </div>
                                {/* Button to remove the timer; disabled if time remaining is 0 */}
                                <button
                                    className=//FORMAT REMOVE BUTTON (i.e. "text-dark")
                                    onClick={() => removeTimer(timer.id)}
                                    disabled={timer.timeRemaining <= 0}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Countdown;

