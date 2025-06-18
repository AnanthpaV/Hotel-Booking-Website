import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Experience from '../Experience';
import '../Experiences.css';

const ExperiencesPage = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/experiences');
                setExperiences(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching experiences:', error);
                setError('An error occurred while fetching experiences. Please try again.');
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) return <div className="loading">Loading experiences...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="experiences-page">
            <h1>Experiences</h1>
            <div className="experiences-grid">
                {experiences.map(experience => (
                    <Experience key={experience._id} {...experience} />
                ))}
            </div>
        </div>
    );
};

export default ExperiencesPage;