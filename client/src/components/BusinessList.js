import React from "react";
import { useHistory } from "react-router-dom";
import Stars from "./Stars";

const BusinessList = ({ businesses, deleteBusiness }) => {
    const history = useHistory();

    return (
        <table className="table table-hover table-bordered">
            <caption>List of Businesses</caption>
            <thead className="thead-dark">
                <tr className="bg-primary">
                <th scope="col">Business</th>
                <th scope="col">Location</th>
                <th scope="col">Price</th>
                <th scope="col">Ratings</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                {businesses && businesses.map(business => {
                    const {
                        id, name, location,
                        price_range: priceRange, average, count
                    } = business;

                    return (
                        <tr onClick={() => history.push(`/businesses/${id}`)} key={id}>
                            <td>{name}</td>
                            <td>{location}</td>
                            <td>{"$".repeat(priceRange)}</td>
                            <td>
                                {average && <Stars rating={average}/>}
                                {(count || 0) + (count === "1" ? " review" : " reviews")}
                            </td>
                            <td>
                                <button
                                    onClick={event => {
                                        event.stopPropagation();
                                        history.push(`/businesses/${id}/update`)
                                    }}
                                    className="btn btn-info"
                                >
                                    Update
                                </button>
                            </td>
                            <td>
                                <button
                                onClick={event => deleteBusiness(id, event)}
                                className="btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default BusinessList;
