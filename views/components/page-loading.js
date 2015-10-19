import React from "react-native";
import LoadingItem from "./loading-item";
import Page from "./page";

export default class PageLoading extends React.Component {
	render() {
		return (
			<Page {...this.props}>
				<LoadingItem />
			</Page>
		);
	}
}
