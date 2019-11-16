import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";

import CarNavBanner from "./CarNavBanner";
import CarSearchResult from './CarSearchResult';
import CarExtraContent from './CarExtraContent';
import CarConfirmContent from './CarConfirmContent';

class CarContent extends Component {
  constructor(props,context) {
    super(props,context)
  }
  
  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-row tab-column justify-content-start">
          { this.props.location.pathname != "/car" && <CarNavBanner {...this.props} />}
        </div>

        {<Switch>
          <Route key='car' {...this.props} exact path="/car/search" component={CarSearchResult} />
          <Route key='extra' path="/car/extra" component={CarExtraContent} />
          <Route key='extra' path="/multiplebooking" component={CarExtraContent} />
          <Route key='confirm' exact path="/car/confirm" component={CarConfirmContent} />
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
)(CarContent));
