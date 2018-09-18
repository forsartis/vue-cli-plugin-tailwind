const isHotReloaded = process.argv.includes('serve');
const postcss = require('postcss');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

let config = {
  content: ['./public/index.html', './src/**/*.vue'],
  extractors: [
    {
      extractor: TailwindExtractor,
      extensions: ['html', 'vue'],
    },
  ],
};

module.exports = postcss.plugin('tailwind-purgecss', function(opts) {
  if (isHotReloaded) return () => {};
  const purgecss = require('@fullhuman/postcss-purgecss');
  return purgecss(Object.assign(config, opts));
});
