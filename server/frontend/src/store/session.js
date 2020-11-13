import axiosInstance from "../axiosApi";

// const SET_USERNAME = "viajara/session/SET_USER";
// const SET_PASSWORD = "viajara/session/SET_PASSWORD";
const SET_ERRORS = 'viajara/session/SET_ERRORS';

// const setUsername = user => ({ type: SET_USERNAME, user });
// const setPassword = password => ({ type: SET_PASSWORD, password });
const setErrors = errors => ({ type: SET_ERRORS, errors });

export const actions = {
    // setUsername,
    // setPassword,
    setErrors
}

const login = (username, password) => {
    console.log(username, password)
    return async dispatch => {
        const response = await axiosInstance.post('/token/obtain/',
            { username: username, password: password }
        );
        if (response.status === 401) {
            let errors = await response.json()
            dispatch(setErrors(errors))
        }
        // if (response.ok) {
        axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
        console.log(response)
        return response
        // }

    }
}

export const thunks = {
    login,
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        // case SET_USERNAME:
        //     return {
        //         ...state,
        //         username: action.value
        //     }
        // case SET_PASSWORD:
        //     return {
        //         ...state,
        //         password: action.value
        //     }
        case SET_ERRORS:
            return {
                ...state,
                errors: action.value
            }
        default:
            return state;
    }
}