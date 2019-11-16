import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";

import RoomContent from './RoomContent';
import RoomResContent from './RoomResContent';
//import StateLessRoomResContent from './StateLessRoomResContent';
import HotelNavBanner from "./HotelNavBanner";
import SearchResult from './SearchResult';
import MultipleContent from '../../container/multiplebooking/MultipleContent'

class HotelContent extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-row tab-column justify-content-start">
        {!this.props.location.pathname.includes("/hotel/multiplebooking") && <HotelNavBanner {...this.props} />}
        </div>
        {<Switch>
          <Route key='hotel' exact path="/hotel/search" component={SearchResult} />
          <Route key='multiplebooking'  path="/hotel/multiplebooking" component={MultipleContent} />
          <Route key='room' exact path="/hotel/rooms" component={RoomContent} />
          <Route key='reservation' exact path="/hotel/reservation" component={RoomResContent} />
        </Switch>}

      </React.Fragment>
    );
  }

}

const mapStateToProps = state => ({
  isSearching: state.hotelReducer.isSearching
});

export default withRouter(connect(
  mapStateToProps,
  null
)(HotelContent));
