const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

// Add Node.js polyfills for React Native - especially important for Anchor
config.resolver.alias = {
  ...config.resolver.alias,
  assert: require.resolve('assert'),
  buffer: require.resolve('buffer'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util'),
  path: require.resolve('path-browserify'),
  process: require.resolve('process/browser'),
  events: require.resolve('events'),
  // Additional polyfills for Anchor v0.28.0 compatibility
  url: require.resolve('url'),
  zlib: require.resolve('browserify-zlib'),
  https: require.resolve('https-browserify'),
  http: require.resolve('stream-http'),
  os: require.resolve('os-browserify/browser'),
}

// Ensure these modules are resolved - critical for Anchor
config.resolver.fallback = {
  ...config.resolver.fallback,
  assert: require.resolve('assert'),
  buffer: require.resolve('buffer'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util'),
  path: require.resolve('path-browserify'),
  process: require.resolve('process/browser'),
  events: require.resolve('events'),
  // Additional fallbacks for Anchor
  url: require.resolve('url'),
  zlib: require.resolve('browserify-zlib'),
  https: require.resolve('https-browserify'),
  http: require.resolve('stream-http'),
  os: require.resolve('os-browserify/browser'),
  fs: false,
  net: false,
  tls: false,
}
 
module.exports = withNativeWind(config, { input: './global.css' })