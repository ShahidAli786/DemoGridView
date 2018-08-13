import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
export default class SearchComponent extends Component {
  state = {
    searchText: ""
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            value={this.state.searchText}
            onChangeText={t => this.setState({ searchText: t })}
            placeholder="Type here to search"
            style={styles.textInput}
          />
        </View>
        <View style={styles.btnView}>
          <TouchableOpacity
            disabled={this.state.searchText.length == 0}
            onPress={() => this.props.onSearch(this.state.searchText)}
            style={styles.to}
          >
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row"
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d4d4d4"
  },
  inputView: {
    flex: 8,
    padding: 10
  },
  btnView: {
    flex: 2,
    padding: 10
  },
  btnText: {
    color: "#fff"
  },
  to: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#63b342",
    borderRadius: 4
  }
});
