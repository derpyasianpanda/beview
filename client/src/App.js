import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import Home from "./routes/Home";
import Business from "./routes/Business";
import Update from "./routes/Update";
import NotFound from "./components/NotFound";
import "react-notifications/lib/notifications.css";
import HomeButton from "./components/HomeButton";

function App() {
    return (
        <Router>
            <main className="container">
                <HomeButton/>
                <NotificationContainer/>
                <Switch>
                    <Route exact path="/" component={ Home }/>
                    <Route exact path="/businesses/:id" component={ Business }/>
                    <Route exact path="/businesses/:id/update" component={ Update }/>
                    <Route component={NotFound}/>
                </Switch>
            </main>
        </Router>
);
};

export default App;
