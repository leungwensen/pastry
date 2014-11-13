/* jshint strict: true, undef: true, unused: true */
/* global describe, it, expect */
require([
    'pastry',
    'fmt/sprintf'
], function (
    pastry,
    sprintf
) {
    'use strict';

    describe('fmt/sprintf->sprintf()', function () {

        it('simple placeholders', function () {
            expect(sprintf("%%"      )).toBe("%"  );
            expect(sprintf("%b", 2   )).toBe("10" );
            expect(sprintf("%c", 65  )).toBe("A"  );
            expect(sprintf("%d", 2   )).toBe("2"  );
            expect(sprintf("%d", "2" )).toBe("2"  );
            expect(sprintf("%f", 2.2 )).toBe("2.2");
            expect(sprintf("%o", 8   )).toBe("10" );
            expect(sprintf("%s", "%s")).toBe("%s" );
            expect(sprintf("%x", 255 )).toBe("ff" );
            expect(sprintf("%X", 255 )).toBe("FF" );
        });

        it('complex placeholders', function () {
            expect(sprintf("%d"      , 2              )).toBe("2"            );
            expect(sprintf("%d"      , -2             )).toBe("-2"           );
            expect(sprintf("%+d"     , 2              )).toBe("+2"           );
            expect(sprintf("%+d"     , -2             )).toBe("-2"           );
            expect(sprintf("%f"      , 2.2            )).toBe("2.2"          );
            expect(sprintf("%f"      , -2.2           )).toBe("-2.2"         );
            expect(sprintf("%+f"     , 2.2            )).toBe("+2.2"         );
            expect(sprintf("%+f"     , -2.2           )).toBe("-2.2"         );
            expect(sprintf("%+.1f"   , -2.34          )).toBe("-2.3"         );
            expect(sprintf("%+.1f"   , -0.01          )).toBe("-0.0"         );
            expect(sprintf("%+010d"  , -123           )).toBe("-0000000123"  );
            expect(sprintf("%+'_10d" , -123           )).toBe("-_______123"  );
            expect(sprintf("%f %f"   , -234.34 , 123.2)).toBe("-234.34 123.2");

            // padding
            expect(sprintf("%05d"   , -2               )).toBe("-00002"    );
            expect(sprintf("%5s"    , "<"              )).toBe("    <"     );
            expect(sprintf("%05s"   , "<"              )).toBe("0000<"     );
            expect(sprintf("%'_5s"  , "<"              )).toBe("____<"     );
            expect(sprintf("%-5s"   , ">"              )).toBe(">    "     );
            expect(sprintf("%0-5s"  , ">"              )).toBe(">0000"     );
            expect(sprintf("%'_-5s" , ">"              )).toBe(">____"     );
            expect(sprintf("%5s"    , "xxxxxx"         )).toBe("xxxxxx"    );
            expect(sprintf("%8.3f"  , -10.23456        )).toBe("-  10.235" );
            expect(sprintf("%f %s"  , -12.34    , "xxx")).toBe("-12.34 xxx");

            // precision
            expect(sprintf("%.1f"  , 2.345   )).toBe("2.3"  );
            expect(sprintf("%5.5s" , "xxxxxx")).toBe("xxxxx");
            expect(sprintf("%5.1s" , "xxxxxx")).toBe("    x");
        });

    });
});
