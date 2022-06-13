var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "node_modules/tsup/assets/cjs_shims.js"() {
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module2) {
    init_cjs_shims();
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports, module2) {
    init_cjs_shims();
    var wrappy = require_wrappy();
    module2.exports = wrappy(once2);
    module2.exports.strict = wrappy(onceStrict);
    once2.proto = once2(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once2(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once2(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Err: () => Err,
  Logger: () => Logger,
  Ok: () => Ok,
  delay: () => delay,
  displayError: () => displayError,
  displayShellCommand: () => displayShellCommand,
  doValuesContainSameData: () => doValuesContainSameData,
  envNumberVar: () => envNumberVar,
  envVar: () => envVar,
  err: () => err,
  fetch: () => import_node_fetch.default,
  getFreeId: () => getFreeId,
  getOctokit: () => getOctokit,
  getShellCommandRunner: () => getShellCommandRunner,
  intoError: () => intoError,
  isGithubOrganizationMember: () => isGithubOrganizationMember,
  ld: () => ld,
  normalizeValue: () => normalizeValue,
  ok: () => ok,
  redact: () => redact,
  tryReadFile: () => tryReadFile,
  validatedFetch: () => validatedFetch
});
module.exports = __toCommonJS(src_exports);
init_cjs_shims();

// src/env.ts
init_cjs_shims();
var import_assert = __toESM(require("assert"));
var envVar = (name) => {
  const val = process.env[name];
  if (typeof val !== "string") {
    throw new Error(`${name} was not found in the environment variables`);
  }
  return val;
};
var envNumberVar = (name) => {
  const val = process.env[name];
  (0, import_assert.default)(val, `${name} was not found in the environment variables`);
  const valNumber = parseInt(val);
  (0, import_assert.default)(valNumber, `${name} is not a number`);
  return valNumber;
};

// src/error.ts
init_cjs_shims();
var intoError = (value) => {
  if (value instanceof Error) {
    return value;
  }
  return new Error(String(value));
};
var displayError = (value) => {
  const error = intoError(value);
  return `${error.toString()}${error.stack ? `
${error.stack}` : ""}`;
};

// src/format.ts
init_cjs_shims();
var redact = (str, items) => {
  for (const item of items) {
    str = str.replaceAll(item, "{REDACTED}");
  }
  return str;
};

// src/logger.ts
init_cjs_shims();

// src/normalization.ts
init_cjs_shims();
var normalizers = {
  symbol: (value) => {
    return value.toString();
  },
  bigint: (value) => {
    return value.toString();
  },
  undefined: () => {
    return void 0;
  },
  function: () => {
    return void 0;
  },
  boolean: (value) => {
    return value;
  },
  number: (value) => {
    return value;
  },
  string: (value) => {
    return value;
  },
  object: (value, previousObjects = [], showTopLevel = false) => {
    if (value === null) {
      return;
    }
    previousObjects = previousObjects.concat([value]);
    const isArray = Array.isArray(value);
    const isIterable = !isArray && Symbol.iterator in value;
    const objAsArray = isArray ? value : isIterable ? Array.from(value) : void 0;
    if (objAsArray === void 0 && !(value instanceof Error)) {
      const asString = typeof value.toString === "function" && value.toString.length === 0 ? value.toString() : void 0;
      if (typeof asString === "string" && asString !== "[object Object]") {
        return asString;
      }
    }
    const { container, output } = (() => {
      if (isIterable) {
        const iteratorContainer = { type: value.constructor.name, items: [] };
        return { container: iteratorContainer, output: iteratorContainer.items };
      }
      const outputObj = objAsArray === void 0 ? {} : [];
      return { container: outputObj, output: outputObj };
    })();
    const sourceObj = objAsArray != null ? objAsArray : value;
    for (const key of Object.getOwnPropertyNames(sourceObj)) {
      setNormalizedKeyValue(sourceObj, output, key, previousObjects);
    }
    if (Object.keys(output).length > 0) {
      return container;
    } else if (showTopLevel) {
      return objAsArray ? [] : {};
    }
  }
};
var setNormalizedKeyValue = (source, output, key, previousObjects) => {
  if (previousObjects.indexOf(source[key]) !== -1) {
    return "[Circular]";
  }
  const value = normalizeValue(source[key], previousObjects);
  if (value === void 0) {
    return;
  }
  output[key] = value;
};
var normalizeValue = (value, previousObjects = [], showTopLevel = false) => {
  return normalizers[typeof value](value, previousObjects, showTopLevel);
};

// src/logger.ts
var LoggingLevel = /* @__PURE__ */ ((LoggingLevel2) => {
  LoggingLevel2[LoggingLevel2["trace"] = 0] = "trace";
  LoggingLevel2[LoggingLevel2["debug"] = 1] = "debug";
  LoggingLevel2[LoggingLevel2["info"] = 2] = "info";
  LoggingLevel2[LoggingLevel2["warn"] = 3] = "warn";
  LoggingLevel2[LoggingLevel2["error"] = 4] = "error";
  LoggingLevel2[LoggingLevel2["fatal"] = 5] = "fatal";
  return LoggingLevel2;
})(LoggingLevel || {});
var Logger = class {
  constructor(options) {
    this.options = options;
    this.info = this.loggerCallback("info");
    this.warn = this.loggerCallback("warn");
    this.error = this.loggerCallback("error");
    this.fatal = this.loggerCallback("fatal");
  }
  getFastifyLogger() {
    return __spreadProps(__spreadValues({}, this), {
      debug: this.loggerCallback("debug"),
      trace: this.loggerCallback("trace"),
      fatal: this.loggerCallback("fatal"),
      child: (context) => {
        return this.child(context).getFastifyLogger();
      }
    });
  }
  child(context) {
    var _a;
    const currentContextKeys = Object.keys((_a = this.options.context) != null ? _a : {});
    const adjustedContext = {};
    for (const [key, value] of Object.entries(context)) {
      let suggestedName = key;
      while (currentContextKeys.includes(suggestedName)) {
        suggestedName = `${suggestedName} (${new Date().toISOString()})`;
      }
      adjustedContext[suggestedName] = value;
      currentContextKeys.push(suggestedName);
    }
    return new Logger(__spreadProps(__spreadValues({}, this.options), {
      context: currentContextKeys.length ? __spreadValues(__spreadValues({}, this.options.context), adjustedContext) : void 0
    }));
  }
  log(level, item, description, ...extra) {
    if (LoggingLevel[level] < LoggingLevel[this.options.minLogLevel]) {
      return;
    }
    const loggingFunction = (() => {
      switch (level) {
        case "trace":
        case "debug":
        case "info":
        case "warn": {
          return this.options.impl.log;
        }
        case "fatal":
        case "error": {
          return this.options.impl.error;
        }
        default: {
          const exhaustivenessCheck = level;
          throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
        }
      }
    })();
    switch (this.options.logFormat) {
      case "json": {
        loggingFunction(JSON.stringify({
          level,
          name: this.options.name,
          context: this.options.context,
          msg: normalizeValue(item, [], true),
          description,
          extra
        }));
        break;
      }
      case null: {
        const tag = `${level.toUpperCase()} (${this.options.name}):`;
        const normalizedContext = normalizeValue(this.options.context);
        loggingFunction(tag, ...description === void 0 ? [] : [description], ...normalizedContext === void 0 ? [] : ["~@ Context:", normalizedContext], ...extra.length === 0 ? [] : ["~@ Extra:", normalizeValue(extra)], normalizeValue(item, [], true));
        break;
      }
      default: {
        const exhaustivenessCheck = this.options.logFormat;
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
      }
    }
  }
  loggerCallback(level) {
    return (item, description, ...extra) => {
      return this.log(level, item, description, ...extra);
    };
  }
};

// src/time.ts
init_cjs_shims();
var delay = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

// src/types.ts
init_cjs_shims();
var Ok = class {
  constructor(value) {
    this.value = value;
  }
};
var ok = (value) => {
  return new Ok(value);
};
var Err = class {
  constructor(value) {
    this.value = value;
  }
};
var err = (value) => {
  return new Err(value);
};

// src/github.ts
init_cjs_shims();

// src/github/octokit.ts
init_cjs_shims();

// node_modules/@octokit/endpoint/dist-web/index.js
init_cjs_shims();

// node_modules/is-plain-object/dist/is-plain-object.mjs
init_cjs_shims();
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(o) {
  var ctor, prot;
  if (isObject(o) === false)
    return false;
  ctor = o.constructor;
  if (ctor === void 0)
    return true;
  prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}

// node_modules/universal-user-agent/dist-web/index.js
init_cjs_shims();
function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }
  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }
  return "<environment undetectable>";
}

// node_modules/@octokit/endpoint/dist-web/index.js
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults))
        Object.assign(result, { [key]: options[key] });
      else
        result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview) => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }
  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
  return mergedOptions;
}
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}
var urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
function omit(object, keysToOmit) {
  return Object.keys(object).filter((option) => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];
      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }
      expression.split(/,/g).forEach(function(variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });
      if (operator && operator !== "+") {
        var separator = ",";
        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }
        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }
    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
}
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}
var VERSION = "6.0.12";
var userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};
var endpoint = withDefaults(null, DEFAULTS);

// node_modules/@octokit/request-error/dist-web/index.js
init_cjs_shims();

// node_modules/deprecation/dist-web/index.js
init_cjs_shims();
var Deprecation = class extends Error {
  constructor(message) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "Deprecation";
  }
};

// node_modules/@octokit/request-error/dist-web/index.js
var import_once = __toESM(require_once());
var logOnceCode = (0, import_once.default)((deprecation) => console.warn(deprecation));
var logOnceHeaders = (0, import_once.default)((deprecation) => console.warn(deprecation));
var RequestError = class extends Error {
  constructor(message, statusCode, options) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.status = statusCode;
    let headers;
    if ("headers" in options && typeof options.headers !== "undefined") {
      headers = options.headers;
    }
    if ("response" in options) {
      this.response = options.response;
      headers = options.response.headers;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
    Object.defineProperty(this, "code", {
      get() {
        logOnceCode(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }
    });
    Object.defineProperty(this, "headers", {
      get() {
        logOnceHeaders(new Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
        return headers || {};
      }
    });
  }
};

// src/github/octokit.ts
var import_rest = require("@octokit/rest");
var import_async_mutex = require("async-mutex");

// src/github/api.ts
init_cjs_shims();
var commitsByRepositoryIdEndpoint = "/repositories/:repository_id/commits";
var githubApiEndpoints = {
  commitsByRepositoryId: commitsByRepositoryIdEndpoint,
  repositoryById: "/repositories/:repository_id",
  repositoryByName: "/repos/:owner/:name",
  pullRequestsByRepositoryId: "/repositories/:repository_id/pulls",
  pullRequestByRepositoryId: "/repositories/:repository_id/pulls/:pull_number",
  commitStatusByRepositoryId: "/repositories/:repository_id/statuses/:sha",
  pullRequestCommentsByRepositoryId: "/repositories/:repository_id/issues/:pull_number/comments",
  pullRequestStatusByRepositoryId: "/repositories/:repository_id/commits/pull/:pull_number/head/status",
  pullRequestCommitsByRepositoryId: `${commitsByRepositoryIdEndpoint}?sha=pull/:pull_number/head`,
  branchCommitsByRepositoryId: `${commitsByRepositoryIdEndpoint}?sha=:branch`,
  userPermissionsByRepositoryId: "/repositories/:repository_id/collaborators/:username/permission",
  userMembershipByOrganizationId: "/organizations/:organization_id/members/:username"
};

// src/github/octokit.ts
var wasOctokitExtendedByApplication = Symbol();
var defaultRequestMutex = new import_async_mutex.Mutex();
var requestDelay = Promise.resolve();
var rateLimitRemainingHeader = "x-ratelimit-remaining";
var rateLimitResetHeader = "x-ratelimit-reset";
var retryAfterHeader = "retry-after";
var getOctokit = ({
  logger,
  apiEndpoint,
  requestMutex: inputRequestMutex,
  getAuthHeaders
}, octokit) => {
  octokit != null ? octokit : octokit = new import_rest.Octokit(__spreadValues(__spreadValues({}, endpoint.DEFAULTS), apiEndpoint ? { baseUrl: apiEndpoint } : {}));
  if (octokit[wasOctokitExtendedByApplication]) {
    return octokit;
  }
  Object.assign(octokit.repos, {
    getPullCommits: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestCommitsByRepositoryId
    }),
    getBranchCommitsByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.branchCommitsByRepositoryId
    }),
    getCommitsByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.commitsByRepositoryId
    }),
    getCommits: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.commitsByRepositoryId
    }),
    getOpenPullRequests: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestsByRepositoryId
    }),
    getById: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.repositoryById
    })
  });
  Object.assign(octokit.pulls, {
    createCommentByRepositoryId: octokit.request.defaults({
      method: "POST",
      url: githubApiEndpoints.pullRequestCommentsByRepositoryId
    }),
    getByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestByRepositoryId
    })
  });
  Object.assign(octokit.checks, {
    createCommitStatusByRepositoryId: octokit.request.defaults({
      method: "POST",
      url: githubApiEndpoints.commitStatusByRepositoryId
    }),
    getPullStatusByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestStatusByRepositoryId
    })
  });
  Object.assign(octokit.users, {
    permissionsByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.userPermissionsByRepositoryId
    })
  });
  Object.assign(octokit.orgs, {
    userMembershipByOrganizationId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.userMembershipByOrganizationId
    }),
    revokeUserMembershipByOrganizationId: octokit.request.defaults({
      method: "DELETE",
      url: githubApiEndpoints.userMembershipByOrganizationId
    })
  });
  const requestMutex = inputRequestMutex != null ? inputRequestMutex : defaultRequestMutex;
  octokit.hook.wrap("request", async (request, options) => {
    logger.info({ request, options }, "Preparing to send a request to the GitHub API");
    let triesCount = 0;
    const result = await requestMutex.runExclusive(async () => {
      try {
        await requestDelay;
        if (getAuthHeaders) {
          const authHeaders = await getAuthHeaders();
          options.headers = __spreadValues(__spreadValues({}, options.headers), authHeaders);
        }
        for (; triesCount < 3; triesCount++) {
          if (triesCount) {
            logger.info(`Retrying Octokit request (tries so far: ${triesCount})`);
          }
          try {
            return new Ok(await request(options));
          } catch (error) {
            if (!(error instanceof RequestError)) {
              return new Err(error);
            }
            const { status, message } = error;
            const isApiRateLimitResponse = message.startsWith("You have exceeded a secondary rate limit.");
            if (!isApiRateLimitResponse && status >= 400 && status < 500) {
              return new Err(error);
            }
            const { response } = error;
            const fallbackWaitDuration = 1e3;
            const waitDuration = response === void 0 ? fallbackWaitDuration : (() => {
              var _a;
              const { headers } = response;
              if (parseInt((_a = headers[rateLimitRemainingHeader]) != null ? _a : "") === 0) {
                logger.warn(`GitHub API limits were hit! The "${rateLimitResetHeader}" response header will be read to figure out until when we're supposed to wait...`);
                const rateLimitResetHeaderValue = headers[rateLimitResetHeader];
                const resetEpoch = parseInt(rateLimitResetHeaderValue != null ? rateLimitResetHeaderValue : "") * 1e3;
                if (Number.isNaN(resetEpoch)) {
                  logger.error({
                    rateLimitResetHeaderValue,
                    rateLimitResetHeader,
                    headers
                  }, `GitHub response header "${rateLimitResetHeader}" could not be parsed as epoch`);
                } else {
                  const currentEpoch = Date.now();
                  const duration = resetEpoch - currentEpoch;
                  if (duration < 0) {
                    logger.error({
                      rateLimitResetHeaderValue,
                      resetEpoch,
                      currentEpoch,
                      headers
                    }, `Parsed epoch value for GitHub response header "${rateLimitResetHeader}" is smaller than the current date`);
                  } else {
                    return duration;
                  }
                }
              } else if (headers[retryAfterHeader] !== void 0) {
                const retryAfterHeaderValue = headers[retryAfterHeader];
                const duration = parseInt(String(retryAfterHeaderValue)) * 1e3;
                if (Number.isNaN(duration)) {
                  logger.error({
                    retryAfterHeader,
                    retryAfterHeaderValue,
                    headers
                  }, `GitHub response header "${retryAfterHeader}" could not be parsed as seconds`);
                } else {
                  return duration;
                }
              } else if (!isApiRateLimitResponse) {
                logger.info({ headers, fallbackWaitDuration, message }, "Falling back to default wait duration since other heuristics were not fulfilled");
                return fallbackWaitDuration;
              }
            })();
            if (waitDuration === void 0) {
              return new Err(error);
            }
            logger.info(`Waiting for ${waitDuration}ms until requests can be made again...`);
            await delay(waitDuration);
          }
        }
      } catch (error) {
        return new Err(error);
      }
    });
    requestDelay = delay(768);
    if (result instanceof Err) {
      throw result.value;
    } else if (result === void 0) {
      throw new Error(`Unable to fetch GitHub response within ${triesCount} tries`);
    }
    return result.value;
  });
  const extendedOctokit = octokit;
  extendedOctokit[wasOctokitExtendedByApplication] = true;
  return extendedOctokit;
};

// src/github.ts
var isGithubOrganizationMember = async ({ logger }, octokit, organization, user) => {
  const membershipStatus = await (async () => {
    try {
      return (await octokit.orgs.userMembershipByOrganizationId({
        organization_id: organization.id,
        username: user.login
      })).status;
    } catch (error) {
      logger.error(error, "GitHub membership request failed");
      return false;
    }
  })();
  if (typeof membershipStatus === "boolean") {
    return membershipStatus;
  }
  switch (membershipStatus) {
    case 204: {
      return true;
    }
    case 302: {
      logger.fatal(`Github organization membership API responded with status code ${membershipStatus} which means the bot is not considered an organization member. This should never happen because the bot should already be installed in that organization. It's possible that the bot's credentials were not properly used for this request.`);
      return false;
    }
    default: {
      logger.fatal(`GitHub organization membership API responded with unexpected status code ${membershipStatus}`);
      return false;
    }
  }
};

// src/comparison.ts
init_cjs_shims();
var import_deepdash = __toESM(require("deepdash"));
var import_lodash = __toESM(require("lodash"));
var ld = (0, import_deepdash.default)(import_lodash.default);
var doValuesContainSameData = (v1, v2) => {
  if (typeof v1 !== typeof v2) {
    return false;
  }
  v1 = normalizeValue(v1);
  v2 = normalizeValue(v2);
  const comparedPaths = [];
  const isSomeKeyDifferent = (source, target) => {
    if (typeof source !== "object" || typeof target !== "object") {
      return source === target;
    }
    return ld.someDeep(source, (sourceValue, _, __, ctx) => {
      const { path } = ctx;
      if (path === void 0) {
        return;
      }
      for (const prevPath of comparedPaths) {
        let matches = 0;
        for (let i = 0; i < prevPath.length; i++) {
          if (prevPath[i] === path[i]) {
            matches++;
          }
        }
        if (matches === prevPath.length) {
          return;
        }
      }
      const targetValue = ld.get(target, path);
      if (typeof sourceValue !== "object" || typeof targetValue !== "object") {
        return sourceValue !== targetValue;
      }
      if (Array.isArray(sourceValue) || Array.isArray(targetValue)) {
        if (!Array.isArray(sourceValue) || !Array.isArray(targetValue)) {
          return true;
        }
        for (const leftVal of sourceValue) {
          if (targetValue.find((rightVal) => {
            return doValuesContainSameData(leftVal, rightVal);
          }) === void 0) {
            return true;
          }
        }
        comparedPaths.push(path);
      }
    }, { leavesOnly: false, pathFormat: "array", includeRoot: false });
  };
  return !isSomeKeyDifferent(v1, v2) && !isSomeKeyDifferent(v2, v1);
};

// src/shell.ts
init_cjs_shims();
var import_child_process = require("child_process");
var import_crypto = require("crypto");
var import_promises = require("fs/promises");
var import_stream = require("stream");
var displayShellCommand = (execPath, args, {
  itemsToRedact
} = {}) => {
  return redact(`${execPath} ${args.join(" ")}`, itemsToRedact != null ? itemsToRedact : []);
};
var tryReadFile = async (...args) => {
  try {
    return (await (0, import_promises.readFile)(...args)).toString().trim();
  } catch (error) {
    if (!(error instanceof Error) || (error == null ? void 0 : error.code) !== "ENOENT") {
      throw error;
    }
  }
};
var getShellCommandRunner = (parentLogger, initialConfiguration) => {
  const logger = parentLogger.child({ commandId: (0, import_crypto.randomUUID)() });
  return async (execPath, args, configuration = {}) => {
    return new Promise((resolve, reject) => {
      var _a, _b;
      const {
        cwd,
        onChild,
        shouldTrackProgress,
        allowedErrorCodes,
        testAllowedErrorMessage,
        shouldCaptureAllStreams,
        stdinInput
      } = __spreadValues(__spreadValues({}, initialConfiguration), configuration);
      const itemsToRedact = [
        ...(_a = initialConfiguration.itemsToRedact) != null ? _a : [],
        ...(_b = configuration.itemsToRedact) != null ? _b : []
      ];
      const commandDisplayed = displayShellCommand(execPath, args, {
        itemsToRedact
      });
      logger.info(`Executing command ${commandDisplayed}`);
      const child = (0, import_child_process.spawn)(execPath, args, { cwd, stdio: "pipe" });
      if (onChild) {
        onChild(child);
      }
      if (stdinInput) {
        const stdinStream = new import_stream.Readable();
        stdinStream.push(stdinInput);
        stdinStream.push(null);
        stdinStream.pipe(child.stdin);
      }
      const commandOutputBuffer = [];
      const getStreamHandler = (channel) => {
        return (data) => {
          const str = itemsToRedact === void 0 ? data.toString() : redact(data.toString(), itemsToRedact);
          const strTrim = str.trim();
          if (shouldTrackProgress && strTrim) {
            logger.info(strTrim, channel);
          }
          commandOutputBuffer.push([channel, str]);
        };
      };
      child.stdout.on("data", getStreamHandler("stdout"));
      child.stderr.on("data", getStreamHandler("stderr"));
      child.on("close", (exitCode, signal) => {
        logger.info(`Process finished with exit code ${exitCode != null ? exitCode : "??"}${signal ? `and signal ${signal}` : ""}`);
        if (signal) {
          return resolve(new Error(`Process got terminated by signal ${signal}`));
        }
        if (exitCode) {
          const rawStderr = commandOutputBuffer.reduce((acc, [stream, value]) => {
            if (stream === "stderr") {
              return `${acc}${value}`;
            } else {
              return acc;
            }
          }, "").trim();
          const stderr = itemsToRedact === void 0 ? rawStderr : redact(rawStderr, itemsToRedact);
          if (!(allowedErrorCodes == null ? void 0 : allowedErrorCodes.includes(exitCode)) && (testAllowedErrorMessage === void 0 || !testAllowedErrorMessage(stderr))) {
            return reject(new Error(stderr));
          }
        }
        const outputBuf = shouldCaptureAllStreams ? commandOutputBuffer.reduce((acc, [_, value]) => {
          return `${acc}${value}`;
        }, "") : commandOutputBuffer.reduce((acc, [stream, value]) => {
          if (stream === "stdout") {
            return `${acc}${value}`;
          } else {
            return acc;
          }
        }, "");
        const rawOutput = outputBuf.trim();
        const output = itemsToRedact === void 0 ? rawOutput : redact(rawOutput, itemsToRedact);
        resolve(output);
      });
    });
  };
};

// src/utils.ts
init_cjs_shims();
var import_crypto2 = require("crypto");
var usedIds = /* @__PURE__ */ new Set();
var getFreeId = () => {
  const freeId = (() => {
    while (true) {
      const id = (0, import_crypto2.randomUUID)().replace(/\W/g, "");
      if (!usedIds.has(id)) {
        usedIds.add(id);
        return id;
      }
    }
  })();
  return {
    id: freeId,
    release: () => {
      usedIds.delete(freeId);
    }
  };
};

// src/http.ts
init_cjs_shims();
var import_node_fetch = __toESM(require("node-fetch"));
var validatedFetch = async (response, schema, { decoding } = { decoding: "json" }) => {
  const body = await (async () => {
    switch (decoding) {
      case "json": {
        return (await response).json();
      }
      default: {
        const exhaustivenessCheck = decoding;
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
      }
    }
  })();
  const validation = schema.validate(body);
  if (validation.error) {
    throw validation.error;
  }
  return validation.value;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Err,
  Logger,
  Ok,
  delay,
  displayError,
  displayShellCommand,
  doValuesContainSameData,
  envNumberVar,
  envVar,
  err,
  fetch,
  getFreeId,
  getOctokit,
  getShellCommandRunner,
  intoError,
  isGithubOrganizationMember,
  ld,
  normalizeValue,
  ok,
  redact,
  tryReadFile,
  validatedFetch
});
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
