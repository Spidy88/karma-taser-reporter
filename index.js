// inject karma runner baseReporter and config
TaserReporter.$inject = ['baseReporterDecorator', 'config'];
function TaserReporter(baseReporterDecorator, config) {
    // extend the base reporter
    baseReporterDecorator(this);

    var taserReporter = config.taserReporter || function() {};
    var browsers = {};

    // This is not a full list of events that can be listened for, only the set we currently care about
    this.onRunStart = onRunStart.bind(this);
    this.onBrowserStart = onBrowserStart.bind(this);
    this.onBrowserError = onBrowserError.bind(this);
    this.onSpecComplete = onSpecComplete.bind(this);
    this.onRunComplete = onRunComplete.bind(this);

    function onRunStart() {
        browsers = {};
    }
    
    function onBrowserStart(browser) {
        browsers[browser.id] = {
            browser: {
                name: browser.name,
                fullName: browser.fullName
            },
            testResults: [],
            errors: []
        };
    }
    
    function onBrowserError(browser, error) {
        browsers[browser.id].errors.push(error);
    }

    function onSpecComplete(browser, testResult) {
        browsers[browser.id].testResults.push(testResult);
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
