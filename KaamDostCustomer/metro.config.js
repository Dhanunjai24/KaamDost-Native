const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const sharedRoot = path.resolve(__dirname, '../shared');

const config = {
  watchFolders: [sharedRoot],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
