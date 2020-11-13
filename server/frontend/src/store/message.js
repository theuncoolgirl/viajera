import axiosInstance from "../axiosApi";

const SET_MESSAGE = 'viajara/message/SET_MESSAGE';

const setMessage = message => ({ type: SET_MESSAGE, message });

const getMessage = () => {
    return async dispatch => {
        try {
            let response = await axiosInstance.get('/hello/');
            const message = response.data.hello;
            dispatch(setMessage(message));
            return message;
        } catch (error) {
            window.location.href = '/login/';
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
}

export const thunks = {
    getMessage
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_MESSAGE:
            return {
                ...state,
                message: action.message
            }
        default:
            return state;
    }
}