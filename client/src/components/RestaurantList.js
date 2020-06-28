import React from "react";

const RestaurantList = () => {
    return (
        <table class="table table-hover table-dark">
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
                <tr>
                    <td>MickeyDees</td>
                    <td>Washington</td>
                    <td>$</td>
                    <td>5 Stars</td>
                    <td><button className="btn btn-warning">Update</button></td>
                    <td><button className="btn btn-danger">Delete</button></td>
                </tr>
                <tr>
                    <td>MickeyDees</td>
                    <td>Oregon</td>
                    <td>$</td>
                    <td>5 Stars</td>
                    <td><button className="btn btn-warning">Update</button></td>
                    <td><button className="btn btn-danger">Delete</button></td>
                </tr>
            </tbody>
        </table>
    );
}

export default RestaurantList;
