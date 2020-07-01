require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const cors = require("cors");
const { query } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// Get all businesses
app.get("/api/businesses", async (req, res) => {
    try {
        const queryString = "SELECT id, name, location, price_range, count, average FROM "+
            "(SELECT * FROM businesses LEFT JOIN " +
            "(SELECT business_id, COUNT(*), TRUNC(AVG(rating), 1) AS average " +
            "FROM reviews GROUP BY business_id) " +
            "reviews ON businesses.id = reviews.business_id) AS results";
        const businesses = await query(queryString);
        res.status(200).json({
            status: "Success",
            results: businesses.rowCount,
            data: {
                businesses: businesses.rows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Get a business
app.get("/api/businesses/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No business ID was given"
        });
    }
    try {
        const queryString = "SELECT id, name, location, price_range, count, average FROM "+
            "(SELECT * FROM businesses LEFT JOIN " +
            "(SELECT business_id, COUNT(*), TRUNC(AVG(rating), 1) AS average " +
            "FROM reviews GROUP BY business_id) " +
            "reviews ON businesses.id = reviews.business_id) AS results WHERE id = $1";
        const business = (await query(queryString, [req.params.id])).rows[0];
        const reviews = (await query("SELECT * FROM reviews WHERE business_id = $1",
            [req.params.id])).rows;
        if (business) {
            res.status(200).json({
                status: "Success",
                data: {
                    business: business,
                    reviews: reviews
                }
            });
        } else {
            res.status(404).json({
                status: "Error: Businesses with the given ID was not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Submit a business
app.post("/api/businesses", async (req, res) => {
    const { name, location, price_range: priceRange } = req.body;
    if (!(name && location && priceRange)) {
        return res.status(400).json({
            status: "Bad Request. One or more of the submitted parameters are invalid/missing"
        });
    }
    try {
        const queryString = "INSERT INTO businesses (name, location, price_range) " +
            "VALUES ($1, $2, $3) RETURNING *";
        const business = (await query(queryString, [name, location, priceRange])).rows[0];
        res.status(201).json({
            status: "Successfully submitted a new business",
            data: {
                business: business
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Server error"
        });
    }
});

// Update a business
app.put("/api/businesses/:id", async (req, res) => {
    const { name, location, price_range: priceRange } = req.body;
    const id = req.params.id;
    if (!(name && location && priceRange && id)) {
        return res.status(400).json({
            status: "Bad Request. One or more of the submitted parameters are invalid/missing"
        });
    }
    try {
        const queryString = "UPDATE businesses SET name = $1, location = $2, price_range = $3 " +
            "WHERE id = $4 RETURNING *";
        const business = (await query(queryString, [name, location, priceRange, id])).rows[0];
        if (business) {
            res.status(200).json({
                status: "Successfully updated a business",
                data: {
                    business: business
                }
            });
        } else {
            res.status(404).json({
                status: "No changes made. Business with the given ID wasn't found"
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
app.post("/api/businesses/:id/addReview", async (req, res) => {
    const { rating, name, review } = req.body;
    const businessID = req.params.id;
    if (!(name && rating && review && businessID)) {
        return res.status(400).json({
            status: "Bad Request. One or more of the submitted parameters are invalid/missing"
        });
    }
    try {
        const queryString = "INSERT INTO reviews (business_id, name, review, rating) " +
            "VALUES ($1, $2, $3, $4) RETURNING *";
        const reviewInfo =
            (await query(queryString, [businessID, name, review, rating])).rows[0];
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

// Delete a business
app.delete("/api/businesses/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            status: "Bad Request. No business ID was given"
        });
    }
    try {
        const business =
            (await query("DELETE FROM businesses WHERE id = $1 RETURNING *",
            [req.params.id])).rows[0];
        if (business) {
            res.status(200).json({
                status: "Successfully deleted a business",
                data: {
                    business: business
                }
            });
        } else {
            res.status(404).json({
                status: "No changes made. Business with the given ID wasn't found"
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