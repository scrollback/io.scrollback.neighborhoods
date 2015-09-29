import React from "react-native";
import Chat from "./chat";
import store from "../store/store";

const {
    InteractionManager
} = React;

export default class ChatController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [ "LOADING" ]
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => this._onDataArrived(store.getTexts()), 0);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(newData) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    data: newData.reverse()
                });
            }
        });
    }

    _onError() {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    data: [ "FAILED" ]
                });
            }
        });
    }

    _onRefresh() {

    }

    render() {
        return (
            <Chat
                {...this.props}
                {...this.state}
                refreshData={this._onRefresh.bind(this)}
            />
        );
    }
}
