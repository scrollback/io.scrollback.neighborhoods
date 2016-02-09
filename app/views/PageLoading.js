import React from 'react-native';
import LoadingItem from './LoadingItem';
import Page from './Page';

export default class PageLoading extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<Page {...this.props}>
				<LoadingItem />
			</Page>
		);
	}
}
