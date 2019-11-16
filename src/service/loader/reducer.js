import { initialState } from './initial.js';

const loaderReducer = (state = initialState, action) => {
   switch (action.type) {
    case 'SHOW_IS_LOADING':
      return {
        ...state,
        isLoading: true
      }
    case 'HIDE_IS_LOADING':
      return {
        ...state,
        isLoading: false
      }
    case 'SHOW_IS_LOADING_FAILURE':
      return {
        ...state,
        isLoadingFailure: true
      }
    case 'HIDE_IS_LOADING_FAILURE':
      return {
        ...state,
        isLoadingFailure: false
      }
    case 'ENABLE_LOADING_GIF_SEARCH':
      return{
        ...state,
        isGifSearching: true
      }
      case 'DISABLE_LOADING_GIF_SEARCH':
      return{
        ...state,
        isGifSearching: false
      }
   
    default:
      return state
  }
}

export default loaderReducer;


