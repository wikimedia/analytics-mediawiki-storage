# mediawiki-storage

Get JSON content from MediaWiki using JSONP

### Use as a Bower component
Install normally with Bower.
```
bower install --save mediawiki-storage
```

### Use to modify and develop
Get the source code from Wikimedia's Gerrit repository.
```
git clone https://gerrit.wikimedia.org/r/analytics/mediawiki-storage
```

We're using Bower for production dependencies, Karma as a test runner and Gulp as a build tool. Make sure you install the following packages globally.
```
npm install -g bower
npm install -g gulp
npm install -g karma-cli
```

Then, install the dependencies to be able to build and run mediawiki-storage and its tests.
```
cd mediawiki-storage
npm install
bower install
```

Now you can run Gulp tasks to lint, build and clean the project; Where _command_ can be one of: `lint`, `build` or `clean`. If you omit _command_, Gulp defaults to executing _build_ task.
```
gulp <command>
```

You can also run the tests, and let Karma test runner watch all files and execute all tests on changes with:
```
karma start
```

### API documentation
See the API documentation [here](doc/api.md).

### Future plans
In the future, we'd like to add write capability to the library, so that we can also update the contents of MediaWiki JSON pages.
