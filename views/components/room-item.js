import React from "react-native";
import TouchFeedback from "./touch-feedback";
import routes from "../utils/routes";
import locationUtils from "../../lib/location-utils";

const {
    StyleSheet,
    View,
    Text
} = React;

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#fff",
        borderColor: "rgba(0, 0, 0, .04)",
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12
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
        this.props.navigator.push(routes.room({ room: this.props.room.id }));
    }

    render() {
        const { room } = this.props;

        const formattedDistance = locationUtils.getFormattedDistance(currentLocation, room);

        return (
            <View {...this.props}>
                <TouchFeedback onPress={this._onPress.bind(this)}>
                    <View style={styles.item}>
                        <Text style={styles.title}>{room.displayName}</Text>
                        <Text style={styles.distance}>{formattedDistance}</Text>
                    </View>
                </TouchFeedback>
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
    }),
    navigator: React.PropTypes.object.isRequired
};
