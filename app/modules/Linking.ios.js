import React from 'react-native';

const { LinkingIOS } = React;

const Linking = Object.create(LinkingIOS);

Linking.getInitialURl = (cb) => cb(LinkingIOS.popInitialURL);

export default LinkingIOS;
