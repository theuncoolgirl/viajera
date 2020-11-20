import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const libraries = ["places"];

const Search = ({ panTo }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries
    })

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Map...";

    return (
        <SearchComponent panTo={panTo} />
    )
}

function SearchComponent({ panTo }) {
    const {
        ready,
        value,
        suggestions: {
            status,
            data
        }, setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => -31.4201,
                lng: () => -64.1888
            },
            // hard coding cordoba as preferred locaion for now
            radius: 200 * 1000, //wants it in meters
        }
    })

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    }
    return (
        <div className="search">
            {/* {console.log(
                "data: ", data,
                "setValue: ", setValue
            )} */}
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Search for Places"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ place_id, description }) => (
                                <ComboboxOption key={place_id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}

export default Search