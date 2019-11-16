import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import ActivityNavBanner from "./ActivityNavBanner";

import ActivitySearchResult from "./ActivitySearchResult";
import ActivityExtraContent from "./ActivityExtraContent";
import ActivityConfirmContent from "./ActivityConfirmContent";

class ActivityContent extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-row tab-column justify-content-start">
          {this.props.location.pathname != "/activity" && (
            <ActivityNavBanner {...this.props} />
          )}
        </div>

        {
          <Switch>
            <Route
              key="activity"
              {...this.props}
              exact
              path="/activity/search"
              component={ActivitySearchResult}
            />
            <Route
              key="extra"
              path="/activity/extra"
              component={ActivityExtraContent}
            />
            <Route
              key="confirm"
              exact
              path="/activity/confirm"
              component={ActivityConfirmContent}
            />
          </Switch>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isSearching: state.hotelReducer.isSearching
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(ActivityContent)
);
