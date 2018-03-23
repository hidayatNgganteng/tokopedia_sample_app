import { StackNavigator } from 'react-navigation';
import Home from './src/components/Home';
import News from './src/components/News';
import Details from './src/components/Details';

export default StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    }
  },
  News: {
    screen: News,
    navigationOptions: {
      title: 'News',
    }
  },
  Details: {
    screen: Details,
    navigationOptions: {
      title: 'Details',
    }
  }
});