import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import StateLessRoomResContent from "../../container/hotel/StateLessRoomResContent";
import StateLessCarConfirmContent from "../../container/car/StateLessCarConfirmContent";
import StateLessTransferConfirmContent from "../../container/transfer/StateLessTransferConfirmContent";
import StateLessActivityConfirmContent from "../../container/activity/StateLessActivityConfirmContent";
import MulipleBookingPayment from "./MulipleBookingPayment";
import TopNav from "../../container/TopNav";
import {sendingEmailDetails} from "../../../service/addCart/action";

import {
  loadingGifSearch,
  stopGifSearching
} from "../../../service/common/action";

import MultipleContext from "./context";

import { replaceItinerary } from "../../../service/addCart/action";

class MultipleBookingView extends Component {
  state = {
    startDate: "",
    endDate: "",
    allBookingPayloadCar: [],
    allBookingPayloadHotel: [],
    allBookingPaymentDetails: [],
    allBookingPayloadTransfer: [],
    allBookingPayloadActivity: [],
    errorItinerary: false
  };
  componentDidMount() {

let emailDetails =this.props.itineraryList
this.props.sendingEmailDetails(emailDetails);
  }
  componentDidUpdate() {
    const element = document.getElementById("payment-tab");
    if(element !=null){
      element.scrollIntoView({behavior: 'smooth'});
    }
    
  }

  payloadBuildHotel = (hotelData) => {
    const {
      adult,
      checkin,
      checkout,
      child,
      currency,
      hotelId,
      searchText,
      sessionId
    } = hotelData.searchString;

    let roomCount = [];
    let recomId = [];

    hotelData.bookingData.room.map((value, i) => {
      roomCount.push(value.roomCount);
      recomId.push(value.recommendations.id);
    });

    return {
      adult,
      checkin,
      checkout,
      child,
      currency,
      hotelId,
      searchText,
      sessionId,
      startDate: checkin,
      endDate: checkout,
      recomId,
      roomCount
    };
  };


  bookingDataUpdateActivity = dataToUpdate => {
    if (dataToUpdate) {
      let arrayAllActivity = this.state.allBookingPayloadActivity;
      arrayAllActivity.push(dataToUpdate);

      this.setState({
        allBookingPayloadActivity: arrayAllActivity
      });
    }
  };
  bookingDataUpdateCar = dataToUpdate => {
    if (dataToUpdate) {
      let arrayAllCar = this.state.allBookingPayloadCar;
      arrayAllCar.push(dataToUpdate);
      this.setState({
        allBookingPayloadCar: arrayAllCar
      });
    }
  };

  bookingDataUpdateTransfer = dataToUpdate => {
      if(dataToUpdate) {
        let { allBookingPayloadTransfer } = this.state;
        allBookingPayloadTransfer.push(dataToUpdate);
        this.setState({
          allBookingPayloadTransfer,
        })
      }
  };

  bookingDataUpdateHotel = dataToUpdate => {
    if (dataToUpdate) {
      let arrayAllHotel = this.state.allBookingPayloadHotel;
      arrayAllHotel.push(dataToUpdate);
      this.setState({
        allBookingPayloadHotel: arrayAllHotel
      });
    }
  };
  bookingDataUpdatePayment = data => {
    this.setState({
      allBookingPaymentDetails: data
    });
  };
  render() {
    const { itineraryList } = this.props;
    return (
      <div>
        <h6 STYLE="text-align: right;">
          My Itinerary ({itineraryList.length})
        </h6>
        <MultipleContext.Provider
          value={{
            allBookingPayloadCar: this.state.allBookingPayloadCar,
            allBookingPayloadHotel: this.state.allBookingPayloadHotel,
            allBookingPaymentDetails: this.state.allBookingPaymentDetails,
            allBookingPayloadTransfer: this.state.allBookingPayloadTransfer,
            allBookingPayloadActivity: this.state.allBookingPayloadActivity,
            onAddCar: dataToUpdate => {
              this.bookingDataUpdateCar(dataToUpdate);
            },
            onAddHotel: dataToUpdate => {
              this.bookingDataUpdateHotel(dataToUpdate);
            },
            addUpdatedPaymentResult: data => {
              this.bookingDataUpdatePayment(data);
            },
            onAddTransfer: dataToUpdate => {
              this.bookingDataUpdateTransfer(dataToUpdate);
            },
            onAddActivity: dataToUpdate => {
              this.bookingDataUpdateActivity(dataToUpdate);
            }
          }}
        >
          <div>
            {itineraryList.map((valueItinery, i) => {
              let load;
              if (i == 0) {
                load = {
                  start: () => this.props.loadingGifSearch(),
                  stop: () => this.props.stopGifSearching(),
                  mount: true
                };
              } else if (i == itineraryList.length - 1) {
                load = {
                  start: () => this.props.loadingGifSearch(),
                  stop: () => this.props.stopGifSearching(),
                  mount: false
                };
              } else {
                load = null;
              }

              if (valueItinery.type.includes("hotel")) {
                return (
                  <MultipleContext.Consumer>
                    {({ onAddHotel }) => {
                      return (
                        !this.state.errorItinerary && (
                          <StateLessRoomResContent
                            bookingSequence={+i + 1}
                            errorCatch={() =>
                              this.setState({ errorItinerary: true })
                            }
                            load={load}
                            addData={onAddHotel}
                            itineryData={valueItinery}
                            queryValue={this.payloadBuildHotel(valueItinery)}
                          />
                        )
                      );
                    }}
                  </MultipleContext.Consumer>
                );
              } else if (valueItinery.type.includes("car")) {
                return (
                  <MultipleContext.Consumer>
                    {({ onAddCar }) => {
                      return (
                        !this.state.errorItinerary && (
                          <StateLessCarConfirmContent
                            bookingSequence={+i + 1}
                            errorCatch={() =>
                              this.setState({ errorItinerary: true })
                            }
                            load={load}
                            addData={onAddCar}
                            itineryData={valueItinery}
                            queryValue={valueItinery.searchString}
                          />
                        )
                      );
                    }}
                  </MultipleContext.Consumer>
                );
              } else if (valueItinery.type.includes("transferCar")) {
                return (
                    <MultipleContext.Consumer>
                      {({ onAddTransfer }) => {
                        return (
                            !this.state.errorItinerary && (
                                <StateLessTransferConfirmContent
                                    bookingSequence={+i + 1}
                                    errorCatch={() =>
                                        this.setState({ errorItinerary: true })
                                    }
                                    // load={load}
                                    addData={onAddTransfer}
                                    itineryData={valueItinery}
                                />
                            )
                        );
                      }}
                    </MultipleContext.Consumer>
                );
              } else if (valueItinery.type.includes("activity")) {
                return (
                    <MultipleContext.Consumer>
                      {({ onAddActivity }) => {
                        return (
                            !this.state.errorItinerary && (
                                <StateLessActivityConfirmContent
                                    bookingSequence={+i + 1}
                                    errorCatch={() =>
                                        this.setState({ errorItinerary: true })
                                    }
                                    // load={load}
                                    addData={onAddActivity}
                                    itineryData={valueItinery}
                                />
                            )
                        );
                      }}
                    </MultipleContext.Consumer>
                );
              }
            })}
            {this.state.errorItinerary &&  this.props.itineraryList.length != 0 &&  <div className="otherSectionBg modal-body paymentError">
              <div className="socialBtnGroup" />
              <span className="erroricon"><i class="fas fa-exclamation-triangle"></i></span>
              <br/>
              {/* <p>Please clear itinerary and add again.</p> */}
              <p>Your itinerary session has been expired,Please clear itinerary and try again.</p>
              <button
                type="button"
                className="goBack"
                onClick={()=>{
                  this.props.replaceItinerary()
                  this.props.history.push('/hotel')}}>Clear</button>
            </div>}
            {!this.state.errorItinerary && this.props.itineraryList.length != 0 &&<div className="d-flex flex-wrap otherSectionBg" id="payment-tab">
              <MulipleBookingPayment />
            </div>}
          </div>
        </MultipleContext.Provider>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  //isSearching: state.hotelReducer.isSearching,
  selectedCurrency: state.commonReducer.selectedCurrency,
  itineraryList: state.addcartReducer.itineraryList
});
const mapDispatchToProps = dispatch => ({
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching()),
  replaceItinerary: () => dispatch(replaceItinerary([])),
  sendingEmailDetails: payload => dispatch(sendingEmailDetails(payload))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MultipleBookingView));
// export default RoomReservation;
