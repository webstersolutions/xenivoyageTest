import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import Footer from "../component/Footer";
import TopNav from "../component/container/TopNav";
import ScrollToTop from "../view/ScrollToTop";
import Notifications, { notify } from "react-notify-toast";
import URL from "../asset/configUrl";
import axios from "../Utils/request-process";
import SignIn from "../component/container/login/SignInModal";
import Subscription from "../component/Subscription";

class TermsAndCondition extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        details: "",
        formErrors: { firstName: "", lastName: "", mobile: "", email: "" },
        emailValid: false,
        firstNameValid: false,
        lastNameValid: false,
        mobileValid: false,
        emailValid: false,
        formValid: false,
        isdivHide: false,
        isgoPro: false
      };
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let mobileValid = this.state.mobileValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "Email is invalid";
        break;
      case "firstName":
        firstNameValid = value.length >= 3;
        fieldValidationErrors.firstName = firstNameValid
          ? ""
          : "FirstName is too short";
        break;
      case "lastName":
        lastNameValid = value.length == 0;
        fieldValidationErrors.lastName = lastNameValid ? "Required" : "";
        break;
      case "mobile":
        mobileValid = value.length == 0;
        fieldValidationErrors.mobile = mobileValid ? "Required" : "";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        firstNameValid: firstNameValid,
        lastNameValid: lastNameValid,
        mobileValid: mobileValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.firstNameValid &&
        this.state.lastNameValid &&
        this.state.mobileValid
    });
  }

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
  handleSubmit = e => {
    e.preventDefault();
    const payload = {
      first_name: this.state.firstName,
      email: this.state.email,
      last_name: this.state.lastName,
      phone_number: this.state.mobile,
      message_details: this.state.details
    };
    axios
      .post(URL.CONTACT_DETAILS, payload)
      .then(response => {
        notify.show(response.data.data, "success", 3000);
      })
      .catch(error => {
        notify.show(error.response.data.data, "error", 3000);
      });
  };

  render() {
    const { formErrors, isVisibleSignIn, isdivHide } = this.state;
    const renderSignInModal = isVisibleSignIn && (
      <SignIn onHide={this.onClose} isdivHide={isdivHide} />
    );

    const subscription = this.state.isgoPro && (
      <Subscription handleGopro={this.handleGopro} />
    );
    return (
      <React.Fragment>
        <Notifications />
        <TopNav
          onSignIn={this.handleSignIn}
          {...this.props}
          handleGopro={this.handleGopro}
        />
        {renderSignInModal}
        {subscription}

        <section class="contactUsBg">
          <div className="container">
            <div className="contactUsTitle">
              <h3>Terms and Conditions</h3>
            </div>

            <div>
              <br />
            </div>
            <h4 style={{ textAlign: "center" }}>
              XENIAPP TRAVEL BOOKING TERMS
            </h4>

            <div>
              <br />
            </div>
            <div>
              The following terms and conditions (our “Travel Booking Terms”)
              govern the reservation, purchase, and use of all Travel Services
              (as defined below) offered for sale by Xeniapp, Inc. (XENIAPP), a
              New York-based company located at 157 Columbus Avenue, Suite 437,
              New York, NY 10023.
            </div>
            <div>
              All bookings of Trips are also subject to the terms and conditions
              of the Supplier of the Travel Service(s) incorporated in your
              reservation. By placing a reservation with XENIAPP, you agree to
              abide by all the terms and conditions of the applicable Suppliers,
              and to be bound by the limitations therein. If a Supplier’s terms
              and conditions are ever in conflict with our Travel Booking Terms,
              XENIAPP’s Terms will control all issues relating to the
              liabilities and responsibilities of XENIAPP.
            </div>
            <div>
              <br />
            </div>
            <div>
              Please read these Travel Booking Terms carefully, ask us any
              questions you have about them, and/or consult an attorney if
              necessary before you agree to be bound by them. Traveler
              acknowledges that they have taken note of these Travel Booking
              Terms before making a booking and have accepted the same by
              checking the box marked “I ACCEPT”. Without this acceptance, the
              processing of a booking is not possible.
            </div>
            <div>
              <br />
            </div>
            <h4 style={{ textAlign: "center" }}>Table of Contents</h4>
            <ul>
              <li>Definitions</li>
              <li>Eligibility</li>
              <li>Prices and Pricing Errors</li>
              <li>Bookings</li>
              <li>Payment</li>
              <li>Cancellation, Substitution, and Alteration Policies</li>
              <li>Issuing Travel Documents</li>
              <li>Travelers with Special Needs or Disabilities</li>
              <li>Insurance</li>
              <li>
                Passports, Visas, Reciprocity Fees, and Travel Health
                Requirements
              </li>
              <li>Accommodations</li>
              <li>Air Transport</li>
              <li>Vehicle Rental</li>
              <li>Activities Offered During Trips</li>
              <li>Airport Transfers</li>
              <li>Marketing Materials and Illustrative Photos</li>
              <li>Use of Traveler Testimonials and Photographs</li>
              <li>Local Customs, Laws, and Travel Risks</li>
              <li>Notices</li>
              <li>Seller of Travel Registration Information</li>
              <li>Limitation of Liability</li>
              <li>Disclaimer of Warranties</li>
              <li>Indemnification and Release</li>
              <li>Force Majeure</li>
              <li>Compliance</li>
              <li>
                Disputes: Mandatory Binding Arbitration, and Class Action Waiver
              </li>
              <li>Governing Law, Venue, and Jurisdiction</li>
              <li>Attorney’s Fees, Costs, and Expenses of Suit</li>
              <li>Assignment</li>
              <li>Severability and Survivability</li>
              <li>Waiver</li>
              <li>Consumer Complaints</li>
              <li>Modification of Our Travel Booking Terms</li>
              <li>Entire Agreement</li>
            </ul>

            <h6>1. Definitions.</h6>
            <ul>
              <li>
                This agreement and its terms and conditions are herein referred
                to as our “Travel Booking Terms” or this “Agreement”
              </li>
              <li>
                “XENIAPP” and/or “we” or “us” refer to Xeniapp, Inc. (doing
                business as “XENIAPP”)
              </li>
              <li>
                “Application” and/or “App” refers to the XENIAPP mobile
                application
              </li>
              <li>
                The “Site” or “Website” refer our website, located at
                <a href="http://www.xeniapp.com"> http://www.xeniapp.com</a>
              </li>
              <li>
                “Travel Service(s)” and just “Service(s)” encompass:
                Accommodations; airfare, including add-ons to airfare purchases;
                tours and activities; tour guide services; tour packages;
                holiday planning advisory; language translators; private jet
                rentals; private yacht rentals; ground transportation, including
                car rentals, chauffeur driven car rentals, and rideshare
                services; travel insurance; and any other travel or travel
                related products offered or sold by XENIAPP.
              </li>
              <li>
                The term “Trip” is defined as any Travel Service, or package of
                Travel Services, offered or sold by XENIAPP.
              </li>
              <li>
                “Traveler” is any User of the XENIAPP App who subsequently books
                a reservation for Travel Services.
              </li>
              <li>
                “Lead Traveler” means the Traveler who makes a booking for
                themselves and/or on behalf of others under the same booking.
              </li>
              <li>
                Travel Service Supplier (“Supplier(s)”) are any third-party
                providers of Travel Services.
              </li>
              <li>
                “Accommodations” are any lodgings in a dwelling or similar
                living quarters afforded to Travelers including, but not limited
                to, hotels, villas, short term apartments, room shares, motels,
                and resorts.
              </li>
            </ul>

            <h6>2. Eligibility</h6>
            <div>
              <br />
            </div>
            <div>i. All Travelers</div>
            <div>
              <br />
            </div>
            <div>
              The Services offered by XENIAPP are available for sale to
              residents of the United States (excluding Iowa, Washington,
              Illinois, and Hawaii) who have all the requisite power and
              authority to enter into and perform the obligations under these
              Travel Booking Terms and may legally do so.
            </div>
            <div>
              <br />
            </div>
            <div>
              Our Services are also available for purchase by Travelers who
              reside in other countries, as long as those Travelers recognize
              that XENIAPP is U.S. business operated under U.S. laws. Any
              disputes that may arise will be decided pursuant to U.S. law
              according to our Mandatory Binding Arbitration provision and
              Choice of Law clause, below, et sec.
            </div>
            <div>
              <br />
            </div>
            <div>ii. Lead Travelers</div>
            <div>
              <br />
            </div>
            <div>
              In addition to the eligibility requirements for all Travelers
              described above, Lead Travelers must be at least 18 years old and
              have all the requisite power and authority to enter into and
              perform the obligations under these Travel Booking Terms on behalf
              of any persons included in a booking. Some Services may have
              different booking age restrictions, review the appropriate Terms
              and Conditions for details.
            </div>
            <div>
              <br />
            </div>
            <div>
              The Lead Traveler must also ensure and hereby confirms that the
              details provided for all parties to the booking are full and
              accurate, that all parties agree to be bound by these Travel
              Booking Terms, and that the Lead Traveler has the authority to
              accept and does accept these Travel Booking Terms on behalf of all
              Travelers in the booking.
            </div>
            <div>
              <br />
            </div>
            <h6>3. Pricing and Pricing Errors.</h6>
            <div>
              <br />
            </div>
            <div>i. Pricing</div>
            <div>
              <br />
            </div>
            <div>
              Our prices are contractual tariffs. No claim relating to the price
              of a Trip will be considered once the reservation is effective.
              All prices are quoted in US dollars (US$) unless otherwise
              delineated. Rates for Travel Services are based on tariffs and
              exchange rates in effect at the time of posting and are subject to
              change prior to departure. Substantial changes in tariffs,
              exchange rates, price of fuel, services and labor sometimes
              increase the cost of Travel Service arrangements significantly.
            </div>
            <div>
              <br />
            </div>
            <div>
              Unless otherwise stated in the description of a Trip, the
              following amounts will NOT be included as part of the Trip’s
              advertised price:
            </div>
            <li>
              Items of a personal nature such as incidentals, toiletries, etc.
            </li>
            <li>costs associated with Passports or Visas</li>
            <li>airfare, airport taxes, excess baggage charges</li>
            <li>airport transfers</li>
            <li>single room supplement</li>
            <li>
              travel insurance including medical, accidents, lost baggage and/or
              trip cancellation
            </li>
            <li>tips and gratuities</li>
            <li>costs of certain food, drinks, or alcohol</li>
            <li>
              any other activities or items not explicitly advertised as
              included in our Trip description.
            </li>
            <div>ii. Pricing Errors</div>
            <div>
              <br />
            </div>
            <div>
              We use commercially reasonable endeavors to publish and maintain
              accurate prices and information for Services. Suppliers provide
              the price, availability and other information related to these
              Services. In the event, however, that a Service is listed or
              provided to us at an incorrect price or with incorrect information
              due to typographical error or other error in pricing or
              information received from a Supplier, we retain the right to
              refuse or cancel any booking placed for such Service, whether or
              not the order has been confirmed and/or your credit card charged.
              If your credit card has already been charged for the purchase and
              your booking is canceled because of incorrect Supplier pricing
              information, we will promptly issue a credit to your credit card
              account in the amount of the charge.
            </div>
            <div>
              <br />
            </div>
            <div>
              XENIAPP EXPRESSLY RESERVES THE RIGHT TO CORRECT ANY PRICING ERRORS
              ON OUR WEBSITE, APP, AND/OR ON PENDING BOOKINGS MADE UNDER AN
              INCORRECT PRICE. In such event, if available, we will offer you
              the opportunity to keep your pending reservation at the correct
              price or we will cancel your reservation without penalty.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>4. Bookings.</strong> To make a booking with XENIAPP,
              please use our App, Website, or contact us directly at <a href="tel:18009362927">1 800 936 2927</a>,
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong> 5. Payment.</strong> Full payment is due at time of
              booking. We accept payment by all Major Credit Cards (Visa,
              MasterCard, American Express), bank transfers, and checks.
            </div>
            <div>
              <br />
            </div>
            <strong>
              6. Cancellation, Substitution, and Alteration Policies.
            </strong>
            <div>
              <br />
            </div>
            <div>
              i. Cancellations, Substitutions, and Alterations attributable to
              Traveler
            </div>
            <div>
              <br />
            </div>
            <div>
              Cancellation, substitution, and/or alteration terms vary by
              Supplier. Please familiarize yourself with the terms of your
              Supplier prior to purchase as we cannot be held accountable for
              your unfamiliarity with those terms.
            </div>
            <div>
              <br />
            </div>
            <div>a. For California Residents only:</div>
            <div>
              <br />
            </div>
            <div>
              Upon cancellation of the transportation or Travel Services, where
              the Traveler is not at fault and has not canceled in violation of
              any terms and conditions previously clearly and conspicuously
              disclosed and agreed to by the Traveler, all sums paid to the
              seller of travel for services not provided will be promptly paid
              to the Traveler, unless the Traveler advises the seller of travel
              in writing, after cancellation. This provision does not apply
              where the seller of travel has remitted the payment to another
              registered wholesale seller of travel or a carrier, without
              obtaining a refund, and where the wholesaler or provider defaults
              in providing the agreed-upon transportation or service. In this
              situation, the seller of travel must provide a California Traveler
              with a written statement accompanied by bank records establishing
              the disbursement of the payment, and if disbursed to a wholesale
              seller of travel, proof of current registration of that
              wholesaler.
            </div>
            <div>
              <br />
            </div>
            <div>
              ii. Cancellations and/or Alterations not attributable to Traveler
            </div>
            <div>
              <br />
            </div>
            <div>
              Particularly as a result of causes beyond our control (ie. weather
              and travel conditions, river water levels, political or
              environmental changes, equipment failure, flight schedule changes
              or rescheduling of air routes and times, referred to herein
              jointly as “Force Majeure”), changes and/or cancellations may need
              to be made to confirmed bookings. While we always endeavor to
              avoid changes and cancellations, we must reserve the right to do
              so and to substitute alternative arrangements of comparable
              monetary value. XENIAPP reserves the right to adjust the Travel
              Service or change the modes of ground and air travel, change the
              quality of accommodations or otherwise change the Travel Service
              without prior notice. We accept no liability for loss of enjoyment
              as a result of these changes. Any additional charges incurred
              arising from the postponement, delay or extension of a Trip due to
              Force Majeure will be the Traveler’s responsibility. XENIAPP will
              attempt to provide Traveler advanced notice of any changes to your
              Trip to the extent commercially possible.
            </div>
            <div />
            <div>
              <strong>7. Issuing Travel Documents.</strong> Travel documents
              will only be sent to the purchasing Traveler who places the order
              and personally agrees to these Travel Booking Terms. Should you
              change your email address, phone number, or address before your
              departure date, you are required to advise us of the change. If a
              Traveler provides incorrect information to XENIAPP, we do not
              assume any liability if the Trip is adversely affected or made
              impossible by the non-receipt of travel documents.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>8. Travelers with Special Needs or Disabilities. </strong>{" "}
              If you have special needs (e.g., wheelchair accessible room,
              traveling with seeing eye dog, etc.) you must call all relevant
              Suppliers for your Trip ahead of time and verify that special
              needs can be met. Depending on their terms and conditions, your
              reservation may be refunded, canceled or modified if special
              handicapped needs cannot be met. XENIAPP make no guarantee as to
              the ability of any Travel Supplier to meet the special needs of
              disabled Travelers.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>9. Insurance. </strong> Should you have to cancel your
              Trip because of illness, injury or death to you or an immediate
              family member, depending on the type of coverage purchased, trip
              cancellation insurance may protect some or all deposits and
              payments for Trip costs. Trip cancellation and interruption
              penalties are significant. Purchasing trip cancellation insurance
              at a much later date may limit some of the coverage as to
              pre-existing or other conditions. XENIAPP recommends the immediate
              purchase of travel cancellation insurance including emergency
              medical evacuation, flight delay, baggage and repatriation.
            </div>
            <div>
              It is Traveler’s responsibility to understand the limitations of
              their insurance coverage and purchase additional insurance as
              needed. It is the Traveler’s sole responsibility to research,
              evaluate and purchase appropriate coverage. Traveler agrees that
              XENIAPP is not responsible for any uninsured losses.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>
                10. Passports, Visas, Reciprocity Fees, and Travel Health
                Requirements.{" "}
              </strong>
              It is Traveler’s sole responsibility to verify they have all the
              necessary visas, transit visas, passport, and vaccinations prior
              to travel and paid any required reciprocity fees for their
              destination. A full and valid passport is required for all persons
              traveling to any of the destinations outside the U.S. that we
              feature. You must obtain and have possession of a valid passport,
              all visas, permits and certificates, and vaccination certificates
              required for your entire Trip.
            </div>
            <div>
              <br />
            </div>
            <div>
              Most international Trips require a passport valid until at least
              six (6) months beyond the scheduled return date. Non-U.S. citizens
              should contact the appropriate consular office for any
              requirements pertaining to their Trip. Further information on
              entry requirements can be obtained from the State Department, by
              phone (202) 647-5335 or access online at
              <a href="http://travel.state.gov/content/passports/en/passports.html">
                {" "}
                http://travel.state.gov/content/passports/en/passports.html{" "}
              </a>{" "}
              or directly from the destination country's website.
            </div>
            <div>
              <br />
            </div>
            <div>
              Some countries require you to be in possession of a return ticket
              or exit ticket and have sufficient funds, etc. Similarly, certain
              countries require that the Traveler produce evidence of
              insurance/repatriation coverage before it will issue a visa.
            </div>
            <div>
              <br />
            </div>
            <div>
              You must carefully observe all applicable formalities and ensure
              that the surnames and forenames used for all passengers when
              making a booking and appearing in your travel documents (booking
              forms, travel tickets, vouchers, etc.), correspond exactly with
              those appearing on your passport, visas, etc.
            </div>
            <div>
              <br />
            </div>
            <div>
              Immunization requirements vary from country to country and even
              region to region. Up-to date information should be obtained from
              your local health department and consulate. You assume complete
              and full responsibility for, and hereby release XENIAPP from, any
              duty of checking and verifying vaccination or other entry
              requirements of each destination, as well as all safety and
              security conditions of such destinations during the length of the
              proposed travel or extensions expected or unexpected. For State
              Department information about conditions abroad that may affect
              travel safety and security, you can contact them by phone at (202)
              647-5335. For foreign health requirements and dangers, contact the
              U.S. Centers for Disease Control (CDC) at (404) 332-4559, use
              their fax information service at (404) 332-4565, or go to{" "}
              <a href="http://wwwnc.cdc.gov/travel/">
                {" "}
                http://wwwnc.cdc.gov/travel/{" "}
              </a>
              .
            </div>
            <div>
              <br />
            </div>
            <div>
              It is your responsibility to ensure that you hold the correct,
              valid documents for the countries you are visiting and have
              obtained the necessary vaccinations, clearance to travel, and hold
              the necessary confirmations for medications required as we cannot
              be held liable for any illness, delays, compensation, claims and
              costs resulting from your failure to meet these requirements.
            </div>
            <div>
              <br />
            </div>
            <div>
              WE CANNOT ACCEPT RESPONSIBILITY IF YOU ARE REFUSED PASSAGE ON ANY
              AIRLINE, TRANSPORT OR ENTRY INTO ANY COUNTRY DUE TO THE FAILURE ON
              YOUR PART TO CARRY OR OBTAIN THE CORRECT DOCUMENTATION. IF FAILURE
              TO DO SO RESULTS IN FINES, SURCHARGES, CLAIMS, FINANCIAL DEMANDS
              OR OTHER FINANCIAL PENALTIES BEING IMPOSED ON US, YOU WILL BE
              RESPONSIBLE FOR INDEMNIFYING AND REIMBURSING US ACCORDINGLY.
            </div>
            <div>
              <br />
            </div>
            <strong>11. Accommodations.</strong>
            <div>
              <br />
            </div>
            <div>i. General conditions</div>
            <div>
              <br />
            </div>
            <p>
              XENIAPP provides the Accommodations through third-party Suppliers
              and retains no ownership or management interest in those
              Accommodations. XENIAPP does not guarantee the location or the
              amenities of the Accommodations, nor the performance of the
              third-party Suppliers. Final decisions as to bedding types are
              made by Suppliers. If any issues arise, please contact the
              owner/operators of the respective Accommodations directly.
            </p>
            <div>
              <br />
            </div>
            <div>ii. Occupancy</div>
            <div>
              <br />
            </div>
            <div>
              Prices of Accommodations are based on double occupancy unless
              described otherwise. If you prefer single Accommodations, some
              Accommodations require you to pay a single supplement fee which
              can vary depending on the Accommodation.
            </div>
            <div>
              <br />
            </div>
            <div>iii. Living Standards</div>
            <div>
              <br />
            </div>
            <div>
              Accommodations and living standards may vary from country to
              country and region to region. XENIAPP makes no guarantees about
              Accommodation living standards. Any additional costs, i.e.
              upgrades etc., will be borne by the Traveler.
            </div>
            <div>
              <br />
            </div>
            <div>iv. Room Deposits</div>
            <div>
              <br />
            </div>
            <div>
              Some Accommodation Suppliers may require you to present a credit
              card or cash deposit upon check-in to cover additional expenses
              incurred during your stay. Such deposit is unrelated to any
              payment received by us for your Accommodation booking.
            </div>
            <div>
              <br />
            </div>
            <div>v. Meals</div>
            <div>
              <br />
            </div>
            <div>
              If meals are part of an Accommodation package, the number of meals
              depends on the number of overnight stays. Full board normally
              includes breakfast, lunch and dinner. Half board normally includes
              breakfast and either lunch or dinner, depending on the
              accommodation package. Accommodation which includes main meals
              generally commences with dinner on the day of arrival at the
              property and terminates with breakfast (on half board) or lunch
              (on full board) on the day of departure. If one or more meals
              cannot be taken, no refunds will be made. Traveler is reminded
              that, unless specified otherwise on the Website, drinks are not
              included with meals.
            </div>
            <div>
              <br />
            </div>
            <strong>12. Air Transport.</strong>
            <div>
              <br />
            </div>
            <div>i. General Conditions</div>
            <div>
              <br />
            </div>
            <div>
              XENIAPP’s responsibilities in respect to air travel are limited by
              the relevant airline’s Contract of Carriage. All airline Contracts
              of Carriage are available for view publicly on the airline’s
              website and at their office branches. XENIAPP is not able to
              specify the type of aircraft to be used by any airline or
              guarantee seat assignments, even if pre-booked with the airline.
              In addition, XENIAPP is not responsible for losses due to
              cancelled flights, seats, or changed flight itineraries. Airlines
              retain the right to adjust flight times and schedules at any time,
              and these changes may include a change in the airline you fly,
              your aircraft type or destination. Such alterations do not
              constitute a significant change to your Trip. If an airline
              cancels or delays a flight, you should work with the airline to
              ensure you arrive at your destination on or ahead of time. XENIAPP
              will not provide any refund for Trips missed, in part or full, due
              to missed, cancelled or delayed flights, or other flight
              irregularities including, without limitation, denied boarding
              whether or not you are responsible for such denial. Airline
              flights may be overbooked. A person denied boarding on a flight
              may be entitled to a compensatory payment or other benefits from
              the airline. The rules for denied boarding are available at all
              ticket counters in your Contract of Carriage. The airline
              fulfilling your reservation may change from the airline displayed
              on our website.
            </div>
            <div>
              <br />
            </div>
            <div>ii. Flight Times</div>
            <div>
              <br />
            </div>
            <div>
              Sometimes, a flight's scheduled departure or arrival time on the
              Site or in the App are different from the times reflected on your
              e-ticket. This may occur when the airline doesn't transmit the
              updated schedule to us. If the flight is a month and more away,
              the scheduled time should update closer to the departure date.
            </div>
            <div>
              The flight times given by XENIAPP are subject to change.
              Up-to-date flight times will be shown on your e-ticket. Traveler
              must check the tickets very carefully immediately upon receipt of
              the latest timings.
            </div>
            <div>
              <br />
            </div>
            <div>iii. Failure to Check-in</div>
            <div>
              <br />
            </div>
            <div>
              Failure to check-in for a flight on the outward journey (on a
              charter or scheduled flight) will automatically result in
              cancellation of the return flight by the airline. We would
              encourage you to contact us on the date of departure if you wish
              us to keep the return flight open; this decision remains at the
              discretion of the airline.
            </div>
            <div>
              <br />
            </div>
            <div>iv. Flight Connections</div>
            <div>
              <br />
            </div>
            <div>
              If any booked flight connecting with your outbound or inbound
              flight is cancelled or delayed, the airlines reserve the right to
              provide that transport by any other means (coach/bus, train,
              etc.). If you organize your own connecting transport with the
              arrangements booked with XENIAPP, we would advise that you reserve
              flexible or refundable tickets in order to avoid the risk of any
              financial loss. You are also advised not to make any important
              appointments for the day following your return date. XENIAPP
              cannot accept responsibility for the consequences of delays (such
              as a cancelled scheduled flight) in the context of connecting
              transport organized by you.
            </div>
            <div>
              <br />
            </div>
            <div>v. Non-Use of Flight Segments</div>
            <div>
              <br />
            </div>
            <div>
              You agree not to purchase a ticket or tickets containing flight
              segments that you will not be using, such as a "point-beyond",
              "hidden-city", or "back-to-back tickets". You further agree not to
              purchase a round-trip ticket that you plan to use only for one-way
              travel. You acknowledge that the airlines generally prohibit all
              such tickets, and therefore we do not guarantee that the airline
              will honor your ticket or tickets. You agree to indemnify XENIAPP
              against any airline claims for the difference between the full
              fare of your actual itinerary and the value of the ticket or
              tickets that you purchased.
            </div>
            <div>
              <br />
            </div>
            <div>vi. Baggage</div>
            <div>
              <br />
            </div>
            <div>
              XENIAPP assumes no liability for any loss or damage to baggage or
              personal effects, whether in transit to or from a Trip, or during
              a Trip. The airline is liable to you for the baggage you entrust
              to it only for the compensation contemplated in the international
              conventions and relevant statutes. In the event of damage, late
              forwarding, theft or loss of luggage, you should contact the your
              airline and declare the damage, absence or loss of your personal
              effects before leaving the airport, and then submit a declaration,
              attaching the originals of the following documents: the travel
              ticket, the baggage check-in slip, and the declaration. It is
              recommended that you take out an insurance policy covering the
              value of your items.
            </div>
            <div>
              Additional and oversized baggage fees: Most airlines have their
              own policy regarding baggage. We recommend that you check with
              your airline ahead of time for any weight restrictions and
              additional charges relating to checked baggage. You will be
              responsible for paying to the airline any additional charges for
              checked or overweight baggage, including, but not limited to, golf
              bags and oversized luggage. If you exceed the weight limit set by
              your airline, and excess weight is permitted, you must pay a
              supplement directly to the airline at the airport.
            </div>
            <div>
              <br />
            </div>
            <div>ix. Stop-Overs</div>
            <div>
              <br />
            </div>
            <div>
              Direct flights may be “non-stop” or may involve one or more
              stop-overs (in the latter case this means the same flight by the
              airline, because the flight number remains the same). The same
              applies to connecting flights that may be subject to crew changes.
              When you reserve a scheduled or charter flight involving a
              stop-over in a town, and the second flight takes off from a
              different airport to the airport of arrival, ensure that you have
              sufficient time for reaching the second airport. The journey to
              the other airport is at your own expense. XENIAPP will not be able
              to reimburse you for these costs, nor will it be liable if you
              miss the second flight.
            </div>
            <div>
              <br />
            </div>
            <div>x. E-tickets</div>
            <div>
              <br />
            </div>
            <div>
              An electronic ticket is a ticket with no physical form. When using
              this type of ticket, the Traveler must go to the check-in desk of
              the airline concerned and show a valid travel document (passport,
              visa, identity card, etc.) in order to obtain his / her boarding
              card. The Customer must strictly observe the times for checking
              in.
            </div>
            <div>
              <br />
            </div>
            <div>xi. Problems related to the issuance of e-tickets</div>
            <div>
              <br />
            </div>
            <div>
              As of June 1st, 2008, the International Air Transport Association
              (IATA) imposed rules with regard to the issuing of air travel
              tickets. As of that date, travel agencies and airlines have an
              obligation to only issue travel tickets via electronic means.
            </div>
            <div>
              Due to technical constraints to do with airline’s restrictions in
              relation to certain requirements (infants under the age of 2,
              inter-airline agreements, groups, etc.), it may be impossible to
              issue an electronic ticket. Therefore, though a flight may be
              shown as available, it might prove impossible for us to honor your
              reservation. This situation, which is outside our control, will
              not result in liability on our part.
            </div>
            <div>
              If we cannot issue you an e-ticket, we will contact you to propose
              an alternative route solution. This could involve a different
              tariff and/or additional costs for which you would be responsible.
              In the event of the absence of an alternative solution, your
              refusal to pay any tariff difference, or if the issuance of
              tickets proves impossible, we would be forced to cancel your
              reservation at no cost to you. We will provide you with a full
              refund within 30 days after determining that there is no
              alternative solution possible.
            </div>
            <div>
              <br />
            </div>
            <strong>13. Vehicle Rental</strong>
            <div>
              <br />
            </div>
            <div>i. Method of Payment</div>
            <div>
              <br />
            </div>
            <div>
              The Lead Traveler (and the nominated driver, if different from the
              Lead Traveler) must present a valid credit card in their name upon
              pick up when collecting the vehicle. Travelers should check which
              credit cards are accepted by the Supplier of the rental services
              before attempting to rent a vehicle. Debit cards are generally not
              accepted.
            </div>
            <div>
              Suppliers may submit an authorization request to the credit card
              company during the period of vehicle hire by way of a deposit held
              by the Supplier. The Lead Traveler and nominated driver must
              therefore contact his / her credit card company to ensure the
              payment card limit is suitable for this purpose. Some larger
              vehicle types require two credit cards.
            </div>
            <div>
              If the Traveler does not comply with the terms set out above, the
              Supplier may not make the vehicle available and the full price of
              vehicle rental for the reserved time period may be charged to
              Traveler.
            </div>
            <div>
              <br />
            </div>
            <div>ii. Availabilty of Selected Vehicles</div>
            <div>
              <br />
            </div>
            <div>
              XENIAPP cannot guarantee that a particular type or model of
              selected vehicle will be available from Supplier at time of
              pick-up. Final decisions on the availability of vehicles for hire
              are made by Suppliers.
            </div>
            <div>
              <br />
            </div>
            <div>iii. Supplements and Surcharges</div>
            <div>
              <br />
            </div>
            <div>
              Additional charges may be payable locally such as refueling,
              additional driver charges, young driver surcharges, and delivery
              and collection fees. Traveler acknowledges that in no event shall
              XENIAPP and/or the Suppliers be liable for such additional charges
              as detailed or otherwise.
            </div>
            <div>
              An excess amount may be applicable in the event of theft or damage
              to the rental car. This will vary depending on the Supplier and
              country of rental. Purchase of an optional additional insurance
              coverage locally (called super CDW or super TP) will remove/reduce
              the excess applicable. The Traveler acknowledges that in no event
              shall XENIAPP or the Suppliers be liable for such excess or
              provision of additional insurance coverage as detailed or
              otherwise.
            </div>
            <div>
              Gasoline is not usually included in the hire tariff. For the hire
              of vehicles in certain countries, certain Suppliers automatically
              add charges for filling the fuel tank when the vehicle is
              returned. In addition, certain Suppliers charge a supplement if
              snow tyres are used. Please see the applicable Rules and
              Restrictions when booking.
            </div>
            <div>
              Unless agreed otherwise, the Traveler must return the vehicle to
              the branch of the Supplier from which it was collected. If the
              Traveler does not comply with this, the Supplier may charge an
              additional surcharge.
            </div>
            <div>
              Special equipment, such as child seats, can be requested. Charges
              for additional equipment will be payable directly to the Supplier
              upon pick up (if available).
            </div>
            <div>
              <br />
            </div>
            <div>iv. Collection and Use of Vehicles</div>
            <div>
              <br />
            </div>
            <div>
              Usually drivers must be aged between 21 and 75, although this may
              vary between Suppliers and in various countries. It is the
              Traveler's responsibility to check this with the Supplier prior to
              rental. Additional charges may also apply if any driver is aged
              below 25 or over 70.
            </div>
            <div>
              All drivers must present a full valid driving licence in their
              name for the category of vehicle rented when taking delivery of
              the vehicle. International rentals may have different driving
              licence requirements. An international driving licence is required
              if the drivers' licence is not in the Roman alphabet. Additional
              documentation such as a passport or up to two forms of proof of
              name and address may also be required. Travelers should check the
              applicable Rules and Restrictions of the rental company for
              details of all applicable criteria for booking.
            </div>
            <div>
              Travelers planning on crossing international borders with their
              vehicle should be warned that some Suppliers do not permit the
              rented vehicle to be used outside the country in which it has been
              rented. If you are planning to do so be sure to check with the
              rental company first.
            </div>
            <div>
              <br />
            </div>
            <div>v. Cancellation of Bookings and Unused Days</div>
            <div>
              <br />
            </div>
            <div>
              Generally no refunds will be offered on bookings cancelled within
              6 hours to pick up time or for any unused rental days.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong> 14. Activities Offered During Trips. </strong> Some
              activities available on our Trips are physically active and
              interactive, so you must be in good physical condition and health
              to participate in them. An offered activity may not be appropriate
              for all ages or for individuals with certain medical conditions or
              disabilities. XENIAPP cannot be held liable in the event of an
              incident or accident which is due to a lack of vigilance on your
              part. Some activities may require signing of a legal waiver due to
              their inherent dangers. Participation in those activities is not
              possible without your signing of the relevant waiver.
            </div>
            <div>
              It may happen that certain activities referred to or described in
              your Trip description (or other promotional materials) are no
              longer provided by the local provider for climatic reasons, in the
              event of Force Majeure, outside of the local tourist season, or
              when the minimum number of Travelers required for providing a
              given activity is not reached (examples: group sports, children’s
              clubs). In the early or late season some activities may not be
              available, some of the facilities (restaurant, swimming pool,
              etc.) may be closed, or maintenance work may be in progress. As a
              general rule, entertainment and sports activities may vary in
              frequency depending on how many people are staying at the time and
              on climatic conditions. Particularly during the high season it is
              possible that the number of items like parasols, loungers, sports
              equipment, etc., are insufficient for the demand. The opening
              hours of bars, restaurants, and nightclubs, etc., may be irregular
              and dependent on the management of the establishment in question.
              XENIAPP cannot be held liable for activities unavailable due to
              any of the reasons listed above, or for any other reason outside
              of our control, but will try to obtain a refund for Traveler
              whenever possible.
            </div>
            <div>
              <br />
            </div>
            <div>
              YOU ACKNOWLEDGE THAT THE USE OR ENJOYMENT OF AN ACTIVITY MAY BE
              HAZARDOUS AND INHERENTLY RISKY, AND, TO THE MAXIMUM EXTENT
              PERMITTED BY LAW, XENIAPP SHALL HAVE NO LIABILITY FOR ANY PERSONAL
              INJURY OR DEATH; LOST, STOLEN, DAMAGED OR DESTROYED PROPERTY; OR
              OTHER LIABILITY ARISING OUT OF OR IN CONNECTION WITH THE ACTIVITY.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>15. Airport Transfers.</strong> We cannot accept
              responsibility for any delays in airport transfers and pick-ups.
              Further, transfer Suppliers reserve the right to change your
              vehicle or chauffeur at any time if deemed necessary. XENIAPP
              cannot be held liable for any loss or damage to Traveler or
              Traveler’s property while utilizing an airport transfer.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>16. Marketing Materials and Illustrative Photos. </strong>{" "}
              XENIAPP endeavors to illustrate the Travel Services it offers
              using photographs or illustrations that provide a realistic
              representation of the Services. However, please note that
              photographs and illustrations appearing in descriptions are for
              illustrative purposes only. They are not contractual nor are they
              to be construed as guarantees of the conditions of the Travel
              Services pictured at the time of a scheduled Trip.
            </div>
            <div>
              <strong>17. Use of Traveler Testimonials and Photographs.</strong>{" "}
              XENIAPP may occasionally use statements and testimonials provided
              by Travelers, and/or Travelers’ photographs, in marketing
              materials, the App, on the internet (including the Website and
              social media), and in print publications and advertisements to
              promote Xenia. Before we do so, XENIAPP will ask Travelers for
              their consent to the use. If the Traveler does consent, it will be
              considered a full consent to such use of Traveler’s statements
              and/or photographs, images, or other likenesses, without the
              payment of any compensation to Traveler, and the grant to XENIAPP
              of a non-revocable license for said use.
            </div>
            <div>
              <strong>18. Local Customs, Laws, and Travel Risks.</strong>{" "}
              Travelers may be traveling to foreign countries, with different
              customs, standards, laws and risks than those Travelers are
              accustomed to. Traveler understands that they must be prepared to
              cope with the unexpected, with local customs and shortages, with
              the vagaries of weather, travel and mankind in general. As such,
              Traveler acknowledges and accepts the risks associated with travel
              in a foreign country and agrees to release and hold XENIAPP
              harmless for any such problems experienced while participating in
              their Trip.
            </div>
            <div>
              Although most travel to participating destinations is completed
              without incident, travel to certain areas may involve greater risk
              than others. You assume sole responsibility for your own safety at
              any destination traveled to. XENIAPP does not guarantee your
              safety at any time, and assumes no responsibility for gathering
              and/or disseminating information for you relating to risks
              associated with your destinations. BY OFFERING OR FACILITATING
              TRAVEL TO CERTAIN DESTINATIONS, WE DO NOT REPRESENT OR WARRANT
              THAT TRAVEL TO SUCH POINTS IS ADVISABLE OR WITHOUT RISK, AND WE
              SHALL NOT BE LIABLE FOR DAMAGES OR LOSSES THAT MAY RESULT FROM
              TRAVEL TO SUCH DESTINATIONS.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>19. Notices. </strong>Any notices required or permitted
              hereunder shall be given:
            </div>
            <div>i. If to XENIAPP, via email to:</div>
            <div>
              <br />
            </div>
            <div>info@Xeniapp.com</div>
            <div>
              <br />
            </div>
            <div>
              Or in writing via certified mail, return receipt requested,
              addressed to:
            </div>
            <div>
              <br />
            </div>
            <div>Xeniapp, Inc.</div>
            <div>157 Columbus Avenue</div>
            <div>Suite 437</div>
            <div>New York, NY 10023</div>
            <div />
            <div>
              ii. If to Traveler, at the email or physical address provided by
              Traveler during the registration process.
            </div>
            <div>
              <br />
            </div>
            <div>
              iii. Such notice shall be deemed given: upon personal delivery; if
              sent by electronic mail, upon confirmation of receipt; or if sent
              by certified or registered mail, postage prepaid, three (3) days
              after the date of mailing.
            </div>
            <div>
              <br />
            </div>
            <strong>20. Seller of Travel Registration Information.</strong>
            <div>
              <br />
            </div>
            <ul>
              <li>
                California Registration Info: XENIAPP is registered with the
                California Department of Justice. CST# PENDING. Registration as
                a seller of travel does not constitute approval by the State of
                California. California law requires certain sellers of travel to
                have a trust account or bond to protect consumer’s money. This
                business has a trust account.
              </li>

              <li>Florida Registration No. PENDING</li>
            </ul>
            <div>
              <br />
            </div>
            <div>
              <strong>21. Limitation of Liability. </strong> IN NO EVENT SHALL
              XENIAPP BE LIABLE FOR ANY CONSEQUENTIAL, INDIRECT, EXEMPLARY,
              SPECIAL, INCIDENTAL OR PUNITIVE DAMAGES OF ANY KIND, INCLUDING
              WITHOUT LIMITATION, DAMAGES FOR ANY LOSS OF OPPORTUNITY OR OTHER
              PECUNIARY LOSS, EVEN IF XENIAPP HAS BEEN ADVISED OF THE
              POSSIBILITY OR PROBABILITY OF SUCH DAMAGES OR LOSSES, WHETHER SUCH
              LIABILITY IS BASED UPON CONTRACT, TORT, NEGLIGENCE OR OTHER LEGAL
              THEORY. IN NO EVENT SHALL XENIAPP’S TOTAL AGGREGATE LIABILITY TO
              THE TRAVELER FOR CLAIMS ARISING UNDER THIS AGREEMENT EXCEED THE
              TOTAL AMOUNTS PAID BY THE TRAVELER TO XENIAPP UNDER THIS
              AGREEMENT.
            </div>
            <div>
              XENIAPP OFFERS VARIOUS TRAVEL SERVICES PROVIDED BY THIRD PARTY
              SUPPLIERS. XENIAPP RETAINS NO OWNERSHIP INTEREST, MANAGEMENT, OR
              CONTROL OF THOSE THIRD PARTY SUPPLIERS. TO THE FULLEST EXTENT
              PERMITTED BY LAW, XENIAPP DOES NOT ASSUME LIABILITY FOR ANY
              INJURY, DAMAGE, DEATH, LOSS, ACCIDENT OR DELAY DUE TO AN ACT OR
              OMISSION OF ANY THIRD PARTIES (INCLUDING THIRD PARTY SUPPLIERS),
              GOVERNMENTAL AUTHORITY, OR ACTS ATTRIBUTABLE TO YOU YOURSELF,
              INCLUDING, WITHOUT LIMITATION, NEGLIGENT OR RECKLESS ACTS.
            </div>
            <div>
              <strong> 22. Disclaimer of Warranties. </strong> The inclusion or
              offering of any Services by XENIAPP does not constitute any
              endorsement or recommendation of such products or services. UNLESS
              OTHERWISE STATED, ALL GOODS AND SERVICES OFFERED BY XENIAPP ARE
              PROVIDED TO YOU ON AN "AS IS," "AS AVAILABLE" BASIS. Certain kinds
              of information, such as Hotel ratings, should be treated as broad
              guidelines. XENIAPP does not guarantee the accuracy of this
              information.
            </div>
            <div>
              TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW,
              XENIAPP DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE
              IMPLIED WARRANTIES OF MERCHANTABILITY, SUITABILITY FOR A
              PARTICULAR PURPOSE, TITLE, UNINTERRUPTED SERVICE, AND ANY
              WARRANTIES ARISING OUT OF A COURSE OF PERFORMANCE, DEALING OR
              TRADE USAGE FOR ALL GOODS AND SERVICES SOLD BY/THROUGH XENIAPP.
              Applicable law in your jurisdiction may not allow the exclusion of
              implied warranties, so the above exclusions may not apply to you.
            </div>
            <div>
              <strong>23. Indemnification and Release.</strong> You hereby
              release XENIAPP and their successors from claims, demands, any and
              all losses, damages, rights, and actions of any kind, including
              personal injuries, death, and property damage, that is either
              directly or indirectly related to or arises from your use of
              Travel Services, Traveler’s participation in a Trip, including but
              not limited to, any interactions of any kind arising in connection
              with or as a result of this Agreement. If you are a California
              resident, you hereby waive California Civil Code Section 1542,
              which states, “A general release does not extend to claims which
              the creditor does not know or suspect to exist in his favor at the
              time of executing the release, which, if known by him must have
              materially affected his settlement with the debtor.
            </div>
            <div>
              Traveler hereby also agrees to indemnify, defend and hold harmless
              XENIAPP from and against any and all damages, losses, claims,
              liabilities, deficiencies, costs, fees (including reasonable
              attorneys' fees) and expenses, arising out of any claim brought
              against XENIAPP regarding, resulting, or arising from Traveler’s
              participation in a Trip or Traveler’s booking of Travel Services.
            </div>
            <div>
              <strong>24. Force Majeure.</strong> XENIAPP shall not be
              responsible for failure to perform any of its obligations under
              this Agreement during any period in which such performance is
              prevented or delayed due to Force Majeure. “Force Majeure” refers
              to any event beyond XENIAPP’s reasonable control, including but
              not limited to severe weather, fire, flood, mudslides,
              earthquakes, war, labor disputes, strikes, political unrest,
              natural or nuclear disaster, epidemics, World Health
              Organization’s advisories and/or alerts, Center for Disease
              Control’s advisories and/or alerts, U.S. State Department’s
              advisories and/or alerts, any order of any local, provincial or
              federal government authority, interruption of power Services,
              terrorism or any other causes beyond the control of XENIAPP or
              deemed by XENIAPP to constitute a danger to the safety and
              well-being of Travelers. XENIAPP reserves the right to cancel any
              Services due to Force Majeure.
            </div>
            <div>
              <strong>25. Compliance.</strong> If you believe that XENIAPP has
              not adhered to this Agreement, please contact XENIAPP by emailing
              us at info@xeniapp.com. We will do our best to address your
              concerns. If you feel that your concerns have been addressed
              incompletely, please let us know.
            </div>
            <div>
              <strong>
                26. Disputes: Mandatory Binding Arbitration, and Class Action
                Waiver.
              </strong>{" "}
              You and XENIAPP shall attempt in good faith to resolve any dispute
              concerning, relating, or referring to a Trip, Services sold by us,
              XENIAPP’ website or mobile app, any literature or materials
              concerning XENIAPP, and these Travel Booking Terms or the breach,
              termination, enforcement, interpretation or validity thereof,
              (hereinafter a “Dispute”) through preliminary negotiations. If the
              Dispute is not resolved through good faith negotiation, all
              Disputes shall be resolved exclusively by binding arbitration held
              in New York, New York and presided over by one (1) arbiter. The
              arbitration shall be administered by JAMS or a similar ADR
              organization pursuant to JAMS Comprehensive Arbitration Rules and
              Procedures and in accordance with the Expedited Procedures in
              those Rules. The arbitrator’s decision shall be final and binding
              and judgment may be entered thereon. In the event a party fails to
              proceed with arbitration the other party is entitled of costs of
              suit including a reasonable attorney’s fee for having to compel
              arbitration. Nothing herein will be construed to prevent any
              party’s use of injunction, and/or any other prejudgment or
              provisional action or remedy. Any such action or remedy shall act
              as a waiver of the moving party’s right to compel arbitration of
              any dispute. YOU RECOGNIZE, BY AGREEING TO THESE Travel Booking
              Terms, YOU AND XENIAPP ARE EACH WAIVING THE RIGHT TO A TRIAL BY
              JURY OR TO PARTICIPATE IN A CLASS ACTION WITH RESPECT TO THE
              CLAIMS COVERED BY THIS MANDATORY BINDING ARBITRATION PROVISION.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>27. Governing Law, Venue, and Jurisdiction.</strong> These
              Travel Booking Terms and the relationship between you and XENIAPP
              will be governed by U.S. law, particularly the laws of the State
              of New York, without regard to its conflict of law provisions. You
              and XENIAPP agree to submit to the personal jurisdiction of the
              federal and state courts located in New York, New York with
              respect to any legal proceedings that may arise in connection
              with, or relate to, our Binding Arbitration clause and/or any
              other Dispute related to these Travel Booking Terms not covered by
              our Binding Arbitration clause. Traveler and XENIAPP agree the
              exclusive venue for any and all legal proceedings that may arise
              in connection with, or relate to, our Binding Arbitration clause
              and/or a Dispute, shall be the federal and state courts located in
              New York, New York, and to irrevocably submit to the jurisdiction
              of any such court in any such action, suit or proceeding and
              hereby agrees not to assert, by way of motion, as a defense or
              otherwise, in any such action, suit or proceeding, any claim that
              (i) he, she or it is not subject personally to the jurisdiction of
              such court, (ii) the venue is improper, or (iii) this agreement or
              the subject matter hereof may not be enforced in or by such court.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong>
                {" "}
                28. Attorney’s Fees, Costs, and Expenses of Suit.{" "}
              </strong>
              If any act of law or equity, including an action for declaratory
              relief, is brought to enforce, interpret or construe the
              provisions of this Agreement and/or the included Mandatory Binding
              Arbitration Agreement, the prevailing party shall be entitled to
              recover actual reasonable attorney’s fees, costs, and expenses.
            </div>
            <div>
              <strong> 29. Assignment.</strong> Traveler may not assign his
              rights or obligations hereunder without the prior written consent
              of XENIAPP.
            </div>
            <div>
              <strong> 30. Severability and Survivability. </strong>If any
              provision, or portion of a provision, in these Travel Booking
              Terms shall be unlawful, void, or for any reason unenforceable,
              then that provision shall be deemed severable and shall not affect
              the validity and enforceability of any remaining provisions.
              Traveler and XENIAPP agree to substitute for such provision a
              valid provision which most closely approximates the intent and
              economic effect of such severed provision.
            </div>
            <div>
              Notwithstanding any other provisions of this these Travel Booking
              Terms, or any general legal principles to the contrary, any
              provision of these Travel Booking Terms that imposes or
              contemplates continuing obligations on a party will survive the
              expiration or termination of these Travel Booking Terms.
            </div>
            <div>
              <strong> 31. Waiver.</strong> No delay or failure by either party
              to exercise or enforce at any time any right or provision hereof
              will be considered a waiver thereof of such party's rights
              thereafter to exercise or enforce each and every right and
              provision hereof. No single waiver will constitute a continuing or
              subsequent waiver. XENIAPP does not guarantee it will take action
              against all breaches of this Agreement. No waiver, modification or
              amendment of any provision hereof will be effective unless it is
              in a writing signed by both the parties.
            </div>
            <div>
              <strong> 32. Consumer Complaints. </strong>Under California Civil
              Code Section 1789.3, California users of the Service receive the
              following specific consumer rights notice: The Complaint
              Assistance Unit of the Division of Consumer Services of the
              California Department of Consumer Affairs may be contacted in
              writing at 1020 N Street, #501, Sacramento, California 95814, or
              by telephone at (800) 952-5210.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong> 33. Modification of Our Travel Booking Terms. </strong>{" "}
              Our Travel Booking Terms may be amended or modified by us at any
              time, without notice, on the understanding that such changes will
              not apply to Trips booked prior to the amendment or modification.
              It is therefore essential that you consult and accept our Travel
              Booking Terms at the time of making a booking, particularly in
              order to determine which provisions are in operation at that time
              in case they have changed since the last time you placed an order
              with XENIAPP or reviewed our Travel Booking Terms.
            </div>
            <div>
              <br />
            </div>
            <div>
              <strong> 34. Entire Agreement.</strong> This Agreement is the
              final, complete and exclusive agreement of the parties with
              respect to the subject matter hereof and supersedes and merges all
              prior discussions or agreements between the parties with respect
              to such subject matter.
            </div>
            <div>
              <br />
            </div>
            <div>
              <br />
            </div>
            <center>Updated July 22, 2019</center>

            <ScrollToTop />
          </div>
        </section>
        <Footer />
      </React.Fragment>
    );
  }
}
export default TermsAndCondition;
