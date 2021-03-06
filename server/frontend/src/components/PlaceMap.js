import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
// import { formatRelative } from "date-fns";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import mapStyles from "./utils/mapStyles";
import { actions, thunks } from "../store/map";
import icon from "../../public/marker.svg"
import Search from "./Search";
import PlaceOptions from "./PlaceOptions";

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
    const setListDisplay = (isDisplayed) => dispatch(actions.setListDisplay(isDisplayed));
    const isDisplayed = useSelector(state => state.map.listDisplay)
    // const getPlacePhoto = () => dispatch(thunks.getPlacePhoto());
    // const placePhoto = useSelector(state => state.map.placePhoto);

    useEffect(() => {
        getPlaces();
    }, [dispatch, placeDetails]);

    const toggleListDisplay = (e) => {
        setListDisplay(!isDisplayed);
    }

    const handleClick = (e) => {
        e.stop();
        console.log("Hitting first")
        console.log("Event: ", e.placeId);
        setClickedLocation({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
            placeId: e.placeId
        });
        if (clickedLocation.placeId) {
            console.log ("Hitting here")
            getPlaceDetails();
            // getPlacePhoto();
            // toggleListDisplay();
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
                    <div style={{ color: "black", backgroundColor: "white", width: 350, height: "95vh", borderRight: "2px solid #c3d6d6", paddingRight: 10 }}>
                        <h3 style={{ marginLeft: 10 }}>{placeDetails.name}</h3>
                        <PlaceOptions />
                        {/* {toTitleCase(placeDetails.types[0].split('_').join(' '))} */}
                        <h4 style={{ marginLeft: 15 }}>Address and Contacts</h4>
                        <p style={{ marginLeft: 20 }}>{placeDetails.formatted_address}</p>
                        <p style={{ marginLeft: 20 }}>GPS: <span style={{ color: "#6a8383" }}>{placeDetails.geometry.location.lat}, {placeDetails.geometry.location.lng}</span></p>
                        <p style={{ marginLeft: 20 }}>Phone: <span style={{ color: "#6a8383" }}>{placeDetails.formatted_phone_number}</span></p>
                        <p style={{ marginLeft: 20 }}><span style={{ color: "#6a8383" }}>{placeDetails.website}</span></p>
                        {/* <p>Business Status: {placeDetails.business_status}</p> */}
                        <p style={{ marginLeft: 20 }}>Rating: <span style={{ color: "#6a8383" }}>{placeDetails.rating}</span></p>
                        {/* <ul> Reviews:
                            {placeDetails.reviews.map((review) => {
                            <li>{review.text}</li>
                        })}
                        </ul> */}
                    </div>
                    : null}
                <div style={{ width: 'auto', height: '95vh', flexGrow: 1, position: "relative" }}>
                    <Search panTo={panTo} />
                    <button
                        onClick={toggleListDisplay}
                        className={"listButton"}
                        style={{
                            position: "absolute",
                            top: "1rem",
                            right: "4rem",
                            zIndex: 10,
                        }}
                    >
                        My List</button>
                    <GoogleMap
                        id="map"
                        mapContainerStyle={mapContainerStyle}
                        zoom={13}
                        center={center} //hard-coded for Cordoba current, add geolocation
                        options={options}
                        onLoad={onMapLoad}
                        onClick={handleClick}
                    >
                        {places ? (
                        places.map((place) => (
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
                        )) ) :
                        null}
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
                {isDisplayed ?
                    <div style={{ color: "black", backgroundColor: "white", width: 350, height: "95vh", borderLeft: "2px solid #c3d6d6", paddingLeft: 10 }}>
                        <h3 style={{ marginLeft: 10 }}>My Saved Places</h3>
                        <h4 style={{ marginLeft: 15 }}>Parque Sarmiento</h4>
                        <p style={{ marginLeft: 20, color: "#6a8383" }}>Beautiful in the summer! Has a killer skatepark.</p>
                        <h4 style={{ marginLeft: 15 }}>Paseo del Jockey</h4>
                        <p style={{ marginLeft: 20, color: "#6a8383" }}>Actually a... mall?</p>
                        <h4 style={{ marginLeft: 15 }}>Universidad Technologia Nacional</h4>
                        <p style={{ marginLeft: 20, color: "#6a8383" }}>Part of the large university campus, great place to relax and drink mate with friends.</p>
                    </div>
                    : null}
            </div>
        </div >
    )
}

export default PlaceMap;