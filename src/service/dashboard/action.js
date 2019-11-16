import axios from "../../Utils/request-process";
import URL from "../../asset/configUrl";
import Notifications, { notify } from "react-notify-toast";
import actionType from "../../service/dashboard/actionType";

import {
  loadingSearch,
  stopSearching,
  loadingFailureSearch,
  stopFailureSearching
} from "../loader/action";

import { loadingGifSearch, stopGifSearching } from "../common/action";

export const updateProfile = profile => dispatch => {
  const { personal_information, address } = profile;
  dispatch(loadingGifSearch());
  axios
    .post(URL.PROFILE_EDIT, {
      personal_information,
      address
    })
    .then(res => {
      if (res.status === 200) {
        dispatch(stopGifSearching());
        dispatch(getProfile(personal_information.email));
        dispatch({
          type: actionType.PROFILE_UPDATE_SUCCESS,
          payload: res.data
        });
        notify.show("Profile Updated successfully", "success", 3000);
      }
    })
    .catch(error => {
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.PROFILE_UPDATE_FAILURE,
        error: error
      });
      notify.show("Please try again", "error", 3000);
    });
};
export const getProfile = email => dispatch => {
  axios
    .get(URL.GET_PROFILE + email)
    .then(res => {
      dispatch({
        type: actionType.GET_PROFILE_SUCCESS,
        payload: res.data
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.GET_PROFILE_FAILURE,
        error: error
      });
    });
};

export const changePassword = data => dispatch => {
  dispatch(loadingGifSearch());
  axios
    .post(URL.CHANGE_PASSWORD, data)
    .then(res => {
      dispatch(stopGifSearching());
      if (res.status === 200) {
        dispatch({
          type: actionType.CHANGE_PASSWORD_SUCCESS,
          payload: res.data
        });
        notify.show("Password changed successfully", "success", 3000);
      }
    })
    .catch(error => {
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.CHANGE_PASSWORD_FAILURE,
        error: error
      });
     
      if ((error.response.data.data).toLowerCase() === "current password is incorrect") {
        notify.show("Current password is incorrect", "error", 3000);
      } else if (
        (error.response.data.data).toLowerCase() ===
        "newpassword and current password should not be same"
      ) {
        notify.show(
          "Newpassword and current password should not be same",
          "error",
          3000
        );
      }
    });
};

export const tripDeatiledList = data => dispatch => {
  axios
    .post(URL.TRIP_DETAILS, data)
    // .post('http://192.168.2.105:8080/api/user/getUserTransactions', data) // remove this it's for test purpose
    .then(res => {
      dispatch({
        type: actionType.TRIP_SUCCES,
        payload: res.data.transactionlist
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.TRIP_FAILURE,
        error: error
      });
    });
};
export const recentActivityList = data => dispatch => {
  dispatch(loadingGifSearch());
  axios
    // .get(URL.RECENT_ACTIVITY CHANGE URL)
    // .get('http://192.168.2.105:8080/api/user/getRecentActivity?email=' + data.email, {
    .get(URL.RECENT_ACTIVITY + data.email, {
      headers: {
        "secret-code": "xeni-app-development"
      }
    })
    .then(res => {
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.RECENT_ACTIVITY_SUCCESS,
        payload: res.data.transactionlist
      });
    })
    .catch(error => {
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.RECENT_ACTIVITY_FAILURE,
        error: error
      });
    });
};
export const profileImageChange = data => dispatch => {
  axios
    // .post('http://192.168.2.105:8080/api/user/getRecentActivity?email=' + data.email, {
    .post(URL.RECENT_ACTIVITY + data.email, {
      headers: {
        "secret-code": "xeni-app-development"
      }
    })
    .then(res => {
      dispatch({
        type: actionType.PROFILE_IMAGE_SUCCESS,
        payload: res.data.transactionlist
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.PROFILE_IMAGE_FAILURE,
        error: error
      });
    });
};

export const getRefundAmount = data => dispatch => {
  dispatch(loadingGifSearch());

  axios
    .post(URL.GET_REFUND_AMOUNT, data, {
      headers: {
        "secret-code": "xeni-app-development"
      }
    })
    .then(res => {
      dispatch(stopGifSearching());

      dispatch({
        type: actionType.REFUND_SUCCESS,
        payload: res.data
      });
    })
    .catch(error => {
      dispatch(stopGifSearching());

      dispatch({
        type: actionType.REFUND_FAILURE,
        error: error
      });
    });
};

export const cancelRouteReset = () => dispatch => {
  dispatch({
    type: "routeReset"
  });
};

export const resetTravelAgent = () => dispatch => {
    dispatch({
        type: "GET_PROFILE_FAILURE"
    });
}
export const getCancelInfo = data => dispatch => {
  dispatch({
    type: actionType.CANCEL_ROUTE_INFO,
    payload: data
  });
};

export const cancelledBooking = data => dispatch => {
  dispatch(loadingGifSearch());

  axios
    .post(URL.CANCELLED_BOOKING, data, {
      headers: {
        "secret-code": "xeni-app-development"
      }
    })
    .then(res => {
      dispatch(stopGifSearching());

      dispatch({
        type: actionType.CANCELLED_SUCCESS,
        payload: res.data
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.CANCELLED_FAILURE,
        error: error
      });
      dispatch(stopGifSearching());
    });
};

export const cancelledConfirmReset = () => dispatch => {
  dispatch({
    type: "cancelConfromReset"
  });
};

export const upload = data => dispatch => {
  dispatch(loadingGifSearch());
  axios
    .post(URL.UPLOAD_PICTURE, data)

    .then(response => {
      dispatch(stopGifSearching());
      dispatch({
        type: actionType.UPLOAD_IMAGE_SUCCESS,
        payload: response.data.data
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.UPLOAD_IMAGE_FAILURE,
        error: error.response.data
      });
      dispatch(stopGifSearching());
    });
};
