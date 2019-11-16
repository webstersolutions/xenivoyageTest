import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import PackageNavBanner from "./PackageNavBanner";

import PackageSearchResult from "./PackageSearchResult";
import PackageExtraContent from "./PackageExtraContent";
import PackageConfirmContent from "./PackageConfirmContent";

class PackageContent extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-row tab-column justify-content-start">
          {this.props.location.pathname != "/package" && (
            <PackageNavBanner {...this.props} />
          )}
        </div>

        {
          <Switch>
            <Route
              key="package"
              {...this.props}
              exact
              path="/package/search"
              component={PackageSearchResult}
            />
            <Route
              key="extra"
              path="/package/extra"
              component={PackageExtraContent}
            />
            { <Route
              key="confirm"
              exact
              path="/package/confirm"
              component={PackageConfirmContent}
            /> }
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
  )(PackageContent)
);
