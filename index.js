// inject karma runner baseReporter and config
TaserReporter.$inject = ['baseReporterDecorator', 'config'];
function TaserReporter(baseReporterDecorator, config) {
    // extend the base reporter
    baseReporterDecorator(this);

    var taser = config.taser || function(msg) { console.log('Taser message: ', msg); };

    this.onSpecComplete = onSpecComplete;
    this.onRunComplete = onRunComplete;

    function onSpecComplete(browser, result) {
        taser({ onSpecComplete: { browser: browser, result: result } });
    }

    function onRunComplete(browser, result) {
        taser({ onRunComplete: { browser: browser, result: result } });
    }
}

// PUBLISH DI MODULE
module.exports = {
    'reporter:taser': ['type', TaserReporter]
};