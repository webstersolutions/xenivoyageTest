import request from "../../Utils/request-process";
import axios from 'axios'

import URL from "../../asset/configUrl";
import actionType from "./actionType";

export const loadingSearch = () => dispatch => {
  dispatch({
    type: actionType.ENABLE_LOADING_SEARCH
  });
};
export const stopSearching = () => dispatch => {
  dispatch({
    type: actionType.DISABLE_LOADING_SEARCH
  });
};
export const loadingGifSearch = () => dispatch => {
  dispatch({
    type: actionType.ENABLE_LOADING_GIF_SEARCH
  });
};
export const stopGifSearching = () => dispatch => {
  dispatch({
    type: actionType.DISABLE_LOADING_GIF_SEARCH
  });
};

export const getUserIp = () => dispatch => {
  axios.get('https://ip-api.com/json/?')
    .then(res => {
      if (res.status == 200) {
        dispatch({
          type: actionType.USERIP_SUCCESS,
          payload: res.data.countryCode
        });
      }
      else {
        dispatch({
          type: actionType.USERIP_FAILURE,
          payload: 'US'
        });
      }
    })
    .catch(err => {
      dispatch({
        type: actionType.USERIP_FAILURE,
        payload: 'US'
      });
    })
};


export const init = () => dispatch => {
  request
    .get(URL.init)
    .then((res, ...rest) => {
      dispatch({
        type: actionType.COUNTRYCODE_SUCCESS,
        payload: res.data
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.COUNTRYCODE_FAILURE,
        //error: error.response.data
      });
    });
};

export const code = (currency, code,currencyFlag,currencySym) => dispatch => {
  dispatch({
    type: actionType.SELECTED_COUNTRYCODE_SUCCESS,
    payload: { code, currency, currencyFlag, currencySym }
  });
};

// export const currencyCode = (currency) => dispatch => {
//   dispatch({
//     type: actionType.SELECTED_CURRENCYCODE_SUCCESS,
//     payload: currency
//   });
// };

export const logEntry = (type, error) => dispatch => {
  request.post(URL.ERROR_LOG+(new Date().valueOf()), { type, error })
};


