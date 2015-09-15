var casper = require('casper').create();

casper.start('http://localhost:3000/bubble_viz.html', function() {
    this.then(function() {
      this.reload(function() {
        var svg = this.getHTML('.chart').replace(/>/, ' version="1.1" xmlns="http://www.w3.org/2000/svg">');
        this.echo(svg);
      });
    });
});

casper.run();
