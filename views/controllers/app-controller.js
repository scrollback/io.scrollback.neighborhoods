import React from "react-native";
import App from "../components/app";
import store from "../../store/store";

export default class AppController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: "LOADING"
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => {
            if (this._mounted) {
                this._onDataArrived(store.getUser());
            }
        }, 500);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived() {
        this.setState({ user: "FAILED" });
    }

    _onError() {
        this.setState({
            user: "FAILED"
        });
    }

    render() {
        return <App {...this.props} {...this.state} />;
    }
}
