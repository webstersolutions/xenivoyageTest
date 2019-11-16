import axios from "../../Utils/request-process";
import actionType from "./actionType";
import URL from "./../../asset/configUrl";
import {toast, Flip} from "react-toastify";
import queryString from "query-string";

import {
    loadingSearch,
    stopSearching,
    loadingFailureSearch,
    stopFailureSearching
} from "../loader/action";
import {loadingGifSearch, stopGifSearching} from "../common/action";

export const loadingSearchFilter = () => dispatch => {
    dispatch({
        type: actionType.ENABLE_LOADING_SEARCH_FILTER
    });
};
export const searchByHotelName = (filter, hotelStarListCount) => dispatch => {
    const values = queryString.parse(filter);
    const {search} = values;
    if (search.trim().length >= 3 || search.trim() === "") {
        dispatch(loadingGifSearch());
        axios
            .get(URL.hotel.HOTEL_NAME + filter)
            .then((response) => {
                dispatch(stopGifSearching());
                let hitLength = response.data.hotels.length;
                let data = response.data.hotels
                let arr = [];
                if (hitLength > 0) {
                    for (let i = 0; i < hitLength; i++) {
                        arr.push(data[i].hotel);
                    }
                }
                dispatch({
                    type: actionType.SEARCHBY_HOTEL_NAME,
                    payload: arr,
                    apiHit: true
                });
            }).catch(function (error) {
            dispatch(stopGifSearching());
            // console.log("searchByName ====> request ERR ", error);
        });
    } else {
        dispatch({
            type: actionType.SEARCHBY_HOTEL_NAME,
            payload: hotelStarListCount,
            apiHit: false
        });
    }
};

export const elasticFilterApply = filter => dispatch => {
    dispatch(loadingGifSearch());
    const values = queryString.parse(filter);
    const {maxHotelPrice, maxRating, minHotelPrice, minRating} = values;
    const filters = {
        maxHotelPrice,
        minHotelPrice,
        maxHotelRating: maxRating,
        minHotelRating: minRating
    };
    axios
        .get(URL.hotel.HOTEL_NAME + filter)
        .then((response) => {
            dispatch(stopGifSearching());
            dispatch(stopSearchingFilter());
            let hitLength = response.data.hotels.length
            if (hitLength === 0) {
                dispatch({
                    type: actionType.HOTEL_FILTER_FAILURE,
                    payload: {
                        hotels: []
                    },
                    filterOptions: filters
                });
            } else {
                let data = response.data.hotels
                let arr = [];
                if (hitLength > 0) {
                    for (let i = 0; i < hitLength; i++) {
                        arr.push(data[i].hotel);
                    }
                }
                dispatch({
                    type: actionType.ELASTIC_FILTER_APPLY,
                    payload: arr,
                    filterOptions: filters
                });
            }
        }).catch((error) => {
        dispatch(stopGifSearching());
        dispatch(stopSearchingFilter());
        dispatch({
            type: actionType.HOTEL_FILTER_SUCCESS,
            payload: {
                hotels: []
            },
            filterOptions: filters
        });
    });
};
export const searchByRating = (sessionId, paging, filters) => dispatch => {
    // dispatch(loadingGifSearch());
    // setTimeout(function () {
    //   dispatch(stopGifSearching());
    //   dispatch({
    //     type: actionType.SEARCHBY_RATING,
    //     payload: ratingFilter
    //   });
    // }, 300);
    dispatch(loadingGifSearch());
    axios
        .post(URL.hotel.HOTEL_FILTER, {
            sessionId,
            paging,
            filters
        })
        .then(res => {
            // console.log("hotel Filter ", res, paging);
            dispatch(stopGifSearching());
            dispatch(stopSearchingFilter());
            // console.log(res.data.data.hotels);
            if (res.data.statusCode === 404) {
                dispatch({
                    type: actionType.HOTEL_FILTER_SUCCESS,
                    payload: {
                        hotels: []
                    },
                    inputPayload: paging
                });
            } else {
                dispatch({
                    type: actionType.SEARCHBY_RATING,
                    payload: res.data.data,
                    inputPayload: paging
                });
            }
        });
};

export const filteringOption = filter => dispatch => {
    // const { sessionId, paging, filters } = filter;
    const {
        guest,
        date,
        bounds,
        searchString,
        adult,
        child,
        childAgeValues,
        currency,
        paging,
        allowedCountry,
        premise,
        filters
    } = filter;
    const stayPeriod = {
        ...date
    };
    dispatch(loadingGifSearch());
    axios
        .post(URL.hotel.HOTEL_SEARCH, {
            currency,
            searchString,
            paging,
            filters,
            adult: {
                type: "adult",
                count: adult
            },
            child: {
                type: "child",
                count: child
            },
            stayPeriod,
            childAgeValues,
            bounds,
            allowedCountry,
            premise
        })
        .then(res => {
            dispatch(stopGifSearching());
            dispatch(stopSearchingFilter());
            // console.log("filter response ===> ", res);
            if (res.status == 200) {
                dispatch({
                    type: actionType.FILTER_OPTIONS_SUCCESS,
                    payload: res.data.data,
                    inputPayload: paging,
                    filterOptions: filters
                });
            } else {
                dispatch({
                    type: actionType.FILTER_OPTIONS_ERROR,
                    inputPayload: paging
                });
            }
        });
};
export const priceFiltering = ratingFilter => dispatch => {
    // console.log("priceFiltering", ratingFilter);
    dispatch(loadingGifSearch());
    setTimeout(function () {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PRICE_FILTER,
            payload: ratingFilter
        });
    }, 300);
};
export const stopSearchingFilter = () => dispatch => {
    dispatch({
        type: actionType.DISABLE_LOADING_SEARCH_FILTER
    });
};

export const loadExistsData = hotels => dispatch => {
    dispatch({
        type: actionType.LOAD_EXISTS_DATA,
        payload: hotels
    });
}


export const searchHotel = searchPayload => dispatch => {
    let {
        guest,
        date,
        bounds,
        searchString,
        adult,
        child,
        childAgeValues,
        currency,
        paging,
        allowedCountry,
        premise,
        filters,
        lat = null,
        lng = null,
        radius = null,
        email = '',
        room,
        nationality
    } = searchPayload;
    // const { guest, date, bounds, searchString ,currency} = searchPayload;
    const stayPeriod = {
        ...date
    };

    if (room !== "1") {
        adult = 2;
        child =0
    }

    dispatch(loadingGifSearch());
    axios
        .post(URL.hotel.HOTEL_SEARCH, {
            currency,
            searchString,
            paging,
            filters,
            adult: {
                type: "adult",
                count: adult
            },
            child: {
                type: "child",
                count: child
            },
            stayPeriod,
            childAgeValues,
            bounds,
            allowedCountry,
            premise,
            lat,
            lng,
            radius,
            email,
            nationality: JSON.parse(nationality)
        })
        .then(res => {
            dispatch(stopGifSearching());

            if (res.data.data.hotels.length > 0) {
                dispatch({
                    type: actionType.HOTEL_SEARCH_SUCCESS,
                    inputPayload: date,
                    page: paging,
                    payload: res.data.data
                });
            } else {
                dispatch({
                    type: actionType.HOTEL_SEARCH_FAILURE,
                });
            }
            dispatch(loadingSearch());
            setTimeout(() => {
                dispatch(stopSearching());
            }, 2000);
        })
        .catch(error => {
            dispatch(stopGifSearching());
            // console.log(error.response.data.data.error.error.Code)
            dispatch({
                type: actionType.HOTEL_SEARCH_FAILURE,
                error1: error.response.data.data.error.error.Code,

            });
            // console.log(error1)
            // dispatch(stopSearching());
            // dispatch(loadingFailureSearch());
            // setTimeout(() => {
            //     dispatch(stopFailureSearching());
            // }, 2000);
        });
};

export const filterHotel = (sessionId, price, currency) => dispatch => {
    dispatch(loadingSearch());
    dispatch(loadingGifSearch());
    axios
        .post("http://localhost:8080/api/hotel/filter", {
            sessionId,
            price,
            // minHotelRating,
            // maxHotelRating,
            // pageSize,
            currency
        })
        .then(res => {
            dispatch(stopGifSearching());

            if (res.data.statusCode === 404) {
                dispatch({
                    type: actionType.HOTEL_FILTER_FAILURE,
                    payload: {
                        hotels: []
                    },
                    inputPayload: {
                        price
                        // pageSize,
                        // minHotelRating,
                        // maxHotelRating
                    }
                });

                dispatch(loadingSearch());
                setTimeout(() => {
                    dispatch(stopSearching());
                }, 2000);
            } else {
                dispatch({
                    type: actionType.HOTEL_FILTER_SUCCESS,
                    payload: res.data.data,
                    inputPayload: {
                        price: price
                        // pageSize: pageSize,
                        // minHotelRating: minHotelRating,
                        // maxHotelRating: maxHotelRating
                    }
                });

                dispatch(loadingSearch());
                dispatch(stopSearching());

                dispatch(loadingFailureSearch());
                setTimeout(() => {
                    dispatch(stopFailureSearching());
                }, 2000);
            }
        })
        .catch(error => {
            dispatch(loadingGifSearch());
            dispatch({
                type: actionType.HOTEL_FILTER_FAILURE,
                error: error
            });

            dispatch(loadingFailureSearch());
            setTimeout(() => {
                dispatch(stopFailureSearching());
            }, 2000);
        });
};

export const filterHotelLoadMore = (
    sessionId,
    price,
    paging,
    filters,
    searchString,
    hotelCount
) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.hotel.HOTEL_FILTER, {
        sessionId,
        // price,
        paging,
        filters,
        searchString,
        hotelCount
    }).then(res => {
        // console.log("hotel Filter ", res, paging);
        dispatch(stopGifSearching());
        dispatch(stopSearchingFilter());
        if (res.data.statusCode === 404) {
            dispatch({
                type: actionType.HOTEL_FILTER_SUCCESS,
                payload: {
                    hotels: []
                },
                inputPayload: paging
            });
        } else {
            dispatch({
                type: actionType.HOTEL_FILTER_SUCCESS,
                payload: res.data.data,
                inputPayload: paging
            });
        }
    }).catch(error => {
        dispatch({
            type: actionType.HOTEL_FILTER_FAILURE,
            error: error.response.data.data
        });
    });
};

let roomListPayloadChange = myJson => {
    // console.log("roomListPayloadChange", myJson);
    let room = [];
    let ratesfull = [];
    let recommdationsfull = [];
    myJson.data.rooms.map((data, index) => {
        // console.log("room data", myJson.data.rates);
        let rates = myJson.data.rates;
        let recommendations = myJson.data.recommendations;
        // console.log("newRateArray data", data);
        let newRateArray = rates.filter(rates => {
            return (
                data.availableRoomCount > 0 &&
                data.refId == rates.rateOccupancies[0].roomRefId
            );
        });
        // console.log("newRateArray", newRateArray);
        let recomdations = [];
        newRateArray.map((rateData, i) => {
            rateData.FreeTotal = Number(rateData.FreeTotal)
            let singleRate = recommendations.find(recomandData => {
                return rateData.refId == recomandData.rateRefIds[0];
            });
            room.push({ ...data, FreeTotal: Number(rateData.FreeTotal) });
            ratesfull.push(rateData);
            recommdationsfull.push({...singleRate, FreeTotal: Number(rateData.FreeTotal)});
        });
    });
    // console.log("all array", room, ratesfull, recommdationsfull);
    return {
        ...myJson.data,
        ...{rooms: room},
        ...{rates: ratesfull},
        ...{recommendations: recommdationsfull}
    };
};

export const searchRoom = (sessionId, hotelId, currency, email) => dispatch => {
    dispatch(loadingGifSearch());
    axios
        .post(URL.hotel.ROOM_SEARCH, {
            sessionId,
            hotelId,
            currency,
            email
        })
        .then(res => {
            // console.log("this.state.res", res.data);
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ROOM_SEARCH_SUCCESS,
                payload: roomListPayloadChange(res.data)
            });
            //   dispatch({
            //     type: actionType.ROOM_SEARCH_SUCCESS,
            //     payload:res.data.data
            //  });
            dispatch(loadingSearch());
            setTimeout(() => {
                dispatch(stopSearching());
            }, 2000);
        })
        .catch(error => {
            if (error.response.status === 400) {
                dispatch(stopGifSearching());
                dispatch({
                    type: actionType.ROOM_SEARCH_SUCCESS,
                    payload: {
                        hotel: null,
                        rates: [],
                        recommendations: [],
                        roomOccupancies: [],
                        rooms: []
                    }
                });

                dispatch(stopSearching());

                dispatch(loadingFailureSearch());
                setTimeout(() => {
                    dispatch(stopFailureSearching());
                }, 2000);
            } else {
                dispatch({
                    type: actionType.ROOM_SEARCH_FAILURE,
                    error: error
                });

                dispatch(stopSearching());

                dispatch(loadingFailureSearch());
                setTimeout(() => {
                    dispatch(stopFailureSearching());
                }, 2000);
            }
        });
};

export const searchRoomStateless = payload => dispatch => {
    // console.log("sd,nmbvsmnbmnbsdmnsdbgmnbvsd,.ascd",payload)
    dispatch(loadingGifSearch());
    axios
        .post(URL.hotel.ROOM_SEARCHSTATELESS, payload)
        .then(res => {
            dispatch(stopGifSearching());
            //  dispatch({
            //    type: actionType.ROOM_SEARCH_SUCCESS,
            //    payload:res.data.data
            //  });
            if (res.data.data.hasOwnProperty("error")) {
                dispatch(stopGifSearching());
                dispatch({
                    type: actionType.ROOM_SEARCH_SUCCESS,
                    payload: {
                        hotel: null,
                        rates: [],
                        recommendations: [],
                        roomOccupancies: [],
                        rooms: []
                    }
                });
                dispatch(stopSearching());

                dispatch(loadingFailureSearch());
                setTimeout(() => {
                    dispatch(stopFailureSearching());
                }, 2000);
            } else {
                dispatch({
                    type: actionType.ROOM_SEARCH_SUCCESS,
                    payload: roomListPayloadChange(res.data)
                });
            }

            dispatch(loadingSearch());
            setTimeout(() => {
                dispatch(stopSearching());
            }, 2000);
        })
        .catch(error => {
            if (error.response.status === 400) {
                dispatch(stopGifSearching());
                dispatch({
                    type: actionType.ROOM_SEARCH_SUCCESS,
                    payload: {
                        hotel: null,
                        rates: [],
                        recommendations: [],
                        roomOccupancies: [],
                        rooms: []
                    }
                });

                dispatch(stopSearching());

                dispatch(loadingFailureSearch());
                setTimeout(() => {
                    dispatch(stopFailureSearching());
                }, 2000);
            } else {
                dispatch({
                    type: actionType.ROOM_SEARCH_FAILURE,
                    error: error
                });

                dispatch(stopSearching());

                dispatch(loadingFailureSearch());
                setTimeout(() => {
                    dispatch(stopFailureSearching());
                }, 2000);
            }
        });
};

export const getRoomPrice = payload => dispatch => {
    dispatch(loadingGifSearch());
    // console.log("ROOM_PRICE_FAILURE", payload);

    axios
        .post(URL.hotel.ROOM_PRICE, payload)
        .then(res => {
            // console.log("resssssss---", res.data);
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ROOM_PRICE_SUCCESS,
                payload: res.data.data
            });

            dispatch(loadingSearch());
            setTimeout(() => {
                dispatch(stopSearching());
            }, 2000);
        })
        .catch(error => {
            console.log("error price", error.response.data.data[0].error.Message)
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ROOM_PRICE_FAILURE,
                payload: error.response.data.data[0].error.Message,
                error: error
            });

            dispatch(stopSearching());
            dispatch(loadingFailureSearch());
            setTimeout(() => {
                dispatch(stopFailureSearching());
            }, 2000);
        });
};

export const bookRoom = roombookpayload => dispatch => {
    axios
        .post(URL.hotel.ROOM_PRICE, {
            roombookpayload
        })
        .then(res => {
            dispatch({
                type: actionType.ROOM_BOOKING_SUCCESS,
                payload: res.data.data
            });
        })
        .catch(error => {
            dispatch({
                type: actionType.ROOM_BOOKING_FAILURE,
                error: error.response.data.data
            });
        });
};

export const cancelRoom = bookingId => dispatch => {
    axios
        .post(URL.hotel.ROOM_PRICE, {
            bookingId
        })
        .then(res => {
            dispatch({
                type: actionType.ROOM_CANCEL_SUCCESS,
                payload: res.data.data
            });
        })
        .catch(error => {
            dispatch({
                type: actionType.ROOM_CANCEL_FAILURE,
                error: error.response.data.data
            });
        });
};

export const code = (currency, code) => dispatch => {
    dispatch({
        type: actionType.SELECTED_COUNTRYCODE_SUCCESS,
        payload: {code, currency}
    });
};


export const getRating = (sessionId) => dispatch => {

    axios.get(URL.hotel.HOTELS_RATING + sessionId).then(res => {
        dispatch({
            type: actionType.HOTELS_RATING,
            payload: res.data
        });
    }).catch(() => {
        dispatch({
            type: actionType.HOTELS_RATING,
            payload: {}
        });
    });
};

export const getCurrentCurrency = (payload) => dispatch => {
    // console.log(payload)
    dispatch({
        type: actionType.GET_CURRENCY_DETAILS_SUCCESS,
        payload: payload
    });
};

export const getCurrencyCode = () => dispatch => {
    axios.get(URL.hotel.GET_COUNTRY_CODE).then(res => {
        dispatch({
            type: actionType.GET_COUNTRYCODE_SUCCESS,
            payload: res.data
        });
    }).catch(() => {
        dispatch({
            type: actionType.GET_COUNTRYCODE_FAILURE,
            payload: {}
        });
    });
};

export const compareHotel = (hotel) => dispatch => {
    // console.log("action", hotel)
    dispatch({
        type: actionType.COMPARE_HOTELS,
        payload: hotel
    });
}


// toaster  function
// const _toast = ({
//   type,
//   message,
//   position
// }) => {
//   switch (type) {
//     case "success":
//       toast.success(message, {
//         position: position
//       });
//       break;
//     case "error":
//       toast.error(message, {
//         position: position
//       });
//       break;
//     case "warning":
//       break;
//       toast.warn(message, {
//         position: position
//       });
//     case "info":
//       break;
//       toast.info(message, {
//         position: position
//       });
//     case "default":
//       break;
//       toast(message, {
//         position: position
//       });
//     default:
//       break;
//   }
// };
