import React from "react";
import { Link } from "react-router-dom";


function NotFound() {
    return (
        <section className="text-center">
            <h1 className="mt-4">404 Not Found</h1>
            <Link to="/">Return to the Homepage</Link>
        </section>
    );
};

export default NotFound;
