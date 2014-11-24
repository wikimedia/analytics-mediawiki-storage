'use strict';

describe('get method', function() {

    var commonUrl = (
        'http://www.wikimedia.org/w/api.php' +
        '?action=query&prop=revisions&format=json&rvprop=content'
    );

    it('creates a valid query url with pageName', function () {
        var url = mediawikiStorage._createQueryUrl({
            host     : 'www.wikimedia.org',
            pageName : 'Schema:EventCapsule'
        });
        expect(url).toEqual(commonUrl + '&titles=Schema:EventCapsule');
    });

    it('creates a valid query url with pageId', function () {
        var url = mediawikiStorage._createQueryUrl({
            host   : 'www.wikimedia.org',
            pageId : '12345'
        });
        expect(url).toEqual(commonUrl + '&pageids=12345');
    });

    it('creates a valid query url with revId', function () {
        var url = mediawikiStorage._createQueryUrl({
            host  : 'www.wikimedia.org',
            revId : '67890'
        });
        expect(url).toEqual(commonUrl + '&revids=67890');
    });

    it('throws a TypeError when options is not an object', function () {
        try {
            mediawikiStorage.get();
        } catch (e) {
            expect(e.name).toEqual('TypeError');
            expect(e.message).toEqual('function must receive an object');
        }
    });

    it('throws a TypeError when host is not a string', function () {
        try {
            mediawikiStorage.get({});
        } catch (e) {
            expect(e.name).toEqual('TypeError');
            expect(e.message).toEqual('host must be a string');
        }
    });

    it('throws a TypeError when pageName, pageId and revId are missing', function () {
        try {
            mediawikiStorage.get({host: 'some.host'});
        } catch (e) {
            expect(e.name).toEqual('TypeError');
            expect(e.message).toEqual('one of (pageName|pageId|revId) must be a string');
        }
    });

    it('returns a SyntaxError when the query result is not expected', function (done) {
        sinon.stub($, 'ajax', function (options) {
            options.success('bad query result');
        });
        mediawikiStorage.get({
            host     : 'www.wikimedia.org',
            pageName : 'Schema:EventCapsule',
            success  : function () {
                expect(0).toEqual(1); // should never get here
            },
            error    : function (error) {
                expect(error.name).toEqual('SyntaxError');
                expect(error.message).toEqual('unexpected query result');
                $.ajax.restore();
                done();
            }
        });
    });

    it('returns a SyntaxError when the page is not a valid json', function (done) {
        sinon.stub($, 'ajax', function (options) {
            options.success(
                {query:{pages:{'12345':{revisions:[{'*':'not a valid json'}]}}}}
            );
        });
        mediawikiStorage.get({
            host     : 'www.wikimedia.org',
            pageName : 'Schema:EventCapsule',
            success  : function () {
                expect(0).toEqual(1); // should never get here
            },
            error    : function (error) {
                expect(error.name).toEqual('SyntaxError');
                expect(error.message).toEqual('page contents are not a valid json');
                $.ajax.restore();
                done();
            }
        });
    });

    it('propagates any jQuery.ajax errors', function (done) {
        sinon.stub($, 'ajax', function (options) {
            options.error({}, 'someStatus', new Error('jQuery.ajax error'));
        });
        mediawikiStorage.get({
            host     : 'www.wikimedia.org',
            pageName : 'Schema:EventCapsule',
            success  : function () {
                expect(0).toEqual(1);  // should never get here
            },
            error    : function (error) {
                expect(error.name).toEqual('Error');
                expect(error.message).toEqual('jQuery.ajax error');
                $.ajax.restore();
                done();
            }
        });
    });

    it('returns object created from page json', function (done) {
        sinon.stub($, 'ajax', function (options) {
            options.success(
                {query:{pages:{'12345':{revisions:[{'*':'{"valid": "json"}'}]}}}}
            );
        });
        mediawikiStorage.get({
            host     : 'www.wikimedia.org',
            pageName : 'Schema:EventCapsule',
            success  : function (data, textStatus, jqXHR) {
                expect(data).toEqual({"valid": "json"});
                $.ajax.restore();
                done();
            },
            error    : function () {
                expect(0).toEqual(1);  // should never get here
            }
        });
    });

});
