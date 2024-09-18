import React, { useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

const AddContact = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleChange = (e) => {
        actions.setContactForm(e.target.name, e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (store.contactForm.id) {
                await actions.updateContact(store.contactForm.id, store.contactForm);
            } else {
                await actions.addContact();
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    return (
        <div className="add-contact">
            <h2>{store.contactForm.id ? 'Edit Contact' : 'Add New Contact'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={store.contactForm.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={store.contactForm.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={store.contactForm.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={store.contactForm.address}
                    onChange={handleChange}
                />
                <button type="submit">{store.contactForm.id ? 'Update Contact' : 'Add Contact'}</button>
            </form>
        </div>
    );
};

export default AddContact;