import React from "react-native";
import link from "./link";
import Loading from "./loading";
import { fetchData } from "../../oembed/oembed";
import EmbedVideo from "./embed-video";
import EmbedTitle from "./embed-title";
import EmbedSummary from "./embed-summary";
import oembedPri from "../../oembed/oembedPri";

const {
	StyleSheet,
	InteractionManager,
	View
} = React;

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	progress: {
		height: 24,
		width: 24
	}
});


export default class Embed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url: "",
			embed: "loading"
		};
	}

	componentDidMount() {
		this._mounted = true;
		this._fetchEmbedData();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.state.embed !== nextState.embed
		);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_parseUrl() {
		const text = this.props.text.replace(/(\r\n|\n|\r)/g, " ");

		const words = text.split(" ");
		let uri;

		for (let i = 0, l = words.length; i < l; i++) {
			uri = link.buildLink(words[i].replace(/[\.,\?!:;]+$/, ""));
			if (/^https?:\/\//i.test(uri)) {
				return uri;
			}
		}
	}

	_fetchEmbedData() {
		InteractionManager.runAfterInteractions(async () => {
			try {
				let embed;

				const url = await this._parseUrl();

				const endpoint = oembedPri(url);

				if (endpoint) {
					embed = await (await fetch(endpoint)).json();
				} else {
					embed = await fetchData(url);
				}

				if (this._mounted && embed) {
					this.setState({
						url,
						embed
					});
				}
			} catch (e) {
				this.setState({
					embed: null
				});
			}
		});
	}


	render() {
		const { url, embed } = this.state;

		return (
			<View {...this.props}>
				{embed !== "loading" ?
					(
						<View>{embed ?
							(
								<View>
									{this.props.showTitle ?
										(
											<View>
												<EmbedVideo
													embed={embed}
													style={this.props.thumbnailStyle}
													url={url}
												/>
												<EmbedTitle embed={embed} />
												<EmbedSummary embed={embed} />
											</View>
										) :
										(
											<View>
												{embed.thumbnail_url ?
													<EmbedVideo
														embed={embed}
														style={this.props.thumbnailStyle}
														url={url}
													/> :
													(<View><EmbedTitle embed={embed} />
													<EmbedSummary embed={embed} /></View>)
												}
											</View>
										)
									}
								</View>
							) :
							null
							}
						</View>
					) :
					(
						<View style={styles.overlay}>
							<Loading style={styles.progress} />
						</View>
					)
				}
			</View>
		);
	}
}


Embed.propTypes = {
	text: React.PropTypes.string.isRequired,
	showTitle: React.PropTypes.bool.isRequired
};
