import axiosInstance from "../axiosApi";

const SET_PLACES = 'viajara/map/SET_PLACES'

const setPlaces = places => ({ type: SET_PLACES, places });

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

export const thunks = {
    getPlaces
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_PLACES:
            return {
                ...state,
                places: action.places
            }
        default:
            return state;
    }
}