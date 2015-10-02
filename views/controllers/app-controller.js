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
        }, 1000);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(user) {
        this.setState({ user });
    }

    _onError() {
        this.setState({
            user: "FAILED"
        });
    }

    render() {
        return <App {...this.state} />;
    }
}
