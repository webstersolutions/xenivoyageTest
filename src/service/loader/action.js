
  import actionType from "./actionType.js";
  
  export const loadingSearch = () => dispatch => {
     dispatch({
        type: actionType.SHOW_IS_LOADING
      })
   
  };

  export const stopSearching = () => dispatch => {
    dispatch({
      type: actionType.HIDE_IS_LOADING
    })
  };
  export const loadingFailureSearch = () => dispatch => {
      dispatch({
        type: actionType.SHOW_IS_LOADING_FAILURE
      })
   
  };

  export const stopFailureSearching = () => dispatch => {
      dispatch({
      type: actionType.HIDE_IS_LOADING_FAILURE
    })
  };

  export const loadingGifSearch = () => dispatch => {
    dispatch({
      type: actionType.ENABLE_LOADING_GIF_SEARCH
    });
  };
  export const stopGifSearching = () => dispatch => {
    dispatch({
      type: actionType.DISABLE_LOADING_GIF_SEARCH
    });
  };

