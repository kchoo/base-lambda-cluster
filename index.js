const {watch} = require('chokidar');
const {execSync, spawn} = require('child_process');
const minimatch = require('minimatch');

const watcher = watch('**/*.js', {
	ignored: [
		'node_modules',
		'template.test.js'
	]
});

watcher.
	on('ready', function () {
		// lint once we run this script, to avoid making a dummy change to start linting
		watcher.emit('change');

		watcher.
			on('add', function (path) {
				if (!/\.test\.js$/.test(path)) {
					createNewTestFile(path);
				}
			});
	}).
	on('change', function () {
		// clear the console, so that the only thing that is displayed is any errors from this round of linting (if any)
		process.stdout.write('\x1B[2J\x1B[0f');

		const allFilesWatched = getFilesWatched(watcher);

		const lintCommand = `./node_modules/eslint/bin/eslint.js --fix ${allFilesWatched.join(' ')}`;

		// pass .test.js files to nodeunit
		const testFiles = allFilesWatched.
			filter(
				minimatch.filter('**/*.test.js')
			);

		const testCommand = `./node_modules/nodeunit/bin/nodeunit ${testFiles.join(' ')}`;

		try {
			sh(lintCommand);
			// run tests iff the linting throws no errors
			sh(testCommand);
		} catch (e) {
			// error is thrown when linting fails, we just want to continue
		}
	});

function getFilesWatched(watcher) {
	const filesArray = [];

	const filesMap = watcher.getWatched();

	/* eslint-disable guard-for-in */
	for (const dir in filesMap) {
		for (const file of filesMap[dir]) {
			filesArray.push(dir + '/' + file);
		}
	}
	/* eslint-enable guard-for-in */

	return filesArray;
}

function sh(command) {
	return execSync(
		command,
		{
			stdio: 'inherit'
		}
	);
}

function createNewTestFile(path) {
	sh(`cp template.test.js ${path.replace('.js', '.test.js')}`);
}

const readline = require('readline');

readline.
	createInterface({
		input: process.stdin,
		terminal: false
	}).
	on('line', function restartScript(line) {
		if (line === '') {
			spawn(
				process.argv[0],
				process.argv.slice(1),
				{
					cwd: process.cwd(),
					detached: false,
					stdio: 'inherit'
				}
			);

			process.exit();
		}
	});
