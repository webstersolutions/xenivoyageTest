import actionType from "./actionType";
import _filter from "lodash/filter";
import _map from "lodash/map";
import _orderBy from "lodash/orderBy";
import _includes from "lodash/includes";
const initialState = {
  transferList: [],
  taxiTravelDistance: 0,
  bookingNumber: null,
  transferBookedDetails: null,
  transferCancelBookStatus: null,
  transferFilterList: [],
  transferTempList: []
};

const transferReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.TRANSFER_SEARCH_SUCCESS:
      return {
        ...state,
        bookingNumber: null,

        transferList: _map(
          _orderBy(
            action.payload.limousines,
            ["totalAmount"],
            ["asc"],
            limousine => ({
              ...limousine,
              exampleCars: _map(
                _filter(
                  action.payload.limousines,
                  l => l.booking_category === limousine.booking_category
                ),
                example => example.car_model
              )
            })
          )
        ),
        transferTempList: _map(
          _orderBy(
            action.payload.limousines,
            ["totalAmount"],
            ["asc"],
            limousine => ({
              ...limousine,
              exampleCars: _map(
                _filter(
                  action.payload.limousines,
                  l => l.booking_category === limousine.booking_category
                ),
                example => example.car_model
              )
            })
          )
        ),
        estimatedTime: {
          endTime: action.payload.end_time,
          startTime: action.payload.start_time
        },
        taxiTravelDistance: action.payload.distance
      };
    case actionType.TRANSFER_SEARCH_FAILURE:
      return {
        ...state,
        transferList: [],
        bookingNumber: null
      };
    case actionType.TRANSFER_BOOK_SUCCESS:
      return {
        ...state,
        bookingNumber: action.payload.booking_number
      };
    case actionType.TRANSFER_BOOK_FAILURE:
      return {
        ...state,
        bookingNumber: null
      };
    case actionType.TRANSFER_MY_TRIPS_SUCCESS:
      return {
        ...state,
        transferMyTrips: action.payload
      };
    case actionType.TRANSFER_MY_TRIPS_FAILURE:
      return {
        ...state,
        transferMyTrips: []
      };
    case actionType.TRANS_PAYLOAD_SUCCESS:
      return {
        ...state,
        transPaymentInfo: action.payload
      };
    case actionType.TRANSFER_GET_BOOKING_SUCCESS:
      return {
        ...state,
        transferBookedDetails: action.payload,
        transferCancelBookStatus: null
      };
    case actionType.TRANSFER_GET_BOOKING_FAILURE:
      return {
        ...state,
        transferCancelBookStatus: null
      };
    case actionType.TRANSFER_CANCEL_BOOK_SUCCESS:
      return {
        ...state,
        transferCancelBookStatus: action.payload
      };
    case actionType.TRANSFER_CANCEL_BOOK_FAILURE:
      return {
        ...state,
        transferCancelBookStatus: action.payload
      };
    case actionType.TRANSFER_FILTER_SUCCESS:
      const { price, sort, category, vehicle } = action.payload;
      console.log(price);

      let filterList = _filter(state.transferTempList, function(each) {
        const max = price.max == 10000 ? 10000000 : price.max;
        const min = price.min;
        return each.totalAmount <= max && each.totalAmount >= min;
      });

      if (category.length > 0) {
        filterList = filterList.filter(item =>
          category.some(
            booking_category => booking_category === item.booking_category
          )
        );
      }

      if (vehicle.length > 0) {
        filterList = filterList.filter(item =>
            vehicle.some(
                vehicle_type => vehicle_type === item.vehicle_type
          )
        );
      }

      return {
        ...state,
        transferList: _orderBy(filterList, ["totalAmount"], [sort])
      };
    default:
      return state;
  }
};

export default transferReducer;
