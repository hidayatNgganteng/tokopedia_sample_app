// created by M N Hidayat
// <Coding with love>
import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableHighlight,
  Dimensions,
  AsyncStorage
} from 'react-native';
import Images from '@assets/imgs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';

let API_KEY = '7d117b9658b24271ac305f01e31787ee';
let WIDTH_SCREEN = Dimensions.get('window').width;

class News extends Component {
    constructor(props){
        super(props);
        this.state = {
            newsList: [],
            page: 1,
            headlineList: [],
            pageHeadline: 1,
            wishlist: [],
            loader: false
        }
    }

    componentDidMount(){
        this.getNews();
        this.getHeadline();

        // set wishlist from localStoraage
        AsyncStorage.getItem('wishlist')
            .then(req => JSON.parse(req))
            .then(json => this.setState({wishlist: json}))
            .catch(error => console.log('error!'));
    }

    // fetching data
    fetchData(url){
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        this.setState({loader: true});
        return fetch(url, options)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({loader: false});
            return responseJson
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // getNews
    getNews(){
        let url = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${API_KEY}&pageSize=10&page=${this.state.page}`;
        this.fetchData(url).then((news) => {
            this.setState(state => ({
                newsList: [...state.newsList, ...news.articles]
            }))
        });
    }

    // getHeadline
    getHeadline(){
        let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&pageSize=5&page=${this.state.pageHeadline}`
        this.fetchData(url).then((news) => {
            this.setState(state => ({
                headlineList: [...state.headlineList, ...news.articles]
            }))
        });
    }

    // nextNews
    nextNews(){
        this.setState(state => ({
            page: state.page + 1,
            pageHeadline: state.pageHeadline + 1
        }), () => {
                this.getNews();
                this.getHeadline();
            }
        );
    }

    // goWishlist
    goWishlist(key){
        if(this.state.wishlist){
            // filter current data
            let flag = false;
            this.state.wishlist.filter(item => item.key == key ? flag = true : '');

            let arr = [];
            // if data already exist
            if(flag){
                this.state.wishlist.filter(item => item.key != key && arr.push(item));
            }else{
                arr = this.state.wishlist;
                arr.push({key: key});
            }

            this.setState({wishlist: arr}, () => {
                AsyncStorage.setItem('wishlist', JSON.stringify(this.state.wishlist)); // saving local
            });
        }else{
            obj = {key: key}
            this.setState({wishlist: [obj]}, () => {
                AsyncStorage.setItem('wishlist', JSON.stringify(this.state.wishlist)); // saving local
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.newsList}
                    keyExtractor={(item, i) => i.toString()}
                    onEndReached={() => this.nextNews()}
                    onEndReachedThreshold={1}
                    extraData={this.state.wishlist}
                    renderItem={({item, index}) =>
                        <View>
                            <View style={styles.containerList}>
                                <TouchableHighlight underlayColor={'transparent'} onPress={() => this.props.navigation.navigate('Details', {url: item.url})}>
                                    <View style={styles.grid}>
                                        {
                                            item.urlToImage != null
                                                ? <Image source={{uri: item.urlToImage}} style={styles.img} />
                                                : <Image source={Images.imgNotAvailable} style={styles.img} />
                                            
                                        }
                                        <View style={styles.boxInfo}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <TouchableHighlight style={styles.boxIcon} underlayColor={'transparent'} onPress={() => this.goWishlist(`${item.title}${item.publishedAt}`)}>
                                                {
                                                    
                                                    (this.state.wishlist && (this.state.wishlist.filter(wishlist => wishlist.key == `${item.title}${item.publishedAt}`).length ? true : false))
                                                        ?   <Icon name="heart" style={[styles.icon, {color: '#E91E63'}]} />
                                                        :   <Icon name="heart" style={[styles.icon, {color: '#A1887F'}]} />
                                                }
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            {/* here is the pattern for the middle of the headline position && pattern 5 headlineNews perPage */}
                            {(index + 6) % 10 == 0 && <View style={styles.titleHeadline}><Text style={styles.textHeadline}>Headline News</Text></View>} 

                            {
                                (index + 6) % 10 == 0 && (
                                    <FlatList
                                        data={this.state.headlineList.filter((item, i) => i >= (index + 6) / 2 - 1 - 4 && i <= (index + 6) / 2 -1)}
                                        keyExtractor={(item, i) => i.toString()}
                                        horizontal={true}
                                        style={styles.listHeadline}
                                        extraData={this.state.wishlist}
                                        renderItem={({item, index}) =>
                                            <View style={styles.containerList}>
                                                <TouchableHighlight underlayColor={'transparent'} onPress={() => this.props.navigation.navigate('Details', {url: item.url})}>
                                                    <View style={[styles.grid, {marginTop: 10}]}>
                                                        {
                                                            item.urlToImage != null
                                                                ? <Image source={{uri: item.urlToImage}} style={styles.img} />
                                                                : <Image source={Images.imgNotAvailable} style={styles.img} />
                                                            
                                                        }
                                                        <View style={styles.boxInfo}>
                                                            <Text style={styles.title}>{item.title}</Text>
                                                            <TouchableHighlight style={styles.boxIcon} underlayColor={'transparent'} onPress={() => this.goWishlist(`${item.title}${item.publishedAt}`)}>
                                                                {
                                                    
                                                                    (this.state.wishlist && (this.state.wishlist.filter(wishlist => wishlist.key == `${item.title}${item.publishedAt}`).length ? true : false))
                                                                        ?   <Icon name="heart" style={[styles.icon, {color: '#E91E63'}]} />
                                                                        :   <Icon name="heart" style={[styles.icon, {color: '#A1887F'}]} />
                                                                }
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        }
                                    />
                                )
                            }
                        </View>
                    }
                />

                <Spinner visible={this.state.loader} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
            </View>
        );
    }
}

const styles = {
    container: {
        paddingBottom: 20
    },
    containerList: {
        paddingHorizontal: 10,
        width: WIDTH_SCREEN
    },
    grid: {
        marginTop: 20,
        backgroundColor: '#F5F5F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    img: {
        width: '100%',
        height: 200,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '80%'
    },
    boxInfo: {
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'space-between',
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 15
    },
    boxIcon: {
        justifyContent: 'center'
    },
    icon: {
        fontSize: 28
    },
    titleHeadline: {
        alignItems: 'flex-end',
        paddingTop: 15,
        paddingBottom: 10,
        paddingHorizontal: 10,
        marginTop: 20,
        backgroundColor: '#FFEBEE'
    },
    textHeadline: {
        fontSize: 20,
        fontWeight: 'bold',

    },
    listHeadline: {
        paddingBottom: 10
    }
}

export default News;
