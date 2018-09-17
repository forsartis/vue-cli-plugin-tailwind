const path = require('path');
const glob = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = new PurgecssPlugin({
  paths: glob.sync([
    path.join(process.cwd(), 'public/index.html'),
    path.join(process.cwd(), 'src/**/*.vue'),
  ]),
  extractors: [
    {
      extractor: TailwindExtractor,
      extensions: ['html', 'js', 'vue'],
    },
  ],
});
