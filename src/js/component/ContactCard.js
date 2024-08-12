import React, { useContext } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes desde 'prop-types'
import { Context } from '../store/appContext';

export const ContactCard = ({ contact }) => {
    const { actions } = useContext(Context);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            actions.deleteContact(contact.id);
        }
    };

    return (
        <div className="contact-card">
            <img src={'https://cdn.icon-icons.com/icons2/37/PNG/512/contacts_3695.png'} alt="Placeholder" />
            <h3>{contact.name}</h3>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>
            <p>{contact.address}</p>
            <div className="contact-actions">
                <button onClick={() => actions.updateContact(contact.id, contact)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

ContactCard.propTypes = {
    contact: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired
};