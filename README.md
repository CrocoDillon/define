# define

[![Build Status](https://img.shields.io/travis/CrocoDillon/define.svg?style=flat)](https://travis-ci.org/CrocoDillon/define)

The smallest AMD JavaScript module loader! Only 1kB minified!

This is meant as a copy paste solution, so I won’t publish to npm. I like AMD because it allows rapid prototyping without any processing, unlike CommonJS where you’d need to process with a tool like webpack or browserify.

Read more about the AMD module loader [here](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).

## Caveats

It does not support:

- Circular references (unless you manage them)
- Anonymous modules by file reference
- Implicit dependencies by parsing `require(...)` calls from functions
- Config or plugins

If you need that you might consider something else like requirejs (15kB minified).

## Minify define.js

```
$ npm install
$ npm run build
```

The output will be define.min.js

## Run tests

I implemented some of the tests from [amdjs/amdjs-tests](https://github.com/amdjs/amdjs-tests/), run them with:

```
$ npm install
$ npm run test
```
