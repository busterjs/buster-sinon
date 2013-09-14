((typeof define === "function" && define.amd && function (m) {
    define("buster-sinon", m);
}) || (typeof module === "object" &&
       typeof require === "function" && function (m) {
        module.exports = m();
    }) || function (m) {
        this.busterSinon = m();
    }
)(function () {
    return function (sinon, bt, stackFilter, formatio) {
        if (stackFilter) {
            stackFilter.filters.push("lib/sinon");
        }

        bt.testRunner.onCreate(function (runner) {
            runner.on("test:setUp", function (test) {
                var config = sinon.getConfig(sinon.config);
                config.useFakeServer = false;
                var sandbox = sinon.sandbox.create();
                sandbox.inject(test.testCase);

                test.testCase.useFakeTimers = function () {
                    return sandbox.useFakeTimers.apply(sandbox, arguments);
                };

                test.testCase.useFakeServer = function () {
                    return sandbox.useFakeServer.apply(sandbox, arguments);
                };

                test.testCase.sandbox = sandbox;
                var testFunc = test.func;
            });

            runner.on("test:tearDown", function (test) {
                try {
                    test.testCase.sandbox.verifyAndRestore();
                } catch (e) {
                    runner.assertionFailure(e);
                }
            });

            sinon.expectation.pass = function () {
                runner.assertionPass();
            };
        });
    };
});
