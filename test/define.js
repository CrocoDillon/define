var expect = require('chai').expect,
    define = require('../define.js');

describe('define', function () {
  describe('define.amd', function () {
    it('should be an object', function () {
      expect(define.amd).to.be.an('object');
    });
  });

  describe('noDeps', function () {
    it('should have the default require, exports, module dependencies', function (done) {
      define('noDeps', function (require, exports, module) {
        expect(require).to.be.a('function');
        expect(exports).to.be.an('object');
        expect(module).to.be.an('object');
        done();
      });
    });
  });

  describe('emptyDeps', function () {
    it('should be treated as no dependencies instead of the default require, exports, module', function (done) {
      define('emptyDeps', [], function () {
        expect(arguments.length).to.equal(0);
        done();
      });
    });
  });

  describe('simpleDeps', function () {
    it('should just work', function (done) {
      define('a', {
        name: 'a'
      });
      define('b', ['sub/c'], function (c) {
        return {
          name: 'b',
          cName: c.name
        };
      });
      define('sub/c', function () {
        return {
          name: 'c'
        };
      });
      define(['a', 'b'], function (a, b) {
        expect(a.name).to.equal('a');
        expect(b.name).to.equal('b');
        expect(b.cName).to.equal('c');
        done();
      });
    });
  });

  describe('require', function () {
    it('should just work', function (done) {
      define('a', {
        name: 'a'
      });
      define('b', [], function () {
        return {
          name: 'b'
        };
      });
      define('c', function () {
        return {
          name: 'c'
        };
      });
      define(['require', 'a'], function (require) {
        require(['b', 'c'], function (b, c) {
          var a = require('a');
          expect(a.name).to.equal('a');
          expect(b.name).to.equal('b');
          expect(c.name).to.equal('c');
          done();
        });
      });
    });
  });

  describe('as commonjs transport', function () {
    it('should use module and exports', function (done) {
      define('one', function (require, exports, module) {
        exports.size = 'large';
        exports.module = module;
        exports.doSomething = function () {
          return require('two');
        };
      });
      define('two', ['require', 'one'], function (require) {
        var one = require('one');
        return {
          size: 'small',
          color: 'redtwo',
          doSomething: function () {
            return one.doSomething();
          },
          getOneModule: function () {
            return one.module;
          }
        };
      });
      define('three', ['require', 'exports', 'four', 'five'], function (require, exports) {
        var four = require('four'),
            five = require('five');
        exports.name = 'three';
        exports.fourName = four;
        exports.fiveName = five();
      });
      define('four', function () {
        return 'four';
      });
      define('five', function () {
        return function () {
          return 'five';
        };
      });
      define(['one', 'two', 'three'], function (one, two, three) {
        var args = two.doSomething(),
            oneMod = two.getOneModule();
        expect(one.size).to.equal('large');
        expect(two.size).to.equal('small');
        expect(args.size).to.equal('small');
        expect(args.color).to.equal('redtwo');
        expect(oneMod.id).to.equal('one');
        expect(three.name).to.equal('three');
        expect(three.fourName).to.equal('four');
        expect(three.fiveName).to.equal('five');
        done();
      });
    });
  });
});
