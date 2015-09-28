/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var SPWebWalker = __webpack_require__(1);

	var getQueryStringParameter = function (param) {
	    var params = document.URL.split("?")[1].split("&");
	    var strParams = "";

	    for (var i = 0; i < params.length; i = i + 1) {
	        var singleParam = params[i].split("=");

	        if (singleParam[0] == param) {
	            return decodeURIComponent(singleParam[1]);
	        }
	    }
	};

	var hostWebUrl = getQueryStringParameter('SPHostUrl');

	var options = {
	    'webUrl': hostWebUrl,
	    'useAppContextSite': true
	};

	var webs = [];
	var walker = new SPWebWalker(options);
	walker.walk(function (web) {
	    webs.push(web);
	}, function () {
	    var html = '<p>The webs under host web are (including host web):</p>';
	    html += '<ul>';

	    for (var i = 0, length = webs.length; i < length; i++) {
	        html += '<li>' + webs[i].get_url() + '</li>'
	    }

	    html += '</ul>';

	    $('#message').html(html);
	}, function (sender, args) {
	    $('#message').text(args.get_message());
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var contextHelper = __webpack_require__(2);
	var spEach = __webpack_require__(3);

	var each = function (array, callback) {
	    for (var i = 0, length = array.length; i < length; i++) {
	        callback(array[i]);
	    }
	}

	function SPWebWalker(options) {
	    var contextWrapper = contextHelper(options.webUrl, options.useAppContextSite);

	    this.clientContext = contextWrapper.clientContext;
	    this.rootWeb = contextWrapper.web;
	}

	SPWebWalker.prototype.walk = function (callback, done, error) {
	    var rootWeb = this.rootWeb;
	    var clientContext = this.clientContext;

	    clientContext.load(rootWeb);
	    clientContext.executeQueryAsync(function () {
	        walkRecursively(clientContext, rootWeb, callback, done, error);
	    }, error);
	};

	var walkRecursively = function (clientContext, web, callback, done, error) {
	    callback(web);

	    var webs = web.getSubwebsForCurrentUser(null);

	    clientContext.load(webs);
	    clientContext.executeQueryAsync(function () {
	        var subWebs = [];

	        spEach(webs, function (web) {
	            subWebs.push(web);
	        });

	        var count = subWebs.length;

	        if (count > 0) {
	            each(subWebs, function (subWeb) {
	                walkRecursively(clientContext, subWeb, callback, function (subWebNode) {
	                    count--;

	                    if (count === 0) {
	                        done();
	                    }
	                }, error);
	            });
	        } else {
	            done();
	        }
	    }, error);
	};

	module.exports = SPWebWalker;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function contextHelper(webUrl, crossSite) {
	    var web = null;
	    var site = null;
	    var clientContext = null;
	    var appContextSite = null;

	    if (!webUrl) {
	        clientContext = SP.ClientContext.get_current();
	        web = clientContext.get_web();
	        site = clientContext.get_site();
	    } else if (crossSite) {
	        clientContext = SP.ClientContext.get_current();
	        appContextSite = new SP.AppContextSite(clientContext, webUrl);
	        web = appContextSite.get_web();
	        site = appContextSite.get_site();
	    } else {
	        clientContext = new SP.ClientContext(webUrl);
	        web = clientContext.get_web();
	        site = clientContext.get_site();
	    }

	    return {
	        web: web,
	        site: site,
	        clientContext: clientContext,
	        appContextSite: appContextSite
	    };
	}

	module.exports = contextHelper;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var spEach = function (collection, iteratee, context) {
	    if (typeof collection.getEnumerator === 'function') {
	        var index = 0;
	        var current = null;
	        var enumerator = collection.getEnumerator();

	        while (enumerator.moveNext()) {
	            current = enumerator.get_current();

	            iteratee.call(context, current, index, collection);

	            index++;
	        }
	    }
	};

	module.exports = spEach;


/***/ }
/******/ ]);