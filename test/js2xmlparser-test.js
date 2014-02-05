/* globals it, describe, require */
"use strict";

var js2xmlparser = require("../lib/js2xmlparser"),
    should       = require("should");

describe("the XML parser", function () {

  describe("when prettyPrinting is disabled", function () {
    var opts = {
          prettyPrinting: {
            enabled : false
          }
    };

    it("should correctly serialize a simple object", function () {
      var res = js2xmlparser("root", {"hello":"world"}, opts);
      res.should.eql("<?xml version=\"1.0\" encoding=\"UTF-8\"?><root><hello>world</hello></root>");
    });

    it("should correctly serialize an empty object", function () {
      var res = js2xmlparser("root", {}, opts);
      res.should.eql("<?xml version=\"1.0\" encoding=\"UTF-8\"?><root/>");
    });

    it("should correctly serialize an empty object", function () {
      var res;
      try {
        res = js2xmlparser(undefined, {}, opts);
      } catch (e) {
        e.should.match(/root element must be a string/);
      }
      should.not.exist(res);
    });
  });
});