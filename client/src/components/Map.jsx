import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import './Map.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapController from './MapController';
import {useAuth} from "../AuthContext";
import { HiOutlineSearch } from "react-icons/hi";

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const Map = () => {
    const { username, isLoggedIn } = useAuth();
    const [markers, setMarkers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewMarker, setPreviewMarker] = useState(null);
    const [bounds, setBounds] = useState(null);
    const defaultPosition = [51.505, -0.09];

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchMarkers();
        }
    }, []);

    const fetchMarkers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyMap?username=${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch markers');
            }
            const data = await response.json();
            setMarkers(data);
        } catch (error) {
            console.error('Error fetching markers:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error('Failed to search location');
            }
            const data = await response.json();
            if (data.length > 0) {
                const {lat, lon, boundingbox, display_name} = data[0];
                const position = [parseFloat(lat), parseFloat(lon)];
                setPreviewMarker({position, name: display_name});
                const bounds = [
                    [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
                    [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])],
                ];
                setBounds(bounds);
            } else {
                alert('Location not found');
            }
        } catch (error) {
            console.error('Error searching location:', error);
        }
    };

    const confirmAddMarker = async () => {
        if (previewMarker) {
            try {
                const response = await fetch('http://localhost:5000/MyMap', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username,
                        lat: previewMarker.position[0],
                        lng: previewMarker.position[1],
                        name: previewMarker.name,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to save marker');
                }

                fetchMarkers();
                setPreviewMarker(null);
                setSearchQuery('');
            } catch (error) {
                console.error('Error saving marker:', error);
            }
        }
    };

    const deleteMarker = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/MyMap/${id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username}),
            });

            if (!response.ok) {
                throw new Error('Failed to delete marker');
            }

            fetchMarkers();
        } catch (error) {
            console.error('Error deleting marker:', error);
        }
    };

    return (
        <div className="map-component-container">
            <div className="map-form">
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        className='map-search-bar'
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter a place"
                        required
                    />
                    <button type="submit">Search</button>
                </form>
                {previewMarker && (
                    <div className='confirm-btn'>
                        <button onClick={confirmAddMarker}>Add Marker</button>
                    </div>
                )}
            </div>
            <MapContainer center={defaultPosition} zoom={2.2} className="map-container">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                
                {previewMarker && (
                    <Marker position={previewMarker.position}>
                        <Popup>Preview: {previewMarker.name}</Popup>
                    </Marker>
                )}

                {markers.map((marker) => (
                    <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                        <Popup>
                            {marker.name}
                            <br></br>
                            <button onClick={() => deleteMarker(marker.id)}>Delete Marker</button>
                        </Popup>
                    </Marker>
                ))}
                <MapController bounds={bounds} />
            </MapContainer>
        </div>
    );
};

export default Map;