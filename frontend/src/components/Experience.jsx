import React from 'react';
import { Link } from 'react-router-dom';
import './Experiences.css';

const Experience = ({ _id, title, description, location, price, image }) => {
    return (
        <div className="experience-card">
            <img src={image} alt={title} className="experience-image" />
            <div className="experience-details">
                <h2 className="experience-title">{title}</h2>
                <p className="experience-location">{location}</p>
                <p className="experience-description">{description}</p>
                <p className="experience-price">${price}</p>
                <Link to={`/experiences/${_id}`} className="experience-link">View Details</Link>
            </div>
        </div>
    );
};

export default Experience;