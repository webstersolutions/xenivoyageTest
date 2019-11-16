import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import locationImg from '../../../asset/images/location.png';
import selectedLocation from '../../../asset/images/selected-location.png';


// const MY_API_KEY = "AIzaSyDZng2yRc6-MiBWPr71vQwQLrKvvqE789I";

class FilterMap extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    propertyList: [],
    selectedMarker: null
  };
    componentDidMount(){
      this.setState({
        propertyList: this.props.hotelList,
        selectedPlace: this.props.selectedHotel ? { id: this.props.selectedHotel.id} : null,
        selectedMarker: this.props.selectedHotel
        });
    }
    static getDerivedStateFromProps(props, state) {
        console.log(props.selectedHotel)
        if (props.selectedHotel !== state.selectedMarker) {
          return { selectedMarker: props.selectedHotel, 
            selectedPlace: { id: props.selectedHotel.id },
            propertyList: JSON.parse(sessionStorage.getItem("maphotelList"))};
        }else{
          return {
            propertyList: JSON.parse(sessionStorage.getItem("maphotelList"))
          };
        }
      }
    
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

  loadMap = () => {
    return (
        <form>
        <div
          className="modal backgroundDark"
          style={{ display: "block" }} >
          <div className="modal-dialog" style={{maxWidth:'80%'}}>
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
                    <div className="col-sm-12">
                      <div className="form-group sehereMap" style={{height:'400px'}}>
                        {
                          this.state.selectedMarker && this.state.selectedMarker !== null ?
                            (<Map
                              google={this.props.google}
                              style={{ width: '100%', height: '100%', position: 'relative' }}
                              initialCenter={{
                                lat: this.state.selectedMarker.geocode.lat,
                                lng: this.state.selectedMarker.geocode.long
                              }}
                              onClick={this.onMapClicked}
                            >
                              {
                                this.state.propertyList && this.state.propertyList.map(hotel => {
                                  console.log(hotel)
                                  return (<Marker
                                    key={hotel.id}
                                    title={hotel.name}
                                    name={hotel.name}
                                    id={hotel.id}
                                    onClick={this.onMarkerClick}
                                    position={{ lat: hotel.geocode.lat, lng: hotel.geocode.long }}
                                    //   animation={this.props.google.maps.Animation.BOUNCE
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
      </form>

    )
  }

  render() {
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
export default withRouter(connect(mapStateToProps,null)(
    GoogleApiWrapper({ apiKey: process.env.GOOGLE_API_KEY })(FilterMap)
));
