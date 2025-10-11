const API_BASE_URL = 'https://happywedz.com/api';

export const einviteApi = {
    // Get all e-invites
    getAllEinvites: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/einvites/cards`);
            console.log("response -> ", response);
            if (!response.ok) throw new Error('Failed to fetch e-invites');
            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return result;
        } catch (error) {
            console.error('Error fetching e-invites:', error);
            throw error;
        }
    },

    // Get e-invites by category
    getEinvitesByCategory: async (category) => {
        try {
            const allCards = await einviteApi.getAllEinvites();
            const categoryMap = {
                'Wedding E-Invitations': 'wedding_einvite',
                'Video Invitations': 'video_invite',
                'Save The Date': 'save_the_date'
            };
            const mappedCategory = categoryMap[category] || category;
            return allCards.filter(card => card.cardType === mappedCategory);
        } catch (error) {
            console.error('Error fetching e-invites by category:', error);
            throw error;
        }
    },

    // Get single e-invite by ID
    getEinviteById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/einvites/cards/${id}`);
            if (!response.ok) throw new Error('Failed to fetch e-invite');
            return await response.json();
        } catch (error) {
            console.error('Error fetching e-invite:', error);
            throw error;
        }
    },

    // Create new e-invite
    createEinvite: async (einviteData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/einvites/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(einviteData),
            });
            if (!response.ok) throw new Error('Failed to create e-invite');
            return await response.json();
        } catch (error) {
            console.error('Error creating e-invite:', error);
            throw error;
        }
    },

    // Update e-invite
    updateEinvite: async (id, einviteData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/einvites/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(einviteData),
            });
            if (!response.ok) throw new Error('Failed to update e-invite');
            return await response.json();
        } catch (error) {
            console.error('Error updating e-invite:', error);
            throw error;
        }
    },

    // Delete e-invite
    deleteEinvite: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/einvites/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete e-invite');
            return await response.json();
        } catch (error) {
            console.error('Error deleting e-invite:', error);
            throw error;
        }
    },

    // Get user's e-invites
    getUserEinvites: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/einvites`);
            if (!response.ok) throw new Error('Failed to fetch user e-invites');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user e-invites:', error);
            throw error;
        }
    },

    // Search e-invites
    searchEinvites: async (query) => {
        try {
            const response = await fetch(`${API_BASE_URL}/einvites/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search e-invites');
            return await response.json();
        } catch (error) {
            console.error('Error searching e-invites:', error);
            throw error;
        }
    },

    // Get categories
    getCategories: async () => {
        try {
            // Since the categories endpoint doesn't exist, return default categories
            return [
                { value: 'Wedding E-Invitations', label: 'Wedding Cards' },
                { value: 'Video Invitations', label: 'Video Cards' },
                { value: 'Save The Date', label: 'Save The Date' }
            ];
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return default categories even if there's an error
            return [
                { value: 'Wedding E-Invitations', label: 'Wedding Cards' },
                { value: 'Video Invitations', label: 'Video Cards' },
                { value: 'Save The Date', label: 'Save The Date' }
            ];
        }
    }
};
