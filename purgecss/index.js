const postcss = require('postcss');

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

let config = {
  content: ['./public/**/*.html', './src/**/*.vue'],
  extractors: [
    {
      extractor: TailwindExtractor,
      extensions: ['html', 'vue'],
    },
  ],
};

module.exports = postcss.plugin('tailwind-purgecss', function(opts) {
  if (process.env.NODE_ENV !== 'production') return () => {};
  const purgecss = require('@fullhuman/postcss-purgecss');
  return purgecss(Object.assign(config, opts));
});
