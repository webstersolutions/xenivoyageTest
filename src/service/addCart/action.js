import Notifications, { notify } from "react-notify-toast";

import axios from "../../Utils/request-process";
import actionType from "../addCart/actionType";
import URL from "../../asset/configUrl";

import {
    loadingGifSearch,
    stopGifSearching
  } from "../common/action";

export const addItinerary = itineraryPayload => dispatch => {
  dispatch({ type: actionType.ADD_ITINERARY_SUCCESS, payload: itineraryPayload });
};
export const removeItinerary = itineraryPayload => dispatch => {
  dispatch({ type: actionType.REMOVE_ITINERARY_SUCCESS, payload: itineraryPayload });
};

export const replaceItinerary = itineraryPayload => dispatch => {
    dispatch({ type: actionType.REPLACE_ITINERARY, payload: itineraryPayload });
  };

export const saveWishList = payloadWishList => dispatch => {
   //dispatch(loadingGifSearch())
  axios.post(URL.ADD_WISHLIST, payloadWishList)
      .then(res => {
         // dispatch(stopGifSearching())
          dispatch({
              type: actionType.ADD_TO_WISHLIST_SUCCESS,
              payload: res.data
          })
      })
      .catch(err => {
          //dispatch(stopGifSearching())
          dispatch({
              type: actionType.ADD_TO_WISHLIST_FAILURE,
              error: err
          });
      })
};

export const viewWishList = email => dispatch => {
  //dispatch(loadingGifSearch())
  axios.get(URL.VIEW_WISHLIST+email)
      .then(res => {
          // dispatch(stopGifSearching()
          dispatch({
              type: actionType.VIEW_WISHLIST_SUCCESS,
              payload: res.data
          })
      })
      .catch(err => {
          // dispatch(stopGifSearching())
          dispatch({
              type: actionType.VIEW_WISHLIST_FAILURE,
              error: err
          });
      })
};

export const dumpValue = data => dispatch => {
    console.log(data)
    //dispatch(loadingGifSearch())
    dispatch({
        type: actionType.DUMPDATA,
        payload: data
    })
  };
  
   
export const sendingEmailDetails = data => dispatch => {
    dispatch({
        type: actionType.EMAIL_DETAIL_AGENT,
        payload: data
    })
  };
export const sendEmailToAgent = data => dispatch => {
    console.log(data)
    axios.post(URL.EMAIL_TO_AGENT,data)
      .then(res => {
          notify.show("Mail Send Successfully", "success");
           dispatch(stopGifSearching())
          dispatch({
               type: actionType.AGENT_MAIL_SUCCESS,
              // payload: res.data
          })
      })
      .catch(err => {
          notify.show("Mail sending Failure", "success");
           dispatch(stopGifSearching())
          dispatch({
               type: actionType.AGENT_MAIL_FAILURE,
               error: err
          });
      })
  };
