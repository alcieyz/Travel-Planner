import {useMap} from 'react-leaflet';
import {useEffect} from 'react';
import L from 'leaflet';

const MapController = ({bounds}) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds, map]);

    return null;
};

export default MapController;