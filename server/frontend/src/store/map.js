import axiosInstance from "../axiosApi";

const SET_PLACES = 'viajara/map/SET_PLACES'
const SET_SELECTED_MARKER = 'viajara/map/SET_SELECTED_MARKER'
const SET_CLICKED_LOCATION = 'viajara/map/SET_CLICKED_LOCATION'
const SET_PLACE_DETAILS = 'viajara/map/SET_PLACE_DETAILS'
const SET_PLACE_PHOTO = 'viajara/map/SET_PLACE_PHOTO'

const setPlaces = places => ({
    type: SET_PLACES,
    places
});
const setPlaceDetails = details => ({
    type: SET_PLACE_DETAILS,
    details
})
const setPlacePhoto = photo => ({
    type: SET_PLACE_PHOTO,
    photo
})
const setSelectedMarker = selectedMarker => ({
    type: SET_SELECTED_MARKER,
    selectedMarker
});
const setClickedLocation = clickedLocation => ({
    type: SET_CLICKED_LOCATION,
    clickedLocation
});

export const actions = {
    setSelectedMarker,
    setClickedLocation
}

const getPlaces = () => {
    return async dispatch => {
        try {
            let response = await axiosInstance.get('/place/');
            const places = response.data
            dispatch(setPlaces(places));
        } catch (error) {
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
}

const getPlaceDetails = () => {
    return async (dispatch, getState) => {
        const { map: { clickedLocation: { placeId } } } = getState();
        const proxyurl = 'https://cors-anywhere.herokuapp.com/';
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,types,formatted_address,geometry,formatted_phone_number,business_status,opening_hours,website,rating,reviews,price_level,photos&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`
        let response = await fetch(proxyurl + url)
        try {
            if (response.status >= 200 && response.status < 400) {
                const data = await response.json();
                const details = data.result
                dispatch(setPlaceDetails(details));
                // const firstPhotoRef = details.photos[0].photo_reference;
                // let photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${firstPhotoRef}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`
                // let photoResponse = await fetch(proxyurl + photoURL)
                // try {
                //     if (photoResponse.status >= 200 && photoResponse.status < 400) {
                //         const photoData = await photoResponse.json();
                //         console.log("Photo Data: ", photoData)
                //         // dispatch(setPlacePhoto(details));
                //     } else {
                //         console.error('Bad response');
                //     }
                // } catch (e) {
                //     console.error(e);
                // }
            } else {
                console.error('Bad response');
            }
        } catch (e) {
            console.error(e);
        }
    }
}

const getPlacePhoto = () => {
    return async (dispatch, getState) => {
        const { map: { placeDetails: { photos } } } = getState();
        const firstPhotoRef = photos[0].photo_reference;
        const proxyurl = 'https://cors-anywhere.herokuapp.com/';
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${firstPhotoRef}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`
        let response = await fetch(proxyurl + url)
        try {
            if (response.status >= 200 && response.status < 400) {
                const data = await response.json();
                console.log("Photo Response: ", data)
                // dispatch(setPlaceDetails(details));
            } else {
                console.error('Bad response');
            }
        } catch (e) {
            console.error(e);
        }
    }
}


export const thunks = {
    getPlaces,
    getPlaceDetails,
    getPlacePhoto
}

const initialState = {
    selectedMarker: null,
    clickedLocation: {
        latitude: null,
        longitude: null,
        placeId: null
    },
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PLACES:
            return {
                ...state,
                places: action.places
            }
        case SET_PLACE_DETAILS:
            return {
                ...state,
                placeDetails: action.details
            }
        case SET_PLACE_PHOTO:
            return {
                ...state,
                placePhoto: action.photo
            }
        case SET_CLICKED_LOCATION:
            return {
                ...state,
                clickedLocation: action.clickedLocation
            }
        case SET_SELECTED_MARKER:
            return {
                ...state,
                selectedMarker: action.selectedMarker
            }
        default:
            return state;
    }
}