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
                const data = [];

                for (let i = newData.length, l = 0; i >= l; i--) {
                    const text = newData[i];
                    const previousText = newData[i - 1];

                    if (typeof text === "object" && text !== null) {
                        data.push({
                            text,
                            previousText
                        });
                    }
                }

                this.setState({ data });
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

    _refreshData() {

    }

    render() {
        return (
            <Chat
                {...this.props}
                {...this.state}
                refreshData={this._refreshData.bind(this)}
            />
        );
    }
}
