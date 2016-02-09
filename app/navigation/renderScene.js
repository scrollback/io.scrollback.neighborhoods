/* @flow */

import React from 'react-native';
import routeMapper from '../routes/routeMapper';
import Colors from '../../Colors.json';

const {
	NavigationCard,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	scene: {
		backgroundColor: Colors.lightGrey
	},

	container: {
		flex: 1,
	},

	normal: {
		marginTop: 56
	}
});

const renderScene = function(navState: Object, onNavigation: Function): Function {
	return props => {
		const route = props.sceneRecord.get('route'); // eslint-disable-line react/prop-types

		const {
			component: RouteComponent
		} = routeMapper(route);

		return (
			<NavigationCard {...props}>
				<View style={[ styles.container, styles.scene, route.fullscreen ? null : styles.normal ]}>
					<RouteComponent {...route.props} style={[ styles.container, route.props ? route.props.style : null ]} onNavigation={onNavigation} />
				</View>
			</NavigationCard>
		);
	};
};

export default renderScene;
