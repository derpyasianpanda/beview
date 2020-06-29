import React from "react";

const RestaurantList = ({ restaurants, deleteRestaurant }) => {

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
                    const { id, name, location, price_range: priceRange} = restaurant;

                    return (
                        <tr key={id}>
                            <td>{name}</td>
                            <td>{location}</td>
                            <td>{"$".repeat(priceRange)}</td>
                            <td>5 Stars</td>
                            <td><button className="btn btn-warning">Update</button></td>
                            <td>
                                <button
                                onClick={() => deleteRestaurant(id)}
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
}

export default RestaurantList;
