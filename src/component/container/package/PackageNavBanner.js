import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import img_RightArrow from "../../../asset/images/Right Arrow - All Steps.png";
import img_LeftArrow from "../../../asset/images/Left Arrow - All Steps.png";

class PackageNavBanner extends Component {
  render() {
    const { pathname } = this.props.history.location;
    const { isLoading, isLoadingFailure } = this.props;

    return (
      <React.Fragment>
        <div className="flex-column filterResult  otherSteps">
          <div className="sectionCard">
            <ul className="navigation">
              <li title="Back">
                <img
                  src={img_LeftArrow}
                  alt=""
                  onClick={() => this.props.history.goBack()}
                />
              </li>
              <li
                className={`line ${
                  pathname === "/package/search" ? "active" : ""
                }`}
              >
                <span>Select Trip</span>
                <a>1</a>
              </li>
              <li
                className={`line ${
                  pathname === "/package/extra" ? "active" : ""
                }`}
              >
                <span>Select Extras</span>
                <a>2</a>
              </li>
              <li className={pathname === "/package/confirm" ? "active" : ""}>
                <span>Confirm</span>
                <a>3</a>
              </li>
              <li title="Next">
                <img
                  src={img_RightArrow}
                  alt=""
                  onClick={() => this.props.history.goForward()}
                />
              </li>
            </ul>

            {isLoading && <div className="greenLine" />}
            {isLoadingFailure && <div className="redLine" />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.loaderReducer.isLoading,
  isLoadingFailure: state.loaderReducer.isLoadingFailure
});

export default connect(
  mapStateToProps,
  ""
)(withRouter(PackageNavBanner));
