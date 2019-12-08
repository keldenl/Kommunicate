(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Kuroshiro = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":2}],2:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":3}],3:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _util = require("./util");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);var value = info.value;
                } catch (error) {
                    reject(error);return;
                }if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        step("next", value);
                    }, function (err) {
                        step("throw", err);
                    });
                }
            }return step("next");
        });
    };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Kuroshiro Class
 */
var Kuroshiro = function () {
    /**
     * Constructor
     * @constructs Kuroshiro
     */
    function Kuroshiro() {
        _classCallCheck(this, Kuroshiro);

        this._analyzer = null;
    }

    /**
     * Initiate Kuroshiro
     * @memberOf Kuroshiro
     * @instance
     * @returns {Promise} Promise object represents the result of initialization
     */

    _createClass(Kuroshiro, [{
        key: "init",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(analyzer) {
                var self;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;

                                if (!(self._analyzer == null)) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.prev = 2;
                                _context.next = 5;
                                return analyzer.init();

                            case 5:
                                self._analyzer = analyzer;
                                _context.next = 11;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context["catch"](2);
                                throw _context.t0;

                            case 11:
                                _context.next = 14;
                                break;

                            case 13:
                                throw new Error("Kuroshiro has already been initialized.");

                            case 14:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[2, 8]]);
            }));

            function init(_x) {
                return _ref.apply(this, arguments);
            }

            return init;
        }()

        /**
         * Convert given string to target syllabary with options available
         * @memberOf Kuroshiro
         * @instance
         * @param {string} str Given String
         * @param {Object} [options] JSON object which have key-value pairs settings
         * @param {string} [options.to='hiragana'] Target syllabary ['hiragana'|'katakana'|'romaji']
         * @param {string} [options.mode='normal'] Convert mode ['normal'|'spaced'|'okurigana'|'furigana']
         * @param {string} [options.delimiter_start='('] Delimiter(Start)
         * @param {string} [options.delimiter_end=')'] Delimiter(End)
         * @returns {Promise} Promise object represents the result of conversion
         */

    }, {
        key: "convert",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(str, options) {
                var tokens, cr, hi, tmp, hpattern, hc, hreg, hmatches, pickKJ, hc1, notations, i, strType, pattern, isLastTokenKanji, subs, c, reg, matches, pickKanji, c1, c2, c3, result, n0, n1, n2, n3, n4, n5;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                options = options || {};
                                options.to = options.to || "hiragana";
                                options.mode = options.mode || "normal";
                                // options.convertall = options.convertall || false;
                                options.delimiter_start = options.delimiter_start || "(";
                                options.delimiter_end = options.delimiter_end || ")";
                                str = str || "";

                                _context2.next = 8;
                                return this._analyzer.parse(str);

                            case 8:
                                tokens = _context2.sent;

                                for (cr = 0; cr < tokens.length; cr++) {
                                    if ((0, _util.hasJapanese)(tokens[cr].surface_form)) {
                                        if (!tokens[cr].reading) {
                                            if (tokens[cr].surface_form.split().every(_util.isKana)) {
                                                tokens[cr].reading = (0, _util.toRawKatakana)(tokens[cr].surface_form);
                                            } else {
                                                tokens[cr].reading = tokens[cr].surface_form;
                                            }
                                        } else if ((0, _util.hasHiragana)(tokens[cr].reading)) {
                                            tokens[cr].reading = (0, _util.toRawKatakana)(tokens[cr].reading);
                                        }
                                    } else {
                                        tokens[cr].reading = tokens[cr].surface_form;
                                    }
                                }

                                if (!(options.mode === "normal" || options.mode === "spaced")) {
                                    _context2.next = 27;
                                    break;
                                }

                                _context2.t0 = options.to;
                                _context2.next = _context2.t0 === "katakana" ? 14 : _context2.t0 === "romaji" ? 17 : _context2.t0 === "hiragana" ? 20 : 24;
                                break;

                            case 14:
                                if (!(options.mode === "normal")) {
                                    _context2.next = 16;
                                    break;
                                }

                                return _context2.abrupt("return", (0, _util.splitObjArray)(tokens, "reading"));

                            case 16:
                                return _context2.abrupt("return", (0, _util.splitObjArray)(tokens, "reading", " "));

                            case 17:
                                if (!(options.mode === "normal")) {
                                    _context2.next = 19;
                                    break;
                                }

                                return _context2.abrupt("return", (0, _util.toRawRomaji)((0, _util.splitObjArray)(tokens, "reading")));

                            case 19:
                                return _context2.abrupt("return", (0, _util.toRawRomaji)((0, _util.splitObjArray)(tokens, "reading", " ")));

                            case 20:
                                for (hi = 0; hi < tokens.length; hi++) {
                                    if ((0, _util.hasKanji)(tokens[hi].surface_form)) {
                                        if (!(0, _util.hasKatakana)(tokens[hi].surface_form)) {
                                            tokens[hi].reading = (0, _util.toRawHiragana)(tokens[hi].reading);
                                        } else {
                                            // handle katakana-kanji-mixed tokens
                                            tokens[hi].reading = (0, _util.toRawHiragana)(tokens[hi].reading);
                                            tmp = "";
                                            hpattern = "";

                                            for (hc = 0; hc < tokens[hi].surface_form.length; hc++) {
                                                if ((0, _util.isKanji)(tokens[hi].surface_form[hc])) {
                                                    hpattern += "(.*)";
                                                } else {
                                                    hpattern += (0, _util.isKatakana)(tokens[hi].surface_form[hc]) ? (0, _util.toRawHiragana)(tokens[hi].surface_form[hc]) : tokens[hi].surface_form[hc];
                                                }
                                            }
                                            hreg = new RegExp(hpattern);
                                            hmatches = hreg.exec(tokens[hi].reading);

                                            if (hmatches) {
                                                pickKJ = 0;

                                                for (hc1 = 0; hc1 < tokens[hi].surface_form.length; hc1++) {
                                                    if ((0, _util.isKanji)(tokens[hi].surface_form[hc1])) {
                                                        tmp += hmatches[pickKJ + 1];
                                                        pickKJ++;
                                                    } else {
                                                        tmp += tokens[hi].surface_form[hc1];
                                                    }
                                                }
                                                tokens[hi].reading = tmp;
                                            }
                                        }
                                    } else {
                                        tokens[hi].reading = tokens[hi].surface_form;
                                    }
                                }

                                if (!(options.mode === "normal")) {
                                    _context2.next = 23;
                                    break;
                                }

                                return _context2.abrupt("return", (0, _util.splitObjArray)(tokens, "reading"));

                            case 23:
                                return _context2.abrupt("return", (0, _util.splitObjArray)(tokens, "reading", " "));

                            case 24:
                                throw new Error("Unknown option.to param");

                            case 25:
                                _context2.next = 68;
                                break;

                            case 27:
                                if (!(options.mode === "okurigana" || options.mode === "furigana")) {
                                    _context2.next = 67;
                                    break;
                                }

                                notations = []; // [basic,basic_type[1=kanji,2=hiragana(katakana),3=others],notation]

                                i = 0;

                            case 30:
                                if (!(i < tokens.length)) {
                                    _context2.next = 54;
                                    break;
                                }

                                tokens[i].reading = (0, _util.toRawHiragana)(tokens[i].reading);

                                strType = (0, _util.getStrType)(tokens[i].surface_form);
                                _context2.t1 = strType;
                                _context2.next = _context2.t1 === 0 ? 36 : _context2.t1 === 1 ? 38 : _context2.t1 === 2 ? 46 : _context2.t1 === 3 ? 48 : 50;
                                break;

                            case 36:
                                notations.push([tokens[i].surface_form, 1, tokens[i].reading]);
                                return _context2.abrupt("break", 51);

                            case 38:
                                pattern = "";
                                isLastTokenKanji = false;
                                subs = []; // recognize kanjis and group them

                                for (c = 0; c < tokens[i].surface_form.length; c++) {
                                    if ((0, _util.isKanji)(tokens[i].surface_form[c])) {
                                        if (!isLastTokenKanji) {
                                            // ignore successive kanji tokens (#10)
                                            isLastTokenKanji = true;
                                            pattern += "(.*)";
                                            subs.push(tokens[i].surface_form[c]);
                                        } else {
                                            subs[subs.length - 1] += tokens[i].surface_form[c];
                                        }
                                    } else {
                                        isLastTokenKanji = false;
                                        subs.push(tokens[i].surface_form[c]);
                                        pattern += (0, _util.isKatakana)(tokens[i].surface_form[c]) ? (0, _util.toRawHiragana)(tokens[i].surface_form[c]) : tokens[i].surface_form[c];
                                    }
                                }
                                reg = new RegExp("^" + pattern + "$");
                                matches = reg.exec(tokens[i].reading);

                                if (matches) {
                                    pickKanji = 1;

                                    for (c1 = 0; c1 < subs.length; c1++) {
                                        if ((0, _util.isKanji)(subs[c1][0])) {
                                            notations.push([subs[c1], 1, matches[pickKanji++]]);
                                        } else {
                                            notations.push([subs[c1], 2, (0, _util.toRawHiragana)(subs[c1])]);
                                        }
                                    }
                                } else {
                                    notations.push([tokens[i].surface_form, 1, tokens[i].reading]);
                                }
                                return _context2.abrupt("break", 51);

                            case 46:
                                for (c2 = 0; c2 < tokens[i].surface_form.length; c2++) {
                                    notations.push([tokens[i].surface_form[c2], 2, tokens[i].reading[c2]]);
                                }
                                return _context2.abrupt("break", 51);

                            case 48:
                                for (c3 = 0; c3 < tokens[i].surface_form.length; c3++) {
                                    notations.push([tokens[i].surface_form[c3], 3, tokens[i].surface_form[c3]]);
                                }
                                return _context2.abrupt("break", 51);

                            case 50:
                                throw new Error("Unknown strType");

                            case 51:
                                i++;
                                _context2.next = 30;
                                break;

                            case 54:
                                result = "";
                                _context2.t2 = options.to;
                                _context2.next = _context2.t2 === "katakana" ? 58 : _context2.t2 === "romaji" ? 60 : _context2.t2 === "hiragana" ? 62 : 64;
                                break;

                            case 58:
                                if (options.mode === "okurigana") {
                                    for (n0 = 0; n0 < notations.length; n0++) {
                                        if (notations[n0][1] !== 1) {
                                            result += notations[n0][0];
                                        } else {
                                            result += notations[n0][0] + options.delimiter_start + (0, _util.toRawKatakana)(notations[n0][2]) + options.delimiter_end;
                                        }
                                    }
                                } else {
                                    // furigana
                                    for (n1 = 0; n1 < notations.length; n1++) {
                                        if (notations[n1][1] !== 1) {
                                            result += notations[n1][0];
                                        } else {
                                            result += "<ruby>" + notations[n1][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + (0, _util.toRawKatakana)(notations[n1][2]) + "</rt><rp>" + options.delimiter_end + "</rp></ruby>";
                                        }
                                    }
                                }
                                return _context2.abrupt("return", result);

                            case 60:
                                if (options.mode === "okurigana") {
                                    for (n2 = 0; n2 < notations.length; n2++) {
                                        if (notations[n2][1] !== 1) {
                                            result += notations[n2][0];
                                        } else {
                                            result += notations[n2][0] + options.delimiter_start + (0, _util.toRawRomaji)(notations[n2][2]) + options.delimiter_end;
                                        }
                                    }
                                } else {
                                    // furigana
                                    result += "<ruby>";
                                    for (n3 = 0; n3 < notations.length; n3++) {
                                        result += notations[n3][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + (0, _util.toRawRomaji)(notations[n3][2]) + "</rt><rp>" + options.delimiter_end + "</rp>";
                                    }
                                    result += "</ruby>";
                                }
                                return _context2.abrupt("return", result);

                            case 62:
                                if (options.mode === "okurigana") {
                                    for (n4 = 0; n4 < notations.length; n4++) {
                                        if (notations[n4][1] !== 1) {
                                            result += notations[n4][0];
                                        } else {
                                            result += notations[n4][0] + options.delimiter_start + notations[n4][2] + options.delimiter_end;
                                        }
                                    }
                                } else {
                                    // furigana
                                    for (n5 = 0; n5 < notations.length; n5++) {
                                        if (notations[n5][1] !== 1) {
                                            result += notations[n5][0];
                                        } else {
                                            result += "<ruby>" + notations[n5][0] + "<rp>" + options.delimiter_start + "</rp><rt>" + notations[n5][2] + "</rt><rp>" + options.delimiter_end + "</rp></ruby>";
                                        }
                                    }
                                }
                                return _context2.abrupt("return", result);

                            case 64:
                                throw new Error("Unknown option.to param");

                            case 65:
                                _context2.next = 68;
                                break;

                            case 67:
                                throw new Error("No such mode...");

                            case 68:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function convert(_x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return convert;
        }()
    }]);

    return Kuroshiro;
}();

var Util = {
    isHiragana: _util.isHiragana,
    isKatakana: _util.isKatakana,
    isKana: _util.isKana,
    isKanji: _util.isKanji,
    isJapanese: _util.isJapanese,
    hasHiragana: _util.hasHiragana,
    hasKatakana: _util.hasKatakana,
    hasKana: _util.hasKana,
    hasKanji: _util.hasKanji,
    hasJapanese: _util.hasJapanese
};

Kuroshiro.Util = Util;

exports.default = Kuroshiro;
module.exports = exports["default"];

},{"./util":6,"babel-runtime/regenerator":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require("./core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = _core2.default;
module.exports = exports["default"];

},{"./core":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

var KATAKANA_HIRAGANA_SHIFT = "\u3041".charCodeAt(0) - "\u30A1".charCodeAt(0);
var HIRAGANA_KATAKANA_SHIFT = "\u30A1".charCodeAt(0) - "\u3041".charCodeAt(0);

/**
 * Check if given char is a hiragana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a hiragana
 */
var isHiragana = function isHiragana(ch) {
    ch = ch[0];
    return ch >= "\u3040" && ch <= "\u309F";
};

/**
 * Check if given char is a katakana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a katakana
 */
var isKatakana = function isKatakana(ch) {
    ch = ch[0];
    return ch >= "\u30A0" && ch <= "\u30FF";
};

/**
 * Check if given char is a kana
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kana
 */
var isKana = function isKana(ch) {
    return isHiragana(ch) || isKatakana(ch);
};

/**
 * Check if given char is a kanji
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a kanji
 */
var isKanji = function isKanji(ch) {
    ch = ch[0];
    return ch >= "\u4E00" && ch <= "\u9FCF" || ch >= "\uF900" && ch <= "\uFAFF" || ch >= "\u3400" && ch <= "\u4DBF";
};

/**
 * Check if given char is a Japanese
 *
 * @param {string} ch Given char
 * @return {boolean} if given char is a Japanese
 */
var isJapanese = function isJapanese(ch) {
    return isKana(ch) || isKanji(ch);
};

/**
 * Check if given string has hiragana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has hiragana
 */
var hasHiragana = function hasHiragana(str) {
    for (var i = 0; i < str.length; i++) {
        if (isHiragana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has katakana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has katakana
 */
var hasKatakana = function hasKatakana(str) {
    for (var i = 0; i < str.length; i++) {
        if (isKatakana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has kana
 *
 * @param {string} str Given string
 * @return {boolean} if given string has kana
 */
var hasKana = function hasKana(str) {
    for (var i = 0; i < str.length; i++) {
        if (isKana(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has kanji
 *
 * @param {string} str Given string
 * @return {boolean} if given string has kanji
 */
var hasKanji = function hasKanji(str) {
    for (var i = 0; i < str.length; i++) {
        if (isKanji(str[i])) return true;
    }
    return false;
};

/**
 * Check if given string has Japanese
 *
 * @param {string} str Given string
 * @return {boolean} if given string has Japanese
 */
var hasJapanese = function hasJapanese(str) {
    for (var i = 0; i < str.length; i++) {
        if (isJapanese(str[i])) return true;
    }
    return false;
};

var toRawHiragana = function toRawHiragana(str) {
    return [].concat(_toConsumableArray(str)).map(function (ch) {
        if (ch > "\u30A0" && ch < "\u30F7") {
            return String.fromCharCode(ch.charCodeAt(0) + KATAKANA_HIRAGANA_SHIFT);
        }
        return ch;
    }).join("");
};

var toRawKatakana = function toRawKatakana(str) {
    return [].concat(_toConsumableArray(str)).map(function (ch) {
        if (ch > "\u3040" && ch < "\u3097") {
            return String.fromCharCode(ch.charCodeAt(0) + HIRAGANA_KATAKANA_SHIFT);
        }
        return ch;
    }).join("");
};

var toRawRomaji = function toRawRomaji(str) {
    var roman = {

        "１": "1",
        "２": "2",
        "３": "3",
        "４": "4",
        "５": "5",
        "６": "6",
        "７": "7",
        "８": "8",
        "９": "9",
        "０": "0",
        "！": "!",
        "“": "\"",
        "”": "\"",
        "＃": "#",
        "＄": "$",
        "％": "%",
        "＆": "&",
        "’": "'",
        "（": "(",
        "）": ")",
        "＝": "=",
        "～": "~",
        "｜": "|",
        "＠": "@",
        "‘": "`",
        "＋": "+",
        "＊": "*",
        "；": ";",
        "：": ":",
        "＜": "<",
        "＞": ">",
        "、": ",",
        "。": ".",
        "／": "/",
        "？": "?",
        "＿": "_",
        "・": "･",
        "「": "\"",
        "」": "\"",
        "｛": "{",
        "｝": "}",
        "￥": "\\",
        "＾": "^",

        "ふぁ": "fa",
        "ふぃ": "fi",
        "ふぇ": "fe",
        "ふぉ": "fo",
        "ファ": "fa",
        "フィ": "fi",
        "フェ": "fe",
        "フォ": "fo",

        "きゃ": "kya",
        "きゅ": "kyu",
        "きょ": "kyo",
        "しゃ": "sha",
        "しゅ": "shu",
        "しょ": "sho",
        "ちゃ": "cha",
        "ちゅ": "chu",
        "ちょ": "cho",
        "にゃ": "nya",
        "にゅ": "nyu",
        "にょ": "nyo",
        "ひゃ": "hya",
        "ひゅ": "hyu",
        "ひょ": "hyo",
        "みゃ": "mya",
        "みゅ": "myu",
        "みょ": "myo",
        "りゃ": "rya",
        "りゅ": "ryu",
        "りょ": "ryo",

        "キャ": "kya",
        "キュ": "kyu",
        "キョ": "kyo",
        "シャ": "sha",
        "シュ": "shu",
        "ショ": "sho",
        "チャ": "cha",
        "チュ": "chu",
        "チョ": "cho",
        "ニャ": "nya",
        "ニュ": "nyu",
        "ニョ": "nyo",
        "ヒャ": "hya",
        "ヒュ": "hyu",
        "ヒョ": "hyo",
        "ミャ": "mya",
        "ミュ": "myu",
        "ミョ": "myo",
        "リャ": "rya",
        "リュ": "ryu",
        "リョ": "ryo",

        "ふゃ": "fya",
        "ふゅ": "fyu",
        "ふょ": "fyo",
        "ぴゃ": "pya",
        "ぴゅ": "pyu",
        "ぴょ": "pyo",
        "びゃ": "bya",
        "びゅ": "byu",
        "びょ": "byo",
        "ぢゃ": "dya",
        "ぢゅ": "dyu",
        "ぢょ": "dyo",
        "じゃ": "ja",
        "じゅ": "ju",
        "じょ": "jo",
        "ぎゃ": "gya",
        "ぎゅ": "gyu",
        "ぎょ": "gyo",

        "フャ": "fya",
        "フュ": "fyu",
        "フョ": "fyo",
        "ピャ": "pya",
        "ピュ": "pyu",
        "ピョ": "pyo",
        "ビャ": "bya",
        "ビュ": "byu",
        "ビョ": "byo",
        "ヂャ": "dya",
        "ヂュ": "dyu",
        "ヂョ": "dyo",
        "ジャ": "ja",
        "ジュ": "ju",
        "ジョ": "jo",
        "ギャ": "gya",
        "ギュ": "gyu",
        "ギョ": "gyo",

        "ぱ": "pa",
        "ぴ": "pi",
        "ぷ": "pu",
        "ぺ": "pe",
        "ぽ": "po",
        "ば": "ba",
        "び": "bi",
        "ぶ": "bu",
        "べ": "be",
        "ぼ": "bo",
        "だ": "da",
        "ぢ": "di",
        "づ": "du",
        "で": "de",
        "ど": "do",
        "ざ": "za",
        "じ": "ji",
        "ず": "zu",
        "ぜ": "ze",
        "ぞ": "zo",
        "が": "ga",
        "ぎ": "gi",
        "ぐ": "gu",
        "げ": "ge",
        "ご": "go",

        "パ": "pa",
        "ピ": "pi",
        "プ": "pu",
        "ペ": "pe",
        "ポ": "po",
        "バ": "ba",
        "ビ": "bi",
        "ブ": "bu",
        "ベ": "be",
        "ボ": "bo",
        "ダ": "da",
        "ヂ": "di",
        "ヅ": "du",
        "デ": "de",
        "ド": "do",
        "ザ": "za",
        "ジ": "ji",
        "ズ": "zu",
        "ゼ": "ze",
        "ゾ": "zo",
        "ガ": "ga",
        "ギ": "gi",
        "グ": "gu",
        "ゲ": "ge",
        "ゴ": "go",

        "わ": "wa",
        "ゐ": "wi",
        "ゑ": "we",
        "を": "wo",
        "ら": "ra",
        "り": "ri",
        "る": "ru",
        "れ": "re",
        "ろ": "ro",
        "や": "ya",
        "ゆ": "yu",
        "よ": "yo",
        "ま": "ma",
        "み": "mi",
        "む": "mu",
        "め": "me",
        "も": "mo",
        "は": "ha",
        "ひ": "hi",
        "ふ": "hu",
        "へ": "he",
        "ほ": "ho",
        "な": "na",
        "に": "ni",
        "ぬ": "nu",
        "ね": "ne",
        "の": "no",
        "た": "ta",
        "ち": "ti",
        "つ": "tsu",
        "て": "te",
        "と": "to",
        "さ": "sa",
        "し": "si",
        "す": "su",
        "せ": "se",
        "そ": "so",
        "か": "ka",
        "き": "ki",
        "く": "ku",
        "け": "ke",
        "こ": "ko",
        "あ": "a",
        "い": "i",
        "う": "u",
        "え": "e",
        "お": "o",
        "ぁ": "a",
        "ぃ": "i",
        "ぅ": "u",
        "ぇ": "e",
        "ぉ": "o",
        "ゃ": "ya",
        "ゅ": "yu",
        "ょ": "yo",

        "ワ": "wa",
        "ヰ": "wi",
        "ヱ": "we",
        "ヲ": "wo",
        "ラ": "ra",
        "リ": "ri",
        "ル": "ru",
        "レ": "re",
        "ロ": "ro",
        "ヤ": "ya",
        "ユ": "yu",
        "ヨ": "yo",
        "マ": "ma",
        "ミ": "mi",
        "ム": "mu",
        "メ": "me",
        "モ": "mo",
        "ハ": "ha",
        "ヒ": "hi",
        "フ": "hu",
        "ヘ": "he",
        "ホ": "ho",
        "ナ": "na",
        "ニ": "ni",
        "ヌ": "nu",
        "ネ": "ne",
        "ノ": "no",
        "タ": "ta",
        "チ": "ti",
        "ツ": "tsu",
        "テ": "te",
        "ト": "to",
        "サ": "sa",
        "シ": "si",
        "ス": "su",
        "セ": "se",
        "ソ": "so",
        "カ": "ka",
        "キ": "ki",
        "ク": "ku",
        "ケ": "ke",
        "コ": "ko",
        "ア": "a",
        "イ": "i",
        "ウ": "u",
        "エ": "e",
        "オ": "o",
        "ァ": "a",
        "ィ": "i",
        "ゥ": "u",
        "ェ": "e",
        "ォ": "o",
        "ャ": "ya",
        "ュ": "yu",
        "ョ": "yo",

        "ヶ": "ke",
        "ヵ": "ka",
        "ん": "n",
        "ン": "n",
        "ー": "-",
        "　": " "

    };
    var reg_tsu = /っ([bcdfghijklmnopqrstuvwyz])/gm;
    var reg_xtsu = /っ/gm;

    var pnt = 0;
    var max = str.length;
    var ch = void 0;
    var r = void 0;
    var result = "";

    while (pnt <= max) {
        if (r = roman[str.substring(pnt, pnt + 2)]) {
            result += r;
            pnt += 2;
        } else {
            result += (r = roman[ch = str.substring(pnt, pnt + 1)]) ? r : ch;
            pnt += 1;
        }
    }
    result = result.replace(reg_tsu, "$1$1");
    result = result.replace(reg_xtsu, "tsu");
    return result;
};

var getStrType = function getStrType(str) {
    // 0 for pure kanji,1 for kanji-hira(kana)-mixed,2 for pure hira(kana),3 for others
    var hasKJ = false;
    var hasHK = false;
    for (var i = 0; i < str.length; i++) {
        if (isKanji(str[i])) {
            hasKJ = true;
        } else if (isHiragana(str[i]) || isKatakana(str[i])) {
            hasHK = true;
        }
    }
    if (hasKJ && hasHK) return 1;else if (hasKJ) return 0;else if (hasHK) return 2;
    return 3;
};

var splitObjArray = function splitObjArray(arr, prop, split) {
    split = split || "";
    var result = "";
    for (var i = 0; i < arr.length; i++) {
        if (i !== arr.length - 1) {
            result += "" + arr[i][prop] + split;
        } else {
            result += arr[i][prop];
        }
    }
    return result;
};

exports.getStrType = getStrType;
exports.isHiragana = isHiragana;
exports.isKatakana = isKatakana;
exports.isKana = isKana;
exports.isKanji = isKanji;
exports.isJapanese = isJapanese;
exports.hasHiragana = hasHiragana;
exports.hasKatakana = hasKatakana;
exports.hasKana = hasKana;
exports.hasKanji = hasKanji;
exports.hasJapanese = hasJapanese;
exports.toRawHiragana = toRawHiragana;
exports.toRawKatakana = toRawKatakana;
exports.toRawRomaji = toRawRomaji;
exports.splitObjArray = splitObjArray;

},{}]},{},[5])(5)
});
