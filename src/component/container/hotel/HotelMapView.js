import React, {Component} from "react";
import {Resizable} from "re-resizable";
import SearchResult from "./SearchResult";
import SearchBanner from "../searchTool/SearchBanner";
import MapWithHotels from "./component/Map";
import SearchTool from "../searchTool/SearchTool";

import TopNav from "../../../component/container/TopNav";

import SignIn from "../../../component/container/login/SignInModal";

import banner from "../../../asset/images/banner.jpg";
import img_RoadGraphic from "../../../asset/images/Road-Graphic.png";

export default class HotelMapView extends Component {
    state = {
        activeHotel: null,
        isVisibleSignIn: false,
        isdivHide: false,
        moveMap: false,
        leftPanelWidth: 950,
        locationChanged: false,
        forceSearch: false,
        topIndexHotel: null,
    };

    onHotelActive = id => {
        this.setState({activeHotel: id});
    };

    onHotelInTop = id => {
        this.setState({
            topIndexHotel: id,
        })
    };

    handleSignIn = () => {
        this.setState({isVisibleSignIn: true});
        this.setState({isdivHide: true});
    };

    onClose = () => {
        this.setState({isVisibleSignIn: false});
    };

    moveMap = () => {
        this.setState({moveMap: !this.state.moveMap});
    };

    locationChanged = status => {
        this.setState({
            locationChanged: status,
        })
    };

    makeForceSearch = () => {
        this.setState({
            forceSearch: true,
            locationChanged: false,
        })
    };

    disableForceSearch = () => {
        this.setState({
            forceSearch: false,
        })
    };

    render() {
        const {isVisibleSignIn, isdivHide, locationChanged, moveMap, forceSearch} = this.state;
        const renderSignInModel = isVisibleSignIn && (
            <SignIn onHide={this.onClose} isdivHide={isdivHide}/>
        );
        let innerWidth = window.innerWidth;
        let isMobile = false;
        if (innerWidth >= 320 && innerWidth <= 768) {
            isMobile = true;
        } else if (innerWidth < 915) {
            isMobile = true;
        }
        return (
            <div>
                <TopNav onSignIn={this.handleSignIn} {...this.props} />
                <div style={{display: "flex", height: "100%"}}>
                    {renderSignInModel}
                    <Resizable
                        enable={{
                            top: false,
                            right: true,
                            bottom: false,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                        }}
                        size={{
                            width: isMobile ? 0 : this.state.leftPanelWidth,
                        }}
                        ref={ref => this.ref = ref}
                        onResize={e => {
                            if (e.x > 670) {
                                this.setState({
                                    leftPanelWidth: e.x,
                                });
                                this.ref.updateSize({ width: e.x })
                            } else {
                                this.ref.updateSize({ width: 670 })
                            }
                        }}
                    >

                        <div
                            style={{
                                padding: "45px",
                                backgroundAttachment: "fixed",
                                backgroundImage: "url(" + banner + ")",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}
                            className="noselect"
                        >
                            <div className="roadmap">
                                <img style={{ width: this.state.leftPanelWidth - 50 }} src={img_RoadGraphic} alt=""/>
                            </div>
                            <div>
                                <SearchTool path={"/hotelMapView"} mapResponsiveWidth={this.state.leftPanelWidth} skipTab={true}/>
                            </div>
                            <div style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '15px'}}>
                                <SearchBanner style={{float: "none"}}/>
                                <SearchResult
                                    {...this.props}
                                    onHoverHotel={this.onHotelActive}
                                    topHotelId={this.onHotelInTop}
                                    mapResponsive={this.state.leftPanelWidth}/>
                            </div>

                        </div>
                    </Resizable>
                    <div style={{width: "100%"}}>
                        <span className="searchAsText">
                            <input type="checkbox" onClick={this.moveMap}/> &nbsp;Search as I move the map
                        </span>
                        {locationChanged && !moveMap && 
                            <button
                                style={{ backgroundColor: '#DB3742', color: '#FFFFFF', cursor: 'pointer' , left: '100px', top:'45px'}}
                                className="searchAsText reponseMapView"
                                onClick={this.makeForceSearch}
                              >
                                Redo search here
                            </button>
                        }
                        <MapWithHotels
                            {...this.props}
                            topIndexHotel={this.state.topIndexHotel}
                            activeHotel={this.state.activeHotel}
                            moveMap={moveMap}
                            locationChanged={this.locationChanged}
                            forceSearch={forceSearch}
                            disableForceSearch={this.disableForceSearch}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
