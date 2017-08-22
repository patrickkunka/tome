require('source-map-support').install();

require('babel-register');

require('../src/Editor.test.js');
require('../src/TreeBuilder.test.js');
require('../src/Util.test.js');