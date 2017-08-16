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
	
	var _data = __webpack_require__(19);
	
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
	
	var _Dom = __webpack_require__(2);
	
	var _Dom2 = _interopRequireDefault(_Dom);
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Markup = __webpack_require__(4);
	
	var _Markup2 = _interopRequireDefault(_Markup);
	
	var _Node = __webpack_require__(6);
	
	var _Node2 = _interopRequireDefault(_Node);
	
	var _Caret = __webpack_require__(7);
	
	var _Caret2 = _interopRequireDefault(_Caret);
	
	var _Range = __webpack_require__(8);
	
	var _Range2 = _interopRequireDefault(_Range);
	
	var _State = __webpack_require__(10);
	
	var _State2 = _interopRequireDefault(_State);
	
	var _Action = __webpack_require__(11);
	
	var _Action2 = _interopRequireDefault(_Action);
	
	var _EventHandler = __webpack_require__(12);
	
	var _EventHandler2 = _interopRequireDefault(_EventHandler);
	
	var _TreeBuilder = __webpack_require__(15);
	
	var _TreeBuilder2 = _interopRequireDefault(_TreeBuilder);
	
	var _Renderer = __webpack_require__(16);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	var _reducer = __webpack_require__(17);
	
	var _reducer2 = _interopRequireDefault(_reducer);
	
	var _Actions = __webpack_require__(13);
	
	var _Common = __webpack_require__(9);
	
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
	
	            // TODO: if text but no markups, wrap entire in <p>
	
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
	
	            var range = null;
	
	            if (type === _Actions.SET_SELECTION) {
	                // Detect new selection from browser API
	
	                var selection = window.getSelection();
	
	                range = this.getRangeFromSelection(selection);
	            } else {
	                // Use previous range
	
	                range = this.state.selection;
	            }
	
	            var nextState = [type].reduce(function (prevState, type) {
	                var action = new _Action2.default();
	
	                action.type = type;
	                action.range = range;
	                action.content = content;
	
	                return (0, _reducer2.default)(prevState, action);
	            }, this.state);
	
	            if (!(nextState instanceof _State2.default)) {
	                throw new TypeError('[RichTextEditor] Action type "' + type.toString() + '" did not return a valid state object');
	            }
	
	            if (nextState === this.state) return;
	
	            // TODO: discern between 'push' vs 'replace' commands i.e. inserting a
	            // char vs moving a cursor
	
	            console.log(type);
	
	            this.history.push(nextState);
	
	            this.historyIndex++;
	
	            // Chop off any divergent future state
	
	            this.history.length = this.historyIndex + 1;
	
	            if (type === _Actions.SET_SELECTION) return;
	
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
	                to = _ref.to,
	                isRtl = _ref.isRtl;
	
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
	                selection.removeAllRanges();
	                selection.addRange(range);
	
	                return;
	            }
	
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
	
	            selection.removeAllRanges();
	
	            if (isRtl) {
	                selection.setBaseAndExtent(nodeRight, offsetEnd, nodeLeft, offsetStart);
	            } else {
	                selection.setBaseAndExtent(nodeLeft, offsetStart, nodeRight, offsetEnd);
	            }
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _Markups = __webpack_require__(5);
	
	var Markups = _interopRequireWildcard(_Markups);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
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
	            tag: {
	                get: function get() {
	                    return _this[0];
	                }
	            },
	            start: {
	                get: function get() {
	                    return _this[1];
	                }
	            },
	            end: {
	                get: function get() {
	                    return _this[2];
	                }
	            },
	            type: {
	                get: function get() {
	                    return [Markups.H1, Markups.H2, Markups.H3, Markups.H4, Markups.H5, Markups.H6, Markups.P].indexOf(this[0]) > -1 ? Markups.MARKUP_TYPE_BLOCK : Markups.MARKUP_TYPE_INLINE;
	                }
	            },
	            isBlock: {
	                get: function get() {
	                    return this.type === Markups.MARKUP_TYPE_BLOCK;
	                }
	            },
	            isInline: {
	                get: function get() {
	                    return this.type === Markups.MARKUP_TYPE_INLINE;
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
	var H1 = exports.H1 = 'h1';
	var H2 = exports.H2 = 'h2';
	var H3 = exports.H3 = 'h3';
	var H4 = exports.H4 = 'h4';
	var H5 = exports.H5 = 'h5';
	var H6 = exports.H6 = 'h6';
	var P = exports.P = 'p';
	
	var BLOCK_BREAK = exports.BLOCK_BREAK = '\n\n';
	var LINE_BREAK = exports.LINE_BREAK = '\n';
	
	var STRONG = exports.STRONG = 'strong';
	var EM = exports.EM = 'em';
	var BR = exports.BR = 'br';
	
	var MARKUP_TYPE_INLINE = exports.MARKUP_TYPE_INLINE = Symbol('MARKUP_TYPE_INLINE');
	var MARKUP_TYPE_BLOCK = exports.MARKUP_TYPE_BLOCK = Symbol('MARKUP_TYPE_BLOCK');

/***/ },
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Common = __webpack_require__(9);
	
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
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var DIRECTION_LTR = exports.DIRECTION_LTR = Symbol('DIRECTION_LTR');
	var DIRECTION_RTL = exports.DIRECTION_RTL = Symbol('DIRECTION_RTL');

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Range = __webpack_require__(8);
	
	var _Range2 = _interopRequireDefault(_Range);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var State = function () {
	    function State() {
	        _classCallCheck(this, State);
	
	        this.text = '';
	        this.markups = [];
	        this.selection = new _Range2.default();
	        this.activeBlockMarkup = null;
	        this.activeInlineMarkups = [];
	        this.envelopedBlockMarkups = [];
	
	        Object.seal(this);
	    }
	
	    _createClass(State, [{
	        key: 'isTagActive',
	        value: function isTagActive(tag) {
	            for (var i = 0, markup; markup = this.activeInlineMarkups[i]; i++) {
	                if (markup[0] === tag) return true;
	            }
	
	            return false;
	        }
	    }, {
	        key: 'length',
	        get: function get() {
	            return this.text.length;
	        }
	    }]);
	
	    return State;
	}();
	
	exports.default = State;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Action = function Action() {
	    _classCallCheck(this, Action);
	
	    this.type = null;
	    this.range = null;
	    this.content = '';
	
	    Object.seal(this);
	};
	
	exports.default = Action;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Actions = __webpack_require__(13);
	
	var Actions = _interopRequireWildcard(_Actions);
	
	var _Keys = __webpack_require__(14);
	
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
	            root.addEventListener('mousedown', this.delegator);
	            window.addEventListener('mouseup', this.delegator);
	        }
	    }, {
	        key: 'unbindEvents',
	        value: function unbindEvents(root) {
	            root.removeEventListener('keypress', this.delegator);
	            root.removeEventListener('keydown', this.delegator);
	            root.removeEventListener('click', this.delegator);
	            root.addEventListener('mousedown', this.delegator);
	            window.addEventListener('mouseup', this.delegator);
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
	        key: 'handleKeypress',
	        value: function handleKeypress(e, richTextEditor) {
	            e.preventDefault();
	
	            richTextEditor.applyAction(Actions.INSERT, e.key);
	        }
	    }, {
	        key: 'handleMouseup',
	        value: function handleMouseup(e, richTextEditor) {
	            if (richTextEditor.dom.root !== document.activeElement) return;
	
	            richTextEditor.applyAction(Actions.SET_SELECTION);
	        }
	    }, {
	        key: 'handleMousedown',
	        value: function handleMousedown(e, richTextEditor) {
	            richTextEditor.applyAction(Actions.SET_SELECTION);
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
	                    case Keys.B:
	                        actionType = Actions.TOGGLE_BOLD;
	
	                        e.preventDefault();
	
	                        break;
	                    case Keys.I:
	                        actionType = Actions.TOGGLE_ITALIC;
	
	                        e.preventDefault();
	
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
	
	                    e.preventDefault();
	
	                    break;
	                case Keys.BACKSPACE:
	                    actionType = Actions.BACKSPACE;
	
	                    e.preventDefault();
	
	                    break;
	                case Keys.DELETE:
	                    actionType = Actions.DELETE;
	
	                    e.preventDefault();
	
	                    break;
	                case Keys.ARROW_LEFT:
	                case Keys.ARROW_RIGHT:
	                case Keys.ARROW_UP:
	                case Keys.ARROW_DOWN:
	                    actionType = Actions.SET_SELECTION;
	
	                    break;
	            }
	
	            if (!actionType || actionType === Actions.NONE) return;
	
	            setTimeout(function () {
	                return richTextEditor.applyAction(actionType);
	            });
	        }
	    }]);
	
	    return EventHandler;
	}();
	
	exports.default = EventHandler;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SET_SELECTION = exports.SET_SELECTION = Symbol('SET_SELECTION');
	var INSERT = exports.INSERT = Symbol('ACTION_TYPE_INSERT');
	var BACKSPACE = exports.BACKSPACE = Symbol('ACTION_TYPE_BACKSPACE');
	var DELETE = exports.DELETE = Symbol('ACTION_TYPE_DELETE');
	var RETURN = exports.RETURN = Symbol('ACTION_TYPE_RETURN');
	var SHIFT_RETURN = exports.SHIFT_RETURN = Symbol('ACTION_TYPE_SHIFT_RETURN');
	var TOGGLE_BOLD = exports.TOGGLE_BOLD = Symbol('ACTION_TYPE_TOGGLE_BOLD');
	var TOGGLE_ITALIC = exports.TOGGLE_ITALIC = Symbol('ACTION_TYPE_TOGGLE_ITALIC');
	var NONE = exports.NONE = Symbol('ACTION_TYPE_NONE');

/***/ },
/* 14 */
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
	var B = exports.B = 'b';
	var I = exports.I = 'i';

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Node = __webpack_require__(6);
	
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
	
	var _State = __webpack_require__(10);
	
	var _State2 = _interopRequireDefault(_State);
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Actions = __webpack_require__(13);
	
	var Actions = _interopRequireWildcard(_Actions);
	
	var _Markups = __webpack_require__(5);
	
	var _Editor = __webpack_require__(18);
	
	var _Editor2 = _interopRequireDefault(_Editor);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (prevState, action) {
	    switch (action.type) {
	        case Actions.SET_SELECTION:
	            {
	                var nextState = _Util2.default.extend(new _State2.default(), prevState, true);
	
	                Object.assign(nextState.selection, action.range);
	
	                _Editor2.default.setActiveMarkups(nextState, action.range);
	
	                return nextState;
	            }
	        case Actions.INSERT:
	            {
	                return _Editor2.default.insert(prevState, { from: action.range.from, to: action.range.to }, action.content);
	            }
	        case Actions.BACKSPACE:
	            {
	                var fromIndex = action.range.isCollapsed ? action.range.from - 1 : action.range.from;
	
	                // If at start, ignore
	
	                if (action.range.to === 0) return prevState;
	
	                return _Editor2.default.insert(prevState, { from: fromIndex, to: action.range.to }, '');
	            }
	        case Actions.DELETE:
	            {
	                var toIndex = action.range.isCollapsed ? action.range.from + 1 : action.range.to;
	
	                // If at end, ignore
	
	                if (action.range.from === prevState.text.length) return prevState;
	
	                return _Editor2.default.insert(prevState, { from: action.range.from, to: toIndex }, '');
	            }
	        case Actions.RETURN:
	            return _Editor2.default.insert(prevState, action.range, '\n');
	        case Actions.SHIFT_RETURN:
	
	            break;
	        case Actions.TOGGLE_BOLD:
	            {
	                var _nextState = null;
	
	                // TODO: if collapsed, simply change state to disable/enable active
	                // markup, any further set selections will reset it as appropriate
	
	                if (prevState.isTagActive(_Markups.STRONG)) {
	                    _nextState = _Editor2.default.removeInlineMarkup(prevState, _Markups.STRONG, action.range.from, action.range.to);
	                } else {
	                    _nextState = _Editor2.default.addInlineMarkup(prevState, _Markups.STRONG, action.range.from, action.range.to);
	                }
	
	                _Editor2.default.setActiveMarkups(_nextState, action.range);
	
	                return _nextState;
	            }
	        default:
	            return prevState;
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _State = __webpack_require__(10);
	
	var _State2 = _interopRequireDefault(_State);
	
	var _Markup = __webpack_require__(4);
	
	var _Markup2 = _interopRequireDefault(_Markup);
	
	var _Util = __webpack_require__(3);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var _Markups = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * A static class of utility functions for performing edits to
	 * the editor state.
	 */
	
	var Editor = function () {
	    function Editor() {
	        _classCallCheck(this, Editor);
	    }
	
	    _createClass(Editor, null, [{
	        key: 'insert',
	
	        /**
	         * Inserts zero or more characters into a range, deleting
	         * the contents of the range. Adjusts all markups affected by
	         * insertion.
	         *
	         * @static
	         * @param {State}  prevState
	         * @param {Range}  range
	         * @param {string} content
	         */
	
	        value: function insert(prevState, range, content) {
	            var nextState = new _State2.default();
	
	            var totalDeleted = range.to - range.from;
	
	            var before = prevState.text.slice(0, range.from);
	            var after = prevState.text.slice(range.to);
	            var totalAdded = content.length;
	            var adjustment = totalAdded - totalDeleted;
	            var totalTrimmed = 0;
	
	            nextState.text = before + content + after;
	
	            nextState.markups = Editor.adjustMarkups(prevState.markups, range.from, range.to, totalAdded, adjustment);
	
	            if (content === _Markups.LINE_BREAK) {
	                nextState.markups = Editor.splitMarkups(nextState.markups, range.from);
	
	                totalTrimmed = Editor.trimWhitespace(nextState, range.from);
	            } else if (content === '') {
	                nextState.markups = Editor.joinMarkups(nextState.markups, range.from);
	            }
	
	            nextState.selection.from = nextState.selection.to = range.from + totalAdded + totalTrimmed;
	
	            Editor.setActiveMarkups(nextState, nextState.selection);
	
	            return nextState;
	        }
	    }, {
	        key: 'addInlineMarkup',
	        value: function addInlineMarkup(prevState, tag, from, to) {
	            var nextState = _Util2.default.extend(new _State2.default(), prevState, true);
	
	            var insertIndex = -1;
	
	            if (prevState.envelopedBlockMarkups.length > 1) {
	                var _ret = function () {
	                    var formattedState = nextState;
	
	                    // Split and delegate the command
	
	                    formattedState.envelopedBlockMarkups.length = 0;
	
	                    prevState.envelopedBlockMarkups.forEach(function (markup, i) {
	                        var formatFrom = i === 0 ? from : markup.start;
	                        var formatTo = i === prevState.envelopedBlockMarkups.length - 1 ? to : markup.end;
	
	                        formattedState = Editor.addInlineMarkup(formattedState, tag, formatFrom, formatTo);
	                    });
	
	                    return {
	                        v: formattedState
	                    };
	                }();
	
	                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	            }
	
	            Editor.ingestMarkups(nextState.markups, tag, from, to);
	
	            for (var i = 0, len = nextState.markups.length; i < len; i++) {
	                var markup = new _Markup2.default(nextState.markups[i]);
	
	                // NB: When inserting an inline markup there should always be at
	                // least one block markup in the array
	
	                insertIndex = i;
	
	                if (markup.start > from) {
	                    // Markup starts after markup to insert, insert at index
	
	                    break;
	                } else if (i === len - 1) {
	                    // Last markup, insert after
	
	                    insertIndex++;
	
	                    break;
	                }
	            }
	
	            nextState.markups.splice(insertIndex, 0, [tag, from, to]);
	
	            Editor.joinMarkups(nextState.markups, from);
	            Editor.joinMarkups(nextState.markups, to);
	
	            return nextState;
	        }
	    }, {
	        key: 'removeInlineMarkup',
	        value: function removeInlineMarkup(prevState, tag, from, to) {
	            var nextState = _Util2.default.extend(new _State2.default(), prevState, true);
	
	            if (prevState.envelopedBlockMarkups.length > 1) {
	                var _ret2 = function () {
	                    var formattedState = nextState;
	
	                    // Split and delegate the command
	
	                    formattedState.envelopedBlockMarkups.length = 0;
	
	                    prevState.envelopedBlockMarkups.forEach(function (markup, i) {
	                        var formatFrom = i === 0 ? from : markup.start;
	                        var formatTo = i === prevState.envelopedBlockMarkups.length - 1 ? to : markup.end;
	
	                        formattedState = Editor.removeInlineMarkup(formattedState, tag, formatFrom, formatTo);
	                    });
	
	                    return {
	                        v: formattedState
	                    };
	                }();
	
	                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	
	            Editor.ingestMarkups(nextState.markups, tag, from, to);
	
	            return nextState;
	        }
	    }, {
	        key: 'replaceBlockMarkup',
	        value: function replaceBlockMarkup() {}
	
	        /**
	         * Adjusts the position/length of existing markups in
	         * response to characters being added/removed.
	         *
	         * @static
	         * @param {Array.<Markup>} markups
	         * @param {number} fromIndex
	         * @param {number} toIndex
	         * @param {number} totalAdded
	         * @param {number} adjustment
	         * @return {Array.<Markups>}
	         */
	
	    }, {
	        key: 'adjustMarkups',
	        value: function adjustMarkups(markups, fromIndex, toIndex, totalAdded, adjustment) {
	            var newMarkups = [];
	
	            for (var i = 0, markup; markup = markups[i]; i++) {
	                var _markup = markup,
	                    _markup2 = _slicedToArray(_markup, 3),
	                    tag = _markup2[0],
	                    markupStart = _markup2[1],
	                    markupEnd = _markup2[2];
	
	                var newMarkup = new _Markup2.default(markup);
	
	                var removeMarkup = false;
	
	                if (!(markup instanceof _Markup2.default)) {
	                    markup = new _Markup2.default(markup);
	                }
	
	                if (markupStart >= fromIndex && markupEnd <= toIndex) {
	                    // Selection completely envelopes markup
	
	                    if (markupStart === fromIndex && (markup.isBlock || markup.isInline && totalAdded > 0)) {
	                        // Markup should be preserved is a) is block element,
	                        // b) is inline and inserting
	                        newMarkup[2] = markupStart + totalAdded;
	                    } else if (!markup.isBlock) {
	                        removeMarkup = true;
	                    }
	                } else if (markupStart <= fromIndex && markupEnd >= toIndex) {
	                    // Selection within markup or equal to markup
	
	                    newMarkup[2] += adjustment;
	
	                    if (markup.isInline && markupStart === fromIndex && fromIndex === toIndex) {
	                        // Collapsed caret at start of inline markup
	
	                        newMarkup[1] += adjustment;
	                    }
	                } else if (markupStart >= toIndex) {
	                    // Markup starts after Selection
	
	                    newMarkup[1] += adjustment;
	                    newMarkup[2] += adjustment;
	                } else if (fromIndex < markupStart && toIndex > markupStart && toIndex < markupEnd) {
	                    // Selection partially envelopes markup from start
	
	                    if (markup.isInline) {
	                        newMarkup[1] += adjustment + (toIndex - markupStart);
	                        newMarkup[2] += adjustment;
	                    } else {
	                        // Previous block markup will consume this one, remove
	
	                        removeMarkup = true;
	                    }
	                } else if (fromIndex > markupStart && fromIndex < markupEnd && toIndex > markupEnd) {
	                    // Selection partially envelopes markup from end
	
	                    if (markup.isInline) {
	                        // Extend inline markup to end of insertion
	
	                        newMarkup[2] = fromIndex + totalAdded;
	                    } else {
	                        var nextBlockMarkup = Editor.getNextBlockMarkup(markups, i);
	
	                        // Extend block markup to end of next block +/- adjustment
	
	                        newMarkup[2] = nextBlockMarkup[2] + adjustment;
	                    }
	                }
	
	                if (!removeMarkup) {
	                    newMarkups.push(newMarkup);
	                }
	            }
	
	            return newMarkups;
	        }
	
	        /**
	         * Returns the next block markup after the markup at the
	         * provided index.
	         *
	         * @static
	         * @param {Array.<Markup>} markups
	         * @param {number} index
	         * @return {(Markup|null)}
	         */
	
	    }, {
	        key: 'getNextBlockMarkup',
	        value: function getNextBlockMarkup(markups, index) {
	            for (var i = index + 1, markup; markup = markups[i]; i++) {
	                if (!(markup instanceof _Markup2.default)) {
	                    markup = new _Markup2.default(markup);
	                }
	
	                if (markup.isBlock) {
	                    return markup;
	                }
	            }
	
	            return null;
	        }
	
	        /**
	         * Trims leading/trailing whitespace from block elements
	         * when a block is split.
	         *
	         * Returns the total adjustment made to the text before the split.
	         *
	         * @param  {State}  nextState
	         * @param  {number} splitIndex
	         * @return {number}
	         */
	
	    }, {
	        key: 'trimWhitespace',
	        value: function trimWhitespace(nextState, splitIndex) {
	            var totalAllTrimmed = 0;
	            var caretAdjustment = 0;
	
	            for (var i = 0; i < nextState.markups.length; i++) {
	                var markupRaw = nextState.markups[i];
	
	                if (totalAllTrimmed !== 0) {
	                    // If previous adjustments have been made, adjust markup
	                    // position accordingly
	
	                    markupRaw[1] += totalAllTrimmed;
	                    markupRaw[2] += totalAllTrimmed;
	                }
	
	                var markup = new _Markup2.default(markupRaw);
	
	                if (!markup.isBlock) continue;
	
	                var before = nextState.text.slice(0, markup.start);
	                var content = nextState.text.slice(markup.start, markup.end);
	                var after = nextState.text.slice(markup.end);
	
	                // Trim whitespace from start and end of blocks
	
	                var trimmed = content.trim();
	                var totalTrimmed = trimmed.length - content.length;
	
	                // TODO: seems not to be quite working.. needs further
	                // investigation?
	
	                if (totalTrimmed === 0) continue;
	
	                totalAllTrimmed += totalTrimmed;
	
	                if (markup.start < splitIndex) {
	                    // If the affected markup starts before the split index,
	                    // increase the total
	
	                    caretAdjustment += totalTrimmed;
	                }
	
	                // Reduce markup end by trimmed amount
	
	                markupRaw[2] += totalTrimmed;
	
	                // Rebuild text
	
	                nextState.text = before + trimmed + after;
	            }
	
	            return caretAdjustment;
	        }
	
	        /**
	         * Splits a markup at the provided index, creating a new markup
	         * of the same type starting a character later. Assumes the addition
	         * of a single new line character, but this could be provided for
	         * further flexibility.
	         *
	         * @param  {Array.<Markup>} markups
	         * @param  {number}         index
	         * @return {Array.<Markup>}
	         */
	
	    }, {
	        key: 'splitMarkups',
	        value: function splitMarkups(markups, index) {
	            for (var i = 0, markup; markup = markups[i]; i++) {
	                var _markup3 = markup,
	                    _markup4 = _slicedToArray(_markup3, 3),
	                    markupTag = _markup4[0],
	                    markupStart = _markup4[1],
	                    markupEnd = _markup4[2];
	
	                var newMarkup = null;
	
	                if (markupStart <= index && markupEnd >= index) {
	                    var newTag = markup.isBlock && markupEnd === index + 1 ? 'p' : markupTag;
	
	                    markup[2] = index;
	
	                    newMarkup = new _Markup2.default([newTag, index + 1, markupEnd]);
	
	                    markups.splice(i + 1, 0, newMarkup);
	
	                    i++;
	                }
	            }
	
	            return markups;
	        }
	
	        /**
	         * Joins two adjacent markups at a provided (known) index.
	         *
	         * @param  {Array.<Markup>} markups
	         * @param  {number} index
	         * @return {Array.<Markup>}
	         */
	
	    }, {
	        key: 'joinMarkups',
	        value: function joinMarkups(markups, index) {
	            var closingInlines = {};
	
	            // TODO: use quick search to find start index
	
	            var closingBlock = null;
	
	            for (var i = 0; i < markups.length; i++) {
	                var markup = new _Markup2.default(markups[i]);
	
	                if (markup.end === index) {
	                    if (markup.isBlock) {
	                        // Block markup closes at index
	
	                        closingBlock = markup;
	                    } else {
	                        closingInlines[markup.tag] = markups[i];
	                    }
	                } else if (markup.start === index) {
	                    var extend = null;
	
	                    if (markup.isBlock && closingBlock) {
	                        // Block markup opens at index, and will touch
	                        // previous block
	
	                        extend = closingBlock;
	                    } else if (markup.isInline && closingInlines[markup.tag]) {
	                        extend = closingInlines[markup.tag];
	                    }
	
	                    if (extend) {
	                        // Markup should be extended
	
	                        extend[2] = markup[2];
	
	                        markups.splice(i, 1);
	
	                        i--;
	                    }
	                } else if (markup.start > index) {
	                    // Passed joining index, done
	
	                    break;
	                }
	            }
	
	            return markups;
	        }
	
	        /**
	         * Removes or shortens any markups matching the provided tag within the
	         * provided range.
	         *
	         * @static
	         * @param {Array.<Markup>} markups
	         * @param {string}         tag
	         * @param {number}         from
	         * @param {number}         to
	         */
	
	    }, {
	        key: 'ingestMarkups',
	        value: function ingestMarkups(markups, tag, from, to) {
	            for (var i = 0, markup; markup = markups[i]; i++) {
	                var _markup5 = markup,
	                    _markup6 = _slicedToArray(_markup5, 3),
	                    markupTag = _markup6[0],
	                    markupStart = _markup6[1],
	                    markupEnd = _markup6[2];
	
	                if (markupTag !== tag) continue;
	
	                if (markupStart >= from && markupEnd <= to) {
	                    // Markup enveloped, remove
	
	                    markups.splice(i, 1);
	
	                    i--;
	                } else if (markupStart < from && markupEnd >= to) {
	                    // Markup overlaps start, shorten by moving end to
	                    // start of selection
	
	                    if (markupEnd > to) {
	                        // Split markup into two
	
	                        var newMarkup = [markupTag, to, markupEnd];
	
	                        markups.splice(i + 1, 0, newMarkup);
	
	                        i++;
	                    }
	
	                    markup[2] = from;
	                } else if (markupStart > from && markupStart < to) {
	                    // Markup overlaps end, shorten by moving start to
	                    // end of selection
	
	                    markup[1] = to;
	                } else if (markupStart === from && markupEnd > to) {
	                    // Markup envelops range from start
	
	                    markup[1] = to;
	                }
	            }
	        }
	
	        /**
	         * Determines which block and inline markups should be "active"
	         * or "enveloped" for particular selection.
	         *
	         * @static
	         * @param  {State} state
	         * @param  {Range} range
	         * @return {void}
	         */
	
	    }, {
	        key: 'setActiveMarkups',
	        value: function setActiveMarkups(state, range) {
	            state.activeBlockMarkup = null;
	
	            state.activeInlineMarkups.length = state.envelopedBlockMarkups.length = 0;
	
	            var adjacentInlineMarkups = [];
	            var parentBlock = null;
	
	            for (var i = 0; i < state.markups.length; i++) {
	                var markup = new _Markup2.default(state.markups[i]);
	                var lastAdjacent = adjacentInlineMarkups[adjacentInlineMarkups.length - 1];
	
	                // Active markups are those that surround the start of the
	                // selection and should be highlighted in any UI
	
	                if (markup.start <= range.from && markup.end >= range.from) {
	                    if (markup.isBlock) {
	                        // Only one block markup may be active at a time
	                        // (the first one)
	
	                        state.activeBlockMarkup = markup;
	                    } else if (markup.end >= range.to) {
	                        // Simple enveloped inline markup
	
	                        state.activeInlineMarkups.push(markup);
	                    } else if (markup.end === parentBlock.end) {
	                        // Potential first adjacent inline markup
	
	                        adjacentInlineMarkups.push(markup);
	
	                        continue;
	                    }
	                }
	
	                if (lastAdjacent && lastAdjacent.tag === markup.tag && (markup.start === parentBlock.start && markup.end >= range.to || markup.start === parentBlock.start && markup.end === parentBlock.end)) {
	                    // Continuation or end of an adjacent inline markup
	
	                    adjacentInlineMarkups.push(markup);
	
	                    if (range.to <= markup.end) {
	                        var _state$activeInlineMa;
	
	                        // Final adjacent inline markup, move all to state
	
	                        (_state$activeInlineMa = state.activeInlineMarkups).push.apply(_state$activeInlineMa, adjacentInlineMarkups);
	                    }
	                } else if (markup.isInline) {
	                    // Doesn't match tag, or not a continuation, reset
	
	                    adjacentInlineMarkups.length = 0;
	                }
	
	                if (!markup.isBlock) continue;
	
	                parentBlock = markup;
	
	                // Enveloped block markups are those that are partially or
	                // completely enveloped by the selection.
	
	                if (markup.start <= range.from && markup.end >= range.from || markup.start <= range.to && markup.end >= range.from) {
	                    state.envelopedBlockMarkups.push(markup);
	                }
	            }
	        }
	    }]);
	
	    return Editor;
	}();
	
	exports.default = Editor;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"text": "Lorem ipsum dolor sit amet.\nConsectetur adipiscing\nfoo",
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
			],
			[
				"h3",
				51,
				54
			]
		]
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rte.js.map