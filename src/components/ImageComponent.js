import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";
const { width } = Dimensions.get('window');
export default class ImageComponent extends PureComponent {
  constructor() {
    super();
  }

  render() {
    let imagePerRow = this.props.numColumns || 1;
    let getImageStyle = () => {
      let size = width / imagePerRow;
      return { width: size, height: size }
    }
    return (
      <View style={[styles.container, getImageStyle()]}>
        <Image resizeMode="cover" source={{ uri: this.props.imageURI }} style={getImageStyle()} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },

});
