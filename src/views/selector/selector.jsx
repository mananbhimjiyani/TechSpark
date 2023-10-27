import React, { useState } from 'react';
import Stock from '../dashboard/Sections/stocks/stock'; // Import your Stock component
import Forex from '../dashboard/Sections/forex/forex'; // Import your Forex component
import "./styles.css";

export default function App() {
    const [selectedOption, setSelectedOption] = useState(""); // Initialize with an empty string

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <>
            <div className="main container">
                <div className="container my-5">
                    <h2 className="text-center head my-3">SENTIX</h2>
                    <h6 className="text-center">Select an option</h6>
                    <form>
                        <div className="form-group">
                            <label>Choose an Option:</label>
                            <select
                                className="form-control my-2" // Added the my-2 class for margin
                                onChange={handleOptionChange}
                                value={selectedOption}
                            >
                                <option value="">Select an element</option> {/* Default option */}
                                <option value="stock">Stock</option>
                                <option value="forex">Forex</option>
                            </select>
                        </div>
                        {selectedOption === "" && <h6>Select one to continue</h6>}
                    </form>
                    {selectedOption === "stock" && <Stock />}
                    {selectedOption === "forex" && <Forex />}
                </div>
            </div>
        </>
    );
}
