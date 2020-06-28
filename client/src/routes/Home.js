import React from "react";
import Header from "../components/Header";
import RestaurantList from "../components/RestaurantList";
import AddRestaurant from "../components/AddRestaurant";

const Home = () => {
    return (
        <>
            <Header/>
            <AddRestaurant/>
            <RestaurantList/>
        </>
    );
}

export default Home;