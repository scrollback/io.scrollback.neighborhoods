import React from 'react-native';

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	text: {
		fontFamily: 'Lato',
		fontSize: 14,
		lineHeight: 21
	}
});

export default class AppText extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return (
			<Text
				{...this.props}
				style={[ styles.text, this.props.style ]}
				ref={c => this._root = c}
			>
				{this.props.children}
			</Text>
		);
	}
}

AppText.propTypes = {
	children: React.PropTypes.node.isRequired,
	style: Text.propTypes.style
};
