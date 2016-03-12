# karma-taser-reporter

On run complete, sends test results to the taserReporter callback function specified in the config. 

```javascript
[{
  browser: {
    name: String,
    fullName: String
  },
  testResults: {
    passed: [{
      id: String,
      description: String,
      suite: [String],
      success: Boolean,
      skipped: Boolean,
      time: Number,
      log: [String]
    }],
    skipped: [{
      id: String,
      description: String,
      suite: [String],
      success: Boolean,
      skipped: Boolean,
      time: Number,
      log: [String]
    }],
    failed: [{
      id: String,
      description: String,
      suite: [String],
      success: Boolean,
      skipped: Boolean,
      time: Number,
      log: [String]
    }]
  },
  errors: [String]
}]
```
