import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import session from "./session";
import message from "./message";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
    session,
    message
});

const storeEnhancer = composeEnhancers(applyMiddleware(thunk));

const configureStore = (initialState) => {
    return createStore(
        reducer,
        initialState,
        storeEnhancer
    );
};

export default configureStore;