(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rte"] = factory();
	else
		root["rte"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _RichTextEditor = __webpack_require__(1);
	
	var _RichTextEditor2 = _interopRequireDefault(_RichTextEditor);
	
	var _data = __webpack_require__(12);
	
	var _data2 = _interopRequireDefault(_data);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function factory(el) {
	    var richTextEditor = new _RichTextEditor2.default();
	
	    richTextEditor.attach(el, _data2.default);
	
	    return richTextEditor;
	}
	
	module.exports = factory;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Dom = __webpack_require__(2);
	
	var _Dom2 = _interopRequireDefault(_Dom);
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Markup = __webpack_require__(4);
	
	var _Markup2 = _interopRequireDefault(_Markup);
	
	var _Node = __webpack_require__(5);
	
	var _Node2 = _interopRequireDefault(_Node);
	
	var _Caret = __webpack_require__(6);
	
	var _Caret2 = _interopRequireDefault(_Caret);
	
	var _Range = __webpack_require__(7);
	
	var _Range2 = _interopRequireDefault(_Range);
	
	var _State = __webpack_require__(8);
	
	var _State2 = _interopRequireDefault(_State);
	
	var _Editor = __webpack_require__(9);
	
	var _Editor2 = _interopRequireDefault(_Editor);
	
	var _TreeBuilder = __webpack_require__(10);
	
	var _TreeBuilder2 = _interopRequireDefault(_TreeBuilder);
	
	var _Renderer = __webpack_require__(11);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RichTextEditor = function () {
	    function RichTextEditor() {
	        _classCallCheck(this, RichTextEditor);
	
	        this.dom = new _Dom2.default();
	        this.state = new _State2.default();
	        this.root = null;
	        this.history = [];
	    }
	
	    _createClass(RichTextEditor, [{
	        key: 'attach',
	        value: function attach(el, initialState) {
	            this.dom.root = el;
	
	            _Util2.default.extend(this.state, initialState);
	
	            this.state.markups = this.state.markups.map(function (markup) {
	                return new _Markup2.default(markup);
	            });
	
	            this.root = RichTextEditor.buildModelFromState(this.state);
	
	            this.render();
	
	            this.bindEvents();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            this.dom.root.innerHTML = _Renderer2.default.renderNodes(this.root.childNodes);
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            this.dom.root.addEventListener('keypress', this.handleKeypress.bind(this));
	        }
	    }, {
	        key: 'handleKeypress',
	        value: function handleKeypress(e) {
	            var selection = window.getSelection();
	            var range = this.getRangeFromSelection(selection);
	            var characters = e.key;
	            var fromIndex = range.from.node.start + range.from.offset;
	            var toIndex = range.to.node.start + range.to.offset;
	
	            var newState = _Editor2.default.insertCharacters(this.state, characters, fromIndex, toIndex);
	
	            this.history.push(this.state);
	
	            this.state = newState;
	
	            this.root = RichTextEditor.buildModelFromState(this.state);
	
	            this.render();
	
	            this.positionCaret(this.state.selection);
	
	            e.preventDefault();
	        }
	    }, {
	        key: 'getPathFromNode',
	        value: function getPathFromNode(node) {
	            var path = [];
	
	            while (node && node !== this.dom.root) {
	                path.unshift(_Util2.default.index(node, true));
	
	                node = node.parentElement;
	            }
	
	            return path;
	        }
	    }, {
	        key: 'getNodeByPath',
	        value: function getNodeByPath(path, root) {
	            var node = root;
	            var index = -1;
	            var i = 0;
	
	            while (typeof (index = path[i]) === 'number') {
	                node = node.childNodes[index];
	
	                i++;
	            }
	
	            return node || null;
	        }
	    }, {
	        key: 'getRangeFromSelection',
	        value: function getRangeFromSelection(selection) {
	            var anchorPath = this.getPathFromNode(selection.anchorNode);
	            var virtualAnchorNode = this.getNodeByPath(anchorPath, this.root);
	            var from = new _Caret2.default();
	            var to = new _Caret2.default();
	
	            var extentPath = anchorPath;
	            var virtualExtentNode = virtualAnchorNode;
	            var isRtl = false;
	
	            if (!selection.isCollapsed) {
	                extentPath = this.getPathFromNode(selection.extentNode);
	                virtualExtentNode = this.getNodeByPath(extentPath, this.root);
	            }
	
	            isRtl = extentPath < anchorPath || !(extentPath > anchorPath) && selection.anchorOffset > selection.extentOffset;
	
	            from.node = to.node = isRtl ? virtualExtentNode : virtualAnchorNode;
	            from.offset = to.offset = isRtl ? selection.extentOffset : selection.anchorOffset;
	            from.path = to.path = isRtl ? extentPath : anchorPath;
	
	            if (!selection.isCollapsed) {
	                to.node = isRtl ? virtualAnchorNode : virtualExtentNode;
	                to.offset = isRtl ? selection.anchorOffset : selection.extentOffset;
	                to.path = isRtl ? anchorPath : extentPath;
	            }
	
	            return new _Range2.default(from, to);
	        }
	    }, {
	        key: 'positionCaret',
	        value: function positionCaret(_ref) {
	            var _ref2 = _slicedToArray(_ref, 2),
	                start = _ref2[0],
	                end = _ref2[1];
	
	            var range = document.createRange();
	            var selection = window.getSelection();
	
	            var childNodes = this.root.childNodes;
	            var virtualNode = null;
	            var node = null;
	            var offset = -1;
	
	            for (var i = 0; virtualNode = childNodes[i]; i++) {
	                if (virtualNode.end < start) continue;
	
	                if (virtualNode.childNodes.length) {
	                    childNodes = virtualNode.childNodes;
	
	                    i = -1;
	
	                    continue;
	                }
	
	                offset = start - virtualNode.start;
	
	                break;
	            }
	
	            node = this.getNodeByPath(virtualNode.path, this.dom.root);
	
	            range.setStart(node, offset);
	            range.collapse(true);
	
	            selection.removeAllRanges();
	            selection.addRange(range);
	        }
	    }], [{
	        key: 'buildModelFromState',
	        value: function buildModelFromState(state) {
	            var root = new _Node2.default();
	
	            root.start = 0;
	            root.end = state.text.length - 1;
	
	            _TreeBuilder2.default.buildTree(state.text, state.markups, root);
	
	            return root;
	        }
	    }]);
	
	    return RichTextEditor;
	}();
	
	exports.default = RichTextEditor;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Dom = function Dom() {
	    _classCallCheck(this, Dom);
	
	    this.root = null;
	
	    Object.seal(this);
	};
	
	exports.default = Dom;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Util = function () {
	    function Util() {
	        _classCallCheck(this, Util);
	    }
	
	    _createClass(Util, null, [{
	        key: 'extend',
	
	
	        /**
	         * @param   {object} target
	         * @param   {object} source
	         * @param   {boolean} deep
	         * @return  {object}
	         */
	
	        value: function extend(target, source, deep) {
	            var sourceKeys = [];
	
	            if (!target || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
	                throw new TypeError('[Util#extend] Target must be a valid object');
	            }
	
	            deep = deep || false;
	
	            if (Array.isArray(source)) {
	                for (var i = 0; i < source.length; i++) {
	                    sourceKeys.push(i);
	                }
	            } else if (source) {
	                sourceKeys = Object.keys(source);
	            }
	
	            for (var _i = 0; _i < sourceKeys.length; _i++) {
	                var key = sourceKeys[_i];
	                var descriptor = Object.getOwnPropertyDescriptor(source, key);
	
	                // Skip computed properties
	
	                if (typeof descriptor.get === 'function') continue;
	
	                if (!deep || _typeof(source[key]) !== 'object') {
	                    // All non-object primitives, or all properties if
	                    // shallow extend
	
	                    target[key] = source[key];
	                } else if (Array.isArray(source[key])) {
	                    // Arrays
	
	                    if (!target[key]) {
	                        target[key] = [];
	                    }
	
	                    this.extend(target[key], source[key], deep);
	                } else {
	                    // Objects
	
	                    if (!target[key]) {
	                        target[key] = {};
	                    }
	
	                    this.extend(target[key], source[key], deep);
	                }
	            }
	
	            return target;
	        }
	
	        /**
	         * Flattens an array.
	         *
	         * @param {Array} arr
	         * @return {Array}
	         */
	
	    }, {
	        key: 'flattenArray',
	        value: function flattenArray(arr) {
	            return arr.reduce(function (prev, curr) {
	                if (Array.isArray(curr)) {
	                    return prev.concat(curr);
	                }
	
	                prev.push(curr);
	
	                return prev;
	            }, []);
	        }
	
	        /**
	         * Returns a function which calls the provided function
	         * only after the specified interval has elapsed between
	         * function calls. An optional `immediate` boolean will
	         * cause the provided function to be called once immediately
	         * before waiting.
	         *
	         * @param   {function}  fn
	         * @param   {number}    interval
	         * @param   {boolean}   [immediate=false]
	         * @return  {function}
	         */
	
	    }, {
	        key: 'debounce',
	        value: function debounce(fn, interval, immediate) {
	            var timeoutId = -1;
	
	            return function () {
	                var _this = this;
	
	                var args = arguments;
	
	                var later = function later() {
	                    timeoutId = -1;
	
	                    fn.apply(_this, args); // eslint-disable-line no-invalid-this
	                };
	
	                if (timeoutId < 0 && immediate) {
	                    later();
	                } else {
	                    clearTimeout(timeoutId);
	
	                    timeoutId = setTimeout(later, interval);
	                }
	            };
	        }
	
	        /**
	         * Returns a function which calls the provided function once per maximum
	         * specified interval.
	         *
	         * @param   {function}  fn
	         * @param   {number}    interval
	         * @return  {function}
	         */
	
	    }, {
	        key: 'throttle',
	        value: function throttle(fn, interval) {
	            var timeoutId = -1;
	            var last = -1;
	
	            return function () {
	                var _this2 = this;
	
	                var args = arguments;
	                var now = Date.now();
	                var difference = last ? now - last : Infinity;
	
	                var later = function later() {
	                    last = now;
	
	                    fn.apply(_this2, args); // eslint-disable-line no-invalid-this
	                };
	
	                if (!last || difference >= interval) {
	                    later();
	                } else {
	                    clearTimeout(timeoutId);
	
	                    timeoutId = setTimeout(later, interval - difference);
	                }
	            };
	        }
	
	        /**
	         * @param   {HTMLElement}       el
	         * @param   {string}            selector
	         * @param   {boolean}           [includeSelf]
	         * @return  {HTMLElement|null}
	         */
	
	    }, {
	        key: 'closestParent',
	        value: function closestParent(el, selector, includeSelf) {
	            var parent = el.parentNode;
	
	            if (includeSelf && el.matches(selector)) {
	                return el;
	            }
	
	            while (parent && parent !== document.body) {
	                if (parent.matches && parent.matches(selector)) {
	                    return parent;
	                } else if (parent.parentNode) {
	                    parent = parent.parentNode;
	                } else {
	                    return null;
	                }
	            }
	
	            return null;
	        }
	
	        /**
	         * @param   {Element}     el
	         * @param   {string}      selector
	         * @return  {Element[]}
	         */
	
	    }, {
	        key: 'children',
	        value: function children(el, selector) {
	            var selectors = selector.split(',');
	            var childSelectors = [];
	
	            var children = null;
	            var tempId = '';
	
	            if (!el.id) {
	                tempId = '_temp_';
	
	                el.id = tempId;
	            }
	
	            while (selectors.length) {
	                childSelectors.push('#' + el.id + '>' + selectors.pop());
	            }
	
	            children = document.querySelectorAll(childSelectors.join(', '));
	
	            if (tempId) {
	                el.removeAttribute('id');
	            }
	
	            return children;
	        }
	
	        /**
	         * @param   {Node}        node
	         * @param   {boolean}     [includeNonElements=false]
	         * @return  {Element[]}
	         */
	
	    }, {
	        key: 'index',
	        value: function index(node) {
	            var includeNonElements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	            var index = 0;
	
	            while ((node = includeNonElements ? node.previousSibling : node.previousElementSibling) !== null) {
	                index++;
	            }
	
	            return index;
	        }
	    }]);
	
	    return Util;
	}();
	
	exports.default = Util;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Markup = function (_Array) {
	    _inherits(Markup, _Array);
	
	    function Markup(_ref) {
	        var _ref2 = _slicedToArray(_ref, 3),
	            tag = _ref2[0],
	            start = _ref2[1],
	            end = _ref2[2];
	
	        _classCallCheck(this, Markup);
	
	        var _this = _possibleConstructorReturn(this, (Markup.__proto__ || Object.getPrototypeOf(Markup)).call(this));
	
	        _this[0] = tag;
	        _this[1] = start;
	        _this[2] = end;
	
	        Object.defineProperties(_this, {
	            type: {
	                get: function get() {
	                    return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(this[0]) > -1 ? 'block' : 'inline';
	                }
	            },
	            isBlock: {
	                get: function get() {
	                    return this.type === 'block';
	                }
	            },
	            isInline: {
	                get: function get() {
	                    return this.type === 'inline';
	                }
	            }
	        });
	
	        Object.seal(_this);
	        return _this;
	    }
	
	    return Markup;
	}(Array);
	
	exports.default = Markup;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Node = function Node() {
	    _classCallCheck(this, Node);
	
	    this.childNodes = [];
	    this.start = -1;
	    this.end = -1;
	    this.tag = '';
	    this.text = '';
	    this.path = [];
	
	    Object.seal(this);
	};
	
	exports.default = Node;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Caret = function Caret() {
	    _classCallCheck(this, Caret);
	
	    this.path = null;
	    this.node = null;
	    this.offset = null;
	
	    Object.seal(this);
	};
	
	exports.default = Caret;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Range = function Range(from, to) {
	    _classCallCheck(this, Range);
	
	    this.from = from;
	    this.to = to;
	
	    Object.seal(this);
	};
	
	exports.default = Range;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var State = function State() {
	    _classCallCheck(this, State);
	
	    this.text = '';
	    this.markups = [];
	    this.selection = [];
	
	    Object.seal(this);
	};
	
	exports.default = State;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _State = __webpack_require__(8);
	
	var _State2 = _interopRequireDefault(_State);
	
	var _Markup = __webpack_require__(4);
	
	var _Markup2 = _interopRequireDefault(_Markup);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Editor = function () {
	    function Editor() {
	        _classCallCheck(this, Editor);
	    }
	
	    _createClass(Editor, null, [{
	        key: 'insertCharacters',
	        value: function insertCharacters(state, characters, fromIndex, toIndex) {
	            var newState = new _State2.default();
	            var totalDeleted = toIndex - fromIndex;
	            var totalAdded = characters.length;
	            var adjustment = totalAdded - totalDeleted;
	
	            newState.text = state.text.slice(0, fromIndex) + characters + state.text.slice(toIndex);
	
	            newState.markups = Editor.adjustMarkups(state.markups, fromIndex, toIndex, totalAdded, adjustment);
	
	            newState.selection = [fromIndex + totalAdded, fromIndex + totalAdded];
	
	            return newState;
	        }
	    }, {
	        key: 'adjustMarkups',
	        value: function adjustMarkups(markups, fromIndex, toIndex, totalAdded, adjustment) {
	            var newMarkups = [];
	
	            for (var i = 0, markup; markup = markups[i]; i++) {
	                var _markup = markup,
	                    _markup2 = _slicedToArray(_markup, 3),
	                    tag = _markup2[0],
	                    start = _markup2[1],
	                    end = _markup2[2];
	
	                var newMarkup = new _Markup2.default(markup);
	
	                if (!(markup instanceof _Markup2.default)) {
	                    markup = new _Markup2.default(markup);
	                }
	
	                // Selection completely envelopes markup
	
	                if (start > fromIndex && end < toIndex) continue;
	
	                if (start <= fromIndex && end >= toIndex) {
	                    // Selection within markup or equal to markup
	
	                    newMarkup[2] += adjustment;
	
	                    if (markup.isInline && start === fromIndex && fromIndex === toIndex) {
	                        // Collapsed caret at start of inline markup
	
	                        newMarkup[1] += adjustment;
	                    }
	                } else if (start >= toIndex) {
	                    // Markup starts after Selection
	
	                    newMarkup[1] += adjustment;
	                    newMarkup[2] += adjustment;
	                } else if (fromIndex < start && toIndex > start && toIndex < end) {
	                    // Selection partially envelopes markup from start
	
	                    newMarkup[1] += adjustment + (toIndex - start);
	                    newMarkup[2] += adjustment;
	                } else if (fromIndex > start && fromIndex < end && toIndex > end) {
	                    // Selection partially envelopes markup from end
	
	                    newMarkup[2] = fromIndex + totalAdded;
	                }
	
	                newMarkups.push(newMarkup);
	            }
	
	            return newMarkups;
	        }
	    }]);
	
	    return Editor;
	}();
	
	exports.default = Editor;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Node = __webpack_require__(5);
	
	var _Node2 = _interopRequireDefault(_Node);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TreeBuilder = function () {
	    function TreeBuilder() {
	        _classCallCheck(this, TreeBuilder);
	    }
	
	    _createClass(TreeBuilder, null, [{
	        key: 'buildTree',
	        value: function buildTree(text, markups, parent) {
	            var startIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	
	            var lastSibling = null;
	
	            var path = null;
	            var index = 0;
	
	            for (var i = startIndex; i < markups.length; i++) {
	                var markup = markups[i];
	
	                if (lastSibling && markup[2] <= lastSibling.end) {
	                    // Recurse down
	
	                    lastSibling.childNodes.length = 0;
	
	                    i = TreeBuilder.buildTree(text, markups, lastSibling, i);
	                } else if (markup[1] > parent.end) {
	                    // Return up
	
	                    if (lastSibling.end < parent.end) {
	                        // Preceeded by text node
	
	                        path = parent.path.slice().concat([index++]);
	
	                        parent.childNodes.push(TreeBuilder.getNode('', lastSibling.end, parent.end, text, path));
	                    }
	
	                    return i - 1;
	                } else {
	                    var lastIndex = lastSibling ? lastSibling.end + 1 : parent.start;
	
	                    // First child or sibling
	
	                    if (markup[1] > lastIndex) {
	                        // Preceeded by text node
	
	                        path = parent.path.slice().concat([index++]);
	
	                        parent.childNodes.push(TreeBuilder.getNode('', lastIndex, markup[1], text, path));
	                    }
	
	                    path = parent.path.slice().concat([index++]);
	
	                    lastSibling = TreeBuilder.getNode(markup[0], markup[1], markup[2], text, path);
	
	                    // Create internal text node
	
	                    path = path.slice().concat(0);
	
	                    lastSibling.childNodes.push(TreeBuilder.getNode('', markup[1], markup[2], text, path));
	
	                    parent.childNodes.push(lastSibling);
	                }
	            }
	        }
	    }, {
	        key: 'getNode',
	        value: function getNode(tag, start, end, text, path) {
	            var node = new _Node2.default();
	
	            node.tag = tag;
	            node.start = start;
	            node.end = end;
	            node.path = path;
	
	            if (!tag) {
	                node.text = text.slice(start, end);
	            }
	
	            return node;
	        }
	    }, {
	        key: 'insertCharacters',
	        value: function insertCharacters(characters, range) {
	            if (range.from.node === range.to.node) {
	                var node = range.from.node;
	
	                // Same node
	
	                node.text = node.text.slice(0, range.from.offset) + characters + node.text.slice(range.to.offset);
	            }
	
	            // TODO: increment all start/end values in subsequent nodes
	
	            // TODO: return closest common ancestor node for re-rendering (not in this class)
	        }
	    }]);
	
	    return TreeBuilder;
	}();
	
	exports.default = TreeBuilder;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Renderer = function () {
	    function Renderer() {
	        _classCallCheck(this, Renderer);
	    }
	
	    _createClass(Renderer, null, [{
	        key: 'renderNodes',
	        value: function renderNodes(nodes) {
	            return nodes.map(Renderer.renderNode).join('');
	        }
	    }, {
	        key: 'renderNode',
	        value: function renderNode(node) {
	            var html = '';
	
	            if (node.tag) {
	                html += '<' + node.tag + '>';
	            }
	
	            if (node.childNodes.length) {
	                html += Renderer.renderNodes(node.childNodes);
	            } else {
	                html += node.text;
	            }
	
	            if (node.tag) {
	                html += '</' + node.tag + '>';
	            }
	
	            return html;
	        }
	    }]);
	
	    return Renderer;
	}();
	
	exports.default = Renderer;

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"text": "Lorem ipsum dolor sit amet. Consectetur adipiscing",
		"markups": [
			[
				"p",
				0,
				27
			],
			[
				"em",
				6,
				17
			],
			[
				"strong",
				12,
				17
			],
			[
				"h2",
				28,
				50
			]
		]
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rte.js.map