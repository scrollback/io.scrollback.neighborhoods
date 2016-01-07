import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import ModalSheet from "./ModalSheet";
import TouchFeedback from "./TouchFeedback";
import KeyboardSpacer from "./KeyboardSpacer";
import VersionCodes from "../modules/VersionCodes";


const {
	StyleSheet,
	Platform,
	Dimensions,
	TouchableWithoutFeedback,
	Animated,
	PixelRatio,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "absolute",
		top: 0,
		left: 0
	},
	overlay: {
		flex: 1,
		alignItems: "stretch",
		justifyContent: "flex-end",
		backgroundColor: Colors.fadedBlack
	},
	menuItem: {
		borderColor: Colors.separator,
		borderTopWidth: 1 / PixelRatio.get()
	},
	menuItemFirst: {
		borderTopWidth: 0
	},
	menuItemText: {
		fontSize: 16,
		lineHeight: 24,
		color: Colors.darkGrey,
		margin: 20,
		paddingHorizontal: 4
	}
});

let _renderComponent, _isShown;

export default class Modal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			component: null
		};
	}

	componentDidMount() {
		_renderComponent = this._renderComponent.bind(this);
		_isShown = this._isShown.bind(this);
	}

	componentWillUnmount() {
		_renderComponent = null;
		_isShown = null;
	}

	_renderComponent(component) {
		if (component === this._component) {
			return;
		}

		this._component = component;

		if (component) {
			this.setState({
				component,
				fadeAnim: new Animated.Value(0)
			}, () => Animated.timing(this.state.fadeAnim, {
				toValue: 1,
				duration: 300
			}).start());
		} else if (this.state.component) {
			Animated.timing(this.state.fadeAnim, {
				toValue: 0,
				duration: 300
			}).start(() => this.setState({ component: null }));
		}
	}

	_isShown() {
		return !!this.state.component;
	}

	render() {
		if (!this.state.component) {
			return null;
		}

		let { height, width } = Dimensions.get("window");

		// Android < 4.4 seems to include statusbar height also
		if (Platform.OS === "android" && Platform.Version < VersionCodes.KITKAT) {
			height -= 25;
			width -= 0;
		}

		return (
			<Animated.View style={[ styles.container, { height, width, opacity: this.state.fadeAnim } ]}>
				{this.state.component}

				<KeyboardSpacer />
			</Animated.View>
		);
	}
}

Modal.isShown = () => {
	if (_isShown) {
		return _isShown();
	}

	return false;
};

Modal.renderComponent = component => {
	if (_renderComponent) {
		_renderComponent(component);

		return true;
	}

	return false;
};

Modal.renderModal = component => {
	return Modal.renderComponent((
		<TouchableWithoutFeedback onPress={() => Modal.renderComponent(null)}>
			<View style={styles.overlay}>
				<ModalSheet>
					{component}
				</ModalSheet>
			</View>
		</TouchableWithoutFeedback>
	));
};

Modal.showActionSheetWithOptions = (options, callback) => {
	return Modal.renderModal(options.options.map((item, index) =>
		(
			<TouchFeedback
				key={index}
				onPress={() =>
					global.requestAnimationFrame(() => {
						callback(index);

						Modal.renderComponent(null);
					}
				)}
			>
				<View style={[ styles.menuItem, index === 0 ? styles.menuItemFirst : null ]}>
					<AppText style={styles.menuItemText}>{item}</AppText>
				</View>
			</TouchFeedback>
		)
	));
};

Modal.showActionSheetWithItems = (items, callback) => {
	const options = [];
	const actions = [];

	for (const k in items) {
		options.push(k);
		actions.push(items[k]);
	}

	Modal.showActionSheetWithOptions({ options }, index => actions[index](), callback);
};
