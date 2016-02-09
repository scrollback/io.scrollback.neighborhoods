import React from 'react-native';
import Colors from '../../Colors.json';

const {
	StyleSheet,
	View,
	PixelRatio
} = React;

const styles = StyleSheet.create({
	card: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		marginVertical: 4
	}
});

export default class Card extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return (
			<View
				{...this.props}
				style={[ styles.card, this.props.style ]}
				ref={c => this._root = c}
			>
				{this.props.children}
			</View>
		);
	}
}

Card.propTypes = {
	children: React.PropTypes.node
};
