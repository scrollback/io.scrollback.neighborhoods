/* global fetch */

import React from "react-native";

const {
    StyleSheet,
    View,
    ProgressBarAndroid,
    Image,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    container: {
        height: 240
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    progress: {
        height: 36,
        width: 36
    },
    thumbnail: {
        resizeMode: "cover",
        height: 240,
        justifyContent: "center",
        alignItems: "center"
    },
    play: {
        backgroundColor: "transparent",
        height: 64,
        width: 64,
        borderRadius: 32,
        opacity: 0.7
    }
});

export default class Embed extends React.Component {
    componentDidMount() {
        fetch(this.props.endpoint)
            .then(response => response.json())
            .then(embed => this.setState({ embed }));
    }

    render() {
        return (
            <View {...this.props} style={[ styles.container, this.props.style ]}>
                {this.state && this.state.embed && this.state.embed.thumbnail_url ?
                    (<TouchableHighlight>
                        <Image source={{ uri: this.state.embed.thumbnail_url }} style={styles.thumbnail}>
                            <Image source={require("image!embed_play")} style={styles.play} />
                        </Image>
                    </TouchableHighlight>) :
                    (<View style={styles.overlay}>
                        <ProgressBarAndroid style={styles.progress} />
                    </View>)
                }
            </View>
        );
    }
}

Embed.propTypes = {
    endpoint: React.PropTypes.string.isRequired
};
