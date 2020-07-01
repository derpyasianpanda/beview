require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const cors = require("cors");
const { query } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
    try {
        const queryString = "SELECT id, name, location, price_range, count, average FROM "+
            "(SELECT * FROM restaurants LEFT JOIN " +
            "(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average " +
            "FROM reviews GROUP BY restaurant_id) " +
            "reviews ON restaurants.id = reviews.restaurant_id) AS results";
        const restaurants = await query(queryString);
        res.status(200).json({
            status: "Success",
            results: restaurants.rowCount,
            data: {
                restaurants: restaurants.rows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Get a restaurant
app.get("/api/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No restaurant ID was given"
        });
    }
    try {
        const queryString = "SELECT id, name, location, price_range, count, average FROM "+
            "(SELECT * FROM restaurants LEFT JOIN " +
            "(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average " +
            "FROM reviews GROUP BY restaurant_id) " +
            "reviews ON restaurants.id = reviews.restaurant_id) AS results WHERE id = $1";
        const restaurant = (await query(queryString, [req.params.id])).rows[0];
        const reviews = (await query("SELECT * FROM reviews WHERE restaurant_id = $1",
            [req.params.id])).rows;
        if (restaurant) {
            res.status(200).json({
                status: "Success",
                data: {
                    restaurant: restaurant,
                    reviews: reviews
                }
            });
        } else {
            res.status(404).json({
                status: "Error: Restaurant with the given ID was not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Submit a restaurant
app.post("/api/restaurants", async (req, res) => {
    const { name, location, price_range: priceRange } = req.body;
    if (!(name && location && priceRange)) {
        return res.status(400).json({
            status: "Bad Request. One or more of the submitted parameters are invalid/missing"
        });
    }
    try {
        const queryString = "INSERT INTO restaurants (name, location, price_range) " +
            "VALUES ($1, $2, $3) RETURNING *";
        const restaurant = (await query(queryString, [name, location, priceRange])).rows[0];
        res.status(201).json({
            status: "Successfully submitted a new restaurant",
            data: {
                restaurant: restaurant
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Update a restaurant
app.put("/api/restaurants/:id", async (req, res) => {
    const { name, location, price_range: priceRange } = req.body;
    const id = req.params.id;
    if (!(name && location && priceRange && id)) {
        return res.status(400).json({
            status: "Bad Request. One or more of the submitted parameters are invalid/missing"
        });
    }
    try {
        const queryString = "UPDATE restaurants SET name = $1, location = $2, price_range = $3 " +
            "WHERE id = $4 RETURNING *";
        const restaurant = (await query(queryString, [name, location, priceRange, id])).rows[0];
        if (restaurant) {
            res.status(200).json({
                status: "Successfully updated a restaurant",
                data: {
                    restaurant: restaurant
                }
            });
        } else {
            res.status(404).json({
                status: "No changes made. Restaurant with the given ID wasn't found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Submit a review
app.post("/api/restaurants/:id/addReview", async (req, res) => {
    const { rating, name, review } = req.body;
    const restaurantID = req.params.id;
    if (!(name && rating && review && restaurantID)) {
        return res.status(400).json({
            status: "Bad Request. One or more of the submitted parameters are invalid/missing"
        });
    }
    try {
        const queryString = "INSERT INTO reviews (restaurant_id, name, review, rating) " +
            "VALUES ($1, $2, $3, $4) RETURNING *";
        const reviewInfo =
            (await query(queryString, [restaurantID, name, review, rating])).rows[0];
        res.status(201).json({
            status: "Successfully submitted a new review",
            data: {
                review: reviewInfo
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Delete a restaurant
app.delete("/api/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No restaurant ID was given"
        });
    }
    try {
        const restaurant =
            (await query("DELETE FROM restaurants WHERE id = $1 RETURNING *",
            [req.params.id])).rows[0];
        if (restaurant) {
            res.status(200).json({
                status: "Successfully deleted a restaurant",
                data: {
                    restaurant: restaurant
                }
            });
        } else {
            res.status(404).json({
                status: "No changes made. Restaurant with the given ID wasn't found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});


const PORT = process.env.API_PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});