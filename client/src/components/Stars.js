import React from "react";

const Stars = ({ rating, setRating = () => {} }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            i <= rating ?
            <i key={i} onClick={() => setRating(i)} className="fas fa-star"></i> :
            i === Math.ceil(rating) &&
                !Number.isInteger(rating) ? <i key={i} className="fas fa-star-half-alt"></i> :
            <i key={i} onClick={() => setRating(i)} className="far fa-star"></i>
        );
    }

    return (
        <div className="text-warning">
            {stars} ({rating})
        </div>
    );
};

export default Stars
