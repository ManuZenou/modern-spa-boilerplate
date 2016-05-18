casper.on("remote.message", function (e) {
  console.log(e)
})

casper.on("error", function(msg, backtrace) {
  console.log("FATAL: " + msg);
  this.exit();
});

casper.start("http://localhost:8085");

casper.waitFor(function check() {
  return this.evaluate(function() {
    return document.querySelectorAll("message-component").length == 0;
  });
}, function then() {});

casper.then(function() {
  this.echo("Page Title: " + this.getTitle())
  casper.test.assertElementCount("h1", 3)
  casper.test.assertElementCount("table", 1)
});

casper.run();
