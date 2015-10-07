import React from "react-native";
import StartDiscussion from "../components/start-discussion";

export default class StartDiscussionController extends React.Component {
    _postDiscussion() {

    }

    render() {
        return <StartDiscussion {...this.props} postDiscussion={this._postDiscussion.bind(this)} />;
    }
}
