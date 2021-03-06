import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import { map as _map, filter as _filter } from "lodash";
import img_unknown from "../../../asset/images/arrow.png";
import checked from "../../../asset/images/bookingConfirm/checked.png";
import close from "../../../asset/images/bookingConfirm/close.png";
const ItineraryInfo = ({
  isOverview,
  itinerary,
  isInclusion,
  isDepartAndReturn,
  isItinerary,
  isAdditionalInfo,
  isCancellationPolicy,
  isHotelPickup,
  isActivityTraveller
}) => {
  return (
    <div
      className="selectItineraryBg d-flex flex-wrap selectItineraryDetail"
      id="lessPolicies"
    >
      {isOverview && (
          <React.Fragment>
            <div className="flex-row">
              <strong>Overview</strong>
              <div>{ReactHtmlParser(itinerary.shortDescription)}</div>
            </div>
          </React.Fragment>
      )}
      {isInclusion && (
        <React.Fragment>
          <div className="flex-row"style={{width: "100%"}}>
            <strong>Inclusions & Exclusions</strong>
            <div className="row" style={{ marginTop: "5%" }}>
              <div className="col">
                <div className="flex-column" >
                  <ul>
                    {_map(_filter(itinerary.inclusions, inclusion => inclusion !== null), (item, i) => (
                      <li key={i}>
                        <div className="row">
                          <span className="col-1" style={{ padding: "0" }}>
                            <img
                              src={checked}
                              alt=""
                              height="15px"
                              width="15px"
                            />
                            &nbsp;
                          </span>
                          <span className="col marginLeftLi" style={{ padding: "0" }}>
                            {item}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="flex-column">
                  <ul>
                    {_map(_filter(itinerary.exclusions, exclusion => exclusion !== null), (item, i) => (
                      <li key={i}>
                        <div className="row">
                          <span className="col-1" style={{ padding: "0" }}>
                            <img
                              src={close}
                              alt=""
                              height="15px"
                              width="15px"
                            />
                            &nbsp;
                          </span>
                          <span className="col marginLeftLi" style={{ padding: "0" }}>
                            {item}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>{" "}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
      {isDepartAndReturn && (
        <React.Fragment>
          <div className="flex-row">
            <strong>Departure Point</strong>
            <div>{ReactHtmlParser(itinerary.departurePoint)}</div>
          </div>
          <div className="flex-row" style={{padding: "10px 0", width: "100%"}}>
            <strong>Departure Time</strong>
            <div style={{paddingTop: "5px"}}>{ReactHtmlParser(itinerary.departureTime)}</div>
            <div>{ReactHtmlParser(itinerary.departureTimeComments)}</div>
          </div>
          <div className="flex-row">
            <strong>Return Details</strong>
            <div>{ReactHtmlParser(itinerary.returnDetails)}</div>
          </div>
        </React.Fragment>
      )}
      {isItinerary && (
        <React.Fragment>
          <div className="flex-row">
            <div>{ReactHtmlParser(itinerary.description)}</div>
          </div>
        </React.Fragment>
      )}
      {isAdditionalInfo && (
          <React.Fragment>
            <div className="flex-row"style={{width: "100%"}}>
              <strong>Additional Info</strong>
              <div className="row" style={{ marginTop: "5%" }}>
                <div className="col">
                  <div className="flex-column" >
                    <ul style={{ listStyle: 'disc' }}>
                      {_map(itinerary.additionalInfo, (item, i) => (
                          <li key={i}>
                            <div className="row">
                              <span className="col" style={{ padding: "0", paddingLeft: '15px' }}>
                                {item}
                              </span>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
      )}
      {isCancellationPolicy && (
        <React.Fragment>
          <div className="flex-row">
            <strong>Cancellation Policy</strong>
            <div>
              {ReactHtmlParser(
                itinerary.merchantTermsAndConditions.termsAndConditions
              )}
            </div>
          </div>
        </React.Fragment>
      )}
      {isHotelPickup && (
          <React.Fragment>
            <div className="flex-row">
              <strong>Hotel Pickup</strong>
              <div>
                Hotel pick-up is offered for this tour. Note: if you are booking within 24 hours of the tour/activity
                departure time, we cannot guarantee hotel pick-up. Once your purchase is complete, we will send you
                complete contact information (phone number, email address, etc.)
                for our local operator to organize pick-up arrangements.
              </div>
            </div>
          </React.Fragment>
      )}
    </div>
  );
};

export default ItineraryInfo;
