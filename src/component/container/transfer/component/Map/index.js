import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    DirectionsRenderer,
} from "react-google-maps";
import _get from 'lodash/get';

const MapWithADirectionsRenderer = compose(
    withProps({
        // googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZng2yRc6-MiBWPr71vQwQLrKvvqE789I&v=3.exp&libraries=geometry,drawing,places",
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.GOOGLE_API_KEY + "&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidMount() {
            const DirectionsService = new window.google.maps.DirectionsService();
            const origin = _get(this.props, 'startPoint');
            const destination = _get(this.props, 'endPoint');

            DirectionsService.route({
                origin: new window.google.maps.LatLng(origin.latitude, origin.longitude),
                destination: new window.google.maps.LatLng(destination.latitude, destination.longitude),
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,
                    });
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    })
)(props =>
    <GoogleMap
        defaultZoom={10}
        defaultCenter={new window.google.maps.LatLng(_get(props, 'startPoint.latitude'), _get(props, 'startPoint.longitude'))}
    >
        {console.log('props=====', props)}
        {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
);

export default MapWithADirectionsRenderer;