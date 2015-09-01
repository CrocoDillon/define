(function (global, factory) {
  if (typeof module == 'object' && typeof exports == 'object') {
    module.exports = factory();
  } else {
    global.define = factory();
  }
}(this, function () {
  'use strict';

  var loadedModules = {},
      queuedModules = [],
      dependenciesAreLoaded = function (dependencies) {
        for (var i = 0; i < dependencies.length; i++) {
          if (!loadedModules.hasOwnProperty(dependencies[i])) {
            return false;
          }
        }
        return true;
      },
      queueModule = function (id, dependencies, factory) {
        queuedModules.push([id, dependencies, factory]);
      },
      evaluateQueuedModules = function (id) {
        var module,
            i = 0;
        while (i < queuedModules.length) {
          module = queuedModules[i];
          if (dependenciesAreLoaded(module[1])) {
            queuedModules.splice(i, 1);
            loadModule.apply(undefined, module);
          } else {
            i++;
          }
        }
      },
      loadModule = function (id, dependencies, factory) {
        var module = {},
            exports;

        dependencies = dependencies.map(function (dependency) {
          if (dependency === 'module') {
            return module;
          }
          if (dependency === 'exports') {
            module.exports = {};
            return module.exports;
          }
          return loadedModules[dependency];
        });

        exports = factory.apply(global, dependencies);

        if (exports) {
          module.exports = exports;
        }

        if (id) {
          module.id = id;
          loadedModules[id] = module.exports;
          evaluateQueuedModules(id);
        }
      },
      define = function (id, dependencies, factory) {
        // `define(id, dependencies, factory)`
        // `define(dependencies, factory)`
        // `define(id, factory)`
        // `define(factory)`
        var args = Array.prototype.slice.call(arguments),
            toString = function (object) {
              return Object.prototype.toString.call(object);
            },
            object;

        if (toString(args[0]) === '[object String]') {
          id = args.shift();
        } else {
          id = undefined;
        }

        if (toString(args[0]) === '[object Array]') {
          dependencies = args.shift();
        } else {
          dependencies = ['require', 'exports', 'module'];
        }

        if (toString(args[0]) === '[object Object]') {
          object = args.shift();
          factory = function () {
            return object;
          };
        } else {
          factory = args.shift();
        }

        if (dependenciesAreLoaded(dependencies)) {
          loadModule(id, dependencies, factory);
        } else {
          queueModule(id, dependencies, factory);
        }
      };

  define.amd = {};

  define('require', [], function () {
    return function (id) {
      if (typeof id === 'string') {
        return loadedModules[id];
      } else {
        define.apply(global, arguments);
      }
    };
  });
  define('exports', [], function () {});
  define('module', [], function () {});

  return define;
}));
