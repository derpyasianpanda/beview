import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import Header from "../components/Header";
import BusinessList from "../components/BusinessList";
import AddBusiness from "../components/AddBusiness";

const Home = () => {
    const [ businesses, setBusinesses ] = useState([]);

    const addBusiness = business => {
        setBusinesses([...businesses, business]);
    };

    const deleteBusiness = async (businessID, event) => {
        event.stopPropagation();
        try {
            const response = await fetch(`http://localhost:8000/api/businesses/${businessID}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setBusinesses(businesses.filter(business => business.id !== businessID));
                NotificationManager.success("Successfully Deleted a Business",
                    "Deletion Success");
            } else {
                throw new Error((await response.json()).status);
            }
        } catch (error) {
            console.error(error);
            NotificationManager.error(error.message, "Error", 3000);
        }
    };

    // Only fetches Business List on component mounting
    useEffect(() => {
        const getBusinesses = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/businesses");
                if (response.ok) {
                    setBusinesses((await response.json()).data.businesses);
                } else {
                    throw new Error((await response.json()).status)
                }
            } catch (error) {
                console.error(error);
                NotificationManager.error("Could not retrieve Businesses. Please Refresh",
                    "Major Error", 5000);
            }
        }
        getBusinesses();
    }, []);

    return (
        <>
            <Header/>
            <AddBusiness addBusiness={addBusiness}/>
            <BusinessList businesses={businesses} deleteBusiness={deleteBusiness}/>
        </>
    );
};

export default Home;