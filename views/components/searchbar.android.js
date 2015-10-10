import React from "react-native";
import Icon from "./icon";

const {
	StyleSheet,
	TouchableHighlight,
	PixelRatio,
	TextInput,
	View
} = React;

const styles = StyleSheet.create({
	searchbar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .24)",
		borderBottomWidth: 1 / PixelRatio.get(),
		height: 56,
		marginTop: 25
	},
	input: {
		flex: 1,
		fontSize: 16,
		fontWeight: "bold",
		color: "#000",
		backgroundColor: "transparent"
	},
	iconContainer: {
		marginHorizontal: 4,
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		color: "#000",
		fontSize: 24,
		opacity: 0.5,
		margin: 16
	}
});

export default class SearchBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputText: "",
			showClear: false
		};
	}

	_onChange(e) {
		const text = e.nativeEvent.text;

		if (text) {
			if (!this.state.showClear) {
				this.setState({
					showClear: true
				});
			}
		} else {
			if (this.state.showClear) {
				this.setState({
					showClear: false
				});
			}
		}

		this.props.onSearchChange(text);
	}

	_clearInput() {
		if (this._input) {
			this._input.setNativeProps({ text: "" });
		}

		this.setState({
			showClear: false
		});

		this.props.onSearchChange("");
	}

	render() {
		return (
			<View {...this.props} style={[ styles.searchbar, this.props.style ]}>
				<TouchableHighlight onPress={() => global.requestAnimationFrame(this.props.onBack)} underlayColor="rgba(0, 0, 0, .16)">
					<View style={styles.iconContainer}>
						<Icon name="arrow-back" style={styles.icon} />
					</View>
				</TouchableHighlight>

				<TextInput
					ref={c => this._input = c}
					autoFocus={this.props.autoFocus}
					onChange={this._onChange.bind(this)}
					placeholder={this.props.placeholder}
					placeholderTextColor="rgba(0, 0, 0, 0.5)"
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
					style={styles.input}
				/>

				{this.state.showClear ?
					<TouchableHighlight onPress={this._clearInput.bind(this)} underlayColor="rgba(0, 0, 0, .16)">
						<View style={styles.iconContainer}>
							<Icon name="close" style={styles.icon} />
						</View>
					</TouchableHighlight> :
					null
				}
			</View>
		);
	}
}

SearchBar.propTypes = {
	onBack: React.PropTypes.func.isRequired,
	onSearchChange: React.PropTypes.func.isRequired,
	onFocus: React.PropTypes.func,
	onBlur: React.PropTypes.func,
	placeholder: React.PropTypes.string,
	autoFocus: React.PropTypes.bool
};
