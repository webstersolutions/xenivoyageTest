import axios from "../../Utils/request-process";
import URL from "../../asset/configUrl";
import actionType from "./actionType";

import _get from "lodash/get";

import { loadingGifSearch, stopGifSearching } from "../common/action";

export const transferSearch = data => dispatch => {
  dispatch(loadingGifSearch());
  axios
    .post(URL.TRANSFER_SEARCH, data)
    .then(res => {
      console.log("transfer success", res);
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.TRANSFER_SEARCH_SUCCESS,
        payload: res.data.data.result
      });
    })
    .catch(err => {
      console.log("transfer failure", err);
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.TRANSFER_SEARCH_FAILURE,
        error: err
      });
    });
};

export const transferBook = data => dispatch => {
  dispatch(loadingGifSearch());
  axios
    .post(URL.TRANSFER_BOOK, [data])
    .then(res => {
      console.log("transfer success", res);
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.TRANSFER_BOOK_SUCCESS,
        payload: res.data.data.result[0]
      });
    })
    .catch(err => {
      console.log("transfer failure", err);
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.TRANSFER_BOOK_FAILURE,
        error: err
      });
    });
};

export const transGetPayload = data => dispatch => {
  let datas = data;
  datas.isTrans = "transfer";
  dispatch({
    type: actionType.TRANS_PAYLOAD_SUCCESS,
    payload: datas
  });
};

export const tripTransferDeatiledList = data => dispatch => {
  axios
    .post(URL.TRANSFER_MYTRIPS, data)
    .then(res => {
      dispatch({
        type: actionType.TRANSFER_MY_TRIPS_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      // dispatch(stopGifSearching())
      // dispatch({
      //     type: actionType.CAR_BOOKING_CANCEL_FAILURE
      // })
    });
};

export const transferGetBooking = data => dispatch => {
  axios
    .post(URL.TRANSFER_BOOKING_INFO, data)
    .then(res => {
      dispatch({
        type: actionType.TRANSFER_GET_BOOKING_SUCCESS,
        payload: {
          ...res.data[0],
          ...res.data[0].taxi,
          image: res.data[0].image,
          currency: _get(res.data[0], "currency", null),
          convertedPrice: _get(res.data[0], "price", null)
        }
      });
    })
    .catch(err => {
      dispatch({
        type: actionType.TRANSFER_GET_BOOKING_FAILURE
      });
    });
};

export const transferCancelBooking = data => dispatch => {
  axios
    .post(URL.TRANSFER_CANCEL_BOOKING, data)
    .then(res => {
      if (res.data.message === "success") {
        dispatch({
          type: actionType.TRANSFER_CANCEL_BOOK_SUCCESS,
          payload: { status: true }
        });
      } else {
        dispatch({
          type: actionType.TRANSFER_CANCEL_BOOK_FAILURE,
          payload: { status: false }
        });
      }
    })
    .catch(err => {
      dispatch({
        type: actionType.TRANSFER_CANCEL_BOOK_FAILURE,
        payload: { status: false }
      });
    });
};

export const transferFilters = data => dispatch => {
  console.log(data);
    dispatch({
        type: actionType.TRANSFER_FILTER_SUCCESS,
        payload: data
    });
};
