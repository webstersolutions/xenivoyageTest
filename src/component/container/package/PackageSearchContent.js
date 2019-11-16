import React, { Component } from "react";
import PackageContent from "../package/PackageContent";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class PackageSearchContent extends Component {
  render() {
    return (
      <div
        className={
          this.props.location.pathname != "/package" ? "sectionCard" : ""
        }
      >
        <PackageContent {...this.props} />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  packageList: state.packageReducer.packageList
});

const mapDispatchToProps = dispatch => ({});

PackageSearchContent.defaultProps = {
  packageList: []
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PackageSearchContent)
);
