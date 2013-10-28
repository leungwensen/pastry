'use strict';

describe('pastry.ua.js', function () {
    beforeEach(function () {
        // PT.initUA();
    });

    it('PT.detectVER(ua)', function () {
        expect(PT.detectPL('MacIntel')).toEqual('mac');
    });

    it('PT.detectVER(ua)', function () {
        expect(PT.detectVER('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)')).toEqual({
            msie    : 7,
            trident : 5
        });

        expect(PT.detectVER('Mozilla/4.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.16 Mobile/11A501 Safari/8536.25')).toEqual({
            crios       : 30,
            chrome      : 30,
            applewebkit : 537
        });

        expect(PT.detectVER('Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A501 Safari/9537.53')).toEqual({
            safari       : 7,
            mobilesafari : 7,
            applewebkit  : 537
        });

        expect(PT.detectVER('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36')).toEqual({
            chrome      : 29,
            applewebkit : 537
        });

        expect(PT.detectVER('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:24.0) Gecko/20100101 Firefox/24.0')).toEqual({
            firefox : 24,
            gecko   : 20100101
        });

        expect(PT.detectVER('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71')).toEqual({
            safari      : 7,
            applewebkit : 537
        });

        /*
        PT.initUA();
        expect(PT.VER) .toEqual({
            msie    : 7,
            trident : 5
        });
        */
    });

    it('PT.detectPLUG(plugins)', function () {
        expect(PT.detectPLUG([])).toEqual({ flash : 12 });
    });
});
