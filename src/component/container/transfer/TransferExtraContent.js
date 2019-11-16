import React, { Component } from "react";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import openNewTab from "../../../asset/images/dashboard/resize.png";
import img_carUser from "../../../asset/images/dashboard/carUser.png";
import img_luggage from "../../../asset/images/dashboard/luggage.png";
import img_info from "../../../asset/images/Important Information.svg";
import img_clock from "../../../asset/images/clock.svg";
import img_drag from "../../../asset/images/selectRoom/drag.png";
import img_transfer from "../../../asset/images/chauffeur.png";
import _find from "lodash/find";
import _get from "lodash/get";
import { transferSearch, transferBook } from "../../../service/transfer/action";
import { addItinerary } from "../../../service/addCart/action";
import {
  loadingGifSearch,
  stopGifSearching
} from "../../../service/common/action";
import {
  DragSource,
  ConnectDragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";
import moment from "moment";

import Map from "./component/Map";

class TransferExtraContent extends Component {
  state = {
    selectedTaxi: {},
    startPoint: {},
    endPoint: {},
    origin: "",
    destination: "",
    date: "",
    pickUpTime: "",
    luggage: "",
    passenger: "",
    animals: "",
    flightNo: "",
    phoneNo: null,
    selectedCountry: JSON.parse(sessionStorage.getItem("countryInfo")),
    contactValid: false,
    contactError: "",
    vehicle: ""
  };

  componentDidMount() {
    const payload = queryString.parse(this.props.location.search);
    const vehicle = _get(payload, "vehicle", null);
    const startPoint = _get(payload, "startPointGeocode", {});
    const endPoint = _get(payload, "endPointGeocode", {});
    const selectedTaxi = _find(
      this.props.transferList,
      list => list.id === vehicle
    );
    const origin = _get(payload, "searchString", "");
    const destination = _get(payload, "end_point", "");
    const date = _get(payload, "start_time_date", "");
    let pickUpTime = _get(payload, "start_time_time", "");
    pickUpTime = moment(pickUpTime, "H:mm").format("hh:mm a");
    const luggage = _get(payload, "luggage", "");
    const passenger = _get(payload, "passengers", "");
    const animals = _get(payload, "animals", "");
    const flightNo = _get(payload, "flightNo", "");
    const pickTime = _get(payload, "pickUpTime", "");
    const dropOffTime = _get(payload, "dropOffTime", "");

    if (selectedTaxi) {
      this.setState({
        selectedTaxi,
        pickTime,
        dropOffTime
      });
    } else {
      this.props.transferSearch({
        ...queryString.parse(this.props.location.search),
        currencySymbol: this.props.currencySym,
        currency: this.props.selectedCurrency,
        email: this.props.loginDetails ? this.props.loginDetails.email : null,
      });
    }

    this.setState({
      startPoint: JSON.parse(startPoint),
      endPoint: JSON.parse(endPoint),
      origin,
      destination,
      date,
      pickUpTime,
      luggage,
      passenger,
      animals,
      flightNo,
      dropOffTime,
      pickTime
    });

    const loginInfo = sessionStorage.getItem("loginInfo");
    // if (loginInfo) {
    //     this.props.initialize({
    //         email: _get(JSON.parse(loginInfo), 'email'),
    //     })
    // }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.transfetList !== nextProps.transferList) {
      const vehicle = _get(
        queryString.parse(this.props.location.search),
        "vehicle",
        null
      );

      if (vehicle) {
        this.setState({
          selectedTaxi: _find(
            nextProps.transferList,
            list => list.id === vehicle
          )
        });
      }
    }
  }

  onTaxiSelect = selectedTaxi => {
    let queryStringlocal = queryString.parse(this.props.location.search);
    console.log(":::::::::::::::::::::::: queryStringlocal", queryStringlocal);
    if (selectedTaxi.id) {
      console.log(":::::::::::::::::::::::::::", selectedTaxi.id);
      this.setState({
        ...this.state,
        vehicle: selectedTaxi.id
      });
      queryStringlocal.vehicle = this.state.vehicle;
    }
    this.props.history.push(
      "/transfer/confirm?" +
        queryString.stringify({
          ...queryStringlocal
        })
    );
  };

  mobileItinerary = () => {
    this.props.loadingGifSearch();
    const { transferList } = this.props;
    const payload = queryString.parse(this.props.location.search);
    const vehicle = _get(payload, "vehicle", null);
    const selectedTaxi = _find(transferList, list => list.id === vehicle);;
    
    const data = {
      type: "transferCar",
      price: selectedTaxi.totalAmount,
      title: selectedTaxi.car_model,
      subtitle: selectedTaxi.vehicle_type,
      currency: selectedTaxi.currency_symbol,
      bookingData: {
        ...selectedTaxi,
        ...queryString.parse(this.props.location.search),
        currency: selectedTaxi.currency_code
      },
      searchString: queryString.parse(this.props.location.search)
    };
    this.props.stopGifSearching();
    this.props.addToItinerary(data)
  }

  render() {
    const { selectedTaxi, origin, destination } = this.state;
    const years = [],
      year = new Date().getFullYear();

    for (let i = year; i < year + 15; i++) {
      years.push(i);
    }
    const { connectDragSource } = this.props;

    return [
      connectDragSource(
        <div>
          <div className="selectRoomBg d-flex flex-wrap Transfers-Card">
            <div className="selectRoomTitle">
              <h4>
                Drive Info <img src={openNewTab} />
              </h4>
            </div>
            <div className="selectRoomItemsBg carSelRoom">
              <div className="d-flex flex-row smallColumn  carCard">
                <div className="flex-column carImgDiv align-self-center">
                  <div>
                    <img src={img_transfer} style={{width:'45px',float: 'right'}} />
                  </div>
                  <div className="carImageOnly">
                    <img src={selectedTaxi.image_url} className="carImgWid" />
                  </div>
                  <div className="carInfoDiv">
                    <img src={img_info} />
                    <p> Important Information about your rental</p>
                    <div className="moreDetailToolTip">
                      <p>
                        <div className="InfoHover">
                          <h6>About Various Cars</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            Limousines: All our limousine transfers include
                            fixed price, automated flight tracking, 24/7 support
                            hotline and pickup with name sign in the arrival
                            hall.
                            <br />
                            Additional luggage, such as sports equipment or
                            child seat are available for limousine transfers.
                          </p>

                          <h6>How can I change a booking?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            You can email us with the change request and we will
                            accommodate your request as soon as possible.
                          </p>
                          <h6>How can I cancel a booking?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            You can cancel the booking from your dashboard as
                            per the cancellation policy.
                          </p>
                          <h6>How much luggage can I bring?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            You can bring up to 8 pieces of luggage in our
                            biggest cars with you assuming that every piece
                            piece has the size of 55 (22”) x 45 (18”) x 25
                            (10”). Normally, our passenger cars such as Sedans
                            can fit 3 pieces of luggage in the above-mentioned
                            size, our MPVs fit in 6 and vans take up to 8.
                            Remember to specify the amount of luggage you can
                            bring while making a reservation.
                          </p>
                          <h6>Can you provide a child seat?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            Yes! We provide child seats for children from 3 to 6
                            years and from 6 to 12 years. To make sure that the
                            child seat is provided just add it while booking. On
                            the web, after entering basic details like pickup
                            and dropoff spots, click on “More details” and
                            choose an arrow next to the baby icon and choose the
                            number and option that suits you best. We advise to
                            repeat that you need children seats in the message
                            to the driver at the end of the booking, but
                            remember that first of all you need to mark child
                            seats in “More details” as above.
                            <br />
                            If you write about the children seats only in the
                            message to the driver, they cannot be guaranteed.
                            Please note that the driver can carry only 2
                            children seats at once.
                          </p>

                          <h6>Pickup, the ride and dropoff</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            You will get the name, surname and telephone number
                            of your driver in an SMS until 30 minutes before the
                            pickup time.
                          </p>
                          <h6>How can I be sure that my car is coming?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            Once you have received a booking confirmation via
                            email a car is immediately reserved for you. That
                            car may change depending on availability, but the
                            exact details of the driver and type of car will be
                            sent to you via email and SMS right before your
                            pickup time. This means that you can easily find and
                            contact your driver if necessary.
                          </p>
                          <h6>What happens if I am late?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            As soon as you notice that you might be late, please
                            contact your driver directly and notify him about
                            your delay. You can easily find the driver’s phone
                            number in the email and SMS sent to you just prior
                            to the ride. If you should forget to notify the
                            driver about your delay, he will wait for you until
                            the included waiting time has passed. If you don’t
                            arrive within the allocated waiting time without
                            informing the driver or calling our Support, you
                            will be charged a special fee for not showing up.
                            The no-show fee for Quality Taxis is the base fee
                            (based on the regional taxi tariff) plus 15 minutes
                            waiting time. This may vary depending on the region
                            and country rules. The no show fee for Limousine
                            bookings is the full fare of the ride.
                          </p>
                          <h6>What do I do if my driver is late?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            Call the driver directly to see where they are. You
                            find their phone number in the SMS you received
                            before your ride with all the driver details. If you
                            cannot get in touch with your driver please call our
                            Support number where one of our Agents will help you
                            to find your driver.
                          </p>
                          <h6>How will I recognise the driver?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            For limousine bookings, we normally send the driver
                            your name and surname that will appear on your
                            pickup sign. You can also specify the text that will
                            appear on your pickup sign while booking your ride.
                            Once you come into the arrivals hall, just search
                            for your pickup sign, your driver will be holding
                            it.
                          </p>
                          <h6>What if my destination changed last minute?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            Please notify the driver about your new destination.
                            In some situations, the fact that you changed the
                            dropoff point, may incur additional costs.
                          </p>
                          <h6>
                            Can I bring additional passengers in the car on the
                            spot?
                          </h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            The answer is yes if the car booked has the capacity
                            to take more people in. If it’s not possible we will
                            ask you to stick with the data you originally
                            provided. The same happens if you bring more luggage
                            than initially stated and the driver will not be
                            able to fit it or with any short-notice request that
                            we won’t be able to accommodate.
                            <br />
                            If you have any special requests it would be best to
                            write them in the special requests box when placing
                            a booking and we will do what we can to meet your
                            needs.
                          </p>

                          <h6>
                            I just took my McDonald’s takeaway right before the
                            pickup, can I eat it during the ride?
                          </h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            We want to keep the cars in the highest standard and
                            to be able to maintain it, we would ask you not to
                            eat or drink in the vehicle during the ride. We
                            would also like to kindly remind you that smoking is
                            not allowed. Please remember that if you cause any
                            damage in/to the car, you will be asked to cover the
                            additional costs.
                          </p>
                          <h6>
                            What if I provide incorrect flight number and want
                            to change it?
                          </h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            If your ride’s distance is less than 70 km, you can
                            change it directly in your account for free until 3
                            hours before the indicated pickup time. If you
                            booked an hourly ride or exceeding 70 km, you can
                            change the flight number in your account until 24
                            hours before indicated pickup time.
                          </p>
                          <h6>What if my flight is delayed?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            For limousine transfers, the driver will track your
                            flight and wait for you at the airport at the actual
                            flight arrival time. It’s is our specialty.
                          </p>
                          <h6>
                            Why do you pick up when the flight lands? I will
                            need time to go through immigration!
                          </h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            In order to provide you with a seamless pickup
                            experience, the limousine driver is tracking your
                            flight and will be at the airport at your flight
                            arrival time. Please note that we offer free waiting
                            time for limousine transfers of 45 minutes for our
                            Economy rides, 60 minutes for Business rides and 90
                            minutes for First Class rides. This is counted from
                            your flight arrival time. You can add additional
                            buffer time in a message to the driver whilst
                            booking or contact our support after you have
                            booked. If you need to exceed the waiting time at
                            the last moment we will do our best to accommodate
                            your request, but please note that we cannot
                            guarantee that the driver will be able to wait
                            longer than previously agreed. In case of exceeding
                            included waiting time, additional fees specified in
                            your confirmation shall apply. In the case of
                            Quality Taxi transfers, please contact your driver
                            if you want them to wait, but please note that in
                            this case, additional fees will apply.
                          </p>
                          <h6>
                            My flight was diverted, but then it came back to the
                            original airport. Will my driver still be there?
                          </h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            Unless you got in contact with the driver and told
                            them to leave the airport, they will wait for you.
                            Yet, whenever such unpredicted circumstances as
                            flight diversion occur please always reach us at +49
                            30 346 497 360 as soon as you have the signal.
                          </p>
                          <h6>Where does the driver pick me up?</h6>
                          <p
                            style={{ fontWeight: "initial", fontSize: "12px" }}
                          >
                            A detailed information about your specific meeting
                            point at the airport will be provided in your
                            booking confirmation email. For most of the airports
                            the driver will be waiting for you after the baggage
                            claim, however it might vary from airport to
                            airport. For other locations the driver shall pick
                            you up from the address booked, usually in front of
                            the building.
                          </p>
                        </div>
                      </p>
                    </div>
                    
                  </div>
                  <div style={{paddingTop: "10px"}}>
                    <b>Cancellation Policy&nbsp;<i className="fas fa-angle-double-down" /></b>
                    <h6 style={{ fontSize: "11px", fontWeight: "600", paddingTop: "5px" }}>
                        You can cancel the Transfer 24 Hrs before your travel.
                    </h6>
                  </div>
                </div>
                <div className="detailsBg flex-column carInfo pl-5">
                  <h6> {selectedTaxi.car_model}</h6>
                  <ul className="carCategories">
                    <li>{selectedTaxi.vehicle_type}</li>
                    <li>{selectedTaxi.booking_category}</li>
                  </ul>

                  <ul className="carInfraStru" style={{ width: "299px" }}>
                    <li>
                      <img src={img_carUser} /> {selectedTaxi.seats}
                    </li>
                    {/*<li>
                                        <img src={img_clock}/> {selectedTaxi.included_waiting_time} mins
                                    </li>*/}
                    <li>
                      <img src={img_luggage} /> {selectedTaxi.luggage}
                    </li>
                  </ul>
                  <ul className="pickupDropDet">
                    <li>
                      <h6>Pick-Up</h6>
                      <p>{origin}</p>
                    </li>
                    <li>{this.state.pickUpTime}</li>
                    <li>
                      <h6>Transfer Inclusions</h6>
                      <p>1. Meet & Greet</p>
                      <p>
                        2. Wating Time {selectedTaxi.included_waiting_time} mins
                      </p>
                      <p>3. Fixed Price ,Toll Included</p>
                    </li>
                  </ul>
                  <ul className="pickupDropDet">
                    <li>
                      <h6>Drop-Off</h6>
                      <p>{destination}</p>
                    </li>
                    <li>{this.state.dropOffTime}</li>
                  </ul>
                </div>
                <div
                  className="rateShowDiv flex-column"
                  style={{ position: "relative" }}
                >
                  <div className="priceDiv">
                    <h2>
                      {" "}
                      {selectedTaxi["currency_symbol"]}{" "}
                      {selectedTaxi["totalAmount"]}
                     
                    </h2>
                    <span style={{fontSize:"11px",float:"right"}}>  per transfer</span>
                  
                    {/* ToDo Implement  */}
                  </div>
                  <div className="add-to-itinerary">
                      <button onClick={this.mobileItinerary}>ADD TO ITINERARY</button>
                  </div>
                  <div className="dragAndDrop pl-4 pt-5">
                    <img src={img_drag} />
                    <span>Drag and Drop</span>
                  </div>
                  <div className="text-right" onClick={this.onTaxiSelect} style={{position:"absolute",bottom:"0px",right:"0px"}}>
                    <button
                      type="button"
                      className="selectRoomBtn reserveBtn"
                      onClick={() => this.onTaxiSelect(selectedTaxi)}
                      style={{padding:"9px 22px"}}
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      <div>
        <div className="selectRoomBg d-flex flex-wrap">
          <div className="flex-column m-2" style={{ width: "100%" }}>
            <Map
              startPoint={this.state.startPoint}
              endPoint={this.state.endPoint}
            />
          </div>
        </div>
      </div>
    ];
  }
}

const mapStateToProps = state => ({
  transferList: state.transferReducer.transferList,
  taxiTravelDistance: state.transferReducer.taxiTravelDistance,
  bookingNumber: state.transferReducer.bookingNumber,
  selectedCurrency: state.commonReducer.selectedCurrency,
  currencySym: state.commonReducer.currencySym,
  loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
  transferSearch: searchInfo => dispatch(transferSearch(searchInfo)),
  transferBook: bookInfo => dispatch(transferBook(bookInfo)),
  addToItinerary: itPay => dispatch(addItinerary(itPay)),
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching())
});

const __itemSource = {
  canDrag(props) {
    // You can disallow drag based on props
    //   return !_includes(_map(props.itineraryList, 'refId'),
    //     props.refId);
    return true;
  },
  beginDrag(props) {
    const { transferList } = props;
    const payload = queryString.parse(props.location.search);
    const vehicle = _get(payload, "vehicle", null);
    const selectedTaxi = _find(transferList, list => list.id === vehicle);
    return {
      type: "transferCar",
      price: selectedTaxi.totalAmount,
      title: selectedTaxi.car_model,
      subtitle: selectedTaxi.vehicle_type,
      currency: selectedTaxi.currency_symbol,
      bookingData: {
        ...selectedTaxi,
        ...queryString.parse(props.location.search),
        currency: selectedTaxi.currency_code
      },
      searchString: queryString.parse(props.location.search)
    };
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
  }
};
const __collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DragSource("ROOM", __itemSource, __collect)(TransferExtraContent))
);
