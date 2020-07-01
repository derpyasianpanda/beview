import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { NotificationManager } from "react-notifications";

const UpdateBusiness = ({ businessID }) => {
    const [ name, setName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ priceRange, setPriceRange ] = useState("none");

    const history = useHistory();

    useEffect(() => {
        const getBusiness = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/businesses/${businessID}`);
                if (response.ok) {
                    const {
                        name: nameFetched,
                        location: locationFetched,
                        price_range: priceRangeFetched
                    } = (await response.json()).data.business;
                    setName(nameFetched);
                    setLocation(locationFetched);
                    setPriceRange(priceRangeFetched);
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
    }, [businessID]);

    /**
     * Sends a Put request to the API and attempts to update a new business
     * @param {Event} submission - The event from the business submission form
     */
    const handleSubmit = async submission => {
        submission.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/businesses/${businessID}`, {
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
                NotificationManager.success("Successfully Updated the Business",
                    "Update Success");
            } else {
                throw new Error((await response.json()).status);
            }
        } catch (error) {
            console.error(error);
            history.push("/");
            NotificationManager.error(error.message, "Error", 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Business Name</label>
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

export default UpdateBusiness;
