import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform
} from "react-native";

export default class ImageComponent extends PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.imageHolder}>
        <Image source={{ uri: this.props.imageURI }} style={styles.image} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },

  imageHolder: {
    margin: 5,
    height: 160,
    flex: 1,
    position: "relative"
  },

  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover"
  },

  textViewHolder: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 13,
    alignItems: "center"
  },

  textOnImage: {
    color: "white"
  }
});
