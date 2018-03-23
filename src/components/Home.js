// created by M N Hidayat
// <Coding with love>
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Button
} from 'react-native';
import Images from '@assets/imgs';

class Home extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={Images.tokopediaLogo} style={styles.img} />
                <Button title="Go to news" onPress={() => this.props.navigation.navigate('News')} />
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width:  300,
        resizeMode: 'contain'
    }
}

export default Home;
