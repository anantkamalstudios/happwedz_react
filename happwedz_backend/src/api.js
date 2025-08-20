// src/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (data) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};
