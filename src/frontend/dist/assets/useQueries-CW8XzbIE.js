var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { p as ProtocolError, T as TimeoutWaitingForResponseErrorCode, q as utf8ToBytes, E as ExternalError, s as MissingRootKeyErrorCode, C as Certificate, t as lookupResultToBuffer, v as RequestStatusResponseStatus, U as UnknownError, w as RequestStatusDoneNoReplyErrorCode, x as RejectError, y as CertifiedRejectErrorCode, z as UNREACHABLE_ERROR, I as InputError, A as InvalidReadStateRequestErrorCode, B as ReadRequestType, D as Principal, F as IDL, G as MissingCanisterIdErrorCode, H as HttpAgent, J as encode, Q as QueryResponseStatus, K as UncertifiedRejectErrorCode, N as isV3ResponseBody, S as isV2ResponseBody, V as UncertifiedRejectUpdateErrorCode, W as UnexpectedErrorCode, Y as decode, Z as Subscribable, _ as pendingThenable, $ as resolveEnabled, a0 as shallowEqualObjects, a1 as resolveStaleTime, a2 as noop, a3 as environmentManager, a4 as isValidTimeout, a5 as timeUntilStale, a6 as timeoutManager, a7 as focusManager, a8 as fetchState, a9 as replaceData, aa as notifyManager, ab as hashKey, ac as getDefaultState, r as reactExports, ad as shouldThrowError, ae as useQueryClient, af as useInternetIdentity, ag as createActorWithConfig, ah as Record, ai as Vec, aj as Variant, ak as Service, al as Func, am as Opt, an as Nat, ao as Text, ap as Null, aq as Int, ar as Bool } from "./index-Dc4Qvpv5.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const CaseId = Nat;
const TheoryId = Text;
const JournalEntryInput = Record({
  "title": Text,
  "caseRefs": Vec(CaseId),
  "body": Text,
  "tags": Vec(Text),
  "theoryRefs": Vec(TheoryId)
});
const JournalEntryId = Nat;
const Timestamp = Int;
const JournalEntry = Record({
  "id": JournalEntryId,
  "title": Text,
  "caseRefs": Vec(CaseId),
  "body": Text,
  "createdAt": Timestamp,
  "tags": Vec(Text),
  "updatedAt": Timestamp,
  "theoryRefs": Vec(TheoryId)
});
const CrimeCategory = Text;
const Case = Record({
  "id": CaseId,
  "alias": Text,
  "name": Text,
  "year": Nat,
  "theories": Vec(TheoryId),
  "summary": Text,
  "notoriety": Nat,
  "category": CrimeCategory,
  "severity": Nat,
  "quotes": Vec(Text),
  "dsmProfile": Text
});
const CardId = Nat;
const CardCategory$1 = Variant({
  "ResearchMethods": Null,
  "Theorists": Null,
  "Disorders": Null,
  "Studies": Null,
  "Terms": Null,
  "Terminology": Null,
  "Cases": Null
});
const Flashcard = Record({
  "id": CardId,
  "question": Text,
  "hint": Text,
  "answer": Text,
  "category": CardCategory$1
});
const Milestone$1 = Variant({
  "Licensure": Null,
  "Bachelor": Null,
  "Associate": Null,
  "Master": Null
});
const SessionSummary = Record({
  "retentionPct": Nat,
  "totalCards": Nat,
  "nextReviewDates": Vec(Timestamp),
  "dueCount": Nat,
  "cardsReviewed": Nat
});
const Theory = Record({
  "id": TheoryId,
  "name": Text,
  "keyTheorists": Vec(Text),
  "description": Text,
  "keywords": Vec(Text)
});
const JournalPage = Record({
  "page": Nat,
  "totalCount": Nat,
  "pageSize": Nat,
  "entries": Vec(JournalEntry)
});
const TheoryMatchResult = Record({
  "explanation": Text,
  "theoryId": TheoryId,
  "matchedCaseIds": Vec(CaseId),
  "confidence": Nat,
  "theoryName": Text
});
const ReviewQuality$1 = Variant({
  "Known": Null,
  "NeedsReview": Null
});
Service({
  "createJournalEntry": Func([JournalEntryInput], [JournalEntry], []),
  "deleteJournalEntry": Func([JournalEntryId], [Bool], []),
  "getCase": Func([CaseId], [Opt(Case)], ["query"]),
  "getDueCards": Func([], [Vec(Flashcard)], []),
  "getJournalEntry": Func(
    [JournalEntryId],
    [Opt(JournalEntry)],
    ["query"]
  ),
  "getJournalMilestone": Func([], [Milestone$1], ["query"]),
  "getSessionSummary": Func([], [SessionSummary], []),
  "getTheory": Func([TheoryId], [Opt(Theory)], ["query"]),
  "listCards": Func([], [Vec(Flashcard)], ["query"]),
  "listCardsByCategory": Func(
    [CardCategory$1],
    [Vec(Flashcard)],
    ["query"]
  ),
  "listCases": Func([], [Vec(Case)], ["query"]),
  "listJournalEntries": Func([Nat, Nat], [JournalPage], ["query"]),
  "listTheories": Func([], [Vec(Theory)], ["query"]),
  "matchTheories": Func(
    [Text],
    [Vec(TheoryMatchResult)],
    ["query"]
  ),
  "reviewCard": Func([CardId, ReviewQuality$1], [], []),
  "searchCases": Func(
    [
      Opt(Text),
      Opt(Text),
      Opt(Nat),
      Opt(Nat),
      Opt(Nat)
    ],
    [Vec(Case)],
    ["query"]
  ),
  "searchJournalEntries": Func(
    [
      Opt(Timestamp),
      Opt(Timestamp),
      Opt(Text),
      Opt(Text)
    ],
    [Vec(JournalEntry)],
    ["query"]
  ),
  "updateJournalEntry": Func(
    [JournalEntryId, JournalEntryInput],
    [Opt(JournalEntry)],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const CaseId2 = IDL2.Nat;
  const TheoryId2 = IDL2.Text;
  const JournalEntryInput2 = IDL2.Record({
    "title": IDL2.Text,
    "caseRefs": IDL2.Vec(CaseId2),
    "body": IDL2.Text,
    "tags": IDL2.Vec(IDL2.Text),
    "theoryRefs": IDL2.Vec(TheoryId2)
  });
  const JournalEntryId2 = IDL2.Nat;
  const Timestamp2 = IDL2.Int;
  const JournalEntry2 = IDL2.Record({
    "id": JournalEntryId2,
    "title": IDL2.Text,
    "caseRefs": IDL2.Vec(CaseId2),
    "body": IDL2.Text,
    "createdAt": Timestamp2,
    "tags": IDL2.Vec(IDL2.Text),
    "updatedAt": Timestamp2,
    "theoryRefs": IDL2.Vec(TheoryId2)
  });
  const CrimeCategory2 = IDL2.Text;
  const Case2 = IDL2.Record({
    "id": CaseId2,
    "alias": IDL2.Text,
    "name": IDL2.Text,
    "year": IDL2.Nat,
    "theories": IDL2.Vec(TheoryId2),
    "summary": IDL2.Text,
    "notoriety": IDL2.Nat,
    "category": CrimeCategory2,
    "severity": IDL2.Nat,
    "quotes": IDL2.Vec(IDL2.Text),
    "dsmProfile": IDL2.Text
  });
  const CardId2 = IDL2.Nat;
  const CardCategory2 = IDL2.Variant({
    "ResearchMethods": IDL2.Null,
    "Theorists": IDL2.Null,
    "Disorders": IDL2.Null,
    "Studies": IDL2.Null,
    "Terms": IDL2.Null,
    "Terminology": IDL2.Null,
    "Cases": IDL2.Null
  });
  const Flashcard2 = IDL2.Record({
    "id": CardId2,
    "question": IDL2.Text,
    "hint": IDL2.Text,
    "answer": IDL2.Text,
    "category": CardCategory2
  });
  const Milestone2 = IDL2.Variant({
    "Licensure": IDL2.Null,
    "Bachelor": IDL2.Null,
    "Associate": IDL2.Null,
    "Master": IDL2.Null
  });
  const SessionSummary2 = IDL2.Record({
    "retentionPct": IDL2.Nat,
    "totalCards": IDL2.Nat,
    "nextReviewDates": IDL2.Vec(Timestamp2),
    "dueCount": IDL2.Nat,
    "cardsReviewed": IDL2.Nat
  });
  const Theory2 = IDL2.Record({
    "id": TheoryId2,
    "name": IDL2.Text,
    "keyTheorists": IDL2.Vec(IDL2.Text),
    "description": IDL2.Text,
    "keywords": IDL2.Vec(IDL2.Text)
  });
  const JournalPage2 = IDL2.Record({
    "page": IDL2.Nat,
    "totalCount": IDL2.Nat,
    "pageSize": IDL2.Nat,
    "entries": IDL2.Vec(JournalEntry2)
  });
  const TheoryMatchResult2 = IDL2.Record({
    "explanation": IDL2.Text,
    "theoryId": TheoryId2,
    "matchedCaseIds": IDL2.Vec(CaseId2),
    "confidence": IDL2.Nat,
    "theoryName": IDL2.Text
  });
  const ReviewQuality2 = IDL2.Variant({
    "Known": IDL2.Null,
    "NeedsReview": IDL2.Null
  });
  return IDL2.Service({
    "createJournalEntry": IDL2.Func([JournalEntryInput2], [JournalEntry2], []),
    "deleteJournalEntry": IDL2.Func([JournalEntryId2], [IDL2.Bool], []),
    "getCase": IDL2.Func([CaseId2], [IDL2.Opt(Case2)], ["query"]),
    "getDueCards": IDL2.Func([], [IDL2.Vec(Flashcard2)], []),
    "getJournalEntry": IDL2.Func(
      [JournalEntryId2],
      [IDL2.Opt(JournalEntry2)],
      ["query"]
    ),
    "getJournalMilestone": IDL2.Func([], [Milestone2], ["query"]),
    "getSessionSummary": IDL2.Func([], [SessionSummary2], []),
    "getTheory": IDL2.Func([TheoryId2], [IDL2.Opt(Theory2)], ["query"]),
    "listCards": IDL2.Func([], [IDL2.Vec(Flashcard2)], ["query"]),
    "listCardsByCategory": IDL2.Func(
      [CardCategory2],
      [IDL2.Vec(Flashcard2)],
      ["query"]
    ),
    "listCases": IDL2.Func([], [IDL2.Vec(Case2)], ["query"]),
    "listJournalEntries": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [JournalPage2],
      ["query"]
    ),
    "listTheories": IDL2.Func([], [IDL2.Vec(Theory2)], ["query"]),
    "matchTheories": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(TheoryMatchResult2)],
      ["query"]
    ),
    "reviewCard": IDL2.Func([CardId2, ReviewQuality2], [], []),
    "searchCases": IDL2.Func(
      [
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Nat),
        IDL2.Opt(IDL2.Nat),
        IDL2.Opt(IDL2.Nat)
      ],
      [IDL2.Vec(Case2)],
      ["query"]
    ),
    "searchJournalEntries": IDL2.Func(
      [
        IDL2.Opt(Timestamp2),
        IDL2.Opt(Timestamp2),
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text)
      ],
      [IDL2.Vec(JournalEntry2)],
      ["query"]
    ),
    "updateJournalEntry": IDL2.Func(
      [JournalEntryId2, JournalEntryInput2],
      [IDL2.Opt(JournalEntry2)],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
var CardCategory = /* @__PURE__ */ ((CardCategory2) => {
  CardCategory2["ResearchMethods"] = "ResearchMethods";
  CardCategory2["Theorists"] = "Theorists";
  CardCategory2["Disorders"] = "Disorders";
  CardCategory2["Studies"] = "Studies";
  CardCategory2["Terms"] = "Terms";
  CardCategory2["Terminology"] = "Terminology";
  CardCategory2["Cases"] = "Cases";
  return CardCategory2;
})(CardCategory || {});
var Milestone = /* @__PURE__ */ ((Milestone2) => {
  Milestone2["Licensure"] = "Licensure";
  Milestone2["Bachelor"] = "Bachelor";
  Milestone2["Associate"] = "Associate";
  Milestone2["Master"] = "Master";
  return Milestone2;
})(Milestone || {});
var ReviewQuality = /* @__PURE__ */ ((ReviewQuality2) => {
  ReviewQuality2["Known"] = "Known";
  ReviewQuality2["NeedsReview"] = "NeedsReview";
  return ReviewQuality2;
})(ReviewQuality || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async createJournalEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createJournalEntry(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createJournalEntry(arg0);
      return result;
    }
  }
  async deleteJournalEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteJournalEntry(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteJournalEntry(arg0);
      return result;
    }
  }
  async getCase(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCase(arg0);
        return from_candid_opt_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCase(arg0);
      return from_candid_opt_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async getDueCards() {
    if (this.processError) {
      try {
        const result = await this.actor.getDueCards();
        return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDueCards();
      return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async getJournalEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getJournalEntry(arg0);
        return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getJournalEntry(arg0);
      return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async getJournalMilestone() {
    if (this.processError) {
      try {
        const result = await this.actor.getJournalMilestone();
        return from_candid_Milestone_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getJournalMilestone();
      return from_candid_Milestone_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSessionSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getSessionSummary();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSessionSummary();
      return result;
    }
  }
  async getTheory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getTheory(arg0);
        return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTheory(arg0);
      return from_candid_opt_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async listCards() {
    if (this.processError) {
      try {
        const result = await this.actor.listCards();
        return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCards();
      return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async listCardsByCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listCardsByCategory(to_candid_CardCategory_n11(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCardsByCategory(to_candid_CardCategory_n11(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async listCases() {
    if (this.processError) {
      try {
        const result = await this.actor.listCases();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCases();
      return result;
    }
  }
  async listJournalEntries(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.listJournalEntries(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listJournalEntries(arg0, arg1);
      return result;
    }
  }
  async listTheories() {
    if (this.processError) {
      try {
        const result = await this.actor.listTheories();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listTheories();
      return result;
    }
  }
  async matchTheories(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.matchTheories(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.matchTheories(arg0);
      return result;
    }
  }
  async reviewCard(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.reviewCard(arg0, to_candid_ReviewQuality_n13(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.reviewCard(arg0, to_candid_ReviewQuality_n13(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async searchCases(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.searchCases(to_candid_opt_n15(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n16(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n16(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n16(this._uploadFile, this._downloadFile, arg4));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchCases(to_candid_opt_n15(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n16(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n16(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n16(this._uploadFile, this._downloadFile, arg4));
      return result;
    }
  }
  async searchJournalEntries(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.searchJournalEntries(to_candid_opt_n17(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n17(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg3));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchJournalEntries(to_candid_opt_n17(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n17(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg3));
      return result;
    }
  }
  async updateJournalEntry(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateJournalEntry(arg0, arg1);
        return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateJournalEntry(arg0, arg1);
      return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_CardCategory_n5(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n6(_uploadFile, _downloadFile, value);
}
function from_candid_Flashcard_n3(_uploadFile, _downloadFile, value) {
  return from_candid_record_n4(_uploadFile, _downloadFile, value);
}
function from_candid_Milestone_n8(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n10(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n4(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    question: value.question,
    hint: value.hint,
    answer: value.answer,
    category: from_candid_CardCategory_n5(_uploadFile, _downloadFile, value.category)
  };
}
function from_candid_variant_n6(_uploadFile, _downloadFile, value) {
  return "ResearchMethods" in value ? "ResearchMethods" : "Theorists" in value ? "Theorists" : "Disorders" in value ? "Disorders" : "Studies" in value ? "Studies" : "Terms" in value ? "Terms" : "Terminology" in value ? "Terminology" : "Cases" in value ? "Cases" : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "Licensure" in value ? "Licensure" : "Bachelor" in value ? "Bachelor" : "Associate" in value ? "Associate" : "Master" in value ? "Master" : value;
}
function from_candid_vec_n2(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Flashcard_n3(_uploadFile, _downloadFile, x));
}
function to_candid_CardCategory_n11(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function to_candid_ReviewQuality_n13(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n15(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n16(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n17(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return value == "ResearchMethods" ? {
    ResearchMethods: null
  } : value == "Theorists" ? {
    Theorists: null
  } : value == "Disorders" ? {
    Disorders: null
  } : value == "Studies" ? {
    Studies: null
  } : value == "Terms" ? {
    Terms: null
  } : value == "Terminology" ? {
    Terminology: null
  } : value == "Cases" ? {
    Cases: null
  } : value;
}
function to_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return value == "Known" ? {
    Known: null
  } : value == "NeedsReview" ? {
    NeedsReview: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useBackend() {
  return useActor(createActor);
}
function useListCases() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCases();
    },
    enabled: !!actor && !isFetching
  });
}
function useGetCase(id) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["case", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCase(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}
function useSearchCases(name, category, yearFrom, yearTo, minSeverity) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: [
      "cases",
      "search",
      name,
      category,
      yearFrom == null ? void 0 : yearFrom.toString(),
      yearTo == null ? void 0 : yearTo.toString(),
      minSeverity == null ? void 0 : minSeverity.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCases(name, category, yearFrom, yearTo, minSeverity);
    },
    enabled: !!actor && !isFetching
  });
}
function useListTheories() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["theories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTheories();
    },
    enabled: !!actor && !isFetching
  });
}
function useMatchTheories() {
  const { actor } = useBackend();
  return useMutation({
    mutationFn: async (scenario) => {
      if (!actor) return [];
      return actor.matchTheories(scenario);
    }
  });
}
function useListCards() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCards();
    },
    enabled: !!actor && !isFetching
  });
}
function useListCardsByCategory(category) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cards", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.listCardsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category
  });
}
function useGetDueCards() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cards", "due"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDueCards();
    },
    enabled: !!actor && !isFetching
  });
}
function useReviewCard() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cardId,
      quality
    }) => {
      if (!actor) return;
      return actor.reviewCard(cardId, quality);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", "due"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    }
  });
}
function useGetSessionSummary() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSessionSummary();
    },
    enabled: !!actor && !isFetching
  });
}
function useListJournalEntries(page = 0n, pageSize = 20n) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["journal", "list", page.toString(), pageSize.toString()],
    queryFn: async () => {
      if (!actor)
        return { page: 0n, totalCount: 0n, pageSize: 20n, entries: [] };
      return actor.listJournalEntries(page, pageSize);
    },
    enabled: !!actor && !isFetching
  });
}
function useGetJournalEntry(id) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["journal", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getJournalEntry(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}
function useSearchJournalEntries(fromDate, toDate, tag, keyword) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: [
      "journal",
      "search",
      fromDate == null ? void 0 : fromDate.toString(),
      toDate == null ? void 0 : toDate.toString(),
      tag,
      keyword
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchJournalEntries(fromDate, toDate, tag, keyword);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateJournalEntry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createJournalEntry(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["milestone"] });
    }
  });
}
function useUpdateJournalEntry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateJournalEntry(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    }
  });
}
function useDeleteJournalEntry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteJournalEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["milestone"] });
    }
  });
}
function useGetJournalMilestone() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["milestone"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getJournalMilestone();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  CardCategory as C,
  Milestone as M,
  ReviewQuality as R,
  useSearchCases as a,
  useGetCase as b,
  useListTheories as c,
  useMatchTheories as d,
  useGetDueCards as e,
  useListCards as f,
  useListCardsByCategory as g,
  useReviewCard as h,
  useGetSessionSummary as i,
  useListJournalEntries as j,
  useSearchJournalEntries as k,
  useGetJournalMilestone as l,
  useGetJournalEntry as m,
  useCreateJournalEntry as n,
  useUpdateJournalEntry as o,
  useDeleteJournalEntry as p,
  useListCases as u
};
