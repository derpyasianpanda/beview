import React from "react";
import { Redirect } from "react-router-dom";

const Restaurant = ({ match }) => {
    console.log(match.params.id);
    if (!match.params.id) {
        return <Redirect to="/"/>;
    }
    return (
        <>
            Restaurant
        </>
    );
};

export default Restaurant;