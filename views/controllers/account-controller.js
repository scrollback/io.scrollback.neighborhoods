import React from "react-native";
import Account from "../components/account";
import store from "../../store/store";

const {
    InteractionManager
} = React;

export default class AccountController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: "LOADING"
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => this._onDataArrived(store.getUser()), 100);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(user) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({ user });
            }
        });
    }

    _onError() {
        this.setState({
            user: "FAILED"
        });
    }

    render() {
        return <Account {...this.props} {...this.state} />;
    }
}
