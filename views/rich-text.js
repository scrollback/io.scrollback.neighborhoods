import React from "react-native";
import Link from "./link";
import smiley from "../lib/smiley";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        lineHeight: 21
    }
});

export default class RichText extends React.Component {
    render() {
        return (
            <Text {...this.props} style={[ styles.text, this.props.style ]}>
                {smiley.format(this.props.text).split("\n").map((text, index, arr) => {
                    return ([
                        text.split(" ").map((t, i) => {
                            let items = [];

                            const key = "inner-" + index + "-" + i;

                            // Strip out ending punctuations
                            let punctuation = "";

                            if (/[\.,\?!:;]$/.test(t)) {
                                punctuation = t.substring(t.length - 1);

                                t = t.replace(/.$/, "");
                            }

                            if (/^@[a-z0-9\-]+$/.test(t)) {
                                // a mention
                                items.push(<Link key={key}>{t}</Link>);
                            } else if (/^#\S+$/.test(t)) {
                                // a hashtag
                                items.push(<Link key={key}>{t}</Link>);
                            } else if (/^(http|https):\/\/(\S+)$/i.test(t)) {
                                // a link
                                items.push(<Link key={key} href={t}>{t}</Link>);
                            } else if (/^[^@]+@[^@]+\.[^@]+$/i.test(t)) {
                                // an email id
                                items.push(<Link key={key} href={"mailto:" + t}>{t}</Link>);
                            } else if (/^(?:\+?(\d{1,3}))?[-.\s(]*(\d{3})?[-.\s)]*(\d{3})[-.\s]*(\d{4})(?: *x(\d+))?$/.test(t)) {
                                // a phone number
                                items.push(<Link key={key} href={"tel:" + t}>{t}</Link>);
                            } else {
                                return t + punctuation + " ";
                            }

                            items.push(punctuation + " ");

                            return items;
                        }),
                        index !== (arr.length - 1) ? "\n" : ""
                    ]);
                })}
            </Text>
        );
    }
}

RichText.propTypes = {
    text: React.PropTypes.string.isRequired
};
