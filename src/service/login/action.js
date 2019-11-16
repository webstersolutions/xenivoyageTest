import axios from "../../Utils/request-process";
import actionType from "../login/actionType";
import URL from "../../asset/configUrl";
import {toast} from "react-toastify";
import {notify} from "react-notify-toast";
import Cookies from "universal-cookie";

import {
    loadingSearch,
    stopSearching,
} from "../loader/action";
import {loadingGifSearch, stopGifSearching} from "../common/action";
import {resetTravelAgent} from '../dashboard/action';

const cookies = new Cookies();


export const googleLogin = googlepayload => dispatch => {
    axios.post(URL.USER_GOOGLE_LOGIN, googlepayload).then(res => {
        dispatch(loadingGifSearch());
        if (res.status === 200) {
            cookies.set("x-access-token", res.data.auth);
            sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.LOGIN_SUCCESS,
                payload: res.data.data
            });
            notify.show("Logged in successfully", "success", 3000);
        } else if (res.status === 400) {
            notify.show(res.data.message, "warning", 3000);
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.LOGIN_FAILURE,
            payload: error.response.data
        });
        notify.show(error.response.data.message, "error", 3000);
    });
};

export const facebookLogin = payload => dispatch => {
    axios.post(URL.USER_GOOGLE_LOGIN, payload).then(res => {
        dispatch(loadingGifSearch());
        if (res.status === 200) {
            cookies.set("x-access-token", res.data.auth);
            sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.LOGIN_SUCCESS,
                payload: res.data.data
            });
            notify.show("Logged in successfully", "success", 3000);
        } else if (res.status === 400) {
            notify.show(res.data.message, "warning", 3000);
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.LOGIN_FAILURE,
            payload: error.response.data
        });
        notify.show(error.response.data.message, "error", 3000);
    });
};
// STO guest booking

// gust booking for hoterl
export const payment = payload => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.hotel.ROOM_BOOKING, payload).then(res => {
        dispatch(stopGifSearching());
        if (res.status === 200) {
            dispatch({
                type: actionType.PAYMENT_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: actionType.PAYMENT_FAILURE,
                payload: res.status
            });
        }
        dispatch(loadingSearch());
        setTimeout(() => {
            dispatch(stopSearching());
        }, 2000);
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch(stopSearching());
        dispatch({
            type: actionType.PAYMENT_FAILURE,
            payload: error.response
        });
        dispatch(loadingSearch());
        setTimeout(() => {
            dispatch(stopSearching());
        }, 2000);
    });
};

// sto guest booking for car

export const carBooking = data => dispatch => {
    dispatch(loadingGifSearch());
    dispatch({
        type: actionType.CAR_BOOKING_SUCCESS,
        payload: {}
    });
    axios.post(URL.CAR_BOOKING, data).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.CAR_BOOKING_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.CAR_BOOKING_FAILURE
        });
    });
};

export const transferBook = data => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.TRANSFER_BOOK, [data]).then(res => {
        console.log("transfer success", res);
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.TRANSFER_BOOK_SUCCESS,
            payload: res.data.data.result[0]
        });
    }).catch(err => {
        console.log("transfer failure", err);
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.TRANSFER_BOOK_FAILURE,
            error: err
        });
    });
};

export const activityBook = data => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.ACTIVITY_BOOKING, [data]).then(res => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.ACTIVITY_BOOKING_FAILURE,
            error: err
        });
    });
};

//ENO guest booking
export const signUpInfo = signuppayload => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.USER_SIGNUP, signuppayload).then(res => {
        dispatch(stopGifSearching());
        sessionStorage.setItem("loginInfo", JSON.stringify(res.data));
        if (res.status === 200) {
            const userInfo = JSON.parse(sessionStorage.getItem("signUpInfo"));
            const payload = {
                email: userInfo && userInfo.email,
                password: userInfo && userInfo.password
            };
            dispatch({
                type: actionType.SIGNUP_SUCCESS,
                payload: res.data
            });
            notify.show(
                "Thanks for Registering with Us , Welcome to Xeniapp .Logged in successfully",
                "success",
                3000
            );
            dispatch(loginInfo(null, payload, null));
        } else if (res.status === 400) {
            notify.show("Registeration failed ,Please try again ", "warning", 3000);
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.SIGNUP_FAILURE,
            error: error.response.data.data
        });
        notify.show(error.response.data.data, "error", 3000);
    });
};

// STO guest booking

export const guestLoginInfo = (loginpayload, payloadInfo) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.USER_LOGIN, loginpayload).then(res => {
        dispatch(stopGifSearching());
        sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
        cookies.set("", "");
        if (res.status === 200) {
            axios.get(URL.USER_INFO + loginpayload.email).then(res => {
                if (res.status === 200) {
                    sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
                    dispatch({
                        type: actionType.GUEST_LOGIN_SUCCESS,
                        payload: res.data.data
                    });
                }
            });
            notify.show("Logged in successfully", "success", 3000);
            if (payloadInfo.isTrans === "transfer") {
                dispatch(transferBook(payloadInfo));
            } else if (payloadInfo.isActivity) {
                dispatch(activityBook(payloadInfo));
            } else {
                dispatch(payment(payloadInfo));
            }
        } else if (res.status === 400) {
            notify.show({message: res.data.message}, "warning", 3000);
            _toast({
                type: "warning",
                message: res.data.message,
                position: toast.POSITION.TOP_CENTER
            });
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.GUEST_LOGIN_FAILURE
        });
        notify.show(error.response.data.data, "error", 3000);
    });
};

export const bookingSignUpInfo = (guestFlag, signuppayload, payloadInfo) => async dispatch => {
    dispatch(loadingGifSearch());
    await axios.post(URL.USER_SIGNUP, signuppayload).then(res => {
        dispatch(stopGifSearching());
        sessionStorage.setItem("loginInfo", JSON.stringify(res.data));
        if (res.status === 200) {
            const userInfo = JSON.parse(sessionStorage.getItem("loginInfoBooking"));
            const payload = {
                email: userInfo && userInfo.email,
                password: userInfo && userInfo.password
            };
            dispatch({
                type: actionType.GUEST_SIGNUP_SUCCESS,
                payload: res.data
            });
            notify.show(
                "Thanks for Registering with Us , Welcome to Xeniapp .Logged in successfully",
                "success",
                3000
            );
            if (guestFlag === "BookingFlag") {
                dispatch(loginInfo(guestFlag, payload, payloadInfo));
            } else if (guestFlag === "CarBookingFlag") {
                dispatch(loginInfo(guestFlag, payload, payloadInfo));
            } else if (guestFlag === "TransferBookingFlag") {
                dispatch(loginInfo(guestFlag, payload, payloadInfo));
            }
        } else if (res.status === 400) {
            notify.show("Registeration failed ,Please try again", "warning", 3000);
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.GUEST_SIGNUP_FAILURE,
            error: error.response.data.data
        });
    });
};

export const signupReset = () => dispatch => {
    dispatch({
        type: "signupReset"
    });
};
// ENO guest booking

export const logOut = () => dispatch => {
    dispatch(loadingGifSearch());
    sessionStorage.clear();
    sessionStorage.clear("signupDetails");
    sessionStorage.clear("itinerary");
    sessionStorage.clear("isTrue");
    sessionStorage.clear("guestLoggedIn");
    dispatch({
        type: actionType.LOGOUT_SUCCESS
    });
    cookies.remove("x-access-token");
    dispatch(resetTravelAgent());
    dispatch(stopGifSearching());
    // dispatch(guestLogin());
    notify.show("Logged out successfully", "success", 3000);
};

export const loginInfo = (guestFlag, loginpayload, payloadInfo) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.USER_LOGIN, loginpayload).then(res => {
        dispatch(stopGifSearching());
        if (res.status === 200) {
            cookies.set("x-access-token", res.data.auth);
            axios.get(URL.USER_INFO + loginpayload.email).then(res => {
                if (res.status === 200) {
                    sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
                    dispatch({
                        type: actionType.LOGIN_SUCCESS,
                        payload: res.data.data
                    });
                    sessionStorage.setItem("loginTrue", JSON.stringify("true"));
                    notify.show("Logged in successfully", "success", 3000);
                    if (guestFlag === "BookingFlag") {
                        dispatch(payment(payloadInfo));
                    } else if (guestFlag === "CarBookingFlag") {
                        dispatch(carBooking(payloadInfo));
                    } else if (guestFlag === "TransferBookingFlag") {
                        dispatch(transferBook(payloadInfo));
                    } else if (guestFlag === 'ActivityBookingFlag') {
                        dispatch(activityBook(payloadInfo));
                    }
                } else if (res.status === 400) {
                    notify.show({message: res.data.message}, "warning", 3000);
                    _toast({
                        type: "warning",
                        message: res.data.message,
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            });
        } else if (res.status === 400) {
            notify.show({message: res.data.message}, "warning", 3000);
            _toast({
                type: "warning",
                message: res.data.message,
                position: toast.POSITION.TOP_CENTER
            });
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.LOGIN_FAILURE,
            error: error.response.data
        });
        notify.show(error.response.data.data, "error", 3000);
    });
};


export const guestLogin = () => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.GUEST_LOGIN).then(res => {
        dispatch(stopGifSearching());
        cookies.set("x-access-token", res.data.auth);
        sessionStorage.setItem("guestLoggedIn",JSON.stringify(res.data.guestLoggedIn));
    }).catch(error => {
        dispatch(stopGifSearching());
    });
};


export const forgetInfo = loginpayload => dispatch => {
    const {email} = loginpayload;
    dispatch(loadingGifSearch());
    axios
        .get(URL.USER_FORGETPASSWORD + email)
        .then(res => {
            dispatch(stopGifSearching());
            if (res.status === 200) {
                dispatch({
                    type: actionType.FORGETPASSWORD_SUCCESS,
                    payload: res.data
                });
                notify.show(res.data.data, "success", 3000);
            }
        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.FORGETPASSWORD_FAILURE,
                error: error.response.data
            });
            notify.show(error.response.data.data, "error", 3000);
        });
};

export const forgotPwdVality = payload => dispatch => {
    dispatch(loadingGifSearch());
    axios
        .get(URL.USER_PASSWORD_VALIDITY + payload)
        .then(res => {
            dispatch(stopGifSearching());
            console.log("forgot::::", res.data)
            if(res.data.status){
                dispatch({
                    type: actionType.FORGET_VALIDITY_SUCCESS,
                    payload: true
                });
            }else{
                dispatch({
                    type: actionType.FORGET_VALIDITY_FAILURE,
                    payload: false
                });
            }

        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.FORGET_VALIDITY_FAILURE,
                payload: false
            });
        })
}

export const newpasswordInfo = payload => dispatch => {
    dispatch(loadingGifSearch());
    axios
        .post(URL.USER_NEWPASSWORD, payload)
        .then(res => {
            dispatch(stopGifSearching());
            if (res.status === 200) {
                dispatch({
                    type: actionType.NEWPASSWORD_SUCCESS,
                    payload: res.data
                });
                notify.show(res.data.data, "success", 3000);
            }
        })
        .catch(error => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.NEWPASSWORD_FAILURE,
                error: error.response
            });
            notify.show(error.response.data, "error", 3000);
        });
};

export const paymentPro = payload => dispatch => {
    dispatch(loadingGifSearch());
    axios
        .post(URL.GOPROREGISTER, payload)
        .then(res => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.PAYMENTPRO_SUCCESS,
                payload: res.data
            });
            notify.show(res.data.data.message, "success", 3000);
        })
        .catch(error => {
            dispatch(stopGifSearching());
            notify.show(error.response.data.data.message, "error", 3000);
        });
};


export const getProfileInfo = () => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.USER_INFO).then(res => {
        dispatch(stopGifSearching());
        if (res.status === 200) {
            sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
            dispatch({
                type: actionType.LOGIN_SUCCESS,
                payload: res.data.data
            });
            sessionStorage.setItem("loginTrue", JSON.stringify("true"));
            // notify.show("Logged in successfully", "success", 3000);
        } else if (res.status === 400) {
            dispatch(stopGifSearching());
            cookies.remove("x-access-token");
            _toast({
                type: "warning",
                message: res.data.message,
                position: toast.POSITION.TOP_CENTER
            });
        }
    }).catch(error => {
        dispatch(stopGifSearching());
        dispatch({
            type: actionType.LOGIN_FAILURE,
            error,
        })
    });
};

const _toast = ({type, message, position}) => {
    switch (type) {
        case "success":
            toast.success(message, {
                position: position
            });
            break;
        case "error":
            toast.error(message, {
                position: position
            });
            break;
        case "warning":
            toast.warn(message, {
                position: position
            });
            break;
        case "info":
            toast.info(message, {
                position: position
            });
            break;
        case "default":
            toast(message, {
                position: position
            });
            break;
        default:
            break;
    }
};
