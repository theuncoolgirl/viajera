import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, thunks } from "../store/map";


const PlaceOptions = () => {

    const dispatch = useDispatch();
    const getPlaces = () => dispatch(thunks.getPlaces());
    const places = useSelector(state => state.map.places);
    const clickedLocation = useSelector(state => state.map.clickedLocation);
    const getPlaceDetails = () => dispatch(thunks.getPlaceDetails());
    const placeDetails = useSelector(state => state.map.placeDetails);
    const createPlace = dispatch(thunks.createPlace());

    useEffect(() => {
        getPlaces();
    }, [dispatch]);

    const handlePlaceClick = (e) => {
        // console.log("CLICKING")
        e.preventDefault();
        createPlace();
        getPlaces();
    }

    const handleListClick = (e) => {
        e.preventDefault();

    }

    return (
        <div style={{ marginLeft: 20 }}>
            {!places.map((place) => place.place_id).includes(placeDetails.place_id) ?
                <div className={"placeOptions"} onClick={handlePlaceClick}>Add to Places</div> :
                <div className={"placeOptions"} onClick={handleListClick}>Add to Saved List</div>}
        </div>
    )
}

export default PlaceOptions;