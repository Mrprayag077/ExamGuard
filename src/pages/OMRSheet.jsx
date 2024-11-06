import React, { useState, useEffect } from 'react';

const OMRSheet = () => {
    const testID = "12355";
    const timerr = 1 * 60; // 1 minute in seconds (you can adjust as per the 'timerr' variable)

    const questions = Array.from({ length: 50 }, (_, i) => i + 1);
    const options = ['A', 'B', 'C', 'D'];

    // Initialize answers state
    const [answers, setAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem(testID);
        return savedAnswers ? JSON.parse(savedAnswers) : questions.reduce((acc, qNum) => {
            acc[qNum] = '';
            return acc;
        }, {});
    });

    // Timer state and logic
    // Timer state and logic
    const [timeRemaining, setTimeRemaining] = useState(() => {
        const savedTime = localStorage.getItem('timer');
        return savedTime ? parseInt(savedTime) : timerr * 60; // Convert minutes to seconds
    });

    const [snackbar, setSnackbar] = useState(false);  // To control the visibility of the snackbar
    const [testOver, setTestOver] = useState(false); // To check if the test is over

    // const handleAnswerChange = (questionNumber, selectedOption) => {
    //     const updatedAnswers = {
    //         ...answers,
    //         [questionNumber]: selectedOption,
    //     };
    //     setAnswers(updatedAnswers);

    //     // Save to localStorage immediately after an answer change
    //     localStorage.setItem(testID, JSON.stringify(updatedAnswers));
    // };

    const [error, setEroor] = useState(false);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setEroor(false);
            }, 2000);
        }
    }, [error])
    const handleAnswerChange = (questionNumber, selectedOption) => {
        // Check if an answer has already been selected for this question
        if (answers[questionNumber]) {
            setEroor(true);
            return; // Do nothing if an answer is already selected
        }

        const updatedAnswers = {
            ...answers,
            [questionNumber]: selectedOption,
        };
        setAnswers(updatedAnswers);

        // Save to localStorage immediately after an answer change
        localStorage.setItem(testID, JSON.stringify(updatedAnswers));
    };

    // Show snackbar every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSnackbar(true);
            setTimeout(() => {
                setSnackbar(false);
            }, 2000);  // Snackbar will disappear after 2 seconds
        }, 30000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Timer logic
    useEffect(() => {
        if (testOver) return; // Stop updating if the test is over

        const intervalId = setInterval(() => {
            setTimeRemaining((prevTime) => {
                const newTime = prevTime - 1; // Decrease time by 1 second

                // If time runs out, stop the timer and show "Test Over"
                if (newTime <= 0) {
                    clearInterval(intervalId);
                    setTestOver(true);
                    return 0;
                }

                // Save the updated timer to localStorage
                setTimeout(() => {
                    localStorage.setItem('timer', newTime.toString());
                }, 10000);
                return newTime;
            });
        }, 1000); // Update timer every second

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [testOver]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const roll_num = [1, 3, 4, 5, 6, 7, 8, 8]

    return (
        <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-8">
            <div className="w-full max-w-4xl sm:max-w-[90%] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header Section */}
                <div className="border-b-2 border-gray-800 p-3 sm:p-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">OMR ANSWER SHEET</h1>
                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                        {/* Roll number, Name, Date, Subject */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="font-semibold text-sm sm:text-base sm:w-24">Roll No.:</span>
                                <div className="flex gap-1 sm:gap-2">
                                    {roll_num.map((item, i) => (
                                        <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-800 rounded">{item}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="font-semibold text-sm sm:text-base sm:w-24">Name:</span>
                                <div className="h-8 w-full sm:w-64 border-b-2 border-gray-800">ARMAN JAIN</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="font-semibold text-sm sm:text-base sm:w-24">Date:</span>
                                <div className="h-8 w-full sm:w-48 border-b-2 border-gray-800">06-Nov 2024</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="font-semibold text-sm sm:text-base sm:w-24">Subject:</span>
                                <div className="h-8 w-full sm:w-48 border-b-2 border-gray-800">GS PAPER-I</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-3 sm:p-4 bg-yellow-50 border-b-2 border-gray-800">
                    <h2 className="font-bold text-sm sm:text-base mb-2">Instructions:</h2>
                    <ul className="text-xs sm:text-sm list-disc ml-4 space-y-1">
                        <li>Use blue/black ball point pen only</li>
                        <li>Completely darken the bubble</li>
                        <li>Mark only one bubble for each question</li>
                        <li>Marking multiple bubbles will result in zero marks</li>
                    </ul>
                </div>

                {/* Timer */}
                <div className="p-3 sm:p-4 text-center">
                    <h2 className="font-bold text-lg sm:text-xl">Time Remaining: {testOver ? "Test Over" : formatTime(timeRemaining)}</h2>
                </div>

                {/* Questions Grid */}
                {/* <div className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1">
                        {questions.map((qNum) => (
                            <div key={qNum} className="flex items-center py-2 border-b border-gray-200">
                                <span className="w-6 sm:w-8 text-sm sm:text-base font-semibold text-right pr-2">{qNum}.</span>
                                <div className="flex gap-3 sm:gap-4 flex-1 justify-between sm:justify-start">
                                    {options.map((option) => (
                                        <div key={option} className="relative flex-1 sm:flex-none">
                                            <input
                                                type="radio"
                                                id={`q${qNum}_${option}`}
                                                name={`q${qNum}`}
                                                value={option}
                                                checked={answers[qNum] === option}
                                                onChange={() => handleAnswerChange(qNum, option)}
                                                className="appearance-none w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-800 rounded-full
                                                         checked:bg-blue-600 checked:border-blue-600
                                                         hover:border-blue-400 cursor-pointer transition-colors
                                                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="absolute -top-4 sm:-top-5 left-1 sm:left-1.5 text-xs sm:text-sm font-medium">
                                                {option}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Questions Grid */}
                <div className="p-3 sm:p-6">
                    <div className="grid grid-flow-row auto-rows-max sm:grid-rows-25 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1">
                        {questions.map((qNum) => (
                            <div key={qNum} className="flex items-center py-2 border-b border-gray-200">
                                <span className="w-6 sm:w-8 text-sm sm:text-base font-semibold text-right pr-2">{qNum}.</span>
                                <div className="flex gap-3 sm:gap-4 flex-1 justify-between sm:justify-start">
                                    {options.map((option) => (
                                        <div key={option} className="relative flex-1 sm:flex-none">
                                            <input
                                                type="radio"
                                                id={`q${qNum}_${option}`}
                                                name={`q${qNum}`}
                                                value={option}
                                                checked={answers[qNum] === option}
                                                onChange={() => handleAnswerChange(qNum, option)}
                                                className="appearance-none w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-800 rounded-full
                                         checked:bg-blue-600 checked:border-blue-600
                                         hover:border-blue-400 cursor-pointer transition-colors
                                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="absolute -top-4 sm:-top-5 left-1 sm:left-1.5 text-xs sm:text-sm font-medium">
                                                {option}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-800 p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-600">
                    <p>Double check your answers before submitting</p>
                </div>
            </div>

            {/* Snackbar for successful saving */}
            {snackbar && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-400 text-white py-2 px-4 rounded-md">
                    <span className="font-semibold">Changes saved!</span>
                </div>
            )}

            {error && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-400 text-white py-2 px-4 rounded-md">
                    <span className="font-semibold">Option already selected</span>
                </div>
            )}
        </div>
    );
};

export default OMRSheet;
