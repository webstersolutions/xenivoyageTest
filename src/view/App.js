import React, { Component } from 'react';
// import { Switch, Route, Redirect } from 'react-router-dom';
import { NavLink, Switch, Route } from 'react-router-dom';

import '../asset/scss/style.scss'
import Home from './Home';
import MainPage from './MainPage';
import SubscriptionPlan from '../component/SubscriptionPlan';
import Dashboard from './dashboard';
import AboutUs from '../component/AboutUs';
import Landing from './Landing';
import AuthRoute from '../component/Auth';
import cancelBooking from '../component/container/mainPage/CancelBooking';
import CancelledBooking from  '../component/container/mainPage/CancelledBooking';
import HotelMapView from '../component/container/hotel/HotelMapView';

import BookingConfirmation from '../component/container/mainPage/BookingConfirmation';
import ActivityCancelBooking from '../component/container/activity/ActivityCancelBooking';


import CarBookingConfirmation from '../component/container/mainPage/CarBookingConfirmation';
import CarCancelBooking from '../component/container/mainPage/CarCancelBooking';
import CarCancelledBooking from  '../component/container/mainPage/CarCancelledBooking';
import NewPassword from '../component/container/login/NewPassword'

import TransferBookingConfirmation from '../component/container/mainPage/TransferBookingConfirmation';
import TransferCancelBooking from '../component/container/mainPage/TransferCancelBooking';
import TransferCancelledBooking from '../component/container/mainPage/TransferCancelledBooking';

import ActivityBookingConfirmation from '../component/container/mainPage/ActivityBookingConfirmation';

import ContactUs from '../component/ContactUs';
import Loading from "../component/Loading";
import PaymentPage from "../component/PaymentPage";
import TermsAndConditions from '../component/TermsAndCondition';
import PrivacyAndPolicy from '../component/PrivacyAndPolicy';

import MultipleBookingView from '../component/presentational/MultipleBooking/MultipleBookingView'

import StatelessHotelConfirmation from '../component/container/mainPage/MultipleBooking/StatelessHotelConfirmation'
import ErrorPage from './ErrorPage';
import MaintenancePage from './MaintenancePage';
//import StatelessHotelConfirmation from '../component/container/mainPage/MultipleBooking/StateLessCarConfirmation'

import GoogleApiWrapper from "../component/container/map";
export default class App extends Component {
  constructor(props){
    super(props)
  }

  render() {

    return (
      <div>
      {<Loading/>}
      <Switch>
        <AuthRoute path="/dashboard" component={Dashboard} />
        {/* <Redirect exact path="/" to="/home" /> */}

        <Route exact path='/' component={Landing} />

        <Route path={"/home"} component={Landing} />
        <Route path={"/SubscriptionPlan"} component={SubscriptionPlan} />

        <Route path={"/aboutUs"} component={AboutUs} />
        <Route exact path='/howitworks' component={Landing}/>
        <AuthRoute path={"/hotel"} {...this.props} component={MainPage} />
        <AuthRoute path={"/flight"} component={MainPage} />
        <AuthRoute path={"/car"} {...this.props} component={MainPage} />
        <AuthRoute path={"/transfer"} {...this.props} component={MainPage} />
        <Route path={"/package"} component={MainPage} />
        <AuthRoute path={"/activity"} component={MainPage} />
        <Route path={"/newPassword"} component={NewPassword} />
        <AuthRoute path="/hotelMapView" {...this.props} component={HotelMapView}/>

        <AuthRoute path={"/cancelBooking"} component={cancelBooking} />
        <AuthRoute path={"/CancelledBooking"}  component={CancelledBooking} />
        <AuthRoute  path={"/bookingconfirmation"} component={BookingConfirmation} />


        <AuthRoute path={"/carbookingconfirmation"}  component={CarBookingConfirmation}  />
        <AuthRoute path={"/activityCancelBooking"}  component={ActivityCancelBooking}  />
        <AuthRoute path={"/carCancelBooking"} component={CarCancelBooking} />
        <AuthRoute  path={"/carCancelledBooking"}  component={CarCancelledBooking}  />

        <AuthRoute path={"/transferbookingconfirmation"}  component={TransferBookingConfirmation}  />
        <AuthRoute path={"/transferCancelBooking"} component={TransferCancelBooking} />
        <AuthRoute path={"/transferCancelledBooking"} component={TransferCancelledBooking} />

        <AuthRoute path={"/activityBookingConfirmation"}  component={ActivityBookingConfirmation}  />


        <Route path={"/contactUS"} component={ContactUs} />
        <Route path={"/payment"} component={PaymentPage} />
        <AuthRoute path={"/multiplebooking"} component={MultipleBookingView} />
        <AuthRoute path={"/multipleconfirmation"} component={StatelessHotelConfirmation} />
        <Route path={"/termsandconditions"} component={TermsAndConditions} />
        <Route path={"/privacypolicy"} component={PrivacyAndPolicy} />
        <AuthRoute path={"/map"} component={GoogleApiWrapper} />
        <Route path={"/MaintenancePage"} component={MaintenancePage} />
        <Route component={ErrorPage} />

        {/* <Route path="/home" exact component={Home}/> */}
      </Switch>
      </div>
    );
  }
}

