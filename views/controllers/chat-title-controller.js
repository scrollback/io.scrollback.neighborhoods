import React from "react-native";
import ChatTitle from "../components/chat-title";
import store from "../../store/store";

const {
    InteractionManager
} = React;

export default class ChatTitleController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            thread: "LOADING"
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => this._onDataArrived(store.getThreadById(this.props.thread)), 0);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(thread) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({ thread });
            }
        });
    }

    _onError() {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    thread: "FAILED"
                });
            }
        });
    }

    render() {
        return <ChatTitle {...this.props} {...this.state} />;
    }
}

ChatTitleController.propTypes = {
    thread: React.PropTypes.string.isRequired
};
