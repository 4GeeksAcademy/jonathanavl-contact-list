const API_URL = 'https://playground.4geeks.com/contact';
const AGENDA_SLUG = 'jonathanavl';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            contacts: [],
            contactForm: {
                name: '',
                email: '',
                phone: '',
                address: ''
            }
        },
        actions: {
            loadContacts: async () => {
                try {
                    const url = `${API_URL}/agendas/${AGENDA_SLUG}/contacts`;
                    const response = await fetch(url);
                    const data = await response.json();
            
                    if (data && Array.isArray(data.contacts)) {
                        setStore({ contacts: data.contacts });
                    }
                } catch (error) {
                    console.error('Error loading contacts:', error);
                }
            },
            setContactForm: (field, value) => {
                const store = getStore();
                setStore({
                    contactForm: {
                        ...store.contactForm,
                        [field]: value
                    }
                });
            },
            addContact: async () => {
                const store = getStore();
                try {
                    await fetch(`${API_URL}/agendas/${AGENDA_SLUG}/contacts`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(store.contactForm)
                    });
                    await getActions().loadContacts();
                    
                    // Aquí reiniciamos el formulario directamente
                    setStore({
                        contactForm: {
                            name: '',
                            email: '',
                            phone: '',
                            address: ''
                        }
                    });
                } catch (error) {
                    console.error('Error adding contact:', error);
                }
            },
            loadContactForm: (contact) => {
                setStore({
                    contactForm: {
                        id: contact.id, // Añadir el ID para actualizar un contacto existente
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone,
                        address: contact.address
                    }
                });
            },
            updateContact: async (contact_id, updatedContact) => {
                try {
                    const response = await fetch(`${API_URL}/agendas/${AGENDA_SLUG}/contacts/${contact_id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedContact)
                    });
            
                    if (!response.ok) {
                        throw new Error(`Failed to update contact. Status code: ${response.status}`);
                    }
            
                    await getActions().loadContacts();
                    
                    // Reiniciar el formulario después de actualizar el contacto
                    setStore({
                        contactForm: {
                            name: '',
                            email: '',
                            phone: '',
                            address: ''
                        }
                    });
                } catch (error) {
                    console.error('Error updating contact:', error);
                }
            },
            deleteContact: async (contact_id) => {
                try {
                    const response = await fetch(`${API_URL}/agendas/${AGENDA_SLUG}/contacts/${contact_id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
            
                    // Verificamos si la respuesta fue exitosa
                    if (!response.ok) {
                        throw new Error(`Failed to delete contact. Status code: ${response.status}`);
                    }
            
                    // Recargar los contactos después de la eliminación
                    await getActions().loadContacts();
                } catch (error) {
                    console.error('Error deleting contact:', error);
                }
            }
        }
    };
};

export default getState;
