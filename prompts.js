const fs = require('fs');

module.exports = [
  {
    type: 'list',
    name: 'initConfig',
    message: 'Generate tailwind.config.js',
    choices: [
      { name: 'none', value: false },
      { name: 'minimal', value: 'minimal' },
      { name: 'full', value: 'full' },
    ],
    default: 1,
  },
  {
    name: 'replaceConfig',
    type: 'confirm',
    message: 'tailwind.config.js already exists! Do you want to replace it?',
    default: false,
    when: answers => {
      return answers.initConfig && fs.existsSync('./tailwind.config.js');
    },
  },
];
