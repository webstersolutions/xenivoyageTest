import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { map as _map, get as _get, filter as _filter } from "lodash";

import { compareHotel } from "../../../service/hotel/action";
import img_unknown from "../../../asset/images/arrow.png";
import Marker1 from "../../../asset/images/marker_red1.png";
import Marker2 from "../../../asset/images/marker_red2.png";
import Marker3 from "../../../asset/images/marker_red3.png";
import Marker4 from "../../../asset/images/marker_red4.png";

import ComapareMapContent from "./CompareMapContent";

import {
  loadingGifSearch,
  stopGifSearching
} from "../../../service/common/action";

import request from "../../../Utils/request-process";
import URL from "../../../asset/configUrl";

class CompareContent extends Component {
  state = {
    modal: false,
    description: true,
    amenities: false,
    map: false,
    isRoomAPI: false
  };

  removeCompareHotel = key => {
    this.props.compareHotelList.splice(key, 1);
    this.props.compareHotel([...this.props.compareHotelList]);
  };

  compareHotel = () => {
    this.setState({
      modal: true
    });
  };

  closeCompare = () => {
    this.setState({
      modal: false
    });
  };

  compareTabs = value => {
    if (value === "description") {
      this.setState({
        description: true,
        amenities: false,
        map: false
      });
    } else if (value === "amenities") {
      const { isRoomAPI } = this.state;
      if (!isRoomAPI) {
        this.setState({
          isRoomAPI: true
        });
        this.props.loadingGifSearch();
        const { sessionId, selectedCurrency, compareHotelList } = this.props;

        const datas = _map(compareHotelList, (value, key) => {
          const { id } = value;
          const roomPayload = {
            currency: selectedCurrency,
            email: _get(this.props, "loginDetails.email", ""),
            hotelId: id,
            sessionId
          };
          return request.post(URL.hotel.ROOM_SEARCH, roomPayload);
        });
        Promise.all(datas).then(res => {
          this.props.stopGifSearching();
          _map(res, (value, key) => {
            const amenities = _get(value, "data.data.hotel.amenities", null);
            compareHotelList[key].amenities = amenities;
            this.props.compareHotel([...compareHotelList]);
          });
        });
      }

      this.setState({
        amenities: true,
        description: false,
        map: false
      });
    } else if (value === "map") {
      this.setState({
        map: true,
        description: false,
        amenities: false
      });
    }
  };

  hotelCommonInfo = () => {
    const { description, amenities, map } = this.state;
    const { compareHotelList, selectedCurrency } = this.props;
    let className;
    if (description) {
      className = "description";
    } else if (amenities) {
      className = "amenities";
    } else if (map) {
      className = "map";
    }
    return (
      <div className={"compare-" + className}>
        {map && <ComapareMapContent />}
        <div className="d-flex">
          {_map(compareHotelList, (value, key) => {
            const image = _get(value, "images[0].URL", null);
            const description = _get(value, "descriptions", null);
            const address =
              _get(value, "contact.address.line1") +
              ", " +
              _get(value, "contact.address.city.name") +
              ", " +
              _get(value, "contact.address.countryCode") +
              ", " +
              _get(value, "contact.address.postalCode");
            const generalDescription = _filter(description, (value, key) => {
              return value.type === "General";
            });
            const name = _get(value, "name", null);
            const price = _get(value, "fare.baseFare");
            const amenities = _get(value, "amenities");
            let img;
            if (key === 0) {
              img = Marker1;
            } else if (key === 1) {
              img = Marker2;
            } else if (key === 2) {
              img = Marker3;
            } else if (key === 2) {
              img = Marker4;
            }
            return (
              <div className="compare-loop-details">
                <img src={image} />
                <div className="compare-loop-name">
                  {name}
                  {map && <img src={img} />}
                </div>
                <div className="compare-loop-price">
                  {selectedCurrency + " " + price}
                </div>
                <div className="compare-loop-address">{address}</div>
                {this.state.description && (
                  <div className="compare-loop-description">
                    {_get(generalDescription[0], "value", null)}
                  </div>
                )}
                {this.state.amenities && (
                  <div className="compare-loop-amenities">
                    {amenities.length > 0 &&
                      _map(amenities, (value, key) => {
                        return (
                          <div>
                            <img
                              src={img_unknown}
                              alt=""
                              height="15px"
                              width="15px"
                            />
                            {value.name}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  render() {
    const { modal, description, amenities, map } = this.state;
    const { compareHotelList, selectedCurrency } = this.props;
    return (
      <div className="compareCard">
        <div className="">
          <div className="compare-title">Hotel Comparison</div>
          <div className="compare-list">
            {compareHotelList.length > 0 &&
              _map(compareHotelList, (value, key) => {
                return (
                  <div className="compare-hotel">
                    <div className="inner-width">
                      <b>{_get(value, "name", null)}</b>
                    </div>
                    <span onClick={() => this.removeCompareHotel(key)}>
                      <i className="fas fa-times"></i>
                    </span>
                  </div>
                );
              })}
          </div>
          <div className="compare-btn-section">
            <button
              className="compare-sbmt"
              onClick={() => this.compareHotel()}
            >
              Compare
            </button>
          </div>
        </div>

        {/* Modal */}
        <div
          class="modal backgroundDark"
          style={{ display: modal ? "block" : "none" }}
        >
          <div
            class="modal-dialog modal-lg"
            style={{ maxWidth: "80%" }}
            role="document"
          >
            <div class="modal-content">
              <div class="modal-header compare-hotels-header">
                {/* <h5 class="modal-title" id="exampleModalLabel">
                  Modal title
                </h5> */}
                <div className="d-flex">
                  <ul>
                    <li
                      className={description ? "active" : ""}
                      onClick={() => this.compareTabs("description")}
                    >
                      Description
                    </li>
                    <li
                      className={amenities ? "active" : ""}
                      onClick={() => this.compareTabs("amenities")}
                    >
                      Amenties
                    </li>
                    <li
                      className={map ? "active" : ""}
                      onClick={() => this.compareTabs("map")}
                    >
                      Show Map
                    </li>
                    {/* <li>Send By Email</li> */}
                  </ul>
                </div>
                <button
                  type="button"
                  class="close"
                  onClick={() => this.closeCompare()}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body compare-modal-body">
                {this.hotelCommonInfo()}
                {/* <div className="compare-email"></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  compareHotelList: state.hotelReducer.compareHotelList,
  sessionId: state.hotelReducer.sessionId,
  selectedCurrency: state.commonReducer.selectedCurrency,
  loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({
  compareHotel: hotel => dispatch(compareHotel(hotel)),
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CompareContent)
);
