import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const forex_mapping = {
    0: 'AUD-USD-ASK', 1: 'AUD-USD-BID', 2: 'EUR-USD-ASK', 3: 'EUR-USD-BID',
    4: 'GBP-USD-ASK', 5: 'GBP-USD-BID', 6: 'NZD-USD-ASK', 7: 'NZD-USD-BID',
    8: 'USD-CAD-ASK', 9: 'USD-CAD-BID', 10: 'USD-CHF-ASK', 11: 'USD-CHF-BID',
    12: 'USD-JPY-ASK', 13: 'USD-JPY-BID', 14: 'XAG-USD-ASK', 15: 'XAG-USD-BID'
}

export default function Forex() {
    const [selectedForex, setSelectedForex] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null); // Clear any previous errors
        // Send a GET request to the Flask API with the selected forex symbol
        const forex_index = selectedForex;
        console.log(forex_index);
        fetch(`http://174.129.176.23:8000/predict_forex?forex_symbol=${forex_index}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Update the state with the prediction value
                setPrediction(data.prediction);
            })
            .catch((error) => {
                setError("An error occurred. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <h6 className="text-center">Select one of the Forex Currency Pairs</h6>
            <h6 className="text-center">For Prediction</h6>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="forexSelect">Select a Pair:</label>
                    <select
                        className="form-control"
                        name="forex"
                        id="forexSelect"
                        required
                        onChange={(e) => setSelectedForex(e.target.value)}
                    >
                        <option value="" selected disabled>
                            Select a Pair....
                        </option>
                        {Object.keys(forex_mapping).map((index) => (
                            <option key={index} value={index}>
                                {forex_mapping[index]}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-outline-light my-4">
                    Submit
                </button>
            </form>
            {loading && (
                <p className="text-center">Loading...</p>
            )}
            {error && (
                <p className="text-center text-danger">{error}</p>
            )}
            {prediction !== null && !loading && !error && (
                <div>
                    <h4 className="text-center">Prediction:</h4>
                    <p className="text-center">Predicted Price: {prediction}</p>
                </div>
            )}
        </div>
    );
}
