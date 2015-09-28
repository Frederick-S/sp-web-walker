var contextHelper = require('sp-context-helper');
var spEach = require('sp-each');

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

    var webs = web.get_webs();

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
