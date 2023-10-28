import React, { useState } from 'react';
import Lottie from "react-lottie-player";
import loadingAnimation from "./loadingData.json"; // Replace with the path to your Lottie animation file
import 'bootstrap/dist/css/bootstrap.min.css';
const company_mapping = {
    0: 'ADANIPORTS.NS', 1: 'APOLLOHOSP.NS', 2: 'ASIANPAINT.NS', 3: 'AXISBANK.NS',
    4: 'BAJAJ-AUTO.NS', 5: 'BAJAJFINSV.NS', 6: 'BPCL.NS', 7: 'BRITANNIA.NS', 8: 'CIPLA.NS', 9: 'COALINDIA.NS',
    10: 'DIVISLAB.NS', 11: 'DRREDDY.NS', 12: 'EICHERMOT.NS', 13: 'GRASIM.NS', 14: 'HCLTECH.NS', 15: 'HDFCLIFE.NS',
    16: 'HDFCBANK.NS', 17: 'HEROMOTOCO.NS', 18: 'HINDALCO.NS', 19: 'HINDUNILVR.NS', 20: 'ICICIBANK.NS',
    21: 'INDUSINDBK.NS', 22: 'INFY.NS', 23: 'ITC.NS', 24: 'JIOFIN.NS', 25: 'JSWSTEEL.NS', 26: 'KOTAKBANK.NS',
    27: 'LT.NS', 28: 'LTIM.NS', 29: 'M&M.NS', 30: 'MARUTI.NS', 31: 'NESTLEIND.NS', 32: 'NIFTY50.NS', 33: 'NTPC.NS',
    34: 'ONGC.NS', 35: 'POWERGRD.NS', 36: 'RELIANCE.NS', 37: 'SBILIFE.NS', 38: 'SBIN.NS', 39: 'SUNPHARMA.NS',
    40: 'TCS.NS', 41: 'TATACONSUM.NS', 42: 'TATAMOTORS.NS', 43: 'TATASTEEL.NS', 44: 'TECHM.NS', 45: 'TITAN.NS',
    46: 'ULTRACEMCO.NS', 47: 'UPL.NS', 48: 'WIPRO.NS'
};

export default function Stock() {
    const [selectedStock, setSelectedStock] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Send a GET request to the Flask API with the selected stock as a number
        const companySymbol = selectedStock;
        fetch(`http://174.129.176.23:8000/ predict?company_symbol=${companySymbol}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                // Update the state with the prediction value
                setPrediction(data.prediction);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsLoading(false);  // Set isLoading to false when the fetch is complete
            });

    };

    return (
        <div>
            {/*<div className="container my-5">*/}
            {/*    <h2 className="text-center head my-3">SENTIX</h2>*/}
                <h6 className="text-center">Select one of the Nifty 50 Stocks</h6>
                <h6 className="text-center">For Prediction</h6>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="stockSelect">Select a Stock:</label>
                        <select
                            className="form-control"
                            name="stock"
                            id="stockSelect"
                            required
                            onChange={(e) => setSelectedStock(e.target.value)}
                        >
                            <option value="" selected disabled>
                                Select a Stock....
                            </option>
                            {Object.keys(company_mapping).map((index) => (
                                <option key={index} value={index}>
                                    {company_mapping[index]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-outline-light my-4">
                        Submit
                    </button>
                </form>
            {isLoading ? (  // Show the Lottie animation while loading
                <div className="text-center">
                    <Lottie
                        options={{
                            animationData: loadingAnimation,
                            loop: true,
                        }}
                        height={100}
                        width={100}
                    />
                    <p>Loading...</p>
                </div>
            ) : (
                prediction !== null && (
                    <div>
                        <h4 className="text-center">Prediction:</h4>
                        <p className="text-center">Predicted Price: {prediction}</p>
                    </div>
                )
            )}
            {/*</div>*/}
        </div>
    );
}
