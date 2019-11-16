import React from "react";
import img_tick from "../../../asset/images/bookingConfirm/checked.png";
import img_print from "../../../asset/images/dashboard/print.png";
import img_download from "../../../asset/images/download-icon.jpg";
import img_arrow from "../../../asset/images/bookingConfirm/Shapearrow.png";
import img_info from "../../../asset/images/information.png";
import img_help from "../../../asset/images/CVV Help.png";
import img_carUser from '../../../asset/images/dashboard/carUser.png';
import img_luggage from '../../../asset/images/dashboard/luggage.png';
import img_Time from "../../../asset/images/Time.svg";


import queryString from "query-string";
import moment from "moment";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Footer from "../../Footer";
import TopNav from "../TopNav";

import _get from "lodash/get";
import _find from "lodash/find";
import _capitalize from "lodash/capitalize";
import {transferSearch} from "../../../service/transfer/action";
import Html2Canvas from "html2canvas";
import JSPdf from "jspdf";

var currencies = require('country-data').currencies;

class TransferBookingConfirmation extends React.Component {

    state = {
        selectedTaxi: null,
        startPoint: {},
        endPoint: {},
        origin: '',
        destination: '',
        date: '',
        pickUpTime: '',
        luggage: '',
        passenger: '',
        animals: '',
        flightNo: '',
        phoneNo: null,
        selectedCountry: JSON.parse(sessionStorage.getItem('countryInfo')),
        contactValid: false,
        contactError: '',
        pickOnTime: '',
        checkBoxChecked: false,
        bookingNumber: null
    };

    print = event => {
        event.preventDefault();
        window.print();
    };

    download = event => {
        event.preventDefault();
        Html2Canvas(document.getElementById("print"))
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new JSPdf({
                    orientation: 'landscape',
                });
                const width = pdf.internal.pageSize.getWidth();
                const height = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
                pdf.save("booking.pdf");
            });
    };


    componentDidMount() {
        window.scrollTo(0, 0);

        const payload = queryString.parse(this.props.location.search);
        const vehicle = _get(payload, 'vehicle', null);
        const startPoint = _get(payload, 'startPointGeocode', {});
        const endPoint = _get(payload, 'endPointGeocode', {});
        const selectedTaxi = _find(this.props.transferList, list => list.id === vehicle);
        const origin = _get(payload, 'searchString', '');
        const destination = _get(payload, 'end_point', '');
        const date = _get(payload, 'start_time_date', '');
        const pickUpTime = _get(payload, 'start_time_time', '');
        const luggage = _get(payload, 'luggage', '');
        const passenger = _get(payload, 'passengers', '');
        const animals = _get(payload, 'animals', '');
        const flightNo = _get(payload, 'flightNo', '');
        const bookingNumber = _get(payload, 'bookingNumber', '');
        
        this.setState({
            ...this.state,
            dropOffTime: payload.dropOffTime,
            pickOnTime: payload.pickUpTime,
            bookingNumber,
        });
        if (selectedTaxi) {
            this.setState({
                selectedTaxi
            });
        } else {
            this.props.transferSearch({
                ...queryString.parse(this.props.location.search),
                currencySymbol: this.props.currencySym,
                currency: this.props.selectedCurrency,
                email: this.props.loginDetails ? this.props.loginDetails.email : null,
            })
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
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.transfetList !== nextProps.transferList) {
            const vehicle = _get(queryString.parse(this.props.location.search), 'vehicle', null);

            if (vehicle) {
                this.setState({
                    selectedTaxi: _find(nextProps.transferList, list => list.id === vehicle),
                });
            }
        }

        if (nextProps.bookingNumber !== null) {
            // this.props.history.push('/transferbookingconfirmation?' + this.props.location.search);
        }
    }

    render() {
        const {selectedTaxi, pickUpTime, dropOffTime, date, origin, destination, bookingNumber} = this.state;
        console.log(pickUpTime)
        console.log(dropOffTime)
        return (

            <React.Fragment>
                <TopNav onClick={this.props.onSignIn}/>
                {selectedTaxi &&
                <section className="searchSection">
                    <div className="container">
                        <div id="print" className="bookingConfirmation">
                            <div className="bookingStatus">
                                <div className="d-flex flex-row smallTabColumn justify-content-between">
                                    <div className="flex-column">
                                        <div className="bookingStatusContent">
                                            <img src={img_tick} alt="tick"/>
                                            <h3>Your Booking has Been Confirmed</h3>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <ul className="bookingShare">
                                            <li onClick={this.print}>
                                                <img src={img_print} alt="print"/> Print
                                            </li>
                                            <li onClick={this.download}>
                                                <img src={img_download} alt="download" /> Download
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex-row">
                                    <div className="bookingHotelName">
                                        <h5>
                                            <h5> {selectedTaxi.car_model}</h5>
                                            {/* <h4>{carResponse.vehicle.type}</h4> */}
                                        </h5>
                                    </div>
                                    <ul className="bookingHotelInfo">
                                        <li className="borderRight">
                                            {this.state.pickOnTime},{moment(date).format('MMM DD')}
                                            <img src={img_arrow} alt="arrow"/>

                                            {dropOffTime},{moment(date).format('MMM DD')}
                                        </li>
                                        <li className="borderRight">Total Cost
                                            : {selectedTaxi.currency_symbol}{selectedTaxi.totalAmount} </li>
                                        <li> Xeniapp Booking Id # {bookingNumber}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bookingStatus">

                                <div className="selectRoomItemsBg carSelRoom d-flex flex-row smallColumn ">
                                    <div className="flex-column  carConfirmLeft" style={{flex: 1}}>
                                        <div className="carConfirmImgDiv">
                                            <div className="carImageOnly"><img src={selectedTaxi.image_url}
                                                                               className="carImgWid"/></div>


                                        </div>
                                        <div className="confirmScreenPick">
                                            <ul className="pickupDropDet">
                                                <li>
                                                    <h6>Pick-Up</h6>
                                                    <p>{origin}</p>
                                                </li>
                                                <li>
                                                    <h6>Stay Inclusion</h6>
                                                    <p>1. Meet & Greet</p>
                                                    <p>2. Wating Time <b>{selectedTaxi.included_waiting_time} mins</b></p>
                                                    <p>3. Fixed Price ,Toll Included</p>
                                                </li>
                                            </ul>
                                            <ul className="pickupDropDet">
                                                <li>
                                                    <h6>Drop-Off</h6>
                                                    <p>{destination}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex-column confirmRoomRight carConfirmRight">
                                        <div className="detailsBg flex-column carInfo">
                                            <h6> {selectedTaxi.car_model}</h6>
                                            <ul className="carCategories">
                                                <li> {_capitalize(selectedTaxi['vehicle_type'])}</li>
                                                <li> {selectedTaxi.booking_category}</li>
                                            </ul>
                                            <ul className="carInfraStru">
                                                <li>
                                                    <img src={img_carUser}/> {selectedTaxi.seats}
                                                </li>
                                                {/*<li>
                                        <img src={img_clock}/> {selectedTaxi.included_waiting_time} mins
                                    </li>*/}
                                                <li>
                                                    <img src={img_luggage}/> {selectedTaxi.luggage}
                                                </li>
                                            </ul>
                                        </div>
                                        <ul className="checkInOut">
                                            <li><img src={img_Time}/><span>Pick Up<b> {this.state.pickOnTime}</b></span>
                                            </li>
                                            <li><img
                                                src={img_Time}/><span>Drop Off<b>{this.state.dropOffTime}</b></span>
                                            </li>
                                        </ul>
                                        <div className="carInfoDiv">
                                            <img src={img_info}/>
                                            <p>Important Information about your rental</p>
                                            <div className="moreDetailToolTip">
                                                {/*TODO Policy Information Required From Client*/}
                                                
                                                <p>
                    <div className="InfoHover">
                      <h6>About Various Cars</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Limousines: All our limousine transfers include fixed
                        price, automated flight tracking, 24/7 support hotline
                        and pickup with name sign in the arrival hall.
                        <br />
                        Additional luggage, such as sports equipment or child
                        seat are available for limousine transfers.
                      </p>

                      <h6>How can I change a booking?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You can email us with the change request and we will
                        accommodate your request as soon as possible.
                      </p>
                      <h6>How can I cancel a booking?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You can cancel the booking from your dashboard as per
                        the cancellation policy.
                      </p>
                      <h6>How much luggage can I bring?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You can bring up to 8 pieces of luggage in our biggest
                        cars with you assuming that every piece piece has the
                        size of 55 (22”) x 45 (18”) x 25 (10”). Normally, our
                        passenger cars such as Sedans can fit 3 pieces of
                        luggage in the above-mentioned size, our MPVs fit in 6
                        and vans take up to 8. Remember to specify the amount of
                        luggage you can bring while making a reservation.
                      </p>
                      <h6>Can you provide a child seat?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Yes! We provide child seats for children from 3 to 6
                        years and from 6 to 12 years. To make sure that the
                        child seat is provided just add it while booking. On the
                        web, after entering basic details like pickup and
                        dropoff spots, click on “More details” and choose an
                        arrow next to the baby icon and choose the number and
                        option that suits you best. We advise to repeat that you
                        need children seats in the message to the driver at the
                        end of the booking, but remember that first of all you
                        need to mark child seats in “More details” as above.
                        <br />
                        If you write about the children seats only in the
                        message to the driver, they cannot be guaranteed. Please
                        note that the driver can carry only 2 children seats at
                        once.
                      </p>

                      <h6>Pickup, the ride and dropoff</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You will get the name, surname and telephone number of
                        your driver in an SMS until 30 minutes before the pickup
                        time.
                      </p>
                      <h6>How can I be sure that my car is coming?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Once you have received a booking confirmation via email
                        a car is immediately reserved for you. That car may
                        change depending on availability, but the exact details
                        of the driver and type of car will be sent to you via
                        email and SMS right before your pickup time. This means
                        that you can easily find and contact your driver if
                        necessary.
                      </p>
                      <h6>What happens if I am late?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        As soon as you notice that you might be late, please
                        contact your driver directly and notify him about your
                        delay. You can easily find the driver’s phone number in
                        the email and SMS sent to you just prior to the ride. If
                        you should forget to notify the driver about your delay,
                        he will wait for you until the included waiting time has
                        passed. If you don’t arrive within the allocated waiting
                        time without informing the driver or calling our
                        Support, you will be charged a special fee for not
                        showing up. The no-show fee for Quality Taxis is the
                        base fee (based on the regional taxi tariff) plus 15
                        minutes waiting time. This may vary depending on the
                        region and country rules. The no show fee for Limousine
                        bookings is the full fare of the ride.
                      </p>
                      <h6>What do I do if my driver is late?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Call the driver directly to see where they are. You find
                        their phone number in the SMS you received before your
                        ride with all the driver details. If you cannot get in
                        touch with your driver please call our Support number
                        where one of our Agents will help you to find your
                        driver.
                      </p>
                      <h6>How will I recognise the driver?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        For limousine bookings, we normally send the driver your
                        name and surname that will appear on your pickup sign.
                        You can also specify the text that will appear on your
                        pickup sign while booking your ride. Once you come into
                        the arrivals hall, just search for your pickup sign,
                        your driver will be holding it.
                      </p>
                      <h6>What if my destination changed last minute?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Please notify the driver about your new destination. In
                        some situations, the fact that you changed the dropoff
                        point, may incur additional costs.
                      </p>
                      <h6>
                        Can I bring additional passengers in the car on the
                        spot?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        The answer is yes if the car booked has the capacity to
                        take more people in. If it’s not possible we will ask
                        you to stick with the data you originally provided. The
                        same happens if you bring more luggage than initially
                        stated and the driver will not be able to fit it or with
                        any short-notice request that we won’t be able to
                        accommodate.
                        <br />
                        If you have any special requests it would be best to
                        write them in the special requests box when placing a
                        booking and we will do what we can to meet your needs.
                      </p>

                      <h6>
                        I just took my McDonald’s takeaway right before the
                        pickup, can I eat it during the ride?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        We want to keep the cars in the highest standard and to
                        be able to maintain it, we would ask you not to eat or
                        drink in the vehicle during the ride. We would also like
                        to kindly remind you that smoking is not allowed. Please
                        remember that if you cause any damage in/to the car, you
                        will be asked to cover the additional costs.
                      </p>
                      <h6>
                        What if I provide incorrect flight number and want to
                        change it?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        If your ride’s distance is less than 70 km, you can
                        change it directly in your account for free until 3
                        hours before the indicated pickup time. If you booked an
                        hourly ride or exceeding 70 km, you can change the
                        flight number in your account until 24 hours before
                        indicated pickup time.
                      </p>
                      <h6>What if my flight is delayed?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        For limousine transfers, the driver will track your
                        flight and wait for you at the airport at the actual
                        flight arrival time. It’s is our specialty.
                      </p>
                      <h6>
                        Why do you pick up when the flight lands? I will need
                        time to go through immigration!
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        In order to provide you with a seamless pickup
                        experience, the limousine driver is tracking your flight
                        and will be at the airport at your flight arrival time.
                        Please note that we offer free waiting time for
                        limousine transfers of 45 minutes for our Economy rides,
                        60 minutes for Business rides and 90 minutes for First
                        Class rides. This is counted from your flight arrival
                        time. You can add additional buffer time in a message to
                        the driver whilst booking or contact our support after
                        you have booked. If you need to exceed the waiting time
                        at the last moment we will do our best to accommodate
                        your request, but please note that we cannot guarantee
                        that the driver will be able to wait longer than
                        previously agreed. In case of exceeding included waiting
                        time, additional fees specified in your confirmation
                        shall apply. In the case of Quality Taxi transfers,
                        please contact your driver if you want them to wait, but
                        please note that in this case, additional fees will
                        apply.
                      </p>
                      <h6>
                        My flight was diverted, but then it came back to the
                        original airport. Will my driver still be there?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Unless you got in contact with the driver and told them
                        to leave the airport, they will wait for you. Yet,
                        whenever such unpredicted circumstances as flight
                        diversion occur please always reach us at +49 30 346 497
                        360 as soon as you have the signal.
                      </p>
                      <h6>Where does the driver pick me up?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        A detailed information about your specific meeting point
                        at the airport will be provided in your booking
                        confirmation email. For most of the airports the driver
                        will be waiting for you after the baggage claim, however
                        it might vary from airport to airport. For other
                        locations the driver shall pick you up from the address
                        booked, usually in front of the building.
                      </p>
                    </div>
                  </p>
                                            </div>
                                        </div>
                                        <div className="flex-column confirmRoomRight carConfirmRight ml-0 pl-0">
                                            <ul className="totalAmountDis">
                                            <li><span>1 Day</span>
                                                <span> {selectedTaxi.currency_symbol} {selectedTaxi.regular_price}</span>
                                            </li>
                                            <li><span>Taxes & Fees</span>
                                                <span> {selectedTaxi.currency_symbol} 
                                                {(
                                                  selectedTaxi.totalAmount - selectedTaxi.regular_price
                                                ).toFixed(2)}</span>
                                            </li>
                                                <li><span>Total Amount</span>
                                                    <span> {selectedTaxi.currency_symbol} {(+selectedTaxi.totalAmount).toFixed(2)}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div style={{paddingTop: "10px"}}>
                    <b>Cancellation Policy&nbsp;<i className="fas fa-angle-double-down" /></b>
                    <h6 style={{ fontSize: "11px", fontWeight: "600", paddingTop: "5px" }}>
                        You can cancel the Transfer 24 Hrs before your travel.
                    </h6>
                  </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bookingCollapse">
                                <div className="bookingCollapseTitle">
                                    <h5>
                                        <img src={img_help} alt="help"/> Need more Help ?
                                    </h5>
                                </div>
                                <div className="bookingCollapseContent">
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="flex-column">
                                            <ul className="needHelp">
                                                <li>
                                                    Visit our <a href="http://help.xeniapp.com/support/home"
                                                                 target="_blank">Help Desk</a> Page.
                                                </li>
                                                <li>
                                                    Xeniapp Customer Care at <b>1800 936 2927</b>.
                                                </li>
                                                <li>
                                                    For more efficient support remember your booking id
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
                <Footer/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    transferList: state.transferReducer.transferList,
    bookingNumber: state.transferReducer.bookingNumber,
    selectedCurrency: state.commonReducer.selectedCurrency,
    currencySym: state.commonReducer.currencySym,
    loginDetails: state.loginReducer.loginDetails,
});
const mapDispatchToProps = dispatch => ({
    transferSearch: searchInfo => dispatch(transferSearch(searchInfo)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransferBookingConfirmation));