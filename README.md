# sp-web-walker
Walk through SharePoint web collection.

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
