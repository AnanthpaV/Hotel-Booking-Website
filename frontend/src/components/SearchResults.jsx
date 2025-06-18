import axios from "axios";
import React, { useEffect, useState } from "react";
import './searchResults.css'; 
import { Link, useLocation } from "react-router-dom";

export default function SearchResults() {
    const location = useLocation();
    const { query: initialQuery, checkIn: initialCheckIn, checkOut: initialCheckOut, guests: initialGuests } = location.state || {};
    
    const [searchResults, setSearchResults] = useState({
        matching: [],
        remaining: []
    });
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [query, setQuery] = useState(initialQuery || '');
    const [checkIn, setCheckIn] = useState(initialCheckIn || '');
    const [checkOut, setCheckOut] = useState(initialCheckOut || '');
    const [guests, setGuests] = useState(initialGuests || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setSearchResults({ matching: [], remaining: [] });
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch search results
                const response = await axios.get(`http://localhost:3000/api/search`, {
                    params: {
                        query,
                        checkIn: checkIn ? new Date(checkIn).toISOString() : null,
                        checkOut: checkOut ? new Date(checkOut).toISOString() : null,
                        guests
                    },
                });

                setSearchResults(response.data);

                // Fetch nearby places if we have matching results
                if (response.data.matching.length > 0) {
                    const firstPlace = response.data.matching[0];
                    const nearbyResponse = await axios.get(`http://localhost:3000/api/nearby`, {
                        params: { address: firstPlace.address }
                    });
                    setNearbyPlaces(nearbyResponse.data);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('Failed to fetch search results. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, checkIn, checkOut, guests]);

    const renderPlaceCard = (place) => (
        <Link to={'/place/' + place.id} key={place.id}>
            <div className="place-card">
                <div className="place-photo">
                    {place.photo && (
                        <img src={place.photo} alt={place.title} />
                    )}
                </div>
                <div className="place-info">
                    <h2 className="place-title">{place.title}</h2>
                    <h3 className="place-address">{place.address}</h3>
                    <p className="place-price">₹{place.price} per night</p>
                    
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return <div className="loading">Loading search results...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="index-page">
            {/* Matching Results Section */}
            {searchResults.matching.length > 0 && (
                <div className="matching-results">
                    <h2 className="section-title">Best Matches</h2>
                    <div className="results-grid">
                        {searchResults.matching.map(renderPlaceCard)}
                    </div>
                </div>
            )}

            {/* Other Results Section */}
            {searchResults.remaining.length > 0 && (
                <div className="other-results">
                    <h2 className="section-title">Other Places You Might Like</h2>
                    <div className="results-grid">
                        {searchResults.remaining.map(renderPlaceCard)}
                    </div>
                </div>
            )}

            {/* Nearby Places Section */}
            {nearbyPlaces.length > 0 && (
                <div className="nearby-places">
                    <h2 className="section-title">Nearby Places</h2>
                    <div className="results-grid">
                        {nearbyPlaces.map(renderPlaceCard)}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {!loading && 
             searchResults.matching.length === 0 && 
             searchResults.remaining.length === 0 && (
                <div className="no-results">
                    <p>No results found. Please try a different search.</p>
                </div>
            )}
        </div>
    );
}