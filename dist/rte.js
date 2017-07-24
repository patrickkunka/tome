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
	
	var _data = __webpack_require__(18);
	
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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	// import Editor       from './Editor';
	
	
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
	
	var _Action = __webpack_require__(10);
	
	var _Action2 = _interopRequireDefault(_Action);
	
	var _EventHandler = __webpack_require__(11);
	
	var _EventHandler2 = _interopRequireDefault(_EventHandler);
	
	var _TreeBuilder = __webpack_require__(15);
	
	var _TreeBuilder2 = _interopRequireDefault(_TreeBuilder);
	
	var _Renderer = __webpack_require__(16);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	var _reducer = __webpack_require__(17);
	
	var _reducer2 = _interopRequireDefault(_reducer);
	
	var _Common = __webpack_require__(19);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RichTextEditor = function () {
	    function RichTextEditor() {
	        _classCallCheck(this, RichTextEditor);
	
	        this.dom = new _Dom2.default();
	        this.eventHandler = new _EventHandler2.default();
	        this.root = null;
	        this.history = [];
	        this.historyIndex = -1;
	
	        Object.defineProperties(this, {
	            state: {
	                get: function get() {
	                    return this.history[this.historyIndex];
	                }
	            }
	        });
	    }
	
	    _createClass(RichTextEditor, [{
	        key: 'attach',
	        value: function attach(el) {
	            var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _State2.default();
	
	            this.dom.root = el;
	
	            this.history.push(this.buildInitialState(initialState));
	
	            this.historyIndex++;
	
	            this.render();
	
	            this.eventHandler.bindEvents(this.dom.root, this);
	        }
	
	        /**
	         * @param   {object} initialState
	         * @return  {State}
	         */
	
	    }, {
	        key: 'buildInitialState',
	        value: function buildInitialState(initialState) {
	            var state = _Util2.default.extend(new _State2.default(), initialState);
	
	            if (state.markups.length < 1) {
	                state.markups.push(['p', 0, 0]);
	            }
	
	            state.markups = state.markups.map(function (markup) {
	                return new _Markup2.default(markup);
	            });
	
	            return state;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            this.root = RichTextEditor.buildModelFromState(this.state);
	
	            this.dom.root.innerHTML = _Renderer2.default.renderNodes(this.root.childNodes);
	        }
	    }, {
	        key: 'undo',
	        value: function undo() {
	            if (this.historyIndex === 0) return;
	
	            this.historyIndex--;
	
	            this.render();
	
	            this.positionCaret(this.state.selection);
	        }
	    }, {
	        key: 'redo',
	        value: function redo() {
	            if (this.history.length - 1 === this.historyIndex) return;
	
	            this.historyIndex++;
	
	            this.render();
	
	            this.positionCaret(this.state.selection);
	        }
	    }, {
	        key: 'applyAction',
	        value: function applyAction(type) {
	            var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	            var selection = window.getSelection();
	            var range = this.getRangeFromSelection(selection);
	
	            var nextState = [type].reduce(function (prevState, type) {
	                var action = new _Action2.default();
	
	                action.type = type;
	                action.range = range;
	                action.content = content;
	
	                return (0, _reducer2.default)(prevState, action);
	            }, this.state);
	
	            if (!(nextState instanceof _State2.default)) {
	                throw new TypeError('[RichTextEditor] Action type "' + type + '" did not return a valid state object');
	            }
	
	            if (nextState === this.state) return;
	
	            // TODO: discern 'push' vs 'replace' commands i.e. inserting a
	            // char vs moving a cursor
	
	            console.log(type, nextState);
	
	            this.history.push(nextState);
	
	            this.historyIndex++;
	
	            // Chop off any divergent future state
	
	            this.history.length = this.historyIndex + 1;
	
	            this.render();
	
	            this.positionCaret(this.state.selection);
	
	            // console.log(JSON.stringify(this.state.markups));
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
	
	        /**
	         * @param   {Selection} selection
	         * @return  {Range}
	         */
	
	        // TODO: consolodate range/selection models, no need for both
	
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
	            var rangeFrom = -1;
	            var rangeTo = -1;
	
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
	
	            rangeFrom = Math.min(from.node.start + from.offset, from.node.end);
	            rangeTo = Math.min(to.node.start + to.offset, to.node.end);
	
	            return new _Range2.default(rangeFrom, rangeTo, isRtl ? _Common.DIRECTION_RTL : _Common.DIRECTION_LTR);
	        }
	    }, {
	        key: 'positionCaret',
	        value: function positionCaret(_ref) {
	            var from = _ref.from,
	                to = _ref.to;
	
	            var range = document.createRange();
	            var selection = window.getSelection();
	
	            var childNodes = this.root.childNodes;
	            var virtualNode = null;
	            var nodeLeft = null;
	            var nodeRight = null;
	            var offsetStart = -1;
	            var offsetEnd = -1;
	
	            for (var i = 0; virtualNode = childNodes[i]; i++) {
	                // Node ends before caret
	
	                if (virtualNode.end < from) continue;
	
	                // The desired node is this node, or within this node
	
	                if (virtualNode.childNodes.length) {
	                    // Node has children, drop down until at leaf
	
	                    childNodes = virtualNode.childNodes;
	
	                    i = -1;
	
	                    continue;
	                }
	
	                // At leaf
	
	                offsetStart = from - virtualNode.start;
	
	                break;
	            }
	
	            nodeLeft = this.getNodeByPath(virtualNode.path, this.dom.root);
	
	            range.setStart(nodeLeft, offsetStart);
	
	            if (from === to) {
	                // Single caret
	
	                range.collapse(true);
	            } else {
	                // Multi-character selection, reset child nodes
	
	                childNodes = this.root.childNodes;
	
	                for (var _i = 0; virtualNode = childNodes[_i]; _i++) {
	                    if (virtualNode.end < to) continue;
	
	                    if (virtualNode.childNodes.length) {
	                        childNodes = virtualNode.childNodes;
	
	                        _i = -1;
	
	                        continue;
	                    }
	
	                    offsetEnd = to - virtualNode.start;
	
	                    break;
	                }
	
	                nodeRight = this.getNodeByPath(virtualNode.path, this.dom.root);
	
	                range.setEnd(nodeRight, offsetEnd);
	            }
	
	            selection.removeAllRanges();
	            selection.addRange(range);
	        }
	    }], [{
	        key: 'buildModelFromState',
	        value: function buildModelFromState(state) {
	            var root = new _Node2.default();
	
	            _TreeBuilder2.default.buildTreeFromRoot(root, state.text, state.markups);
	
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
	
	        /**
	         * Converts a dash or snake-case string to camel case.
	         *
	         * @param   {string}    str
	         * @return  {string}
	         */
	
	    }, {
	        key: 'camelCase',
	        value: function camelCase(str) {
	            return str.toLowerCase().replace(/([_-][a-z0-9])/g, function ($1) {
	                return $1.toUpperCase().replace(/[_-]/, '');
	            });
	        }
	
	        /**
	         * Converts a dash or snake-case string to pascal case.
	         *
	         * @param   {string}    str
	         * @return  {string}
	         */
	
	    }, {
	        key: 'pascalCase',
	        value: function pascalCase(str) {
	            return (str = Util.camelCase(str)).charAt(0).toUpperCase() + str.slice(1);
	        }
	
	        /**
	         * Converts a camel or pascal-case string to dash case.
	         *
	         * @param   {string}    str
	         * @return  {string}
	         */
	
	    }, {
	        key: 'dashCase',
	        value: function dashCase(str) {
	            return str.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase();
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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Node = function () {
	    function Node() {
	        _classCallCheck(this, Node);
	
	        this.childNodes = [];
	        this.parent = null;
	        this.start = -1;
	        this.end = -1;
	        this.tag = '';
	        this.text = '';
	        this.path = [];
	
	        Object.seal(this);
	    }
	
	    _createClass(Node, [{
	        key: 'isText',
	        get: function get() {
	            return this.tag === '';
	        }
	    }, {
	        key: 'isBlock',
	        get: function get() {
	            return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(this.tag);
	        }
	    }, {
	        key: 'isInline',
	        get: function get() {
	            return !this.isText && !this.isBlock;
	        }
	    }]);
	
	    return Node;
	}();
	
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Common = __webpack_require__(19);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Range = function () {
	    function Range() {
	        var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
	        var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
	        var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Common.DIRECTION_LTR;
	
	        _classCallCheck(this, Range);
	
	        this.from = from;
	        this.to = to;
	        this.direction = direction;
	
	        Object.seal(this);
	    }
	
	    _createClass(Range, [{
	        key: 'isCollapsed',
	        get: function get() {
	            return this.from === this.to;
	        }
	    }, {
	        key: 'isLtr',
	        get: function get() {
	            return this.direction === _Common.DIRECTION_LTR;
	        }
	    }, {
	        key: 'isRtl',
	        get: function get() {
	            return this.direction === _Common.DIRECTION_RTL;
	        }
	    }, {
	        key: 'anchor',
	        get: function get() {
	            if (this.isLtr) {
	                return this.from;
	            }
	
	            return this.to;
	        }
	    }, {
	        key: 'extent',
	        get: function get() {
	            if (this.isLtr) {
	                return this.to;
	            }
	
	            return this.from;
	        }
	    }]);
	
	    return Range;
	}();
	
	exports.default = Range;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Range = __webpack_require__(7);
	
	var _Range2 = _interopRequireDefault(_Range);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var State = function () {
	    function State() {
	        _classCallCheck(this, State);
	
	        this.text = '';
	        this.markups = [];
	        this.selection = new _Range2.default();
	
	        Object.seal(this);
	    }
	
	    _createClass(State, [{
	        key: 'length',
	        get: function get() {
	            return this.text.length;
	        }
	    }]);
	
	    return State;
	}();
	
	exports.default = State;

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Action = function () {
	    function Action() {
	        _classCallCheck(this, Action);
	
	        this.type = null;
	        this.range = null;
	        this.content = '';
	
	        Object.seal(this);
	    }
	
	    _createClass(Action, [{
	        key: 'isRange',
	        get: function get() {
	            return this.range && this.range.from !== this.range.to;
	        }
	    }]);
	
	    return Action;
	}();
	
	exports.default = Action;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Actions = __webpack_require__(12);
	
	var Actions = _interopRequireWildcard(_Actions);
	
	var _Keys = __webpack_require__(13);
	
	var Keys = _interopRequireWildcard(_Keys);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EventHandler = function () {
	    function EventHandler() {
	        _classCallCheck(this, EventHandler);
	    }
	
	    _createClass(EventHandler, [{
	        key: 'bindEvents',
	        value: function bindEvents(root, richTextEditor) {
	            this.delegator = this.delegator.bind(this, richTextEditor);
	
	            root.addEventListener('keypress', this.delegator);
	            root.addEventListener('keydown', this.delegator);
	            root.addEventListener('keyup', this.delegator);
	            root.addEventListener('click', this.delegator);
	        }
	    }, {
	        key: 'unbindEvents',
	        value: function unbindEvents(root) {
	            root.removeEventListener('keypress', this.delegator);
	            root.removeEventListener('keydown', this.delegator);
	            root.removeEventListener('keyup', this.delegator);
	            root.removeEventListener('click', this.delegator);
	        }
	    }, {
	        key: 'delegator',
	        value: function delegator(richTextEditor, e) {
	            var eventType = e.type;
	            var fn = this['handle' + _Util2.default.pascalCase(eventType)];
	
	            if (typeof fn !== 'function') {
	                throw new Error('[EventHandler] No handler found for event "' + eventType + '"');
	            }
	
	            fn(e, richTextEditor);
	        }
	    }, {
	        key: 'handleClick',
	        value: function handleClick(e, richTextEditor) {
	            richTextEditor.applyAction(Actions.SET_SELECTION);
	        }
	    }, {
	        key: 'handleKeypress',
	        value: function handleKeypress(e, richTextEditor) {
	            e.preventDefault();
	
	            richTextEditor.applyAction(Actions.INSERT, e.key);
	            // richTextEditor.performCommand('insert', e.key);
	        }
	    }, {
	        key: 'handleKeydown',
	        value: function handleKeydown(e, richTextEditor) {
	            var key = e.key.toLowerCase();
	
	            var actionType = '';
	
	            if (e.metaKey) {
	                switch (key) {
	                    case Keys.A:
	                        actionType = Actions.SET_SELECTION;
	
	                        break;
	                    // case Keys.C:
	                    //    command = 'copy';
	
	                    //     break;
	                    // case Keys.V:
	                    //     command = 'paste';
	
	                    //     break;
	                    // case Keys.S:
	                    //     command = 'save';
	
	                    //     break;
	                    case Keys.Z:
	                        e.preventDefault();
	
	                        return e.shiftKey ? richTextEditor.redo() : richTextEditor.undo();
	                }
	            }
	
	            switch (key) {
	                case Keys.ENTER:
	                    actionType = e.shiftKey ? Actions.SHIFT_RETURN : Actions.RETURN;
	
	                    break;
	                case Keys.BACKSPACE:
	                    actionType = Actions.BACKSPACE;
	
	                    break;
	                case Keys.DELETE:
	                    actionType = Actions.DELETE;
	
	                    break;
	                case Keys.ARROW_LEFT:
	                    actionType = EventHandler.parseArrowLeft(e);
	
	                    break;
	                case Keys.ARROW_RIGHT:
	                    actionType = EventHandler.parseArrowRight(e);
	
	                    break;
	            }
	
	            if (!actionType || actionType === Actions.NONE) return;
	
	            e.preventDefault();
	
	            richTextEditor.applyAction(actionType);
	        }
	    }, {
	        key: 'handleKeyup',
	        value: function handleKeyup(e, richTextEditor) {
	            var key = e.key.toLowerCase();
	
	            var actionType = '';
	
	            switch (key) {
	                case Keys.ARROW_UP:
	                    actionType = EventHandler.parseArrowUp(e);
	
	                    break;
	                case Keys.ARROW_DOWN:
	                    actionType = EventHandler.parseArrowDown(e);
	
	                    break;
	            }
	
	            if (!actionType || actionType === Actions.NONE) return;
	
	            richTextEditor.applyAction(actionType);
	        }
	    }], [{
	        key: 'parseArrowUp',
	        value: function parseArrowUp(e) {
	            if (e.metaKey && e.shiftKey) {
	                return Actions.PAGE_UP_SELECT;
	            } else if (e.metaKey) {
	                return Actions.PAGE_UP;
	            } else if (e.shiftKey) {
	                return Actions.UP_SELECT;
	            }
	
	            return Actions.NONE;
	        }
	    }, {
	        key: 'parseArrowDown',
	        value: function parseArrowDown(e) {
	            if (e.metaKey && e.shiftKey) {
	                return Actions.PAGE_DOWN_SELECT;
	            } else if (e.metaKey) {
	                return Actions.PAGE_DOWN;
	            } else if (e.shiftKey) {
	                return Actions.DOWN_SELECT;
	            }
	
	            return Actions.NONE;
	        }
	    }, {
	        key: 'parseArrowLeft',
	        value: function parseArrowLeft(e) {
	            if (e.metaKey && e.shiftKey) {
	                return Actions.HOME_SELECT;
	            } else if (e.metaKey) {
	                return Actions.HOME;
	            } else if (e.altKey) {
	                return Actions.LEFT_SKIP;
	            } else if (e.shiftKey) {
	                return Actions.LEFT_SELECT;
	            }
	
	            return Actions.LEFT;
	        }
	    }, {
	        key: 'parseArrowRight',
	        value: function parseArrowRight(e) {
	            if (e.metaKey && e.shiftKey) {
	                return Actions.END_SELECT;
	            } else if (e.metaKey) {
	                return Actions.END;
	            } else if (e.altKey) {
	                return Actions.RIGHT_SKIP;
	            } else if (e.shiftKey) {
	                return Actions.RIGHT_SELECT;
	            }
	
	            return Actions.RIGHT;
	        }
	    }]);
	
	    return EventHandler;
	}();
	
	exports.default = EventHandler;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SET_SELECTION = exports.SET_SELECTION = Symbol('SET_SELECTION');
	var LEFT = exports.LEFT = Symbol('ACTION_TYPE_LEFT');
	var LEFT_SELECT = exports.LEFT_SELECT = Symbol('ACTION_TYPE_LEFT_SELECT');
	var LEFT_SKIP = exports.LEFT_SKIP = Symbol('ACTION_TYPE_LEFT_SKIP');
	var RIGHT = exports.RIGHT = Symbol('ACTION_TYPE_RIGHT');
	var RIGHT_SELECT = exports.RIGHT_SELECT = Symbol('ACTION_TYPE_RIGHT_SELECT');
	var RIGHT_SKIP = exports.RIGHT_SKIP = Symbol('ACTION_TYPE_RIGHT_SKIP');
	var HOME = exports.HOME = Symbol('ACTION_TYPE_HOME');
	var HOME_SELECT = exports.HOME_SELECT = Symbol('ACTION_TYPE_HOME_SELECT');
	var END = exports.END = Symbol('ACTION_TYPE_END');
	var END_SELECT = exports.END_SELECT = Symbol('ACTION_TYPE_END_SELECT');
	var PAGE_UP = exports.PAGE_UP = Symbol('ACTION_TYPE_PAGE_UP');
	var PAGE_UP_SELECT = exports.PAGE_UP_SELECT = Symbol('ACTION_TYPE_PAGE_UP_SELECT');
	var PAGE_DOWN = exports.PAGE_DOWN = Symbol('ACTION_TYPE_PAGE_DOWN');
	var PAGE_DOWN_SELECT = exports.PAGE_DOWN_SELECT = Symbol('ACTION_TYPE_PAGE_DOWN_SELECT');
	var UP_SELECT = exports.UP_SELECT = Symbol('ACTION_TYPE_UP_SELECT');
	var DOWN_SELECT = exports.DOWN_SELECT = Symbol('ACTION_TYPE_DOWN_SELECT');
	var INSERT = exports.INSERT = Symbol('ACTION_TYPE_INSERT');
	var BACKSPACE = exports.BACKSPACE = Symbol('ACTION_TYPE_BACKSPACE');
	var DELETE = exports.DELETE = Symbol('ACTION_TYPE_DELETE');
	var RETURN = exports.RETURN = Symbol('ACTION_TYPE_RETURN');
	var SHIFT_RETURN = exports.SHIFT_RETURN = Symbol('ACTION_TYPE_SHIFT_RETURN');
	var NONE = exports.NONE = Symbol('ACTION_TYPE_NONE');

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ENTER = exports.ENTER = 'enter';
	var BACKSPACE = exports.BACKSPACE = 'backspace';
	var DELETE = exports.DELETE = 'delete';
	var ARROW_UP = exports.ARROW_UP = 'arrowup';
	var ARROW_DOWN = exports.ARROW_DOWN = 'arrowdown';
	var ARROW_LEFT = exports.ARROW_LEFT = 'arrowleft';
	var ARROW_RIGHT = exports.ARROW_RIGHT = 'arrowright';
	
	var A = exports.A = 'a';
	var C = exports.C = 'c';
	var V = exports.V = 'v';
	var S = exports.S = 's';
	var Z = exports.Z = 'z';

/***/ },
/* 14 */,
/* 15 */
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
	        key: 'buildTreeFromRoot',
	
	        /**
	         * @param   {Node}            root
	         * @param   {string}          text
	         * @param   {Array.<Markup>}  markups
	         * @return  {void}
	         */
	
	        value: function buildTreeFromRoot(root, text, markups) {
	            var openNodes = [];
	
	            var isAtLeaf = false;
	            var node = root;
	
	            node.start = 0;
	            node.end = text.length;
	
	            for (var i = 0; i <= text.length; i++) {
	                var requiresNewLeaf = false;
	
	                for (var j = 0, markup; markup = markups[j]; j++) {
	                    var closedNode = null;
	
	                    if (markup[2] !== i || markup[1] === markup[2]) continue;
	
	                    if (isAtLeaf && openNodes[openNodes.length - 1].isText) {
	                        var textNode = openNodes.pop();
	
	                        TreeBuilder.closeNode(textNode, i, text);
	
	                        isAtLeaf = false;
	                    }
	
	                    requiresNewLeaf = true;
	
	                    closedNode = openNodes.pop();
	
	                    TreeBuilder.closeNode(closedNode, i);
	
	                    node = closedNode.parent;
	                }
	
	                for (var _j = 0, _markup; _markup = markups[_j]; _j++) {
	                    var newNode = null;
	
	                    if (_markup[1] !== i) continue;
	
	                    if (isAtLeaf) {
	                        var _textNode = openNodes.pop();
	
	                        TreeBuilder.closeNode(_textNode, i, text);
	
	                        isAtLeaf = false;
	                    }
	
	                    newNode = TreeBuilder.getOpenNode(_markup[0], i, node);
	
	                    openNodes.push(newNode);
	
	                    node.childNodes.push(newNode);
	
	                    node = newNode;
	
	                    requiresNewLeaf = true;
	
	                    if (_markup[1] === _markup[2]) {
	                        // Empty tag, close immediately
	
	                        TreeBuilder.closeNode(node, i);
	                    }
	                }
	
	                if (requiresNewLeaf) {
	                    var leaf = TreeBuilder.getOpenNode('', i, node);
	
	                    if (node.start === node.end) {
	                        // Empty leaf in empty node, close immediately
	
	                        node.childNodes.push(leaf);
	
	                        TreeBuilder.closeNode(leaf, i);
	
	                        node = node.parent;
	
	                        openNodes.pop();
	                    } else if (i < text.length) {
	                        // Should open leaf node, but not at end of string
	
	                        node.childNodes.push(leaf);
	
	                        openNodes.push(leaf);
	
	                        isAtLeaf = true;
	                    }
	
	                    requiresNewLeaf = false;
	                }
	            }
	        }
	
	        /**
	         * @param   {string}    tag
	         * @param   {number}    i
	         * @param   {Node}      parent
	         * @return  {Node}
	         */
	
	    }, {
	        key: 'getOpenNode',
	        value: function getOpenNode(tag, start, parent) {
	            var node = new _Node2.default();
	
	            node.tag = tag;
	            node.parent = parent;
	            node.start = start;
	            node.path = parent.path.slice();
	
	            node.path.push(parent.childNodes.length);
	
	            return node;
	        }
	
	        /**
	         * @param   {Node}      node
	         * @param   {number}    end
	         * @param   {string}    [text='']
	         * @return  {void}
	         */
	
	    }, {
	        key: 'closeNode',
	        value: function closeNode(node, end) {
	            var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	
	            node.end = end;
	
	            if (node.isText) {
	                node.text = text.slice(node.start, node.end);
	            }
	        }
	    }]);
	
	    return TreeBuilder;
	}();
	
	exports.default = TreeBuilder;

/***/ },
/* 16 */
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
	            var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
	            return nodes.map(function (node) {
	                return Renderer.renderNode(node, parent);
	            }).join('');
	        }
	    }, {
	        key: 'renderNode',
	        value: function renderNode(node, parent) {
	            var html = '';
	
	            if (node.tag) {
	                html += '<' + node.tag + '>';
	            }
	
	            if (node.childNodes.length) {
	                html += Renderer.renderNodes(node.childNodes, node);
	            } else {
	                // Text leaf node
	
	                html += node.text.length ? node.text : '&#8203;';
	            }
	
	            if (parent && parent.childNodes[parent.childNodes.length - 1] === node && html.match(/ $/)) {
	                html += '&#8203;';
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _State = __webpack_require__(8);
	
	var _State2 = _interopRequireDefault(_State);
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Actions = __webpack_require__(12);
	
	var Actions = _interopRequireWildcard(_Actions);
	
	var _Common = __webpack_require__(19);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (prevState, action) {
	    var nextState = _Util2.default.extend(new _State2.default(), prevState, true);
	
	    switch (action.type) {
	        case Actions.SET_SELECTION:
	            Object.assign(nextState.selection, action.range);
	
	            break;
	        case Actions.LEFT:
	            if (action.range.isCollapsed && action.range.from === 0) return prevState;
	
	            if (action.range.isCollapsed) {
	                nextState.selection.from = nextState.selection.to = action.range.from - 1;
	            } else {
	                nextState.selection.from = nextState.selection.to = action.range.from;
	            }
	
	            break;
	        case Actions.LEFT_SELECT:
	            if (action.range.from === 0) return prevState;
	
	            if (!action.range.isCollapsed && prevState.selection.isLtr) {
	                nextState.selection.to--;
	            } else if (!action.range.isCollapsed && prevState.selection.isRtl) {
	                nextState.selection.from--;
	            } else if (action.range.isCollapsed) {
	                nextState.selection.from--;
	                nextState.selection.direction = _Common.DIRECTION_RTL;
	            }
	
	            break;
	        case Actions.LEFT_SKIP:
	
	            break;
	        case Actions.RIGHT:
	            if (action.range.isCollapsed && action.range.to === prevState.text.length) return prevState;
	
	            if (action.range.isCollapsed) {
	                nextState.selection.from = nextState.selection.to = action.range.to + 1;
	            } else {
	                nextState.selection.from = nextState.selection.to = action.range.to;
	            }
	
	            break;
	        case Actions.RIGHT_SELECT:
	            if (action.range.to === prevState.text.length) return prevState;
	
	            if (!action.range.isCollapsed && prevState.selection.isLtr) {
	                nextState.selection.to++;
	            } else if (!action.range.isCollapsed && prevState.selection.isRtl) {
	                nextState.selection.from++;
	            } else if (action.range.isCollapsed) {
	                nextState.selection.to++;
	                nextState.selection.direction = _Common.DIRECTION_LTR;
	            }
	
	            break;
	        case Actions.RIGHT_SKIP:
	
	            break;
	        case Actions.UP_SELECT:
	            // TODO: get working with keydown, be able to move
	            // up and back down etc
	
	            if (prevState.selection.isRtl) {
	                nextState.selection.from = action.range.from;
	            } else if (prevState.selection.isLtr) {
	                nextState.selection.to = prevState.selection.from;
	                nextState.selection.from = action.range.from;
	                nextState.selection.direction = _Common.DIRECTION_RTL;
	            }
	
	            break;
	        case Actions.DOWN_SELECT:
	            if (prevState.selection.isLtr) {
	                nextState.selection.to = action.range.to;
	            } else if (prevState.selection.isRtl) {
	                nextState.selection.from = prevState.selection.to;
	                nextState.selection.to = action.range.to;
	                nextState.selection.direction = _Common.DIRECTION_LTR;
	            }
	
	            break;
	        case Actions.HOME:
	
	            break;
	        case Actions.HOME_SELECT:
	
	            break;
	        case Actions.END:
	
	            break;
	        case Actions.END_SELECT:
	
	            break;
	        case Actions.PAGE_UP:
	
	            break;
	        case Actions.PAGE_UP_SELECT:
	
	            break;
	        case Actions.PAGE_DOWN:
	
	            break;
	        case Actions.PAGE_DOWN_SELECT:
	
	            break;
	        case Actions.INSERT:
	
	            break;
	        case Actions.BACKSPACE:
	
	            break;
	        case Actions.DELETE:
	
	            break;
	        case Actions.RETURN:
	
	            break;
	        case Actions.SHIFT_RETURN:
	
	            break;
	        default:
	            return prevState;
	    }
	
	    return nextState;
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = {
		"text": "Lorem ipsum dolor sit amet.\nConsectetur adipiscing",
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

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var DIRECTION_LTR = exports.DIRECTION_LTR = Symbol('DIRECTION_LTR');
	var DIRECTION_RTL = exports.DIRECTION_RTL = Symbol('DIRECTION_RTL');

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rte.js.map