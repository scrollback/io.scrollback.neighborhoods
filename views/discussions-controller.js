import React from "react-native";
import Discussions from "./discussions";
import store from "../store/store";

const {
    InteractionManager
} = React;

export default class DiscussionsController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [ "LOADING" ]
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => this._onDataArrived(store.getThreads(this.props.room)), 0);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(data) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
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
            <Discussions
                {...this.props}
                {...this.state}
                refreshData={this._refreshData.bind(this)}
            />
        );
    }
}

DiscussionsController.propTypes = {
    room: React.PropTypes.string.isRequired
};
