import axios from "../../Utils/request-process";
import actionType from "./actionType";
import { toast, Flip } from "react-toastify";
import URL from '../../asset/configUrl'
import { loadingGifSearch, stopGifSearching } from "../common/action";
import {
  loadingSearch,
  stopSearching,
  loadingFailureSearch,
  stopFailureSearching
} from "../loader/action"
export const getCard = email => dispatch => {
    // dispatch(loadingGifSearch());

  axios
    .get(URL.card.CARD_GET + email)
    .then(result => {
      dispatch({
        type: actionType.GET_CARD_SUCCESS,
        payload: result.data.data.data
      });
        // dispatch(stopGifSearching());

    })
    .catch(error => {
      dispatch({
        type: actionType.GET_CARD_FAILURE,
        payload: []
      });
      // dispatch(stopGifSearching());
    });
};

export const addCard = payload => dispatch => {
    dispatch(loadingGifSearch());
  axios
    .post(URL.card.CARD_ADD, payload)
    .then(result => {
      dispatch({
        type: actionType.ADD_CARD_SUCCESS,
        payload: result.data
      });
      dispatch(stopGifSearching());
      dispatch(getCard(payload.email));
      _toast({
        type: "success",
        message:"card has been added successfully",
        position: toast.POSITION.TOP_CENTER
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.ADD_CARD_FAILURE,
        payload: error
      });
      dispatch(stopGifSearching());
      _toast({
        type: "error",
        message: error.response.data.data,
        position: toast.POSITION.TOP_CENTER
      });
    });
};

export const deleteCard = payload => dispatch => {
      dispatch(loadingGifSearch());
  axios
    .post(URL.card.CARD_DELETE, payload)
    .then(result => {
      dispatch({
        type: actionType.DELETE_CARD_SUCCESS,
        payload: result.data
      });
       dispatch(getCard(payload.email));
       dispatch(stopGifSearching());
      // _toast({
      //   type: "success",
      //   message: result.data.message,
      //   position: toast.POSITION.TOP_CENTER
      // });
    })
    .catch(error => {
      dispatch({
        type: actionType.DELETE_CARD_FAILURE,
        payload: error
      });
      dispatch(stopGifSearching());
      // _toast({
      //   type: "error",
      //   message: error.response.data.data,
      //   position: toast.POSITION.TOP_CENTER
      // });
    });
};

const _toast = ({ type, message, position }) => {
  switch (type) {
    case "success":
      toast.success(message, { position: position });
      break;
    case "error":
      toast.error(message, { position: position });
      break;
    case "warning":
      break;
      toast.warn(message, { position: position });
    case "info":
      break;
      toast.info(message, { position: position });
    case "default":
      break;
      toast(message, { position: position });
    default:
      break;
  }
};
