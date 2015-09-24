import React from "react-native";
import Discussions from "./discussions";
import locationUtils from "../lib/location-utils";

const {
    StyleSheet,
    TouchableNativeFeedback,
    View,
    Text
} = React;

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#fff",
        borderColor: "rgba(0, 0, 0, .04)",
        borderBottomWidth: 1,
        padding: 16
    },
    title: {
        fontSize: 14,
        fontWeight: "bold"
    },
    distance: {
        fontSize: 12,
        opacity: 0.7,
        marginTop: 4
    }
});

const currentLocation = {
    latitude: 12.9667,
    longitude: 77.5667
};

export default class RoomItem extends React.Component {
    _onPress() {
        this.props.navigator.push({
            title: this.props.room.displayName,
            component: Discussions
        });
    }

    render() {
        const { room } = this.props;

        const formattedDistance = locationUtils.getFormattedDistance(currentLocation, room);

        return (
            <View {...this.props}>
                <TouchableNativeFeedback onPress={this._onPress.bind(this)}>
                    <View style={styles.item}>
                        <Text style={styles.title}>{room.displayName}</Text>
                        <Text style={styles.distance}>{formattedDistance}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
}

RoomItem.propTypes = {
    room: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        latitude: React.PropTypes.number.isRequired,
        longitude: React.PropTypes.number.isRequired
    })
};
