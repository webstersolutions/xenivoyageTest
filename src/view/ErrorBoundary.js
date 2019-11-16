import React from "react";
import {logEntry} from '../service/common/action';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const enableLog = process.env.LOG_ENABLE || false;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        if (enableLog) {
            this.props.logEntry(info, error);
        }
        return {hasError: true};
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

const mapDispatchToProps = dispatch => ({
    logEntry: payload => dispatch(logEntry(payload)),
});

export default withRouter(connect(null, mapDispatchToProps)(ErrorBoundary));

