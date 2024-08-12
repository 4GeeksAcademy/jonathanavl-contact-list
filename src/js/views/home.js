import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { ContactCard } from "../component/ContactCard";
import "../../styles/home.css";

export const Home = () => {
        const { store, actions } = useContext(Context);
    
        useEffect(() => {
            actions.loadContacts();
        }, [actions]);
    
        return (
            <div className="contact-list">
                <h1>Contact List</h1>
                <Link to="/add-contact" className="add-button">Add New Contact</Link>
                <div className="contact-grid">
                    {Array.isArray(store.contacts) ? (
                        store.contacts.map(contact => (
                            <ContactCard key={contact.id} contact={contact} />
                        ))
                    ) : (
                        <p>No contacts available</p>
                    )}
                </div>
            </div>
        );
    };
    