import React from "react-native";

const {
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	TouchableHighlight,
	Animated,
	PixelRatio,
	View,
	Text
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
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, .6)"
	},
	dialog: {
		backgroundColor: "#fff",
		borderRadius: 3
	},
	menuItem: {
		borderColor: "rgba(0, 0, 0, .08)",
		borderTopWidth: 1 / PixelRatio.get(),
		padding: 16,
		width: 240
	},
	menuItemFirst: {
		borderTopWidth: 0
	},
	menuItemText: {
		fontSize: 16,
		color: "#333",
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
		if (component) {
			this.setState({
				component,
				fadeAnim: new Animated.Value(0)
			}, () => Animated.timing(this.state.fadeAnim, {
				toValue: 1,
				duration: 300
			}).start());
		} else {
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

		const win = Dimensions.get("window");

		return (
			<Animated.View style={[ styles.container, { height: win.height, width: win.width, opacity: this.state.fadeAnim } ]}>
				{this.state.component}
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
				<View style={styles.dialog}>
					{component}
				</View>
			</View>
		</TouchableWithoutFeedback>
	));
};

Modal.showActionSheetWithOptions = (options, callback) => {
	return Modal.renderModal(options.options.map((item, index) =>
		(
			<TouchableHighlight
				key={index}
				underlayColor="rgba(0, 0, 0, .16)"
				onPress={() =>
					global.requestAnimationFrame(() => {
						callback(index);

						Modal.renderComponent(null);
					}
				)}
			>
				<View style={[ styles.menuItem, index === 0 ? styles.menuItemFirst : null ]}>
					<Text style={styles.menuItemText}>{item}</Text>
				</View>
			</TouchableHighlight>
		)
	));
};
