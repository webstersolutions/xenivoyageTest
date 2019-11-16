import React, { Component } from 'react';

class CancellationModal extends Component {

    render() {

        const { cancellationPolicyInfo, selectedCurrency } = this.props;
        const refundableAmount = parseFloat(cancellationPolicyInfo.totalAmount).toFixed(2);

        return (
            <div>
                <div
                    className="modal backgroundDark"
                    id="myModal"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog signInPopup">

                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Cancellation</h4>
                                <button
                                    type="button"
                                    onClick={this.props.onHide}
                                    className="close"
                                >
                                    &times;
                            </button>
                            </div>

                            <div className="modal-body">

                                <h4>Cancellation Policy</h4>
                                <p>{cancellationPolicyInfo.cancellationPolicy.text}</p>
                                <div className="form-group">
                                    <label>Select Cancellation Reasons</label>
                                    <select className="form-control">
                                        <option value="">Select Reason</option>
                                        <option value="duplicate">Duplicate</option>
                                        <option value="fraudulent">Fraudulent</option>
                                        <option value="requested_by_customer">Requested by Customer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Refundable Amount :</label>
                                    {
                                        cancellationPolicyInfo.refundability ? <span> {selectedCurrency}{refundableAmount}</span> : <span>{selectedCurrency} 00.00</span>
                                    }
                                </div>
                                <div className="form-group text-center">
                                    <button type="button" className="searchBtn mr-1">Yes</button>
                                    <button type="button" className="searchBtn" onClick={this.props.onHide}>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default CancellationModal;