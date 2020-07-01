import React, { useState } from "react";
import Stars from "./Stars";
import { NotificationManager } from "react-notifications";

const AddReview = ({ businessID, addReview }) => {
    const [ rating, setRating ] = useState(0);
    const [ name, setName ] = useState("");
    const [ review, setReview ] = useState("");

    /**
     * Sends a POST request to the API and attempts to add a new review
     * @param {Event} submission - The event from the Business submission form
     */
    const handleSubmit = async submission => {
        submission.preventDefault();
        try {
            const response =
                await fetch(`http://localhost:8000/api/businesses/${businessID}/addReview`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rating: rating,
                    name: name === "" ? null : name,
                    review: review === "" ? null : review
                })
            });
            if (response.ok) {
                addReview((await response.json()).data.review);
                NotificationManager.success("Successfully Added a Review", "Addition Success");
                setRating(0);
                setName("");
                setReview("");
            } else {
                throw new Error((await response.json()).status);
            }
        } catch (error) {
            console.error(error);
            NotificationManager.error(error.message, "Error", 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="font-weight-light">Add a review</h2>
            <div className="form-group">
                <label htmlFor="set-rating">Rating</label>
                <Stars
                    id="set-rating"
                    rating={rating}
                    setRating={setRating}
                    className="custom-select"
                />
            </div>
            <div className="form-group w-100 p-0">
                <label htmlFor="name">Name</label>
                <input
                    value={name}
                    id="name"
                    className="form-control"
                    type="text"
                    placeholder="Name"
                    onChange={event => setName(event.target.value)}
                />
            </div>
            <div className="form-group w-100 p-0">
                <label htmlFor="review">Review</label>
                <textarea
                    value={review}
                    id="review"
                    className="form-control"
                    type="text"
                    placeholder="Write your review here!"
                    onChange={event => setReview(event.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
        </form>
    );
};

export default AddReview;
