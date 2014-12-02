# API Documentation
mediawiki-storage should run within the following export environments: AMD (define), Node.js (require) and browser (global). After you get mediawiki-storage object, you can call the following methods on it:

## get
__Returns the contents of the specified mediawiki page.__

The mediawiki page is specified using mediawiki's `host` and _one_ of:

* `pageName`
* `pageId`
* `revId`

_Note that the page contents must be valid json._

#### Parameters:
1. options _{object}_ Dictionary with all options

```
{
    host: {string},
    pageName: {string},
    pageId: {string},
    revId: {string},
    success: {function},
    error: {function}
}
```

#### Retrieving the results:
There are two options to retrieve the results:

##### Via _success_ parameter:
```
mediawikiStorage.get({
	// ...
	success: function (results) {
		// do something with results
	}
});
```

##### Via promise _done_:
```
mediawikiStorage.get({
	// ...
}).done(function (results) {
	// do something with results
});
```

#### Errors thrown:
Errors occurring before jsonp call will be thrown synchronously. Error occurring within or after the jsonp call, will be passed to the corresponding callback. There are two options to catch the error:
##### Via _error_ parameter:
```
mediawikiStorage.get({
	// ...
	error: function (error) {
		// do something with error
	}
});
```
##### Via promise _fail_:
```
mediawikiStorage.get({
	// ...
}).fail(function (error) {
	// do something with error
});
```

#### Full example:
```
mediawiki-storage.get({
	host: 'meta.wikimedia.org',
	pageName: 'Schema:EventCapsule',
	success: function (data) {
		console.log('Page contents:', data);
	},
	error: function (error) {
		console.log('Error:', error);
	}
});
```
