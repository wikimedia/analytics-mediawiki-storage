# API Documentation

mediawiki-storage should run within the following export environments: AMD (define), Node.js (require) and browser (global). After you get mediawiki-storage object, you can call the following methods on it:

### get
__Returns the contents of the specified mediawiki page.__

The mediawiki page is specified using mediawiki's `host` and one of:

* `pageName`
* `pageId`
* `revId`

_Note that the page contents must be valid json._

##### Parameters:

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

##### Return value:

Is passed as a single parameter to `success` callback.

##### Errors thrown:

Errors occurring before jsonp call will be thrown synchronously.
If an error occures within or after the jsonp call, it will be passed to the `error` callback as a single parameter, and execution will be aborted.

##### Example:

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
