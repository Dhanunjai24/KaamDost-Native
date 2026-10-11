const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, '..');

const resolveNodeModule = (moduleName) => {
  const localPath = path.resolve(projectRoot, 'node_modules', moduleName);
  if (fs.existsSync(localPath)) return localPath;
  const rootPath = path.resolve(monorepoRoot, 'node_modules', moduleName);
  if (fs.existsSync(rootPath)) return rootPath;
  return localPath;
};

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: new Proxy({}, {
      get: (target, name) => resolveNodeModule(name),
    }),
    blockList: [
      /.*[/\\]android[/\\]\.gradle[/\\].*/,
      /.*[/\\]android[/\\]build[/\\].*/,
      /.*[/\\]\.gradle[/\\].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
