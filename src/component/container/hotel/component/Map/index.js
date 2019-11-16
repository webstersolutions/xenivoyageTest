import React, { Component } from "react";
import PropTypes from "prop-types";
import { withProps } from "recompose";
import { connect } from "react-redux"
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
import _map from 'lodash/map';
import _uniqBy from 'lodash/uniqBy';
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';

import MarkerWithLabel from '../../../../../asset/images/marker-with-label.svg';
import MarkerWithLabelActive from '../../../../../asset/images/marker-with-label-active.svg';
import queryString from "query-string";
import moment from "moment";

const currencies = require('country-data').currencies;

import img_yellowstars_0 from "../../../../../asset/images/yellowStar0.png";
import img_yellowstars_1 from "../../../../../asset/images/yellowStar1.png";
import img_yellowstars_2 from "../../../../../asset/images/yellowStar2.png";
import img_yellowstars_3 from "../../../../../asset/images/yellowStar3.png";
import img_yellowstars_4 from "../../../../../asset/images/yellowStar4.png";
import img_yellowstars_5 from "../../../../../asset/images/yellowStar5.png";

const imageMap = [
    img_yellowstars_0,
    img_yellowstars_1,
    img_yellowstars_2,
    img_yellowstars_3,
    img_yellowstars_4,
    img_yellowstars_5
];

const maxZoom = 15;

class MapWithHotels extends Component {

    state = {
        selectedHotel: null,
        currentImage: 0,
    };

    onInfoBox = false;

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.hotelList && nextProps.hotelList.length > 0 && !_isEqual(this.props.hotelList, nextProps.hotelList)) {
            this.ref.panTo(
                new window.google.maps.LatLng(nextProps.hotelList[0].geocode.lat, nextProps.hotelList[0].geocode.long)
            )
        }

        if (nextProps.topIndexHotel && nextProps.topIndexHotel !== this.props.topIndexHotel) {
            const topHotel = _find(nextProps.hotelList, hotel => hotel.id === nextProps.topIndexHotel);

            if (topHotel) {
                this.ref.panTo(
                    new window.google.maps.LatLng(topHotel.geocode.lat, topHotel.geocode.long)
                )
            }
        }

        if (nextProps.forceSearch) {
            const values = queryString.parse(location.search);
            values.lat = this.ref.getCenter().lat();
            values.lng = this.ref.getCenter().lng();
            values.premise = '';
            values.radius = this.calculateRadius();
            this.props.history.push(
                "/hotelMapView/search?" + queryString.stringify(values)
            );
            nextProps.disableForceSearch();
        }
    };

    onMarkerClick = hotel => {
        this.setState({
            selectedHotel: hotel,
        })
    };

    onLeaveMarker = () => {
        if (!this.onInfoBox) {
            this.setState({
                selectedHotel: null
            });
        }
    };

    previousImage = () => {
        const { currentImage, selectedHotel } = this.state;

        if (selectedHotel !== null) {
            if (currentImage === 0) {
                this.setState({
                    currentImage: selectedHotel.images.length - 1
                })
            } else {
                this.setState({
                    currentImage: currentImage - 1,
                })
            }
        }
    };

    nextImage = () => {
        const { currentImage, selectedHotel } = this.state;

        if (selectedHotel !== null) {
            if (currentImage === selectedHotel.images.length - 1) {
                this.setState({
                    currentImage: 0
                })
            } else {
                this.setState({
                    currentImage: currentImage + 1,
                })
            }
        }
    };

    onOverChangeImage = () => {
        this.onInfoBox = true;
    };

    onLeaveChangeImage = () => {
        this.onInfoBox = false;
    };

    onZoomChange = () => {
        const values = queryString.parse(location.search);
        values.lat = this.ref.getCenter().lat();
        values.lng = this.ref.getCenter().lng();
        values.premise = '';
        values.radius = this.calculateRadius();
        if(this.props.moveMap){
            this.props.history.push(
                "/hotelMapView/search?" + queryString.stringify(values)
            );
        } else {
            this.props.locationChanged(true);
        }
    };

    onDragEnd = () => {
        const values = queryString.parse(location.search);
        values.lat = this.ref.getCenter().lat();
        values.lng = this.ref.getCenter().lng();
        values.premise = '';
        values.radius = this.calculateRadius();
        if(this.props.moveMap){
            this.props.history.push(
                "/hotelMapView/search?" + queryString.stringify(values)
            );
        } else {
            this.props.locationChanged(true);
        }
        
    };

    calculateRadius = () => {
        let radius = null;

        if (this.ref) {
            const zoom = this.ref.getZoom();
            const getZoom = Math.min(maxZoom, zoom);
            const diff = maxZoom - getZoom;
            radius = diff > 0 && diff <= 5
                ? diff * 5
                : diff === 0 ? 5 : 25;
        }

        return radius;
    };

    handleOnSelectRoom = hotelId => {

        sessionStorage.setItem("roomURL", "");
        sessionStorage.setItem("reserveURL", "");

        const {sessionId, selectedCurrency} = this.props;

        const values = queryString.parse(window.location.search);
        const {
            checkin,
            checkout,
            adult,
            child,
            childAgeValues,
            searchText
        } = values;

        const searchString = {
            currency: selectedCurrency,
            sessionId,
            hotelId,
            checkin,
            checkout,
            adult,
            child,
            childAgeValues,
            searchText
        };

        window.open("/hotel/rooms?" + queryString.stringify(searchString), '_blank')
    };

    render() {
        const values = queryString.parse(location.search);
        const {
            checkin,
            checkout,
        } = values;
        const geoCode = JSON.parse(values.geoCode);
        const noOfNights = moment(checkout).diff(moment(checkin), 'days');
        const { selectedHotel } = this.state;

        return <GoogleMap
            defaultZoom={14}
            defaultCenter={new window.google.maps.LatLng(geoCode.latitude, geoCode.longitude)}
            ref={ref => { this.ref = ref }}
            onZoomChanged={this.onZoomChange}
            options={{
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.LEFT_BOTTOM
                },
                gestureHandling:'greedy'
            }}
            onClick={this.onLeaveMarker}
            onDragEnd={this.onDragEnd}
        >
            {this.props.hotelList && this.props.hotelList.length > 0 && _map(_uniqBy(this.props.hotelList, 'id'), hotel => <Marker
                position={{ lat: hotel.geocode.lat, lng: hotel.geocode.long }}
                title={hotel.name}
                label={{
                    text: `${currencies[this.props.selectedCurrency].symbol}${(hotel.basefare / noOfNights).toFixed(2)}`,
                    color: this.props.activeHotel === hotel.id ? '#fff' : '#000',
                    fontWeight: 'bold',
                }}
                icon={{
                    url: this.props.activeHotel === hotel.id ? MarkerWithLabelActive : MarkerWithLabel,
                }}
                onClick={() => this.onMarkerClick(hotel)}
            >
                {selectedHotel && selectedHotel.id === hotel.id &&
                    <InfoBox
                        onCloseClick={this.onLeaveMarker}
                        options={{
                            pixelOffset: new window.google.maps.Size(-150, -255),
                            position: new window.google.maps.LatLng(
                                hotel.geocode.lat,
                                hotel.geocode.long
                            ),
                            enableEventPropagation: true
                        }}
                        alignBottom={true}
                    >
                        <div style={{paddingLeft:"4px",paddingTop:"4px"}} onMouseOver={this.onOverChangeImage} onMouseLeave={this.onLeaveChangeImage}>
                            <div
                              class="card"
                              style={{ width: "18rem", height: "auto",border:"none" }}
                            >
                              <div className="popCaroselImage">
                                <img
                                  class="card-img-top"
                                  src={
                                    this.state.selectedHotel.images[
                                      this.state.currentImage
                                    ].URL
                                  }
                                  alt="Card image cap"
                                  style={{height:"185px"}}
                                />
                                <span
                                  className="leftArrow"
                                  style={{ }}
                                  onClick={this.previousImage}
                                >
                                  <i className="fas fa-chevron-left" />
                                </span>
                                <span
                                  className="rightArrow"
                                  style={{ }}
                                  onClick={this.nextImage}
                                >
                                  <i className="fas fa-chevron-right" />
                                </span>
                              </div>

                              <div onClick={() => this.handleOnSelectRoom(hotel.id)} class="card-body" style={{padding:"6px"}}>
                                <p class="card-text">
                                  <h5 class="card-title" style={{fontSize:"14px",margin:"3px 0px"}}>{hotel.name}</h5>

                                  <img
                                    style={{ width: "65px" }}
                                    src={imageMap[Math.floor(hotel.rating)]}
                                    alt=""
                                  />
                                  <span style={{ position: "relative", top: "2px" }}>
                                    <b>{hotel.rating}</b> of 5
                                  </span>
                                  <div
                                  class="card-header"
                                  style={{ float: "right", borderRadius: "46px",padding:"1px 8px",border:"none",fontWeight:"900" }}
                                >{`${currencies[this.props.selectedCurrency].symbol}${(
                                  hotel.basefare / noOfNights
                                ).toFixed(2)}/night`}</div>
                                </p>

                              </div>
                            </div>
                        </div>

                    </InfoBox>}
            </Marker>)}
        </GoogleMap>
    }
}

const mapStateToProps = state => ({
    hotelList: state.hotelReducer.hotelList,
    selectedCurrency: state.commonReducer.selectedCurrency,
    sessionId: state.hotelReducer.sessionId,
});

export default connect(
    mapStateToProps,null
)(withProps({
    // googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZng2yRc6-MiBWPr71vQwQLrKvvqE789I&v=3.exp&libraries=geometry,drawing,places",
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.GOOGLE_API_KEY + "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div className="response"/>,
})(withScriptjs(withGoogleMap(MapWithHotels))));
