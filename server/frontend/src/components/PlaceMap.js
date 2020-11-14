import React from "react";
import { GoogleMap, useLoadScript, Market, InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const libraries = ["places"];
// put the array containing the libraries outside of the PlaceMap component,
// because when React re-renders, arrays and objects used as literals appear to
// React as if it was a different array/object, even if it hasn't changed.
// This prevents re-rendering

const PlaceMap = () => {
    // hook that loads google map scripts
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY,
        libraries
    })

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Map...";

    return (
        <div>
            Map
        </div>
    )

}

export default PlaceMap;