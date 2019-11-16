import React, { Component } from "react";
import { map as _map, get as _get } from "lodash";
import { withProps } from "recompose";
import { connect } from "react-redux";
import queryString from "query-string";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

class CompareMapContent extends Component {
  render() {
    const { compareHotelList } = this.props;
    const defaultLat = _get(compareHotelList[0], "geocode.lat", null);
    const defaultLong = _get(compareHotelList[0], "geocode.long", null);
    const values = queryString.parse(location.search);

    const geoCode = JSON.parse(values.geoCode);
    const { latitude, longitude } = geoCode;
    return (
      <div>
        <GoogleMap
          defaultZoom={10}
          defaultCenter={new window.google.maps.LatLng(latitude, longitude)}
        >
          {_map(compareHotelList, (value, key) => {
            const name = _get(value, "name", null);
            const lat = _get(value, "geocode.lat", null);
            const lng = _get(value, "geocode.long", null);
            return (
              <Marker
                label={{ text: String(key + 1), color: "#fff" }}
                title={name}
                position={{ lat, lng }}
              />
            );
          })}
        </GoogleMap>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  compareHotelList: state.hotelReducer.compareHotelList,
  selectedCurrency: state.commonReducer.selectedCurrency
});

export default connect(
  mapStateToProps,
  null
)(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.GOOGLE_API_KEY +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  })(withScriptjs(withGoogleMap(CompareMapContent)))
);
