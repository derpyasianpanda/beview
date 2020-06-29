import React from "react";
import { Redirect } from "react-router-dom";
import UpdateRestaurant from "../components/UpdateRestaurant";

const Update = ({ match }) => {
    if (!match.params.id) {
        return <Redirect to="/"/>;
    }

    return (
        <>
            <h1 className="text-center mt-4">Update Restaurant</h1>
            <UpdateRestaurant restaurantID={match.params.id}/>
        </>
    );
}

export default Update;