import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
// import { formatRelative } from "date-fns";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import mapStyles from "./utils/mapStyles";
import { actions, thunks } from "../store/map";
import icon from "../../public/marker.svg"
import Search from "./Search";

import "@reach/combobox/styles.css";

// put the array containing the libraries outside of the PlaceMap component,
// because when React re-renders, arrays and objects used as literals appear to
// React as if it was a different array/object, even if it hasn't changed.
// This prevents re-rendering
const libraries = ["places"];

// Designate map dimensions
const mapContainerStyle = {
    width: 'auto',
    height: '95vh',
}

// hard coding Cordoba as center for now
const center = { lat: -31.4201, lng: -64.1888 }

const options = {
    styles: mapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    zoomControl: true
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

// const infoWindowOptions = {
//     pixelOffset: new google.maps.Size(0, -30)
// }

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

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
    }, []);

    const dispatch = useDispatch();
    const getPlaces = () => dispatch(thunks.getPlaces());
    const places = useSelector(state => state.map.places);
    const setSelectedMarker = (selectedMarker) => dispatch(actions.setSelectedMarker(selectedMarker));
    const selectedMarker = useSelector(state => state.map.selectedMarker);
    const setClickedLocation = (clickedLocation) => dispatch(actions.setClickedLocation(clickedLocation));
    const clickedLocation = useSelector(state => state.map.clickedLocation);
    const getPlaceDetails = () => dispatch(thunks.getPlaceDetails());
    const placeDetails = useSelector(state => state.map.placeDetails);
    // const getPlacePhoto = () => dispatch(thunks.getPlacePhoto());
    // const placePhoto = useSelector(state => state.map.placePhoto);

    useEffect(() => {
        getPlaces();
    }, [dispatch, placeDetails]);

    const handleClick = (e) => {
        e.stop();
        console.log("Event: ", e.placeId);
        setClickedLocation({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
            placeId: e.placeId
        });
        if (clickedLocation.placeId) {
            getPlaceDetails();
            // getPlacePhoto();
            console.log("Place Details: ", placeDetails);
        } else {
            console.log("No place Id")
        }
    }

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Map...";

    return (
        <div>

            <div style={{ display: "flex" }}>
                {placeDetails ?
                    <div style={{ color: "black", backgroundColor: "white", width: "30vw", height: "95vh" }}>
                        <p>{placeDetails.name}</p>
                        <p>{toTitleCase(placeDetails.types[0].split('_').join(' '))}</p>
                        <p>Address and Contacts</p>
                        <p>{placeDetails.formatted_address}</p>
                        <p>GPS: {placeDetails.geometry.location.lat}, {placeDetails.geometry.location.lng}</p>
                        <p>Phone: {placeDetails.formatted_phone_number}</p>
                        <p>Website: {placeDetails.website}</p>
                        <p>Business Status: {placeDetails.business_status}</p>
                        <p>User Rating: {placeDetails.rating}</p>
                        {/* <ul> Reviews:
                            {placeDetails.reviews.map((review) => {
                            <li>{review.text}</li>
                        })}
                        </ul> */}
                    </div>
                    : null}
                <div style={{ width: 'auto', height: '95vh', flexGrow: 1, position: "relative" }}>
                    <Search panTo={panTo} />
                    <GoogleMap
                        id="map"
                        mapContainerStyle={mapContainerStyle}
                        zoom={13}
                        center={center} //hard-coded for Cordoba current, add geolocation
                        options={options}
                        onLoad={onMapLoad}
                        onClick={handleClick}
                    >
                        {places.map((place) => (
                            <Marker
                                key={place.created_at}
                                position={{ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }}
                                icon={{
                                    url: icon,
                                    scaledSize: new window.google.maps.Size(30, 30)
                                }}
                                onClick={() => {
                                    setSelectedMarker(place);
                                }}
                            />
                        ))}
                        {/* {selectedMarker ? (
                            <InfoWindow
                                position={{
                                    lat: parseFloat(selectedMarker.latitude),
                                    lng: parseFloat(selectedMarker.longitude)
                                }}
                                options={{ pixelOffset: new google.maps.Size(0, -20) }}
                                onCloseClick={() => {
                                    setSelectedMarker(null)
                                }}
                            >
                                <div>
                                    <p style={{ color: "black" }}>Placeholder for Info Window</p>
                                </div>
                            </InfoWindow>
                        ) : null} */}
                    </GoogleMap>
                </div>
            </div>
        </div>
    )
}

export default PlaceMap;