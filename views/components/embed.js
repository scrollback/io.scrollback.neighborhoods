import React from "react-native";
import link from "./link";
import Linking from "../../modules/linking";
import Colors from "../../colors.json";
import Icon from "./icon";
import Loading from "./loading";
import preview from "../../lib/preview";
import EmbedImage from "./embedimage";
import EmbedVideo from "./embedvideo";
import EmbedTitle from "./embedtitle";
import EmbedSummary from "./embedsummary"

const {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableHighlight
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
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
			url:"",
			embed:null
		};
	}


	_parseUrl(){
		const text = this.props.text;
		const word = text.split(" ");
		var uri;
		for(var index in word){
			uri = link.buildLink(word[index]);
			if(uri){
				if(/^https?:\/\//i.test(uri)){
					return uri;
				}
			}
		}
	}

	_onPress(){
		console.log(this.state.url);
		Linking.openURL(this.state.url);
	}

	shouldComponentUpdate(nextProps, nextState){
		return (
			this.state.embed !== nextState.embed ||
			this.state.url !== nextState.url
		);
	}

	componentDidMount(){
		this._mounted = true;
		this._fetchEmbedData();
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async _fetchEmbedData(){
		const url = await this._parseUrl();
		const embed = await preview(url);
		if(this._mounted){
			this.setState({
				url,
				embed
			});
		}
	}

	render(){
		const {url, embed} = this.state;
		return (
			<View>
				{embed ?
					(<View>
						<EmbedVideo embed={embed} />
						<EmbedImage embed={embed} />
						<EmbedTitle embed={embed} />
						<EmbedSummary embed={embed} />
					</View>)

					:(<View style={styles.overlay}>
						<Loading style={styles.progress} />
					</View>)
			 	}
			</View>
		);
	}
}

