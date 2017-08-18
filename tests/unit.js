require('source-map-support').install();

require('babel-register');

require('../src/Editor.test.js');
require('../src/TreeBuilder.test.js');
require('../src/Util.test.js');


/**
 * # TODO:
 * insert one or more chars into empty block
 * - INSERT TEXT, ADJUST MARKUPS
 * extend block with one or more chars
 * - INSERT TEXT, ADJUST MARKUPS
 * delete one or more characters within block
 * - REMOVE TEXT, ADJUST MARKUPS
 * insert line break into block
 * - INSERT TEXT, ADD MARKUP, ADJUST MARKUPS
 * split block into two blocks of same type
 * - INSERT TEXT, ADD MARKUP, ADJUST MARKUPS
 * change markup type of a single block
 * - EDIT MARKUPS, ~ REMOVE MARKUPS
 * change markup type of multiple blocks
 * - EDIT MARKUPS, ~ REMOVE MARKUPS
 * insert inline markup into block (if permitted)
 * - ADD MARKUP, INGEST MARKUPS, JOIN MARKUPS
 * insert inline markup across several blocks
 * - DELEGATE PER BLOCK, ADD MARKUP, INGEST MARKUPS, JOIN MARKUPS
 * insert inline markup into inline markup within block (infinitely nesting)
 * insert inline markup next to inline markup, thus extending existing markup
 * insert inline markup around inline markup, thus ingesting existing markup
 * - INGEST MARKUPS, ADD MARKUP
 * insert inline markup so that it partially overlaps another one (FB example)
 * remove inline markup from block
 * - REMOVE MARKUP
 * remove inline markup within another inline markup
 * remove part of an inline markup
 * - ADJUST MARKUP
 * remove an inner part of inline markup, splitting the existing markup in two
 * - SPLIT MARKUP
 * delete line break between two markups, thus joining markups into the type of the first one
 * - JOIN MARKUPS
 * place cursor in a single inline markup to see it reflected as active
 * select characters within a single inline markup to see it reflected as active
 * select characters starting within a single inline markup to see it reflected as active
 * selecting characters ending in a single inline markup should not be reflected as active
 * select adjacent, like inline markups in adjacent blocks to see it reflected as active
 * prevent the addition of multiple adjacent whitespaces
 * insert 1 newline chars if shift return (<br>)
 * insert 2 newline chars if new block  (...</p>/n/n<p>...) keeps it readable
 * trim whitespace at start or end of block when split into new block
 */