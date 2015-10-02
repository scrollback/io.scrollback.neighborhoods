import React from "react-native";
import Linking from "../../modules/linking";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    link: { color: "#2196F3" }
});

export default class Link extends React.Component {
    openLink(link) {
        Linking.openURL(link);
    }

    render() {
        return (
            <Text
                {...this.props}
                onPress={() => this.props.href ? this.openLink(this.props.href) : false}
                style={[ styles.link, this.props.style ]}
            >
                    {this.props.children}
            </Text>
        );
    }
}

Link.defaultProps = {
    href: ""
};

Link.propTypes = {
    children: React.PropTypes.string.isRequired,
    href: React.PropTypes.string
};
