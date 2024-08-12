import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

const AddContact = () => {
    // Definición del estado local para el nuevo contacto
    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleChange = (e) => {
        // Actualizar el estado con los valores de los campos del formulario
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Añadir contacto y luego actualizar la lista de contactos
            await actions.addContact(contact);
            navigate('/'); // Redirigir después de añadir el contacto
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    return (
        <div className="add-contact">
            <h2>Add New Contact</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={contact.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text" // Cambiado a 'text'
                    name="address" // Cambiado a 'address'
                    placeholder="Address" // Cambiado a 'Address'
                    value={contact.address}
                    onChange={handleChange}
                />
                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
};

export default AddContact;
