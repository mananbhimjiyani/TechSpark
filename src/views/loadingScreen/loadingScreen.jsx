import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Lottie from "react-lottie-player";
import lottie from "./loadingData.json";
import Selector from "../selector/selector";
import "./styles.css";

function LoadingScreen() {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        // Simulate animation completion (you should use a proper event or callback)
        const animationDuration = 2000; // 2 seconds
        const timeoutId = setTimeout(() => {
            setAnimationComplete(true);

            if (!isAuthenticated) {
                // If not authenticated, redirect to the Auth0 login page
                loginWithRedirect();
            }
        }, animationDuration);

        // Clear the timeout when the component unmounts
        return () => clearTimeout(timeoutId);
    }, [isAuthenticated, loginWithRedirect]);

    return (
        <div className="centered-element">
            {!animationComplete ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Lottie
                        className="lottie-player"
                        animationData={lottie}
                        play
                        style={{ height: '500px', width: '500px' }}
                    />
                </div>
            ) : isAuthenticated ? (
                <div className="other-section">
                    <Selector/>
                </div>
            ) : null
            }
        </div>
    );
}

export default LoadingScreen;
