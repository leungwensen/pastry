# pastry

[![Build Status](https://travis-ci.org/leungwensen/pastry.png)](https://travis-ci.org/leungwensen/pastry)


## description

taste it for your html5 development. you can take one piece or any. and you can taste in in nodejs's house, too.


## [way to taste pastry](https://github.com/leungwensen/pastry/wiki/way-to-taste-pastry)

### download

    $ git clone https://github.com/leungwensen/pastry.git

### in browsers:

#### js

add this to your html file before your own codes:

    <script type="text/javascript" src="path/to/pastry.[min.]js"></script>

then you can use the extended prototype functions or access variables of functions defined in the global variable `PT` or `PASTRY`

#### css

add this line into `<head>` tag in your html file.

    <link rel="stylesheet" href="path/to/pastry.[min.]css" />

### in nodejs:

first, install pastry using npm:

    $ npm install pastry

then use pastry like this:

    var PT = require('pastry');

### do not want the whole all pieces of pastry

you can get some pieces of it like this:

    $ cd /path/to/pastry
    $ ./bin/js/concat.js -f array,json -t /path/to/target-file.js -m

and then you have a piece of pastry with array and json functions only! good for health, doesn't it?

to know a little bit more about the DIY thing, just:

    $ cd /path/to/pastry
    $ ./bin/js/concat.js -help

enjoy it!


## [cookers](https://github.com/leungwensen/pastry/graphs/contributors)


## [way to help cooking](https://github.com/leungwensen/pastry/wiki/way-to-help-cooking)


## [MIT LICENSE](https://github.com/leungwensen/pastry/blob/master/LICENSE.md)

