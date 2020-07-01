import React from "react";
import { Link } from "react-router-dom";

const HomeButton = () => {
    return (
        <Link to="/">
            <button type="button" class="btn btn-primary fixed-top m-3">
                <i class="fa fa-home"></i> Home
            </button>
        </Link>
    );
};

export default HomeButton;
