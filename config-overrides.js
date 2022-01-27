const rawLoaderRule = {
  test: /\.bpmn$/i,
  use: [
    {
      loader: 'raw-loader',
      options: {
        esModule: false,
      },
    },
  ]
};

module.exports = function (config) {
//  config.module.rules.unshift(rawLoaderRule);

  return config;
};

