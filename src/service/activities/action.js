import axios from "../../Utils/request-process";
import URL from "../../asset/configUrl";
import actionType from "../activities/actionType";
import _map from "lodash/map";
import _difference from "lodash/difference";
import queryString from 'query-string';


import {loadingGifSearch, stopGifSearching} from "../common/action";

export const activitySearch = data => dispatch => {
    dispatch(loadingGifSearch());
    let {limit, offsetLimit} = data;
    let queryParam = "?" + queryString.stringify({limit, offsetLimit});
    axios.post(URL.ACTIVITY_SEARCH + queryParam, data).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_SEARCH_SUCCESS,
            payload: res.data,
            destId: res.data.destId,
            skippedCount: limit
        });
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_SEARCH_FAILURE,
            error: err
        });
    });
};

export const getActivityInfo = (data, clb = null, clbPayload = null) => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.ACTIVITY_INFO_REQUEST,
    });

    axios
        .get(URL.ACTIVITY_INFO + data)
        .then(res => {
            dispatch(stopGifSearching());
            if (clb) {
                clb(clbPayload);
            }
            dispatch({
                type: actionType.ACTIVITY_INFO_SUCCESS,
                payload: res.data.data,
            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            if (clb) {
                clb(clbPayload);
            }
            dispatch({
                type: actionType.ACTIVITY_INFO_FAILURE,
                error
            })
        })
};

export const getActivityPrice = (data) => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.ACTIVITY_PRICE_REQUEST,
    });

    axios
        .post(URL.ACTIVITY_PRICE, data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ACTIVITY_PRICE_SUCCESS,
                payload: res.data,

            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ACTIVITY_PRICE_FAILURE,
                error
            })
        })
};

export const getActivityCalendar = data => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.ACTIVITY_CALENDER_REQUEST,
    });

    axios
        .post(URL.ACTIVITY_CALENDER, data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ACTIVITY_CALENDER_SUCCESS,
                payload: res.data,
            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ACTIVITY_CALENDER_FAILURE,
                error
            })
        })
};

export const activityFilter = (filter) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.ACTIVITY_FILTER, filter).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_SEARCH_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_SEARCH_FAILURE,
            error: err
        });
    })
};

export const updatePagingDetails = (data) => dispatch => {
    dispatch({
        type: actionType.PAGING_DETAILS,
        payload: data
    })
};

export const getActivityTrips = (email) => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.ACTIVITY_MYTRIPS + email).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_MYTRIP_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_MYTRIP_FAILURE,
            error: err
        });
    })
};

export const getSingleBookingTripInformation = ({distributorRef, distributorItemRef}) => dispatch => {
    dispatch(loadingGifSearch());

    let requestParam = `distributorRef=${distributorRef}&distributorItemRef=${distributorItemRef}`;
    axios.get(URL.ACTIVITY_GET_STATUS_BOOKING + requestParam).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_STATUS_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_STATUS_FAILURE,
            error: err
        });
    });
};

export const activityBook = (data) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.ACTIVITY_BOOKING, data).then(res => {
        dispatch(stopGifSearching());
        if (res.data.bookingConfirmObj) {
            dispatch({
                type: actionType.ACTIVITY_BOOKING_SUCCESS,
                payload: res.data.bookingConfirmObj[0],
            });
        } else {
            dispatch({
                type: actionType.ACTIVITY_BOOKING_FAILURE,
                error: res.data
            })
        }
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_FAILURE,
            error: err
        });
    })
};

export const activityGetPayload = data => dispatch => {
    let finalData = data;
    finalData.isActivity = true;
    dispatch({
        type: actionType.ACTIVITY_PAYLOAD_SUCCESS,
        payload: finalData
    });
};

export const getActivityHotels = (data) => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.ACTIVITY_LIST_HOTEL_REQUEST,
    });

    axios
        .get(URL.ACTIVITY_LIST_HOTELS + data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.ACTIVITY_LIST_HOTEL_SUCCESS,
                payload: res.data.data,
            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            /*if (clb) {
                clb(clbPayload);
            }*/
            dispatch({
                type: actionType.ACTIVITY_LIST_HOTEL_FAILURE,
                error
            })
        })
};

export const cancelActivity = (payload, requestParam) => dispatch => {
    dispatch(loadingGifSearch());

    axios.post(URL.ACTIVITY_CANCEL_BOOKING, payload).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_CANCELLED_SUCCESSFULLY,
        });
        dispatch(getSingleBookingTripInformation(requestParam))
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_CANCELLED_FAILURE,
            error
        });
    });
};

export const getCategoryList = (param) => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.ACTIVITY_GET_CATEGORY + param).then(({data}) => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_GET_CATEGORY_SUCCESS,
            payload: data
        });
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_GET_CATEGORY_FAILURE,
            error
        });
    });
};

export const getCancellationCode = () => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.ACTIVITY_GET_CANCEL).then(({data}) => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_GET_CANCEL_SUCCESS,
            payload: data
        });
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_GET_CANCEL_FAILURE,
            error
        });
    });
};


export const activityLocationSearch = param => dispatch => {
    dispatch({
        type: actionType.ACTIVITY_GET_LOCATIONS_REQUEST,
    });
    axios.get(URL.ACTIVITY_GET_LOCATIONS + param)
        .then(({ data }) => {
            dispatch({
                type: actionType.ACTIVITY_GET_LOCATIONS_SUCCESS,
                payload: data.slice(0, 10),
            })
        }).catch(error => {
            dispatch({
                type: actionType.ACTIVITY_GET_LOCATIONS_FAILURE,
                error,
            })
        })
};
