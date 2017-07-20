# sp-web-walker

[![Greenkeeper badge](https://badges.greenkeeper.io/Frederick-S/sp-web-walker.svg)](https://greenkeeper.io/)
Walk through SharePoint web and its subwebs.

## Installation
```
npm install sp-web-walker --save
```

## Usage
```js
var SPWebWalker = require('sp-web-walker');

var options = {
    'webUrl': 'web url',
    'useAppContextSite': false
};

var walker = new SPWebWalker(options);

walker.walk(function (web) {
    // Callback function for each web
}, function () {
    // Query is finished
}, function (sender, args) {
    // Error
});
```

## License
MIT.
