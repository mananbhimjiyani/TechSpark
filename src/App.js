import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoadingScreen from "./views/loadingScreen/loadingScreen";
import {Auth0Provider} from "@auth0/auth0-react";

function App() {
    console.log(window.location.origin)
    return (
        <Auth0Provider
            domain="stockauth.us.auth0.com"
            clientId="O8QMBwDEnwDglnwNWCME9g5ndWHQziJs"
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
        >
            <Router>
                <div className="App">
                    <div className="container">
                        <Routes>
                            <Route exact path={"/"} element={<LoadingScreen/>}/>
                        </Routes>
                    </div>
                </div>
            </Router>
        </Auth0Provider>
    );
}

export default App;
