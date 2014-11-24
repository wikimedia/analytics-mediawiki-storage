'use strict';

(function(global){

    var MediawikiStorage = function () {};

    /**
     * Returns the contents of the specified mediawiki page
     *
     * The mediawiki page is specified using mediawiki's host
     * (i.e. www.wikipedia.org) and either:
     *     - the page name
     *     - the page id
     *     - the revision id
     *
     * Note that:
     * The page contents must be valid json.
     * The retrieval of the page contents is done via jsonp.
     * The return value is passed as parameter for the success callback.
     * Errors occurring before jsonp call (TypeError) will be thrown
     * synchronously, and errors occurring within or after jsonp call
     * will be handed as parameter for error callback.
     *
     * Parameter: options {object}
     *     {
     *         host: {string}, // i.e. www.wikipedia.org
     *         // at least one of the following three:
     *         pageName: {string},
     *         pageId: {string},
     *         revId: {string},
     *         success: {function}, // callback [optional]
     *                              // parameter: object with page contents
     *         error: {function} // callback [optional]
     *                           // parameter: error thrown
     *     }
     */
    MediawikiStorage.prototype.get = function (options) {
        if (typeof options !== 'object') {
            throw new TypeError('function must receive an object');
        }

        var url  = this._createQueryUrl(options);
        var that = this;

        $.ajax({
            url: url,
            dataType: 'jsonp',
            contentType: 'application/json',

            success: function (data) {
                if (typeof options.success === 'function') {
                    var pageJson;
                    try {
                        pageJson = that._getPageJson(data);
                    } catch (e) {
                        return options.error(e);
                    }
                    options.success(pageJson);
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                if (typeof options.error === 'function') {
                    options.error(errorThrown);
                }
            }
        });
    };

    /**
     * Given a host and a page identifier, creates
     * a url for querying mediawiki's api for that page
     */
    MediawikiStorage.prototype._createQueryUrl = function (options) {
        if (typeof options.host !== 'string') {
            throw new TypeError('host must be a string');
        }

        // mediawiki api can be queried using three types of ids
        // page names, page ids and revision ids
        var filter;
        if (typeof options.pageName === 'string') {
            filter = '&titles=' + options.pageName;
        } else if (typeof options.pageId === 'string') {
            filter = '&pageids=' + options.pageId;
        } else if (typeof options.revId === 'string') {
            filter = '&revids=' + options.revId;
        } else {
            throw new TypeError(
                'one of (pageName|pageId|revId) must be a string'
            );
        }

        // for reference, have a look at:
        // http://www.mediawiki.org/wiki/API:Query
        return [
            'http://',
            options.host,
            '/w/api.php',
            '?action=query',
            '&prop=revisions',
            '&format=json',
            '&rvprop=content',
            filter
        ].join('');
    };

    /**
     * Given the result of mediawiki api query on a json formatted page
     * extracts the contents of the page and parses them into an object
     */
    MediawikiStorage.prototype._getPageJson = function (data) {
        var pageContent, result;

        try {
            var pages = data.query.pages;
            var pageId = Object.keys(pages)[0];
            pageContent = pages[pageId].revisions[0]['*'];
        } catch (e) {
            throw new SyntaxError('unexpected query result');
        }

        try {
            result = JSON.parse(pageContent);
        } catch (e) {
            throw new SyntaxError('page contents are not a valid json');
        }

        return result;
    };

    var mediawikiStorage = new MediawikiStorage();

    // exports to multiple environments
    if(typeof define === 'function' && define.amd){ // AMD
        define(function () { return mediawikiStorage; });
    } else if (typeof module !== 'undefined' && module.exports){ // node
        module.exports = mediawikiStorage;
    } else { // browser
        // use string because of Google closure compiler ADVANCED_MODE
        /* jslint sub:true */
        global['mediawikiStorage'] = mediawikiStorage;
    }

}(window));
