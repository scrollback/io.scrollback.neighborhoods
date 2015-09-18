import React from "react-native";
import Linking from "../modules/linking";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    link: { color: "#0af" }
});

export default class RichText extends React.Component {
    openLink(link) {
        Linking.openURL(link);
    }

    render() {
        return (
            <Text {...this.props}>
                {this.props.text.split("\n").map(text => {
                    return (
                        <Text>
                            {text.split(" ").map(t => {
                                if (/^@\S+$/.test(t)) {
                                    // a mention
                                    return <Text style={styles.link}>{t} </Text>;
                                }

                                if (/^#\S+$/.test(t)) {
                                    // a hashtag
                                    return <Text style={styles.link}>{t} </Text>;
                                }

                                if (/^(http|https):\/\/(\S+)$/i.test(t)) {
                                    // a link
                                    return <Text onPress={() => this.openLink(t)} style={styles.link}>{t} </Text>;
                                }

                                if (/^\S+@\S+$/i.test(t)) {
                                    // an email id
                                    return <Text onPress={() => this.openLink("mailto:" + t)} style={styles.link}>{t} </Text>;
                                }

                                if (/^(0|\+91)?[0-9]{10}$/.test(t)) {
                                    // a phone number
                                    return <Text onPress={() => this.openLink("tel:" + t)} style={styles.link}>{t} </Text>;
                                }

                                return <Text>{t} </Text>;
                            })}{"\n"}
                        </Text>
                    );
                })}
            </Text>
        );
    }
}

RichText.propTypes = {
    text: React.PropTypes.string.isRequired
};
