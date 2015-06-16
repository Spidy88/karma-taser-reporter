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
        console.log('Starting new run');
        browsers = {};
    }
    
    function onBrowserStart(browser) {
        console.log('Browser attached: ', browser);
        browsers[browser.id] = {
            results: []
        };
    }
    
    function onBrowserError() {
        console.log('Browser error: ', arguments);
    }

    function onSpecComplete(browser, result) {
        browsers[browser.id].results.push(result);
        taserReporter({ onSpecComplete: { browser: browser, result: result } });
    }

    function onRunComplete(browser, result) {
        console.log('Run complete');
        console.log('Browser results: ', browser.getResults());
        console.log('Taser results: ', browsers);
        taserReporter({ onRunComplete: { browser: browser, result: result } });
    }
}

// PUBLISH DI MODULE
module.exports = {
    'reporter:taser': ['type', TaserReporter]
};
