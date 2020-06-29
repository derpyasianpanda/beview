import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";

const UpdateRestaurant = ({ restaurantID }) => {
    const [ name, setName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ priceRange, setPriceRange ] = useState("none");

    const history = useHistory();

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/restaurants/${restaurantID}`);
                if (response.ok) {
                    const {
                        name: nameFetched,
                        location: locationFetched,
                        price_range: priceRangeFetched
                    } = (await response.json()).data.restaurant;
                    setName(nameFetched);
                    setLocation(locationFetched);
                    setPriceRange(priceRangeFetched);
                } else {
                    throw new Error((await response.json()).status)
                }
            } catch (error) {
                console.error(error);
                return <Redirect to="/"/>
            }
        };
        getRestaurant();
    }, [restaurantID]);

    /**
     * Sends a Put request to the API and attempts to update a new Restaurant
     * @param {Event} submission - The event from the Restaurant submission form
     */
    const handleSubmit = async submission => {
        submission.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/restaurants/${restaurantID}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name === "" ? null : name,
                    location: location === "" ? null : location,
                    price_range: parseInt(priceRange)
                })
            });
            if (response.ok) {
                history.push("/");
            } else {
                throw new Error((await response.json()).status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Restaurant Name</label>
                <input
                    value={name} id="name"
                    onChange={event => setName(event.target.value)}
                    className="form-control"
                    type="text"
                    placeholder="Name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                    value={location} id="location"
                    onChange={event => setLocation(event.target.value)}
                    className="form-control"
                    type="text"
                    placeholder="Location"
                />
            </div>
            <div className="form-group">
                <label htmlFor="price-range">Price Range</label>
                <select
                    value={priceRange}
                    onChange={event => setPriceRange(event.target.value)}
                    name="price-range" id="price-range" className="custom-select"
                >
                    <option value="none" hidden>Price Range</option>
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                    <option value="4">$$$$</option>
                    <option value="5">$$$$$</option>
                </select>
            </div>

            <button className="btn btn-primary">Update</button>
        </form>
    );
};

export default UpdateRestaurant;
