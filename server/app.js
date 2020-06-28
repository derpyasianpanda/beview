require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const restaurants = await db.query("SELECT * FROM restaurants");
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
app.get("/api/v1/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No restaurant ID was given"
        });
    }
    try {
        const restaurant = (await db.query("SELECT * FROM restaurants WHERE id = $1",
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
app.post("/api/v1/restaurants", async (req, res) => {
    try {
        const query = "INSERT INTO restaurants (name, location, price_range) " +
            "VALUES ($1, $2, $3) RETURNING *";
        const { name, location, price_range: priceRange } = req.body;
        const restaurant = (await db.query(query, [name, location, priceRange])).rows[0];
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
app.put("/api/v1/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No restaurant ID was given"
        });
    }
    try {
        const query = "UPDATE restaurants SET name = $1, location = $2, price_range = $3 " +
            "WHERE id = $4 RETURNING *";
        const { name, location, price_range: priceRange } = req.body;
        const restaurant = (await db.query(query, [name, location, priceRange, id])).rows[0];
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
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No restaurant ID was given"
        });
    }
    try {
        const restaurant =
            (await db.query("DELETE FROM restaurants WHERE id = $1 RETURNING *",
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