import React from "react-native";
import InvertibleScrollView from "react-native-invertible-scroll-view";
import ChatItem from "./chat-item";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";

const {
    ListView,
    View
} = React;

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    componentDidMount() {
        if (this._scroll) {
            this._scroll.scrollTo(0);
        }
    }

    _getDataSource() {
        return this.dataSource.cloneWithRows(this.props.data);
    }

    render() {
        const dataSource = this._getDataSource();

        return (
            <View {...this.props}>
                {(() => {
                    if (this.props.data.length) {
                        return (
                            <ListView
                                renderScrollComponent={props =>
                                    <InvertibleScrollView
                                        {...props}
                                        inverted
                                        ref={c => this._scroll = c}
                                    />
                                }
                                dataSource={dataSource}
                                renderRow={(text, sectionID, rowID) => {
                                    let previousText;

                                    if (rowID > 0) {
                                        previousText = dataSource.getRowData(0, rowID - 1);
                                    }

                                    return (
                                        <ChatItem
                                            key={text.id}
                                            text={text}
                                            previousText={previousText}
                                        />
                                    );
                                }}
                            />
                        );
                    } else if (this.props.failed) {
                        return <PageRetry onRetry={this.props.onRetry} />;
                    } else {
                        return <PageLoading />;
                    }
                })()}
            </View>
        );
    }
}

Chat.propTypes = {
    failed: React.PropTypes.bool,
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
    })).isRequired,
    onRetry: React.PropTypes.func
};
