const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, '..');

const nodeModulesRoot = fs.existsSync(path.resolve(projectRoot, 'node_modules/react'))
  ? path.resolve(projectRoot, 'node_modules')
  : path.resolve(monorepoRoot, 'node_modules');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: {
      'react': path.resolve(nodeModulesRoot, 'react'),
      'react-native': path.resolve(nodeModulesRoot, 'react-native'),
    },
    resolveRequest: (context, moduleName, platform) => {
      const isProjectDep =
        moduleName === 'react' ||
        moduleName.startsWith('react/') ||
        moduleName === 'react-native' ||
        moduleName.startsWith('react-native/') ||
        moduleName === '@react-native-async-storage/async-storage' ||
        moduleName.startsWith('@react-native-async-storage/') ||
        moduleName === 'react-native-safe-area-context' ||
        moduleName.startsWith('react-native-safe-area-context/') ||
        moduleName === 'react-native-screens' ||
        moduleName.startsWith('react-native-screens/');

      if (isProjectDep) {
        return context.resolveRequest(
          context,
          path.resolve(nodeModulesRoot, moduleName),
          platform
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    // Block Android Gradle build cache & outputs from file watching
    blockList: [
      /.*[/\\]android[/\\]\.gradle[/\\].*/,
      /.*[/\\]android[/\\]build[/\\].*/,
      /.*[/\\]\.gradle[/\\].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
