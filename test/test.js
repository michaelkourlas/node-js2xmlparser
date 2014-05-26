/* globals it, describe, require */

(function() {
    "use strict";

    var js2xmlparser = require("../lib/js2xmlparser");
    var should = require("should");

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

            it("should raise an error when no root is provided", function () {
                var res;
                try {
                    res = js2xmlparser(undefined, {}, opts);
                } catch (e) {
                    e.should.match(/root element must be a string/);
                }
                should.not.exist(res);
            });

            it("should correctly serialize an array", function () {
                var res = js2xmlparser("root",
                    {"name": [ "1", "2", "3", "4" ] },
                    opts);
                var expected =  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
                expected += "<root><name>1</name><name>2</name><name>3</name><name>4</name></root>";
                res.should.eql(expected);
            });

            it("should correctly serialize an array of string", function () {
                var res = js2xmlparser("root", {"item": [ "Hello", "World" ] }, opts);
                var expected =  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
                expected += "<root><item>Hello</item><item>World</item></root>";
                res.should.eql(expected);
            });
        });
    });
})();