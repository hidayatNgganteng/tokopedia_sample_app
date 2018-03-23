// created by M N Hidayat
// <Coding with love>
import React, { Component } from 'react';
import {
    WebView
} from 'react-native';
import Images from '@assets/imgs';

class Details extends Component {
    render() {
        const { params } = this.props.navigation.state;
        const url = params ? params.url : null;

        return (
            <WebView
                source={{uri: url}}
            />
        );
    }
}

export default Details;
