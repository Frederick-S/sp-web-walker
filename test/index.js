var SPWebWalker = require('../index.js');

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
