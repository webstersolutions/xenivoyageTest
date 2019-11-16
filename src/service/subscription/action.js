import axios from "../../Utils/request-process";
import URL from '../../asset/configUrl';
import actionType from '../../service/subscription/actionType';
import Notifications, { notify } from "react-notify-toast";


import {
  loadingGifSearch,
  stopGifSearching
} from "../common/action";



export const getSubscriptionList = (email) => dispatch => {
    dispatch(loadingGifSearch());
    axios.get(URL.GET_SUBSCRIPTIONLIST + email)
        .then(res => {
            setTimeout(()=>{
                dispatch(stopGifSearching());
            },300)
            dispatch({
                type: actionType.SUBSCRIPTION_LIST_SUCCESS,
                payload: res.data.data.result
            })
        })
        .catch(err => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.SUBSCRIPTION_LIST_FAILURE,
                error: err
            })

        })
}
export const deleteUserSubscription = (deletepayload) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.DELETE_SUBSCRIPTION,deletepayload)
        .then(res => {
           if(res.status === 200){
            dispatch(stopGifSearching());
            dispatch(getSubscriptionList(deletepayload.email))
            dispatch({
                type: actionType.DELETE_SUBSCRIPTION_SUCCESS,
                payload: res.data

            });
            notify.show("Cancelled successfully", "success", 3000);
           }
           
        })
        .catch(err => {
            dispatch(stopGifSearching());
            dispatch({
                type: actionType.DELETE_SUBSCRIPTION_FAILURE,
                error: err
            })
            notify.show("Delete subscription failed", "error", 3000);
        })
}
export const updateUserCardDetails = (updatedata) => dispatch => {
    dispatch(loadingGifSearch());
    axios.post(URL.UPDATE_CARD,updatedata)
        .then(res => {
            if(res.status === 200){
                dispatch(stopGifSearching());
                dispatch(getSubscriptionList(updatedata.email))
            dispatch({
                type: actionType.SUBSCRIBED_USERCARD_UPDTAE_SUCCESS,
                payload: res
            })
        }
        notify.show("Card updated successfully", "success", 3000);
        })
        .catch(err => {
            // const 
            dispatch(stopGifSearching());
            dispatch({
                type:actionType.SUBSCRIBED_USERCARD_UPDTAE_FAILURE,
                error:err
            })
            notify.show("Please enter valid card information", "error", 3000);
        })

}