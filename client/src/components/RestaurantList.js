import React from "react";
import { useHistory } from "react-router-dom";
import Stars from "./Stars";

const RestaurantList = ({ restaurants, deleteRestaurant }) => {
    const history = useHistory();

    return (
        <table className="table table-hover table-dark">
            <thead>
                <tr className="bg-primary">
                <th scope="col">Restaurant</th>
                <th scope="col">Location</th>
                <th scope="col">Price</th>
                <th scope="col">Ratings</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                {restaurants && restaurants.map(restaurant => {
                    const {
                        id, name, location,
                        price_range: priceRange, average, count
                    } = restaurant;

                    return (
                        <tr onClick={() => history.push(`/restaurants/${id}`)} key={id}>
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
                                        history.push(`/restaurants/${id}/update`)
                                    }}
                                    className="btn btn-warning"
                                >
                                    Update
                                </button>
                            </td>
                            <td>
                                <button
                                onClick={event => deleteRestaurant(id, event)}
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

export default RestaurantList;
