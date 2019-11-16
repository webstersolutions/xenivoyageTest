import React, { Component } from "react";
import ActivityContent from "../activity/ActivityContent";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class ActivitySearchContent extends Component {
  render() {
    return (
      <div
        className={
          this.props.location.pathname != "/activity" ? "sectionCard" : ""
        }
      >
        <ActivityContent {...this.props} />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  activityList: state.activityReducer.carList
});

const mapDispatchToProps = dispatch => ({});

ActivitySearchContent.defaultProps = {
  activityList: []
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ActivitySearchContent)
);
