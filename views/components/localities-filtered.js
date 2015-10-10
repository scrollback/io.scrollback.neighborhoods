import React from "react-native";
import LocalitiesBase from "./localities-base";
import SearchBar from "./searchbar";

const {
	StyleSheet,
	View,
	DeviceEventEmitter
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#eee"
	},
	inner: {
		flex: 1
	}
});

export default class LocalitiesFiltered extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			keyboardHeight: 0
		};
	}

	componentWillMount() {
		this._keyboardWillShowSubscription = DeviceEventEmitter.addListener("keyboardDidShow", e => this._keyboardDidShow(e));
		this._keyboardWillHideSubscription = DeviceEventEmitter.addListener("keyboardDidHide", e => this._keyboardDidHide(e));
	}

	componentWillUnmount() {
		this._keyboardWillShowSubscription.remove();
		this._keyboardWillHideSubscription.remove();
	}

	_keyboardDidShow(e) {
		this.setState({
			keyboardHeight: e.endCoordinates.height
		});
	}

	_keyboardDidHide() {
		this.setState({
			keyboardHeight: 0
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<SearchBar
					placeholder="Type a name..."
					onBack={this.props.dismiss}
					onSearchChange={this.props.onSearchChange}
					autoFocus
				/>
				<LocalitiesBase {...this.props} style={[ styles.inner, this.props.style ]} />
				<View style={{ height: this.state.keyboardHeight }} />
			</View>
		);
	}
}

LocalitiesFiltered.propTypes = {
	dismiss: React.PropTypes.func.isRequired,
	onSearchChange: React.PropTypes.func.isRequired
};
