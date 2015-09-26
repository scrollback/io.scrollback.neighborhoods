import React from "react-native";
import InvertibleScrollView from "react-native-invertible-scroll-view";
import ChatItem from "./chat-item";
import PageEmpty from "./page-empty";
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
                    if (this.props.data.length === 0) {
                        return <PageEmpty />;
                    }

                    if (this.props.data.length === 1) {
                        if (this.props.data[0] === "LOADING") {
                            return <PageLoading />;
                        }

                        if (this.props.data[0] === "FAILED") {
                            return <PageRetry onRetry={this.props.refreshData} />;
                        }
                    }

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
                })()}
            </View>
        );
    }
}

Chat.propTypes = {
    data: React.PropTypes.array.isRequired,
    refreshData: React.PropTypes.func
};
