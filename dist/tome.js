(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tome"] = factory();
	else
		root["tome"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MarkupTag;
(function (MarkupTag) {
    MarkupTag["H1"] = "h1";
    MarkupTag["H2"] = "h2";
    MarkupTag["H3"] = "h3";
    MarkupTag["H4"] = "h4";
    MarkupTag["H5"] = "h5";
    MarkupTag["H6"] = "h6";
    MarkupTag["P"] = "p";
    MarkupTag["TEXT"] = "#text";
    MarkupTag["BLOCK_BREAK"] = "\n\n";
    MarkupTag["LINE_BREAK"] = "\n";
    MarkupTag["STRONG"] = "strong";
    MarkupTag["EM"] = "em";
    MarkupTag["BR"] = "br";
})(MarkupTag || (MarkupTag = {}));
exports.default = MarkupTag;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.extend = function (target, source, deep) {
        if (deep === void 0) { deep = false; }
        var sourceKeys = [];
        if (!target || typeof target !== 'object') {
            throw new TypeError('[Util#extend] Target must be a valid object');
        }
        if (Array.isArray(source)) {
            for (var i = 0; i < source.length; i++) {
                sourceKeys.push(i);
            }
        }
        else if (source) {
            sourceKeys = Object.keys(source);
        }
        for (var i = 0; i < sourceKeys.length; i++) {
            var key = sourceKeys[i];
            var descriptor = Object.getOwnPropertyDescriptor(source, key);
            // Skip computed properties
            if (typeof descriptor.get === 'function')
                continue;
            if (!deep || typeof source[key] !== 'object') {
                // All non-object primitives, or all properties if
                // shallow extend
                target[key] = source[key];
            }
            else if (Array.isArray(source[key])) {
                // Arrays
                if (!target[key]) {
                    target[key] = [];
                }
                this.extend(target[key], source[key], deep);
            }
            else {
                // Objects
                if (!target[key]) {
                    target[key] = {};
                }
                this.extend(target[key], source[key], deep);
            }
        }
        return target;
    };
    Util.camelCase = function (str) {
        return str.toLowerCase()
            .replace(/([_-][a-z0-9])/g, function ($1) { return $1.toUpperCase().replace(/[_-]/, ''); });
    };
    Util.pascalCase = function (str) {
        return (str = Util.camelCase(str))
            .charAt(0)
            .toUpperCase() + str.slice(1);
    };
    /**
     * Compares two arrays of indices, returning `true` if `pathOne` points
     * to a node at a greater position in the tree.
     */
    Util.isGreaterPath = function (pathOne, pathTwo) {
        var index = 0;
        var valueOne = pathOne[index];
        var valueTwo = pathTwo[index];
        while (typeof valueOne === 'number' && typeof valueTwo === 'number') {
            if (valueOne > valueTwo) {
                return true;
            }
            index++;
            valueOne = pathOne[index];
            valueTwo = pathTwo[index];
        }
        return false;
    };
    Util.index = function (node, includeNonElements) {
        if (includeNonElements === void 0) { includeNonElements = false; }
        var previousSiblingType = includeNonElements ? 'previousSibling' : 'previousElementSibling';
        var index = 0;
        while ((node = node[previousSiblingType]) !== null) {
            index++;
        }
        return index;
    };
    return Util;
}());
exports.default = Util;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TomeSelection_1 = __webpack_require__(6);
var State = /** @class */ (function () {
    function State() {
        this.text = '';
        this.markups = [];
        this.selection = new TomeSelection_1.default();
        this.activeBlockMarkup = null;
        this.activeInlineMarkups = [];
        this.envelopedBlockMarkups = [];
        Object.seal(this);
    }
    Object.defineProperty(State.prototype, "length", {
        get: function () {
            return this.text.length;
        },
        enumerable: true,
        configurable: true
    });
    State.prototype.isTagActive = function (tag) {
        for (var i = 0, markup = void 0; (markup = this.activeInlineMarkups[i]); i++) {
            if (markup[0] === tag)
                return true;
        }
        return false;
    };
    return State;
}());
exports.default = State;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MarkupTag_1 = __webpack_require__(0);
var MarkupType_1 = __webpack_require__(11);
var Markup = /** @class */ (function () {
    function Markup(_a) {
        var tag = _a[0], start = _a[1], end = _a[2];
        this[0] = null;
        this[1] = null;
        this[2] = null;
        this[0] = tag;
        this[1] = start;
        this[2] = end;
        Object.seal(this);
    }
    Object.defineProperty(Markup.prototype, "tag", {
        get: function () {
            return this[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markup.prototype, "start", {
        get: function () {
            return this[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markup.prototype, "end", {
        get: function () {
            return this[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markup.prototype, "type", {
        get: function () {
            return [
                MarkupTag_1.default.H1,
                MarkupTag_1.default.H2,
                MarkupTag_1.default.H3,
                MarkupTag_1.default.H4,
                MarkupTag_1.default.H5,
                MarkupTag_1.default.H6,
                MarkupTag_1.default.P
            ].indexOf(this[0]) > -1 ? MarkupType_1.default.BLOCK : MarkupType_1.default.INLINE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markup.prototype, "isBlock", {
        get: function () {
            return this.type === MarkupType_1.default.BLOCK;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markup.prototype, "isInline", {
        get: function () {
            return this.type === MarkupType_1.default.INLINE;
        },
        enumerable: true,
        configurable: true
    });
    Markup.prototype.toArray = function () {
        return [this[0], this[1], this[2]];
    };
    return Markup;
}());
exports.default = Markup;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ActionType;
(function (ActionType) {
    ActionType["SET_SELECTION"] = "SET_SELECTION";
    ActionType["INSERT"] = "INSERT";
    ActionType["BACKSPACE"] = "BACKSPACE";
    ActionType["DELETE"] = "DELETE";
    ActionType["RETURN"] = "RETURN";
    ActionType["SHIFT_RETURN"] = "SHIFT_RETURN";
    ActionType["TOGGLE_INLINE"] = "TOGGLE_INLINE";
    ActionType["UNDO"] = "UNDO";
    ActionType["REDO"] = "REDO";
    ActionType["NONE"] = "NONE";
})(ActionType || (ActionType = {}));
;
exports.default = ActionType;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MarkupTag_1 = __webpack_require__(0);
var TomeNode = /** @class */ (function () {
    function TomeNode() {
        this.childNodes = [];
        this.parent = null;
        this.start = -1;
        this.end = -1;
        this.tag = null;
        this.text = '';
        this.path = [];
    }
    Object.defineProperty(TomeNode.prototype, "isText", {
        get: function () {
            return this.tag === MarkupTag_1.default.TEXT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TomeNode.prototype, "isBlock", {
        get: function () {
            return [
                MarkupTag_1.default.H1,
                MarkupTag_1.default.H2,
                MarkupTag_1.default.H3,
                MarkupTag_1.default.H4,
                MarkupTag_1.default.H5,
                MarkupTag_1.default.H6,
                MarkupTag_1.default.P
            ].indexOf(this.tag) > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TomeNode.prototype, "isInline", {
        get: function () {
            return !this.isText && !this.isBlock;
        },
        enumerable: true,
        configurable: true
    });
    return TomeNode;
}());
exports.default = TomeNode;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SelectionDirection_1 = __webpack_require__(7);
var TomeSelection = /** @class */ (function () {
    function TomeSelection(from, to, direction) {
        if (from === void 0) { from = -1; }
        if (to === void 0) { to = -1; }
        if (direction === void 0) { direction = SelectionDirection_1.default.LTR; }
        this.from = from;
        this.to = to;
        this.direction = direction;
    }
    Object.defineProperty(TomeSelection.prototype, "isCollapsed", {
        get: function () {
            return this.from === this.to;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TomeSelection.prototype, "isLtr", {
        get: function () {
            return this.direction === SelectionDirection_1.default.LTR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TomeSelection.prototype, "isRtl", {
        get: function () {
            return this.direction === SelectionDirection_1.default.RTL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TomeSelection.prototype, "anchor", {
        get: function () {
            if (this.isLtr) {
                return this.from;
            }
            return this.to;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TomeSelection.prototype, "extent", {
        get: function () {
            if (this.isLtr) {
                return this.to;
            }
            return this.from;
        },
        enumerable: true,
        configurable: true
    });
    return TomeSelection;
}());
exports.default = TomeSelection;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SelectionDirection;
(function (SelectionDirection) {
    SelectionDirection["LTR"] = "LTR";
    SelectionDirection["RTL"] = "RTL";
})(SelectionDirection || (SelectionDirection = {}));
exports.default = SelectionDirection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tome_1 = __webpack_require__(9);
function factory(el, config) {
    if (config === void 0) { config = {}; }
    var tome = new Tome_1.default(el, config);
    return tome;
}
module.exports = factory;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(10);
var Util_1 = __webpack_require__(1);
var Markup_1 = __webpack_require__(3);
var TomeNode_1 = __webpack_require__(5);
var Caret_1 = __webpack_require__(12);
var TomeSelection_1 = __webpack_require__(6);
var State_1 = __webpack_require__(2);
var Action_1 = __webpack_require__(13);
var ConfigRoot_1 = __webpack_require__(14);
var EventHandler_1 = __webpack_require__(16);
var TreeBuilder_1 = __webpack_require__(18);
var Renderer_1 = __webpack_require__(19);
var reducer_1 = __webpack_require__(20);
var ActionType_1 = __webpack_require__(4);
var MarkupTag_1 = __webpack_require__(0);
var SelectionDirection_1 = __webpack_require__(7);
var Tome = /** @class */ (function () {
    function Tome(el, config) {
        this.dom = new Dom_1.default();
        this.eventHandler = new EventHandler_1.default(this);
        this.config = new ConfigRoot_1.default();
        this.root = null;
        this.history = [];
        this.historyIndex = -1;
        this.init(el, config);
    }
    Object.defineProperty(Tome.prototype, "state", {
        get: function () {
            return this.history[this.historyIndex];
        },
        enumerable: true,
        configurable: true
    });
    Tome.prototype.init = function (el, config) {
        Util_1.default.extend(this.config, config, true);
        if (!el.contentEditable) {
            el.contentEditable = true.toString();
        }
        this.dom.root = el;
        this.history.push(this.buildInitialState(this.config.value));
        this.historyIndex++;
        this.render();
        this.eventHandler.bindEvents(this.dom.root);
    };
    Tome.prototype.buildInitialState = function (initialState) {
        var state = Util_1.default.extend(new State_1.default(), initialState);
        if (state.markups.length < 1) {
            state.markups.push(new Markup_1.default([MarkupTag_1.default.P, 0, 0]));
        }
        // TODO: if text but no markups, wrap entire in <p>
        // Coerce triplets into `Markup` if needed
        state.markups = state.markups.map(function (markup) { return Array.isArray(markup) ? new Markup_1.default(markup) : markup; });
        return state;
    };
    Tome.prototype.render = function () {
        this.root = Tome.buildModelFromState(this.state);
        this.dom.root.innerHTML = Renderer_1.default.renderNodes(this.root.childNodes);
    };
    Tome.prototype.undo = function () {
        if (this.historyIndex === 1)
            return;
        var fn = this.config.callbacks.onStateChange;
        this.historyIndex--;
        this.render();
        this.positionCaret(this.state.selection);
        if (typeof fn === 'function') {
            fn(this.state, ActionType_1.default.UNDO);
        }
    };
    Tome.prototype.redo = function () {
        if (this.history.length - 1 === this.historyIndex)
            return;
        var fn = this.config.callbacks.onStateChange;
        this.historyIndex++;
        this.render();
        this.positionCaret(this.state.selection);
        if (typeof fn === 'function') {
            fn(this.state, ActionType_1.default.REDO);
        }
    };
    Tome.prototype.applyAction = function (actionRaw) {
        var action = Object.assign(new Action_1.default(), actionRaw);
        var fn = this.config.callbacks.onStateChange;
        if (action.type === ActionType_1.default.SET_SELECTION) {
            // Detect new selection from browser API
            var selection = window.getSelection();
            if (!selection.anchorNode || !this.dom.root.contains(selection.anchorNode))
                return;
            action.range = this.getRangeFromSelection(selection);
        }
        else {
            // Use previous range
            action.range = this.state.selection;
        }
        var nextState = [action].reduce(reducer_1.default, this.state);
        if (!(nextState instanceof State_1.default)) {
            throw new TypeError("[Tome] Action type \"" + action.type.toString() + "\" did not return a valid state object");
        }
        if (nextState === this.state)
            return;
        Object.freeze(nextState);
        Object.freeze(nextState.markups);
        Object.freeze(nextState.activeInlineMarkups);
        Object.freeze(nextState.envelopedBlockMarkups);
        // TODO: discern between 'push' vs 'replace' commands i.e. inserting a
        // char vs moving a cursor
        // Chop off any divergent future state
        this.history.length = this.historyIndex + 1;
        // Push in new state
        this.history.push(nextState);
        this.historyIndex++;
        if (action.type !== ActionType_1.default.SET_SELECTION) {
            this.render();
            this.positionCaret(this.state.selection);
        }
        if (typeof fn === 'function') {
            fn(this.state, action.type);
        }
    };
    Tome.prototype.getPathFromDomNode = function (domNode) {
        var path = [];
        while (domNode) {
            if (domNode instanceof HTMLElement && domNode === this.dom.root)
                break;
            path.unshift(Util_1.default.index(domNode, true));
            domNode = domNode.parentElement;
        }
        return path;
    };
    Tome.prototype.getNodeByPath = function (path, root) {
        var node = root;
        var index = -1;
        var i = 0;
        while (typeof (index = path[i]) === 'number') {
            node = node.childNodes[index];
            i++;
        }
        return node || null;
    };
    /**
     * @param   {Selection} selection
     * @return  {TomeSelection;}
     */
    Tome.prototype.getRangeFromSelection = function (selection) {
        var anchorPath = this.getPathFromDomNode(selection.anchorNode);
        var virtualAnchorNode = this.getNodeByPath(anchorPath, this.root);
        var from = new Caret_1.default();
        var to = new Caret_1.default();
        var extentPath = anchorPath;
        var virtualExtentNode = virtualAnchorNode;
        var isRtl = false;
        var rangeFrom = -1;
        var rangeTo = -1;
        if (!selection.isCollapsed) {
            extentPath = this.getPathFromDomNode(selection.extentNode);
            virtualExtentNode = this.getNodeByPath(extentPath, this.root);
        }
        // If the anchor is greater than the extent, or both paths are equal
        // but the anchor offset is greater than the extent offset, the range
        // should be considered "RTL"
        isRtl =
            Util_1.default.isGreaterPath(anchorPath, extentPath) ||
                (!Util_1.default.isGreaterPath(extentPath, anchorPath) && selection.anchorOffset > selection.extentOffset);
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
        return new TomeSelection_1.default(rangeFrom, rangeTo, isRtl ? SelectionDirection_1.default.RTL : SelectionDirection_1.default.LTR);
    };
    Tome.prototype.positionCaret = function (_a) {
        var from = _a.from, to = _a.to, direction = _a.direction;
        var range = document.createRange();
        var selection = window.getSelection();
        var childNodes = this.root.childNodes;
        var virtualNode;
        var nodeLeft;
        var nodeRight;
        var offsetStart;
        var offsetEnd;
        for (var i = 0; (virtualNode = childNodes[i]); i++) {
            // Node ends before caret
            if (virtualNode.end < from)
                continue;
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
        for (var i = 0; (virtualNode = childNodes[i]); i++) {
            if (virtualNode.end < to)
                continue;
            if (virtualNode.childNodes.length) {
                childNodes = virtualNode.childNodes;
                i = -1;
                continue;
            }
            offsetEnd = to - virtualNode.start;
            break;
        }
        nodeRight = this.getNodeByPath(virtualNode.path, this.dom.root);
        range.setEnd(nodeRight, offsetEnd);
        selection.removeAllRanges();
        if (direction === SelectionDirection_1.default.LTR) {
            selection.setBaseAndExtent(nodeRight, offsetEnd, nodeLeft, offsetStart);
        }
        else {
            selection.setBaseAndExtent(nodeLeft, offsetStart, nodeRight, offsetEnd);
        }
    };
    Tome.buildModelFromState = function (state) {
        var root = new TomeNode_1.default();
        TreeBuilder_1.default.build(root, state.text, state.markups);
        return root;
    };
    return Tome;
}());
exports.default = Tome;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom = /** @class */ (function () {
    function Dom() {
        this.root = null;
    }
    return Dom;
}());
exports.default = Dom;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MarkupType;
(function (MarkupType) {
    MarkupType[MarkupType["INLINE"] = 0] = "INLINE";
    MarkupType[MarkupType["BLOCK"] = 1] = "BLOCK";
})(MarkupType || (MarkupType = {}));
exports.default = MarkupType;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Caret = /** @class */ (function () {
    function Caret() {
        this.path = null;
        this.node = null;
        this.offset = null;
    }
    return Caret;
}());
exports.default = Caret;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Action = /** @class */ (function () {
    function Action() {
        this.type = null;
        this.range = null;
        this.tag = null;
        this.content = '';
    }
    return Action;
}());
exports.default = Action;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ConfigCallbacks_1 = __webpack_require__(15);
var State_1 = __webpack_require__(2);
var ConfigRoot = /** @class */ (function () {
    function ConfigRoot() {
        this.callbacks = new ConfigCallbacks_1.default();
        this.value = new State_1.default();
        Object.seal(this);
    }
    return ConfigRoot;
}());
exports.default = ConfigRoot;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ConfigCallbacks = /** @class */ (function () {
    function ConfigCallbacks() {
        this.onStateChange = null;
        this.onValueChange = null;
        Object.seal(this);
    }
    return ConfigCallbacks;
}());
exports.default = ConfigCallbacks;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __webpack_require__(1);
var ActionType_1 = __webpack_require__(4);
var Keypress_1 = __webpack_require__(17);
var MarkupTag_1 = __webpack_require__(0);
var SELECTION_DELAY = 10;
var EventHandler = /** @class */ (function () {
    function EventHandler(tome) {
        this.tome = null;
        this.boundDelegator = null;
        this.tome = tome;
        this.boundDelegator = this.delegator.bind(this);
    }
    EventHandler.prototype.bindEvents = function (root) {
        root.addEventListener('keypress', this.boundDelegator);
        root.addEventListener('keydown', this.boundDelegator);
        root.addEventListener('mousedown', this.boundDelegator);
        window.addEventListener('mouseup', this.boundDelegator);
    };
    EventHandler.prototype.unbindEvents = function (root) {
        root.removeEventListener('keypress', this.boundDelegator);
        root.removeEventListener('keydown', this.boundDelegator);
        root.removeEventListener('click', this.boundDelegator);
        root.addEventListener('mousedown', this.boundDelegator);
        window.addEventListener('mouseup', this.boundDelegator);
    };
    EventHandler.prototype.delegator = function (e) {
        var eventType = e.type;
        var fn = this['handle' + Util_1.default.pascalCase(eventType)];
        if (typeof fn !== 'function') {
            throw new Error("[EventHandler] No handler found for event \"" + eventType + "\"");
        }
        fn.call(this, e);
    };
    EventHandler.prototype.handleKeypress = function (e) {
        e.preventDefault();
        this.tome.applyAction({ type: ActionType_1.default.INSERT, content: e.key });
    };
    EventHandler.prototype.handleMouseup = function (e) {
        if (this.tome.dom.root !== document.activeElement)
            return;
        this.tome.applyAction({ type: ActionType_1.default.SET_SELECTION });
    };
    EventHandler.prototype.handleMousedown = function (e) {
        this.tome.applyAction({ type: ActionType_1.default.SET_SELECTION });
    };
    EventHandler.prototype.handleKeydown = function (e) {
        var _this = this;
        var key = e.key.toLowerCase();
        var action = {};
        if (e.metaKey) {
            switch (key) {
                case Keypress_1.default.A:
                    action = { type: ActionType_1.default.SET_SELECTION };
                    break;
                case Keypress_1.default.B:
                    action = { type: ActionType_1.default.TOGGLE_INLINE, tag: MarkupTag_1.default.STRONG };
                    e.preventDefault();
                    break;
                case Keypress_1.default.I:
                    action = { type: ActionType_1.default.TOGGLE_INLINE, tag: MarkupTag_1.default.EM };
                    e.preventDefault();
                    break;
                // case Keypress.C:
                //    command = 'copy';
                //     break;
                // case Keypress.V:
                //     command = 'paste';
                //     break;
                // case Keypress.S:
                //     command = 'save';
                //     break;
                case Keypress_1.default.Z:
                    e.preventDefault();
                    return e.shiftKey ? this.tome.redo() : this.tome.undo();
            }
        }
        switch (key) {
            case Keypress_1.default.ENTER:
                action = { type: e.shiftKey ? ActionType_1.default.SHIFT_RETURN : ActionType_1.default.RETURN };
                e.preventDefault();
                break;
            case Keypress_1.default.BACKSPACE:
                action = { type: ActionType_1.default.BACKSPACE };
                e.preventDefault();
                break;
            case Keypress_1.default.DELETE:
                action = { type: ActionType_1.default.DELETE };
                e.preventDefault();
                break;
            case Keypress_1.default.ARROW_LEFT:
            case Keypress_1.default.ARROW_RIGHT:
            case Keypress_1.default.ARROW_UP:
            case Keypress_1.default.ARROW_DOWN:
                action = { type: ActionType_1.default.SET_SELECTION };
                break;
        }
        if (!action || action.type === ActionType_1.default.NONE)
            return;
        setTimeout(function () { return _this.tome.applyAction(action); }, SELECTION_DELAY);
    };
    return EventHandler;
}());
exports.default = EventHandler;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Keypress;
(function (Keypress) {
    Keypress["ENTER"] = "enter";
    Keypress["BACKSPACE"] = "backspace";
    Keypress["DELETE"] = "delete";
    Keypress["ARROW_UP"] = "arrowup";
    Keypress["ARROW_DOWN"] = "arrowdown";
    Keypress["ARROW_LEFT"] = "arrowleft";
    Keypress["ARROW_RIGHT"] = "arrowright";
    Keypress["A"] = "a";
    Keypress["C"] = "c";
    Keypress["V"] = "v";
    Keypress["S"] = "s";
    Keypress["Z"] = "z";
    Keypress["B"] = "b";
    Keypress["I"] = "i";
})(Keypress || (Keypress = {}));
exports.default = Keypress;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TomeNode_1 = __webpack_require__(5);
var MarkupTag_1 = __webpack_require__(0);
var TreeBuilder = /** @class */ (function () {
    function TreeBuilder() {
    }
    TreeBuilder.build = function (root, text, markups) {
        var openMarkups = [];
        var node = root;
        var textNode = null;
        node.start = 0;
        node.end = text.length;
        for (var i = 0; i <= text.length; i++) {
            var reOpen = [];
            var j = void 0;
            var markup = void 0;
            var hasOpened = false;
            var hasClosed = false;
            for (j = 0; (markup = markups[j]); j++) {
                // Out of range, break
                if (markup[1] > i)
                    break;
                // If markup end is before current index or is currently
                // open, continue
                if (markup[2] < i || openMarkups.indexOf(markup) > -1)
                    continue;
                // Markup opens at, or is open at index (and not in open
                // markups array)
                if (textNode) {
                    // If open text node, close it before opening sibling
                    textNode = TreeBuilder.closeTextNode(textNode, text, i);
                }
                // Open a new markup at index
                var newNode = TreeBuilder.createNode(markup[0], node, i, markup[2]);
                node.childNodes.push(newNode);
                openMarkups.push(markup);
                node = newNode;
                hasOpened = true;
            }
            if (hasOpened) {
                // A markup has been opened at index
                if (textNode) {
                    // A text node exists, close it
                    textNode = TreeBuilder.closeTextNode(textNode, text, i);
                }
                else {
                    // A text node does not exist and we are now at a leaf,
                    // so create one
                    textNode = TreeBuilder.createTextNode(node, node.start);
                    node.childNodes.push(textNode);
                }
            }
            for (j = markups.length - 1; (markup = markups[j]); j--) {
                if (markup[2] !== i)
                    continue;
                // Markup to be closed at index
                if (textNode) {
                    // A text node is open within the markup, close it and
                    // nullify ref
                    textNode = TreeBuilder.closeTextNode(textNode, text, i);
                }
                if (markup[1] === markup[2]) {
                    // The markup is collapsed, and has closed immediately,
                    // therefore nothing has opened at the index
                    hasOpened = false;
                }
                // For each open markup, close it until the markup to be
                // closed is found
                while (openMarkups.length > 0) {
                    var closed_1 = openMarkups.pop();
                    if (closed_1 !== markup) {
                        // If a child of the markup to be closed, push into
                        // `reOpen` array
                        reOpen.push(closed_1);
                    }
                    node.end = i;
                    node = node.parent;
                    // If at desired markup, break
                    if (closed_1 === markup)
                        break;
                }
                // Mark that at least one markup has been closed at index
                hasClosed = true;
            }
            while (reOpen.length > 0) {
                // Reopen each markup in the `reOpen` array
                markup = reOpen.pop();
                var newNode = TreeBuilder.createNode(markup[0], node, i, markup[2]);
                node.childNodes.push(newNode);
                openMarkups.push(markup);
                node = newNode;
                hasOpened = true;
            }
            if ((i !== text.length && hasClosed && !hasOpened) || (hasOpened && !textNode)) {
                // Node closed and nothing to be opened, or node (re)opened
                textNode = TreeBuilder.createTextNode(node, i);
                node.childNodes.push(textNode);
            }
        }
    };
    TreeBuilder.createTextNode = function (parent, start) {
        return TreeBuilder.createNode(MarkupTag_1.default.TEXT, parent, start, -1);
    };
    TreeBuilder.closeTextNode = function (textNode, text, end) {
        textNode.end = end;
        textNode.text = text.slice(textNode.start, textNode.end);
        return null;
    };
    TreeBuilder.createNode = function (tag, parent, start, end) {
        var node = new TomeNode_1.default();
        node.tag = tag;
        node.parent = parent;
        node.start = start;
        node.end = end;
        node.path = parent.path.slice();
        node.path.push(parent.childNodes.length);
        return node;
    };
    return TreeBuilder;
}());
exports.default = TreeBuilder;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MarkupTag_1 = __webpack_require__(0);
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.renderNodes = function (nodes, parent) {
        if (parent === void 0) { parent = null; }
        return nodes.map(function (node) { return Renderer.renderNode(node, parent); }).join('');
    };
    Renderer.renderNode = function (node, parent) {
        var html = '';
        if (node.tag !== MarkupTag_1.default.TEXT) {
            html += '<' + node.tag + '>';
        }
        if (node.childNodes.length) {
            html += Renderer.renderNodes(node.childNodes, node);
        }
        else {
            // Text leaf node
            html += node.text.length ? node.text : '&#8203;';
        }
        if (parent && parent.childNodes[parent.childNodes.length - 1] === node && html.match(/ $/)) {
            html += '&#8203;';
        }
        if (node.tag !== MarkupTag_1.default.TEXT) {
            html += '</' + node.tag + '>';
        }
        return html;
    };
    return Renderer;
}());
exports.default = Renderer;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = __webpack_require__(2);
var Util_1 = __webpack_require__(1);
var ActionType_1 = __webpack_require__(4);
var Editor_1 = __webpack_require__(21);
var Markup_1 = __webpack_require__(3);
exports.default = function (prevState, action) {
    switch (action.type) {
        case ActionType_1.default.SET_SELECTION: {
            var nextState = Util_1.default.extend(new State_1.default(), prevState, true);
            nextState.markups = prevState.markups.map(function (markup) { return new Markup_1.default(markup.toArray()); });
            Object.assign(nextState.selection, action.range);
            Editor_1.default.setActiveMarkups(nextState, action.range);
            return nextState;
        }
        case ActionType_1.default.INSERT: {
            return Editor_1.default.insert(prevState, { from: action.range.from, to: action.range.to }, action.content);
        }
        case ActionType_1.default.BACKSPACE: {
            var fromIndex = action.range.isCollapsed ? action.range.from - 1 : action.range.from;
            // If at start, ignore
            if (action.range.to === 0)
                return prevState;
            return Editor_1.default.insert(prevState, { from: fromIndex, to: action.range.to }, '');
        }
        case ActionType_1.default.DELETE: {
            var toIndex = action.range.isCollapsed ? action.range.from + 1 : action.range.to;
            // If at end, ignore
            if (action.range.from === prevState.text.length)
                return prevState;
            return Editor_1.default.insert(prevState, { from: action.range.from, to: toIndex }, '');
        }
        case ActionType_1.default.RETURN:
            return Editor_1.default.insert(prevState, action.range, '\n');
        case ActionType_1.default.SHIFT_RETURN:
            break;
        case ActionType_1.default.TOGGLE_INLINE: {
            var nextState = void 0;
            // TODO: if collapsed, simply change state to disable/enable active
            // markup, any further set selections will reset it as appropriate
            if (prevState.isTagActive(action.tag)) {
                nextState = Editor_1.default.removeInlineMarkup(prevState, action.tag, action.range.from, action.range.to);
            }
            else {
                nextState = Editor_1.default.addInlineMarkup(prevState, action.tag, action.range.from, action.range.to);
            }
            Editor_1.default.setActiveMarkups(nextState, action.range);
            return nextState;
        }
        default:
            return prevState;
    }
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = __webpack_require__(2);
var Markup_1 = __webpack_require__(3);
var MarkupTag_1 = __webpack_require__(0);
var Util_1 = __webpack_require__(1);
/**
 * A static class of utility functions for performing edits to
 * the editor state.
 */
var Editor = /** @class */ (function () {
    function Editor() {
    }
    /**
     * Inserts zero or more characters into a range, deleting
     * the contents of the range. Adjusts all markups affected by
     * insertion.
     */
    Editor.insert = function (prevState, range, content) {
        var nextState = new State_1.default();
        var totalDeleted = range.to - range.from;
        var before = prevState.text.slice(0, range.from);
        var after = prevState.text.slice(range.to);
        var totalAdded = content.length;
        var adjustment = totalAdded - totalDeleted;
        var totalTrimmed = 0;
        nextState.text = before + content + after;
        nextState.markups = Editor.adjustMarkups(prevState.markups, range.from, range.to, totalAdded, adjustment);
        if (content === MarkupTag_1.default.LINE_BREAK) {
            nextState.markups = Editor.splitMarkups(nextState.markups, range.from);
            totalTrimmed = Editor.trimWhitespace(nextState, range.from);
        }
        else if (content === '') {
            nextState.markups = Editor.joinMarkups(nextState.markups, range.from);
            nextState.markups = Editor.joinMarkups(nextState.markups, range.to);
        }
        nextState.selection.from =
            nextState.selection.to = range.from + totalAdded + totalTrimmed;
        Editor.setActiveMarkups(nextState, nextState.selection);
        return nextState;
    };
    Editor.addInlineMarkup = function (prevState, tag, from, to, markup) {
        if (markup === void 0) { markup = null; }
        var nextState = Util_1.default.extend(new State_1.default(), prevState, true);
        var enveloped = prevState.envelopedBlockMarkups || [];
        nextState.markups = prevState.markups.map(function (markup) { return new Markup_1.default(markup.toArray()); });
        var insertIndex = -1;
        if (enveloped.length > 1) {
            var formattedState_1 = nextState;
            // Split and delegate the command
            formattedState_1.envelopedBlockMarkups.length = 0;
            enveloped.forEach(function (markup, i) {
                var formatFrom = i === 0 ? from : markup[1];
                var formatTo = i === enveloped.length - 1 ? to : markup[2];
                formattedState_1 = Editor.addInlineMarkup(formattedState_1, tag, formatFrom, formatTo, markup);
            });
            return formattedState_1;
        }
        // Single block markup
        markup = markup || enveloped[0];
        if (markup) {
            // ensure range does not extend over breaks
            // around markups
            from = from < markup[1] ? markup[1] : from;
            to = to > markup[2] ? markup[2] : to;
        }
        // Remove all existing inline markups of type within range
        Editor.ingestMarkups(nextState.markups, tag, from, to);
        for (var i = 0, len = nextState.markups.length; i < len; i++) {
            var markup_1 = new Markup_1.default(nextState.markups[i].toArray());
            // NB: When inserting an inline markup there should always be at
            // least one block markup in the array
            insertIndex = i;
            if (markup_1.start > from) {
                // Markup starts after markup to insert, insert at index
                break;
            }
            else if (i === len - 1) {
                // Last markup, insert after
                insertIndex++;
                break;
            }
        }
        nextState.markups.splice(insertIndex, 0, new Markup_1.default([tag, from, to]));
        Editor.joinMarkups(nextState.markups, from);
        Editor.joinMarkups(nextState.markups, to);
        return nextState;
    };
    Editor.removeInlineMarkup = function (prevState, tag, from, to) {
        var nextState = Util_1.default.extend(new State_1.default(), prevState, true);
        var enveloped = prevState.envelopedBlockMarkups || [];
        nextState.markups = prevState.markups.map(function (markup) { return new Markup_1.default(markup.toArray()); });
        if (enveloped.length > 1) {
            var formattedState_2 = nextState;
            // Split and delegate the command
            formattedState_2.envelopedBlockMarkups.length = 0;
            enveloped.forEach(function (markup, i) {
                var formatFrom = i === 0 ? from : markup.start;
                var formatTo = i === enveloped.length - 1 ? to : markup.end;
                formattedState_2 = Editor.removeInlineMarkup(formattedState_2, tag, formatFrom, formatTo);
            });
            return formattedState_2;
        }
        Editor.ingestMarkups(nextState.markups, tag, from, to);
        return nextState;
    };
    Editor.replaceBlockMarkup = function () {
    };
    /**
     * Adjusts the position/length of existing markups in
     * response to characters being added/removed.
     */
    Editor.adjustMarkups = function (markups, fromIndex, toIndex, totalAdded, adjustment) {
        var newMarkups = [];
        for (var i = 0, markup = void 0; (markup = markups[i]); i++) {
            var newMarkup = new Markup_1.default(markup.toArray());
            var removeMarkup = false;
            if (markup.start >= fromIndex && markup.end <= toIndex) {
                // Selection completely envelopes markup
                if (markup.start === fromIndex && (markup.isBlock || markup.isInline && totalAdded > 0)) {
                    // Markup should be preserved is a) is block element,
                    // b) is inline and inserting
                    newMarkup[2] = markup.start + totalAdded;
                }
                else if (!markup.isBlock || markup.start > fromIndex) {
                    removeMarkup = true;
                }
            }
            else if (markup.start <= fromIndex && markup.end >= toIndex) {
                // Selection within markup or equal to markup
                newMarkup[2] += adjustment;
                if (markup.isInline && (markup.start === fromIndex && fromIndex === toIndex)) {
                    // Collapsed caret at start of inline markup
                    newMarkup[1] += adjustment;
                }
            }
            else if (markup.start >= toIndex) {
                // Markup starts after Selection
                newMarkup[1] += adjustment;
                newMarkup[2] += adjustment;
            }
            else if (fromIndex < markup.start && toIndex > markup.start && toIndex < markup.end) {
                // Selection partially envelopes markup from start
                if (markup.isInline) {
                    newMarkup[1] += (adjustment + (toIndex - markup.start));
                    newMarkup[2] += adjustment;
                }
                else {
                    // Previous block markup will consume this one, remove
                    removeMarkup = true;
                }
            }
            else if (fromIndex > markup.start && fromIndex < markup.end && toIndex > markup.end) {
                // Selection partially envelopes markup from end
                if (markup.isInline) {
                    // Extend inline markup to end of insertion
                    newMarkup[2] = fromIndex + totalAdded;
                }
                else {
                    var closingBlockMarkup = Editor.getClosingBlockMarkup(markups, i, toIndex);
                    // Extend block markup to end of closing block +/-
                    // adjustment
                    newMarkup[2] = closingBlockMarkup[2] + adjustment;
                }
            }
            if (!removeMarkup) {
                newMarkups.push(newMarkup);
            }
        }
        return newMarkups;
    };
    /**
     * Returns the closing block markup after the markup at the
     * provided index.
     */
    Editor.getClosingBlockMarkup = function (markups, markupIndex, toIndex) {
        for (var i = markupIndex + 1, markup = void 0; (markup = markups[i]); i++) {
            if (!(markup instanceof Markup_1.default)) {
                markup = new Markup_1.default(markup);
            }
            if (markup.isBlock && markup.start <= toIndex && markup.end >= toIndex) {
                return markup;
            }
        }
        return null;
    };
    /**
     * Trims leading/trailing whitespace from block elements
     * when a block is split.
     *
     * Returns the total adjustment made to the text before the split.
     */
    Editor.trimWhitespace = function (nextState, splitIndex) {
        var totalAllTrimmed = 0;
        var caretAdjustment = 0;
        var trimmedIndex = -1;
        for (var i = 0; i < nextState.markups.length; i++) {
            var markupRaw = nextState.markups[i];
            if (totalAllTrimmed !== 0 && markupRaw[1] >= trimmedIndex) {
                // If previous adjustments have been made, adjust
                // subsequent markups' positions accordingly
                markupRaw[1] += totalAllTrimmed;
                markupRaw[2] += totalAllTrimmed;
            }
            var markup = new Markup_1.default(markupRaw.toArray());
            if (!markup.isBlock)
                continue;
            var before_1 = nextState.text.slice(0, markup.start);
            var content = nextState.text.slice(markup.start, markup.end);
            var after_1 = nextState.text.slice(markup.end);
            var trimmed = content;
            // Trim whitespace from start and end of blocks
            if (trimmed.charAt(0) === ' ') {
                trimmedIndex = markup.start;
                trimmed = trimmed.slice(1);
            }
            if (trimmed.charAt(trimmed.length - 1) === ' ') {
                trimmedIndex = markup.end - 1;
                trimmed = trimmed.slice(0, -1);
            }
            var totalTrimmed = trimmed.length - content.length;
            if (totalTrimmed === 0)
                continue;
            totalAllTrimmed += totalTrimmed;
            if (markup.start < splitIndex) {
                // If the affected markup starts before the split index,
                // increase the total
                caretAdjustment += totalTrimmed;
            }
            // Reduce markup end by trimmed amount
            markupRaw[2] += totalTrimmed;
            // Rebuild text
            nextState.text = before_1 + trimmed + after_1;
        }
        return caretAdjustment;
    };
    /**
     * Splits a markup at the provided index, creating a new markup
     * of the same type starting a character later. Assumes the addition
     * of a single new line character, but this could be provided for
     * further flexibility.
     */
    Editor.splitMarkups = function (markups, index) {
        for (var i = 0; i < markups.length; i++) {
            var markup = markups[i];
            var originalMarkupEnd = markup.end;
            var newMarkup = null;
            if (markup.start < index && markup.end > index) {
                var newStartIndex = index + 1;
                var newTag = markup.isBlock && markup.end === newStartIndex ? MarkupTag_1.default.P : markup.tag;
                var j = i + 1;
                var insertIndex = -1;
                // Contract markup
                markup[2] = index;
                newMarkup = new Markup_1.default([newTag, newStartIndex, originalMarkupEnd]);
                // Find appropriate insertion index
                for (; j < markups.length; j++) {
                    var siblingMarkup = markups[j];
                    if (siblingMarkup.start === newStartIndex) {
                        insertIndex = newMarkup.isBlock ? j : j + 1;
                        break;
                    }
                    else if (siblingMarkup.start > newStartIndex) {
                        insertIndex = j;
                        break;
                    }
                }
                if (insertIndex < 0) {
                    // If no insert index found, insert at end
                    insertIndex = j;
                }
                markups.splice(insertIndex, 0, newMarkup);
                // if (insertIndex === j) {
                //     i = insertIndex;
                // }
            }
        }
        return markups;
    };
    /**
     * Joins two adjacent markups at a provided (known) index.
     */
    Editor.joinMarkups = function (markups, index) {
        var closingInlines = {};
        // TODO: use quick search to find start index
        var closingBlock = null;
        for (var i = 0; i < markups.length; i++) {
            var markup = new Markup_1.default(markups[i].toArray());
            if (markup.end === index) {
                if (markup.isBlock) {
                    // Block markup closes at index
                    closingBlock = markups[i];
                }
                else {
                    closingInlines[markup.tag] = markups[i];
                }
            }
            else if (markup.start === index) {
                var extend = null;
                if (markup.isBlock && closingBlock) {
                    // Block markup opens at index, and will touch
                    // previous block
                    extend = closingBlock;
                }
                else if (markup.isInline && closingInlines[markup.tag]) {
                    extend = closingInlines[markup.tag];
                }
                if (extend) {
                    // Markup should be extended
                    extend[2] = markup[2];
                    markups.splice(i, 1);
                    i--;
                }
            }
            else if (markup.start > index) {
                // Passed joining index, done
                break;
            }
        }
        return markups;
    };
    /**
     * Removes or shortens any markups matching the provided tag within the
     * provided range.
     */
    Editor.ingestMarkups = function (markups, tag, from, to) {
        for (var i = 0, markup = void 0; (markup = markups[i]); i++) {
            var markupTag = markup[0], markupStart = markup[1], markupEnd = markup[2];
            if (markupTag !== tag)
                continue;
            if (markupStart >= from && markupEnd <= to) {
                // Markup enveloped, remove
                markups.splice(i, 1);
                i--;
            }
            else if (markupStart < from && markupEnd >= to) {
                // Markup overlaps start, shorten by moving end to
                // start of selection
                if (markupEnd > to) {
                    // Split markup into two
                    var newMarkup = new Markup_1.default([markupTag, to, markupEnd]);
                    markups.splice(i + 1, 0, newMarkup);
                    i++;
                }
                markup[2] = from;
            }
            else if (markupStart > from && markupStart < to) {
                // Markup overlaps end, shorten by moving start to
                // end of selection
                markup[1] = to;
            }
            else if (markupStart === from && markupEnd > to) {
                // Markup envelops range from start
                markup[1] = to;
            }
        }
    };
    /**
     * Determines which block and inline markups should be "active"
     * or "enveloped" for particular selection.
     */
    Editor.setActiveMarkups = function (state, range) {
        state.activeBlockMarkup = null;
        state.activeInlineMarkups.length =
            state.envelopedBlockMarkups.length = 0;
        var adjacentInlineMarkups = [];
        var parentBlock = null;
        for (var i = 0; i < state.markups.length; i++) {
            var markup = new Markup_1.default(state.markups[i].toArray());
            var lastAdjacent = adjacentInlineMarkups[adjacentInlineMarkups.length - 1];
            // Active markups are those that surround the start of the
            // selection and should be highlighted in any UI
            if (markup.start <= range.from && markup.end >= range.from) {
                if (markup.isBlock) {
                    // Only one block markup may be active at a time
                    // (the first one)
                    state.activeBlockMarkup = markup;
                }
                else if (markup.end >= range.to) {
                    // Simple enveloped inline markup
                    state.activeInlineMarkups.push(markup);
                }
                else if (markup.end === parentBlock.end) {
                    // Potential first adjacent inline markup
                    adjacentInlineMarkups.push(markup);
                    continue;
                }
            }
            if (lastAdjacent && lastAdjacent.tag === markup.tag &&
                (markup.start === parentBlock.start && markup.end >= range.to ||
                    markup.start === parentBlock.start && markup.end === parentBlock.end)) {
                // Continuation or end of an adjacent inline markup
                adjacentInlineMarkups.push(markup);
                if (range.to <= markup.end) {
                    // Final adjacent inline markup, move all to state
                    (_a = state.activeInlineMarkups).push.apply(_a, adjacentInlineMarkups);
                }
            }
            else if (markup.isInline) {
                // Doesn't match tag, or not a continuation, reset
                adjacentInlineMarkups.length = 0;
            }
            if (!markup.isBlock)
                continue;
            parentBlock = markup;
            // Enveloped block markups are those that are partially or
            // completely enveloped by the selection.
            if (
            // overlapping end
            (range.from >= markup.start && range.from < markup.end) ||
                // overlapping start
                (range.to > markup.start && range.to <= markup.end) ||
                // enveloped
                (range.from <= markup.start && range.to >= markup.end)) {
                state.envelopedBlockMarkups.push(markup);
            }
        }
        var _a;
    };
    return Editor;
}());
exports.default = Editor;


/***/ })
/******/ ]);
});
//# sourceMappingURL=tome.js.map