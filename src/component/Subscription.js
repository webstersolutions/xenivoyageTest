import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from '../../src/Utils/request-process'
import {connect } from 'react-redux'
import SignInModal from '../component/container/login/SignInModal'
import propTypes from "prop-types";
import URL from '../asset/configUrl'
class Subscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isdivHide: true,
      isModalOpen: false,
      isgopro: false,
      goproplan: ""
    };
  }
  close = () => {
    this.setState({ isModalOpen: false });
    
  };
  
  goProPlanRegister(each) {
  
     if (this.props.loginStatus === false || this.props.loginStatus === undefined) {
      this.setState({ isModalOpen: true , isgopro : true});
      // this.setState()
          // this.setState({ isgopro: !this.state.isgopro }, () => {
          //   this.props.handleGopro(this.state.isgopro);
          // });
      
    }else {
     
    this.props.history.push("/payment", each);

    }
    //  sessionStorage.setItem("signUpInfo" ,JSON.stringify(payload))
  
  }

  componentWillMount = () => {
    this.handleProPlan();
  };

  handleProPlan = () => {
    axios
      .get(URL.GOPROPLANLIST)
      .then(response => {
        this.setState({ goproplan: response.data.data.data.data });
      });
  };

  handleGo = () => {
    this.setState({ isgopro: false }, () => {
      this.props.handleGopro(this.state.isgopro);
    });
  };
  render() {
    const { isdivHide, isModalOpen, isgopro, goproplan } = this.state;
    // const renderModel =isModalOpen && (
    //   <SignInModal isdivHide={isdivHide} onHide={this.close} />
    // );
    return (
      <React.Fragment>
        {isModalOpen && (
          <SignInModal isdivHide={isdivHide} onHide={this.close} />
        )}
    
        {goproplan && isModalOpen === false && isgopro === false && (
          <div className="subscription">
            <div className="subscripContent">
              <div className="subscripTitle">
                <h2>Upgrade Subscription to xeniclub </h2>
                <button
                  type="button"
                  className="closeSubscrip"
                  onClick={this.handleGo}
                >
                  <i class="fas fa-times" />
                </button>
              </div>
              <div className="subscripBody">
                <div className="d-flex flex-row justify-content-between smallColumn">
                  <div className="flex-column subscripPlan">
                    <div className="subscripPlanTitle">
                      <h5>BASIC</h5>
                      <h2>FREE</h2>
                    </div>
                    <ul>
                      <li>
                        <i class="far fa-check-circle" /> <p>Net Price as per portal</p>
                      </li>
                      <li>
                        <i class="far fa-check-circle" />{" "}
                        <p>5 Bookings a month</p>
                      </li>
                      <li>
                        <i class="far fa-check-circle" />{" "}
                        <p>Only Save to Wish List</p>
                      </li>
                      <li>
                        <i class="far fa-check-circle" />{" "}
                        <p>Upgrades with a cost</p>
                      </li>
                      <li>
                        <i class="far fa-check-circle" />{" "}
                        <p>10 Dollars Per Itinerary Request</p>
                      </li>
                      <li>
                        <i class="far fa-check-circle" />{" "}
                        <p>24/7 Support</p>
                      </li>
                    </ul>
                    <button type="button" className="currentSubBtn">
                      Current Subscription
                    </button>
                  </div>

                  {this.state.goproplan.map((each, i) => (
                    <div className="flex-column subscripPlan subscripPlanTwo">
                      <div className="subscripPlanTitle">
                        <h5>{each.name}</h5>
                        <h2>${each.amount/100}</h2>
                      </div>
                      <ul>
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p>15% Lesser Pricing than Portal Fares</p>
                        </li>
                        <li>
                          <i class="far fa-check-circle" />
                          <p>15% Discount on Xenivoyage Packages</p>
                        </li>
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p>Special access to XeniAir rates</p>
                        </li>
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p>50 Bookings a Month</p>
                        </li>
                       
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p>Offline Quote Request</p>
                        </li>
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p> Free Upgrades</p>
                        </li>
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p>Free Itinerary Consultation with Experts</p>
                        </li>
                        <li>
                          <i class="far fa-check-circle" />{" "}
                          <p>24/7 Support</p>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="RegisSubBtn"
                        onClick={this.goProPlanRegister.bind(this, each)}
                      >
                        Buy plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    loginStatus: state.loginReducer.loginStatus
  };
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Subscription));
Subscription.propTypes = {
  isdivHide: propTypes.bool
};