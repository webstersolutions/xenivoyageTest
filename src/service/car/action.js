import axios from "../../Utils/request-process";
import URL from '../../asset/configUrl';
import actionType from '../car/actionType';
import _map from 'lodash/map';
import _difference from 'lodash/difference';

import {
    loadingGifSearch,
    stopGifSearching
} from "../common/action";

export const carSearch = (data) => dispatch => {
   
    dispatch(loadingGifSearch())
    axios.post(URL.CAR_SEARCH, data)
        .then(res => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_SEARCH_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_SEARCH_FAILURE,
                error: err

            })
        })
}

export const existsCarList = (data) => dispatch => {
    dispatch({
        type: actionType.CAR_EXISTS_LIST,
        payload: data
    })
}
export const carFilter = (carFilterPayload) => dispatch => {
    dispatch(loadingGifSearch())
    axios.post(URL.CAR_FILTER, carFilterPayload)
        .then(res => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_FILTER_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_FILTER_FAILURE,
                error: err
            });
        })

}

export const carESFilter = (carFilterPayload) => dispatch => {
    let companyList = _map(carFilterPayload.companyList, obj => obj.name);
    // let excludedCompany = _difference(companyList, carFilterPayload.filters.vendor.allow);
    // let excludedCars = _difference(carFilterPayload.carsType, carFilterPayload.filters.vehicleType.allow);
    let newPayload = {
        sessionId: carFilterPayload.sessionId,
        minPrice: carFilterPayload.filters.price.min,
        maxPrice: carFilterPayload.filters.price.max,
        sort: carFilterPayload.paging.orderBy === null ? null : carFilterPayload.paging.orderBy.split("price").pop().trim(),
        transmission: carFilterPayload.filters.transmission === "" ? [] : [carFilterPayload.filters.transmission],
        type: carFilterPayload.filters.vehicleType.allow,
        company: carFilterPayload.filters.vendor.allow,
        from: 0,
        size: 500,
        day: carFilterPayload.days
    };
    dispatch(loadingGifSearch())
    axios.post(URL.CAR_ES_FILTER, newPayload).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.CAR_FILTER_SUCCESS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(stopGifSearching())
        dispatch({
            type: actionType.CAR_FILTER_FAILURE,
            error: err
        });
    })
};

export const carFilterLoadMore = (carFilterPayload) => dispatch => {
    dispatch(loadingGifSearch())
    axios.post(URL.CAR_FILTER, carFilterPayload)
        .then(res => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_LOAD_MORE_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_LOAD_MORE_FAILURE,
                error: err
            });
        })
};

export const carPrice = (payload) => dispatch => {
    dispatch(loadingGifSearch())
    axios.post(URL.CAR_PRICE, payload)
        .then(res => {
            dispatch(stopGifSearching())
            if (payload.hasOwnProperty("bookingId")) {
                dispatch({
                    type: actionType.CAR_DETAILS_FROM_DATABASE_SUCCESS,
                    payload: res.data
                })
            } else {
                dispatch({
                    type: actionType.CAR_GET_PRICE_SUCCESS,
                    payload: res.data
                })
            }

        })
        .catch(err => {
            dispatch(stopGifSearching())
            if (payload.hasOwnProperty("bookingId")) {
                dispatch({
                    type: actionType.CAR_DETAILS_FROM_DATABASE_FAILURE,
                    payload: err
                })
            } else {
                dispatch({
                    type: actionType.CAR_GET_PRICE_FAILURE,
                    error: err
                })
            }

        })
}

export const carBooking = (data) => dispatch => {
    dispatch(loadingGifSearch())
    dispatch({
        type: actionType.CAR_BOOKING_SUCCESS,
        payload: {}
    })
    axios.post(URL.CAR_BOOKING, data)
        .then(res => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_BOOKING_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(stopGifSearching())
            dispatch({
                type: actionType.CAR_BOOKING_FAILURE
            })
        })
}

export const carBookingCancel = (data) => dispatch => {
    dispatch(loadingGifSearch())
    dispatch({
        type: actionType.CAR_BOOKING_CANCEL_SUCCESS,
        payload: {}
    });
    axios.post(URL.CAR_BOOKING_CANCEL, data)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.CAR_BOOKING_CANCEL_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.CAR_BOOKING_CANCEL_FAILURE
            })
        })

};

export const tripCarDeatiledList = (data) => dispatch => {
    axios.post(URL.CAR_MYTRIPS, data)
        .then(res => {
            dispatch({
                type: actionType.CAR_MY_TRIPS_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            // dispatch(stopGifSearching())
            // dispatch({
            //     type: actionType.CAR_BOOKING_CANCEL_FAILURE
            // })
        })
};


export const deletePaymentProps = (data) => dispatch => {
    dispatch({
        type: actionType.DELETE_PAYMENT_PROPS,
        payload: {}
    })
};

export const updatePagingDetails = (data) => dispatch => {
    dispatch({
        type: actionType.PAGING_DETAILS,
        payload: data
    })
};

export const carGetPayload = (data) => dispatch => {
    dispatch({
        type: actionType.CAR_PAYLOAD_SUCCESS,
        payload: data
    })

};


