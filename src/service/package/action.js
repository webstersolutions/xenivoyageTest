import axios from "../../Utils/request-process";
import URL from "../../asset/configUrl";
import actionType from "../package/actionType";
import _map from "lodash/map";
import _difference from "lodash/difference";
import queryString from 'query-string';


import {loadingGifSearch, stopGifSearching} from "../common/action";
import SearchTool from "../../component/container/searchTool/SearchTool";

export const packageSearch = data => dispatch => {
    dispatch(loadingGifSearch());
    
    let {limit, offsetLimit,countryId,fromDate,toDate} = data;
    
    // const body= queryString.stringify({countryId,fromDate,toDate});

    var todayTime = new Date(fromDate);
    var month= ("0" + (todayTime.getMonth() + 1)).slice(-2);
    
    var day = ("0" + (todayTime .getDate())).slice(-2);
    var year = (todayTime .getFullYear());
    var a= year + "-" + month + "-" + day;
    fromDate=a;

    var todayTime = new Date(toDate);
    //var month = (todayTime .getMonth() + 1);
    var month= ("0" + (todayTime.getMonth() + 1)).slice(-2)
    var day = ("0" + (todayTime .getDate())).slice(-2);
    var year = (todayTime .getFullYear());
    var b= year + "-" + month + "-" + day;
    toDate=b;

    // let queryParam = "?" + queryString.stringify({limit, offsetLimit,countryId,fromDate,toDate});
    let body = JSON.stringify({limit, offsetLimit,countryId,fromDate,toDate});

    axios.post("https://xenivoyage.com/api/packagesList.php" ,body).then(res => {
        dispatch(stopGifSearching());
       // console.log("Hiiiiii", res);
        
        dispatch({
            type: actionType.PACKAGE_SEARCH_SUCCESS,
            payload: res.data,
            // destId: res.data.package_id,
            skippedCount: limit
        });
        
        
    }).catch(err => {
      //  console.log("err", err);
        
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_SEARCH_FAILURE,
            error: err
        });
    });
};

export const getPackageInfo = (data, clb = null, clbPayload = null) => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.PACKAGE_INFO_REQUEST,
    });
    let {packageId, currencyCode} = data;
let body=JSON.stringify({packageId});

    axios
        .post("https://xenivoyage.com/api/packageDetails.php" ,body)
        .then(res => {
            dispatch(stopGifSearching());
            if (clb) {
                clb(clbPayload);
            }
            dispatch({
                type: actionType.PACKAGE_INFO_SUCCESS,
                payload: res.data.data,
            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            if (clb) {
                clb(clbPayload);
            }
            dispatch({
                type: actionType.PACKAGE_INFO_FAILURE,
                error
            })
        })
};

export const getPackagePrice = (data) => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.PACKAGE_PRICE_REQUEST,
    });

    axios
        .post(URL.PACKAGE_PRICE, data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.PACKAGE_PRICE_SUCCESS,
                payload: res.data,

            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.PACKAGE_PRICE_FAILURE,
                error
            })
        })
};

export const getPackageCalendar = data => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.PACKAGE_CALENDER_REQUEST,
    });

    axios
        .post(URL.PACKAGE_CALENDER, data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.PACKAGE_CALENDER_SUCCESS,
                payload: res.data,
            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.PACKAGE_CALENDER_FAILURE,
                error
            })
        })
};


export const updatePagingDetails = (data) => dispatch => {
    dispatch({
        type: actionType.PAGING_DETAILS,
        payload: data
    })
};

export const getPackageTrips = (email) => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.PACKAGE_MYTRIPS + email).then(res => {

        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_MYTRIP_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_MYTRIP_FAILURE,
            error: err
        });
    })
};

export const getSingleBookingTripInformation = ({bookingId, email}) => dispatch => {
    dispatch(loadingGifSearch());

    let requestParam = `vmid=${bookingId}&email=${email}`;
    axios.get(URL.PACKAGE_GET_STATUS_BOOKING + requestParam).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_BOOKING_STATUS_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_BOOKING_STATUS_FAILURE,
            error: err
        });
    });
};

export const packageBook = (data) => dispatch => {
    dispatch(loadingGifSearch());

    // dispatch({
    //     type: actionType.PACKAGE_BOOKING_SUCCESS,
    //    // payload: res.data.bookingConfirmObj[0],
    // });
    axios.post(URL.PACKAGE_BOOKING, data).then(res => {
        dispatch(stopGifSearching());
        if (res.data) {
            dispatch({
                type: actionType.PACKAGE_BOOKING_SUCCESS,
                payload: res.data,
            });
        } else {
            dispatch({
                type: actionType.PACKAGE_BOOKING_FAILURE,
                error: res.data
            })
        }
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_BOOKING_FAILURE,
            error: err
        });
    })
};

export const packageGetPayload = data => dispatch => {
    let finalData = data;
    finalData.isPackage = true;
    dispatch({
        type: actionType.PACKAGE_PAYLOAD_SUCCESS,
        payload: finalData
    });
};

export const getPackageHotels = (data) => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.PACKAGE_LIST_HOTEL_REQUEST,
    });

    axios
        .get(URL.PACKAGE_LIST_HOTELS + data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.PACKAGE_LIST_HOTEL_SUCCESS,
                payload: res.data.data,
            });
        })
        .catch(error => {
            dispatch(stopGifSearching());
            /*if (clb) {
                clb(clbPayload);
            }*/
            dispatch({
                type: actionType.PACKAGE_LIST_HOTEL_FAILURE,
                error
            })
        })
};


export const packageFilter = (filter) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post("https://xenivoyage.com/api/packagesFilter.php", filter).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_SEARCH_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_SEARCH_FAILURE,
            error: err
        });
    })
};

export const cancelPackage = (payload, requestParam) => dispatch => {
    dispatch(loadingGifSearch());

    axios.post(URL.PACKAGE_CANCEL_BOOKING, payload).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_BOOKING_CANCELLED_SUCCESSFULLY,
        });
        dispatch(getSingleBookingTripInformation(requestParam))
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_BOOKING_CANCELLED_FAILURE,
            error
        });
    });
};

export const getCategoryList = (param) => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.PACKAGE_GET_CATEGORY + param).then(({data}) => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_GET_CATEGORY_SUCCESS,
            payload: data
        });
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_GET_CATEGORY_FAILURE,
            error
        });
    });
};

export const getInterestList = () => dispatch => {
    dispatch(loadingGifSearch());
    axios.post("https://xenivoyage.com/api/getInterests.php").then(({data}) => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_GET_INTEREST_SUCCESS,
            payload: data.data
        });
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_GET_INTEREST_FAILURE,
            error
        });
    });
};

export const getCancellationCode = () => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.PACKAGE_GET_CANCEL).then(({data}) => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_GET_CANCEL_SUCCESS,
            payload: data
        });
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.PACKAGE_GET_CANCEL_FAILURE,
            error
        });
    });
};


export const packageLocationSearch = param => dispatch => {
    dispatch({
        type: actionType.PACKAGE_GET_LOCATIONS_REQUEST,
    });
    let body = JSON.stringify({param});

    axios.post("https://xenivoyage.com/api/getDestinations.php",body)
        .then(({ data }) => {

            dispatch({
                type: actionType.PACKAGE_GET_LOCATIONS_SUCCESS,
                payload: data.data,
            })
        }).catch(error => {
            dispatch({
                type: actionType.PACKAGE_GET_LOCATIONS_FAILURE,
                error,
            })
        })
};


