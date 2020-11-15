import axiosInstance from "../axiosApi";

const SET_PLACES = 'viajara/map/SET_PLACES'
const SET_SELECTED = 'viajara/map/SET_SELECTED'

const setPlaces = places => ({ type: SET_PLACES, places });
const setSelected = selected => ({ type: SET_SELECTED, selected });

export const actions = {
    setSelected,
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

export const thunks = {
    getPlaces,
}

const initialState = {
    selected: null
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PLACES:
            return {
                ...state,
                places: action.places
            }
        case SET_SELECTED:
            return {
                ...state,
                selected: action.selected
            }
        default:
            return state;
    }
}