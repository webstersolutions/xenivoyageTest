import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";

import FlightNavBanner from "./FlightNavBanner";
import FlightSearchResult from './FlightSearchResult';
import FlightConfirm from './FlightConfirm';

class FlightContent extends Component {
 
  
  render() {
    return (
      <React.Fragment>
        {/* <div className="d-flex flex-row tab-column justify-content-start">
          <FlightNavBanner {...this.props} />
        </div>

        {<Switch>
          <Route key='flight' {...this.props} exact path="/flight/search" component={FlightSearchResult} />
          <Route key='confirm' exact path="/flight/confirm" component={FlightConfirm} />
        </Switch>} */}

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
)(FlightContent));
