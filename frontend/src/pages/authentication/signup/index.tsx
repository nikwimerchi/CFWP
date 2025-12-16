// frontend/src/pages/authentication/SignUp.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../utils/constants';
import { errorHandler } from '../../../utils/toast'; // Use your existing error handler

// Initial state matching the required fields in your CreateUserDto
const initialFormState = {
    names: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: { // Nested object matching the Mongoose schema
        district: '',
        province: '',
        sector: '',
        cell: '',
        village: '',
    },
};

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handler for all top-level input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler specifically for nested address fields
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // POST request to backend /auth/signup
            const response = await axios.post(
                `${BACKEND_URL}/auth/signup`,
                formData
            );

            // Success: Notify user to check email and redirect
            alert(response.data.message);
            navigate('/verify/success'); 

        } catch (error: any) {
            errorHandler(error); // Use your existing error handler
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl">
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Create Account</h2>
                
                {/* --- Primary Details --- */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" name="names" placeholder="Full Names" required onChange={handleChange} className="input-field" />
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="input-field" />
                    <input type="tel" name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} className="input-field" />
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="input-field" />
                </div>
                
                {/* --- Address Details (Nested) --- */}
                <h3 className="text-xl font-semibold text-gray-700 mb-3 border-t pt-4">Residential Address</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="province" placeholder="Province" required onChange={handleAddressChange} className="input-field" />
                    <input type="text" name="district" placeholder="District" required onChange={handleAddressChange} className="input-field" />
                    <input type="text" name="sector" placeholder="Sector" required onChange={handleAddressChange} className="input-field" />
                    <input type="text" name="cell" placeholder="Cell" required onChange={handleAddressChange} className="input-field" />
                    <input type="text" name="village" placeholder="Village" required onChange={handleAddressChange} className="input-field col-span-2" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
                >
                    {loading ? 'Registering...' : 'Sign Up'}
                </button>
                
                <div className="mt-4 text-center">
                    <p>Already have an account? <Link to="/signin" className="text-primary font-medium">Sign In</Link></p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;