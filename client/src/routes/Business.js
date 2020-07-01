import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";
import Stars from "../components/Stars";

const Business = ({ match }) => {
    const [ name, setName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ reviews, setReviews ] = useState([]);
    const [ averageRating, setAverageRating ] = useState(0);
    const [ reviewCount, setReviewCount ] = useState(0);

    const businessID = match.params.id;

    const addReview = review => {
        setReviews([...reviews, review]);
    };

    useEffect(() => {
        const getBusiness = async () => {
            try {
                const response =
                    await fetch(`http://localhost:8000/api/businesses/${businessID}`);
                if (response.ok) {
                    const data = (await response.json()).data;
                    const {
                        name: nameFetched,
                        location: locationFetched,
                        average,
                        count
                    } = data.business;
                    setName(nameFetched);
                    setLocation(locationFetched);
                    setAverageRating(average);
                    setReviewCount(count);
                    setReviews(data.reviews);
                } else {
                    throw new Error((await response.json()).status)
                }
            } catch (error) {
                console.error(error);
                NotificationManager.error(error.message, "Error", 3000);
                return <Redirect to="/"/>
            }
        };
        getBusiness();
    }, [businessID, reviews]);

    return (
        <>
            <h1 className="font-weight-light display-1 text-center">{name}</h1>
            <h2 className="font-weight-light text-muted text-center">Located in {location}</h2>
            <div className="text-center mb-3">
                <Stars rating={averageRating}/>
                <p>From {reviewCount + (reviewCount === "1" ? " review" : " reviews")}</p>
            </div>
            <Reviews reviews={reviews}/>
            <AddReview businessID={businessID} addReview={addReview}/>
        </>
    );
};

export default Business;