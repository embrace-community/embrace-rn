module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module:react-native-dotenv',
        {
          moduleName: 'react-native-dotenv',
          verbose: false,
        },
      ],

      // Makes crypto functions quicker but requires native code i.e. will not work with Expo
      // [
      //   'module-resolver',
      //   {
      //     alias: {
      //       crypto: 'react-native-quick-crypto',
      //       stream: 'stream-browserify',
      //       buffer: '@craftzdog/react-native-buffer',
      //     },
      //   },
      // ],
    ],
  };
};
