import React from "react";
import UpdateRestaurant from "../components/UpdateRestaurant";

const Update = ({ match }) => {
    return (
        <>
            <h1 className="text-center mt-4">Update Restaurant</h1>
            <UpdateRestaurant restaurantID={match.params.id}/>
        </>
    );
}

export default Update;