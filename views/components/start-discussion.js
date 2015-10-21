import React from "react-native";
import Loading from "./loading";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import GrowingTextInput from "./growing-text-input";
import DeviceVersion from "../../modules/device-version";

const {
	PixelRatio,
	StyleSheet,
	ScrollView,
	View,
	Text,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	statusbar: {
		height: DeviceVersion.VERSION_SDK_INT < DeviceVersion.VERSION_CODES_KITKAT ? 0 : 25 // offset for statusbar height
	},
	appbar: {
		flexDirection: "row",
		alignItems: "stretch",
		justifyContent: "space-between",
		height: 56,
		borderColor: "rgba(0, 0, 0, .16)",
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: 4
	},
	titleText: {
		color: "#555",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 14,
		marginRight: 64,
		paddingHorizontal: 4,
		marginHorizontal: 4
	},
	icon: {
		color: "#555"
	},
	scene: {
		padding: 16,
		backgroundColor: "#fff"
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: "#673AB7",
		fontWeight: "bold",
		fontSize: 14,
		lineHeight: 21,
		marginRight: 16
	},
	buttonIcon: {
		color: "#673AB7",
		fontSize: 24,
		marginHorizontal: 12
	},
	loading: {
		height: 19,
		width: 19,
		margin: 18
	}
});

export default class StartDiscussionButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			text: "",
			status: null
		};
	}

	_onPress() {
		if (this.state.status === "loading") {
			return;
		}

		if (this.state.title && this.state.text) {
			this.props.postDiscussion(this.state.title, this.state.text);

			this.setState({
				status: "loading"
			});
		}
	}

	_onTitleChange(e) {
		this.setState({
			title: e.nativeEvent.text
		});
	}

	_onTextChange(e) {
		this.setState({
			text: e.nativeEvent.text
		});
	}

	render() {
		const isLoading = this.state.status === "loading";

		return (
			<View style={styles.container}>
				<View style={styles.statusbar} />

				<View style={styles.appbar}>
					<AppbarTouchable onPress={this.props.dismiss}>
						<AppbarIcon name="close" style={styles.icon} />
					</AppbarTouchable>

					<AppbarTouchable onPress={this._onPress.bind(this)}>
						{isLoading ?
							<Loading style={styles.loading} /> :
							(<View style={styles.button}>
								<AppbarIcon name="done" style={styles.buttonIcon} />
								<Text style={styles.buttonText}>POST</Text>
							</View>)
						}
					</AppbarTouchable>
				</View>

				<ScrollView style={styles.scene}>
					<TextInput
						autoFocus
						value={this.state.title}
						onChange={this._onTitleChange.bind(this)}
						placeholder="Enter discussion title"
						autoCapitalize="sentences"
					/>

					<GrowingTextInput
						numberOfLines={5}
						value={this.state.text}
						onChange={this._onTextChange.bind(this)}
						placeholder="Enter discussion summary"
						autoCapitalize="sentences"
					/>
				</ScrollView>
			</View>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	dismiss: React.PropTypes.func.isRequired,
	postDiscussion: React.PropTypes.func.isRequired
};
