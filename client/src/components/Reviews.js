import React from "react";
import Stars from "./Stars";

const Reviews = ({ reviews }) => {
    return (
        <div className="row row-cols-3 mb-2">
            {reviews && reviews.map(review => {
                return (
                    <div
                        key={review.id} style={{maxWidth: "30%"}}
                        className="card text-white bg-primary mb-3 mr-4"
                    >
                        <div className="card-header d-flex justify-content-between">
                            <span>{review.name}</span>
                            <span><Stars rating={review.rating}/></span>
                        </div>
                        <div className="card-body">
                            <div className="card-text">
                                {review.review}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Reviews
