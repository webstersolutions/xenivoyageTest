import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";

import MultipleBookingView from '../../presentational/MultipleBooking/MultipleBookingView'
class MultipleContent extends Component {
  constructor(props,context) {
    super(props,context)
  }
  
  render() {
    return (
      <React.Fragment>
          <div className={this.props.itineraryList.length != 0 ? "sectionCard" :""}>
          <MultipleBookingView/>
          </div>
      </React.Fragment>
    );
  }

}

const mapStateToProps = state => ({
  itineraryList: state.addcartReducer.itineraryList,
});

export default withRouter(connect(
  mapStateToProps,
  null
)(MultipleContent));
