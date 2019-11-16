import React from "react";
import PropTypes from "prop-types";
import GoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";
import queryString from "query-string";
import moment from "moment";
import {filter as _map, last as _last, get as _get} from "lodash";

// const MY_API_KEY = "AIzaSyDZng2yRc6-MiBWPr71vQwQLrKvvqE789I";

// const values = queryString.parse(window.location.search);

class LocationSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            value: "",
            rectangle: null,
            currentTab: ""
        };
    }

    static defaultProps = {
        prefix: ""
    };

    componentWillMount = () => {
        if (window.location.search) {
            const values = queryString.parse(window.location.search);
            this.setState({value: values.searchText});
        }
    };
    handleInputChange = e => {
        const prefix =
            e.target.value.split(" ").length === 1 ? this.props.prefix : "";
        this.setState({
            search: prefix + " " + e.target.value,
            value: e.target.value
        });
    };

    handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
        const {ea, la} = geocodedPrediction.geometry.viewport;

        const {tab} = this.props;
        let postalCode;
        if (tab === "transfer") {
            postalCode = _get(_last(geocodedPrediction.address_components), "long_name");
        }
        let latitude = geocodedPrediction.geometry.location.lat();
        let longitude = geocodedPrediction.geometry.location.lng();
        let premise = "";
        const countryInfo = _map(
            geocodedPrediction.address_components,
            (each, i) => {
                return each.types.includes("country") && each.short_name;
            }
        );
        const geoCode = {
            latitude: latitude,
            longitude: longitude
        };
        sessionStorage.setItem("geoCode", JSON.stringify(geoCode));
        sessionStorage.setItem(
            "countryInfo",
            JSON.stringify(countryInfo[0].short_name)
        );

        if (
            originalPrediction.types.includes("lodging") ||
            originalPrediction.types.includes("premise")
        ) {
            premise = originalPrediction["structured_formatting"]["main_text"];
        }
        this.setState(
            {
                search: "",
                value: originalPrediction.description
                // rectangle: rectangle
            },
            () => {
                const {onSearch} = this.props;
                const {rectangle} = this.state;
                const searchPayload = {
                    bounds: {rectangle},
                    searchString: geocodedPrediction.formatted_address.replace(/[^a-z0-9,   ]/gi,''),
                    originSearch: originalPrediction.description.replace(/[^a-z0-9, ]/gi,'')
                };
                if (tab === "transfer") {
                    onSearch(searchPayload, premise, originalPrediction.types, geoCode, postalCode);
                } else {
                    onSearch(searchPayload, premise, originalPrediction.types, geoCode, postalCode);
                }
            }
        );
    };

    getPrediction = description => {
        let desc;
        if (description.types[0] === "locality") {
            desc = "City";
        } else if (description.types[0] === "administrative_area_level_1") {
            desc = "Region";
        } else {
            desc = description.types[0]
                .replace(/[\d_]+/g, " ")
                .toLowerCase()
                .split(" ")
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ");
        }
        return (
            <div>
                {description.description.length > 100 ? (
                    <span className="-text-width">{description.description}</span>
                ) : (
                    <div>
                        <span className="-text-width">{description.description}</span>
                        <span
                            className="float-right"
                            style={{
                                fontSize: "12px",
                                fontWeight: "400"
                            }}
                        >
              {description.types[0].includes("_") ? desc : desc}{" "}
            </span>
                    </div>
                )}
            </div>
        );
    };

    render() {
        const {search, value, currentTab} = this.state;
        const {tab} = this.props;
        if (tab !== currentTab) {
            this.setState({
                currentTab: tab,
                value: ""
            });
        }
        return (
            <GoogleMapLoader
                params={{
                    key: process.env.GOOGLE_API_KEY,
                    libraries: "places,geocode"
                }}
                render={googleMaps => {
                    return (
                        googleMaps && (
                            <GooglePlacesSuggest
                                googleMaps={googleMaps}
                                autocompletionRequest={{
                                    input: search
                                    // Optional options
                                    // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                                }}
                                // Optional props
                                onSelectSuggest={(pre, org) =>
                                    this.handleSelectSuggest(pre, org)
                                }
                                textNoResults="My custom no results text" // null or "" if you want to disable the no results item
                                customRender={prediction => (
                                    <div className="customWrapper">
                                        {prediction
                                            ? this.getPrediction(prediction)
                                            : "please try nearby location"}
                                    </div>
                                )}
                            >
                                <input
                                    type="text"
                                    value={value}
                                    /* onBlur={this.handleSearch} */
                                    placeholder={this.props.placeholder}
                                    onChange={this.handleInputChange}
                                />
                            </GooglePlacesSuggest>
                        )
                    );
                }}
            />
        );
    }
}

LocationSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
    prefix: PropTypes.string
};

export default LocationSearch;
