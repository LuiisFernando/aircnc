import React from 'react';
import { YellowBox } from 'react-native';
import 'react-native-gesture-handler';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

import Routes from './src/routes';

export default function App() {
  return <Routes />
}
