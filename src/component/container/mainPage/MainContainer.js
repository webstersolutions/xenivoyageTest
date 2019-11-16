import React from 'react';
import img_RoadGraphic from "../../../asset/images/Road-Graphic.png";
import Footer from "../../../component/Footer";
import BookingConfirmation from '../mainPage/BookingConfirmation';
import CancelBooking from '../mainPage/CancelBooking';
import CancelledBooking from '../mainPage/CancelledBooking';

export default class MainContainer extends React.Component {

  render() {
    const userSession = JSON.parse(sessionStorage.getItem('bookFlag'));
    return <section className="searchSection">
      <div className="roadmap ">
        <img src={img_RoadGraphic} alt="" />
      </div>
      <div className="container">
        <div className="d-flex  flex-row res-column justify-content-start">
          {this.props.children}
        </div>
      </div>
      {/* <BookingConfirmation /> */}
      {/* <CancelBooking/>  2*/}
      {userSession === true && CancelBooking}
      {/* <CancelledBooking/>  3*/}
      {/* d-none */}
      <Footer />
    </section>;
  }
}