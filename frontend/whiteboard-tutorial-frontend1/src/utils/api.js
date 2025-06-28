

const API_BASE_URL = 'https://whiteboard-application-1.onrender.com/api/canvas';

export const updateCanvas = async (id, elements) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Unauthorized');
        }
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ elements }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update Canvas');
        }
        return data;
    } catch (error) {
        throw new Error(error.message || 'Failed to update Canvas');
    }
}