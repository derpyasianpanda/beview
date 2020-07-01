import React from "react";
import UpdateBusiness from "../components/UpdateBusiness";

const Update = ({ match }) => {
    return (
        <>
            <h1 className="text-center mt-4">Update Business</h1>
            <UpdateBusiness businessID={match.params.id}/>
        </>
    );
}

export default Update;