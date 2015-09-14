var casper = require('casper').create();

casper.start('http://localhost:3000/bubble_viz.html', function() {
    var svg = this.getHTML('.chart');
    this.echo(svg);
});

casper.run();
