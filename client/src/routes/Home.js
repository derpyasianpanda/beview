import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import RestaurantList from "../components/RestaurantList";
import AddRestaurant from "../components/AddRestaurant";

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    // const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    // const addRestaurants = (restaurant) => {
    //     setRestaurants([...restaurants, restaurant]);
    // };

    const addRestaurant = restaurant => {
        setRestaurants([...restaurants, restaurant]);
    }

    const deleteRestaurant = async (restaurantID) => {
        try {
            const response = await fetch(`http://localhost:8000/api/restaurants/${restaurantID}`, {
                method: "Delete"
            });
            if (response.ok) {
                setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantID));
            } else {
                throw new Error((await response.json()).status);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const getRestaurants = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/restaurants");
                if (response.ok) {
                    setRestaurants((await response.json()).data.restaurants);
                } else {
                    throw new Error((await response.json()).status)
                }
            } catch (error) {
                console.error(error);
            }
        }
        getRestaurants();
    }, []);

    return (
        <>
            <Header/>
            <AddRestaurant addRestaurant={addRestaurant}/>
            <RestaurantList restaurants={restaurants} deleteRestaurant={deleteRestaurant}/>
        </>
    );
}

export default Home;