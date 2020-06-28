import React from "react";

const AddRestaurant = () => {
    return (
        <div className="mb-4">
            <form action="">
                <div className="form-row">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Name"/>
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Location"/>
                    </div>
                    <div className="col">
                        <select name="price-select" id="price-select"
                        className="custom-select">
                            <option selected>Price Range</option>
                            <option value="1">$</option>
                            <option value="2">$$</option>
                            <option value="3">$$$</option>
                            <option value="4">$$$$</option>
                            <option value="5">$$$$$</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Restaurant</button>
                </div>
            </form>
        </div>
    );
}

export default AddRestaurant;
