// inject karma runner baseReporter and config
TaserReporter.$inject = ['baseReporterDecorator', 'config', 'formatError'];
function TaserReporter(baseReporterDecorator, config, formatError) {
    // extend the base reporter
    baseReporterDecorator(this);

    var taserReporter = config.taserReporter || function() {};
    var browsers = {};
    var errors = {};

    // This is not a full list of events that can be listened for, only the set we currently care about
    this.onRunStart = onRunStart.bind(this);
    this.onBrowserStart = onBrowserStart.bind(this);
    this.onBrowserError = onBrowserError.bind(this);
    this.onBrowserComplete = onBrowserComplete.bind(this);
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
        errors[browser.id].push(betterFormatError(error));
    }

    function onBrowserStart(browser, error) {
        makeBrowserRecord(browser.id, browser.name, browser.fullName);
    }

    function onBrowserComplete(browser) {
        // This will get caught by `onBrowserError` in the new version of karma, but until then:
        if (browser.lastResult.disconnected) {
            makeBrowserRecord(browser.id, browser.name, browser.fullName);
            errors[browser.id] = errors[browser.id] || [];
            errors[browser.id].push('A test timed out after ' + browser.lastResult.totalTime + 'ms, likely due to an infinite loop or very high time complexity.');
        }
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
            testResult.log = testResult.log.map(betterFormatError);
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

    function betterFormatError(error) {
        if (error.match(/Maximum call stack size exceeded./)) {
            return 'Maximum call stack size exceeded.';
        }
        return formatError(error);
    }
}

// PUBLISH DI MODULE
module.exports = {
    'reporter:taser': ['type', TaserReporter]
};
