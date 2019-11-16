import actionType from '../../service/subscription/actionType';

const initialState = {
    subscriptionList: [],
    cancelSubscriptionDetails : null
}
const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.SUBSCRIPTION_LIST_SUCCESS:
            return ({
                ...state,
                subscriptionList: action.payload
            })

        case actionType.SUBSCRIPTION_LIST_FAILURE:
            return ({
                ...state,
                errors: action.error
            })
        case actionType.DELETE_SUBSCRIPTION_SUCCESS:
            return ({
                ...state,
                cancelSubscriptionDetails : action.payload
            })
        case actionType.DELETE_SUBSCRIPTION_FAILURE:
            return ({
                ...state,
                errors: action.error
            })
        case actionType.SUBSCRIBED_USERCARD_UPDTAE_SUCCESS:
            return ({
                ...state
            })
        case actionType.SUBSCRIBED_USERCARD_UPDTAE_FAILURE:
            return ({
                ...state,
                errors: action.error
            })  
        default: return state;
    }
}
export default subscriptionReducer;