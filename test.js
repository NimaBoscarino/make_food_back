var casper = require('casper').create();
casper.start('https://www.skipthedishes.com/');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.run();
