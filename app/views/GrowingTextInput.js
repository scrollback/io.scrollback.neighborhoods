import React from "react-native";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";

const {
	StyleSheet,
	View,
} = React;

const styles = StyleSheet.create({
	phantom: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		opacity: 0,
	}
});

export default class GrowingTextInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value || this.props.defaultValue
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.value
		});
	}

	_handleChange = e => {
		if (this.props.onChange) {
			this.props.onChange(e);
		}

		const value = e.nativeEvent.text;

		if (this.props.onValueChange) {
			this.props.onValueChange(value);
		}

		this.setState({ value });
	};

	_handleLayout = e => {
		this._input.setNativeProps({ height: e.nativeEvent.layout.height });
	};

	focus = (...args) => {
		this._input.focus(...args);
	};

	blur = (...args) => {
		this._input.blur(...args);
	};

	focusKeyboard = () => {
		// Need to blur first to trigger showing keyboard
		this._input.blur();

		// Add a timeout so that blur() and focus() are not batched at the same time
		setTimeout(() => this._input.focus(), 50);
	};

	render() {
		return (
			<View style={this.props.style}>
				<AppText
					numberOfLines={this.props.numberOfLines}
					style={[ this.props.inputStyle, styles.phantom ]}
					onLayout={this._handleLayout}
					pointerEvents="none"
				>
					{(this.state.value || this.props.placeholder) + "\n"}
				</AppText>
				<AppTextInput
					{...this.props}
					ref={c => this._input = c}
					value={this.state.value}
					onChange={this._handleChange}
					style={this.props.inputStyle}
					multiline
				/>
			</View>
		);
	}
}

GrowingTextInput.propTypes = {
	value: React.PropTypes.string,
	defaultValue: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	numberOfLines: React.PropTypes.number,
	onChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	inputStyle: AppTextInput.propTypes.style,
	style: View.propTypes.style,
};
