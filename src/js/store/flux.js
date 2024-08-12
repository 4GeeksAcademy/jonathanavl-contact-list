const API_URL = 'https://playground.4geeks.com/contact';
const AGENDA_SLUG = 'jonathanavl';

// Configura el número máximo de solicitudes y el tiempo de ventana
const MAX_REQUESTS = 60;
const WINDOW_MS = 60000; // 1 minuto
let requestCount = 0;
let resetTime = Date.now() + WINDOW_MS;

// Función para manejar el límite de tasa
const rateLimit = async (callback) => {
    const now = Date.now();

    if (now > resetTime) {
        // Reinicia el contador y el tiempo de ventana
        requestCount = 0;
        resetTime = now + WINDOW_MS;
    }

    if (requestCount >= MAX_REQUESTS) {
        // Si alcanzamos el límite, espera hasta que se reinicie el tiempo de ventana
        const waitTime = resetTime - now;
        console.log(`Límite de tasa excedido. Esperando ${waitTime / 1000} segundos.`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        requestCount = 0;
        resetTime = Date.now() + WINDOW_MS;
    }

    requestCount += 1;
    return callback();
};

// Función para manejar reintentos con retroceso exponencial
const retryFetch = async (url, options, retries = 5, delay = 1000) => {
    try {
        return await rateLimit(async () => {
            const response = await fetch(url, options);

            if (response.status === 429 && retries > 0) {
                console.log('Límite de tasa excedido. Reintentando...');
                await new Promise(resolve => setTimeout(resolve, delay));
                return retryFetch(url, options, retries - 1, delay * 2);
            }

            if (!response.ok) {
                throw new Error(`¡Error HTTP! Estado: ${response.status}`);
            }

            return await response.json();
        });
    } catch (error) {
        console.error('Error de fetch:', error);
        throw error;
    }
};


const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            contacts: []
        },
        actions: {
            loadContacts: async () => {
                try {
                    console.log('Fetching contacts...');
                    const url = `${API_URL}/agendas/${AGENDA_SLUG}/contacts`;
                    const response = await retryFetch(url);
                    console.log('Raw API response:', response);
            
                    if (response && Array.isArray(response.contacts)) {
                        setStore({ contacts: response.contacts });
                    } else {
                        console.error('Unexpected data format:', response);
                    }
                } catch (error) {
                    console.error('Error loading contacts:', error);
                }
            },
            addContact: async (contact) => {
                try {
                    await rateLimit(() =>
                        fetch(`${API_URL}/agendas/${AGENDA_SLUG}/contacts`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(contact)
                        })
                    );
                    await getActions().loadContacts();
                } catch (error) {
                    console.error('Error adding contact:', error);
                }
            },
            updateContact: async (contact_id, updatedContact) => {
                try {
                    await rateLimit(() =>
                        fetch(`${API_URL}/agendas/${AGENDA_SLUG}/contacts/${contact_id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedContact)
                        })
                    );
                    await getActions().loadContacts();
                } catch (error) {
                    console.error('Error updating contact:', error);
                }
            },
            deleteContact: async (contact_id) => {
                try {
                    await rateLimit(() =>
                        fetch(`${API_URL}/agendas/${AGENDA_SLUG}/contacts/${contact_id}`, {
                            method: 'DELETE'
                        })
                    );
                    await getActions().loadContacts();
                } catch (error) {
                    console.error('Error deleting contact:', error);
                }
            }
        }
    };
};

export default getState;
