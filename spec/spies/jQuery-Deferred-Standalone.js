/*
 * jQuery.Deferred stand alone
 *
 */


/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function(global, undefined) {
  // Save a reference to some core methods
  var core_push = Array.prototype.push,
    core_slice = Array.prototype.slice,
    core_indexOf = Array.prototype.indexOf,
    core_toString = Object.prototype.toString,
    core_hasOwn = Object.prototype.hasOwnProperty,
    core_trim = String.prototype.trim,
    core_rspace = /\s+/,
    class2type = [],
      // Map over jQuery in case of overwrite
    _jQuery = global.jQuery,
      // Map over the $ in case of overwrite
    _$ = global.$,
    
    /**** actually jQuery isnt called as a function, but i decided to mantain it, 
    to keep the code as much untouched as possible ***/

    // Define a local copy of jQuery
    jQuery = function(selector) {

      //alert us that this is an special version 
      if(selector)
        throw "This is the stand alone version of jQuery.Deferred there isn't support for selectors, use jQuery.noConflict() and include a complete jQuery";
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init();
    };

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function() {
      return this;
    },
    each: function(callback, args) {
      return jQuery.each(this, callback, args);
    }
  };

  jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if(typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if(typeof target !== "object" && !jQuery.isFunction(target)) {
      target = {};
    }

    // extend jQuery itself if only one argument is passed
    if(length === i) {
      target = this;
      --i;
    }

    for(; i < length; i++) {
      // Only deal with non-null/undefined values
      if((options = arguments[i]) != null) {
        // Extend the base object
        for(name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if(target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if(deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if(copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];

            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = jQuery.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if(copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  var optionsCache = {};

  function createOptions(options) {
    var object = optionsCache[options] = {};
    jQuery.each(options.split(core_rspace), function(_, flag) {
      object[flag] = true;
    });
    return object;
  }


  jQuery.extend({
    noConflict: function(deep) {
      if(global.$ === jQuery) {
        global.$ = _$;
      }

      if(deep && global.jQuery === jQuery) {
        global.jQuery = _jQuery;
      }

      return jQuery;
    },
    inArray: function(elem, arr, i) {
      var len;

      if(arr) {
        if(core_indexOf) {
          return core_indexOf.call(arr, elem, i);
        }

        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

        for(; i < len; i++) {
          // Skip accessing in sparse arrays
          if(i in arr && arr[i] === elem) {
            return i;
          }
        }
      }

      return -1;
    },
    type: function(obj) {
      return obj == null ? String(obj) : class2type[core_toString.call(obj)] || "object";
    },
    isFunction: function(obj) {
      return jQuery.type(obj) === "function";
    },
    each: function(obj, callback, args) {
      var name, i = 0,
        length = obj.length,
        isObj = length === undefined || jQuery.isFunction(obj);

      if(args) {
        if(isObj) {
          for(name in obj) {
            if(callback.apply(obj[name], args) === false) {
              break;
            }
          }
        } else {
          for(; i < length;) {
            if(callback.apply(obj[i++], args) === false) {
              break;
            }
          }
        }

        // A special, fast, case for the most common use of each
      } else {
        if(isObj) {
          for(name in obj) {
            if(callback.call(obj[name], name, obj[name]) === false) {
              break;
            }
          }
        } else {
          for(; i < length;) {
            if(callback.call(obj[i], i, obj[i++]) === false) {
              break;
            }
          }
        }
      }

      return obj;
    }

  });


  // Populate the class2type map
  jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });


  jQuery.Callbacks = function(options) {

    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : jQuery.extend({}, options);

    var // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // Flag to know if list is currently firing
    firing,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // Actual callback list
    list = [],
      // Stack of fire calls for repeatable lists
      stack = !options.once && [],
      // Fire callbacks
      fire = function(data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;
        for(; list && firingIndex < firingLength; firingIndex++) {
          if(list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
            memory = false; // To prevent further calls using add
            break;
          }
        }
        firing = false;
        if(list) {
          if(stack) {
            if(stack.length) {
              fire(stack.shift());
            }
          } else if(memory) {
            list = [];
          } else {
            self.disable();
          }
        }
      },
      // Actual Callbacks object
      self = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          if(list) {
            // First, we save the current length
            var start = list.length;
            (function add(args) {
              jQuery.each(args, function(_, arg) {
                var type = jQuery.type(arg);
                if(type === "function") {
                  if(!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                } else if(arg && arg.length && type !== "string") {
                  // Inspect recursively
                  add(arg);
                }
              });
            })(arguments);
            // Do we need to add the callbacks to the
            // current firing batch?
            if(firing) {
              firingLength = list.length;
              // With memory, if we're not firing then
              // we should call right away
            } else if(memory) {
              firingStart = start;
              fire(memory);
            }
          }
          return this;
        },
        // Remove a callback from the list
        remove: function() {
          if(list) {
            jQuery.each(arguments, function(_, arg) {
              var index;
              while((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                // Handle firing indexes
                if(firing) {
                  if(index <= firingLength) {
                    firingLength--;
                  }
                  if(index <= firingIndex) {
                    firingIndex--;
                  }
                }
              }
            });
          }
          return this;
        },
        // Control if a given callback is in the list
        has: function(fn) {
          return jQuery.inArray(fn, list) > -1;
        },
        // Remove all callbacks from the list
        empty: function() {
          list = [];
          return this;
        },
        // Have the list do nothing anymore
        disable: function() {
          list = stack = memory = undefined;
          return this;
        },
        // Is it disabled?
        disabled: function() {
          return !list;
        },
        // Lock the list in its current state
        lock: function() {
          stack = undefined;
          if(!memory) {
            self.disable();
          }
          return this;
        },
        // Is it locked?
        locked: function() {
          return !stack;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(context, args) {
          args = args || [];
          args = [context, args.slice ? args.slice() : args];
          if(list && (!fired || stack)) {
            if(firing) {
              stack.push(args);
            } else {
              fire(args);
            }
          }
          return this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          self.fireWith(this, arguments);
          return this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!fired;
        }
      };

    return self;
  };

  jQuery.extend({
    Deferred: function(func) {
      var tuples = [
      // action, add listener, listener list, final state
      ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
        ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
        ["notify", "progress", jQuery.Callbacks("memory")]
      ],
        state = "pending",
        promise = {
          state: function() {
            return state;
          },
          always: function() {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          then: function( /* fnDone, fnFail, fnProgress */ ) {
            var fns = arguments;
            return jQuery.Deferred(function(newDefer) {
              jQuery.each(tuples, function(i, tuple) {
                var action = tuple[0],
                  fn = fns[i];
                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                deferred[tuple[1]](jQuery.isFunction(fn) ?
                function() {
                  var returned = fn.apply(this, arguments);
                  if(returned && jQuery.isFunction(returned.promise)) {
                    returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                  } else {
                    newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
                  }
                } : newDefer[action]);
              });
              fns = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(obj) {
            return obj != null ? jQuery.extend(obj, promise) : promise;
          }
        },
        deferred = {};

      // Keep pipe for back-compat
      promise.pipe = promise.then;

      // Add list-specific methods
      jQuery.each(tuples, function(i, tuple) {
        var list = tuple[2],
          stateString = tuple[3];

        // promise[ done | fail | progress ] = list.add
        promise[tuple[1]] = list.add;

        // Handle state
        if(stateString) {
          list.add(function() {
            // state = [ resolved | rejected ]
            state = stateString;

            // [ reject_list | resolve_list ].disable; progress_list.lock
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }

        // deferred[ resolve | reject | notify ] = list.fire
        deferred[tuple[0]] = list.fire;
        deferred[tuple[0] + "With"] = list.fireWith;
      });

      // Make the deferred a promise
      promise.promise(deferred);

      // Call given func if any
      if(func) {
        func.call(deferred, deferred);
      }

      // All done!
      return deferred;
    },

    // Deferred helper
    when: function(subordinate /* , ..., subordinateN */ ) {
      var i = 0,
        resolveValues = core_slice.call(arguments),
        length = resolveValues.length,

        // the count of uncompleted subordinates
        remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

        // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
        deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

        // Update function for both resolve and progress values
        updateFunc = function(i, contexts, values) {
          return function(value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
            if(values === progressValues) {
              deferred.notifyWith(contexts, values);
            } else if(!(--remaining)) {
              deferred.resolveWith(contexts, values);
            }
          };
        },

        progressValues, progressContexts, resolveContexts;

      // add listeners to Deferred subordinates; treat others as resolved
      if(length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        for(; i < length; i++) {
          if(resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }

      // if we're not waiting on anything, resolve the master
      if(!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }

      return deferred.promise();
    }
  });

  // Expose jQuery to the global object
  global.jQuery = global.$ = jQuery;

})(this);