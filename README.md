# pastry

[![Build Status](https://travis-ci.org/leungwensen/pastry.png)](https://travis-ci.org/leungwensen/pastry)


## description

taste it for your html5 development. you can take one piece or any. and you can taste in nodejs's house, too.


## [the way to taste pastry](https://github.com/leungwensen/pastry/wiki/the-way-to-taste-pastry)

### download

    $ git clone https://github.com/leungwensen/pastry.git

### in browsers:

#### js

add this to your html file before your own codes:

    <script type="text/javascript" src="path/to/pastry.[min.]js"></script>

then you can use the extended prototype functions or access variables or functions defined in the global variable `PT` or `PASTRY`

#### css

add this line into `<head>` tag in your html file.

    <link rel="stylesheet" href="path/to/pastry.[min.]css" />

### in nodejs:

first, install pastry using npm:

    $ npm install pastry

then use pastry like this:

    var PT = require('pastry');

### if you don't want to eat the whole pastry

you can get pieces of it like this:

    $ cd /path/to/pastry
    $ ./bin/js/concat.js -f array,json -t /path/to/target-file.js -m

and then you will have a piece of pastry with array and json functions only! good for health, isn't it?

to know a little bit more about the DIY thing, just:

    $ cd /path/to/pastry
    $ ./bin/js/concat.js -help

enjoy it!


## [the menu](https://github.com/leungwensen/pastry/wiki/the-menu)

for more info, checkout [test files](https://github.com/leungwensen/pastry/tree/master/spec) or [documents](https://github.com/leungwensen/pastry/tree/master/doc) or the [source code](https://github.com/leungwensen/pastry/tree/master/js)

### done list

#### pastry.js

```javascript
    PT.isBool(value)
    PT.isDef(value)
    PT.isFunc(value)
    PT.isNum(value)
    PT.isStr(value)
    PT.isObj(value)
```

#### pastry.bool.js

#### pastry.string.js

```javascript
    string.trim()
    string.uc()
    string.lc()
    string.toInt()
```

#### pastry.date.js

```javascript
    date.stringf([pattern])
```

#### pastry.object.js

```javascript
    object.hasKey(key) || object.has(key)
    object.forEach(callback[, thisObj]) || object.each(callback[, thisObj])
    Object.keys(obj)
    object.keys()
    Object.values(obj)
    object.values()
    object.hasValue(value) || object.hasVal(value)
```

#### pastry.number.js

```javascript
    number.stringf([option])
```

#### pastry.function.js

#### pastry.array.js

```javascript
    array.indexOf(searchElement[, fromIndex])
    array.lastIndexOf(searchElement[, fromIndex])
    array.every(callback[, thisObj])
    array.filter(callback[, thisObj])
    array.forEach(callback[, thisObj]) || array.each(callback[, thisObj])
    array.map(callback[, thisObj])
    array.some(callback[, thisObj])
    array.reduce(callback[, thisObj])
    array.reduceRight(callback[, thisObj])
    array.binarySearch(element, compareFunc)
    array.remove([fromIndex[, toIndex]])
    array.replace(element, withElement)
    array.intersection(that)
    array.complement(that)
    array.intersection(that)
    array.uniq()
```

#### pastry.json.js

```javascript
    PT.JSON.stringify(value)
    PT.JSON.parse(string)
```

#### pastry.enviroment.js

```javascript
    PT.initUA()
    PT.PL || PT.platform
    PT.PLUG || PT.plugins
    PT.VER || PT.versions
    PT.HOST
    PT.DOC
    PT.UA || PT.userAgent
    PT.detectPL(platformStr)
    PT.detectPLUG(plugins)
    PT.detectVer(userAgent)
```

### todo list



## [cooks](https://github.com/leungwensen/pastry/graphs/contributors)


## [the way to help cooking](https://github.com/leungwensen/pastry/wiki/the-way-to-help-cooking)


## [MIT LICENSE](https://github.com/leungwensen/pastry/blob/master/LICENSE.md)

