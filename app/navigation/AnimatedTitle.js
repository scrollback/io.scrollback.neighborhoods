/* @flow */

import React from "react-native";

const {
	Animated
} = React;

type Props = {
	position: Object,
	index: number,
	children: ReactElement
}

const AnimatedTitle = (props: Props): ReactElement => {
	const {
		position,
		index,
		children
	} = props;

	return (
		<Animated.View
			style={[
				{
					opacity: position.interpolate({
						inputRange: [ index - 1, index, index + 1 ],
						outputRange: [ 0, 1, 0 ],
					}),
					left: position.interpolate({
						inputRange: [ index - 1, index + 1 ],
						outputRange: [ 200, -200 ],
					}),
					right: position.interpolate({
						inputRange: [ index - 1, index + 1 ],
						outputRange: [ -200, 200 ],
					}),
				},
			]}
		>
			{children}
		</Animated.View>
	);
};

AnimatedTitle.propTypes = {
	position: React.PropTypes.object.isRequired,
	index: React.PropTypes.number.isRequired,
	children: React.PropTypes.element
};

export default AnimatedTitle;
