
import React, { useState } from 'react';
import { FaList, FaTh, FaMapMarkerAlt } from 'react-icons/fa';


const ViewSwitcher = () => {
    const [view, setView] = useState('images');

    return (
        <div className="col-3 col-lg-3 ms-auto">
            <div className="view-switcher-wrapper">
                <div className="view-switcher">
                    <button
                        className={`switch-btn ${view === 'list' ? 'active' : ''}`}
                        onClick={() => setView('list')}
                    >
                        <FaList className="me-1" /> List
                    </button>
                    <button
                        className={`switch-btn ${view === 'images' ? 'active' : ''}`}
                        onClick={() => setView('images')}
                    >
                        <FaTh className="me-1" /> Images
                    </button>
                    <button
                        className={`switch-btn ${view === 'map' ? 'active' : ''}`}
                        onClick={() => setView('map')}
                    >
                        <FaMapMarkerAlt className="me-1" /> Map
                    </button>
                </div>


            </div>
        </div>
    );
};

export default ViewSwitcher;
