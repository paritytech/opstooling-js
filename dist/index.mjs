import {
  Logger,
  LoggingLevel,
  __commonJS,
  __toESM,
  displayError,
  intoError,
  normalizeValue
} from "./chunk-AG6SRFXG.mjs";

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module) {
    module.exports = wrappy;
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
  "node_modules/once/once.js"(exports, module) {
    var wrappy = require_wrappy();
    module.exports = wrappy(once2);
    module.exports.strict = wrappy(onceStrict);
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

// src/comparison.ts
import deepdash from "deepdash";
import lodash from "lodash";
var ld = deepdash(lodash);
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
    return ld.someDeep(
      source,
      (sourceValue, _, __, ctx) => {
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
            if (targetValue.find((rightVal) => doValuesContainSameData(leftVal, rightVal)) === void 0) {
              return true;
            }
          }
          comparedPaths.push(path);
        }
      },
      { leavesOnly: false, pathFormat: "array", includeRoot: false }
    );
  };
  return !isSomeKeyDifferent(v1, v2) && !isSomeKeyDifferent(v2, v1);
};

// src/env.ts
import assert from "assert";
var envVar = (name) => {
  const val = process.env[name];
  if (typeof val !== "string") {
    throw new Error(`${name} was not found in the environment variables`);
  }
  return val;
};
var envNumberVar = (name) => {
  const val = process.env[name];
  assert(val, `${name} was not found in the environment variables`);
  const valNumber = parseInt(val);
  assert(valNumber, `${name} is not a number`);
  return valNumber;
};

// src/format.ts
var redact = (str, items) => {
  for (const item of items) {
    str = str.replaceAll(item, "{REDACTED}");
  }
  return str;
};

// node_modules/is-plain-object/dist/is-plain-object.mjs
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

// node_modules/deprecation/dist-web/index.js
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
import { Octokit } from "@octokit/rest";
import { Mutex } from "async-mutex";

// src/github/api.ts
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

// src/time.ts
var delay = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});
async function until(cb, interval, maxRetries = Infinity, timeoutMessage) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    const res = await cb();
    if (res) {
      return;
    }
    await delay(interval);
    retryCount++;
  }
  throw new Error(timeoutMessage ?? "Maximun retry count reached");
}

// src/types.ts
var Ok = class {
  constructor(value) {
    this.value = value;
  }
};
var ok = (value) => new Ok(value);
var Err = class {
  constructor(value) {
    this.value = value;
  }
};
var err = (value) => new Err(value);

// src/github/octokit.ts
var wasOctokitExtendedByApplication = Symbol();
var defaultRequestMutex = new Mutex();
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
  octokit ?? (octokit = new Octokit({ ...endpoint.DEFAULTS, ...apiEndpoint ? { baseUrl: apiEndpoint } : {} }));
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
    getCommits: octokit.request.defaults({ method: "GET", url: githubApiEndpoints.commitsByRepositoryId }),
    getOpenPullRequests: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestsByRepositoryId
    }),
    getById: octokit.request.defaults({ method: "GET", url: githubApiEndpoints.repositoryById })
  });
  Object.assign(octokit.pulls, {
    createCommentByRepositoryId: octokit.request.defaults({
      method: "POST",
      url: githubApiEndpoints.pullRequestCommentsByRepositoryId
    }),
    getByRepositoryId: octokit.request.defaults({ method: "GET", url: githubApiEndpoints.pullRequestByRepositoryId })
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
  const requestMutex = inputRequestMutex ?? defaultRequestMutex;
  octokit.hook.wrap("request", async (request, options) => {
    logger.info({ request, options }, "Preparing to send a request to the GitHub API");
    let triesCount = 0;
    const result = await requestMutex.runExclusive(async () => {
      try {
        await requestDelay;
        if (getAuthHeaders) {
          const authHeaders = await getAuthHeaders();
          options.headers = { ...options.headers, ...authHeaders };
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
              const { headers } = response;
              if (parseInt(headers[rateLimitRemainingHeader] ?? "") === 0) {
                logger.warn(
                  `GitHub API limits were hit! The "${rateLimitResetHeader}" response header will be read to figure out until when we're supposed to wait...`
                );
                const rateLimitResetHeaderValue = headers[rateLimitResetHeader];
                const resetEpoch = parseInt(rateLimitResetHeaderValue ?? "") * 1e3;
                if (Number.isNaN(resetEpoch)) {
                  logger.error(
                    { rateLimitResetHeaderValue, rateLimitResetHeader, headers },
                    `GitHub response header "${rateLimitResetHeader}" could not be parsed as epoch`
                  );
                } else {
                  const currentEpoch = Date.now();
                  const duration = resetEpoch - currentEpoch;
                  if (duration < 0) {
                    logger.error(
                      { rateLimitResetHeaderValue, resetEpoch, currentEpoch, headers },
                      `Parsed epoch value for GitHub response header "${rateLimitResetHeader}" is smaller than the current date`
                    );
                  } else {
                    return duration;
                  }
                }
              } else if (headers[retryAfterHeader] !== void 0) {
                const retryAfterHeaderValue = headers[retryAfterHeader];
                const duration = parseInt(String(retryAfterHeaderValue)) * 1e3;
                if (Number.isNaN(duration)) {
                  logger.error(
                    { retryAfterHeader, retryAfterHeaderValue, headers },
                    `GitHub response header "${retryAfterHeader}" could not be parsed as seconds`
                  );
                } else {
                  return duration;
                }
              } else if (!isApiRateLimitResponse) {
                logger.info(
                  { headers, fallbackWaitDuration, message },
                  "Falling back to default wait duration since other heuristics were not fulfilled"
                );
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
      return (await octokit.orgs.userMembershipByOrganizationId({ organization_id: organization.id, username: user.login })).status;
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
      logger.fatal(
        `Github organization membership API responded with status code ${membershipStatus} which means the bot is not considered an organization member. This should never happen because the bot should already be installed in that organization. It's possible that the bot's credentials were not properly used for this request.`
      );
      return false;
    }
    default: {
      logger.fatal(`GitHub organization membership API responded with unexpected status code ${membershipStatus}`);
      return false;
    }
  }
};

// src/http.ts
import fetch from "node-fetch";

// src/validation.ts
import Joi from "joi";
function validate(item, schema, options = {}) {
  const joiOpts = { allowUnknown: true, abortEarly: false, convert: true };
  if (options.message) {
    return Joi.attempt(item, schema, `${options.message}:`, joiOpts);
  }
  return Joi.attempt(item, schema, joiOpts);
}

// src/http.ts
var validatedFetch = async (response, schema, { decoding } = { decoding: "json" }) => {
  const body = await (async () => {
    const result = await response;
    if (result.status >= 400) {
      throw new Error(`Unexpected code: ${result.status}. Url: ${result.url}. Body: ${await result.text()}`);
    }
    switch (decoding) {
      case "json": {
        return await result.json();
      }
      default: {
        const exhaustivenessCheck = decoding;
        throw new Error(`Not exhaustive: ${exhaustivenessCheck}`);
      }
    }
  })();
  return validate(body, schema);
};

// src/shell.ts
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { Readable as ReadableStream } from "stream";
var displayShellCommand = (execPath, args, {
  itemsToRedact
} = {}) => redact(`${execPath} ${args.join(" ")}`, itemsToRedact ?? []);
var getShellCommandRunner = (parentLogger, initialConfiguration) => {
  const logger = parentLogger.child({ commandId: randomUUID() });
  return async (execPath, args, configuration = {}) => await new Promise((resolve, reject) => {
    const {
      cwd,
      onChild,
      shouldTrackProgress,
      allowedErrorCodes,
      testAllowedErrorMessage,
      shouldCaptureAllStreams,
      stdinInput
    } = { ...initialConfiguration, ...configuration };
    const itemsToRedact = [...initialConfiguration.itemsToRedact ?? [], ...configuration.itemsToRedact ?? []];
    const commandDisplayed = displayShellCommand(execPath, args, { itemsToRedact });
    logger.info(`Executing command ${commandDisplayed}`);
    const child = spawn(execPath, args, { cwd, stdio: "pipe" });
    if (onChild) {
      onChild(child);
    }
    if (stdinInput) {
      const stdinStream = new ReadableStream();
      stdinStream.push(stdinInput);
      stdinStream.push(null);
      stdinStream.pipe(child.stdin);
    }
    const commandOutputBuffer = [];
    const getStreamHandler = (channel) => (data) => {
      const str = itemsToRedact === void 0 ? data.toString() : redact(data.toString(), itemsToRedact);
      const strTrim = str.trim();
      if (shouldTrackProgress && strTrim) {
        logger.info(strTrim, channel);
      }
      commandOutputBuffer.push([channel, str]);
    };
    child.stdout.on("data", getStreamHandler("stdout"));
    child.stderr.on("data", getStreamHandler("stderr"));
    child.on("close", (exitCode, signal) => {
      logger.info(`Process finished with exit code ${exitCode ?? "??"}${signal ? `and signal ${signal}` : ""}`);
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
      const outputBuf = shouldCaptureAllStreams ? commandOutputBuffer.reduce((acc, [_, value]) => `${acc}${value}`, "") : commandOutputBuffer.reduce((acc, [stream, value]) => {
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

// src/utils.ts
import { randomUUID as randomUUID2 } from "crypto";
var usedIds = /* @__PURE__ */ new Set();
var getFreeId = () => {
  const freeId = (() => {
    while (true) {
      const id = randomUUID2().replace(/\W/g, "");
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
function ensureDefined(input, message) {
  if (input === void 0 || input === null) {
    throw new Error(message ?? `Expected input to be defined, got ${String(input)}`);
  }
  return input;
}
export {
  Err,
  Logger,
  LoggingLevel,
  Ok,
  delay,
  displayError,
  displayShellCommand,
  doValuesContainSameData,
  ensureDefined,
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
  until,
  validate,
  validatedFetch
};
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
