import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import TopNav from '../component/container/TopNav';
import SignIn from "../component/container/login/SignInModal";


import Footer from './../component/Footer'
import logoVoyage from '../asset/images/aboutUs/xeniVoyage.png';
import img_logo from "../asset/images/logo.png";
import worldMapImage from '../asset/images/aboutUs/aboutUs.png';
import logo from '../asset/images/aboutUs/logo.png';
import usFlag from '../asset/images/aboutUs/usFlag.png';
import indianFlag from '../asset/images/aboutUs/indiaFlag.png';
import signporeFlag from '../asset/images/aboutUs/signporeflag.png';
import close from '../asset/images/aboutUs/close.png';
import userIcon from '../asset/images/dashboard/sachine.jpg';
import neha  from '../asset/images/dashboard/neha.png';
import greg  from '../asset/images/dashboard/greg.jpg';
import reba from '../asset/images/dashboard/reba.jpg';
import melinda from '../asset/images/dashboard/melinda.jpg';
import marava from  '../asset/images/dashboard/marava.jpg';
import christopher from  '../asset/images/dashboard/christopher.jpg';
import Jennifer from '../asset/images/dashboard/JENNIFER-JACQUES.jpg';
import Vishal from '../asset/images/dashboard/vishal.jpg';
import shoaib from  '../asset/images/dashboard/shoaib.jpg';
import casey from '../asset/images/dashboard/casey.jpg';
import Jeff from '../asset/images/dashboard/jeff.jpg';
import Subscription from '../component/Subscription';
import  ScrollToTop from '../view/ScrollToTop';
class AboutUs extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  state = {
    isMenuActive: false,
    isVisbleOne: false,
    isVisbleTwo: false,
    isVisibleThird: false,
    isVisibleFourth: false,
    isVisibleFifth: false,
    isVisibleSixth: false,
    isVisibleSeven: false,
    isVisibleEight: false,
    isVisibleNine: false,
    isVisibleTen: false,
    isVisibleEleven: false,
    isVisibleTw: false,
    isVisibleThi: false,
    isVisibleFour: false,
    isVisibleSignIn: false,
    isdivHide: false,
    isgoPro:false
  };

  goHome = () => {
    this.props.history.push("/hotel");
  };

  handleGopro = value => {
    this.setState({ isgoPro: value });
  };

  handleSignIn = () => {
    this.setState({ isVisibleSignIn: true });
    this.setState({ isdivHide: true });
  };

  onClose = () => {
    this.setState({ isVisibleSignIn: false });
  };

  divShow = show => {
    switch (show) {
      case "1":
        this.setState({ isVisbleOne: true });
        break;
      case "2":
        this.setState({ isVisbleTwo: true });
        break;
      case "3":
        this.setState({ isVisibleThird: true });
        break;
      case "4":
        this.setState({ isVisibleFourth: true });
        break;
      case "5":
        this.setState({ isVisibleFifth: true });
        break;
      case "6":
        this.setState({ isVisibleSixth: true });
        break;
      case "7":
        this.setState({ isVisibleSeven: true });
        break;
      case "8":
        this.setState({ isVisibleEight: true });
        break;
      case "9":
        this.setState({ isVisibleNine: true });
        break;
      case "10":
        this.setState({ isVisibleTen: true });
        break;
      case "11":
        this.setState({ isVisibleEleven: true });
        break;
      case "12":
        this.setState({ isVisibleTw: true });
        break;
      case "13":
        this.setState({ isVisibleThi: true });
        break;
      case "14":
        this.setState({ isVisibleFour: true });
        break;
      default:
    }
  };

  closeDiv = () => {
    this.setState({ isVisbleOne: false });
    this.setState({ isVisbleTwo: false });
    this.setState({ isVisibleThird: false });
    this.setState({ isVisibleFourth: false });
    this.setState({ isVisibleFifth: false });
    this.setState({ isVisibleSixth: false });
    this.setState({ isVisibleSeven: false });
    this.setState({ isVisibleEight: false });
    this.setState({ isVisibleNine: false });
    this.setState({ isVisibleTen: false });
    this.setState({ isVisibleEleven: false });
    this.setState({ isVisibleTw: false });
    this.setState({ isVisibleThi: false });
    this.setState({ isVisibleFour: false });
  };

  render() {
    const {
      isVisbleOne,
      isVisbleTwo,
      isVisibleThird,
      isVisibleFourth,
      isVisibleFifth,
      isVisibleSeven,
      isVisibleEight,
      isVisibleNine,
      isVisibleTen,
      isVisibleEleven,
      isVisibleThi,
      isdivHide,
      isVisibleFour,
      isVisibleSignIn
    } = this.state;

    const renderSignInModal = isVisibleSignIn && (
      <SignIn onHide={this.onClose} isdivHide={isdivHide} />
    );

    const subscription = this.state.isgoPro && (
      <Subscription handleGopro={this.handleGopro} />
    );
    return (
      <React.Fragment>
        <TopNav
          onSignIn={this.handleSignIn}
          {...this.props}
          handleGopro={this.handleGopro}
        />
        {renderSignInModal}
        {subscription}

        {/* <header>
          <nav className="navbar navbar-expand-md bg-white navbar-light boxShadow paddingNone">
            <div className="container">
            <NavLink className="navbar-brand" to="/hotel"> <img src={img_logo} alt="xenivoyagelogo" /></NavLink> 

              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar" onClick={() => this.setState({isMenuActive: !isMenuActive})}>
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className= { isMenuActive ? "collapse show navbar-collapse justify-content-end" : "collapse navbar-collapse justify-content-end"} id="collapsibleNavbar">
                <ul className="navbar-nav navbar-right aboutUsNav">
                  <li className="nav-item">
                  <NavLink  className="nav-link upperCase" to="/hotel">Home</NavLink> 
                  </li>
                  <li className="nav-item active">
                    <a className="nav-link upperCase" href="#">About Us</a>
                  </li>

                </ul>
              </div>
            </div>
          </nav>
        </header> */}
        <section className="aboutBanner">
          <div className="container">
            <h3>WE ARE PLANNING TO LAUNCH IN DIFFERENT CITIES</h3>
            <p>
              Try new things, meet new people, and look beyond what’s right
              in front of you. Those are the keys to understanding this
              amazing world we live in.
            </p>
            <img src={worldMapImage} alt="aboutUs Map" />
          </div>
        </section>
        <section>
          <div className="container">
            <div className="teamSectionInfo">
              <div className="d-flex flex-row justify-content-end">
                <div className="teamInfo flex-column">
                  <h2>Team</h2>
                  <img src={logo} alt="logo" />
                </div>
              </div>
              <ScrollToTop />
              <div className="d-flex flex-row mt-2 smallTabWrap">
                <div className="flex-column teamInfoDiv">
                  <div className="flagInfo mt-5">
                    <img src={usFlag} alt="U.S Flag" />
                    <h5>U.S.</h5>
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3">
                    <h5>corporate</h5>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("1")}>
                      {" "}
                      <h5>Sachin Narode </h5>
                      <p>CEO</p>{" "}
                    </span>
                    {isVisbleOne === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={userIcon} />{" "}
                        </div>
                        <h4>Sachin Narode</h4>
                        <h6>CEO Xeniapp | Co-Founder SNT</h6>
                        <p>
                          Sachin is the founder and CEO of Xeniapp, Inc., an
                          online travel technology company. He is also the
                          co-founder of Survive and Thrive Today, a summit
                          for mission-driven entrepreneurs and investors.
                        </p>
                        <p>
                          Prior to founding Xeniapp, Sachin held positions
                          at Morgan Stanley and Google. He previously
                          created and sold Sovagen, a health monitoring
                          wrist-band. He also led international business
                          development for sleep medicine at the University
                          of Pennsylvania.
                        </p>
                        <p>
                          Sachin received his undergraduate medical degree
                          from Maharashtra University of Health Sciences in
                          Nashik, MH India. He then received his M.S. in
                          biological sciences from University of Texas, San
                          Antonio.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("2")}>
                      {" "}
                      <h5>Greg Obenshain</h5>
                      <p>COO</p>{" "}
                    </span>
                    {isVisbleTwo === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={greg} />{" "}
                        </div>
                        <h4>Greg Obenshain</h4>
                        {/* <h6>CEO Xeniapp | Co-Founder SNT</h6> */}
                        <p>
                          Greg Obenshain manages Obenshain Capital, which
                          uses a quantitative approach to investing in
                          corporate credit.
                        </p>
                        <p>
                          He previously ran high yield investment portfolios
                          at Apollo Global Management and Stone Tower
                          Capital. Prior thereto he completed GE's post-MBA
                          leadership program.
                        </p>
                        <p>
                          He is a graduate of Dartmouth College and
                          Northwestern's Kellogg School of Management. He
                          lives in New York City with his wife and two
                          children.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("3")}>
                      {" "}
                      <h5>Casey Musick</h5>
                      <p>Chief Procurement Officer</p>{" "}
                    </span>
                    {isVisibleThird === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={casey} />{" "}
                        </div>
                        <h4>Casey M. Musick</h4>
                        <h6>
                          Pro Travel Network – CEO | Via Republic –
                          Founder/CEO | Republic Tickets – Founder | Suite
                          MVP – Founder | Via Rewards – Founder
                        </h6>
                        <p>
                          Casey Musick is the Chief Executive Officer for
                          Pro Travel Network a 15-year-old multiple
                          award-winning Host Travel Agency with offices in
                          both the US and Canada serving over 4000
                          Independent Travel Agents thru out North America.
                          Casey recently launched Via Republic Inc a travel
                          & entertainment brands parent company with his
                          fiancé Jessica Henderson. VRI currently operates 3
                          brands in the travel and entertainment industry
                          with an eye on a 4th by the end of 2018. Casey has
                          over 25 years of experience in sales, marketing,
                          operations and executive management in various
                          industries including agriculture, logistics,
                          hospitality, finance and investment. With his
                          passion for travel and the belief that the
                          industry has an amazing future for growth along
                          with a desire to provide greater accessibility to
                          travel for everyone, he sees no slowdown in the
                          future for Pro Travel Network, Via Republic Inc
                          and the various brands operating under those
                          umbrellas.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3">
                    <h5>Strategy & Technology</h5>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("4")}>
                      {" "}
                      <h5>Neha Belwalkar</h5>
                      <p>Creative Director</p>{" "}
                    </span>

                    {isVisibleFourth === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={neha} />{" "}
                        </div>
                        <h4>NEHA BELWALKAR</h4>

                        <h6>
                          PRODUCT MANAGER AT XENIAPP DESIGNER AT SURVIVE AND
                          THRIVE
                        </h6>
                        <p>
                          Neha is working as product manager at Xeniapp , a
                          New York based travel company. Neha started with
                          Bachelor’s Degree in Computer Science.
                        </p>
                        <p>
                          {" "}
                          Working as QA Lead with Major IT service provider
                          for 3 Years, In 2013, driven by her passion
                          designing –She quit her job to go out on her own.
                        </p>
                        <p>
                          As a UI designer and front end developer, Neha
                          Belwalkar is responsible for branding, designing
                          and developing front end of the Survive and Thrive
                          website. Her core design philosophy is all about
                          dealing with complex problems and turning them
                          into simple and beautiful interface designs. Along
                          with working by the riverside and pursuing her
                          designing skills, Neha is passionate about
                          painting, sketching, photography.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("5")}>
                      {" "}
                      <h5>Reba Schnyder</h5>
                      <p>Analyst</p>{" "}
                    </span>

                    {isVisibleFifth === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={reba} />{" "}
                        </div>
                        <h4>Business Coordinator at Xeniapp Inc.</h4>
                      </div>
                    )}
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("6")}>
                      {" "}
                      <h5>Abhishek Gyaneshwar</h5>
                      <p>Product Designer</p>{" "}
                    </span>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <h5>Shubham Gadewar</h5>
                    <p>Blockchain Developer</p>
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3">
                    <h5>Advisory</h5>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("7")}>
                      {" "}
                      <h5>Melinda Bush </h5>
                      <p>Advisor</p>{" "}
                    </span>
                    {isVisibleSeven === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={melinda} />{" "}
                        </div>
                        <h4>MELINDA BUSH, C.H.A.</h4>
                        <p>
                          Melinda Bush, C.H.A, is one of the industry’s most
                          well-known and respected experts on the issues
                          affecting the hospitality and tourism sector.
                        </p>

                        <p>
                          After a dynamic career building the world’s
                          largest travel trade publishing company for Rupert
                          Murdoch and Reed Elsevier, and opening 12 offices
                          around the world, Mrs. Bush founded Hospitality
                          Resources Worldwide LLC, in 2001, with a focus to
                          assist hotels, resorts and{" "}
                        </p>
                        <p>
                          {" "}
                          Working as QA Lead with Major IT service provider
                          for 3 Years, In 2013, driven by her passion
                          designing –She quit her job to go out on her own.
                        </p>
                        <p>
                          As a UI designer and front end developer, Neha
                          Belwalkar is responsible for branding, designing
                          and developing front end of the Survive and Thrive
                          website. Her core design philosophy is all about
                          dealing with complex problems and turning them
                          into simple and beautiful interface designs. Along
                          with working by the riverside and pursuing her
                          designing skills, Neha is passionate about
                          painting, sketching, photography.{" "}
                        </p>
                        <p>
                          destinations in their market development and
                          investment activities. Various past HRW ventures
                          and partners have included The Carlyle Group
                          Realty Fund, FelCor Lodging Trust, Canyon Ranch
                          Enterprises, Outrigger Hotels of Hawaii, Fairmont
                          Hotels, The Moroccan – American Development Fund,
                          and The World Bank Panama Initiative, as well as
                          specific hotel/resort development programs in
                          Hawaii, Costa Rica, Baha Mexico, Vancouver,
                          Washington State, Southern California, among
                          others. Mrs. Bush has and continues to{" "}
                        </p>
                        <p>
                          {" "}
                          serve on a number of public and private corporate
                          boards and has Honorary Degrees and awards from
                          Johnson & Wales University and the Cornell Society
                          of Hoteliers. The C.H.A. designation is the
                          highest{" "}
                        </p>
                        <p>
                          {" "}
                          award granted in the industry by the American
                          Hotel and Lodging Industry’s Educational
                          Institute. Hospitality Resources Worldwide LLC is
                          headquartered in New York City with affiliated
                          offices in Florida, Hawaii, Las Vegas, Texas and
                          California.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("8")}>
                      {" "}
                      <h5>Marva Allen </h5>
                      <p>Advisor</p>{" "}
                    </span>
                    {isVisibleEight === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={marava} />{" "}
                        </div>
                        <h4>Marva Allen </h4>

                        <h6>
                          {" "}
                          FOUNDER/CEO, WORDEEE CEO/FOUNDER, SURVIVE AND
                          THRIVE{" "}
                        </h6>
                        <p>
                          Marva Allen is a seasoned entrepreneur with
                          several successful ventures to her credit. A
                          trailblazer and one of the only women in tech
                          since the age of 24 Marva was co-founder of
                          multimillion tech company that was thrice
                          nominated for the Ernst & Young Entrepreneurship
                          Award.
                        </p>

                        <p>
                          {" "}
                          She is also the recipient of numerous business
                          awards, including The IBM & Kodak Excellence
                          Award, and was named a Crain's Business 40 Under
                          40 Award for significantly achieving in business
                          before her 40th birthday.{" "}
                        </p>
                        <p>
                          {" "}
                          Working as QA Lead with Major IT service provider
                          for 3 Years, In 2013, driven by her passion
                          designing –She quit her job to go out on her own.
                        </p>
                        <p>
                          Marva is a technologist, an author, publisher,
                          bookstore owner and Business School college
                          professor. She has served on the board of many
                          organizations including Eastern Michigan
                          Hospitality Board, the IBM Great Lakes Region
                          Board, the General Motors Diversity Board, and is
                          a past member of the Board of Trustees for St.
                          Hope Leadership Academy founded by NBA player
                          Kevin Johnson.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3">
                    <h5>Legal</h5>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("9")}>
                      {" "}
                      <h5>Christopher Froelich </h5>
                      <p>Special Counsel</p>{" "}
                    </span>

                    {isVisibleNine === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={christopher} />{" "}
                        </div>
                        <h4>CHRISTOPHER FROELICH </h4>
                        <h6>
                          Special Counsel at Sheppard Mullin Richter &
                          Hampton LLP
                        </h6>

                        <p>
                          Chris advises public and private companies and
                          private equity funds in domestic and cross-border
                          transactions, including mergers and acquisitions,
                          private equity investments, joint ventures,
                          divestitures, restructurings, recapitalizations,
                          and transactions involving distressed or bankrupt
                          targets or sellers. He counsels clients through
                          all stages of the deal process, including drafting
                          and negotiating letters of intent, stock and asset
                          purchase agreements, merger agreements,
                          shareholder and joint venture agreements,
                          partnership agreements, financing documents,
                          confidentiality agreements, escrow agreements, due
                          diligence reports and corporate governance
                          documents.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("10")}>
                      {" "}
                      <h5>Jeff Kern </h5>
                      <p>Special Counsel</p>{" "}
                    </span>
                    {isVisibleTen === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={Jeff} />{" "}
                        </div>
                        <h4>JEFF KERN </h4>
                        <h6>
                          Special Counsel at Sheppard Mullin Richter &
                          Hampton LLP
                        </h6>

                        <p>
                          Jeff advises public and private companies and
                          private equity funds in domestic and cross-border
                          transactions, including mergers and acquisitions,
                          private equity investments, joint ventures,
                          divestitures, restructurings, recapitalizations,
                          and transactions involving distressed or bankrupt
                          targets or sellers. He counsels clients through
                          all stages of the deal process, including drafting
                          and negotiating letters of intent, stock and asset
                          purchase agreements, merger agreements,
                          shareholder and joint venture agreements,
                          partnership agreements, financing documents,
                          confidentiality agreements, escrow agreements, due
                          diligence reports and corporate governance
                          documents.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("11")}>
                      {" "}
                      <h5>Jennifer Jacques </h5>
                      <p>Managing Partner</p>{" "}
                    </span>
                    {isVisibleEleven === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={Jennifer} />{" "}
                        </div>
                        <h4>Jennifer Jacques</h4>
                        <h6>MANAGING PARTNER AT JACQUES & ASSOCIATES</h6>
                        <p>
                          Jennifer represents clients in the full range of
                          mergers and acquisitions (both buy and sell-side),
                          venture capital and private equity investments,
                          securities transactions, and other complex and
                          general corporate matters. Her work has touched on
                          numerous market sectors, including technology,
                          financial services, healthcare, advertising,
                          media, fashion and energy. Jennifer has been
                          particularly active in venture capital work, where
                          she has served as outside general counsel to
                          several venture-backed companies and has advised
                          numerous women- and minority-owned and led
                          businesses. She also has significant experience in
                          drafting and negotiating license and commercial
                          agreements including software, technology,
                          trademark, design and patent licenses.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex flex-row mt-4 smallTabWrap">
                <div className="flex-column teamInfoDiv">
                  <div className="flagInfo">
                    <img src={indianFlag} alt="India Flag" />
                    <h5>INDIA</h5>
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3 respBlock">
                    <h5>corporate</h5>
                  </div>

                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("12")}>
                      {" "}
                      <h5>Vaibhav Kothari</h5>
                      <p>COO, Asia</p>{" "}
                    </span>
                    {/* {isVisibleTw === true && <div className="teamPersonFullDetails">
                            <a  onClick={this.closeDiv}><img src={close} alt="close Icon"/></a>
                      
                         </div>}  */}
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3 respBlock">
                    <h5>Strategy & Technology</h5>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("13")}>
                      {" "}
                      <h5>Vishal Dudhal</h5>
                      <p>CTO, India </p>{" "}
                    </span>
                    {isVisibleThi === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={Vishal} />{" "}
                        </div>
                        <h4>VISHAL DUDHAL</h4>
                        <h6> Web Developer</h6>
                        <p>
                          {" "}
                          Vishal Dudhal has completed his Bachelor’s in
                          Computer Engineering from Walchand Engineering
                          college. He has over 6 years experience in web
                          industry and is well versed in WordPress, HTML5,
                          CSS3, PHP, MySQL, Javascript, etc.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="teamSingalPersonDetails">
                    <span onClick={() => this.divShow("14")}>
                      {" "}
                      <h5>Shoaib Bagwan</h5>
                      <p>CIO,India </p>{" "}
                    </span>
                    {isVisibleFour === true && (
                      <div className="teamPersonFullDetails">
                        <a onClick={this.closeDiv}>
                          <img src={close} alt="close Icon" />
                        </a>
                        <div className="teamUserIcon">
                          <img src={shoaib} />{" "}
                        </div>

                        <h4>SHOAIB BAGWAN</h4>
                        <h6> Application Manager</h6>
                        <p>
                          {" "}
                          Software Engineer with over 9 years experience in
                          full-time software product development and
                          maintenance in the IT industry with expertise in
                          Swift, Objective-C, C, C , Java, JSP, Servlet,
                          Struts, and Joomla.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-column teamInfoDiv" />
                <div className="flex-column teamInfoDiv" />
              </div>

              <div className="d-flex flex-row mt-4 smallTabWrap">
                <div className="flex-column teamInfoDiv">
                  <div className="flagInfo">
                    <img src={signporeFlag} alt="Signapore Flag" />
                    <h5>SINGAPORE</h5>
                  </div>
                </div>
                <div className="flex-column teamInfoDiv">
                  <div className="teamCategoriesTitles mb-3 respBlock">
                    <h5>corporate</h5>
                  </div>
                  <div className="teamSingalPersonDetails">
                    <h5> Ankesh Girdhar</h5>
                    <p>Sales Manager</p>
                  </div>
                </div>
                <div className="flex-column teamInfoDiv" />
                <div className="flex-column teamInfoDiv" />
                <div className="flex-column teamInfoDiv" />
              </div>
            </div>
          </div>
        </section>
        <section className="ourOfficeSec">
          <div className="container">
            <div className="ourOfficesTitle">
              <h2>Our Offices</h2>
            </div>
            <div className="row">
              <div className="col-lg-2 col-md-2 col-sm-12 col-12" />
              <div className="col-lg-9 col-md-9 col-sm-12 col-12">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <img src={indianFlag} alt="India" />
                    <h4>INDIA</h4>
                    <address>SL-2, 2nd Floor, Alsa Mall, Left wing, Door Nos, 146 to 149, Old no 15, Montieth Rd, Egmore, Chennai,<br /> Tamil Nadu 600008</address>
                    <p>
                      Phone : <a href="tel:+919176882512">+91 9176882512</a>
                    </p>
                    <p>
                      Email : <a href="mailto:info@xeniapp.com">info@xeniapp.com</a>
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <img src={usFlag} alt="U.S.A" />
                    <h4>U.S.A</h4>
                    <address>157 Columbus Ave, New York NY, 10023</address>
                    <p>
                      Phone : <a href="tel:9292792195">1 800 936 2927</a>
                    </p>
                    <p>
                      Email : <a href="mailto:info@xeniapp.com">info@xeniapp.com</a>
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <img src={signporeFlag} alt="Singapore" />
                    <h4>SINGAPORE</h4>
                    <address>9 Raffles Place, Republic Plaza, Singapore 048619</address>
                    <p>
                      Phone : <a href="tel:+6598597480">+65 9859 7480</a>
                    </p>
                    <p>
                      Email : <a href="mailto:info@xeniapp.com">info@xeniapp.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        {/* <footer className="aboutFooter">
        
            <p>Copyright © 2017 Xeniapp Inc. All rights reserved.</p>
        </footer> */}
      </React.Fragment>
    );
  }
}

export default AboutUs;
