CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_range INT CHECK(price_range >= 1 AND price_range <= 5) DEFAULT 1
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses NOT NULL,
    name VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    rating INT check(rating >= 0 AND rating <=5)
);

SELECT id, name, location, price_range, count, average FROM
    (SELECT * FROM businesses LEFT JOIN
        (SELECT business_id, COUNT(*), TRUNC(AVG(rating), 1) AS average
        FROM reviews GROUP BY business_id)
    reviews ON businesses.id = reviews.business_id) AS results;