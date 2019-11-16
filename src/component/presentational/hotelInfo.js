import React from "react";
import UserRating from "./UserRating";
import ImageCarousel from "./ImageCarousel";
import { map as _map, find as _find } from "lodash";
import Highlighter from "react-highlight-words";
import noImage from "../../asset/images/test_image.jpg";
import img_whereIcon from "../../asset/images/Where Icon (Map Marker).svg";
import img_bussiness from "../../asset/images/bussiness.png";
import img_bar from "../../asset/images/glass.png";
import img_laundry from "../../asset/images/laundry.png";
import img_swmmingPool from "../../asset/images/swimming-silhouette.png";
import img_television from "../../asset/images/television.png";
import img_unknown from "../../asset/images/arrow.png";
import img_parking from "../../asset/images/selectRoom/parking-sign(1).png";
import img_hotcoffee from "../../asset/images/selectRoom/hot-coffee.png";

// const MY_API_KEY = "AIzaSyDZng2yRc6-MiBWPr71vQwQLrKvvqE789I";

const HotelInfo = ({
  hotel,
  isPolicy,
  rmvHtmlFunc,
  isMain,
  isAmenities,
  isContact,
  isDesc,
  isNear,
  showMap
}) => {
  const locationRefLink = `https://maps.google.com/?q=${hotel.geocode.lat},${
    hotel.geocode.long
  }`;
  const locationRef =
    `https://maps.google.com/?q=${hotel.geocode.lat},${hotel.geocode.long}` +
    "&output=embed";

  const detailedAddress =
    hotel.contact.address.line1 +
    ", " +
    hotel.contact.address.line2 +
    ", " +
    hotel.contact.address.city.name +
    ", " +
    hotel.contact.address.countryCode +
    ", " +
    hotel.contact.address.postalCode;
  const descriptionsData = _find(hotel.descriptions, ["type", "General"]);
  let description = descriptionsData
    ? descriptionsData["value"]
    : "Description not available";
  return (
    <div className="selectRoomBg d-flex flex-wrap  selectNewRooMdetail" id="lessPolicies">
      <div className="d-flex flex-row res-column">
        <React.Fragment>
          <div className="flex-column">
            {hotel.images.length ? (
              <ImageCarousel
                hotelName={hotel.name}
                imageList={_map(hotel.images, (each, i) => ({
                  name: "img" + { i },
                  url: each.URL
                }))}
                thumbNail={{ name: "img1", url: hotel.images[0].URL }}
              />
            ) : (
              <ImageCarousel />
            )}
          </div>
          <div className="detailsBg flex-column selectNewInfo">
            <UserRating rating={hotel && hotel.rating} />
            <h4>{hotel && hotel.name}</h4>
            <p>
              <img src={img_whereIcon} alt="location" />
              <a
                onClick={e => showMap(hotel)}
                style={{ cursor: "pointer" }}
                title={detailedAddress}
                target="_blank"
                rel="noreferrer"
              >
                {detailedAddress.substring(0, 30) + "..."}
              </a>
            </p>
            <div className="priceDiv" />
            <div
              className="mapInfoShow"
              style={{ cursor: "pointer" }}
              onClick={e => showMap(hotel)}
            >
              <iframe
                src={locationRef}
                style={{
                  width: "100%",
                  height: "160px",
                  border: "0px",
                  pointerEvents: "none"
                }}
                is="x-frame-bypass"
                frameborder="0"
                allowfullscreen
                alloworgin="true"
              />
            </div>
          </div>{" "}
        </React.Fragment>
      </div>
      <div className="d-flex flex-row res-column borderTop">
        {isDesc && (
          <React.Fragment>
            <div className="flex-column">
              <h6>General </h6>
              <p>
                {description
                  ? rmvHtmlFunc(description)
                  : "No Description Available"}
              </p>
              {_map(hotel.descriptions, (each, i) => {
                console.log(description);
                console.log(each);
                console.log(hotel.descriptions);
                console.log(each.value);
                return (
                  each.type != "General" && (
                    <React.Fragment>
                      <h6>{each.type}</h6>
                      <p>{rmvHtmlFunc(each.value)}</p>
                    </React.Fragment>
                  )
                );
              })}
            </div>
          </React.Fragment>
        )}
        {isAmenities && (
          <React.Fragment>
            <div className="d-flex flex-row resWrap">
              <div className="flex-column">
                <ul>
                  {hotel.amenities.map((item, i) => {
                    return i % 2 === 0 && i < 10 ? (
                      <li key={i}>
                        {/* <img
                                                src={
                                                    item.category
                                                        ? _find(_amenties, ["category", item.category])[
                                                        "icon"
                                                        ]
                                                        : img_unknown
                                                }
                                                alt=""
                                                height='15px'
                                                width='15px'
                                            /> */}
                        <img
                          src={img_unknown}
                          alt=""
                          height="15px"
                          width="15px"
                        />
                        &nbsp;{item.name}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
              <div className="flex-column">
                <ul>
                  {hotel.amenities.map((item, i) => {
                    return i % 2 !== 0 && i < 11 ? (
                      <li key={i}>
                        {/* <img
                                                src={
                                                    item.category
                                                        ? _find(_amenties, ["category", item.category])[
                                                        "icon"
                                                        ]
                                                        : img_unknown
                                                }
                                                alt=""
                                                height='15px'
                                                width='15px'
                                            /> */}
                        <img
                          src={img_unknown}
                          alt=""
                          height="15px"
                          width="15px"
                        />
                        &nbsp;{item.name}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>{" "}
          </React.Fragment>
        )}
        {isContact && (
          <React.Fragment>
            {hotel.contact.address.line1},&nbsp;
            {hotel.contact.address.line2},&nbsp;
            {hotel.contact.address.city.name}-{hotel.contact.address.postalCode}
          </React.Fragment>
        )}
        {isNear && (
          <React.Fragment>
            <div className="d-flex flex-row resWrap">
              <div className="flex-column">
                <ul className="nearUsContent">
                  {hotel.areaAttractions.map((item, i) => {
                    return i % 2 === 0 && i < 10 ? (
                      <li key={i}>
                        {/* <img
                                                src={
                                                    item.category
                                                        ? _find(_amenties, ["category", item.category])[
                                                        "icon"
                                                        ]
                                                        : img_unknown
                                                }
                                                alt=""
                                                height='15px'
                                                width='15px'
                                            /> */}
                        <img
                          src={img_unknown}
                          alt=""
                          height="15px"
                          width="15px"
                        />
                        &nbsp; {item.desc}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>
          </React.Fragment>
        )}
        {isPolicy && (
          <React.Fragment>
            <div className="flex-column">
            <div id="Policies" style={{height:"109px",overflow:"hidden"}}>
              {hotel.policies.length ? (
                hotel.policies.map((each, index) => (
                  <React.Fragment>
                    <h6>{each.type} </h6>

                    <p>
                      <Highlighter
                        autoEscape={true}
                        searchWords={[
                          "fee:",
                          "INR",
                          "AUD",
                          "BHD",
                          "QAR",
                          "THB",
                          "CAD",
                          "EUR",
                          "SGD",
                          "HKD",
                          "AED",
                          "IDR",
                          "JPY",
                          "LKR",
                          "USD",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "0",
                          "public areas:",
                          " shuttle fee",
                          " bed fee",
                          "pet fee",
                          "breakfast:",
                          "Internet:",
                          "parking fee:",
                          "Breakfast fee:",
                          "Resort fee:",
                          "Pet deposit:",
                          "Refrigerator fee:"
                        ]}
                        textToHighlight={rmvHtmlFunc(each.text)}
                      />{" "}
                    </p>
                  </React.Fragment>
                ))
              ) : (
                <p> No details found</p>
              )}
               </div>
              <span
                id="showMore"
                style={{
                  color: "cornflowerblue",
                  fontSize:'14px',
                  cursor: "pointer"
                }}
                onClick={() => {
                  let a = document.getElementById("showMore").innerText;
                  if (a === "show more...") {

                    document.getElementById("showMore").innerHTML="...show less";
                    document.getElementById("Policies").style.height="auto";
                    document.getElementById("Policies").style.overflow="hidden";
                   
                  }
                  if (a === "...show less") {
                    document.getElementById("showMore").innerHTML="show more...";
                    document.getElementById("Policies").style.height="109px";
                    document.getElementById("Policies").style.overflow="hidden";
                    document.getElementById("lessPolicies").scrollIntoView();
                  
                  }
                }}
              >
                show more...
              </span>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
const _amenties = [
  {
    category: "Breakfast",
    icon: img_unknown
  },
  {
    category: "Business Center",
    icon: img_unknown
  },
  {
    category: "Laundry Services",
    icon: img_unknown
  },
  {
    category: "Bar",
    icon: img_unknown
  },
  {
    category: "Swimming Pool",
    icon: img_unknown
  },
  {
    category: "Parking",
    icon: img_unknown
  },
  {
    category: "Television",
    icon: img_unknown
  },
  {
    category: "Currency Exchange",
    icon: img_unknown
  },
  {
    category: "Airport Shuttle",
    icon: img_unknown
  },
  {
    category: "Internet",
    icon: img_unknown
  },
  {
    category: "Non Smoking",
    icon: img_unknown
  },
  {
    category: "Restaurant",
    icon: img_unknown
  },
  {
    category: "Fitness Facility",
    icon: img_unknown
  },
  {
    category: "Pets Allowed",
    icon: img_unknown
  },
  {
    category: "Childcare Service",
    icon: img_unknown
  },
  {
    category: "Spa",
    icon: img_unknown
  }
];
export default HotelInfo;
