require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { query } = require("./db");

app.use(express.json());
app.use(cors());

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
    try {
        const restaurants = await query("SELECT * FROM restaurants");
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
        const restaurant = (await query("SELECT * FROM restaurants WHERE id = $1",
            [req.params.id])).rows[0];
        res.status(200).json({
            status: "Success",
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
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No restaurant ID was given"
        });
    }
    try {
        const queryString = "UPDATE restaurants SET name = $1, location = $2, price_range = $3 " +
            "WHERE id = $4 RETURNING *";
        const { name, location, price_range: priceRange } = req.body;
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