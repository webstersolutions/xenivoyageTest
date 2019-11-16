import React, { Component } from "react";
import $ from "jquery";
import dragGif from "../asset/images/selectRoom/dragPop.gif";
//import { connect } from "tls";
import { connect } from "react-redux";
class ScrollToTop extends Component {
  constructor() {
    super();
    this.state = {
      gifVisible: true,
      gifState: false
    };
  }
  scrollTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  };

  gifClose = () => {
    this.setState({ gifState: false });
  };
  componentWillReceiveProps(nextProps) {
    if(document.documentElement.clientWidth >500 ){
      if (
        this.state.gifVisible === true &&
        this.state.gifState === false &&
        nextProps.gifPop === true
      ) {
        var gifVisible = true;
        var gifState = this.state.gifState;
  
        //Check to see if the window is top if not then display button
        $(window).scroll(function() {
          var scrollTop = $(this).scrollTop();
          if (gifVisible && scrollTop > 900 && !gifState) {
            $(".dragDrop").fadeIn();
            gifState = true;
            setTimeout(function() {
              gifVisible = false;
              $(".dragDrop").fadeOut();
              gifState = false;
            }, 3000);
          }
        });
      }
    }
    else{
gifState = false;

    }
   
  }

  componentWillMount(nextProps) {
    var visible = false;

    $(window).scroll(function() {
      var scrollTop = $(this).scrollTop();
      if (!visible && scrollTop > 200) {
        $(".scrollTopBtn").fadeIn();
        visible = true;
      } else if (visible && scrollTop <= 200) {
        $(".scrollTopBtn").fadeOut();
        visible = false;
      }
    });
  }

  render() {
    return (
      <div>
        <div
          className="scrollTopBtn"
          title="Scroll to top"
          onClick={this.scrollTop}
        >
          <i className="fas fa-arrow-up" />
        </div>
        <div
          className="dragDrop"
          title="Scroll to top"
          onClick={this.gifClose}
          style={{
            display: this.state.gifState ? "'block'," : "none",
            position: "fixed",
            width: "100%",
            height: "100%",
            background: "#000000a3",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: "9",
            cursor: "pointer"
          }}
        >
          <img src={dragGif} width="75%" />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  gifPop: state.hotelReducer.gifPop
});
export default connect(mapStateToProps)(ScrollToTop);
