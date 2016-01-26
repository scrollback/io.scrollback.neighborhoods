import React from "react-native";
import AppTextInput from "./AppTextInput";

export default class GrowingTextInput extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func,
		initialHeight: React.PropTypes.number.isRequired,
		maxHeight: React.PropTypes.number,
		style: AppTextInput.propTypes.style
	};

	constructor(props) {
		super(props);

		this.state = {
			height: this.props.initialHeight
		};
	}

	_handleChange = e => {
		this.setState({
			height: e.nativeEvent.contentSize.height
		});

		if (this.props.onChange) {
			this.props.onChange(e);
		}
	};

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	focus(...args) {
		this._root.focus(...args);
	}

	blur(...args) {
		this._root.blur(...args);
	}

	focusKeyboard() {
		// Need to blur first to trigger showing keyboard
		this._root.blur();

		// Add a timeout so that blur() and focus() are not batched at the same time
		setTimeout(() => this._root.focus(), 50);
	}

	render() {
		const { maxHeight } = this.props;
		const { height } = this.state;

		return (
			<AppTextInput
				{...this.props}
				ref={c => this._root = c}
				onChange={this._handleChange}
				style={[ this.props.style, { height: maxHeight ? Math.min(maxHeight, height) : height } ]}
				multiline
			/>
		);
	}
}
