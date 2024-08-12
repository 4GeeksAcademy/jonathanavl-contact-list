import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; 
import { Context } from '../store/appContext';
import { ContactCard } from '../component/ContactCard';

const Contact = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.loadContacts(); 
    }, [actions]);

    return (
        <div className="contact-list">
            <h1>Contacts</h1>
            <Link to="/addcontact" className="add-button">Add New Contact</Link>
            <div className="contact-grid">
                {store.contacts.length === 0 ? (
                    <p>No contacts available</p>
                ) : (
                    store.contacts.map(contact => (
                        <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                        />
                    ))
                )}
            </div>
        </div>
        
    );
};

export default Contact;