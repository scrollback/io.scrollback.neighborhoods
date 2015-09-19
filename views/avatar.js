import React from "react-native";

const {
    Image
} = React;

export default class CardAuthor extends React.Component {
    render() {
        return (
            <Image {...this.props} source={{ uri: "http://scrollback.io/i/" + this.props.nick + "/picture?size=" + (this.props.size || 48) }} />
        );
    }
}

CardAuthor.propTypes = {
    nick: React.PropTypes.string.isRequired,
    size: React.PropTypes.number
};
