import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { getListData, getMoreData } from './actions';
import ImageComponent from "./components/ImageComponent";
import SearchComponent from "./components/SearchComponent";
class MyGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            numColumns: 2
        };
    }
    componentDidMount = () => {
        //this.props.getListData('cat')
    };
    handleLoadMore = () => {
        if (this.props.listData.length < this.props.total_count) {
            this.props.getMoreData()
        }
    };
    renderFooter = () => {
        return (
            <View
                style={{
                    paddingVertical: 10,
                    height: 50,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating={this.props.listData.length < this.props.total_count} size="large" />
            </View>
        );
    };
    handleRefresh = () => {
        this.setState(
            {
                refreshing: false
            },
            () => {
                this.props.getListData(this.props.searchText);

            }
        );
    };
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 0,
                }}
            />
        );
    };
    render() {
        return (
            <View style={{ flex: 1, paddingTop: 10, backgroundColor: '#d4d4d4' }}>
                <SearchComponent onSearch={t => this.props.getListData(t)} />
                <Text style={{ padding: 10 }}>No of column in Grid</Text>
                <TextInput
                    placeholder="Enter number of column"
                    style={{
                        borderRadius: 5,
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        height: 40,
                        borderColor: "#d4d4d4",
                        margin: 10
                    }}
                    value={this.state.numColumns ? String(this.state.numColumns) : ""}
                    onChangeText={t => this.setState(() => ({ numColumns: Number(t) }))}
                    clearButtonMode="never"
                />
                {this.props.loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
                    : <FlatList
                        data={this.props.listData}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <ImageComponent numColumns={this.state.numColumns || 1} imageURI={item.assets.huge_thumb.url} />
                            </View>
                        )}
                        key={this.state.numColumns || 1}
                        removeClippedSubviews
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        numColumns={this.state.numColumns || 1}
                        keyExtractor={item => item.id + Math.random(100)}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0.5}
                    />
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        margin: 4,
        borderRadius: 5,
        flex: 1,
        overflow: 'hidden',
        borderColor: 'lightgray',
        elevation: 2,
        borderWidth: 1
    }
})

const mapStateToProps = state => ({
    listData: state.reducer.listData,
    page: state.reducer.page,
    searchText: state.reducer.searchText,
    loading: state.reducer.loading,
    total_count: state.reducer.total_count

});

const mapDispatchToProps = dispatch => ({
    getListData: data => dispatch(getListData(data)),
    getMoreData: () => dispatch(getMoreData())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps)(MyGrid)
