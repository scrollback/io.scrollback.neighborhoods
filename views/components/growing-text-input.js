import React from "react-native";

const {
	StyleSheet,
	View,
	Text,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		position: "relative"
	},
	phantom: {
		position: "absolute",
		top: 0,
		left: 0,
		opacity: 0,
		paddingHorizontal: 4,
		paddingVertical: 16
	}
});

export default class GrowingTextInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.defaultValue
		};
	}

	_onChange(e) {
		if (this.props.onChange) {
			this.props.onChange(e);
		}

		this.setState({ value: e.nativeEvent.text });
	}

	_onLayout(e) {
		this.input.setNativeProps({ height: e.nativeEvent.layout.height });
	}

	focus(...args) {
		this.input.focus(...args);
	}

	get value() {
		return this.state.value;
	}

	set value(value) {
		this.setState({
			value
		});
	}

	render() {
		return (
			<View style={[ styles.container, this.props.style ]}>
				<Text
					numberOfLines={this.props.numberOfLines}
					style={[ this.props.style, styles.phantom ]}
					onLayout={this._onLayout.bind(this)}
					pointerEvents="none"
				>
					{(this.state.value || this.props.placeholder) + "\n"}
				</Text>
				<TextInput
					{...this.props}
					ref={c => this.input = c}
					value={this.state.value}
					onChange={this._onChange.bind(this)}
					style={this.props.inputStyle}
					multiline
				/>
			</View>
		);
	}
}

GrowingTextInput.propTypes = {
	defaultValue: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	numberOfLines: React.PropTypes.number,
	onChange: React.PropTypes.func,
	inputStyle: React.PropTypes.any
};
