import React, { Component } from 'react';
import DBAddCard from './DBAddCard';
import { connect } from "react-redux";
import { map as _map } from 'lodash';

import { getCard, deleteCard } from "../../../service/card/action";
import { cardReducer } from "../../../service/card/reducer";

class DBPaymentMethod extends Component {
  state = {
    modal: false,
    ismodal: false,
    card: ""
  };
  handleModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  deleteCardConfirm(type)
  {
    if(type == true)
    {
          const { id }=this.state.card
          const { email } = this.props.loginDetails;
          this.props.getCardDetails.map((value)=>{
            if(value.last4 == this.state.card.last4){
              this.props.deleteCard({
                email: email,
                card_id: value.id
              });
              this.props.getCard(email); 
            }
          })
          setTimeout(()=> {
            this.setState({ismodal:false})
          }, 100);
    }else{
      this.setState({ ismodal: false });
    }
   
  }
  componentWillMount = () => {
    window.scrollTo(0,0);
   // const { email } = this.props.loginDetails;
   const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
   const { email } = userSession;
    this.props.getCard(email);
  };
  handleDelete (value){
    this.setState({ ismodal: !this.state.ismodal, card: value });
 
  };
  removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
   }
  render() {
    let { getCardDetails } = this.props;
    getCardDetails = getCardDetails && this.removeDuplicates(getCardDetails,"last4")
    const { modal } = this.state;
    return (
      <React.Fragment>
        <div className="dashRightSide align-self-start">
          <div className="d-flex flex-wrap">
          { getCardDetails && getCardDetails.length>0 &&

            _map(getCardDetails ,(each ,i ) =>{
              return(
                <div className="cardDetails flex-column" key={i}>
                <div className="cardEditOpt">
                
                  <span className="closeIcon" onClick={this.handleDelete.bind(this, each)}>
                    <i className="fas fa-times"  />
                  </span>
                </div>
             
                <h6>**** **** ****{each.last4}</h6>

                <div className="cardValidInfo">
                  <span>VALID THRU</span>{" "}
                  <span>
                    {each.exp_month}/{each.exp_year}
                  </span>
                </div>
                <div className="cardBaseDet d-flex justify-content-between">
                  <span className="holderName" title={each.name}>{each.name}</span>
                  <span className={each.brand==="Visa" ? "visaCard" :each.brand === "Diners Club"? "clubCard" :each.brand === "Discover" ? "discoverCard"  :each.brand==="MasterCard" ? "expressCard" : ""} />
                 
                </div>
              </div>
              )

            })
          }
            {/* {getCardDetails && getCardDetails !== null &&
              getCardDetails.map((each, index) => (
                <div className="cardDetails flex-column" key={index}>
                  <div className="cardEditOpt">
                    <span className="closeIcon">
                      <i
                        className="fas fa-times"
                        onClick={this.handleDelete.bind(this, each)}
                      />
                    </span>
                  </div>

                  <h6>**** **** ****{each.last4}</h6>

                  <div className="cardValidInfo">
                    <span>VALID THRU</span>{" "}
                    <span>
                      {each.exp_month}/{each.exp_year}
                    </span>
                  </div>
                  <div className="cardBaseDet d-flex justify-content-between">
                    <span className="holderName">{each.name}</span>
                    <span
                      className={
                        each.brand === "Visa"
                          ? "visaCard"
                          : each.brand === "Diners Club"
                          ? "clubCard"
                          : each.brand === "Discover"
                          ? "discoverCard"
                          : each.brand === "MasterCard"
                          ? "expressCard"
                          : ""
                      }
                    />
                  </div>
                </div>
              ))} */}
            <div
              className="cardDetails d-flex flex-column justify-content-center "
              onClick={this.handleModal}
            >
              <a
                className="addNewCard"
                data-target="#myAddCard"
                data-toggle="modal"
              >
                <span>
                  <i className="fas fa-plus" />
                </span>{" "}
                Add New Card
              </a>
            </div>
          </div>

          {this.state.ismodal && <div
            className="modal backgroundDark"
            id="myModal"
            style={{ display: "block" }}
          >
            <div className="modal-dialog signInPopup" style={{ top: "15%" }}>
              <div className="modal-content" style={{ borderRadius: "6px" }}>
                <div className="modal-body paymentError">
                  <div className="socialBtnGroup" />
                  <h5
                    style={{
                      fontWeight: "300",
                      color: "#464646",
                      padding: "20px 0px"
                    }}
                  >
                    <i class="fas fa-info-circle mr-1" />
                    Are you sure to delete this card? 
                    <br/>
                    {/* {this.state.card.name}  end with {this.state.card.last4} */}
                  </h5>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="goBack mr-2 bg-success"
                      onClick={this.deleteCardConfirm.bind(this, true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="goBack bg-danger"
                      onClick={this.deleteCardConfirm.bind(this, false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>}

          {modal && (
            <DBAddCard
              model={this.state.modal}
              handleModal={this.handleModal}
              getCardDetails={getCardDetails}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails,
  getCardDetails: state.cardReducer.getCardDetails
});
const mapDispatchToProps = dispatch => ({
  getCard: email => dispatch(getCard(email)),
  deleteCard: value => dispatch(deleteCard(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DBPaymentMethod)
