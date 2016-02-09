import React from 'react-native';
import AppText from './AppText';

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	summary: {
		fontSize: 12,
		lineHeight: 18
	}
});

export default class EmbedSummary extends React.Component {
	render() {
		if (this.props.embed.description) {
			return (
				<AppText
					numberOfLines={2}
					{...this.props}
					style={[ styles.summary, this.props.style ]}
				>
					{this.props.embed.description}
				</AppText>
			);
		} else {
			return null;
		}
	}
}

EmbedSummary.propTypes = {
	embed: React.PropTypes.object.isRequired
};
