import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import mapStyles from "./utils/mapStyles";
import { thunks } from "../store/map";
import icon from "../../public/marker.svg"

// put the array containing the libraries outside of the PlaceMap component,
// because when React re-renders, arrays and objects used as literals appear to
// React as if it was a different array/object, even if it hasn't changed.
// This prevents re-rendering
const libraries = ["places"];

// The map is housed inside a container, and this determines its size. Without
// designating its dimensions, it will not show up. 
const mapContainerStyle = {
    width: '100vw',
    height: '80vh',
}

const center = { lat: -31.4201, lng: -64.1888 }

const options = {
    styles: mapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    zoomControl: true
}

// helps prevent re-renders when referencing the map


const PlaceMap = () => {
    // hook that loads google map scripts
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries
    })

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const dispatch = useDispatch();
    const getPlaces = () => dispatch(thunks.getPlaces());
    const places = useSelector(state => state.map.places)

    useEffect(() => {
        getPlaces();
    }, [dispatch]);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Map...";

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={center} //hard-coded for Cordoba current, add geolocation
                options={options}
                onLoad={onMapLoad}>
                {places.map((place) => (
                    <Marker
                        key={place.created_at}
                        position={{ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }}
                        icon={{
                            url: icon,
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                    />
                ))}
                {console.log("places: ", places)}
            </GoogleMap>
        </div>
    )

}

export default PlaceMap;