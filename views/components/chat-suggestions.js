import React from "react-native";
import AvatarController from "../controllers/avatar-controller";

const {
	StyleSheet,
	PixelRatio,
	TouchableHighlight,
	ScrollView,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	inverted: {
		transform: [
			{ scaleY: -1 }
		]
	},
	item: {
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .08)",
		borderTopWidth: 1 / PixelRatio.get(),
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		height: 40
	},
	avatar: {
		height: 24,
		width: 24,
		borderRadius: 12,
		backgroundColor: "rgba(0, 0, 0, .16)"
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		borderRadius: 24
	},
	nick: {
		color: "#555",
		fontSize: 14,
		lineHeight: 21,
		marginHorizontal: 12,
		paddingHorizontal: 4
	}
});

export default class ChatSuggestions extends React.Component {
	render() {
		const { data } = this.props;

		if (!data.length) {
			return null;
		}

		return (
			<ScrollView {...this.props} style={[ data.length > 4 ? { height: 160 } : null, styles.inverted, this.props.style ]}>
				{data.map(nick => {
					return (
						<TouchableHighlight
							key={nick}
							underlayColor="rgba(0, 0, 0, .12)"
							onPress={() => this.props.onSelect(nick)}
						>
							<View style={[ styles.item, styles.inverted ]}>
								<View style={styles.avatar}>
									<AvatarController
										nick={nick}
										size={24}
										style={styles.image}
									/>
								</View>
								<Text style={styles.nick}>{nick}</Text>
							</View>
						</TouchableHighlight>
					);
				})}
			</ScrollView>
		);
	}
}

ChatSuggestions.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.string)
};
