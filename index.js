// inject karma runner baseReporter and config
TaserReporter.$inject = ['baseReporterDecorator', 'config'];
function TaserReporter(baseReporterDecorator, config) {
    // extend the base reporter
    baseReporterDecorator(this);

    var taserReporter = config.taserReporter || function() {};
    var browsers = {};
    var errors = {};

    // This is not a full list of events that can be listened for, only the set we currently care about
    this.onRunStart = onRunStart.bind(this);
    this.onBrowserStart = onBrowserStart.bind(this);
    this.onBrowserError = onBrowserError.bind(this);
    this.onSpecComplete = onSpecComplete.bind(this);
    this.onRunComplete = onRunComplete.bind(this);

    function onRunStart() {
        browsers = {};
        errors = {};
    }

    function makeBrowserRecord (id, name, fullName) {
        if (errors[id] === undefined) {
            errors[id] = [];
        }

        if (browsers[id] === undefined) {
            browsers[id] = {
                browser: {
                    name: name,
                    fullName: fullName
                },
                testResults: {
                    passed: [],
                    skipped: [],
                    failed: []
                },
                errors: errors[id]
            };
        }
    } 

    function onBrowserError(browser, error) {
        makeBrowserRecord(browser.id, browser.name, browser.fullName);
        errors[browser.id] = errors[browser.id] || [];
        errors[browser.id].push(error.replace(/\.js\?[a-f0-9]+\:/gi, '.js:'));
    }

    function onBrowserStart(browser, error) {
        makeBrowserRecord(browser.id, browser.name, browser.fullName);
    }


    function onSpecComplete(browser, testResult) {
        var category;

        // Set the test result category for this test
        if( testResult.success ) {
            category = 'passed';
        }
        else if( testResult.skipped || testResult.ignored ) {
            category = 'skipped';
        }
        else {
            category = 'failed';
        }

        if (testResult.log instanceof Array && testResult.log.length > 0) {
            testResult.log = testResult.log.map(function(ea) {
                if (ea.match('.js')) {
                    ea = ea.replace(/\.js\?[a-f0-9]+\:/gi, '.js:'); // Clean out the hash to make it pretty.
                } else {
                    ea = ea.replace(/\n    at.+/gi, ''); // Remove browserify junk if we must. :/
                }
                return ea;
            });
        }
        
        // Add the test result to this browsers test results in its proper category
        browsers[browser.id].testResults[category].push(testResult);
    }

    function onRunComplete(browser, result) {
        var reports = [];
        var browser;

        for( browser in browsers ) {
            reports.push(browsers[browser]);
        }
        
        taserReporter(reports);
    }
}

// PUBLISH DI MODULE
module.exports = {
    'reporter:taser': ['type', TaserReporter]
};
