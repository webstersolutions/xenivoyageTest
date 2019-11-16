import React from 'react';
import { connect } from "react-redux";
import './loading.css';
import loader from "./../asset/images/loading_gif_v8.gif"
const Loading= ({ isGifSearching })  =>  { 
  return <div>
      { isGifSearching && <div className="loaderBg">
          <div id="loader">{<img src={loader} />}</div>
        </div>}
    </div>;
}

const mapStateToProps = state => ({
  isGifSearching: state.commonReducer.isGifSearching
});
export default connect(
  mapStateToProps
)(Loading);


