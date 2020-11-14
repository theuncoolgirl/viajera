import React from "react";
import { GoogleMap, useLoadScript, Market, InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import mapStyles from "./utils/mapStyles";

// put the array containing the libraries outside of the PlaceMap component,
// because when React re-renders, arrays and objects used as literals appear to
// React as if it was a different array/object, even if it hasn't changed.
// This prevents re-rendering
const libraries = ["places"];

// The map is housed inside a container, and this determines its size. Without
// designating its dimensions, it will not show up. 
const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
}

const center = { lat: -31.4201, lng: -64.1888 }

const options = {
    styles: mapStyles
}

const PlaceMap = () => {
    // hook that loads google map scripts
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries
    })

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Map...";

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
                options={options}>
            </GoogleMap>
        </div>
    )

}

export default PlaceMap;