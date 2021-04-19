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
     * Parameter: options {object}
     *     {
     *         host: {string},
     *         // specify one of the following 3 params
     *         pageName: {string} [optional],
     *         pageId: {string} [optional],
     *         revId: {string} [optional],
     *         success: {function} [optional],
     *         error: {function} [optional]
     *     }
     *
     * Returns: {Promise}
     *
     * For more information, see the api documentation:
     * https://github.com/wikimedia/analytics-mediawiki-storage/blob/master/doc/api.md
     */
    MediawikiStorage.prototype.get = function (options) {
        if (typeof options !== 'object') {
            throw new TypeError('function must receive an object');
        }

        var deferred = $.Deferred();
        var url  = this._createQueryUrl(options);
        var that = this;

        $.ajax({
            url: url,
            dataType: 'jsonp',
            contentType: 'application/json',

            success: function (data) {
                var pageJson;

                // try to parse page contents
                try {
                    pageJson = that._getPageJson(data);
                } catch (e) {
                    if (typeof options.error === 'function') {
                        options.error(e);
                    }
                    deferred.reject(e);
                    return;
                }

                // return parsed page contents
                if (typeof options.success === 'function') {
                    options.success(pageJson);
                }
                deferred.resolve(pageJson);
            },

            error: function (jqXHR, textStatus, e) {
                if (typeof options.error === 'function') {
                    options.error(e);
                }
                deferred.reject(e);
            }
        });

        return deferred.promise();
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
            '//',
            options.host,
            '/w/api.php',
            '?action=query',
            '&prop=revisions',
            '&format=json',
            '&rvprop=content',
            '&rawcontinue=1',
            filter,
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
