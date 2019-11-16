import React, {Component} from "react";
import {connect} from "react-redux";
import {filter as _filter} from "lodash";
import propTypes from "prop-types";

import img_hotel from "../../../asset/images/hotel-building.png";
import img_car from "../../../asset/images/car.png";
import img_transfer from "../../../asset/images/chauffeur.png";
import img_activities from "../../../asset/images/activities.png";
import {tripDeatiledList} from "../../../service/dashboard/action";
import {tripCarDeatiledList} from "../../../service/car/action";
import {tripTransferDeatiledList} from "../../../service/transfer/action";
import {getActivityTrips} from "../../../service/activities/action";
import TripCard from "./trips/TripCard";
import CarTripCard from "./trips/CarTripCard";
import TransferTripCard from "./trips/TransferTripCard";
import ActivityTripCard from "./trips/ActivityTripCard";

;


class DBTrips extends Component {

    componentDidMount() {
        const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
        console.log(userSession)
        const {email} = userSession;
        const data = {
            email
        };
        this.props.tripDeatiledList(data);
        this.props.cartripDeatiledList({email: email});
        this.props.transfertripDeatiledList({email: email});
        this.props.getActivityTrips(email);
    }

    componentWillReceiveProps(nextProps) {
        window.scrollTo(0,0);
        if (this.props.location.search === "?hotel") {
            this.hotel()

        }
        else if (this.props.location.search === "?car") {
            this.car()

        }
        else if (this.props.location.search === "?transfer") {
            this.transfer()
        }
        else if (this.props.location.search === "?activity") {
            this.activity()
        }
    }

    state = {
        isCancelled: false,
        cancellationPolicyInfo: [],
        displayHotel: true,
        displayCar: false,
        displayTransfer: false,
        displayActivity: false
    };

    bookingCancel = data => {
        this.setState({cancellationPolicyInfo: data});
        this.setState({isCancelled: true});
    };

    rmvHtmlFunc = str => {
        if (str !== undefined) {
            if (str === null || str === "") return "No Description Available";
            else str = str.toString();
            return str.replace(/<[^>]*>/g, "");
        }
    };

    close = () => {
        this.setState({isCancelled: false});
    };

    hotel = () => {
        this.setState({displayHotel: true});
        this.setState({displayCar: false});
        this.setState({displayTransfer: false});
        this.setState({displayActivity: false});
    };

    car = () => {
        this.setState({displayHotel: false});
        this.setState({displayCar: true});
        this.setState({displayTransfer: false});
        this.setState({displayActivity: false});
    };

    transfer = () => {
        this.setState({displayHotel: false});
        this.setState({displayCar: false});
        this.setState({displayTransfer: true});
        this.setState({displayActivity: false});
    };

    activity = () => {
        this.setState({displayHotel: false});
        this.setState({displayCar: false});
        this.setState({displayTransfer: false});
        this.setState({displayActivity: true});
    };

    render() {
        const {isCancelled, cancellationPolicyInfo, displayHotel, displayCar, displayTransfer, displayActivity} = this.state;
        const {
            transferMyTrips,
            myTripList,
            carMyTrips,
            hotel,
            fareBreakup,
            rooms,
            rates,
            searchDate,
            activityTripList
        } = this.props;
        const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
        
        const {email,name} = userSession;

        console.log(activityTripList)
        let a = {color: "#565656", fontSize: "14px", cursor: "pointer"}
        let b = {color: "#FF9800", fontSize: "14px", cursor: "pointer", fontWeight: "200"}


        return (
            <div className="dashRightSide align-self-start">
                {/* {renderCancelModal} */}

                <div className="mytripTable">
                    <div className="table-responsive">
                        <div class="container">
                            <div
                                class="row"
                                style={{
                                    textAlign: "center",
                                    marginBottom: "25px",
                                    borderBottom: "1px solid #a1a1a1",
                                    padding: " 10px"
                                }}
                            >
                                <div class="col-sm">
                  <span
                      className="color"
                      style={displayHotel === true ? b : a}
                      onClick={this.hotel}
                  >
                    <img src={img_hotel} width="11%"/> Hotels
                  </span>
                                </div>
                                <div class="col-sm">
                  <span
                      className="color_Title"
                      style={displayCar === true ? b : a}

                      onClick={this.car}
                  >
                    <img src={img_car} width="11%"/> Cars
                  </span>
                                </div>
                                <div className="col-sm">
                  <span className="color_Title" style={displayTransfer === true ? b : a} onClick={this.transfer}>
                    <img src={img_transfer} width="11%"/>
                    Transfer
                  </span>
                                </div>
                                <div className="col-sm">
                  <span className="color_Title" style={displayActivity === true ? b : a} onClick={this.activity}>
                    <img src={img_activities} width="11%"/>
                    Activities
                  </span>
                                </div>
                            </div>
                        </div>
                        <table>
                            <thead>
                            {displayTransfer &&
                            <tr>
                                <th>Sl</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Date Booked</th>
                                <th>Travel Date</th>
                                <th width="90px">Price</th>
                                <th> Xeniapp Booking Id</th>
                                <th> Booking Status</th>
                            </tr>
                            }
                            {displayHotel &&
                            <tr>
                                <th>Sl</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Date Booked</th>
                                <th>Travel Date</th>
                                <th width="90px">Price</th>
                                <th> Xeniapp Booking Id</th>
                                {/* <th> Co-relation Id</th> */}
                                <th> Cancellation Id</th>
                                <th> Booking Status</th>
                            </tr>
                            }

                            {displayCar &&
                            <tr>
                                <th>Sl</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Date Booked</th>
                                <th>Travel Date</th>
                                <th width="90px">Price</th>
                                <th> Xeniapp Booking Id</th>
                                <th> Supplier Confirmation Id</th>
                                <th> Cancellation Id</th>
                                <th> Booking Status</th>
                            </tr>
                            }

                            {/* Screen For Activity*/}
                            {
                                displayActivity &&
                                <tr>
                                    <th>Sl</th>
                                    {/* <th>Distributor Ref ID</th>
                                    <th>Distributor Item Ref ID</th> */}
                                    <th>Xeniapp Booking Id</th>
                                    <th>Departs From</th>
                                    <th>Departure Point</th>
                                    <th>Date Booked</th>
                                    <th>Travel Date</th>
                                    <th width="90px">Price</th>
                                    
                                    <th> Booking Status</th>
                                </tr>
                            }
                            </thead>
                            <tbody id="accordion">


                            {displayHotel && myTripList &&
                            myTripList.length != 0 &&
                            _filter(myTripList.reverse(), {booking_type: "Hotel"}).map(
                                (item, i) => (
                                    <TripCard
                                        id={"accordion"}
                                        className={"hoteltab"}

                                        rmvHtmlFunc={this.rmvHtmlFunc}
                                        onCancel={this.bookingCancel}
                                        key={i}
                                        index={i}
                                        type={"hotel"}
                                        TransList={item}
                                    />
                                )
                            )}


                            {displayCar && carMyTrips &&
                            carMyTrips.length != 0 &&
                            carMyTrips.map((data, i) => {
                                return <CarTripCard key={i} index={i} carDetails={data} id="car"  email={email} name={name} />;
                            })}


                            {displayTransfer && transferMyTrips &&
                            transferMyTrips.length != 0 &&
                            transferMyTrips.map((data, i) => {
                                return (
                                    <TransferTripCard
                                        id="transfer"
                                        key={i}
                                        index={i}
                                        transferDetails={data}
                                       
                                    />
                                );
                            })}


                            {/* TODO : Need to integrated once car and flight booking completed */}


                            {
                                carMyTrips &&
                                myTripList &&
                                transferMyTrips &&
                                transferMyTrips.length == 0 &&
                                carMyTrips.length == 0 &&
                                myTripList.length == 0 && (
                                    <tr>
                                        <td colSpan="8">
                                            <h5>No trips available</h5>
                                        </td>
                                    </tr>
                                )}


                            {displayActivity && activityTripList && activityTripList.length !== 0 && activityTripList.reverse().map(
                                (item, i) => (
                                    <ActivityTripCard id={"accordion"} className={"hoteltab"}
                                                      rmvHtmlFunc={this.rmvHtmlFunc} onCancel={this.bookingCancel}
                                                      key={i} index={i} ActivityList={item}/>
                                )
                            )}


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    myTripList: state.dashboardReducer.myTripList,
    hotel: state.hotelReducer.hotel,
    searchDate: state.hotelReducer.searchDate,
    pricedTotalFare: state.hotelReducer.pricedTotalFare,
    fareBreakup: state.hotelReducer.fareBreakup,
    rates: state.hotelReducer.rates,
    rooms: state.hotelReducer.rooms,
    loginDetails: state.loginReducer.loginDetails,
    carMyTrips: state.carReducer.carMyTrips,
    transferMyTrips: state.transferReducer.transferMyTrips,
    activityTripList: state.activityReducer.activityTripList
});

const mapDispatchToProps = dispatch => ({
    tripDeatiledList: data => dispatch(tripDeatiledList(data)),
    cartripDeatiledList: data => dispatch(tripCarDeatiledList(data)),
    transfertripDeatiledList: data => dispatch(tripTransferDeatiledList(data)),
    getActivityTrips: data => dispatch(getActivityTrips(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DBTrips);

DBTrips.propTypes = {
    onCancel: propTypes.func
};

//Reference

{
    /* <tbody id="accordion">
  {myTripList && myTripList.length ?
    _filter(myTripList, { 'booking_type': 'Hotel' }).map((item, i) =>
      <TripCard key={i} index={i} type={'hotel'}
        TransList={item} />) : <p>No Trips Found</p>}
   TODO : Need to integrated once car and flight booking completed
   <TripCard index='1' type={'car'}
    TransList={_filter(myTripList, { 'booking_type': 'Car' })} />
  <TripCard index='2' type={'flight'}
    TransList={_filter(myTripList, { 'booking_type': 'Flight' })} />
  </tbody> */
}
