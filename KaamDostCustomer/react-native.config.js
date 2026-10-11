module.exports = {
  commands: [
    require('@react-native/community-cli-plugin').startCommand,
    require('@react-native/community-cli-plugin').bundleCommand,
    ...require('@react-native-community/cli-platform-android').commands,
  ],
};
