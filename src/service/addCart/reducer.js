import { filter as _filter,uniqWith as _uniq, isEqual,sumBy as _sumBy , map as _map, xor as _xor  } from 'lodash';
import actionType from "../addCart/actionType";

const itineraryListSession=JSON.parse(sessionStorage.getItem("itinerary"));
const refIdSession=JSON.parse(sessionStorage.getItem("refId"));
let itineraryArray = [];
let refIdArray = [];
if(itineraryListSession){
  itineraryArray=itineraryListSession
}

if (refIdSession) {
  refIdArray = refIdSession;
};

const initialState = {
  addDetails: null,
  getCartDetails: null,
  editDetails: null,
  itineraryList: itineraryArray,
  deleteDetails: null,
  wishlistStatus:{},
  wishListArray:[],
  dataDump:[],
  agentMailResult:false,
    refId:refIdArray
};

const addcartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADD_ITINERARY_SUCCESS:

      if (action.payload.type == "hotel") {
        let indexValue = +state.itineraryList.findIndex(detailsHotel => detailsHotel.bookingData.hasOwnProperty("hotel") && detailsHotel.bookingData.hotel.id === action.payload.bookingData.hotel.id)
        let arrayUpdated = state.itineraryList;
        if (indexValue >= 0) {
          let oldRoomIndex = arrayUpdated[indexValue].bookingData.room.findIndex(roomDetails => roomDetails.refId === action.payload.bookingData.room[0].refId)
          if (oldRoomIndex >= 0) {
            arrayUpdated[indexValue].bookingData.room[oldRoomIndex] = action.payload.bookingData.room[0]
            arrayUpdated[indexValue].subtitle = _sumBy(arrayUpdated[indexValue].bookingData.room, "roomCount") + " Rooms"

          } else {
            arrayUpdated[indexValue].bookingData.room.push(action.payload.bookingData.room[0])
            arrayUpdated[indexValue].subtitle = _sumBy(arrayUpdated[indexValue].bookingData.room, "roomCount") + " Rooms"
          }
          let totalPriceRoom = 0;
          let refid = [...state.refId, ..._map(arrayUpdated[indexValue].bookingData.room,obj =>obj.refId)];
          arrayUpdated[indexValue].bookingData.room.map((roomDetails) => {
            // let priceRoom = (roomDetails.roomCount * roomDetails.totalPriceIncTax) 
            let priceRoom = roomDetails.totalPriceIncTax
            totalPriceRoom = totalPriceRoom + priceRoom
          });
          arrayUpdated[indexValue].price = +totalPriceRoom.toFixed(2)
          arrayUpdated[indexValue].taxFees = action.payload.taxFees

          return {
            ...state,
            itineraryList: arrayUpdated,
              refId:_uniq(refid, isEqual)
          };
        }
        else {
          arrayUpdated.push(action.payload)
          arrayUpdated[arrayUpdated.length - 1].subtitle = _sumBy(arrayUpdated[arrayUpdated.length - 1].bookingData.room, "roomCount") + " Rooms"
          let totalPriceRoom = 0
          arrayUpdated[arrayUpdated.length - 1].bookingData.room.map((roomDetails) => {
            //let priceRoom = (roomDetails.roomCount * roomDetails.baseFare) * action.payload.bookingData.bookingDays
            // let priceRoom = (roomDetails.roomCount * roomDetails.totalPriceIncTax)
            let priceRoom = roomDetails.totalPriceIncTax 
            totalPriceRoom = totalPriceRoom + priceRoom
          })
          arrayUpdated[arrayUpdated.length - 1].price = +totalPriceRoom.toFixed(2)
          arrayUpdated[arrayUpdated.length - 1].taxFees = action.payload.taxFees
            let refid = [...state.refId, ..._map(arrayUpdated[arrayUpdated.length - 1].bookingData.room,obj =>obj.refId)];
          return{
            ...state,
            itineraryList:arrayUpdated,
              refId:_uniq(refid, isEqual)
          }
        }
      }else{
        return {
          ...state,
          itineraryList: _uniq([...state.itineraryList, action.payload],isEqual)
        };
      }
      
      case actionType.REMOVE_ITINERARY_SUCCESS:
       const refId =  _map(action.payload.bookingData.room,obj =>obj.refId)
      return {
        ...state,
          refId: _xor(state.refId, refId),
        itineraryList: _filter(state.itineraryList, item => item !== action.payload)
      };

    case actionType.ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlistStatus:action.payload
      };

    case actionType.ADD_TO_WISHLIST_FAILURE:
      return {
        ...state,
        wishlistStatus:action.payload
      };

    case actionType.VIEW_WISHLIST_SUCCESS:
      return {
        ...state,
        wishListArray:action.payload
      };

    case actionType.VIEW_WISHLIST_FAILURE:
      return {
        ...state,
        wishListArray:[]
      }; 
      case actionType.DUMPDATA:
      return {
        ...state,
        dataDump:action.payload
      }; 

      case actionType.REPLACE_ITINERARY:
      return {
        ...state,
        itineraryList:action.payload
      }; 
      case actionType.EMAIL_DETAIL_AGENT:
        return {
          ...state,
          emailDetailsForAgent:action.payload
        }; 
        case actionType.AGENT_MAIL_SUCCESS:
          return {
            ...state,
           agentMailResult:true
          }; 
          case actionType.AGENT_MAIL_FAILURE:
            return {
              ...state,
              agentMailResult:false
            }; 
    default:
      return state;
  }
};

export default addcartReducer;
