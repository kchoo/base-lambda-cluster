# Base AWS lambda function cluster

This is a fork of https://github.com/kchoo/lint-test-framework, and a framework for building lambda function clusters will be built on top of that framework

# lint-test-framework

Framework for listening to file changes, linting, and then testing code

## Usage


Running

```
node index.js
```

will start up chokidar to watch all JS files in this directory. Whenever you save a change or add a new file, it will run `eslint` against all JS files.

If there are no linting errors, it looks for all `.test.js` files, and passes them to `nodeunit`, which will run the tests specified in that file. If you've never used `nodeunit` before, refer to `sample.js` and `sample.test.js` to see how a test file should look.

In addition, if you create a new JS file, a `.test.js` file will be created next to it. For now it's just a copy of `template.test.js`, but I plan to have them update whenever you export something from your JS file

Note: it's recommended to keep this process running in its own dedicated terminal

