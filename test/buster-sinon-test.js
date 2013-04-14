var buster = require("buster-test");
require("../lib/buster-sinon")(
    require("sinon"),
    buster,
    require("stack-filter"),
    require("formatio")
);
var referee = require("referee");
var assert = referee.assert;
var refute = referee.refute;

var testCase = buster.testCase("buster-sinon", {
    "test runner integration": {
        setUp: function () {
            this.meth = function () {};
            this.obj = { method: this.meth };
            this.runner = buster.testRunner.create();
        },

        "binds sandbox to test": function (done) {
            var obj = this.obj, meth = this.meth;

            var tc = buster.testCase("Sandbox test", {
                "test sandboxing": function () {
                    this.stub(obj, "method");
                    refute.same(obj.method, meth);
                }
            });

            this.runner.on("suite:end", function (results) {
                assert(results.ok);
                assert.same(obj.method, meth);
                done();
            });

            this.runner.runSuite([tc]);
        },

        "fails if implicit mock verification fails": function (done) {
            var obj = this.obj, meth = this.meth;

            var tc = buster.testCase("Sandbox test", {
                "test implicit verification": function () {
                    this.mock(obj).expects("method").once();
                }
            });

            this.runner.on("suite:end", done(function (results) {
                refute(results.ok);
                assert.same(obj.method, meth);
            }));

            this.runner.runSuite([tc]);
        }
    }
});

var runner = buster.testRunner.create();
referee.on("pass", runner.assertionPass.bind(runner));
var reporter = buster.reporters.defaultReporter.create({
    color: true,
    bright: true
}).listen(runner);

runner.runSuite([testCase]);
