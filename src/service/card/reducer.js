import actionType from './actionType'

const initialState = {
  addDetails: null,
  getCardDetails: null,
  editDetails: null,
  deleteDetails: null
};

const cardReducer = ( state = initialState , action )=>{
   switch (action.type) {
       case actionType.GET_CARD_SUCCESS :
          return {
            ...state,
            getCardDetails:action.payload
          }
        case actionType.GET_CARD_FAILURE:
        return {
            ...state,
            getCardDetails:action.payload
        }
         case actionType.ADD_CARD_SUCCESS :
          return {
            ...state,
            addDetails:action.payload
          }
        case actionType.ADD_CARD_FAILURE:
        return {
            ...state,
            delete:action.payload
        }
          case actionType.ADD_CARD_SUCCESS :
          return {
            ...state,
            deleteDetails:action.payload
          }
        case actionType.ADD_CARD_FAILURE:
        return {
            ...state,
            deleteDetails:action.payload
        }
       default:
           return state;
   }
}

export default cardReducer;