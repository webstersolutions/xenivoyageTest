import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import locationImg from '../../../asset/images/location.png';
import selectedLocation from '../../../asset/images/selected-location.png';
import ResultFilter from "../ResultFilter";
import MapHotelCard from "../../presentational/MapHotelCard";
import queryString from "query-string";

// const MY_API_KEY = "AIzaSyDZng2yRc6-MiBWPr71vQwQLrKvvqE789I";

class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        propertyList: [],
        selectedMarker: null,
        showHotelDiv: true,
        hoverHotelId: null
    };
    componentDidMount() {
        this.setState({
            propertyList: this.props.hotelList//JSON.parse(sessionStorage.getItem("filterMapHotel"))
            // selectedPlace: this.props.selectedHotel,
            // selectedMarker: this.props.selectedHotel
        });
    }
    // static getDerivedStateFromProps(props, state) {
    //     if (props.selectedHotel !== state.selectedMarker) {
    //         return {
    //             selectedMarker: props.selectedHotel,
    //             selectedPlace: { id: props.selectedHotel.id },
    //             propertyList: JSON.parse(sessionStorage.getItem("filterMapHotel"))
    //         };
    //     } else {
    //         return {
    //             propertyList: JSON.parse(sessionStorage.getItem("filterMapHotel"))
    //         };
    //     }
    // }
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });
    }


    onMapClicked = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    toggleHotelList = () => {
        this.setState({
            showHotelDiv: !this.state.showHotelDiv
        })
    }

    mouseHoverOnProperty = (hotelId) => {
        this.setState({
            hoverHotelId: hotelId
        })
    }

    loadMap = () => {
        const values = queryString.parse(window.location.search);
        const checkin = values.checkin;
        const checkout = values.checkout;
        const { showHotelDiv, hoverHotelId } = this.state;
        return (
            <div>
                <div
                    className="modal backgroundDark"
                    style={{ display: "block" }} >
                    <div className="modal-dialog" style={{ maxWidth: '95%' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Map</h4>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    onClick={this.props.closeModal}
                                >
                                    &times;
                                 </button>
                            </div>
                            <div className="modal-body">
                                <div className="mapDetails">
                                    <div className="row">
                                    <div className="col-sm-3">
                                        <ResultFilter />
                                    </div>
                                    {
                                        showHotelDiv ? (<div className="col-sm-3 pad0">
                                            <div className="mapProductListing">
                                                {
                                                    this.props.hotelList && this.props.hotelList.map((hotel, index) => {
                                                        return (<MapHotelCard
                                                            key={index}
                                                            checkout={checkout}
                                                            checkin={checkin}
                                                            hotel={hotel}
                                                            handleOnSelectRoom={this.props.handleOnSelectRoom}
                                                            // mouseHoverOnProperty={this.mouseHoverOnProperty}
                                                        />)
                                                    })
                                                }
                                            </div>
                                        </div>): null
                                    }
                                        <div className={showHotelDiv ? "divSlide open" : "divSlide"} onClick={this.toggleHotelList}></div>
                                        <div className={showHotelDiv ? "col-sm-6 pad0" : "col-sm-9 pad0"}>
                                            <div className="form-group sehereMap" style={{ height: '450px' }}>
                                            {
                                                    this.props.hotelList && this.props.hotelList.length > 0 ?
                                            (<Map
                                                google={this.props.google}
                                                style={{ width: '100%', height: '100%', position: 'relative' }}
                                                center={{
                                                    lat: this.props.hotelList[0].geocode.lat,
                                                    lng: this.props.hotelList[0].geocode.long
                                                }}
                                                onClick={this.onMapClicked}
                                            >
                                                {
                                                    this.props.hotelList && this.props.hotelList.map(hotel => {
                                                        return (<Marker
                                                            key={hotel.id}
                                                            title={hotel.name}
                                                            name={hotel.name}
                                                            id={hotel.id}
                                                            // onClick={this.onMarkerClick}
                                                            onClick={() => this.props.handleOnSelectRoom(hotel.id)}
                                                            position={{ lat: hotel.geocode.lat, lng: hotel.geocode.long }}
                                                            // animation={hotel.id === hoverHotelId ? this.props.google.maps.Animation.BOUNCE : ""
                                                            // }
                                                            icon={{
                                                                url: this.state.selectedPlace.id === hotel.id ? selectedLocation : locationImg,
                                                                anchor: this.props.google.maps.Point(10, 10),
                                                                scaledSize: this.props.google.maps.Size(15, 15)
                                                            }}
                                                        />)
                                                    })
                                                }
                                                <InfoWindow
                                                    marker={this.state.activeMarker}
                                                    visible={this.state.showingInfoWindow}
                                                >
                                                    <div>
                                                        <h4>{this.state.selectedPlace.name}</h4>
                                                    </div>
                                                </InfoWindow>
                                            </Map>) : null
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        console.log(this.props.hotelList)
        const LoadMap = this.loadMap;
        return (< LoadMap />);
    }
}
const mapStateToProps = state => ({
    hotelList: state.hotelReducer.hotelList,
    hotelCount: state.hotelReducer.hotelCount
});
// export default connect(
//   mapStateToProps,null
// )(MapContainer);
export default withRouter(connect(mapStateToProps, null)(
    GoogleApiWrapper({ apiKey: process.env.GOOGLE_API_KEY })(MapContainer)
));
