/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "64d8823b63eebe1f6451"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://127.0.0.1:3000/js/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(132)(__webpack_require__.s = 132);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = lib;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(96);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(0);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(13);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(3);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(4);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(5);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(853);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(731);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionActions = undefined;

var _sessionActions = __webpack_require__(63);

var sessionActions = _interopRequireWildcard(_sessionActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.sessionActions = sessionActions; /**
                                          * Created by Jad_PC on 2018/2/6.
                                          */

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(22, function() {
			var newContent = __webpack_require__(22);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(32);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(61);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(327);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);

__webpack_require__(100);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(30);

var _reactRouterRedux = __webpack_require__(9);

var _sessionReducers = __webpack_require__(67);

var _sessionReducers2 = _interopRequireDefault(_sessionReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
  routing: _reactRouterRedux.routerReducer,
  getSession: _sessionReducers2.default
}); /**
     * Created by Jad_PC on 2018/1/25.
     */
exports.default = rootReducer;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(35);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Helvetica Neue For Number\";\n  src: local(\"Helvetica Neue\");\n  unicode-range: U+30-39;\n}\n.ant-btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: 500;\n  text-align: center;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  line-height: 1.5;\n  padding: 0 15px;\n  font-size: 12px;\n  border-radius: 4px;\n  height: 28px;\n  user-select: none;\n  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n  position: relative;\n  color: rgba(0, 0, 0, 0.65);\n  background-color: #fff;\n  border-color: #d9d9d9;\n}\n.ant-btn > .anticon {\n  line-height: 1;\n}\n.ant-btn,\n.ant-btn:active,\n.ant-btn:focus {\n  outline: 0;\n}\n.ant-btn:not([disabled]):hover {\n  text-decoration: none;\n}\n.ant-btn:not([disabled]):active {\n  outline: 0;\n  transition: none;\n}\n.ant-btn.disabled,\n.ant-btn[disabled] {\n  cursor: not-allowed;\n}\n.ant-btn.disabled > *,\n.ant-btn[disabled] > * {\n  pointer-events: none;\n}\n.ant-btn-lg {\n  padding: 0 15px;\n  font-size: 14px;\n  border-radius: 4px;\n  height: 32px;\n}\n.ant-btn-sm {\n  padding: 0 7px;\n  font-size: 12px;\n  border-radius: 4px;\n  height: 22px;\n}\n.ant-btn > a:only-child {\n  color: currentColor;\n}\n.ant-btn > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn:hover,\n.ant-btn:focus {\n  color: #108ee9;\n  background-color: #fff;\n  border-color: #108ee9;\n}\n.ant-btn:hover > a:only-child,\n.ant-btn:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn:hover > a:only-child:after,\n.ant-btn:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn:active,\n.ant-btn.active {\n  color: #0e77ca;\n  background-color: #fff;\n  border-color: #0e77ca;\n}\n.ant-btn:active > a:only-child,\n.ant-btn.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn:active > a:only-child:after,\n.ant-btn.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn.disabled,\n.ant-btn[disabled],\n.ant-btn.disabled:hover,\n.ant-btn[disabled]:hover,\n.ant-btn.disabled:focus,\n.ant-btn[disabled]:focus,\n.ant-btn.disabled:active,\n.ant-btn[disabled]:active,\n.ant-btn.disabled.active,\n.ant-btn[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn.disabled > a:only-child,\n.ant-btn[disabled] > a:only-child,\n.ant-btn.disabled:hover > a:only-child,\n.ant-btn[disabled]:hover > a:only-child,\n.ant-btn.disabled:focus > a:only-child,\n.ant-btn[disabled]:focus > a:only-child,\n.ant-btn.disabled:active > a:only-child,\n.ant-btn[disabled]:active > a:only-child,\n.ant-btn.disabled.active > a:only-child,\n.ant-btn[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn.disabled > a:only-child:after,\n.ant-btn[disabled] > a:only-child:after,\n.ant-btn.disabled:hover > a:only-child:after,\n.ant-btn[disabled]:hover > a:only-child:after,\n.ant-btn.disabled:focus > a:only-child:after,\n.ant-btn[disabled]:focus > a:only-child:after,\n.ant-btn.disabled:active > a:only-child:after,\n.ant-btn[disabled]:active > a:only-child:after,\n.ant-btn.disabled.active > a:only-child:after,\n.ant-btn[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn:hover,\n.ant-btn:focus,\n.ant-btn:active,\n.ant-btn.active {\n  background: #fff;\n}\n.ant-btn-primary {\n  color: #fff;\n  background-color: #108ee9;\n  border-color: #108ee9;\n}\n.ant-btn-primary > a:only-child {\n  color: currentColor;\n}\n.ant-btn-primary > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-primary:hover,\n.ant-btn-primary:focus {\n  color: #fff;\n  background-color: #49a9ee;\n  border-color: #49a9ee;\n}\n.ant-btn-primary:hover > a:only-child,\n.ant-btn-primary:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn-primary:hover > a:only-child:after,\n.ant-btn-primary:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-primary:active,\n.ant-btn-primary.active {\n  color: #fff;\n  background-color: #0e77ca;\n  border-color: #0e77ca;\n}\n.ant-btn-primary:active > a:only-child,\n.ant-btn-primary.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-primary:active > a:only-child:after,\n.ant-btn-primary.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-primary.disabled,\n.ant-btn-primary[disabled],\n.ant-btn-primary.disabled:hover,\n.ant-btn-primary[disabled]:hover,\n.ant-btn-primary.disabled:focus,\n.ant-btn-primary[disabled]:focus,\n.ant-btn-primary.disabled:active,\n.ant-btn-primary[disabled]:active,\n.ant-btn-primary.disabled.active,\n.ant-btn-primary[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-primary.disabled > a:only-child,\n.ant-btn-primary[disabled] > a:only-child,\n.ant-btn-primary.disabled:hover > a:only-child,\n.ant-btn-primary[disabled]:hover > a:only-child,\n.ant-btn-primary.disabled:focus > a:only-child,\n.ant-btn-primary[disabled]:focus > a:only-child,\n.ant-btn-primary.disabled:active > a:only-child,\n.ant-btn-primary[disabled]:active > a:only-child,\n.ant-btn-primary.disabled.active > a:only-child,\n.ant-btn-primary[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-primary.disabled > a:only-child:after,\n.ant-btn-primary[disabled] > a:only-child:after,\n.ant-btn-primary.disabled:hover > a:only-child:after,\n.ant-btn-primary[disabled]:hover > a:only-child:after,\n.ant-btn-primary.disabled:focus > a:only-child:after,\n.ant-btn-primary[disabled]:focus > a:only-child:after,\n.ant-btn-primary.disabled:active > a:only-child:after,\n.ant-btn-primary[disabled]:active > a:only-child:after,\n.ant-btn-primary.disabled.active > a:only-child:after,\n.ant-btn-primary[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-group .ant-btn-primary:not(:first-child):not(:last-child) {\n  border-right-color: #0e77ca;\n  border-left-color: #0e77ca;\n}\n.ant-btn-group .ant-btn-primary:not(:first-child):not(:last-child):disabled {\n  border-color: #d9d9d9;\n}\n.ant-btn-group .ant-btn-primary:first-child:not(:last-child) {\n  border-right-color: #0e77ca;\n}\n.ant-btn-group .ant-btn-primary:first-child:not(:last-child)[disabled] {\n  border-right-color: #d9d9d9;\n}\n.ant-btn-group .ant-btn-primary:last-child:not(:first-child),\n.ant-btn-group .ant-btn-primary + .ant-btn-primary {\n  border-left-color: #0e77ca;\n}\n.ant-btn-group .ant-btn-primary:last-child:not(:first-child)[disabled],\n.ant-btn-group .ant-btn-primary + .ant-btn-primary[disabled] {\n  border-left-color: #d9d9d9;\n}\n.ant-btn-ghost {\n  color: rgba(0, 0, 0, 0.65);\n  background-color: transparent;\n  border-color: #d9d9d9;\n}\n.ant-btn-ghost > a:only-child {\n  color: currentColor;\n}\n.ant-btn-ghost > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-ghost:hover,\n.ant-btn-ghost:focus {\n  color: #108ee9;\n  background-color: transparent;\n  border-color: #108ee9;\n}\n.ant-btn-ghost:hover > a:only-child,\n.ant-btn-ghost:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn-ghost:hover > a:only-child:after,\n.ant-btn-ghost:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-ghost:active,\n.ant-btn-ghost.active {\n  color: #0e77ca;\n  background-color: transparent;\n  border-color: #0e77ca;\n}\n.ant-btn-ghost:active > a:only-child,\n.ant-btn-ghost.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-ghost:active > a:only-child:after,\n.ant-btn-ghost.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-ghost.disabled,\n.ant-btn-ghost[disabled],\n.ant-btn-ghost.disabled:hover,\n.ant-btn-ghost[disabled]:hover,\n.ant-btn-ghost.disabled:focus,\n.ant-btn-ghost[disabled]:focus,\n.ant-btn-ghost.disabled:active,\n.ant-btn-ghost[disabled]:active,\n.ant-btn-ghost.disabled.active,\n.ant-btn-ghost[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-ghost.disabled > a:only-child,\n.ant-btn-ghost[disabled] > a:only-child,\n.ant-btn-ghost.disabled:hover > a:only-child,\n.ant-btn-ghost[disabled]:hover > a:only-child,\n.ant-btn-ghost.disabled:focus > a:only-child,\n.ant-btn-ghost[disabled]:focus > a:only-child,\n.ant-btn-ghost.disabled:active > a:only-child,\n.ant-btn-ghost[disabled]:active > a:only-child,\n.ant-btn-ghost.disabled.active > a:only-child,\n.ant-btn-ghost[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-ghost.disabled > a:only-child:after,\n.ant-btn-ghost[disabled] > a:only-child:after,\n.ant-btn-ghost.disabled:hover > a:only-child:after,\n.ant-btn-ghost[disabled]:hover > a:only-child:after,\n.ant-btn-ghost.disabled:focus > a:only-child:after,\n.ant-btn-ghost[disabled]:focus > a:only-child:after,\n.ant-btn-ghost.disabled:active > a:only-child:after,\n.ant-btn-ghost[disabled]:active > a:only-child:after,\n.ant-btn-ghost.disabled.active > a:only-child:after,\n.ant-btn-ghost[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-dashed {\n  color: rgba(0, 0, 0, 0.65);\n  background-color: #fff;\n  border-color: #d9d9d9;\n  border-style: dashed;\n}\n.ant-btn-dashed > a:only-child {\n  color: currentColor;\n}\n.ant-btn-dashed > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-dashed:hover,\n.ant-btn-dashed:focus {\n  color: #108ee9;\n  background-color: #fff;\n  border-color: #108ee9;\n}\n.ant-btn-dashed:hover > a:only-child,\n.ant-btn-dashed:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn-dashed:hover > a:only-child:after,\n.ant-btn-dashed:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-dashed:active,\n.ant-btn-dashed.active {\n  color: #0e77ca;\n  background-color: #fff;\n  border-color: #0e77ca;\n}\n.ant-btn-dashed:active > a:only-child,\n.ant-btn-dashed.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-dashed:active > a:only-child:after,\n.ant-btn-dashed.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-dashed.disabled,\n.ant-btn-dashed[disabled],\n.ant-btn-dashed.disabled:hover,\n.ant-btn-dashed[disabled]:hover,\n.ant-btn-dashed.disabled:focus,\n.ant-btn-dashed[disabled]:focus,\n.ant-btn-dashed.disabled:active,\n.ant-btn-dashed[disabled]:active,\n.ant-btn-dashed.disabled.active,\n.ant-btn-dashed[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-dashed.disabled > a:only-child,\n.ant-btn-dashed[disabled] > a:only-child,\n.ant-btn-dashed.disabled:hover > a:only-child,\n.ant-btn-dashed[disabled]:hover > a:only-child,\n.ant-btn-dashed.disabled:focus > a:only-child,\n.ant-btn-dashed[disabled]:focus > a:only-child,\n.ant-btn-dashed.disabled:active > a:only-child,\n.ant-btn-dashed[disabled]:active > a:only-child,\n.ant-btn-dashed.disabled.active > a:only-child,\n.ant-btn-dashed[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-dashed.disabled > a:only-child:after,\n.ant-btn-dashed[disabled] > a:only-child:after,\n.ant-btn-dashed.disabled:hover > a:only-child:after,\n.ant-btn-dashed[disabled]:hover > a:only-child:after,\n.ant-btn-dashed.disabled:focus > a:only-child:after,\n.ant-btn-dashed[disabled]:focus > a:only-child:after,\n.ant-btn-dashed.disabled:active > a:only-child:after,\n.ant-btn-dashed[disabled]:active > a:only-child:after,\n.ant-btn-dashed.disabled.active > a:only-child:after,\n.ant-btn-dashed[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-danger {\n  color: #f04134;\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-danger > a:only-child {\n  color: currentColor;\n}\n.ant-btn-danger > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-danger:hover,\n.ant-btn-danger:focus {\n  color: #fff;\n  background-color: #f04134;\n  border-color: #f04134;\n}\n.ant-btn-danger:hover > a:only-child,\n.ant-btn-danger:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn-danger:hover > a:only-child:after,\n.ant-btn-danger:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-danger:active,\n.ant-btn-danger.active {\n  color: #fff;\n  background-color: #d73435;\n  border-color: #d73435;\n}\n.ant-btn-danger:active > a:only-child,\n.ant-btn-danger.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-danger:active > a:only-child:after,\n.ant-btn-danger.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-danger.disabled,\n.ant-btn-danger[disabled],\n.ant-btn-danger.disabled:hover,\n.ant-btn-danger[disabled]:hover,\n.ant-btn-danger.disabled:focus,\n.ant-btn-danger[disabled]:focus,\n.ant-btn-danger.disabled:active,\n.ant-btn-danger[disabled]:active,\n.ant-btn-danger.disabled.active,\n.ant-btn-danger[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-danger.disabled > a:only-child,\n.ant-btn-danger[disabled] > a:only-child,\n.ant-btn-danger.disabled:hover > a:only-child,\n.ant-btn-danger[disabled]:hover > a:only-child,\n.ant-btn-danger.disabled:focus > a:only-child,\n.ant-btn-danger[disabled]:focus > a:only-child,\n.ant-btn-danger.disabled:active > a:only-child,\n.ant-btn-danger[disabled]:active > a:only-child,\n.ant-btn-danger.disabled.active > a:only-child,\n.ant-btn-danger[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-danger.disabled > a:only-child:after,\n.ant-btn-danger[disabled] > a:only-child:after,\n.ant-btn-danger.disabled:hover > a:only-child:after,\n.ant-btn-danger[disabled]:hover > a:only-child:after,\n.ant-btn-danger.disabled:focus > a:only-child:after,\n.ant-btn-danger[disabled]:focus > a:only-child:after,\n.ant-btn-danger.disabled:active > a:only-child:after,\n.ant-btn-danger[disabled]:active > a:only-child:after,\n.ant-btn-danger.disabled.active > a:only-child:after,\n.ant-btn-danger[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-circle,\n.ant-btn-circle-outline {\n  width: 28px;\n  padding: 0;\n  font-size: 14px;\n  border-radius: 50%;\n  height: 28px;\n}\n.ant-btn-circle.ant-btn-lg,\n.ant-btn-circle-outline.ant-btn-lg {\n  width: 32px;\n  padding: 0;\n  font-size: 16px;\n  border-radius: 50%;\n  height: 32px;\n}\n.ant-btn-circle.ant-btn-sm,\n.ant-btn-circle-outline.ant-btn-sm {\n  width: 22px;\n  padding: 0;\n  font-size: 12px;\n  border-radius: 50%;\n  height: 22px;\n}\n.ant-btn:before {\n  position: absolute;\n  top: -1px;\n  left: -1px;\n  bottom: -1px;\n  right: -1px;\n  background: #fff;\n  opacity: 0.35;\n  content: '';\n  border-radius: inherit;\n  z-index: 1;\n  transition: opacity .2s;\n  pointer-events: none;\n  display: none;\n}\n.ant-btn .anticon {\n  transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n.ant-btn.ant-btn-loading:before {\n  display: block;\n}\n.ant-btn.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) {\n  padding-left: 29px;\n  pointer-events: none;\n  position: relative;\n}\n.ant-btn.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) .anticon {\n  margin-left: -14px;\n}\n.ant-btn-sm.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) {\n  padding-left: 24px;\n}\n.ant-btn-sm.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) .anticon {\n  margin-left: -17px;\n}\n.ant-btn-group {\n  position: relative;\n  display: inline-block;\n}\n.ant-btn-group > .ant-btn {\n  position: relative;\n  z-index: 1;\n}\n.ant-btn-group > .ant-btn:hover,\n.ant-btn-group > .ant-btn:focus,\n.ant-btn-group > .ant-btn:active,\n.ant-btn-group > .ant-btn.active {\n  z-index: 2;\n}\n.ant-btn-group > .ant-btn:disabled {\n  z-index: 0;\n}\n.ant-btn-group-lg > .ant-btn {\n  padding: 0 15px;\n  font-size: 14px;\n  border-radius: 4px;\n  height: 32px;\n}\n.ant-btn-group-sm > .ant-btn {\n  padding: 0 7px;\n  font-size: 12px;\n  border-radius: 4px;\n  height: 22px;\n}\n.ant-btn-group-sm > .ant-btn > .anticon {\n  font-size: 12px;\n}\n.ant-btn-group .ant-btn + .ant-btn,\n.ant-btn + .ant-btn-group,\n.ant-btn-group + .ant-btn,\n.ant-btn-group + .ant-btn-group {\n  margin-left: -1px;\n}\n.ant-btn-group .ant-btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.ant-btn-group > .ant-btn:first-child {\n  margin-left: 0;\n}\n.ant-btn-group > .ant-btn:first-child:not(:last-child) {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n  padding-right: 8px;\n}\n.ant-btn-group > .ant-btn:last-child:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n  padding-left: 8px;\n}\n.ant-btn-group > .ant-btn-group {\n  float: left;\n}\n.ant-btn-group > .ant-btn-group:not(:first-child):not(:last-child) > .ant-btn {\n  border-radius: 0;\n}\n.ant-btn-group > .ant-btn-group:first-child:not(:last-child) > .ant-btn:last-child {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n  padding-right: 8px;\n}\n.ant-btn-group > .ant-btn-group:last-child:not(:first-child) > .ant-btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n  padding-left: 8px;\n}\n.ant-btn:not(.ant-btn-circle):not(.ant-btn-circle-outline).ant-btn-icon-only {\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.ant-btn:focus > span,\n.ant-btn:active > span {\n  position: relative;\n}\n.ant-btn > .anticon + span,\n.ant-btn > span + .anticon {\n  margin-left: 0.5em;\n}\n.ant-btn-clicked:after {\n  content: '';\n  position: absolute;\n  top: -1px;\n  left: -1px;\n  bottom: -1px;\n  right: -1px;\n  border-radius: inherit;\n  border: 0 solid #108ee9;\n  opacity: 0.4;\n  animation: buttonEffect .4s;\n  display: block;\n}\n.ant-btn-danger.ant-btn-clicked:after {\n  border-color: #f04134;\n}\n.ant-btn-background-ghost {\n  background: transparent!important;\n  border-color: #fff;\n  color: #fff;\n}\n.ant-btn-background-ghost.ant-btn-primary {\n  color: #108ee9;\n  background-color: transparent;\n  border-color: #108ee9;\n}\n.ant-btn-background-ghost.ant-btn-primary > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-primary > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-primary:hover,\n.ant-btn-background-ghost.ant-btn-primary:focus {\n  color: #49a9ee;\n  background-color: transparent;\n  border-color: #49a9ee;\n}\n.ant-btn-background-ghost.ant-btn-primary:hover > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-primary:hover > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-primary:active,\n.ant-btn-background-ghost.ant-btn-primary.active {\n  color: #0e77ca;\n  background-color: transparent;\n  border-color: #0e77ca;\n}\n.ant-btn-background-ghost.ant-btn-primary:active > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-primary:active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-primary.disabled,\n.ant-btn-background-ghost.ant-btn-primary[disabled],\n.ant-btn-background-ghost.ant-btn-primary.disabled:hover,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:hover,\n.ant-btn-background-ghost.ant-btn-primary.disabled:focus,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:focus,\n.ant-btn-background-ghost.ant-btn-primary.disabled:active,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:active,\n.ant-btn-background-ghost.ant-btn-primary.disabled.active,\n.ant-btn-background-ghost.ant-btn-primary[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-background-ghost.ant-btn-primary.disabled > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary[disabled] > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary.disabled:hover > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:hover > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary.disabled:focus > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:focus > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary.disabled:active > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:active > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary.disabled.active > a:only-child,\n.ant-btn-background-ghost.ant-btn-primary[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-primary.disabled > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary[disabled] > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary.disabled:hover > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:hover > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary.disabled:focus > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:focus > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary.disabled:active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary[disabled]:active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary.disabled.active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-primary[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-danger {\n  color: #f04134;\n  background-color: transparent;\n  border-color: #f04134;\n}\n.ant-btn-background-ghost.ant-btn-danger > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-danger > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-danger:hover,\n.ant-btn-background-ghost.ant-btn-danger:focus {\n  color: #f46e65;\n  background-color: transparent;\n  border-color: #f46e65;\n}\n.ant-btn-background-ghost.ant-btn-danger:hover > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger:focus > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-danger:hover > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-danger:active,\n.ant-btn-background-ghost.ant-btn-danger.active {\n  color: #d73435;\n  background-color: transparent;\n  border-color: #d73435;\n}\n.ant-btn-background-ghost.ant-btn-danger:active > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger.active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-danger:active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-btn-background-ghost.ant-btn-danger.disabled,\n.ant-btn-background-ghost.ant-btn-danger[disabled],\n.ant-btn-background-ghost.ant-btn-danger.disabled:hover,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:hover,\n.ant-btn-background-ghost.ant-btn-danger.disabled:focus,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:focus,\n.ant-btn-background-ghost.ant-btn-danger.disabled:active,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:active,\n.ant-btn-background-ghost.ant-btn-danger.disabled.active,\n.ant-btn-background-ghost.ant-btn-danger[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-btn-background-ghost.ant-btn-danger.disabled > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger[disabled] > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger.disabled:hover > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:hover > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger.disabled:focus > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:focus > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger.disabled:active > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:active > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger.disabled.active > a:only-child,\n.ant-btn-background-ghost.ant-btn-danger[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-btn-background-ghost.ant-btn-danger.disabled > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger[disabled] > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger.disabled:hover > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:hover > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger.disabled:focus > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:focus > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger.disabled:active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger[disabled]:active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger.disabled.active > a:only-child:after,\n.ant-btn-background-ghost.ant-btn-danger[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n@keyframes buttonEffect {\n  to {\n    opacity: 0;\n    top: -6px;\n    left: -6px;\n    bottom: -6px;\n    right: -6px;\n    border-width: 6px;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Helvetica Neue For Number\";\n  src: local(\"Helvetica Neue\");\n  unicode-range: U+30-39;\n}\n.ant-input-search-icon {\n  cursor: pointer;\n  transition: all .3s;\n  font-size: 14px;\n}\n.ant-input-search-icon:hover {\n  color: #108ee9;\n}\n.ant-search-input-wrapper {\n  display: inline-block;\n  vertical-align: middle;\n}\n.ant-search-input.ant-input-group .ant-input:first-child,\n.ant-search-input.ant-input-group .ant-select:first-child {\n  border-radius: 4px;\n  position: absolute;\n  top: -1px;\n  width: 100%;\n}\n.ant-search-input.ant-input-group .ant-input:first-child {\n  padding-right: 36px;\n}\n.ant-search-input .ant-search-btn {\n  color: rgba(0, 0, 0, 0.65);\n  background-color: #fff;\n  border-color: #d9d9d9;\n  border-radius: 0 3px 3px 0;\n  left: -1px;\n  position: relative;\n  border-width: 0 0 0 1px;\n  z-index: 2;\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.ant-search-input .ant-search-btn > a:only-child {\n  color: currentColor;\n}\n.ant-search-input .ant-search-btn > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input .ant-search-btn:hover,\n.ant-search-input .ant-search-btn:focus {\n  color: #108ee9;\n  background-color: #fff;\n  border-color: #108ee9;\n}\n.ant-search-input .ant-search-btn:hover > a:only-child,\n.ant-search-input .ant-search-btn:focus > a:only-child {\n  color: currentColor;\n}\n.ant-search-input .ant-search-btn:hover > a:only-child:after,\n.ant-search-input .ant-search-btn:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input .ant-search-btn:active,\n.ant-search-input .ant-search-btn.active {\n  color: #0e77ca;\n  background-color: #fff;\n  border-color: #0e77ca;\n}\n.ant-search-input .ant-search-btn:active > a:only-child,\n.ant-search-input .ant-search-btn.active > a:only-child {\n  color: currentColor;\n}\n.ant-search-input .ant-search-btn:active > a:only-child:after,\n.ant-search-input .ant-search-btn.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input .ant-search-btn.disabled,\n.ant-search-input .ant-search-btn[disabled],\n.ant-search-input .ant-search-btn.disabled:hover,\n.ant-search-input .ant-search-btn[disabled]:hover,\n.ant-search-input .ant-search-btn.disabled:focus,\n.ant-search-input .ant-search-btn[disabled]:focus,\n.ant-search-input .ant-search-btn.disabled:active,\n.ant-search-input .ant-search-btn[disabled]:active,\n.ant-search-input .ant-search-btn.disabled.active,\n.ant-search-input .ant-search-btn[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-search-input .ant-search-btn.disabled > a:only-child,\n.ant-search-input .ant-search-btn[disabled] > a:only-child,\n.ant-search-input .ant-search-btn.disabled:hover > a:only-child,\n.ant-search-input .ant-search-btn[disabled]:hover > a:only-child,\n.ant-search-input .ant-search-btn.disabled:focus > a:only-child,\n.ant-search-input .ant-search-btn[disabled]:focus > a:only-child,\n.ant-search-input .ant-search-btn.disabled:active > a:only-child,\n.ant-search-input .ant-search-btn[disabled]:active > a:only-child,\n.ant-search-input .ant-search-btn.disabled.active > a:only-child,\n.ant-search-input .ant-search-btn[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-search-input .ant-search-btn.disabled > a:only-child:after,\n.ant-search-input .ant-search-btn[disabled] > a:only-child:after,\n.ant-search-input .ant-search-btn.disabled:hover > a:only-child:after,\n.ant-search-input .ant-search-btn[disabled]:hover > a:only-child:after,\n.ant-search-input .ant-search-btn.disabled:focus > a:only-child:after,\n.ant-search-input .ant-search-btn[disabled]:focus > a:only-child:after,\n.ant-search-input .ant-search-btn.disabled:active > a:only-child:after,\n.ant-search-input .ant-search-btn[disabled]:active > a:only-child:after,\n.ant-search-input .ant-search-btn.disabled.active > a:only-child:after,\n.ant-search-input .ant-search-btn[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input .ant-search-btn:hover,\n.ant-search-input .ant-search-btn:focus,\n.ant-search-input .ant-search-btn:active,\n.ant-search-input .ant-search-btn.active {\n  background: #fff;\n}\n.ant-search-input .ant-search-btn:hover {\n  border-color: #d9d9d9;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty,\n.ant-search-input:hover .ant-search-btn-noempty {\n  color: #fff;\n  background-color: #108ee9;\n  border-color: #108ee9;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty > a:only-child {\n  color: currentColor;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:hover,\n.ant-search-input:hover .ant-search-btn-noempty:hover,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:focus,\n.ant-search-input:hover .ant-search-btn-noempty:focus {\n  color: #fff;\n  background-color: #49a9ee;\n  border-color: #49a9ee;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:hover > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty:hover > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:focus > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty:focus > a:only-child {\n  color: currentColor;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:hover > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty:hover > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:focus > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty:focus > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:active,\n.ant-search-input:hover .ant-search-btn-noempty:active,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.active,\n.ant-search-input:hover .ant-search-btn-noempty.active {\n  color: #fff;\n  background-color: #0e77ca;\n  border-color: #0e77ca;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:active > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty:active > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.active > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty.active > a:only-child {\n  color: currentColor;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty:active > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty:active > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.active > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty.active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled,\n.ant-search-input:hover .ant-search-btn-noempty.disabled,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled],\n.ant-search-input:hover .ant-search-btn-noempty[disabled],\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:hover,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:hover,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:hover,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:hover,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:focus,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:focus,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:focus,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:focus,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:active,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:active,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:active,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:active,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled.active,\n.ant-search-input:hover .ant-search-btn-noempty.disabled.active,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled].active,\n.ant-search-input:hover .ant-search-btn-noempty[disabled].active {\n  color: rgba(0, 0, 0, 0.25);\n  background-color: #f7f7f7;\n  border-color: #d9d9d9;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty.disabled > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled] > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty[disabled] > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:hover > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:hover > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:hover > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:hover > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:focus > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:focus > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:focus > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:focus > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:active > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:active > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:active > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:active > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled.active > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty.disabled.active > a:only-child,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled].active > a:only-child,\n.ant-search-input:hover .ant-search-btn-noempty[disabled].active > a:only-child {\n  color: currentColor;\n}\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty.disabled > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled] > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty[disabled] > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:hover > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:hover > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:hover > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:hover > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:focus > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:focus > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:focus > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:focus > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled:active > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty.disabled:active > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled]:active > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty[disabled]:active > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty.disabled.active > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty.disabled.active > a:only-child:after,\n.ant-search-input.ant-search-input-focus .ant-search-btn-noempty[disabled].active > a:only-child:after,\n.ant-search-input:hover .ant-search-btn-noempty[disabled].active > a:only-child:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: transparent;\n}\n.ant-search-input .ant-select-combobox .ant-select-selection__rendered {\n  margin-right: 29px;\n}\n.ant-input {\n  position: relative;\n  display: inline-block;\n  padding: 4px 7px;\n  width: 100%;\n  height: 28px;\n  cursor: text;\n  font-size: 12px;\n  line-height: 1.5;\n  color: rgba(0, 0, 0, 0.65);\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #d9d9d9;\n  border-radius: 4px;\n  transition: all .3s;\n}\n.ant-input::-moz-placeholder {\n  color: #ccc;\n  opacity: 1;\n}\n.ant-input:-ms-input-placeholder {\n  color: #ccc;\n}\n.ant-input::-webkit-input-placeholder {\n  color: #ccc;\n}\n.ant-input:hover {\n  border-color: #49a9ee;\n}\n.ant-input:focus {\n  border-color: #49a9ee;\n  outline: 0;\n  box-shadow: 0 0 0 2px rgba(16, 142, 233, 0.2);\n}\n.ant-input[disabled] {\n  background-color: #f7f7f7;\n  opacity: 1;\n  cursor: not-allowed;\n  color: rgba(0, 0, 0, 0.25);\n}\n.ant-input[disabled]:hover {\n  border-color: #e2e2e2;\n}\ntextarea.ant-input {\n  max-width: 100%;\n  height: auto;\n  vertical-align: bottom;\n}\n.ant-input-lg {\n  padding: 6px 7px;\n  height: 32px;\n}\n.ant-input-sm {\n  padding: 1px 7px;\n  height: 22px;\n}\n.ant-input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n  border-spacing: 0;\n  width: 100%;\n}\n.ant-input-group[class*=\"col-\"] {\n  float: none;\n  padding-left: 0;\n  padding-right: 0;\n}\n.ant-input-group > [class*=\"col-\"] {\n  padding-right: 8px;\n}\n.ant-input-group-addon,\n.ant-input-group-wrap,\n.ant-input-group > .ant-input {\n  display: table-cell;\n}\n.ant-input-group-addon:not(:first-child):not(:last-child),\n.ant-input-group-wrap:not(:first-child):not(:last-child),\n.ant-input-group > .ant-input:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.ant-input-group-addon,\n.ant-input-group-wrap {\n  width: 1px;\n  white-space: nowrap;\n  vertical-align: middle;\n}\n.ant-input-group-wrap > * {\n  display: block !important;\n}\n.ant-input-group .ant-input {\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n}\n.ant-input-group-addon {\n  padding: 4px 7px;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: 1;\n  color: rgba(0, 0, 0, 0.65);\n  text-align: center;\n  background-color: #eee;\n  border: 1px solid #d9d9d9;\n  border-radius: 4px;\n  position: relative;\n  transition: all .3s;\n}\n.ant-input-group-addon .ant-select {\n  margin: -5px -7px;\n}\n.ant-input-group-addon .ant-select .ant-select-selection {\n  background-color: inherit;\n  margin: -1px;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n.ant-input-group-addon .ant-select-open .ant-select-selection,\n.ant-input-group-addon .ant-select-focused .ant-select-selection {\n  color: #108ee9;\n}\n.ant-input-group-addon > i:only-child:after {\n  position: absolute;\n  content: '';\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.ant-input-group > .ant-input:first-child,\n.ant-input-group-addon:first-child {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.ant-input-group > .ant-input:first-child .ant-select .ant-select-selection,\n.ant-input-group-addon:first-child .ant-select .ant-select-selection {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.ant-input-group > .ant-input-affix-wrapper:not(:first-child) .ant-input {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0;\n}\n.ant-input-group-addon:first-child {\n  border-right: 0;\n}\n.ant-input-group-addon:last-child {\n  border-left: 0;\n}\n.ant-input-group > .ant-input:last-child,\n.ant-input-group-addon:last-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.ant-input-group > .ant-input:last-child .ant-select .ant-select-selection,\n.ant-input-group-addon:last-child .ant-select .ant-select-selection {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n}\n.ant-input-group-lg .ant-input,\n.ant-input-group-lg > .ant-input-group-addon {\n  padding: 6px 7px;\n  height: 32px;\n}\n.ant-input-group-sm .ant-input,\n.ant-input-group-sm > .ant-input-group-addon {\n  padding: 1px 7px;\n  height: 22px;\n}\n.ant-input-group-lg .ant-select-selection--single {\n  height: 32px;\n}\n.ant-input-group-sm .ant-select-selection--single {\n  height: 22px;\n}\n.ant-input-group .ant-input-affix-wrapper {\n  display: table-cell;\n  width: 100%;\n  float: left;\n}\n.ant-input-group.ant-input-group-compact > * {\n  border-radius: 0;\n  border-right-width: 0;\n  vertical-align: middle;\n  float: none;\n  display: inline-block;\n}\n.ant-input-group.ant-input-group-compact .ant-input {\n  float: none;\n  z-index: auto;\n}\n.ant-input-group.ant-input-group-compact > .ant-select > .ant-select-selection,\n.ant-input-group.ant-input-group-compact > .ant-calendar-picker .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-select-auto-complete .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-cascader-picker .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-mention-wrapper .ant-mention-editor,\n.ant-input-group.ant-input-group-compact > .ant-time-picker .ant-time-picker-input {\n  border-radius: 0;\n  border-right-width: 0;\n}\n.ant-input-group.ant-input-group-compact > *:first-child,\n.ant-input-group.ant-input-group-compact > .ant-select:first-child > .ant-select-selection,\n.ant-input-group.ant-input-group-compact > .ant-calendar-picker:first-child .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-select-auto-complete:first-child .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-cascader-picker:first-child .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-mention-wrapper:first-child .ant-mention-editor,\n.ant-input-group.ant-input-group-compact > .ant-time-picker:first-child .ant-time-picker-input {\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.ant-input-group.ant-input-group-compact > *:last-child,\n.ant-input-group.ant-input-group-compact > .ant-select:last-child > .ant-select-selection,\n.ant-input-group.ant-input-group-compact > .ant-calendar-picker:last-child .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-select-auto-complete:last-child .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-cascader-picker:last-child .ant-input,\n.ant-input-group.ant-input-group-compact > .ant-mention-wrapper:last-child .ant-mention-editor,\n.ant-input-group.ant-input-group-compact > .ant-time-picker:last-child .ant-time-picker-input {\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n  border-right-width: 1px;\n}\n.ant-input-affix-wrapper {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n}\n.ant-input-affix-wrapper .ant-input {\n  z-index: 1;\n}\n.ant-input-affix-wrapper:hover .ant-input {\n  border-color: #49a9ee;\n}\n.ant-input-affix-wrapper .ant-input-prefix,\n.ant-input-affix-wrapper .ant-input-suffix {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 2;\n  line-height: 0;\n  color: rgba(0, 0, 0, 0.65);\n}\n.ant-input-affix-wrapper .ant-input-prefix {\n  left: 7px;\n}\n.ant-input-affix-wrapper .ant-input-suffix {\n  right: 7px;\n}\n.ant-input-affix-wrapper .ant-input:not(:first-child) {\n  padding-left: 24px;\n}\n.ant-input-affix-wrapper .ant-input:not(:last-child) {\n  padding-right: 24px;\n}\n", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Helvetica Neue For Number\";\n  src: local(\"Helvetica Neue\");\n  unicode-range: U+30-39;\n}\n.ant-layout {\n  display: flex;\n  flex-direction: column;\n  flex: auto;\n  overflow: auto;\n  background: #ececec;\n}\n.ant-layout.ant-layout-has-sider {\n  flex-direction: row;\n}\n.ant-layout-header,\n.ant-layout-footer {\n  flex: 0 0 auto;\n}\n.ant-layout-header {\n  background: #404040;\n  padding: 0 50px;\n  height: 64px;\n  line-height: 64px;\n}\n.ant-layout-footer {\n  padding: 24px 50px;\n  color: rgba(0, 0, 0, 0.65);\n  font-size: 12px;\n}\n.ant-layout-content {\n  flex: auto;\n  overflow: auto;\n}\n.ant-layout-sider {\n  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);\n  position: relative;\n  background: #404040;\n  /* fix firefox can't set width smaller than content on flex item */\n  min-width: 0;\n}\n.ant-layout-sider-has-trigger {\n  padding-bottom: 48px;\n}\n.ant-layout-sider-right {\n  order: 1;\n}\n.ant-layout-sider-trigger {\n  position: absolute;\n  text-align: center;\n  width: 100%;\n  bottom: 0;\n  cursor: pointer;\n  height: 48px;\n  line-height: 48px;\n  background: rgba(64, 64, 64, 0.88);\n  color: #fff;\n}\n.ant-layout-sider-zero-width > * {\n  overflow: hidden;\n}\n.ant-layout-sider-zero-width-trigger {\n  position: absolute;\n  top: 64px;\n  right: -36px;\n  text-align: center;\n  width: 36px;\n  height: 42px;\n  line-height: 42px;\n  background: #404040;\n  color: #fff;\n  font-size: 18px;\n  border-radius: 0 4px 4px 0;\n  cursor: pointer;\n  transition: background .3s ease;\n}\n.ant-layout-sider-zero-width-trigger:hover {\n  background: #535353;\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Helvetica Neue For Number\";\n  src: local(\"Helvetica Neue\");\n  unicode-range: U+30-39;\n}\n.ant-message {\n  font-size: 12px;\n  position: fixed;\n  z-index: 1010;\n  width: 100%;\n  top: 16px;\n  left: 0;\n  pointer-events: none;\n}\n.ant-message-notice {\n  padding: 8px;\n  text-align: center;\n}\n.ant-message-notice:first-child {\n  margin-top: -8px;\n}\n.ant-message-notice-content {\n  padding: 8px 16px;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n  background: #fff;\n  display: inline-block;\n  pointer-events: all;\n}\n.ant-message-success .anticon {\n  color: #00a854;\n}\n.ant-message-error .anticon {\n  color: #f04134;\n}\n.ant-message-warning .anticon {\n  color: #ffbf00;\n}\n.ant-message-info .anticon,\n.ant-message-loading .anticon {\n  color: #108ee9;\n}\n.ant-message .anticon {\n  margin-right: 8px;\n  font-size: 14px;\n  top: 1px;\n  position: relative;\n}\n.ant-message-notice.move-up-leave.move-up-leave-active {\n  animation-name: MessageMoveOut;\n  overflow: hidden;\n  animation-duration: .3s;\n}\n@keyframes MessageMoveOut {\n  0% {\n    opacity: 1;\n    max-height: 150px;\n    padding: 8px;\n  }\n  100% {\n    opacity: 0;\n    max-height: 0;\n    padding: 0;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: \"Helvetica Neue For Number\";\n  src: local(\"Helvetica Neue\");\n  unicode-range: U+30-39;\n}\n/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n/* Sections\n   ========================================================================== */\n/**\n * Remove the margin in all browsers (opinionated).\n */\nbody {\n  margin: 0;\n}\n/**\n * Add the correct display in IE 9-.\n */\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n/* Grouping content\n   ========================================================================== */\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\nfigcaption,\nfigure,\nmain {\n  /* 1 */\n  display: block;\n}\n/**\n * Add the correct margin in IE 8.\n */\nfigure {\n  margin: 1em 40px;\n}\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  /* stylelint-disable-line */\n  font-size: 1em;\n  /* 2 */\n}\n/* Text-level semantics\n   ========================================================================== */\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\na {\n  background-color: transparent;\n  /* 1 */\n  -webkit-text-decoration-skip: objects;\n  /* 2 */\n}\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */\n}\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\nb,\nstrong {\n  font-weight: inherit;\n}\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\nb,\nstrong {\n  font-weight: bolder;\n}\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  /* stylelint-disable-line */\n  font-size: 1em;\n  /* 2 */\n}\n/**\n * Add the correct font style in Android 4.3-.\n */\ndfn {\n  font-style: italic;\n}\n/**\n * Add the correct background and color in IE 9-.\n */\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n/**\n * Add the correct font size in all browsers.\n */\nsmall {\n  font-size: 80%;\n}\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\nsub {\n  bottom: -0.25em;\n}\nsup {\n  top: -0.5em;\n}\n/* Embedded content\n   ========================================================================== */\n/**\n * Add the correct display in IE 9-.\n */\naudio,\nvideo {\n  display: inline-block;\n}\n/**\n * Add the correct display in iOS 4-7.\n */\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n/**\n * Remove the border on images inside links in IE 10-.\n */\nimg {\n  border-style: none;\n}\n/**\n * Hide the overflow in IE.\n */\nsvg:not(:root) {\n  overflow: hidden;\n}\n/* Forms\n   ========================================================================== */\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: sans-serif;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n}\n/**\n * Remove the inner border and padding in Firefox.\n */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n/**\n * Restore the focus styles unset by the previous rule.\n */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n/**\n * Correct the padding in Firefox.\n */\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\nprogress {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */\n}\n/**\n * Remove the default vertical scrollbar in IE.\n */\ntextarea {\n  overflow: auto;\n}\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n/* Interactive\n   ========================================================================== */\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\ndetails,\nmenu {\n  display: block;\n}\n/*\n * Add the correct display in all browsers.\n */\nsummary {\n  display: list-item;\n}\n/* Scripting\n   ========================================================================== */\n/**\n * Add the correct display in IE 9-.\n */\ncanvas {\n  display: inline-block;\n}\n/**\n * Add the correct display in IE.\n */\ntemplate {\n  display: none;\n}\n/* Hidden\n   ========================================================================== */\n/**\n * Add the correct display in IE 10-.\n */\n[hidden] {\n  display: none;\n}\n* {\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n*:before,\n*:after {\n  box-sizing: border-box;\n}\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  font-family: \"Helvetica Neue For Number\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 12px;\n  line-height: 1.5;\n  color: rgba(0, 0, 0, 0.65);\n  background-color: #fff;\n}\nbody,\ndiv,\ndl,\ndt,\ndd,\nul,\nol,\nli,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\npre,\ncode,\nform,\nfieldset,\nlegend,\ninput,\ntextarea,\np,\nblockquote,\nth,\ntd,\nhr,\nbutton,\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  margin: 0;\n  padding: 0;\n}\nbutton,\ninput,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n  color: inherit;\n}\nul,\nol {\n  list-style: none;\n}\ninput::-ms-clear,\ninput::-ms-reveal {\n  display: none;\n}\n::selection {\n  background: #108ee9;\n  color: #fff;\n}\na {\n  color: #108ee9;\n  background: transparent;\n  text-decoration: none;\n  outline: none;\n  cursor: pointer;\n  transition: color .3s ease;\n}\na:focus {\n  text-decoration: underline;\n  text-decoration-skip: ink;\n}\na:hover {\n  color: #49a9ee;\n}\na:active {\n  color: #0e77ca;\n}\na:active,\na:hover {\n  outline: 0;\n  text-decoration: none;\n}\na[disabled] {\n  color: rgba(0, 0, 0, 0.25);\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.ant-divider {\n  margin: 0 6px;\n  display: inline-block;\n  height: 8px;\n  width: 1px;\n  background: #ccc;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: Consolas, Menlo, Courier, monospace;\n}\n.clearfix {\n  zoom: 1;\n}\n.clearfix:before,\n.clearfix:after {\n  content: \" \";\n  display: table;\n}\n.clearfix:after {\n  clear: both;\n  visibility: hidden;\n  font-size: 0;\n  height: 0;\n}\n@font-face {\n  font-family: 'anticon';\n  src: url('https://at.alicdn.com/t/font_zck90zmlh7hf47vi.eot');\n  /* IE9*/\n  src: url('https://at.alicdn.com/t/font_zck90zmlh7hf47vi.eot?#iefix') format('embedded-opentype'), /* chrome、firefox */ url('https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff') format('woff'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/ url('https://at.alicdn.com/t/font_zck90zmlh7hf47vi.ttf') format('truetype'), /* iOS 4.1- */ url('https://at.alicdn.com/t/font_zck90zmlh7hf47vi.svg#iconfont') format('svg');\n}\n.anticon {\n  display: inline-block;\n  font-style: normal;\n  vertical-align: baseline;\n  text-align: center;\n  text-transform: none;\n  line-height: 1;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.anticon:before {\n  display: block;\n  font-family: \"anticon\" !important;\n}\n.anticon-step-forward:before {\n  content: \"\\E600\";\n}\n.anticon-step-backward:before {\n  content: \"\\E601\";\n}\n.anticon-forward:before {\n  content: \"\\E602\";\n}\n.anticon-backward:before {\n  content: \"\\E603\";\n}\n.anticon-caret-right:before {\n  content: \"\\E604\";\n}\n.anticon-caret-left:before {\n  content: \"\\E605\";\n}\n.anticon-caret-down:before {\n  content: \"\\E606\";\n}\n.anticon-caret-up:before {\n  content: \"\\E607\";\n}\n.anticon-right-circle:before {\n  content: \"\\E608\";\n}\n.anticon-circle-right:before {\n  content: \"\\E608\";\n}\n.anticon-caret-circle-right:before {\n  content: \"\\E608\";\n}\n.anticon-left-circle:before {\n  content: \"\\E609\";\n}\n.anticon-circle-left:before {\n  content: \"\\E609\";\n}\n.anticon-caret-circle-left:before {\n  content: \"\\E609\";\n}\n.anticon-up-circle:before {\n  content: \"\\E60A\";\n}\n.anticon-circle-up:before {\n  content: \"\\E60A\";\n}\n.anticon-caret-circle-up:before {\n  content: \"\\E60A\";\n}\n.anticon-down-circle:before {\n  content: \"\\E60B\";\n}\n.anticon-circle-down:before {\n  content: \"\\E60B\";\n}\n.anticon-caret-circle-down:before {\n  content: \"\\E60B\";\n}\n.anticon-right-circle-o:before {\n  content: \"\\E60C\";\n}\n.anticon-circle-o-right:before {\n  content: \"\\E60C\";\n}\n.anticon-caret-circle-o-right:before {\n  content: \"\\E60C\";\n}\n.anticon-left-circle-o:before {\n  content: \"\\E60D\";\n}\n.anticon-circle-o-left:before {\n  content: \"\\E60D\";\n}\n.anticon-caret-circle-o-left:before {\n  content: \"\\E60D\";\n}\n.anticon-up-circle-o:before {\n  content: \"\\E60E\";\n}\n.anticon-circle-o-up:before {\n  content: \"\\E60E\";\n}\n.anticon-caret-circle-o-up:before {\n  content: \"\\E60E\";\n}\n.anticon-down-circle-o:before {\n  content: \"\\E60F\";\n}\n.anticon-circle-o-down:before {\n  content: \"\\E60F\";\n}\n.anticon-caret-circle-o-down:before {\n  content: \"\\E60F\";\n}\n.anticon-verticle-left:before {\n  content: \"\\E610\";\n}\n.anticon-verticle-right:before {\n  content: \"\\E611\";\n}\n.anticon-rollback:before {\n  content: \"\\E612\";\n}\n.anticon-retweet:before {\n  content: \"\\E613\";\n}\n.anticon-shrink:before {\n  content: \"\\E614\";\n}\n.anticon-arrows-alt:before {\n  content: \"\\E615\";\n}\n.anticon-arrow-salt:before {\n  content: \"\\E615\";\n}\n.anticon-reload:before {\n  content: \"\\E616\";\n}\n.anticon-double-right:before {\n  content: \"\\E617\";\n}\n.anticon-double-left:before {\n  content: \"\\E618\";\n}\n.anticon-arrow-down:before {\n  content: \"\\E619\";\n}\n.anticon-arrow-up:before {\n  content: \"\\E61A\";\n}\n.anticon-arrow-right:before {\n  content: \"\\E61B\";\n}\n.anticon-arrow-left:before {\n  content: \"\\E61C\";\n}\n.anticon-down:before {\n  content: \"\\E61D\";\n}\n.anticon-up:before {\n  content: \"\\E61E\";\n}\n.anticon-right:before {\n  content: \"\\E61F\";\n}\n.anticon-left:before {\n  content: \"\\E620\";\n}\n.anticon-minus-square-o:before {\n  content: \"\\E621\";\n}\n.anticon-minus-circle:before {\n  content: \"\\E622\";\n}\n.anticon-minus-circle-o:before {\n  content: \"\\E623\";\n}\n.anticon-minus:before {\n  content: \"\\E624\";\n}\n.anticon-plus-circle-o:before {\n  content: \"\\E625\";\n}\n.anticon-plus-circle:before {\n  content: \"\\E626\";\n}\n.anticon-plus:before {\n  content: \"\\E627\";\n}\n.anticon-info-circle:before {\n  content: \"\\E628\";\n}\n.anticon-info-circle-o:before {\n  content: \"\\E629\";\n}\n.anticon-info:before {\n  content: \"\\E62A\";\n}\n.anticon-exclamation:before {\n  content: \"\\E62B\";\n}\n.anticon-exclamation-circle:before {\n  content: \"\\E62C\";\n}\n.anticon-exclamation-circle-o:before {\n  content: \"\\E62D\";\n}\n.anticon-close-circle:before {\n  content: \"\\E62E\";\n}\n.anticon-cross-circle:before {\n  content: \"\\E62E\";\n}\n.anticon-close-circle-o:before {\n  content: \"\\E62F\";\n}\n.anticon-cross-circle-o:before {\n  content: \"\\E62F\";\n}\n.anticon-check-circle:before {\n  content: \"\\E630\";\n}\n.anticon-check-circle-o:before {\n  content: \"\\E631\";\n}\n.anticon-check:before {\n  content: \"\\E632\";\n}\n.anticon-close:before {\n  content: \"\\E633\";\n}\n.anticon-cross:before {\n  content: \"\\E633\";\n}\n.anticon-customer-service:before {\n  content: \"\\E634\";\n}\n.anticon-customerservice:before {\n  content: \"\\E634\";\n}\n.anticon-credit-card:before {\n  content: \"\\E635\";\n}\n.anticon-code-o:before {\n  content: \"\\E636\";\n}\n.anticon-book:before {\n  content: \"\\E637\";\n}\n.anticon-bar-chart:before {\n  content: \"\\E638\";\n}\n.anticon-bars:before {\n  content: \"\\E639\";\n}\n.anticon-question:before {\n  content: \"\\E63A\";\n}\n.anticon-question-circle:before {\n  content: \"\\E63B\";\n}\n.anticon-question-circle-o:before {\n  content: \"\\E63C\";\n}\n.anticon-pause:before {\n  content: \"\\E63D\";\n}\n.anticon-pause-circle:before {\n  content: \"\\E63E\";\n}\n.anticon-pause-circle-o:before {\n  content: \"\\E63F\";\n}\n.anticon-clock-circle:before {\n  content: \"\\E640\";\n}\n.anticon-clock-circle-o:before {\n  content: \"\\E641\";\n}\n.anticon-swap:before {\n  content: \"\\E642\";\n}\n.anticon-swap-left:before {\n  content: \"\\E643\";\n}\n.anticon-swap-right:before {\n  content: \"\\E644\";\n}\n.anticon-plus-square-o:before {\n  content: \"\\E645\";\n}\n.anticon-frown:before {\n  content: \"\\E646\";\n}\n.anticon-frown-circle:before {\n  content: \"\\E646\";\n}\n.anticon-ellipsis:before {\n  content: \"\\E647\";\n}\n.anticon-copy:before {\n  content: \"\\E648\";\n}\n.anticon-menu-fold:before {\n  content: \"\\E658\";\n}\n.anticon-mail:before {\n  content: \"\\E659\";\n}\n.anticon-logout:before {\n  content: \"\\E65A\";\n}\n.anticon-link:before {\n  content: \"\\E65B\";\n}\n.anticon-area-chart:before {\n  content: \"\\E65C\";\n}\n.anticon-line-chart:before {\n  content: \"\\E65D\";\n}\n.anticon-home:before {\n  content: \"\\E65E\";\n}\n.anticon-laptop:before {\n  content: \"\\E65F\";\n}\n.anticon-star:before {\n  content: \"\\E660\";\n}\n.anticon-star-o:before {\n  content: \"\\E661\";\n}\n.anticon-folder:before {\n  content: \"\\E662\";\n}\n.anticon-filter:before {\n  content: \"\\E663\";\n}\n.anticon-file:before {\n  content: \"\\E664\";\n}\n.anticon-exception:before {\n  content: \"\\E665\";\n}\n.anticon-meh:before {\n  content: \"\\E666\";\n}\n.anticon-meh-circle:before {\n  content: \"\\E666\";\n}\n.anticon-meh-o:before {\n  content: \"\\E667\";\n}\n.anticon-shopping-cart:before {\n  content: \"\\E668\";\n}\n.anticon-save:before {\n  content: \"\\E669\";\n}\n.anticon-user:before {\n  content: \"\\E66A\";\n}\n.anticon-video-camera:before {\n  content: \"\\E66B\";\n}\n.anticon-to-top:before {\n  content: \"\\E66C\";\n}\n.anticon-team:before {\n  content: \"\\E66D\";\n}\n.anticon-tablet:before {\n  content: \"\\E66E\";\n}\n.anticon-solution:before {\n  content: \"\\E66F\";\n}\n.anticon-search:before {\n  content: \"\\E670\";\n}\n.anticon-share-alt:before {\n  content: \"\\E671\";\n}\n.anticon-setting:before {\n  content: \"\\E672\";\n}\n.anticon-poweroff:before {\n  content: \"\\E6D5\";\n}\n.anticon-picture:before {\n  content: \"\\E674\";\n}\n.anticon-phone:before {\n  content: \"\\E675\";\n}\n.anticon-paper-clip:before {\n  content: \"\\E676\";\n}\n.anticon-notification:before {\n  content: \"\\E677\";\n}\n.anticon-mobile:before {\n  content: \"\\E678\";\n}\n.anticon-menu-unfold:before {\n  content: \"\\E679\";\n}\n.anticon-inbox:before {\n  content: \"\\E67A\";\n}\n.anticon-lock:before {\n  content: \"\\E67B\";\n}\n.anticon-qrcode:before {\n  content: \"\\E67C\";\n}\n.anticon-play-circle:before {\n  content: \"\\E6D0\";\n}\n.anticon-play-circle-o:before {\n  content: \"\\E6D1\";\n}\n.anticon-tag:before {\n  content: \"\\E6D2\";\n}\n.anticon-tag-o:before {\n  content: \"\\E6D3\";\n}\n.anticon-tags:before {\n  content: \"\\E67D\";\n}\n.anticon-tags-o:before {\n  content: \"\\E67E\";\n}\n.anticon-cloud-o:before {\n  content: \"\\E67F\";\n}\n.anticon-cloud:before {\n  content: \"\\E680\";\n}\n.anticon-cloud-upload:before {\n  content: \"\\E681\";\n}\n.anticon-cloud-download:before {\n  content: \"\\E682\";\n}\n.anticon-cloud-download-o:before {\n  content: \"\\E683\";\n}\n.anticon-cloud-upload-o:before {\n  content: \"\\E684\";\n}\n.anticon-environment:before {\n  content: \"\\E685\";\n}\n.anticon-environment-o:before {\n  content: \"\\E686\";\n}\n.anticon-eye:before {\n  content: \"\\E687\";\n}\n.anticon-eye-o:before {\n  content: \"\\E688\";\n}\n.anticon-camera:before {\n  content: \"\\E689\";\n}\n.anticon-camera-o:before {\n  content: \"\\E68A\";\n}\n.anticon-windows:before {\n  content: \"\\E68B\";\n}\n.anticon-apple:before {\n  content: \"\\E68C\";\n}\n.anticon-apple-o:before {\n  content: \"\\E6D4\";\n}\n.anticon-android:before {\n  content: \"\\E938\";\n}\n.anticon-android-o:before {\n  content: \"\\E68D\";\n}\n.anticon-aliwangwang:before {\n  content: \"\\E68E\";\n}\n.anticon-aliwangwang-o:before {\n  content: \"\\E68F\";\n}\n.anticon-export:before {\n  content: \"\\E691\";\n}\n.anticon-edit:before {\n  content: \"\\E692\";\n}\n.anticon-circle-down-o:before {\n  content: \"\\E693\";\n}\n.anticon-circle-down-:before {\n  content: \"\\E694\";\n}\n.anticon-appstore-o:before {\n  content: \"\\E695\";\n}\n.anticon-appstore:before {\n  content: \"\\E696\";\n}\n.anticon-scan:before {\n  content: \"\\E697\";\n}\n.anticon-file-text:before {\n  content: \"\\E698\";\n}\n.anticon-folder-open:before {\n  content: \"\\E699\";\n}\n.anticon-hdd:before {\n  content: \"\\E69A\";\n}\n.anticon-ie:before {\n  content: \"\\E69B\";\n}\n.anticon-file-jpg:before {\n  content: \"\\E69C\";\n}\n.anticon-like:before {\n  content: \"\\E64C\";\n}\n.anticon-like-o:before {\n  content: \"\\E69D\";\n}\n.anticon-dislike:before {\n  content: \"\\E64B\";\n}\n.anticon-dislike-o:before {\n  content: \"\\E69E\";\n}\n.anticon-delete:before {\n  content: \"\\E69F\";\n}\n.anticon-enter:before {\n  content: \"\\E6A0\";\n}\n.anticon-pushpin-o:before {\n  content: \"\\E6A1\";\n}\n.anticon-pushpin:before {\n  content: \"\\E6A2\";\n}\n.anticon-heart:before {\n  content: \"\\E6A3\";\n}\n.anticon-heart-o:before {\n  content: \"\\E6A4\";\n}\n.anticon-pay-circle:before {\n  content: \"\\E6A5\";\n}\n.anticon-pay-circle-o:before {\n  content: \"\\E6A6\";\n}\n.anticon-smile:before {\n  content: \"\\E6A7\";\n}\n.anticon-smile-circle:before {\n  content: \"\\E6A7\";\n}\n.anticon-smile-o:before {\n  content: \"\\E6A8\";\n}\n.anticon-frown-o:before {\n  content: \"\\E6A9\";\n}\n.anticon-calculator:before {\n  content: \"\\E6AA\";\n}\n.anticon-message:before {\n  content: \"\\E6AB\";\n}\n.anticon-chrome:before {\n  content: \"\\E6AC\";\n}\n.anticon-github:before {\n  content: \"\\E6AD\";\n}\n.anticon-file-unknown:before {\n  content: \"\\E6AF\";\n}\n.anticon-file-excel:before {\n  content: \"\\E6B0\";\n}\n.anticon-file-ppt:before {\n  content: \"\\E6B1\";\n}\n.anticon-file-word:before {\n  content: \"\\E6B2\";\n}\n.anticon-file-pdf:before {\n  content: \"\\E6B3\";\n}\n.anticon-desktop:before {\n  content: \"\\E6B4\";\n}\n.anticon-upload:before {\n  content: \"\\E6B6\";\n}\n.anticon-download:before {\n  content: \"\\E6B7\";\n}\n.anticon-pie-chart:before {\n  content: \"\\E6B8\";\n}\n.anticon-unlock:before {\n  content: \"\\E6BA\";\n}\n.anticon-calendar:before {\n  content: \"\\E6BB\";\n}\n.anticon-windows-o:before {\n  content: \"\\E6BC\";\n}\n.anticon-dot-chart:before {\n  content: \"\\E6BD\";\n}\n.anticon-bar-chart:before {\n  content: \"\\E6BE\";\n}\n.anticon-code:before {\n  content: \"\\E6BF\";\n}\n.anticon-api:before {\n  content: \"\\E951\";\n}\n.anticon-plus-square:before {\n  content: \"\\E6C0\";\n}\n.anticon-minus-square:before {\n  content: \"\\E6C1\";\n}\n.anticon-close-square:before {\n  content: \"\\E6C2\";\n}\n.anticon-close-square-o:before {\n  content: \"\\E6C3\";\n}\n.anticon-check-square:before {\n  content: \"\\E6C4\";\n}\n.anticon-check-square-o:before {\n  content: \"\\E6C5\";\n}\n.anticon-fast-backward:before {\n  content: \"\\E6C6\";\n}\n.anticon-fast-forward:before {\n  content: \"\\E6C7\";\n}\n.anticon-up-square:before {\n  content: \"\\E6C8\";\n}\n.anticon-down-square:before {\n  content: \"\\E6C9\";\n}\n.anticon-left-square:before {\n  content: \"\\E6CA\";\n}\n.anticon-right-square:before {\n  content: \"\\E6CB\";\n}\n.anticon-right-square-o:before {\n  content: \"\\E6CC\";\n}\n.anticon-left-square-o:before {\n  content: \"\\E6CD\";\n}\n.anticon-down-square-o:before {\n  content: \"\\E6CE\";\n}\n.anticon-up-square-o:before {\n  content: \"\\E6CF\";\n}\n.anticon-loading:before {\n  content: \"\\E64D\";\n}\n.anticon-loading-3-quarters:before {\n  content: \"\\E6AE\";\n}\n.anticon-bulb:before {\n  content: \"\\E649\";\n}\n.anticon-select:before {\n  content: \"\\E64A\";\n}\n.anticon-addfile:before,\n.anticon-file-add:before {\n  content: \"\\E910\";\n}\n.anticon-addfolder:before,\n.anticon-folder-add:before {\n  content: \"\\E914\";\n}\n.anticon-switcher:before {\n  content: \"\\E913\";\n}\n.anticon-rocket:before {\n  content: \"\\E90F\";\n}\n.anticon-dingding:before {\n  content: \"\\E923\";\n}\n.anticon-dingding-o:before {\n  content: \"\\E925\";\n}\n.anticon-bell:before {\n  content: \"\\E64E\";\n}\n.anticon-disconnect:before {\n  content: \"\\E64F\";\n}\n.anticon-database:before {\n  content: \"\\E650\";\n}\n.anticon-compass:before {\n  content: \"\\E6DB\";\n}\n.anticon-barcode:before {\n  content: \"\\E652\";\n}\n.anticon-hourglass:before {\n  content: \"\\E653\";\n}\n.anticon-key:before {\n  content: \"\\E654\";\n}\n.anticon-flag:before {\n  content: \"\\E655\";\n}\n.anticon-layout:before {\n  content: \"\\E656\";\n}\n.anticon-login:before {\n  content: \"\\E657\";\n}\n.anticon-printer:before {\n  content: \"\\E673\";\n}\n.anticon-sound:before {\n  content: \"\\E6E9\";\n}\n.anticon-usb:before {\n  content: \"\\E6D7\";\n}\n.anticon-skin:before {\n  content: \"\\E6D8\";\n}\n.anticon-tool:before {\n  content: \"\\E6D9\";\n}\n.anticon-sync:before {\n  content: \"\\E6DA\";\n}\n.anticon-wifi:before {\n  content: \"\\E6D6\";\n}\n.anticon-car:before {\n  content: \"\\E6DC\";\n}\n.anticon-copyright:before {\n  content: \"\\E6DE\";\n}\n.anticon-schedule:before {\n  content: \"\\E6DF\";\n}\n.anticon-user-add:before {\n  content: \"\\E6ED\";\n}\n.anticon-user-delete:before {\n  content: \"\\E6E0\";\n}\n.anticon-usergroup-add:before {\n  content: \"\\E6DD\";\n}\n.anticon-usergroup-delete:before {\n  content: \"\\E6E1\";\n}\n.anticon-man:before {\n  content: \"\\E6E2\";\n}\n.anticon-woman:before {\n  content: \"\\E6EC\";\n}\n.anticon-shop:before {\n  content: \"\\E6E3\";\n}\n.anticon-gift:before {\n  content: \"\\E6E4\";\n}\n.anticon-idcard:before {\n  content: \"\\E6E5\";\n}\n.anticon-medicine-box:before {\n  content: \"\\E6E6\";\n}\n.anticon-red-envelope:before {\n  content: \"\\E6E7\";\n}\n.anticon-coffee:before {\n  content: \"\\E6E8\";\n}\n.anticon-trademark:before {\n  content: \"\\E651\";\n}\n.anticon-safety:before {\n  content: \"\\E6EA\";\n}\n.anticon-wallet:before {\n  content: \"\\E6EB\";\n}\n.anticon-bank:before {\n  content: \"\\E6EE\";\n}\n.anticon-trophy:before {\n  content: \"\\E6EF\";\n}\n.anticon-contacts:before {\n  content: \"\\E6F0\";\n}\n.anticon-global:before {\n  content: \"\\E6F1\";\n}\n.anticon-shake:before {\n  content: \"\\E94F\";\n}\n.anticon-fork:before {\n  content: \"\\E6F2\";\n}\n.anticon-spin:before {\n  display: inline-block;\n  animation: loadingCircle 1s infinite linear;\n}\n.fade-enter,\n.fade-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.fade-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.fade-enter.fade-enter-active,\n.fade-appear.fade-appear-active {\n  animation-name: antFadeIn;\n  animation-play-state: running;\n}\n.fade-leave.fade-leave-active {\n  animation-name: antFadeOut;\n  animation-play-state: running;\n}\n.fade-enter,\n.fade-appear {\n  opacity: 0;\n  animation-timing-function: linear;\n}\n.fade-leave {\n  animation-timing-function: linear;\n}\n@keyframes antFadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes antFadeOut {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.move-up-enter,\n.move-up-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-up-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-up-enter.move-up-enter-active,\n.move-up-appear.move-up-appear-active {\n  animation-name: antMoveUpIn;\n  animation-play-state: running;\n}\n.move-up-leave.move-up-leave-active {\n  animation-name: antMoveUpOut;\n  animation-play-state: running;\n}\n.move-up-enter,\n.move-up-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.move-up-leave {\n  animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);\n}\n.move-down-enter,\n.move-down-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-down-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-down-enter.move-down-enter-active,\n.move-down-appear.move-down-appear-active {\n  animation-name: antMoveDownIn;\n  animation-play-state: running;\n}\n.move-down-leave.move-down-leave-active {\n  animation-name: antMoveDownOut;\n  animation-play-state: running;\n}\n.move-down-enter,\n.move-down-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.move-down-leave {\n  animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);\n}\n.move-left-enter,\n.move-left-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-left-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-left-enter.move-left-enter-active,\n.move-left-appear.move-left-appear-active {\n  animation-name: antMoveLeftIn;\n  animation-play-state: running;\n}\n.move-left-leave.move-left-leave-active {\n  animation-name: antMoveLeftOut;\n  animation-play-state: running;\n}\n.move-left-enter,\n.move-left-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.move-left-leave {\n  animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);\n}\n.move-right-enter,\n.move-right-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-right-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.move-right-enter.move-right-enter-active,\n.move-right-appear.move-right-appear-active {\n  animation-name: antMoveRightIn;\n  animation-play-state: running;\n}\n.move-right-leave.move-right-leave-active {\n  animation-name: antMoveRightOut;\n  animation-play-state: running;\n}\n.move-right-enter,\n.move-right-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.move-right-leave {\n  animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);\n}\n@keyframes antMoveDownIn {\n  0% {\n    transform-origin: 0 0;\n    transform: translateY(100%);\n    opacity: 0;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateY(0%);\n    opacity: 1;\n  }\n}\n@keyframes antMoveDownOut {\n  0% {\n    transform-origin: 0 0;\n    transform: translateY(0%);\n    opacity: 1;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateY(100%);\n    opacity: 0;\n  }\n}\n@keyframes antMoveLeftIn {\n  0% {\n    transform-origin: 0 0;\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateX(0%);\n    opacity: 1;\n  }\n}\n@keyframes antMoveLeftOut {\n  0% {\n    transform-origin: 0 0;\n    transform: translateX(0%);\n    opacity: 1;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n}\n@keyframes antMoveRightIn {\n  0% {\n    opacity: 0;\n    transform-origin: 0 0;\n    transform: translateX(100%);\n  }\n  100% {\n    opacity: 1;\n    transform-origin: 0 0;\n    transform: translateX(0%);\n  }\n}\n@keyframes antMoveRightOut {\n  0% {\n    transform-origin: 0 0;\n    transform: translateX(0%);\n    opacity: 1;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateX(100%);\n    opacity: 0;\n  }\n}\n@keyframes antMoveUpIn {\n  0% {\n    transform-origin: 0 0;\n    transform: translateY(-100%);\n    opacity: 0;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateY(0%);\n    opacity: 1;\n  }\n}\n@keyframes antMoveUpOut {\n  0% {\n    transform-origin: 0 0;\n    transform: translateY(0%);\n    opacity: 1;\n  }\n  100% {\n    transform-origin: 0 0;\n    transform: translateY(-100%);\n    opacity: 0;\n  }\n}\n@keyframes loadingCircle {\n  0% {\n    transform-origin: 50% 50%;\n    transform: rotate(0deg);\n  }\n  100% {\n    transform-origin: 50% 50%;\n    transform: rotate(360deg);\n  }\n}\n.slide-up-enter,\n.slide-up-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-up-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-up-enter.slide-up-enter-active,\n.slide-up-appear.slide-up-appear-active {\n  animation-name: antSlideUpIn;\n  animation-play-state: running;\n}\n.slide-up-leave.slide-up-leave-active {\n  animation-name: antSlideUpOut;\n  animation-play-state: running;\n}\n.slide-up-enter,\n.slide-up-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n}\n.slide-up-leave {\n  animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n}\n.slide-down-enter,\n.slide-down-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-down-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-down-enter.slide-down-enter-active,\n.slide-down-appear.slide-down-appear-active {\n  animation-name: antSlideDownIn;\n  animation-play-state: running;\n}\n.slide-down-leave.slide-down-leave-active {\n  animation-name: antSlideDownOut;\n  animation-play-state: running;\n}\n.slide-down-enter,\n.slide-down-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n}\n.slide-down-leave {\n  animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n}\n.slide-left-enter,\n.slide-left-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-left-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-left-enter.slide-left-enter-active,\n.slide-left-appear.slide-left-appear-active {\n  animation-name: antSlideLeftIn;\n  animation-play-state: running;\n}\n.slide-left-leave.slide-left-leave-active {\n  animation-name: antSlideLeftOut;\n  animation-play-state: running;\n}\n.slide-left-enter,\n.slide-left-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n}\n.slide-left-leave {\n  animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n}\n.slide-right-enter,\n.slide-right-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-right-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.slide-right-enter.slide-right-enter-active,\n.slide-right-appear.slide-right-appear-active {\n  animation-name: antSlideRightIn;\n  animation-play-state: running;\n}\n.slide-right-leave.slide-right-leave-active {\n  animation-name: antSlideRightOut;\n  animation-play-state: running;\n}\n.slide-right-enter,\n.slide-right-appear {\n  opacity: 0;\n  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n}\n.slide-right-leave {\n  animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n}\n@keyframes antSlideUpIn {\n  0% {\n    opacity: 0;\n    transform-origin: 0% 0%;\n    transform: scaleY(0.8);\n  }\n  100% {\n    opacity: 1;\n    transform-origin: 0% 0%;\n    transform: scaleY(1);\n  }\n}\n@keyframes antSlideUpOut {\n  0% {\n    opacity: 1;\n    transform-origin: 0% 0%;\n    transform: scaleY(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 0% 0%;\n    transform: scaleY(0.8);\n  }\n}\n@keyframes antSlideDownIn {\n  0% {\n    opacity: 0;\n    transform-origin: 100% 100%;\n    transform: scaleY(0.8);\n  }\n  100% {\n    opacity: 1;\n    transform-origin: 100% 100%;\n    transform: scaleY(1);\n  }\n}\n@keyframes antSlideDownOut {\n  0% {\n    opacity: 1;\n    transform-origin: 100% 100%;\n    transform: scaleY(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 100% 100%;\n    transform: scaleY(0.8);\n  }\n}\n@keyframes antSlideLeftIn {\n  0% {\n    opacity: 0;\n    transform-origin: 0% 0%;\n    transform: scaleX(0.8);\n  }\n  100% {\n    opacity: 1;\n    transform-origin: 0% 0%;\n    transform: scaleX(1);\n  }\n}\n@keyframes antSlideLeftOut {\n  0% {\n    opacity: 1;\n    transform-origin: 0% 0%;\n    transform: scaleX(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 0% 0%;\n    transform: scaleX(0.8);\n  }\n}\n@keyframes antSlideRightIn {\n  0% {\n    opacity: 0;\n    transform-origin: 100% 0%;\n    transform: scaleX(0.8);\n  }\n  100% {\n    opacity: 1;\n    transform-origin: 100% 0%;\n    transform: scaleX(1);\n  }\n}\n@keyframes antSlideRightOut {\n  0% {\n    opacity: 1;\n    transform-origin: 100% 0%;\n    transform: scaleX(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 100% 0%;\n    transform: scaleX(0.8);\n  }\n}\n.swing-enter,\n.swing-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.swing-enter.swing-enter-active,\n.swing-appear.swing-appear-active {\n  animation-name: antSwingIn;\n  animation-play-state: running;\n}\n@keyframes antSwingIn {\n  0%,\n  100% {\n    transform: translateX(0);\n  }\n  20% {\n    transform: translateX(-10px);\n  }\n  40% {\n    transform: translateX(10px);\n  }\n  60% {\n    transform: translateX(-5px);\n  }\n  80% {\n    transform: translateX(5px);\n  }\n}\n.zoom-enter,\n.zoom-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-enter.zoom-enter-active,\n.zoom-appear.zoom-appear-active {\n  animation-name: antZoomIn;\n  animation-play-state: running;\n}\n.zoom-leave.zoom-leave-active {\n  animation-name: antZoomOut;\n  animation-play-state: running;\n}\n.zoom-enter,\n.zoom-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.zoom-big-enter,\n.zoom-big-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-big-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-big-enter.zoom-big-enter-active,\n.zoom-big-appear.zoom-big-appear-active {\n  animation-name: antZoomBigIn;\n  animation-play-state: running;\n}\n.zoom-big-leave.zoom-big-leave-active {\n  animation-name: antZoomBigOut;\n  animation-play-state: running;\n}\n.zoom-big-enter,\n.zoom-big-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-big-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.zoom-big-fast-enter,\n.zoom-big-fast-appear {\n  animation-duration: 0.1s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-big-fast-leave {\n  animation-duration: 0.1s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-big-fast-enter.zoom-big-fast-enter-active,\n.zoom-big-fast-appear.zoom-big-fast-appear-active {\n  animation-name: antZoomBigIn;\n  animation-play-state: running;\n}\n.zoom-big-fast-leave.zoom-big-fast-leave-active {\n  animation-name: antZoomBigOut;\n  animation-play-state: running;\n}\n.zoom-big-fast-enter,\n.zoom-big-fast-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-big-fast-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.zoom-up-enter,\n.zoom-up-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-up-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-up-enter.zoom-up-enter-active,\n.zoom-up-appear.zoom-up-appear-active {\n  animation-name: antZoomUpIn;\n  animation-play-state: running;\n}\n.zoom-up-leave.zoom-up-leave-active {\n  animation-name: antZoomUpOut;\n  animation-play-state: running;\n}\n.zoom-up-enter,\n.zoom-up-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-up-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.zoom-down-enter,\n.zoom-down-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-down-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-down-enter.zoom-down-enter-active,\n.zoom-down-appear.zoom-down-appear-active {\n  animation-name: antZoomDownIn;\n  animation-play-state: running;\n}\n.zoom-down-leave.zoom-down-leave-active {\n  animation-name: antZoomDownOut;\n  animation-play-state: running;\n}\n.zoom-down-enter,\n.zoom-down-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-down-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.zoom-left-enter,\n.zoom-left-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-left-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-left-enter.zoom-left-enter-active,\n.zoom-left-appear.zoom-left-appear-active {\n  animation-name: antZoomLeftIn;\n  animation-play-state: running;\n}\n.zoom-left-leave.zoom-left-leave-active {\n  animation-name: antZoomLeftOut;\n  animation-play-state: running;\n}\n.zoom-left-enter,\n.zoom-left-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-left-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n.zoom-right-enter,\n.zoom-right-appear {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-right-leave {\n  animation-duration: 0.2s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n}\n.zoom-right-enter.zoom-right-enter-active,\n.zoom-right-appear.zoom-right-appear-active {\n  animation-name: antZoomRightIn;\n  animation-play-state: running;\n}\n.zoom-right-leave.zoom-right-leave-active {\n  animation-name: antZoomRightOut;\n  animation-play-state: running;\n}\n.zoom-right-enter,\n.zoom-right-appear {\n  transform: scale(0);\n  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n.zoom-right-leave {\n  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n@keyframes antZoomIn {\n  0% {\n    opacity: 0;\n    transform: scale(0.2);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes antZoomOut {\n  0% {\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(0.2);\n  }\n}\n@keyframes antZoomBigIn {\n  0% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n@keyframes antZoomBigOut {\n  0% {\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n}\n@keyframes antZoomUpIn {\n  0% {\n    opacity: 0;\n    transform-origin: 50% 0%;\n    transform: scale(0.8);\n  }\n  100% {\n    transform-origin: 50% 0%;\n    transform: scale(1);\n  }\n}\n@keyframes antZoomUpOut {\n  0% {\n    transform-origin: 50% 0%;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 50% 0%;\n    transform: scale(0.8);\n  }\n}\n@keyframes antZoomLeftIn {\n  0% {\n    opacity: 0;\n    transform-origin: 0% 50%;\n    transform: scale(0.8);\n  }\n  100% {\n    transform-origin: 0% 50%;\n    transform: scale(1);\n  }\n}\n@keyframes antZoomLeftOut {\n  0% {\n    transform-origin: 0% 50%;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 0% 50%;\n    transform: scale(0.8);\n  }\n}\n@keyframes antZoomRightIn {\n  0% {\n    opacity: 0;\n    transform-origin: 100% 50%;\n    transform: scale(0.8);\n  }\n  100% {\n    transform-origin: 100% 50%;\n    transform: scale(1);\n  }\n}\n@keyframes antZoomRightOut {\n  0% {\n    transform-origin: 100% 50%;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 100% 50%;\n    transform: scale(0.8);\n  }\n}\n@keyframes antZoomDownIn {\n  0% {\n    opacity: 0;\n    transform-origin: 50% 100%;\n    transform: scale(0.8);\n  }\n  100% {\n    transform-origin: 50% 100%;\n    transform: scale(1);\n  }\n}\n@keyframes antZoomDownOut {\n  0% {\n    transform-origin: 50% 100%;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform-origin: 50% 100%;\n    transform: scale(0.8);\n  }\n}\n.ant-motion-collapse {\n  overflow: hidden;\n}\n.ant-motion-collapse-active {\n  transition: height .12s, opacity .12s;\n}\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".src-Home-Login-Login---loginBlock---2K3P7 header:after, .src-Home-Login-Login---inputContainer---1wIwy .src-Home-Login-Login---inputTitle---1aHoo:after {\n  content: '';\n  display: block;\n  clear: both; }\n\n.src-Home-Login-Login---container---3smcX {\n  text-align: center;\n  width: 100%;\n  height: 100%; }\n\n.src-Home-Login-Login---loginBlock---2K3P7 {\n  position: relative;\n  top: 20%;\n  width: 400px;\n  margin: 0 auto;\n  border: 1px #ddd solid;\n  border-radius: 4px;\n  padding: 16px; }\n  .src-Home-Login-Login---loginBlock---2K3P7 header {\n    font-size: 20px;\n    margin-bottom: 10px; }\n    .src-Home-Login-Login---loginBlock---2K3P7 header p {\n      float: left; }\n\n.src-Home-Login-Login---inputContainer---1wIwy {\n  margin: 14px 0;\n  padding: 0 64px;\n  font-size: 16px; }\n  .src-Home-Login-Login---inputContainer---1wIwy .src-Home-Login-Login---inputTitle---1aHoo p {\n    float: left; }\n  .src-Home-Login-Login---inputContainer---1wIwy .src-Home-Login-Login---inputSection---2O19X {\n    width: 100%; }\n    .src-Home-Login-Login---inputContainer---1wIwy .src-Home-Login-Login---inputSection---2O19X input {\n      width: 100%;\n      height: 31px;\n      border-radius: 3px;\n      border: 1px solid #a6a6a6;\n      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 rgba(0, 0, 0, 0.07) inset;\n      outline: 0; }\n\n.src-Home-Login-Login---buttonContainer---23qKO {\n  margin: 14px 0;\n  padding: 0 64px;\n  font-size: 16px; }\n  .src-Home-Login-Login---buttonContainer---23qKO :hover {\n    cursor: pointer; }\n  .src-Home-Login-Login---buttonContainer---23qKO button {\n    display: inline-block;\n    border: 1px #846a29 solid;\n    border-radius: 3px;\n    width: 100%;\n    height: 31px;\n    outline: 0;\n    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset;\n    margin: 16px 0; }\n  .src-Home-Login-Login---buttonContainer---23qKO .src-Home-Login-Login---loginBtn---3e8ap {\n    background: linear-gradient(to bottom, #f7dfa5, #f0c14b); }\n  .src-Home-Login-Login---buttonContainer---23qKO .src-Home-Login-Login---confirmBtn---3KTXE {\n    background: linear-gradient(to top, #13d71f, #63d71f); }\n  .src-Home-Login-Login---buttonContainer---23qKO .src-Home-Login-Login---registerBtn---q4z1v {\n    margin-top: 4px;\n    background: linear-gradient(to bottom, #f7f8fa, #e7e9ec); }\n", ""]);

// exports
exports.locals = {
	"loginBlock": "src-Home-Login-Login---loginBlock---2K3P7",
	"inputContainer": "src-Home-Login-Login---inputContainer---1wIwy",
	"inputTitle": "src-Home-Login-Login---inputTitle---1aHoo",
	"container": "src-Home-Login-Login---container---3smcX",
	"inputSection": "src-Home-Login-Login---inputSection---2O19X",
	"buttonContainer": "src-Home-Login-Login---buttonContainer---23qKO",
	"loginBtn": "src-Home-Login-Login---loginBtn---3e8ap",
	"confirmBtn": "src-Home-Login-Login---confirmBtn---3KTXE",
	"registerBtn": "src-Home-Login-Login---registerBtn---q4z1v"
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".src-Home-header---logout---1dMlZ:after {\n  content: '';\n  display: block;\n  clear: both; }\n\n.src-Home-header---container---1_PFn h1 {\n  display: inline-block; }\n\n.src-Home-header---icon---UDVvT {\n  display: inline-block; }\n\n.src-Home-header---logout---1dMlZ {\n  display: inline-block;\n  float: right; }\n  .src-Home-header---logout---1dMlZ :hover {\n    cursor: pointer; }\n", ""]);

// exports
exports.locals = {
	"logout": "src-Home-header---logout---1dMlZ",
	"container": "src-Home-header---container---1_PFn",
	"icon": "src-Home-header---icon---UDVvT"
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".src-components-test1---container---a2lFH {\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports
exports.locals = {
	"container": "src-components-test1---container---a2lFH"
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".src-components-test2---container---2krI8 {\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports
exports.locals = {
	"container": "src-components-test2---container---2krI8"
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, ".src-components-voiceBtn---container---cwylw {\n  position: fixed;\n  bottom: 2%;\n  right: 2%;\n  font-size: 14px;\n  width: 8em;\n  height: 20px;\n  line-height: 20px;\n  text-align: center; }\n", ""]);

// exports
exports.locals = {
	"container": "src-components-voiceBtn---container---cwylw"
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(201);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(328);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(42);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(60);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(73);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(782);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(869);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);

__webpack_require__(98);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);

__webpack_require__(99);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(93);


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(33);
var isObject = __webpack_require__(52);
var newPromiseCapability = __webpack_require__(17);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(33);
var aFunction = __webpack_require__(35);
var SPECIES = __webpack_require__(31)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(29);
var invoke = __webpack_require__(79);
var html = __webpack_require__(125);
var cel = __webpack_require__(118);
var global = __webpack_require__(13);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(47)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(23, function() {
			var newContent = __webpack_require__(23);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(144);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(1710);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(200);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(6);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(730);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(732);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(778);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(95);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _style2 = __webpack_require__(37);

var _layout = __webpack_require__(51);

var _layout2 = _interopRequireDefault(_layout);

var _reactRouter = __webpack_require__(50);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(108);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _moment = __webpack_require__(111);

var _moment2 = _interopRequireDefault(_moment);

__webpack_require__(115);

var _Login = __webpack_require__(60);

var _Login2 = _interopRequireDefault(_Login);

var _Register = __webpack_require__(61);

var _Register2 = _interopRequireDefault(_Register);

var _header = __webpack_require__(62);

var _header2 = _interopRequireDefault(_header);

var _test = __webpack_require__(64);

var _test2 = _interopRequireDefault(_test);

var _test3 = __webpack_require__(65);

var _test4 = _interopRequireDefault(_test3);

var _voiceBtn = __webpack_require__(66);

var _voiceBtn2 = _interopRequireDefault(_voiceBtn);

var _reactRedux = __webpack_require__(14);

var _reactRouterRedux = __webpack_require__(9);

var _store = __webpack_require__(70);

var _store2 = _interopRequireDefault(_store);

var _index = __webpack_require__(105);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_moment2.default.locale('zh-cn');

//添加moment获取日期格式的原型函数
_moment2.default.prototype.YMDHms = function () {
    return this.format('YYYY-MM-DD HH:mm:ss');
};

var history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, _store2.default);

var Content = _layout2.default.Content;


/* eslint-disable */
if (true) {
    module.hot.accept();
}
/* eslint-enable */

var Root = function (_React$Component) {
    (0, _inherits3.default)(Root, _React$Component);

    function Root() {
        (0, _classCallCheck3.default)(this, Root);
        return (0, _possibleConstructorReturn3.default)(this, (Root.__proto__ || (0, _getPrototypeOf2.default)(Root)).apply(this, arguments));
    }

    (0, _createClass3.default)(Root, [{
        key: 'render',
        value: function render() {
            var children = this.props.children;
            return _react2.default.createElement(
                _layout2.default,
                { className: 'layout' },
                _react2.default.createElement(_header2.default, null),
                _react2.default.createElement(
                    Content,
                    { className: _index2.default.pageContent },
                    children && children || null
                ),
                _react2.default.createElement(_voiceBtn2.default, null)
            );
        }
    }]);
    return Root;
}(_react2.default.Component);

var NotFoundPage = function (_React$Component2) {
    (0, _inherits3.default)(NotFoundPage, _React$Component2);

    function NotFoundPage() {
        (0, _classCallCheck3.default)(this, NotFoundPage);
        return (0, _possibleConstructorReturn3.default)(this, (NotFoundPage.__proto__ || (0, _getPrototypeOf2.default)(NotFoundPage)).apply(this, arguments));
    }

    (0, _createClass3.default)(NotFoundPage, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h1',
                    null,
                    'Route Page not found'
                )
            );
        }
    }]);
    return NotFoundPage;
}(_react2.default.Component);

var routes = _react2.default.createElement(
    _reactRouter.Route,
    null,
    _react2.default.createElement(_reactRouter.Route, { path: '/login', component: _Login2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/register', component: _Register2.default }),
    _react2.default.createElement(
        _reactRouter.Route,
        { path: '/', component: Root },
        _react2.default.createElement(_reactRouter.IndexRoute, { component: _test2.default }),
        _react2.default.createElement(_reactRouter.Route, { path: '/test1', component: _test2.default }),
        _react2.default.createElement(_reactRouter.Route, { path: '/test2', component: _test4.default }),
        _react2.default.createElement(_reactRouter.Route, { path: '/404', component: NotFoundPage }),
        _react2.default.createElement(_reactRouter.Redirect, { from: '*', to: '/404' })
    )
);

/* eslint-enable */

var Routers = function (_React$Component3) {
    (0, _inherits3.default)(Routers, _React$Component3);

    function Routers() {
        (0, _classCallCheck3.default)(this, Routers);
        return (0, _possibleConstructorReturn3.default)(this, (Routers.__proto__ || (0, _getPrototypeOf2.default)(Routers)).apply(this, arguments));
    }

    (0, _createClass3.default)(Routers, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactRouter.Router,
                { history: history },
                routes
            );
        }
    }]);
    return Routers;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: _store2.default },
    _react2.default.createElement(Routers, null)
), document.getElementById('main'));

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/*
   * CommonJS module that exports EventSource polyfill version 0.9.6
   * This module is intended for browser side use
   * =====================================================================
   * THIS IS A POLYFILL MODULE, SO IT HAS SIDE EFFECTS
   * IT AUTOMATICALLY CHECKS IF window OBJECT DEFINES EventSource
   * AND ADD THE EXPORTED ONE IN CASE IT IS UNDEFINED
   * =====================================================================
   * Supported by sc AmvTek srl
   * :email: devel@amvtek.com
 */


var PolyfillEventSource = __webpack_require__(86).EventSource;
module.exports = PolyfillEventSource;

// Add EventSource to window if it is missing...
if (window && !window.EventSource){
    window.EventSource = PolyfillEventSource;
    if (console){
	console.log("polyfill-eventsource added missing EventSource to window");
    }
}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(92);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(95);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(106);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(107);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=http://127.0.0.1:3000/__webpack_hmr&timeout=20000", __webpack_require__(116)(module)))

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);

__webpack_require__(97);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style3 = __webpack_require__(15);

var _message = __webpack_require__(34);

var _message2 = _interopRequireDefault(_message);

var _style4 = __webpack_require__(36);

var _input = __webpack_require__(45);

var _input2 = _interopRequireDefault(_input);

var _extends2 = __webpack_require__(48);

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(14);

var _reactRouterRedux = __webpack_require__(9);

var _index = __webpack_require__(10);

var _Login = __webpack_require__(44);

var _Login2 = _interopRequireDefault(_Login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkUsername = function checkUsername(username) {
    if (!username) {
        return '用户名不能为空';
    }
    return null;
}; /**
    * Created by Jad_PC on 2018/2/6.
    */


var checkPassword = function checkPassword(password) {
    if (!password) {
        return '密码不能为空';
    }
    return null;
};

var Login = function (_React$Component) {
    (0, _inherits3.default)(Login, _React$Component);

    function Login(props) {
        (0, _classCallCheck3.default)(this, Login);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Login.__proto__ || (0, _getPrototypeOf2.default)(Login)).call(this, props));

        _this.handleChange = function (param) {
            _this.setState((0, _extends3.default)({}, _this.state, param));
        };

        _this.state = {
            username: '',
            password: '',
            email: ''
        };
        return _this;
    }

    (0, _createClass3.default)(Login, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                handleLogin = _props.handleLogin,
                isLoading = _props.isLoading,
                jumpToRegister = _props.jumpToRegister;
            var _state = this.state,
                username = _state.username,
                password = _state.password;

            return _react2.default.createElement(
                'div',
                { className: _Login2.default.container },
                _react2.default.createElement(
                    'section',
                    { className: _Login2.default.loginBlock },
                    _react2.default.createElement(
                        'header',
                        { className: _Login2.default.header },
                        _react2.default.createElement(
                            'p',
                            null,
                            '\u767B\u5F55'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.inputContainer },
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputTitle },
                            _react2.default.createElement(
                                'p',
                                null,
                                '\u7528\u6237\u540D'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputSection },
                            _react2.default.createElement(_input2.default, { disabled: isLoading, type: 'text', value: username, onChange: function onChange(e) {
                                    _this2.handleChange({ username: e.target.value });
                                }, placeholder: '\u8BF7\u8F93\u5165\u7528\u6237\u540D' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.inputContainer },
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputTitle },
                            _react2.default.createElement(
                                'p',
                                null,
                                '\u5BC6\u7801'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputSection },
                            _react2.default.createElement(_input2.default, { disabled: isLoading, type: 'password', value: password, onChange: function onChange(e) {
                                    _this2.handleChange({ password: e.target.value });
                                }, placeholder: '\u8BF7\u8F93\u5165\u5BC6\u7801' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.buttonContainer },
                        _react2.default.createElement(
                            'button',
                            { disabled: isLoading, className: _Login2.default.button + ' ' + _Login2.default.loginBtn, onClick: function onClick() {
                                    handleLogin(username, password);
                                } },
                            '\u767B\u5F55'
                        ),
                        _react2.default.createElement(
                            'button',
                            { disabled: isLoading, className: _Login2.default.button + ' ' + _Login2.default.registerBtn, onClick: jumpToRegister },
                            '\u6CE8\u518C'
                        )
                    )
                )
            );
        }
    }]);
    return Login;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state) {
    var _state$getSession = state.getSession,
        user = _state$getSession.user,
        isLoading = _state$getSession.isLoading;

    return { user: user, isLoading: isLoading };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        handleLogin: function handleLogin(username, password) {
            var usnCheckRes = checkUsername(username);
            var pwdCheckRes = checkPassword(password);
            if (usnCheckRes) {
                _message2.default.warn(usnCheckRes);
                return;
            }
            if (pwdCheckRes) {
                _message2.default.warn(pwdCheckRes);
                return;
            }
            dispatch(_index.sessionActions.login('request', { username: username, password: password }));
        },
        jumpToRegister: function jumpToRegister() {
            dispatch(_reactRouterRedux.routerActions.push('/register'));
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Login);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style3 = __webpack_require__(15);

var _message = __webpack_require__(34);

var _message2 = _interopRequireDefault(_message);

var _style4 = __webpack_require__(36);

var _input = __webpack_require__(45);

var _input2 = _interopRequireDefault(_input);

var _extends2 = __webpack_require__(48);

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(14);

var _reactRouterRedux = __webpack_require__(9);

var _actions = __webpack_require__(10);

var _Login = __webpack_require__(44);

var _Login2 = _interopRequireDefault(_Login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkUsername = function checkUsername(username) {
    if (!username) {
        return '用户名不能为空';
    }
    return null;
}; /**
    * Created by Jad_PC on 2018/3/4.
    */


var checkPassword = function checkPassword(password) {
    if (!password) {
        return '密码不能为空';
    }
    return null;
};

var checkEmail = function checkEmail(email) {
    if (!email) {
        return '邮箱不能为空';
    }
    return null;
};

var Register = function (_React$Component) {
    (0, _inherits3.default)(Register, _React$Component);

    function Register(props) {
        (0, _classCallCheck3.default)(this, Register);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Register.__proto__ || (0, _getPrototypeOf2.default)(Register)).call(this, props));

        _this.handleChange = function (param) {
            _this.setState((0, _extends3.default)({}, _this.state, param));
        };

        _this.state = {
            username: '',
            password: '',
            email: '',
            isRegister: false
        };
        return _this;
    }

    (0, _createClass3.default)(Register, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                isLoading = _props.isLoading,
                handleRegister = _props.handleRegister,
                jumpToLogin = _props.jumpToLogin;
            var _state = this.state,
                username = _state.username,
                password = _state.password,
                email = _state.email;

            return _react2.default.createElement(
                'div',
                { className: _Login2.default.container },
                _react2.default.createElement(
                    'section',
                    { className: _Login2.default.loginBlock },
                    _react2.default.createElement(
                        'header',
                        { className: _Login2.default.header },
                        _react2.default.createElement(
                            'p',
                            null,
                            '\u6CE8\u518C'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.inputContainer },
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputTitle },
                            _react2.default.createElement(
                                'p',
                                null,
                                '\u7528\u6237\u540D'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputSection },
                            _react2.default.createElement(_input2.default, { disabled: isLoading, type: 'text', value: username, onChange: function onChange(e) {
                                    _this2.handleChange({ username: e.target.value });
                                }, placeholder: '\u8BF7\u8F93\u5165\u7528\u6237\u540D' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.inputContainer },
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputTitle },
                            _react2.default.createElement(
                                'p',
                                null,
                                '\u5BC6\u7801'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputSection },
                            _react2.default.createElement(_input2.default, { disabled: isLoading, type: 'password', value: password, onChange: function onChange(e) {
                                    _this2.handleChange({ password: e.target.value });
                                }, placeholder: '\u8BF7\u8F93\u5165\u5BC6\u7801' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.inputContainer },
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputTitle },
                            _react2.default.createElement(
                                'p',
                                null,
                                '\u90AE\u7BB1'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _Login2.default.inputSection },
                            _react2.default.createElement(_input2.default, { disabled: isLoading, type: 'text', value: email, onChange: function onChange(e) {
                                    _this2.handleChange({ email: e.target.value });
                                }, placeholder: '\u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: _Login2.default.buttonContainer },
                        _react2.default.createElement(
                            'button',
                            { disabled: isLoading, className: _Login2.default.button + ' ' + _Login2.default.confirmBtn, onClick: function onClick() {
                                    handleRegister(username, password, email);
                                } },
                            '\u786E\u8BA4'
                        ),
                        _react2.default.createElement(
                            'button',
                            { disabled: isLoading, className: _Login2.default.button + ' ' + _Login2.default.registerBtn, onClick: jumpToLogin },
                            '\u53D6\u6D88'
                        )
                    )
                )
            );
        }
    }]);
    return Register;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state) {
    var _state$getSession = state.getSession,
        user = _state$getSession.user,
        isLoading = _state$getSession.isLoading;

    return { user: user, isLoading: isLoading };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        handleRegister: function handleRegister(username, password, email) {
            var usnCheckRes = checkUsername(username);
            var pwdCheckRes = checkPassword(password);
            var emailCheckRes = checkEmail(email);
            if (usnCheckRes) {
                _message2.default.warn(usnCheckRes);
                return;
            }
            if (pwdCheckRes) {
                _message2.default.warn(pwdCheckRes);
                return;
            }
            if (emailCheckRes) {
                _message2.default.warn(emailCheckRes);
                return;
            }
            dispatch(_actions.sessionActions.register('request', { username: username, password: password, email: email }));
        },
        jumpToLogin: function jumpToLogin() {
            dispatch(_reactRouterRedux.routerActions.push('/login'));
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Register);

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style3 = __webpack_require__(59);

var _icon = __webpack_require__(110);

var _icon2 = _interopRequireDefault(_icon);

var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _style4 = __webpack_require__(37);

var _layout = __webpack_require__(51);

var _layout2 = _interopRequireDefault(_layout);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(14);

var _header = __webpack_require__(101);

var _header2 = _interopRequireDefault(_header);

var _actions = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Jad_PC on 2018/2/7.
 */
var Header = _layout2.default.Header;

var MyHeader = function (_React$Component) {
    (0, _inherits3.default)(MyHeader, _React$Component);

    function MyHeader() {
        (0, _classCallCheck3.default)(this, MyHeader);
        return (0, _possibleConstructorReturn3.default)(this, (MyHeader.__proto__ || (0, _getPrototypeOf2.default)(MyHeader)).apply(this, arguments));
    }

    (0, _createClass3.default)(MyHeader, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                Header,
                { className: _header2.default.container },
                _react2.default.createElement('div', { className: _header2.default.icon }),
                _react2.default.createElement(
                    'h1',
                    null,
                    'Header'
                ),
                _react2.default.createElement(
                    'div',
                    { className: _header2.default.logout, title: '\u767B\u51FA', onClick: this.props.onLogout },
                    _react2.default.createElement(_icon2.default, { type: 'logout' }),
                    this.props.user
                )
            );
        }
    }]);
    return MyHeader;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state) {
    return {
        user: state.getSession.user
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onLogout: function onLogout() {
            dispatch(_actions.sessionActions.logout('request'));
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyHeader);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Jad_PC on 2018/2/6.
 */

var LOGIN_REQUEST = exports.LOGIN_REQUEST = '发起登录请求';
var LOGIN_RECEIVE = exports.LOGIN_RECEIVE = '登录成功';
var LOGIN_ERROR = exports.LOGIN_ERROR = '登录失败';
var REGISTER_REQUEST = exports.REGISTER_REQUEST = '发起注册请求';
var REGISTER_RECEIVE = exports.REGISTER_RECEIVE = '注册成功';
var REGISTER_ERROR = exports.REGISTER_ERROR = '注册失败';
var LOGOUT_REQUEST = exports.LOGOUT_REQUEST = '发起注销请求';
var LOGOUT_RECEIVE = exports.LOGOUT_RECEIVE = '注销成功';
var LOGOUT_ERROR = exports.LOGOUT_ERROR = '注销失败';

var register = exports.register = function register(status, param) {
    switch (status) {
        case 'request':
            return {
                type: REGISTER_REQUEST,
                username: param.username,
                password: param.password,
                email: param.email
            };
        case 'receive':
            return {
                type: REGISTER_RECEIVE,
                user: param
            };
        case 'error':
            return {
                type: REGISTER_ERROR,
                error: param
            };
    }
};

var login = exports.login = function login(status, param) {
    switch (status) {
        case 'request':
            return {
                type: LOGIN_REQUEST,
                username: param.username,
                password: param.password
            };
        case 'receive':
            return {
                type: LOGIN_RECEIVE,
                user: param
            };
        case 'error':
            return {
                type: LOGIN_ERROR,
                error: param
            };
    }
};

var logout = exports.logout = function logout(status, param) {
    switch (status) {
        case 'request':
            return {
                type: LOGOUT_REQUEST
            };
        case 'receive':
            return {
                type: LOGOUT_RECEIVE
            };
        case 'error':
            return {
                type: LOGOUT_ERROR,
                error: param
            };
    }
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _d = __webpack_require__(49);

var d3 = _interopRequireWildcard(_d);

var _test = __webpack_require__(102);

var _test2 = _interopRequireDefault(_test);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function (_React$Component) {
    (0, _inherits3.default)(_default, _React$Component);

    function _default() {
        (0, _classCallCheck3.default)(this, _default);
        return (0, _possibleConstructorReturn3.default)(this, (_default.__proto__ || (0, _getPrototypeOf2.default)(_default)).apply(this, arguments));
    }

    (0, _createClass3.default)(_default, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            d3.select('.' + _test2.default.container).selectAll('p').text('这是测试一');
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: _test2.default.container },
                _react2.default.createElement('p', { className: 'test' })
            );
        }
    }]);
    return _default;
}(_react2.default.Component); /**
                               * Created by Jad_PC on 2017/9/13.
                               */


exports.default = _default;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _d = __webpack_require__(49);

var d3 = _interopRequireWildcard(_d);

var _test = __webpack_require__(103);

var _test2 = _interopRequireDefault(_test);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function (_React$Component) {
    (0, _inherits3.default)(_default, _React$Component);

    function _default() {
        (0, _classCallCheck3.default)(this, _default);
        return (0, _possibleConstructorReturn3.default)(this, (_default.__proto__ || (0, _getPrototypeOf2.default)(_default)).apply(this, arguments));
    }

    (0, _createClass3.default)(_default, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            d3.select('.' + _test2.default.container).selectAll('p').text('这是测试二');
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: _test2.default.container },
                _react2.default.createElement('p', { className: 'test' })
            );
        }
    }]);
    return _default;
}(_react2.default.Component); /**
                               * Created by Jad_PC on 2017/9/13.
                               */


exports.default = _default;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _style2 = __webpack_require__(58);

var _button = __webpack_require__(130);

var _button2 = _interopRequireDefault(_button);

var _getPrototypeOf = __webpack_require__(8);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(5);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(4);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _voiceBtn = __webpack_require__(104);

var _voiceBtn2 = _interopRequireDefault(_voiceBtn);

var _voiceCapture = __webpack_require__(72);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function (_React$Component) {
    (0, _inherits3.default)(_default, _React$Component);

    function _default(props) {
        (0, _classCallCheck3.default)(this, _default);

        var _this = (0, _possibleConstructorReturn3.default)(this, (_default.__proto__ || (0, _getPrototypeOf2.default)(_default)).call(this, props));

        _this.state = {
            isMousedown: false
        };
        return _this;
    }

    (0, _createClass3.default)(_default, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var isMousedown = this.state.isMousedown;

            return _react2.default.createElement(
                'div',
                {
                    className: _voiceBtn2.default.container,
                    onMouseDown: function onMouseDown() {
                        _this2.setState({
                            isMousedown: true
                        });
                        (0, _voiceCapture.startVoiceRecord)(); //按下按钮后开始录音
                    },
                    onMouseUp: function onMouseUp() {
                        _this2.setState({
                            isMousedown: false
                        });
                        (0, _voiceCapture.stopAndSendRecord)(); //松开按钮后停止录音，并将录音发送到服务器进行识别
                    }
                },
                _react2.default.createElement(
                    _button2.default,
                    null,
                    !isMousedown ? '按下开始录音' : '松开停止录音'
                )
            );
        }
    }]);
    return _default;
}(_react2.default.Component); /**
                               * Created by Jad_PC on 2018/2/27.
                               */


exports.default = _default;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = __webpack_require__(30);

var _actions = __webpack_require__(10);

/**
 * Created by Jad_PC on 2018/2/6.
 */

var user = function user() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.user;
    var action = arguments[1];

    switch (action.type) {
        case _actions.sessionActions.LOGIN_RECEIVE:
            return action.user.username;
        case _actions.sessionActions.LOGOUT_RECEIVE:
            return null;
        default:
            return state;
    }
};

var email = function email() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.email;
    var action = arguments[1];

    switch (action.type) {
        case _actions.sessionActions.LOGIN_RECEIVE:
            return action.user.email;
        case _actions.sessionActions.LOGOUT_RECEIVE:
            return null;
        default:
            return state;
    }
};

var isLoading = function isLoading() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var action = arguments[1];

    switch (action.type) {
        case _actions.sessionActions.LOGIN_REQUEST:
        case _actions.sessionActions.LOGOUT_REQUEST:
            return true;
        case _actions.sessionActions.LOGIN_RECEIVE:
        case _actions.sessionActions.LOGIN_ERROR:
        case _actions.sessionActions.LOGOUT_RECEIVE:
        case _actions.sessionActions.LOGOUT_ERROR:
            return false;
        default:
            return state;
    }
};

var getSession = (0, _redux.combineReducers)({
    isLoading: isLoading,
    user: user,
    email: email
});

exports.default = getSession;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = __webpack_require__(38);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = __webpack_require__(46);

var _sessionSagas = __webpack_require__(69);

var _sessionSagas2 = _interopRequireDefault(_sessionSagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(rootSaga); /**
                                                                  * Created by Jad_PC on 2018/1/25.
                                                                  */


function rootSaga() {
  return _regenerator2.default.wrap(function rootSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.all)([(0, _effects.call)(_sessionSagas2.default)]);

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

exports.default = rootSaga;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(38);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = __webpack_require__(74);

var _promise2 = _interopRequireDefault(_promise);

var _style2 = __webpack_require__(15);

var _message = __webpack_require__(34);

var _message2 = _interopRequireDefault(_message);

exports.default = sessionSaga;

var _effects = __webpack_require__(46);

var _reactRouterRedux = __webpack_require__(9);

var _actions = __webpack_require__(10);

var _fetchProxy = __webpack_require__(71);

var _fetchProxy2 = _interopRequireDefault(_fetchProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(login),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(logout),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(register),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(watchLogin),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(watchLogout),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(watchRegister),
    _marked7 = /*#__PURE__*/_regenerator2.default.mark(sessionSaga); /**
                                                                      * Created by Jad_PC on 2018/2/6.
                                                                      */

window.message = _message2.default;
var delay = function delay(time) {
    return new _promise2.default(function (res) {
        setTimeout(res, time);
    });
};
var loginUrl = location.origin + '/login';
var logoutUrl = location.origin + '/logout';
var registerUrl = location.origin + '/register';

window.routerActions = _reactRouterRedux.routerActions;
function login(_ref) {
    var username = _ref.username,
        password = _ref.password;
    var result, nextUrl;
    return _regenerator2.default.wrap(function login$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return delay(500);

                case 3:
                    _context.next = 5;
                    return (0, _effects.call)(_fetchProxy2.default, loginUrl, { method: 'POST', contentType: 'application/json', payload: { username: username, password: password } });

                case 5:
                    result = _context.sent;

                    if (!(result.success === '1')) {
                        _context.next = 19;
                        break;
                    }

                    _context.next = 9;
                    return (0, _effects.put)(_actions.sessionActions.login('receive', result.value));

                case 9:
                    //登录成功后控制页面跳转至登录前的页面
                    nextUrl = location.href.split('nextUrl=')[1] || null;

                    nextUrl = nextUrl ? decodeURIComponent(nextUrl) : '/';

                    if (!nextUrl.startsWith('/api/')) {
                        _context.next = 15;
                        break;
                    }

                    //如果登录前访问的是/api接口，则直接将页面url跳转至该接口，因为前端路由中不含有/api接口，会跳转至404页面
                    window.location.href = location.origin + nextUrl;
                    _context.next = 17;
                    break;

                case 15:
                    _context.next = 17;
                    return (0, _effects.put)(_reactRouterRedux.routerActions.push(nextUrl));

                case 17:
                    _context.next = 22;
                    break;

                case 19:
                    _message2.default.error(result.value);
                    _context.next = 22;
                    return (0, _effects.put)(_actions.sessionActions.login('error', result.value));

                case 22:
                    _context.next = 29;
                    break;

                case 24:
                    _context.prev = 24;
                    _context.t0 = _context['catch'](0);

                    _message2.default.error(_context.t0);
                    _context.next = 29;
                    return (0, _effects.put)(_actions.sessionActions.login('error', _context.t0));

                case 29:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this, [[0, 24]]);
}

function logout() {
    var result;
    return _regenerator2.default.wrap(function logout$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.prev = 0;
                    _context2.next = 3;
                    return (0, _effects.call)(_fetchProxy2.default, logoutUrl);

                case 3:
                    result = _context2.sent;

                    if (!(result.success == '0')) {
                        _context2.next = 10;
                        break;
                    }

                    _message2.default.error(result.value);
                    _context2.next = 8;
                    return (0, _effects.put)(_actions.sessionActions.logout('error', result.value));

                case 8:
                    _context2.next = 14;
                    break;

                case 10:
                    _context2.next = 12;
                    return (0, _effects.put)(_actions.sessionActions.logout('receive'));

                case 12:
                    _context2.next = 14;
                    return (0, _effects.put)(_reactRouterRedux.routerActions.push('/login'));

                case 14:
                    _context2.next = 21;
                    break;

                case 16:
                    _context2.prev = 16;
                    _context2.t0 = _context2['catch'](0);

                    _message2.default.error(_context2.t0);
                    _context2.next = 21;
                    return (0, _effects.put)(_actions.sessionActions.logout('error', _context2.t0));

                case 21:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked2, this, [[0, 16]]);
}

function register(_ref2) {
    var username = _ref2.username,
        password = _ref2.password,
        email = _ref2.email;
    var result;
    return _regenerator2.default.wrap(function register$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.prev = 0;
                    _context3.next = 3;
                    return (0, _effects.call)(_fetchProxy2.default, registerUrl, {
                        method: 'POST',
                        contentType: 'application/json',
                        payload: { name: username, password: password, email: email }
                    });

                case 3:
                    result = _context3.sent;

                    if (result.success === '0') {
                        _message2.default.error(result.value);
                    }

                    if (!(result.success === '1')) {
                        _context3.next = 9;
                        break;
                    }

                    _message2.default.success(result.value);
                    _context3.next = 9;
                    return (0, _effects.put)(_reactRouterRedux.routerActions.push('/login'));

                case 9:
                    _context3.next = 14;
                    break;

                case 11:
                    _context3.prev = 11;
                    _context3.t0 = _context3['catch'](0);

                    _message2.default.error(_context3.t0);

                case 14:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked3, this, [[0, 11]]);
}

function watchLogin() {
    var _ref3, username, password;

    return _regenerator2.default.wrap(function watchLogin$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    if (false) {
                        _context4.next = 10;
                        break;
                    }

                    _context4.next = 3;
                    return (0, _effects.take)(_actions.sessionActions.LOGIN_REQUEST);

                case 3:
                    _ref3 = _context4.sent;
                    username = _ref3.username;
                    password = _ref3.password;
                    _context4.next = 8;
                    return (0, _effects.fork)(login, { username: username, password: password });

                case 8:
                    _context4.next = 0;
                    break;

                case 10:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _marked4, this);
}

function watchLogout() {
    return _regenerator2.default.wrap(function watchLogout$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    if (false) {
                        _context5.next = 7;
                        break;
                    }

                    _context5.next = 3;
                    return (0, _effects.take)(_actions.sessionActions.LOGOUT_REQUEST);

                case 3:
                    _context5.next = 5;
                    return (0, _effects.fork)(logout);

                case 5:
                    _context5.next = 0;
                    break;

                case 7:
                case 'end':
                    return _context5.stop();
            }
        }
    }, _marked5, this);
}

function watchRegister() {
    var _ref4, _username, _password, email;

    return _regenerator2.default.wrap(function watchRegister$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:
                    if (false) {
                        _context6.next = 11;
                        break;
                    }

                    _context6.next = 3;
                    return (0, _effects.take)(_actions.sessionActions.REGISTER_REQUEST);

                case 3:
                    _ref4 = _context6.sent;
                    _username = _ref4.username;
                    _password = _ref4.password;
                    email = _ref4.email;
                    _context6.next = 9;
                    return (0, _effects.fork)(register, { username: _username, password: _password, email: email });

                case 9:
                    _context6.next = 0;
                    break;

                case 11:
                case 'end':
                    return _context6.stop();
            }
        }
    }, _marked6, this);
}

function sessionSaga() {
    return _regenerator2.default.wrap(function sessionSaga$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    _context7.next = 2;
                    return (0, _effects.all)([(0, _effects.call)(watchLogin), (0, _effects.call)(watchLogout), (0, _effects.call)(watchRegister)]);

                case 2:
                case 'end':
                    return _context7.stop();
            }
        }
    }, _marked7, this);
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = __webpack_require__(30);

var _reactRouter = __webpack_require__(50);

var _reactRouterRedux = __webpack_require__(9);

var _reduxSaga = __webpack_require__(123);

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _reduxLogger = __webpack_require__(122);

var _reducers = __webpack_require__(16);

var _reducers2 = _interopRequireDefault(_reducers);

var _sagas = __webpack_require__(68);

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sagaMiddleware = (0, _reduxSaga2.default)(); /**
                                                  * Created by Jad_PC on 2018/1/25.
                                                  */

var routeMiddleware = (0, _reactRouterRedux.routerMiddleware)(_reactRouter.browserHistory);

var middlewares = [sagaMiddleware, routeMiddleware];
/* eslint-disable */
if (true) {
    middlewares.push((0, _reduxLogger.createLogger)());
}

var store = (0, _redux.createStore)(_reducers2.default, _redux.applyMiddleware.apply(undefined, middlewares));
window.store = store;
window.routerActions = _reactRouterRedux.routerActions;

if (true) {
    module.hot.accept(16, function () {
        var nextRootReducer = __webpack_require__(16);
        store.replaceReducer(nextRootReducer);
    });
}
/* eslint-enable */

sagaMiddleware.run(_sagas2.default);

exports.default = store;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(73);

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Jad_PC on 2018/2/6.
 */

var doFetch = function doFetch(url) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var method = param.method || 'get';
    var headers = {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
        // 'Cache-Control': 'max-age=1200',
        // 'Pragma': 'max-age=1200'
    };

    if (method.toLowerCase() === 'get') {
        return fetch(url, { headers: headers, credentials: 'include' }).catch(function (err) {
            console.log(err);
        });
    } else {
        var payload = param.payload || '';
        var contentType = param.contentType || null;
        if (!contentType) {
            var params = new FormData();
            for (var key in payload) {
                params.append('' + key, payload[key]);
            }
            return fetch(url, {
                method: 'post',
                credentials: 'include',
                body: params
            });
        }
        payload = (0, _stringify2.default)(payload);
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': contentType
            },
            credentials: 'include',
            body: payload
        });
    }
};

var fetchProxy = function fetchProxy(url, param) {
    return doFetch(url, param).then(function (data) {
        return data.json();
    }).catch(function (err) {
        console.log(err);
    });
};

exports.default = fetchProxy;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Jad_PC on 2018/1/30.
 */
var MediaUtils = {
    /**
     * 获取用户媒体设备(处理兼容的问题)
     * @param videoEnable {boolean} - 是否启用摄像头
     * @param audioEnable {boolean} - 是否启用麦克风
     * @param callback {Function} - 处理回调
     */
    getUserMedia: function getUserMedia(videoEnable, audioEnable, callback) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || window.getUserMedia;
        var constraints = { video: videoEnable, audio: audioEnable };
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                callback(false, stream);
            })['catch'](function (err) {
                callback(err);
            });
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints, function (stream) {
                callback(false, stream);
            }, function (err) {
                callback(err);
            });
        } else {
            callback(new Error('Not support userMedia'));
        }
    },

    /**
     * 关闭媒体流
     * @param stream {MediaStream} - 需要关闭的流
     */
    closeStream: function closeStream(stream) {
        if (typeof stream.stop === 'function') {
            stream.stop();
        } else {
            var trackList = [stream.getAudioTracks(), stream.getVideoTracks()];

            for (var i = 0; i < trackList.length; i++) {
                var tracks = trackList[i];
                if (tracks && tracks.length > 0) {
                    for (var j = 0; j < tracks.length; j++) {
                        var track = tracks[j];
                        if (typeof track.stop === 'function') {
                            track.stop();
                        }
                    }
                }
            }
        }
    }
};

// 用于存放 MediaRecorder 对象和音频Track，关闭录制和关闭媒体设备需要用到
var recorder = void 0,
    mediaStream = void 0;

// 用于存放录制后的音频文件对象和录制结束回调
var recorderFile = void 0,
    stopRecordCallback = void 0;

// 用于存放是否开启了视频录制
var videoEnabled = false;

// 录制短语音
var startRecord = exports.startRecord = function startRecord(enableVideo) {
    videoEnabled = enableVideo;
    MediaUtils.getUserMedia(enableVideo, true, function (err, stream) {
        if (err) {
            throw err;
        } else {
            // 通过 MediaRecorder 记录获取到的媒体流
            recorder = new MediaRecorder(stream);
            mediaStream = stream;
            var chunks = [];
            recorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };
            recorder.onstop = function () {
                recorderFile = new Blob(chunks, { 'type': recorder.mimeType });
                chunks = [];
                if (null != stopRecordCallback) {
                    stopRecordCallback();
                }
            };
            recorder.start();
        }
    });
};

// 停止录制
var stopRecord = function stopRecord(callback) {
    stopRecordCallback = callback;
    // 终止录制器
    recorder.stop();
    // 关闭媒体流
    MediaUtils.closeStream(mediaStream);
};

// 播放录制的音频
var playRecord = exports.playRecord = function playRecord() {
    var url = URL.createObjectURL(recorderFile);
    var dom = document.createElement(videoEnabled ? 'video' : 'audio');
    dom.autoplay = true;
    dom.src = url;
    if (videoEnabled) {
        dom.width = 640;
        dom.height = 480;
        dom.style.zIndex = '9999999';
        dom.style.position = 'fixed';
        dom.style.left = '0';
        dom.style.right = '0';
        dom.style.top = '0';
        dom.style.bottom = '0';
        dom.style.margin = 'auto';
        document.body.appendChild(dom);
    }
};

var sendRecordFile = function sendRecordFile() {
    var formData = new FormData();
    var options = {
        method: 'post'
    };
    formData.append('file', recorderFile);
    options.body = formData;
    fetch('http://127.0.0.1:3000/api/record-file', options).then(function (res) {
        return res.json();
    }).then(function (res) {
        console.log(res);
        res = res[0] || '';
        if (res.includes('测试一')) {
            window.store.dispatch(window.routerActions.push('/test1'));
        } else if (res.includes('测试二')) {
            window.store.dispatch(window.routerActions.push('/test2'));
        }
    });
};

var startVoiceRecord = exports.startVoiceRecord = function startVoiceRecord() {
    startRecord(false);
};

var stopAndSendRecord = exports.stopAndSendRecord = function stopAndSendRecord() {
    stopRecord(sendRecordFile);
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(12);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(129);
__webpack_require__(109);
__webpack_require__(114);
__webpack_require__(83);
__webpack_require__(84);
__webpack_require__(85);
module.exports = __webpack_require__(12).Promise;


/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(29);
var call = __webpack_require__(127);
var isArrayIter = __webpack_require__(126);
var anObject = __webpack_require__(33);
var toLength = __webpack_require__(119);
var getIterFn = __webpack_require__(120);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(13);
var macrotask = __webpack_require__(42).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(47)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(131);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(13);
var core = __webpack_require__(12);
var dP = __webpack_require__(121);
var DESCRIPTORS = __webpack_require__(124);
var SPECIES = __webpack_require__(31)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(112);
var global = __webpack_require__(13);
var ctx = __webpack_require__(29);
var classof = __webpack_require__(117);
var $export = __webpack_require__(32);
var isObject = __webpack_require__(52);
var aFunction = __webpack_require__(35);
var anInstance = __webpack_require__(77);
var forOf = __webpack_require__(78);
var speciesConstructor = __webpack_require__(41);
var task = __webpack_require__(42).set;
var microtask = __webpack_require__(80)();
var newPromiseCapabilityModule = __webpack_require__(17);
var perform = __webpack_require__(39);
var promiseResolve = __webpack_require__(40);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(31)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(81)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(113)($Promise, PROMISE);
__webpack_require__(82)(PROMISE);
Wrapper = __webpack_require__(12)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(128)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(32);
var core = __webpack_require__(12);
var global = __webpack_require__(13);
var speciesConstructor = __webpack_require__(41);
var promiseResolve = __webpack_require__(40);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(32);
var newPromiseCapability = __webpack_require__(17);
var perform = __webpack_require__(39);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/*
   * EventSource polyfill version 0.9.6
   * Supported by sc AmvTek srl
   * :email: devel@amvtek.com
 */
;(function (global) {

    if (global.EventSource && !global._eventSourceImportPrefix){
        return;
    }

    var evsImportName = (global._eventSourceImportPrefix||'')+"EventSource";

    var EventSource = function (url, options) {

        if (!url || typeof url != 'string') {
            throw new SyntaxError('Not enough arguments');
        }

        this.URL = url;
        this.setOptions(options);
        var evs = this;
        setTimeout(function(){evs.poll()}, 0);
    };

    EventSource.prototype = {

        CONNECTING: 0,

        OPEN: 1,

        CLOSED: 2,

        defaultOptions: {

            loggingEnabled: false,

            loggingPrefix: "eventsource",

            interval: 500, // milliseconds

            bufferSizeLimit: 256*1024, // bytes

            silentTimeout: 300000, // milliseconds

            getArgs:{
                'evs_buffer_size_limit': 256*1024
            },

            xhrHeaders:{
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest'
            }
        },

        setOptions: function(options){

            var defaults = this.defaultOptions;
            var option;

            // set all default options...
            for (option in defaults){

                if ( defaults.hasOwnProperty(option) ){
                    this[option] = defaults[option];
                }
            }

            // override with what is in options
            for (option in options){

                if (option in defaults && options.hasOwnProperty(option)){
                    this[option] = options[option];
                }
            }

            // if getArgs option is enabled
            // ensure evs_buffer_size_limit corresponds to bufferSizeLimit
            if (this.getArgs && this.bufferSizeLimit) {

                this.getArgs['evs_buffer_size_limit'] = this.bufferSizeLimit;
            }

            // if console is not available, force loggingEnabled to false
            if (typeof console === "undefined" || typeof console.log === "undefined") {

                this.loggingEnabled = false;
            }
        },

        log: function(message) {

            if (this.loggingEnabled) {

                console.log("[" + this.loggingPrefix +"]:" + message)
            }
        },

        poll: function() {

            try {

                if (this.readyState == this.CLOSED) {
                    return;
                }

                this.cleanup();
                this.readyState = this.CONNECTING;
                this.cursor = 0;
                this.cache = '';
                this._xhr = new this.XHR(this);
                this.resetNoActivityTimer();

            }
            catch (e) {

                // in an attempt to silence the errors
                this.log('There were errors inside the pool try-catch');
                this.dispatchEvent('error', { type: 'error', data: e.message });
            }
        },

        pollAgain: function (interval) {

            // schedule poll to be called after interval milliseconds
            var evs = this;
            evs.readyState = evs.CONNECTING;
            evs.dispatchEvent('error', {
                type: 'error',
                data: "Reconnecting "
            });
            this._pollTimer = setTimeout(function(){evs.poll()}, interval||0);
        },


        cleanup: function() {

            this.log('evs cleaning up')

            if (this._pollTimer){
                clearInterval(this._pollTimer);
                this._pollTimer = null;
            }

            if (this._noActivityTimer){
                clearInterval(this._noActivityTimer);
                this._noActivityTimer = null;
            }

            if (this._xhr){
                this._xhr.abort();
                this._xhr = null;
            }
        },

        resetNoActivityTimer: function(){

            if (this.silentTimeout){

                if (this._noActivityTimer){
                    clearInterval(this._noActivityTimer);
                }
                var evs = this;
                this._noActivityTimer = setTimeout(
                        function(){ evs.log('Timeout! silentTImeout:'+evs.silentTimeout); evs.pollAgain(); },
                        this.silentTimeout
                        );
            }
        },

        close: function () {

            this.readyState = this.CLOSED;
            this.log('Closing connection. readyState: '+this.readyState);
            this.cleanup();
        },

        ondata: function() {

            var request = this._xhr;

            if (request.isReady() && !request.hasError() ) {
                // reset the timer, as we have activity
                this.resetNoActivityTimer();

                // move this EventSource to OPEN state...
                if (this.readyState == this.CONNECTING) {
                    this.readyState = this.OPEN;
                    this.dispatchEvent('open', { type: 'open' });
                }

                var buffer = request.getBuffer();

                if (buffer.length > this.bufferSizeLimit) {
                    this.log('buffer.length > this.bufferSizeLimit');
                    this.pollAgain();
                }

                if (this.cursor == 0 && buffer.length > 0){

                    // skip byte order mark \uFEFF character if it starts the stream
                    if (buffer.substring(0,1) == '\uFEFF'){
                        this.cursor = 1;
                    }
                }

                var lastMessageIndex = this.lastMessageIndex(buffer);
                if (lastMessageIndex[0] >= this.cursor){

                    var newcursor = lastMessageIndex[1];
                    var toparse = buffer.substring(this.cursor, newcursor);
                    this.parseStream(toparse);
                    this.cursor = newcursor;
                }

                // if request is finished, reopen the connection
                if (request.isDone()) {
                    this.log('request.isDone(). reopening the connection');
                    this.pollAgain(this.interval);
                }
            }
            else if (this.readyState !== this.CLOSED) {

                this.log('this.readyState !== this.CLOSED');
                this.pollAgain(this.interval);

                //MV: Unsure why an error was previously dispatched
            }
        },

        parseStream: function(chunk) {

            // normalize line separators (\r\n,\r,\n) to \n
            // remove white spaces that may precede \n
            chunk = this.cache + this.normalizeToLF(chunk);

            var events = chunk.split('\n\n');

            var i, j, eventType, datas, line, retry;

            for (i=0; i < (events.length - 1); i++) {

                eventType = 'message';
                datas = [];
                parts = events[i].split('\n');

                for (j=0; j < parts.length; j++) {

                    line = this.trimWhiteSpace(parts[j]);

                    if (line.indexOf('event') == 0) {

                        eventType = line.replace(/event:?\s*/, '');
                    }
                    else if (line.indexOf('retry') == 0) {

                        retry = parseInt(line.replace(/retry:?\s*/, ''));
                        if(!isNaN(retry)) {
                            this.interval = retry;
                        }
                    }
                    else if (line.indexOf('data') == 0) {

                        datas.push(line.replace(/data:?\s*/, ''));
                    }
                    else if (line.indexOf('id:') == 0) {

                        this.lastEventId = line.replace(/id:?\s*/, '');
                    }
                    else if (line.indexOf('id') == 0) { // this resets the id

                        this.lastEventId = null;
                    }
                }

                if (datas.length) {
                    // dispatch a new event
                    var event = new MessageEvent(eventType, datas.join('\n'), window.location.origin, this.lastEventId);
                    this.dispatchEvent(eventType, event);
                }
            }

            this.cache = events[events.length - 1];
        },

        dispatchEvent: function (type, event) {
            var handlers = this['_' + type + 'Handlers'];

            if (handlers) {

                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].call(this, event);
                }
            }

            if (this['on' + type]) {
                this['on' + type].call(this, event);
            }

        },

        addEventListener: function (type, handler) {
            if (!this['_' + type + 'Handlers']) {
                this['_' + type + 'Handlers'] = [];
            }

            this['_' + type + 'Handlers'].push(handler);
        },

        removeEventListener: function (type, handler) {
            var handlers = this['_' + type + 'Handlers'];
            if (!handlers) {
                return;
            }
            for (var i = handlers.length - 1; i >= 0; --i) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        },

        _pollTimer: null,

        _noactivityTimer: null,

        _xhr: null,

        lastEventId: null,

        cache: '',

        cursor: 0,

        onerror: null,

        onmessage: null,

        onopen: null,

        readyState: 0,

        // ===================================================================
        // helpers functions
        // those are attached to prototype to ease reuse and testing...

        urlWithParams: function (baseURL, params) {

            var encodedArgs = [];

            if (params){

                var key, urlarg;
                var urlize = encodeURIComponent;

                for (key in params){
                    if (params.hasOwnProperty(key)) {
                        urlarg = urlize(key)+'='+urlize(params[key]);
                        encodedArgs.push(urlarg);
                    }
                }
            }

            if (encodedArgs.length > 0){

                if (baseURL.indexOf('?') == -1)
                    return baseURL + '?' + encodedArgs.join('&');
                return baseURL + '&' + encodedArgs.join('&');
            }
            return baseURL;
        },

        lastMessageIndex: function(text) {

            var ln2 =text.lastIndexOf('\n\n');
            var lr2 = text.lastIndexOf('\r\r');
            var lrln2 = text.lastIndexOf('\r\n\r\n');

            if (lrln2 > Math.max(ln2, lr2)) {
                return [lrln2, lrln2+4];
            }
            return [Math.max(ln2, lr2), Math.max(ln2, lr2) + 2]
        },

        trimWhiteSpace: function(str) {
            // to remove whitespaces left and right of string

            var reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
            return str.replace(reTrim, '');
        },

        normalizeToLF: function(str) {

            // replace \r and \r\n with \n
            return str.replace(/\r\n|\r/g, '\n');
        }

    };

    if (!isOldIE()){

        EventSource.isPolyfill = "XHR";

        // EventSource will send request using XMLHttpRequest
        EventSource.prototype.XHR = function(evs) {

            request = new XMLHttpRequest();
            this._request = request;
            evs._xhr = this;

            // set handlers
            request.onreadystatechange = function(){
                if (request.readyState > 1 && evs.readyState != evs.CLOSED) {
                    if (request.status == 200 || (request.status>=300 && request.status<400)){
                        evs.ondata();
                    }
                    else {
                        request._failed = true;
                        evs.readyState = evs.CLOSED;
                        evs.dispatchEvent('error', {
                            type: 'error',
                            data: "The server responded with "+request.status
                        });
                        evs.close();
                    }
                }
            };

            request.onprogress = function () {
            };

            request.open('GET', evs.urlWithParams(evs.URL, evs.getArgs), true);

            var headers = evs.xhrHeaders; // maybe null
            for (var header in headers) {
                if (headers.hasOwnProperty(header)){
                    request.setRequestHeader(header, headers[header]);
                }
            }
            if (evs.lastEventId) {
                request.setRequestHeader('Last-Event-Id', evs.lastEventId);
            }

            request.send();
        };

        EventSource.prototype.XHR.prototype = {

            useXDomainRequest: false,

            _request: null,

            _failed: false, // true if we have had errors...

            isReady: function() {


                return this._request.readyState >= 2;
            },

            isDone: function() {

                return (this._request.readyState == 4);
            },

            hasError: function() {

                return (this._failed || (this._request.status >= 400));
            },

            getBuffer: function() {

                var rv = '';
                try {
                    rv = this._request.responseText || '';
                }
                catch (e){}
                return rv;
            },

            abort: function() {

                if ( this._request ) {
                    this._request.abort();
                }
            }
        };
    }
    else {

	EventSource.isPolyfill = "IE_8-9";

        // patch EventSource defaultOptions
        var defaults = EventSource.prototype.defaultOptions;
        defaults.xhrHeaders = null; // no headers will be sent
        defaults.getArgs['evs_preamble'] = 2048 + 8;

        // EventSource will send request using Internet Explorer XDomainRequest
        EventSource.prototype.XHR = function(evs) {

            request = new XDomainRequest();
            this._request = request;

            // set handlers
            request.onprogress = function(){
                request._ready = true;
                evs.ondata();
            };

            request.onload = function(){
                this._loaded = true;
                evs.ondata();
            };

            request.onerror = function(){
                this._failed = true;
                evs.readyState = evs.CLOSED;
                evs.dispatchEvent('error', {
                    type: 'error',
                    data: "XDomainRequest error"
                });
            };

            request.ontimeout = function(){
                this._failed = true;
                evs.readyState = evs.CLOSED;
                evs.dispatchEvent('error', {
                    type: 'error',
                    data: "XDomainRequest timed out"
                });
            };

            // XDomainRequest does not allow setting custom headers
            // If EventSource has enabled the use of GET arguments
            // we add parameters to URL so that server can adapt the stream...
            var reqGetArgs = {};
            if (evs.getArgs) {

                // copy evs.getArgs in reqGetArgs
                var defaultArgs = evs.getArgs;
                    for (var key in defaultArgs) {
                        if (defaultArgs.hasOwnProperty(key)){
                            reqGetArgs[key] = defaultArgs[key];
                        }
                    }
                if (evs.lastEventId){
                    reqGetArgs['evs_last_event_id'] = evs.lastEventId;
                }
            }
            // send the request

            request.open('GET', evs.urlWithParams(evs.URL,reqGetArgs));
            request.send();
        };

        EventSource.prototype.XHR.prototype = {

            useXDomainRequest: true,

            _request: null,

            _ready: false, // true when progress events are dispatched

            _loaded: false, // true when request has been loaded

            _failed: false, // true if when request is in error

            isReady: function() {

                return this._request._ready;
            },

            isDone: function() {

                return this._request._loaded;
            },

            hasError: function() {

                return this._request._failed;
            },

            getBuffer: function() {

                var rv = '';
                try {
                    rv = this._request.responseText || '';
                }
                catch (e){}
                return rv;
            },

            abort: function() {

                if ( this._request){
                    this._request.abort();
                }
            }
        };
    }

    function MessageEvent(type, data, origin, lastEventId) {

        this.bubbles = false;
        this.cancelBubble = false;
        this.cancelable = false;
        this.data = data || null;
        this.origin = origin || '';
        this.lastEventId = lastEventId || '';
        this.type = type || 'message';
    }

    function isOldIE () {

        //return true if we are in IE8 or IE9
        return (window.XDomainRequest && (window.XMLHttpRequest && new XMLHttpRequest().responseType === undefined)) ? true : false;
    }

    global[evsImportName] = EventSource;
})(this);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(89),
  Html4Entities: __webpack_require__(88),
  Html5Entities: __webpack_require__(43),
  AllHtmlEntities: __webpack_require__(43)
};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 89 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(90);
exports.encode = exports.stringify = __webpack_require__(91);


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

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

module.exports = __webpack_require__(94);

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


/***/ }),
/* 94 */
/***/ (function(module, exports) {

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


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(57)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 96 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(18, function() {
			var newContent = __webpack_require__(18);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(19, function() {
			var newContent = __webpack_require__(19);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(20, function() {
			var newContent = __webpack_require__(20);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(21, function() {
			var newContent = __webpack_require__(21);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(24, function() {
			var newContent = __webpack_require__(24);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(25, function() {
			var newContent = __webpack_require__(25);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(26, function() {
			var newContent = __webpack_require__(26);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(27, function() {
			var newContent = __webpack_require__(27);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(28, function() {
			var newContent = __webpack_require__(28);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(56);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(87).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(11);

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(150);

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(19);

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(2);

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(204);

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(208);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(215);

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(288);

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(326);

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(359);

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(360);

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(369);

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(370);

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(62);

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(734);

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(735);

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(74);

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(874);

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(875);

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(877);

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(879);

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(898);

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(91);

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(94);

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(54);
__webpack_require__(55);
module.exports = __webpack_require__(53);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjRkODgyM2I2M2VlYmUxZjY0NTEiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibGliXCIiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC9yZWFjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyLXJlZHV4L2xpYi9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYW50ZC9saWIvc3R5bGUvaW5kZXgubGVzcz80MGM5Iiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vLy4vfi9hbnRkL2xpYi9tZXNzYWdlL3N0eWxlL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yZWR1Y2Vycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwid2VicGFjazovLy8uL34vYW50ZC9saWIvYnV0dG9uL3N0eWxlL2luZGV4Lmxlc3MiLCJ3ZWJwYWNrOi8vLy4vfi9hbnRkL2xpYi9pbnB1dC9zdHlsZS9pbmRleC5sZXNzIiwid2VicGFjazovLy8uL34vYW50ZC9saWIvbGF5b3V0L3N0eWxlL2luZGV4Lmxlc3MiLCJ3ZWJwYWNrOi8vLy4vfi9hbnRkL2xpYi9tZXNzYWdlL3N0eWxlL2luZGV4Lmxlc3MiLCJ3ZWJwYWNrOi8vLy4vfi9hbnRkL2xpYi9zdHlsZS9pbmRleC5sZXNzIiwid2VicGFjazovLy8uL3NyYy9Ib21lL0xvZ2luL0xvZ2luLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL0hvbWUvaGVhZGVyLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdGVzdDEuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy90ZXN0Mi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3ZvaWNlQnRuLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWR1eC9lcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYW50ZC9saWIvbWVzc2FnZS9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vLi9+L2FudGQvbGliL2lucHV0L3N0eWxlL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYW50ZC9saWIvbGF5b3V0L3N0eWxlL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wZXJmb3JtLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Rhc2suanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2xpYi9odG1sNS1lbnRpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvSG9tZS9Mb2dpbi9Mb2dpbi5zY3NzP2EwNDciLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9hbnRkL2xpYi9pbnB1dC9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVkdXgtc2FnYS9lcy9lZmZlY3RzLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kcy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvZDMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci9lcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYW50ZC9saWIvbGF5b3V0L2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzeCIsIndlYnBhY2s6Ly8vLi9+L2V2ZW50c291cmNlLXBvbHlmaWxsL2Rpc3QvYnJvd3NlcmlmeS1ldmVudHNvdXJjZS5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL2NsaWVudC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL2NsaWVudC5qcz9kMzQyIiwid2VicGFjazovLy8uL34vYW5zaS1odG1sL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYW5zaS1yZWdleC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FudGQvbGliL2J1dHRvbi9zdHlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FudGQvbGliL2ljb24vc3R5bGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0hvbWUvTG9naW4vTG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0hvbWUvTG9naW4vUmVnaXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0hvbWUvaGVhZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3Nlc3Npb25BY3Rpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3Rlc3QxLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3Rlc3QyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3ZvaWNlQnRuLmpzIiwid2VicGFjazovLy8uL3NyYy9yZWR1Y2Vycy9zZXNzaW9uUmVkdWNlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NhZ2FzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zYWdhcy9zZXNzaW9uU2FnYXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9mZXRjaFByb3h5LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy92b2ljZUNhcHR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWljcm90YXNrLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5wcm9taXNlLnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L2V2ZW50c291cmNlLXBvbHlmaWxsL2Rpc3QvZXZlbnRzb3VyY2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vaHRtbC1lbnRpdGllcy9saWIvaHRtbDQtZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9odG1sLWVudGl0aWVzL2xpYi94bWwtZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwid2VicGFjazovLy8uL34vcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS1tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHJpcC1hbnNpL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2ZpeFVybHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbnRkL2xpYi9idXR0b24vc3R5bGUvaW5kZXgubGVzcz9iYzUwIiwid2VicGFjazovLy8uL34vYW50ZC9saWIvaW5wdXQvc3R5bGUvaW5kZXgubGVzcz9iYjM4Iiwid2VicGFjazovLy8uL34vYW50ZC9saWIvbGF5b3V0L3N0eWxlL2luZGV4Lmxlc3M/ZGVhZSIsIndlYnBhY2s6Ly8vLi9+L2FudGQvbGliL21lc3NhZ2Uvc3R5bGUvaW5kZXgubGVzcz9kYzBjIiwid2VicGFjazovLy8uL3NyYy9Ib21lL2hlYWRlci5zY3NzPzJkNmMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdGVzdDEuc2Nzcz9lMjZiIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3Rlc3QyLnNjc3M/YzJmYyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy92b2ljZUJ0bi5zY3NzPzA0YzIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnNjc3M/MDRlMSIsIndlYnBhY2s6Ly8vKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL2NsaWVudC1vdmVybGF5LmpzIiwid2VicGFjazovLy8od2VicGFjayktaG90LW1pZGRsZXdhcmUvcHJvY2Vzcy11cGRhdGUuanMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FudGQvbGliL2ljb24vaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19saWJyYXJ5LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL21vbWVudC9sb2NhbGUvemgtY24uanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3dlYnBhY2svYnVpbGRpbi9tb2R1bGUuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWR1eC1sb2dnZXIvZGlzdC9yZWR1eC1sb2dnZXIuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlZHV4LXNhZ2EvZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9hbnRkL2xpYi9idXR0b24vaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWIiXSwibmFtZXMiOlsic2Vzc2lvbkFjdGlvbnMiLCJyb290UmVkdWNlciIsInJvdXRpbmciLCJnZXRTZXNzaW9uIiwibG9jYWxlIiwicHJvdG90eXBlIiwiWU1ESG1zIiwiZm9ybWF0IiwiaGlzdG9yeSIsIkNvbnRlbnQiLCJtb2R1bGUiLCJob3QiLCJhY2NlcHQiLCJSb290IiwiY2hpbGRyZW4iLCJwcm9wcyIsInBhZ2VDb250ZW50IiwiQ29tcG9uZW50IiwiTm90Rm91bmRQYWdlIiwicm91dGVzIiwiUm91dGVycyIsInJlbmRlciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGVja1VzZXJuYW1lIiwidXNlcm5hbWUiLCJjaGVja1Bhc3N3b3JkIiwicGFzc3dvcmQiLCJMb2dpbiIsImhhbmRsZUNoYW5nZSIsInBhcmFtIiwic2V0U3RhdGUiLCJzdGF0ZSIsImVtYWlsIiwiaGFuZGxlTG9naW4iLCJpc0xvYWRpbmciLCJqdW1wVG9SZWdpc3RlciIsImNvbnRhaW5lciIsImxvZ2luQmxvY2siLCJoZWFkZXIiLCJpbnB1dENvbnRhaW5lciIsImlucHV0VGl0bGUiLCJpbnB1dFNlY3Rpb24iLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJidXR0b25Db250YWluZXIiLCJidXR0b24iLCJsb2dpbkJ0biIsInJlZ2lzdGVyQnRuIiwibWFwU3RhdGVUb1Byb3BzIiwidXNlciIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsInVzbkNoZWNrUmVzIiwicHdkQ2hlY2tSZXMiLCJ3YXJuIiwiZGlzcGF0Y2giLCJsb2dpbiIsInB1c2giLCJjaGVja0VtYWlsIiwiUmVnaXN0ZXIiLCJpc1JlZ2lzdGVyIiwiaGFuZGxlUmVnaXN0ZXIiLCJqdW1wVG9Mb2dpbiIsImNvbmZpcm1CdG4iLCJlbWFpbENoZWNrUmVzIiwicmVnaXN0ZXIiLCJIZWFkZXIiLCJNeUhlYWRlciIsImljb24iLCJsb2dvdXQiLCJvbkxvZ291dCIsIkxPR0lOX1JFUVVFU1QiLCJMT0dJTl9SRUNFSVZFIiwiTE9HSU5fRVJST1IiLCJSRUdJU1RFUl9SRVFVRVNUIiwiUkVHSVNURVJfUkVDRUlWRSIsIlJFR0lTVEVSX0VSUk9SIiwiTE9HT1VUX1JFUVVFU1QiLCJMT0dPVVRfUkVDRUlWRSIsIkxPR09VVF9FUlJPUiIsInN0YXR1cyIsInR5cGUiLCJlcnJvciIsImQzIiwic2VsZWN0Iiwic2VsZWN0QWxsIiwidGV4dCIsImlzTW91c2Vkb3duIiwid2luZG93IiwiYWN0aW9uIiwicm9vdFNhZ2EiLCJzZXNzaW9uU2FnYSIsIndhdGNoTG9naW4iLCJ3YXRjaExvZ291dCIsIndhdGNoUmVnaXN0ZXIiLCJtZXNzYWdlIiwiZGVsYXkiLCJzZXRUaW1lb3V0IiwicmVzIiwidGltZSIsImxvZ2luVXJsIiwibG9jYXRpb24iLCJvcmlnaW4iLCJsb2dvdXRVcmwiLCJyZWdpc3RlclVybCIsInJvdXRlckFjdGlvbnMiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInBheWxvYWQiLCJyZXN1bHQiLCJzdWNjZXNzIiwibmV4dFVybCIsImhyZWYiLCJzcGxpdCIsImRlY29kZVVSSUNvbXBvbmVudCIsInN0YXJ0c1dpdGgiLCJuYW1lIiwic2FnYU1pZGRsZXdhcmUiLCJyb3V0ZU1pZGRsZXdhcmUiLCJtaWRkbGV3YXJlcyIsInN0b3JlIiwibmV4dFJvb3RSZWR1Y2VyIiwicmVxdWlyZSIsInJlcGxhY2VSZWR1Y2VyIiwicnVuIiwiZG9GZXRjaCIsInVybCIsImhlYWRlcnMiLCJ0b0xvd2VyQ2FzZSIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJlcnIiLCJwYXJhbXMiLCJGb3JtRGF0YSIsImtleSIsImFwcGVuZCIsImJvZHkiLCJmZXRjaFByb3h5IiwidGhlbiIsImRhdGEiLCJqc29uIiwiTWVkaWFVdGlscyIsImdldFVzZXJNZWRpYSIsInZpZGVvRW5hYmxlIiwiYXVkaW9FbmFibGUiLCJjYWxsYmFjayIsIm5hdmlnYXRvciIsIndlYmtpdEdldFVzZXJNZWRpYSIsIm1vekdldFVzZXJNZWRpYSIsIm1zR2V0VXNlck1lZGlhIiwiY29uc3RyYWludHMiLCJ2aWRlbyIsImF1ZGlvIiwibWVkaWFEZXZpY2VzIiwic3RyZWFtIiwiRXJyb3IiLCJjbG9zZVN0cmVhbSIsInN0b3AiLCJ0cmFja0xpc3QiLCJnZXRBdWRpb1RyYWNrcyIsImdldFZpZGVvVHJhY2tzIiwiaSIsImxlbmd0aCIsInRyYWNrcyIsImoiLCJ0cmFjayIsInJlY29yZGVyIiwibWVkaWFTdHJlYW0iLCJyZWNvcmRlckZpbGUiLCJzdG9wUmVjb3JkQ2FsbGJhY2siLCJ2aWRlb0VuYWJsZWQiLCJzdGFydFJlY29yZCIsImVuYWJsZVZpZGVvIiwiTWVkaWFSZWNvcmRlciIsImNodW5rcyIsIm9uZGF0YWF2YWlsYWJsZSIsIm9uc3RvcCIsIkJsb2IiLCJtaW1lVHlwZSIsInN0YXJ0Iiwic3RvcFJlY29yZCIsInBsYXlSZWNvcmQiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJkb20iLCJjcmVhdGVFbGVtZW50IiwiYXV0b3BsYXkiLCJzcmMiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwiekluZGV4IiwicG9zaXRpb24iLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJtYXJnaW4iLCJhcHBlbmRDaGlsZCIsInNlbmRSZWNvcmRGaWxlIiwiZm9ybURhdGEiLCJvcHRpb25zIiwiaW5jbHVkZXMiLCJzdGFydFZvaWNlUmVjb3JkIiwic3RvcEFuZFNlbmRSZWNvcmQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbFRBLDZDOzs7Ozs7QUNBQSw4Qzs7Ozs7O0FDQUEsNkM7Ozs7OztBQ0FBLDZDOzs7Ozs7QUNBQSw2Qzs7Ozs7O0FDQUEsK0M7Ozs7OztB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJEQUEscUJDQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0RBQSxtQkNBQSxDREFBLEVDQUE7O0FBRUE7QUFDQTtBQUNBLGNEQUEsbUJDQUEsQ0RBQSxHQ0FBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUIsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxtQkFBbUIsRUFBRTtBQUN4RTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkMscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JEQUEsbUJDQUEsQ0RBQSxHQ0FBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzdQQTs7QUFFQTs7QUFFQTtBQUNBLG1EQUFtRCxJQUFJLFNBQVMsTUFBTSxJQUFJOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsR0FBRztBQUNIO0FBQ0Esc0JBQXNCO0FBQ3RCLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1Q0FBdUMsVUFBVSwrQkFBK0I7QUFDaEY7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQy9LQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVksSUFBSSxJQUFJLE1BQU0sSUFBSTtBQUMzRDs7Ozs7Ozs7QUNIQTs7QUFFQTs7QUFFQSx3Qjs7Ozs7OztBQ0pBOztBQUVBLHdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQ0E7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxRQUFELEVBQWM7QUFDaEMsUUFBRyxDQUFDQSxRQUFKLEVBQWE7QUFDVCxlQUFPLFNBQVA7QUFDSDtBQUNELFdBQU8sSUFBUDtBQUNILENBTEQsQyxDQVZBOzs7OztBQWlCQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLFFBQUQsRUFBYztBQUNoQyxRQUFHLENBQUNBLFFBQUosRUFBYTtBQUNULGVBQU8sUUFBUDtBQUNIO0FBQ0QsV0FBTyxJQUFQO0FBQ0gsQ0FMRDs7SUFPTUMsSzs7O0FBQ0YsbUJBQVliLEtBQVosRUFBa0I7QUFBQTs7QUFBQSx3SUFDUkEsS0FEUTs7QUFBQSxjQVNsQmMsWUFUa0IsR0FTSCxVQUFDQyxLQUFELEVBQVc7QUFDdEIsa0JBQUtDLFFBQUwsNEJBQ08sTUFBS0MsS0FEWixFQUVPRixLQUZQO0FBSUgsU0FkaUI7O0FBRWQsY0FBS0UsS0FBTCxHQUFhO0FBQ1RQLHNCQUFVLEVBREQ7QUFFVEUsc0JBQVUsRUFGRDtBQUdUTSxtQkFBTztBQUhFLFNBQWI7QUFGYztBQU9qQjs7OztpQ0FTTztBQUFBOztBQUFBLHlCQUM2QyxLQUFLbEIsS0FEbEQ7QUFBQSxnQkFDR21CLFdBREgsVUFDR0EsV0FESDtBQUFBLGdCQUNnQkMsU0FEaEIsVUFDZ0JBLFNBRGhCO0FBQUEsZ0JBQzJCQyxjQUQzQixVQUMyQkEsY0FEM0I7QUFBQSx5QkFFeUIsS0FBS0osS0FGOUI7QUFBQSxnQkFFR1AsUUFGSCxVQUVHQSxRQUZIO0FBQUEsZ0JBRWFFLFFBRmIsVUFFYUEsUUFGYjs7QUFHSixtQkFDSTtBQUFBO0FBQUEsa0JBQUssV0FBVyxnQkFBT1UsU0FBdkI7QUFDSTtBQUFBO0FBQUEsc0JBQVMsV0FBVyxnQkFBT0MsVUFBM0I7QUFDSTtBQUFBO0FBQUEsMEJBQVEsV0FBVyxnQkFBT0MsTUFBMUI7QUFBa0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFsQyxxQkFESjtBQUVJO0FBQUE7QUFBQSwwQkFBSyxXQUFXLGdCQUFPQyxjQUF2QjtBQUNJO0FBQUE7QUFBQSw4QkFBSyxXQUFXLGdCQUFPQyxVQUF2QjtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW5DLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFLLFdBQVcsZ0JBQU9DLFlBQXZCO0FBQ0ksNkVBQU8sVUFBVVAsU0FBakIsRUFBNEIsTUFBSyxNQUFqQyxFQUF3QyxPQUFPVixRQUEvQyxFQUF5RCxVQUFVLGtCQUFDa0IsQ0FBRCxFQUFPO0FBQUMsMkNBQUtkLFlBQUwsQ0FBa0IsRUFBQ0osVUFBVWtCLEVBQUVDLE1BQUYsQ0FBU0MsS0FBcEIsRUFBbEI7QUFBK0MsaUNBQTFILEVBQTRILGFBQVksc0NBQXhJO0FBREo7QUFGSixxQkFGSjtBQVFJO0FBQUE7QUFBQSwwQkFBSyxXQUFXLGdCQUFPTCxjQUF2QjtBQUNJO0FBQUE7QUFBQSw4QkFBSyxXQUFXLGdCQUFPQyxVQUF2QjtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW5DLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFLLFdBQVcsZ0JBQU9DLFlBQXZCO0FBQ0ksNkVBQU8sVUFBVVAsU0FBakIsRUFBNEIsTUFBSyxVQUFqQyxFQUE0QyxPQUFPUixRQUFuRCxFQUE2RCxVQUFVLGtCQUFDZ0IsQ0FBRCxFQUFPO0FBQUMsMkNBQUtkLFlBQUwsQ0FBa0IsRUFBQ0YsVUFBVWdCLEVBQUVDLE1BQUYsQ0FBU0MsS0FBcEIsRUFBbEI7QUFBK0MsaUNBQTlILEVBQWdJLGFBQVksZ0NBQTVJO0FBREo7QUFGSixxQkFSSjtBQWNJO0FBQUE7QUFBQSwwQkFBSyxXQUFXLGdCQUFPQyxlQUF2QjtBQUNJO0FBQUE7QUFBQSw4QkFBUSxVQUFVWCxTQUFsQixFQUE2QixXQUFjLGdCQUFPWSxNQUFyQixTQUErQixnQkFBT0MsUUFBbkUsRUFBK0UsU0FBUyxtQkFBTTtBQUFDZCxnREFBWVQsUUFBWixFQUFzQkUsUUFBdEI7QUFBaUMsaUNBQWhJO0FBQUE7QUFBQSx5QkFESjtBQUVJO0FBQUE7QUFBQSw4QkFBUSxVQUFVUSxTQUFsQixFQUE2QixXQUFjLGdCQUFPWSxNQUFyQixTQUErQixnQkFBT0UsV0FBbkUsRUFBa0YsU0FBU2IsY0FBM0Y7QUFBQTtBQUFBO0FBRko7QUFkSjtBQURKLGFBREo7QUF1Qkg7OztFQTNDZSxnQkFBTW5CLFM7O0FBOEMxQixJQUFNaUMsa0JBQWtCLFNBQWxCQSxlQUFrQixRQUFTO0FBQUEsNEJBQ0hsQixNQUFNN0IsVUFESDtBQUFBLFFBQ3RCZ0QsSUFEc0IscUJBQ3RCQSxJQURzQjtBQUFBLFFBQ2hCaEIsU0FEZ0IscUJBQ2hCQSxTQURnQjs7QUFFN0IsV0FBTyxFQUFDZ0IsVUFBRCxFQUFPaEIsb0JBQVAsRUFBUDtBQUNILENBSEQ7O0FBS0EsSUFBTWlCLHFCQUFxQixTQUFyQkEsa0JBQXFCO0FBQUEsV0FBYTtBQUNwQ2xCLHFCQUFhLHFCQUFDVCxRQUFELEVBQVdFLFFBQVgsRUFBd0I7QUFDakMsZ0JBQU0wQixjQUFjN0IsY0FBY0MsUUFBZCxDQUFwQjtBQUNBLGdCQUFNNkIsY0FBYzVCLGNBQWNDLFFBQWQsQ0FBcEI7QUFDQSxnQkFBRzBCLFdBQUgsRUFBZTtBQUNYLGtDQUFRRSxJQUFSLENBQWFGLFdBQWI7QUFDQTtBQUNIO0FBQ0QsZ0JBQUdDLFdBQUgsRUFBZTtBQUNYLGtDQUFRQyxJQUFSLENBQWFELFdBQWI7QUFDQTtBQUNIO0FBQ0RFLHFCQUFTLHNCQUFlQyxLQUFmLENBQXFCLFNBQXJCLEVBQWdDLEVBQUNoQyxrQkFBRCxFQUFXRSxrQkFBWCxFQUFoQyxDQUFUO0FBQ0gsU0FibUM7QUFjcENTLHdCQUFnQiwwQkFBTTtBQUNsQm9CLHFCQUFTLGdDQUFjRSxJQUFkLENBQW1CLFdBQW5CLENBQVQ7QUFDSDtBQWhCbUMsS0FBYjtBQUFBLENBQTNCOztrQkFtQmUseUJBQVFSLGVBQVIsRUFBeUJFLGtCQUF6QixFQUE2Q3hCLEtBQTdDLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRmY7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUosZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxRQUFELEVBQWM7QUFDaEMsUUFBRyxDQUFDQSxRQUFKLEVBQWE7QUFDVCxlQUFPLFNBQVA7QUFDSDtBQUNELFdBQU8sSUFBUDtBQUNILENBTEQsQyxDQVZBOzs7OztBQWlCQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLFFBQUQsRUFBYztBQUNoQyxRQUFHLENBQUNBLFFBQUosRUFBYTtBQUNULGVBQU8sUUFBUDtBQUNIO0FBQ0QsV0FBTyxJQUFQO0FBQ0gsQ0FMRDs7QUFPQSxJQUFNZ0MsYUFBYSxTQUFiQSxVQUFhLENBQUMxQixLQUFELEVBQVc7QUFDMUIsUUFBRyxDQUFDQSxLQUFKLEVBQVU7QUFDTixlQUFPLFFBQVA7QUFDSDtBQUNELFdBQU8sSUFBUDtBQUNILENBTEQ7O0lBUU0yQixROzs7QUFDRixzQkFBWTdDLEtBQVosRUFBa0I7QUFBQTs7QUFBQSw4SUFDUkEsS0FEUTs7QUFBQSxjQVVsQmMsWUFWa0IsR0FVSCxVQUFDQyxLQUFELEVBQVc7QUFDdEIsa0JBQUtDLFFBQUwsNEJBQ08sTUFBS0MsS0FEWixFQUVPRixLQUZQO0FBSUgsU0FmaUI7O0FBRWQsY0FBS0UsS0FBTCxHQUFhO0FBQ1RQLHNCQUFVLEVBREQ7QUFFVEUsc0JBQVUsRUFGRDtBQUdUTSxtQkFBTyxFQUhFO0FBSVQ0Qix3QkFBWTtBQUpILFNBQWI7QUFGYztBQVFqQjs7OztpQ0FTTztBQUFBOztBQUFBLHlCQUM2QyxLQUFLOUMsS0FEbEQ7QUFBQSxnQkFDR29CLFNBREgsVUFDR0EsU0FESDtBQUFBLGdCQUNjMkIsY0FEZCxVQUNjQSxjQURkO0FBQUEsZ0JBQzhCQyxXQUQ5QixVQUM4QkEsV0FEOUI7QUFBQSx5QkFFZ0MsS0FBSy9CLEtBRnJDO0FBQUEsZ0JBRUdQLFFBRkgsVUFFR0EsUUFGSDtBQUFBLGdCQUVhRSxRQUZiLFVBRWFBLFFBRmI7QUFBQSxnQkFFdUJNLEtBRnZCLFVBRXVCQSxLQUZ2Qjs7QUFHSixtQkFDSTtBQUFBO0FBQUEsa0JBQUssV0FBVyxnQkFBT0ksU0FBdkI7QUFDSTtBQUFBO0FBQUEsc0JBQVMsV0FBVyxnQkFBT0MsVUFBM0I7QUFDSTtBQUFBO0FBQUEsMEJBQVEsV0FBVyxnQkFBT0MsTUFBMUI7QUFBa0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFsQyxxQkFESjtBQUVJO0FBQUE7QUFBQSwwQkFBSyxXQUFXLGdCQUFPQyxjQUF2QjtBQUNJO0FBQUE7QUFBQSw4QkFBSyxXQUFXLGdCQUFPQyxVQUF2QjtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW5DLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFLLFdBQVcsZ0JBQU9DLFlBQXZCO0FBQ0ksNkVBQU8sVUFBVVAsU0FBakIsRUFBNEIsTUFBSyxNQUFqQyxFQUF3QyxPQUFPVixRQUEvQyxFQUF5RCxVQUFVLGtCQUFDa0IsQ0FBRCxFQUFPO0FBQUMsMkNBQUtkLFlBQUwsQ0FBa0IsRUFBQ0osVUFBVWtCLEVBQUVDLE1BQUYsQ0FBU0MsS0FBcEIsRUFBbEI7QUFBK0MsaUNBQTFILEVBQTRILGFBQVksc0NBQXhJO0FBREo7QUFGSixxQkFGSjtBQVFJO0FBQUE7QUFBQSwwQkFBSyxXQUFXLGdCQUFPTCxjQUF2QjtBQUNJO0FBQUE7QUFBQSw4QkFBSyxXQUFXLGdCQUFPQyxVQUF2QjtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW5DLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFLLFdBQVcsZ0JBQU9DLFlBQXZCO0FBQ0ksNkVBQU8sVUFBVVAsU0FBakIsRUFBNEIsTUFBSyxVQUFqQyxFQUE0QyxPQUFPUixRQUFuRCxFQUE2RCxVQUFVLGtCQUFDZ0IsQ0FBRCxFQUFPO0FBQUMsMkNBQUtkLFlBQUwsQ0FBa0IsRUFBQ0YsVUFBVWdCLEVBQUVDLE1BQUYsQ0FBU0MsS0FBcEIsRUFBbEI7QUFBK0MsaUNBQTlILEVBQWdJLGFBQVksZ0NBQTVJO0FBREo7QUFGSixxQkFSSjtBQWNJO0FBQUE7QUFBQSwwQkFBSyxXQUFXLGdCQUFPTCxjQUF2QjtBQUNJO0FBQUE7QUFBQSw4QkFBSyxXQUFXLGdCQUFPQyxVQUF2QjtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW5DLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFLLFdBQVcsZ0JBQU9DLFlBQXZCO0FBQ0ksNkVBQU8sVUFBVVAsU0FBakIsRUFBNEIsTUFBSyxNQUFqQyxFQUF3QyxPQUFPRixLQUEvQyxFQUFzRCxVQUFVLGtCQUFDVSxDQUFELEVBQU87QUFDbkUsMkNBQUtkLFlBQUwsQ0FBa0IsRUFBQ0ksT0FBT1UsRUFBRUMsTUFBRixDQUFTQyxLQUFqQixFQUFsQjtBQUNILGlDQUZELEVBRUcsYUFBWSw0Q0FGZjtBQURKO0FBRkoscUJBZEo7QUFzQkk7QUFBQTtBQUFBLDBCQUFLLFdBQVcsZ0JBQU9DLGVBQXZCO0FBQ0k7QUFBQTtBQUFBLDhCQUFRLFVBQVVYLFNBQWxCLEVBQTZCLFdBQWMsZ0JBQU9ZLE1BQXJCLFNBQStCLGdCQUFPaUIsVUFBbkUsRUFBaUYsU0FBUyxtQkFBTTtBQUFDRixtREFBZXJDLFFBQWYsRUFBeUJFLFFBQXpCLEVBQW1DTSxLQUFuQztBQUEyQyxpQ0FBNUk7QUFBQTtBQUFBLHlCQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFRLFVBQVVFLFNBQWxCLEVBQTZCLFdBQWMsZ0JBQU9ZLE1BQXJCLFNBQStCLGdCQUFPRSxXQUFuRSxFQUFrRixTQUFTYyxXQUEzRjtBQUFBO0FBQUE7QUFGSjtBQXRCSjtBQURKLGFBREo7QUErQkg7OztFQXBEa0IsZ0JBQU05QyxTOztBQXVEN0IsSUFBTWlDLGtCQUFrQixTQUFsQkEsZUFBa0IsUUFBUztBQUFBLDRCQUNIbEIsTUFBTTdCLFVBREg7QUFBQSxRQUN0QmdELElBRHNCLHFCQUN0QkEsSUFEc0I7QUFBQSxRQUNoQmhCLFNBRGdCLHFCQUNoQkEsU0FEZ0I7O0FBRTdCLFdBQU8sRUFBQ2dCLFVBQUQsRUFBT2hCLG9CQUFQLEVBQVA7QUFDSCxDQUhEOztBQUtBLElBQU1pQixxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLFdBQWE7QUFDcENVLHdCQUFnQix3QkFBQ3JDLFFBQUQsRUFBV0UsUUFBWCxFQUFxQk0sS0FBckIsRUFBK0I7QUFDM0MsZ0JBQU1vQixjQUFjN0IsY0FBY0MsUUFBZCxDQUFwQjtBQUNBLGdCQUFNNkIsY0FBYzVCLGNBQWNDLFFBQWQsQ0FBcEI7QUFDQSxnQkFBTXNDLGdCQUFnQk4sV0FBVzFCLEtBQVgsQ0FBdEI7QUFDQSxnQkFBR29CLFdBQUgsRUFBZTtBQUNYLGtDQUFRRSxJQUFSLENBQWFGLFdBQWI7QUFDQTtBQUNIO0FBQ0QsZ0JBQUdDLFdBQUgsRUFBZTtBQUNYLGtDQUFRQyxJQUFSLENBQWFELFdBQWI7QUFDQTtBQUNIO0FBQ0QsZ0JBQUdXLGFBQUgsRUFBaUI7QUFDYixrQ0FBUVYsSUFBUixDQUFhVSxhQUFiO0FBQ0E7QUFDSDtBQUNEVCxxQkFBUyx3QkFBZVUsUUFBZixDQUF3QixTQUF4QixFQUFtQyxFQUFDekMsa0JBQUQsRUFBV0Usa0JBQVgsRUFBcUJNLFlBQXJCLEVBQW5DLENBQVQ7QUFDSCxTQWxCbUM7QUFtQnBDOEIscUJBQWEsdUJBQU07QUFDZlAscUJBQVMsZ0NBQWNFLElBQWQsQ0FBbUIsUUFBbkIsQ0FBVDtBQUNIO0FBckJtQyxLQUFiO0FBQUEsQ0FBM0I7O2tCQXdCZSx5QkFBUVIsZUFBUixFQUF5QkUsa0JBQXpCLEVBQTZDUSxRQUE3QyxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSGY7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7O0FBUEE7OztJQVNPTyxNLG9CQUFBQSxNOztJQUVEQyxROzs7Ozs7Ozs7O2lDQUNNO0FBQ0osbUJBQ0k7QUFBQyxzQkFBRDtBQUFBLGtCQUFRLFdBQVcsaUJBQU8vQixTQUExQjtBQUNJLHVEQUFLLFdBQVcsaUJBQU9nQyxJQUF2QixHQURKO0FBRUk7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFGSjtBQUdJO0FBQUE7QUFBQSxzQkFBSyxXQUFXLGlCQUFPQyxNQUF2QixFQUErQixPQUFNLGNBQXJDLEVBQTBDLFNBQVMsS0FBS3ZELEtBQUwsQ0FBV3dELFFBQTlEO0FBQ0ksb0VBQU0sTUFBSyxRQUFYLEdBREo7QUFFSyx5QkFBS3hELEtBQUwsQ0FBV29DO0FBRmhCO0FBSEosYUFESjtBQVVIOzs7RUFaa0IsZ0JBQU1sQyxTOztBQWU3QixJQUFNaUMsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFdBQVU7QUFDOUJDLGNBQU1uQixNQUFNN0IsVUFBTixDQUFpQmdEO0FBRE8sS0FBVjtBQUFBLENBQXhCOztBQUlBLElBQU1DLHFCQUFxQixTQUFyQkEsa0JBQXFCO0FBQUEsV0FBYTtBQUNwQ21CLGtCQUFVLG9CQUFNO0FBQ1pmLHFCQUFTLHdCQUFlYyxNQUFmLENBQXNCLFNBQXRCLENBQVQ7QUFDSDtBQUhtQyxLQUFiO0FBQUEsQ0FBM0I7O2tCQU1lLHlCQUFRcEIsZUFBUixFQUF5QkUsa0JBQXpCLEVBQTZDZ0IsUUFBN0MsQzs7Ozs7Ozs7Ozs7O0FDcENmOzs7O0FBSU8sSUFBTUksd0NBQWdCLFFBQXRCO0FBQ0EsSUFBTUMsd0NBQWdCLE1BQXRCO0FBQ0EsSUFBTUMsb0NBQWMsTUFBcEI7QUFDQSxJQUFNQyw4Q0FBbUIsUUFBekI7QUFDQSxJQUFNQyw4Q0FBbUIsTUFBekI7QUFDQSxJQUFNQywwQ0FBaUIsTUFBdkI7QUFDQSxJQUFNQywwQ0FBaUIsUUFBdkI7QUFDQSxJQUFNQywwQ0FBaUIsTUFBdkI7QUFDQSxJQUFNQyxzQ0FBZSxNQUFyQjs7QUFFQSxJQUFNZCw4QkFBVyxTQUFYQSxRQUFXLENBQUNlLE1BQUQsRUFBU25ELEtBQVQsRUFBbUI7QUFDdkMsWUFBUW1ELE1BQVI7QUFDSSxhQUFLLFNBQUw7QUFDSSxtQkFBTztBQUNIQyxzQkFBTVAsZ0JBREg7QUFFSGxELDBCQUFVSyxNQUFNTCxRQUZiO0FBR0hFLDBCQUFVRyxNQUFNSCxRQUhiO0FBSUhNLHVCQUFPSCxNQUFNRztBQUpWLGFBQVA7QUFNSixhQUFLLFNBQUw7QUFDSSxtQkFBTztBQUNIaUQsc0JBQU1OLGdCQURIO0FBRUh6QixzQkFBTXJCO0FBRkgsYUFBUDtBQUlKLGFBQUssT0FBTDtBQUNJLG1CQUFPO0FBQ0hvRCxzQkFBTUwsY0FESDtBQUVITSx1QkFBT3JEO0FBRkosYUFBUDtBQWRSO0FBbUJILENBcEJNOztBQXNCQSxJQUFNMkIsd0JBQVEsU0FBUkEsS0FBUSxDQUFDd0IsTUFBRCxFQUFTbkQsS0FBVCxFQUFtQjtBQUNwQyxZQUFRbUQsTUFBUjtBQUNJLGFBQUssU0FBTDtBQUNJLG1CQUFPO0FBQ0hDLHNCQUFNVixhQURIO0FBRUgvQywwQkFBVUssTUFBTUwsUUFGYjtBQUdIRSwwQkFBVUcsTUFBTUg7QUFIYixhQUFQO0FBS0osYUFBSyxTQUFMO0FBQ0ksbUJBQU87QUFDSHVELHNCQUFNVCxhQURIO0FBRUh0QixzQkFBTXJCO0FBRkgsYUFBUDtBQUlKLGFBQUssT0FBTDtBQUNJLG1CQUFPO0FBQ0hvRCxzQkFBTVIsV0FESDtBQUVIUyx1QkFBT3JEO0FBRkosYUFBUDtBQWJSO0FBa0JILENBbkJNOztBQXFCQSxJQUFNd0MsMEJBQVMsU0FBVEEsTUFBUyxDQUFDVyxNQUFELEVBQVNuRCxLQUFULEVBQW1CO0FBQ3JDLFlBQVFtRCxNQUFSO0FBQ0ksYUFBSyxTQUFMO0FBQ0ksbUJBQU87QUFDSEMsc0JBQU1KO0FBREgsYUFBUDtBQUdKLGFBQUssU0FBTDtBQUNJLG1CQUFPO0FBQ0hJLHNCQUFNSDtBQURILGFBQVA7QUFHSixhQUFLLE9BQUw7QUFDSSxtQkFBTztBQUNIRyxzQkFBTUYsWUFESDtBQUVIRyx1QkFBT3JEO0FBRkosYUFBUDtBQVZSO0FBZUgsQ0FoQk0sQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3REUDs7OztBQUNBOztJQUFZc0QsRTs7QUFDWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQUd1QjtBQUNmQSxlQUFHQyxNQUFILE9BQWMsZUFBT2hELFNBQXJCLEVBQ0tpRCxTQURMLENBQ2UsR0FEZixFQUVLQyxJQUZMLENBRVUsT0FGVjtBQUdIOzs7aUNBRU87QUFDSixtQkFDSTtBQUFBO0FBQUEsa0JBQUssV0FBVyxlQUFPbEQsU0FBdkI7QUFDSSxxREFBRyxXQUFVLE1BQWI7QUFESixhQURKO0FBS0g7OztFQWJ3QixnQkFBTXBCLFMsR0FQbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0dBOzs7O0FBQ0E7O0lBQVltRSxFOztBQUNaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NENBR3VCO0FBQ2ZBLGVBQUdDLE1BQUgsT0FBYyxlQUFPaEQsU0FBckIsRUFDS2lELFNBREwsQ0FDZSxHQURmLEVBRUtDLElBRkwsQ0FFVSxPQUZWO0FBR0g7OztpQ0FFTztBQUNKLG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxXQUFXLGVBQU9sRCxTQUF2QjtBQUNJLHFEQUFHLFdBQVUsTUFBYjtBQURKLGFBREo7QUFLSDs7O0VBYndCLGdCQUFNcEIsUyxHQVBuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDR0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7O0FBR0ksc0JBQVlGLEtBQVosRUFBa0I7QUFBQTs7QUFBQSw4SUFDUkEsS0FEUTs7QUFFZCxjQUFLaUIsS0FBTCxHQUFhO0FBQ1R3RCx5QkFBYTtBQURKLFNBQWI7QUFGYztBQUtqQjs7OztpQ0FDTztBQUFBOztBQUFBLGdCQUNHQSxXQURILEdBQ2tCLEtBQUt4RCxLQUR2QixDQUNHd0QsV0FESDs7QUFFSixtQkFDSTtBQUFBO0FBQUE7QUFDSSwrQkFBVyxtQkFBT25ELFNBRHRCO0FBRUksaUNBQWEsdUJBQU07QUFDZiwrQkFBS04sUUFBTCxDQUFjO0FBQ1Z5RCx5Q0FBYTtBQURILHlCQUFkO0FBR0EsOERBSmUsQ0FJSztBQUN2QixxQkFQTDtBQVFJLCtCQUFXLHFCQUFNO0FBQ2IsK0JBQUt6RCxRQUFMLENBQWM7QUFDVnlELHlDQUFhO0FBREgseUJBQWQ7QUFHQSwrREFKYSxDQUlRO0FBQ3hCO0FBYkw7QUFlSTtBQUFBO0FBQUE7QUFBUyxxQkFBQ0EsV0FBRCxHQUFlLFFBQWYsR0FBMEI7QUFBbkM7QUFmSixhQURKO0FBbUJIOzs7RUE1QndCLGdCQUFNdkUsUyxHQVJuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUE7O0FBQ0E7O0FBTEE7Ozs7QUFPQSxJQUFNa0MsT0FBTyxTQUFQQSxJQUFPLEdBQWlDO0FBQUEsUUFBaENuQixLQUFnQyx1RUFBeEJ5RCxPQUFPdEMsSUFBaUI7QUFBQSxRQUFYdUMsTUFBVzs7QUFDMUMsWUFBUUEsT0FBT1IsSUFBZjtBQUNJLGFBQUssd0JBQWVULGFBQXBCO0FBQ0ksbUJBQU9pQixPQUFPdkMsSUFBUCxDQUFZMUIsUUFBbkI7QUFDSixhQUFLLHdCQUFlc0QsY0FBcEI7QUFDSSxtQkFBTyxJQUFQO0FBQ0o7QUFDSSxtQkFBTy9DLEtBQVA7QUFOUjtBQVFILENBVEQ7O0FBV0EsSUFBTUMsUUFBUSxTQUFSQSxLQUFRLEdBQWtDO0FBQUEsUUFBakNELEtBQWlDLHVFQUF6QnlELE9BQU94RCxLQUFrQjtBQUFBLFFBQVh5RCxNQUFXOztBQUM1QyxZQUFRQSxPQUFPUixJQUFmO0FBQ0ksYUFBSyx3QkFBZVQsYUFBcEI7QUFDSSxtQkFBT2lCLE9BQU92QyxJQUFQLENBQVlsQixLQUFuQjtBQUNKLGFBQUssd0JBQWU4QyxjQUFwQjtBQUNJLG1CQUFPLElBQVA7QUFDSjtBQUNJLG1CQUFPL0MsS0FBUDtBQU5SO0FBUUgsQ0FURDs7QUFXQSxJQUFNRyxZQUFZLFNBQVpBLFNBQVksR0FBMkI7QUFBQSxRQUExQkgsS0FBMEIsdUVBQWxCLEtBQWtCO0FBQUEsUUFBWDBELE1BQVc7O0FBQ3pDLFlBQVFBLE9BQU9SLElBQWY7QUFDSSxhQUFLLHdCQUFlVixhQUFwQjtBQUNBLGFBQUssd0JBQWVNLGNBQXBCO0FBQ0ksbUJBQU8sSUFBUDtBQUNKLGFBQUssd0JBQWVMLGFBQXBCO0FBQ0EsYUFBSyx3QkFBZUMsV0FBcEI7QUFDQSxhQUFLLHdCQUFlSyxjQUFwQjtBQUNBLGFBQUssd0JBQWVDLFlBQXBCO0FBQ0ksbUJBQU8sS0FBUDtBQUNKO0FBQ0ksbUJBQU9oRCxLQUFQO0FBVlI7QUFZSCxDQWJEOztBQWVBLElBQU03QixhQUFhLDRCQUFnQjtBQUMvQmdDLHdCQUQrQjtBQUUvQmdCLGNBRitCO0FBRy9CbEI7QUFIK0IsQ0FBaEIsQ0FBbkI7O2tCQU1lOUIsVTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQ2Y7O0FBQ0E7Ozs7OztzREFFVXdGLFEsR0FOVjs7Ozs7QUFNQSxTQUFVQSxRQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUNVLGtCQUFJLENBQUMsMENBQUQsQ0FBSixDQURWOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztrQkFJZUEsUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ3dGVUMsVzs7QUE5RnpCOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7c0RBU1VuQyxLO3VEQXlCQWEsTTt1REFnQkFKLFE7dURBbUJBMkIsVTt1REFPQUMsVzt1REFPQUMsYTt1REFPZUgsVyxHQWxHekI7Ozs7QUFVQUgsT0FBT08sT0FBUDtBQUNBLElBQU1DLFFBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQVEsc0JBQVksZUFBTztBQUFDQyxtQkFBV0MsR0FBWCxFQUFnQkMsSUFBaEI7QUFBdUIsS0FBM0MsQ0FBUjtBQUFBLENBQWQ7QUFDQSxJQUFNQyxXQUFjQyxTQUFTQyxNQUF2QixXQUFOO0FBQ0EsSUFBTUMsWUFBZUYsU0FBU0MsTUFBeEIsWUFBTjtBQUNBLElBQU1FLGNBQWlCSCxTQUFTQyxNQUExQixjQUFOOztBQUVBZCxPQUFPaUIsYUFBUDtBQUNBLFNBQVVqRCxLQUFWO0FBQUEsUUFBaUJoQyxRQUFqQixRQUFpQkEsUUFBakI7QUFBQSxRQUEyQkUsUUFBM0IsUUFBMkJBLFFBQTNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFFY3NFLE1BQU0sR0FBTixDQUZkOztBQUFBO0FBQUE7QUFBQSwyQkFHMkIseUNBQWlCSSxRQUFqQixFQUEyQixFQUFDTSxRQUFRLE1BQVQsRUFBaUJDLGFBQWEsa0JBQTlCLEVBQWtEQyxTQUFTLEVBQUNwRixrQkFBRCxFQUFXRSxrQkFBWCxFQUEzRCxFQUEzQixDQUgzQjs7QUFBQTtBQUdZbUYsMEJBSFo7O0FBQUEsMEJBSVdBLE9BQU9DLE9BQVAsS0FBbUIsR0FKOUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSwyQkFLa0Isa0JBQUksd0JBQWV0RCxLQUFmLENBQXFCLFNBQXJCLEVBQWdDcUQsT0FBT2pFLEtBQXZDLENBQUosQ0FMbEI7O0FBQUE7QUFNWTtBQUNJbUUsMkJBUGhCLEdBTzBCVixTQUFTVyxJQUFULENBQWNDLEtBQWQsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBaEMsS0FBc0MsSUFQaEU7O0FBUVlGLDhCQUFXQSxPQUFELEdBQVlHLG1CQUFtQkgsT0FBbkIsQ0FBWixHQUEwQyxHQUFwRDs7QUFSWix5QkFTZUEsUUFBUUksVUFBUixDQUFtQixPQUFuQixDQVRmO0FBQUE7QUFBQTtBQUFBOztBQVVnQjtBQUNBM0IsMkJBQU9hLFFBQVAsQ0FBZ0JXLElBQWhCLEdBQXVCWCxTQUFTQyxNQUFULEdBQWtCUyxPQUF6QztBQVhoQjtBQUFBOztBQUFBO0FBQUE7QUFBQSwyQkFhc0Isa0JBQUksZ0NBQWN0RCxJQUFkLENBQW1Cc0QsT0FBbkIsQ0FBSixDQWJ0Qjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFnQlksc0NBQVE3QixLQUFSLENBQWMyQixPQUFPakUsS0FBckI7QUFoQlo7QUFBQSwyQkFpQmtCLGtCQUFJLHdCQUFlWSxLQUFmLENBQXFCLE9BQXJCLEVBQThCcUQsT0FBT2pFLEtBQXJDLENBQUosQ0FqQmxCOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBb0JRLHNDQUFRc0MsS0FBUjtBQXBCUjtBQUFBLDJCQXFCYyxrQkFBSSx3QkFBZTFCLEtBQWYsQ0FBcUIsT0FBckIsY0FBSixDQXJCZDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUF5QkEsU0FBVWEsTUFBVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkJBRTZCLHlDQUFpQmtDLFNBQWpCLENBRjdCOztBQUFBO0FBRWNNLDBCQUZkOztBQUFBLDBCQUdXQSxPQUFPQyxPQUFQLElBQWtCLEdBSDdCO0FBQUE7QUFBQTtBQUFBOztBQUlZLHNDQUFRNUIsS0FBUixDQUFjMkIsT0FBT2pFLEtBQXJCO0FBSlo7QUFBQSwyQkFLa0Isa0JBQUksd0JBQWV5QixNQUFmLENBQXNCLE9BQXRCLEVBQStCd0MsT0FBT2pFLEtBQXRDLENBQUosQ0FMbEI7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwyQkFPa0Isa0JBQUksd0JBQWV5QixNQUFmLENBQXNCLFNBQXRCLENBQUosQ0FQbEI7O0FBQUE7QUFBQTtBQUFBLDJCQVFrQixrQkFBSSxnQ0FBY1osSUFBZCxDQUFtQixRQUFuQixDQUFKLENBUmxCOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBV1Esc0NBQVF5QixLQUFSO0FBWFI7QUFBQSwyQkFZYyxrQkFBSSx3QkFBZWIsTUFBZixDQUFzQixPQUF0QixlQUFKLENBWmQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBZ0JBLFNBQVVKLFFBQVY7QUFBQSxRQUFvQnpDLFFBQXBCLFNBQW9CQSxRQUFwQjtBQUFBLFFBQThCRSxRQUE5QixTQUE4QkEsUUFBOUI7QUFBQSxRQUF3Q00sS0FBeEMsU0FBd0NBLEtBQXhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFFMkIseUNBQWlCd0UsV0FBakIsRUFBOEI7QUFDN0NFLGdDQUFRLE1BRHFDO0FBRTdDQyxxQ0FBYSxrQkFGZ0M7QUFHN0NDLGlDQUFTLEVBQUNRLE1BQU01RixRQUFQLEVBQWlCRSxrQkFBakIsRUFBMkJNLFlBQTNCO0FBSG9DLHFCQUE5QixDQUYzQjs7QUFBQTtBQUVZNkUsMEJBRlo7O0FBT1Esd0JBQUlBLE9BQU9DLE9BQVAsS0FBbUIsR0FBdkIsRUFBNEI7QUFDeEIsMENBQVE1QixLQUFSLENBQWMyQixPQUFPakUsS0FBckI7QUFDSDs7QUFUVCwwQkFVWWlFLE9BQU9DLE9BQVAsS0FBbUIsR0FWL0I7QUFBQTtBQUFBO0FBQUE7O0FBV1ksc0NBQVFBLE9BQVIsQ0FBZ0JELE9BQU9qRSxLQUF2QjtBQVhaO0FBQUEsMkJBWWtCLGtCQUFJLGdDQUFjYSxJQUFkLENBQW1CLFFBQW5CLENBQUosQ0FabEI7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFlUSxzQ0FBUXlCLEtBQVI7O0FBZlI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBbUJBLFNBQVVVLFVBQVY7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsMkJBRTJDLG1CQUFLLHdCQUFlckIsYUFBcEIsQ0FGM0M7O0FBQUE7QUFBQTtBQUVlL0MsNEJBRmYsU0FFZUEsUUFGZjtBQUV5QkUsNEJBRnpCLFNBRXlCQSxRQUZ6QjtBQUFBO0FBQUEsMkJBR2MsbUJBQUs4QixLQUFMLEVBQVksRUFBQ2hDLGtCQUFELEVBQVdFLGtCQUFYLEVBQVosQ0FIZDs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT0EsU0FBVW1FLFdBQVY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsMkJBRWMsbUJBQUssd0JBQWVoQixjQUFwQixDQUZkOztBQUFBO0FBQUE7QUFBQSwyQkFHYyxtQkFBS1IsTUFBTCxDQUhkOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPQSxTQUFVeUIsYUFBVjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSwyQkFFa0QsbUJBQUssd0JBQWVwQixnQkFBcEIsQ0FGbEQ7O0FBQUE7QUFBQTtBQUVlbEQsNkJBRmYsU0FFZUEsUUFGZjtBQUV5QkUsNkJBRnpCLFNBRXlCQSxRQUZ6QjtBQUVtQ00seUJBRm5DLFNBRW1DQSxLQUZuQztBQUFBO0FBQUEsMkJBR2MsbUJBQUtpQyxRQUFMLEVBQWUsRUFBQ3pDLG1CQUFELEVBQVdFLG1CQUFYLEVBQXFCTSxZQUFyQixFQUFmLENBSGQ7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU9lLFNBQVUyRCxXQUFWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQUNMLGtCQUFJLENBQUMsbUJBQUtDLFVBQUwsQ0FBRCxFQUFtQixtQkFBS0MsV0FBTCxDQUFuQixFQUFzQyxtQkFBS0MsYUFBTCxDQUF0QyxDQUFKLENBREs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQzs7Ozs7Ozs7Ozs7OztBQy9GZjs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU11QixpQkFBaUIsMEJBQXZCLEMsQ0FYQTs7OztBQVlBLElBQU1DLGtCQUFrQixvRUFBeEI7O0FBRUEsSUFBTUMsY0FBYyxDQUFDRixjQUFELEVBQWlCQyxlQUFqQixDQUFwQjtBQUNBO0FBQ0EsSUFBRyxJQUFILEVBQXlDO0FBQ3JDQyxnQkFBWTlELElBQVosQ0FBaUIsZ0NBQWpCO0FBQ0g7O0FBRUQsSUFBTStELFFBQVEsNENBRVYsd0NBQW1CRCxXQUFuQixDQUZVLENBQWQ7QUFJQS9CLE9BQU9nQyxLQUFQLEdBQWVBLEtBQWY7QUFDQWhDLE9BQU9pQixhQUFQOztBQUVBLElBQUcsSUFBSCxFQUF1RDtBQUNuRGhHLFdBQU9DLEdBQVAsQ0FBV0MsTUFBWCxDQUFrQixFQUFsQixFQUFtQyxZQUFNO0FBQ3JDLFlBQU04RyxrQkFBa0IsbUJBQUFDLENBQVEsRUFBUixDQUF4QjtBQUNBRixjQUFNRyxjQUFOLENBQXFCRixlQUFyQjtBQUNILEtBSEQ7QUFJSDtBQUNEOztBQUVBSixlQUFlTyxHQUFmOztrQkFFZUosSzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDZjs7OztBQUlBLElBQU1LLFVBQVUsU0FBVkEsT0FBVSxDQUFDQyxHQUFELEVBQXFCO0FBQUEsUUFBZmpHLEtBQWUsdUVBQVAsRUFBTzs7QUFDakMsUUFBSTZFLFNBQVM3RSxNQUFNNkUsTUFBTixJQUFnQixLQUE3QjtBQUNBLFFBQUlxQixVQUFVO0FBQ1YseUJBQWlCLFVBRFA7QUFFVixrQkFBVTtBQUNWO0FBQ0E7QUFKVSxLQUFkOztBQU9BLFFBQUlyQixPQUFPc0IsV0FBUCxPQUF5QixLQUE3QixFQUFvQztBQUNoQyxlQUFPQyxNQUFNSCxHQUFOLEVBQVcsRUFBQ0MsZ0JBQUQsRUFBVUcsYUFBYSxTQUF2QixFQUFYLEVBQThDQyxLQUE5QyxDQUFvRCxlQUFLO0FBQzVEQyxvQkFBUUMsR0FBUixDQUFZQyxHQUFaO0FBQ0gsU0FGTSxDQUFQO0FBR0gsS0FKRCxNQUlPO0FBQ0gsWUFBSTFCLFVBQVUvRSxNQUFNK0UsT0FBTixJQUFpQixFQUEvQjtBQUNBLFlBQUlELGNBQWM5RSxNQUFNOEUsV0FBTixJQUFxQixJQUF2QztBQUNBLFlBQUcsQ0FBQ0EsV0FBSixFQUFnQjtBQUNaLGdCQUFJNEIsU0FBUyxJQUFJQyxRQUFKLEVBQWI7QUFDQSxpQkFBSSxJQUFJQyxHQUFSLElBQWU3QixPQUFmLEVBQXVCO0FBQ25CMkIsdUJBQU9HLE1BQVAsTUFBaUJELEdBQWpCLEVBQXdCN0IsUUFBUTZCLEdBQVIsQ0FBeEI7QUFDSDtBQUNELG1CQUFPUixNQUFNSCxHQUFOLEVBQVc7QUFDZHBCLHdCQUFRLE1BRE07QUFFZHdCLDZCQUFhLFNBRkM7QUFHZFMsc0JBQU1KO0FBSFEsYUFBWCxDQUFQO0FBS0g7QUFDRDNCLGtCQUFVLHlCQUFlQSxPQUFmLENBQVY7QUFDQSxlQUFPcUIsTUFBTUgsR0FBTixFQUFXO0FBQ2RwQixvQkFBUUEsTUFETTtBQUVkcUIscUJBQVM7QUFDTCxnQ0FBZ0JwQjtBQURYLGFBRks7QUFLZHVCLHlCQUFhLFNBTEM7QUFNZFMsa0JBQU0vQjtBQU5RLFNBQVgsQ0FBUDtBQVFIO0FBQ0osQ0FyQ0Q7O0FBdUNBLElBQU1nQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ2QsR0FBRCxFQUFNakcsS0FBTixFQUFnQjtBQUMvQixXQUFPZ0csUUFBUUMsR0FBUixFQUFhakcsS0FBYixFQUFvQmdILElBQXBCLENBQXlCO0FBQUEsZUFBUUMsS0FBS0MsSUFBTCxFQUFSO0FBQUEsS0FBekIsRUFBOENaLEtBQTlDLENBQW9ELGVBQU87QUFDOURDLGdCQUFRQyxHQUFSLENBQVlDLEdBQVo7QUFDSCxLQUZNLENBQVA7QUFHSCxDQUpEOztrQkFNZU0sVTs7Ozs7Ozs7Ozs7O0FDakRmOzs7QUFHQSxJQUFNSSxhQUFhO0FBQ2Y7Ozs7OztBQU1BQyxrQkFBYyxzQkFBQ0MsV0FBRCxFQUFjQyxXQUFkLEVBQTJCQyxRQUEzQixFQUF3QztBQUNsREMsa0JBQVVKLFlBQVYsR0FBeUJJLFVBQVVKLFlBQVYsSUFBMEJJLFVBQVVDLGtCQUFwQyxJQUEwREQsVUFBVUUsZUFBcEUsSUFDbEJGLFVBQVVHLGNBRFEsSUFDVWhFLE9BQU95RCxZQUQxQztBQUVBLFlBQU1RLGNBQWMsRUFBQ0MsT0FBT1IsV0FBUixFQUFxQlMsT0FBT1IsV0FBNUIsRUFBcEI7QUFDQSxZQUFJRSxVQUFVTyxZQUFWLElBQTBCUCxVQUFVTyxZQUFWLENBQXVCWCxZQUFyRCxFQUFtRTtBQUMvREksc0JBQVVPLFlBQVYsQ0FBdUJYLFlBQXZCLENBQW9DUSxXQUFwQyxFQUFpRFosSUFBakQsQ0FBc0QsVUFBQ2dCLE1BQUQsRUFBWTtBQUM5RFQseUJBQVMsS0FBVCxFQUFnQlMsTUFBaEI7QUFDSCxhQUZELEVBRUcsT0FGSCxFQUVZLFVBQVN2QixHQUFULEVBQWM7QUFDdEJjLHlCQUFTZCxHQUFUO0FBQ0gsYUFKRDtBQUtILFNBTkQsTUFNTyxJQUFJZSxVQUFVSixZQUFkLEVBQTRCO0FBQy9CSSxzQkFBVUosWUFBVixDQUF1QlEsV0FBdkIsRUFBb0Msa0JBQVU7QUFDMUNMLHlCQUFTLEtBQVQsRUFBZ0JTLE1BQWhCO0FBQ0gsYUFGRCxFQUVHLGVBQU87QUFDTlQseUJBQVNkLEdBQVQ7QUFDSCxhQUpEO0FBS0gsU0FOTSxNQU1BO0FBQ0hjLHFCQUFTLElBQUlVLEtBQUosQ0FBVSx1QkFBVixDQUFUO0FBQ0g7QUFDSixLQTFCYzs7QUE0QmY7Ozs7QUFJQUMsaUJBQWEsNkJBQVU7QUFDbkIsWUFBSSxPQUFPRixPQUFPRyxJQUFkLEtBQXVCLFVBQTNCLEVBQXVDO0FBQ25DSCxtQkFBT0csSUFBUDtBQUNILFNBRkQsTUFHSztBQUNELGdCQUFJQyxZQUFZLENBQUNKLE9BQU9LLGNBQVAsRUFBRCxFQUEwQkwsT0FBT00sY0FBUCxFQUExQixDQUFoQjs7QUFFQSxpQkFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILFVBQVVJLE1BQTlCLEVBQXNDRCxHQUF0QyxFQUEyQztBQUN2QyxvQkFBSUUsU0FBU0wsVUFBVUcsQ0FBVixDQUFiO0FBQ0Esb0JBQUlFLFVBQVVBLE9BQU9ELE1BQVAsR0FBZ0IsQ0FBOUIsRUFBaUM7QUFDN0IseUJBQUssSUFBSUUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxPQUFPRCxNQUEzQixFQUFtQ0UsR0FBbkMsRUFBd0M7QUFDcEMsNEJBQUlDLFFBQVFGLE9BQU9DLENBQVAsQ0FBWjtBQUNBLDRCQUFJLE9BQU9DLE1BQU1SLElBQWIsS0FBc0IsVUFBMUIsRUFBc0M7QUFDbENRLGtDQUFNUixJQUFOO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjtBQUNKO0FBbkRjLENBQW5COztBQXNEQTtBQUNBLElBQUlTLGlCQUFKO0FBQUEsSUFBY0Msb0JBQWQ7O0FBRUE7QUFDQSxJQUFJQyxxQkFBSjtBQUFBLElBQWtCQywyQkFBbEI7O0FBRUE7QUFDQSxJQUFJQyxlQUFlLEtBQW5COztBQUVBO0FBQ08sSUFBTUMsb0NBQWMsU0FBZEEsV0FBYyxjQUFlO0FBQ3RDRCxtQkFBZUUsV0FBZjtBQUNBL0IsZUFBV0MsWUFBWCxDQUF3QjhCLFdBQXhCLEVBQXFDLElBQXJDLEVBQTJDLFVBQUN6QyxHQUFELEVBQU11QixNQUFOLEVBQWlCO0FBQ3hELFlBQUl2QixHQUFKLEVBQVM7QUFDTCxrQkFBTUEsR0FBTjtBQUNILFNBRkQsTUFFTztBQUNIO0FBQ0FtQyx1QkFBVyxJQUFJTyxhQUFKLENBQWtCbkIsTUFBbEIsQ0FBWDtBQUNBYSwwQkFBY2IsTUFBZDtBQUNBLGdCQUFJb0IsU0FBUyxFQUFiO0FBQ0FSLHFCQUFTUyxlQUFULEdBQTJCLFVBQVN4SSxDQUFULEVBQVk7QUFDbkN1SSx1QkFBT3hILElBQVAsQ0FBWWYsRUFBRW9HLElBQWQ7QUFDSCxhQUZEO0FBR0EyQixxQkFBU1UsTUFBVCxHQUFrQixZQUFNO0FBQ3BCUiwrQkFBZSxJQUFJUyxJQUFKLENBQVNILE1BQVQsRUFBaUIsRUFBRSxRQUFTUixTQUFTWSxRQUFwQixFQUFqQixDQUFmO0FBQ0FKLHlCQUFTLEVBQVQ7QUFDQSxvQkFBSSxRQUFRTCxrQkFBWixFQUFnQztBQUM1QkE7QUFDSDtBQUNKLGFBTkQ7QUFPQUgscUJBQVNhLEtBQVQ7QUFDSDtBQUNKLEtBcEJEO0FBcUJILENBdkJNOztBQXlCUDtBQUNBLElBQU1DLGFBQWEsU0FBYkEsVUFBYSxDQUFDbkMsUUFBRCxFQUFjO0FBQzdCd0IseUJBQXFCeEIsUUFBckI7QUFDQTtBQUNBcUIsYUFBU1QsSUFBVDtBQUNBO0FBQ0FoQixlQUFXZSxXQUFYLENBQXVCVyxXQUF2QjtBQUNILENBTkQ7O0FBUUE7QUFDTyxJQUFNYyxrQ0FBYSxTQUFiQSxVQUFhLEdBQU07QUFDNUIsUUFBSTFELE1BQU0yRCxJQUFJQyxlQUFKLENBQW9CZixZQUFwQixDQUFWO0FBQ0EsUUFBSWdCLE1BQU10SyxTQUFTdUssYUFBVCxDQUF1QmYsZUFBZSxPQUFmLEdBQXlCLE9BQWhELENBQVY7QUFDQWMsUUFBSUUsUUFBSixHQUFlLElBQWY7QUFDQUYsUUFBSUcsR0FBSixHQUFVaEUsR0FBVjtBQUNBLFFBQUkrQyxZQUFKLEVBQWtCO0FBQ2RjLFlBQUlJLEtBQUosR0FBWSxHQUFaO0FBQ0FKLFlBQUlLLE1BQUosR0FBYSxHQUFiO0FBQ0FMLFlBQUlNLEtBQUosQ0FBVUMsTUFBVixHQUFtQixTQUFuQjtBQUNBUCxZQUFJTSxLQUFKLENBQVVFLFFBQVYsR0FBcUIsT0FBckI7QUFDQVIsWUFBSU0sS0FBSixDQUFVRyxJQUFWLEdBQWlCLEdBQWpCO0FBQ0FULFlBQUlNLEtBQUosQ0FBVUksS0FBVixHQUFrQixHQUFsQjtBQUNBVixZQUFJTSxLQUFKLENBQVVLLEdBQVYsR0FBZ0IsR0FBaEI7QUFDQVgsWUFBSU0sS0FBSixDQUFVTSxNQUFWLEdBQW1CLEdBQW5CO0FBQ0FaLFlBQUlNLEtBQUosQ0FBVU8sTUFBVixHQUFtQixNQUFuQjtBQUNBbkwsaUJBQVNzSCxJQUFULENBQWM4RCxXQUFkLENBQTBCZCxHQUExQjtBQUNIO0FBQ0osQ0FqQk07O0FBbUJQLElBQU1lLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBTTtBQUN6QixRQUFNQyxXQUFXLElBQUluRSxRQUFKLEVBQWpCO0FBQ0EsUUFBTW9FLFVBQVU7QUFDWmxHLGdCQUFRO0FBREksS0FBaEI7QUFHQWlHLGFBQVNqRSxNQUFULENBQWdCLE1BQWhCLEVBQXdCaUMsWUFBeEI7QUFDQWlDLFlBQVFqRSxJQUFSLEdBQWVnRSxRQUFmO0FBQ0ExRSxVQUFNLHVDQUFOLEVBQStDMkUsT0FBL0MsRUFBd0QvRCxJQUF4RCxDQUE2RDtBQUFBLGVBQU8zQyxJQUFJNkMsSUFBSixFQUFQO0FBQUEsS0FBN0QsRUFBZ0ZGLElBQWhGLENBQXFGLGVBQU87QUFDeEZULGdCQUFRQyxHQUFSLENBQVluQyxHQUFaO0FBQ0FBLGNBQU1BLElBQUksQ0FBSixLQUFVLEVBQWhCO0FBQ0EsWUFBR0EsSUFBSTJHLFFBQUosQ0FBYSxLQUFiLENBQUgsRUFBdUI7QUFDbkJySCxtQkFBT2dDLEtBQVAsQ0FBYWpFLFFBQWIsQ0FBc0JpQyxPQUFPaUIsYUFBUCxDQUFxQmhELElBQXJCLENBQTBCLFFBQTFCLENBQXRCO0FBQ0gsU0FGRCxNQUVNLElBQUd5QyxJQUFJMkcsUUFBSixDQUFhLEtBQWIsQ0FBSCxFQUF1QjtBQUN6QnJILG1CQUFPZ0MsS0FBUCxDQUFhakUsUUFBYixDQUFzQmlDLE9BQU9pQixhQUFQLENBQXFCaEQsSUFBckIsQ0FBMEIsUUFBMUIsQ0FBdEI7QUFDSDtBQUNKLEtBUkQ7QUFTSCxDQWhCRDs7QUFrQk8sSUFBTXFKLDhDQUFtQixTQUFuQkEsZ0JBQW1CLEdBQU07QUFDbENoQyxnQkFBWSxLQUFaO0FBQ0gsQ0FGTTs7QUFJQSxJQUFNaUMsZ0RBQW9CLFNBQXBCQSxpQkFBb0IsR0FBTTtBQUNuQ3hCLGVBQVdtQixjQUFYO0FBQ0gsQ0FGTSxDOzs7Ozs7QUMvSVAsa0JBQWtCLHdEOzs7Ozs7QUNBbEIsa0JBQWtCLHdEOzs7Ozs7QUNBbEI7QUFDQSx1Q0FBdUMsNEJBQTRCO0FBQ25FLHlDQUF5QztBQUN6QztBQUNBOzs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsaUJBQWlCLEVBQUU7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxnQkFBZ0I7QUFDbkY7QUFDQTtBQUNBLEdBQUcsNENBQTRDLGdDQUFnQztBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHVDQUF1QyxzQkFBc0IsRUFBRTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7Ozs7Ozs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsYUFBYTtBQUNuQyxHQUFHO0FBQ0g7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLFlBQVk7QUFDZixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsbUJBQW1CLGtDQUFrQztBQUNyRCxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxlQUFlLHVDQUF1QztBQUN0RDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGtCQUFrQix5QkFBeUIsS0FBSztBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLHdCQUF3QjtBQUN4QixnQkFBZ0I7QUFDaEIsb0JBQW9CO0FBQ3BCLHdCQUF3QjtBQUN4QixnQkFBZ0I7QUFDaEIsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMERBQTBELG9CQUFvQjtBQUM5RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDaFJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxVQUFVLEVBQUU7QUFDMUUsS0FBSztBQUNMO0FBQ0EsOERBQThELFNBQVMsRUFBRTtBQUN6RSxLQUFLO0FBQ0w7QUFDQSxDQUFDLEVBQUU7Ozs7Ozs7O0FDbkJIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFFOzs7Ozs7O0FDWEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsV0FBVztBQUN6Qzs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLGlDQUFpQztBQUM5RTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLG9EQUFvRCxXQUFXO0FBQy9ELFNBQVM7OztBQUdUOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHNEQUFzRCxpQkFBaUIsRUFBRTtBQUM1RztBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLHFCQUFxQix5QkFBeUI7O0FBRTlDO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUIsa0JBQWtCOztBQUUzQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEOztBQUV2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBLCtCQUErQixxQkFBcUI7QUFDcEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOzs7QUFHQTtBQUNBLGFBQWE7O0FBRWI7O0FBRUE7QUFDQSxhQUFhOztBQUViOztBQUVBO0FBQ0EsYUFBYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxhQUFhOztBQUViOztBQUVBO0FBQ0EsYUFBYTs7QUFFYjs7QUFFQTtBQUNBLGFBQWE7O0FBRWI7O0FBRUE7QUFD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QUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDcEZBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQixjQUFjOztBQUVuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxrQkFBa0I7QUFDbkQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0I7Ozs7Ozs7O0FDdHRCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVyxFQUFFO0FBQ3JELHdDQUF3QyxXQUFXLEVBQUU7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esc0NBQXNDO0FBQ3RDLEdBQUc7QUFDSDtBQUNBLDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7Ozs7Ozs7QUN4RkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsWUFBWSxpQkFBaUI7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMEZBQTBGOztBQUUxRjtBQUNBLHVCQUF1QjtBQUN2QixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25JQSw4Qzs7Ozs7O0FDQUEsK0M7Ozs7OztBQ0FBLDhDOzs7Ozs7QUNBQSw2Qzs7Ozs7O0FDQUEsK0M7Ozs7OztBQ0FBLCtDOzs7Ozs7QUNBQSwrQzs7Ozs7O0FDQUEsK0M7Ozs7OztBQ0FBLCtDOzs7Ozs7QUNBQSwrQzs7Ozs7O0FDQUEsK0M7Ozs7OztBQ0FBLCtDOzs7Ozs7QUNBQSwrQzs7Ozs7O0FDQUEsOEM7Ozs7OztBQ0FBLCtDOzs7Ozs7QUNBQSwrQzs7Ozs7O0FDQUEsOEM7Ozs7OztBQ0FBLCtDOzs7Ozs7QUNBQSwrQzs7Ozs7O0FDQUEsK0M7Ozs7OztBQ0FBLCtDOzs7Ozs7QUNBQSwrQzs7Ozs7O0FDQUEsOEM7Ozs7OztBQ0FBLDhDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSAxMDAwMDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiNjRkODgyM2I2M2VlYmUxZjY0NTFcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdCgpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0aG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0fSwgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyMjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImh0dHA6Ly8xMjcuMC4wLjE6MzAwMC9qcy9cIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgxMzIpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEzMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjRkODgyM2I2M2VlYmUxZjY0NTEiLCJtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImxpYlwiXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0XHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdFx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlciBcblx0XHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0XHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG5cdH0pLFxuXHRnZXRFbGVtZW50ID0gKGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW8gPSB7fTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHRcdH07XG5cdH0pKGZ1bmN0aW9uIChzdHlsZVRhcmdldCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0eWxlVGFyZ2V0KVxuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdLFxuXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vZml4VXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0SW50byA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBzdHlsZVRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXHRpZiAoIXN0eWxlVGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBzdHlsZVRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKHN0eWxlRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YXR0YWNoVGFnQXR0cnMobGlua0VsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaFRhZ0F0dHJzKGVsZW1lbnQsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlLCB0cmFuc2Zvcm1SZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICB0cmFuc2Zvcm1SZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblx0ICAgIFxuXHQgICAgaWYgKHRyYW5zZm9ybVJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHRyYW5zZm9ybVJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuIFxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0LyogSWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpe1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDApO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC9yZWFjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDEzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDQpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg1KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg4NTMpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg3MzEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXItcmVkdXgvbGliL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmFkX1BDIG9uIDIwMTgvMi82LlxyXG4gKi9cclxuaW1wb3J0ICogYXMgc2Vzc2lvbkFjdGlvbnMgZnJvbSAnLi9zZXNzaW9uQWN0aW9ucyc7XHJcblxyXG5leHBvcnQge1xyXG4gICAgc2Vzc2lvbkFjdGlvbnNcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FjdGlvbnMvaW5kZXguanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnRkL2xpYi9zdHlsZS9pbmRleC5sZXNzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgzMik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDYxKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgzMjcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC1yZWR1eC9lcy9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uLy4uL3N0eWxlL2luZGV4Lmxlc3MnKTtcblxucmVxdWlyZSgnLi9pbmRleC5sZXNzJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FudGQvbGliL21lc3NhZ2Uvc3R5bGUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzEvMjUuXHJcbiAqL1xyXG5pbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQge3JvdXRlclJlZHVjZXJ9IGZyb20gJ3JlYWN0LXJvdXRlci1yZWR1eCc7XHJcbmltcG9ydCBnZXRTZXNzaW9uIGZyb20gJy4vc2Vzc2lvblJlZHVjZXJzJztcclxuXHJcbmNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIHJvdXRpbmc6IHJvdXRlclJlZHVjZXIsXHJcbiAgICBnZXRTZXNzaW9uXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm9vdFJlZHVjZXI7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWR1Y2Vycy9pbmRleC5qcyIsIid1c2Ugc3RyaWN0Jztcbi8vIDI1LjQuMS41IE5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xuXG5mdW5jdGlvbiBQcm9taXNlQ2FwYWJpbGl0eShDKSB7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uICgkJHJlc29sdmUsICQkcmVqZWN0KSB7XG4gICAgaWYgKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiAoQykge1xuICByZXR1cm4gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbmV3LXByb21pc2UtY2FwYWJpbGl0eS5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiSGVsdmV0aWNhIE5ldWUgRm9yIE51bWJlclxcXCI7XFxuICBzcmM6IGxvY2FsKFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIpO1xcbiAgdW5pY29kZS1yYW5nZTogVSszMC0zOTtcXG59XFxuLmFudC1idG4ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgbWFyZ2luLWJvdHRvbTogMDtcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7XFxuICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICBsaW5lLWhlaWdodDogMS41O1xcbiAgcGFkZGluZzogMCAxNXB4O1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgaGVpZ2h0OiAyOHB4O1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC42NDUsIDAuMDQ1LCAwLjM1NSwgMSk7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjY1KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxufVxcbi5hbnQtYnRuID4gLmFudGljb24ge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbi5hbnQtYnRuLFxcbi5hbnQtYnRuOmFjdGl2ZSxcXG4uYW50LWJ0bjpmb2N1cyB7XFxuICBvdXRsaW5lOiAwO1xcbn1cXG4uYW50LWJ0bjpub3QoW2Rpc2FibGVkXSk6aG92ZXIge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG4uYW50LWJ0bjpub3QoW2Rpc2FibGVkXSk6YWN0aXZlIHtcXG4gIG91dGxpbmU6IDA7XFxuICB0cmFuc2l0aW9uOiBub25lO1xcbn1cXG4uYW50LWJ0bi5kaXNhYmxlZCxcXG4uYW50LWJ0bltkaXNhYmxlZF0ge1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuLmFudC1idG4uZGlzYWJsZWQgPiAqLFxcbi5hbnQtYnRuW2Rpc2FibGVkXSA+ICoge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcbi5hbnQtYnRuLWxnIHtcXG4gIHBhZGRpbmc6IDAgMTVweDtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIGhlaWdodDogMzJweDtcXG59XFxuLmFudC1idG4tc20ge1xcbiAgcGFkZGluZzogMCA3cHg7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBoZWlnaHQ6IDIycHg7XFxufVxcbi5hbnQtYnRuID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuOmhvdmVyLFxcbi5hbnQtYnRuOmZvY3VzIHtcXG4gIGNvbG9yOiAjMTA4ZWU5O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1jb2xvcjogIzEwOGVlOTtcXG59XFxuLmFudC1idG46aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG46Zm9jdXMgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG46aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG46Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG46YWN0aXZlLFxcbi5hbnQtYnRuLmFjdGl2ZSB7XFxuICBjb2xvcjogIzBlNzdjYTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXItY29sb3I6ICMwZTc3Y2E7XFxufVxcbi5hbnQtYnRuOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi5hY3RpdmUgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG46YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi5kaXNhYmxlZCxcXG4uYW50LWJ0bltkaXNhYmxlZF0sXFxuLmFudC1idG4uZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1idG5bZGlzYWJsZWRdOmhvdmVyLFxcbi5hbnQtYnRuLmRpc2FibGVkOmZvY3VzLFxcbi5hbnQtYnRuW2Rpc2FibGVkXTpmb2N1cyxcXG4uYW50LWJ0bi5kaXNhYmxlZDphY3RpdmUsXFxuLmFudC1idG5bZGlzYWJsZWRdOmFjdGl2ZSxcXG4uYW50LWJ0bi5kaXNhYmxlZC5hY3RpdmUsXFxuLmFudC1idG5bZGlzYWJsZWRdLmFjdGl2ZSB7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjI1KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmN2Y3Zjc7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxufVxcbi5hbnQtYnRuLmRpc2FibGVkID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuW2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi5kaXNhYmxlZDpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bltkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4uZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG5bZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bltkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bltkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLmRpc2FibGVkID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuW2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi5kaXNhYmxlZDpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bltkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4uZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG5bZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bltkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bltkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuOmhvdmVyLFxcbi5hbnQtYnRuOmZvY3VzLFxcbi5hbnQtYnRuOmFjdGl2ZSxcXG4uYW50LWJ0bi5hY3RpdmUge1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG59XFxuLmFudC1idG4tcHJpbWFyeSB7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMDhlZTk7XFxuICBib3JkZXItY29sb3I6ICMxMDhlZTk7XFxufVxcbi5hbnQtYnRuLXByaW1hcnkgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tcHJpbWFyeSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1wcmltYXJ5OmhvdmVyLFxcbi5hbnQtYnRuLXByaW1hcnk6Zm9jdXMge1xcbiAgY29sb3I6ICNmZmY7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDlhOWVlO1xcbiAgYm9yZGVyLWNvbG9yOiAjNDlhOWVlO1xcbn1cXG4uYW50LWJ0bi1wcmltYXJ5OmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLXByaW1hcnk6Zm9jdXMgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tcHJpbWFyeTpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1wcmltYXJ5OmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuLXByaW1hcnk6YWN0aXZlLFxcbi5hbnQtYnRuLXByaW1hcnkuYWN0aXZlIHtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzBlNzdjYTtcXG4gIGJvcmRlci1jb2xvcjogIzBlNzdjYTtcXG59XFxuLmFudC1idG4tcHJpbWFyeTphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tcHJpbWFyeS5hY3RpdmUgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tcHJpbWFyeTphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tcHJpbWFyeS5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZCxcXG4uYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXSxcXG4uYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkOmhvdmVyLFxcbi5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmhvdmVyLFxcbi5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQ6Zm9jdXMsXFxuLmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF06Zm9jdXMsXFxuLmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZDphY3RpdmUsXFxuLmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF06YWN0aXZlLFxcbi5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQuYWN0aXZlLFxcbi5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdLmFjdGl2ZSB7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjI1KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmN2Y3Zjc7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxufVxcbi5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZDpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXTpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQ6YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXS5hY3RpdmUgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZCA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF06Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQuYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1ncm91cCAuYW50LWJ0bi1wcmltYXJ5Om5vdCg6Zmlyc3QtY2hpbGQpOm5vdCg6bGFzdC1jaGlsZCkge1xcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiAjMGU3N2NhO1xcbiAgYm9yZGVyLWxlZnQtY29sb3I6ICMwZTc3Y2E7XFxufVxcbi5hbnQtYnRuLWdyb3VwIC5hbnQtYnRuLXByaW1hcnk6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKTpkaXNhYmxlZCB7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxufVxcbi5hbnQtYnRuLWdyb3VwIC5hbnQtYnRuLXByaW1hcnk6Zmlyc3QtY2hpbGQ6bm90KDpsYXN0LWNoaWxkKSB7XFxuICBib3JkZXItcmlnaHQtY29sb3I6ICMwZTc3Y2E7XFxufVxcbi5hbnQtYnRuLWdyb3VwIC5hbnQtYnRuLXByaW1hcnk6Zmlyc3QtY2hpbGQ6bm90KDpsYXN0LWNoaWxkKVtkaXNhYmxlZF0ge1xcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LWJ0bi1ncm91cCAuYW50LWJ0bi1wcmltYXJ5Omxhc3QtY2hpbGQ6bm90KDpmaXJzdC1jaGlsZCksXFxuLmFudC1idG4tZ3JvdXAgLmFudC1idG4tcHJpbWFyeSArIC5hbnQtYnRuLXByaW1hcnkge1xcbiAgYm9yZGVyLWxlZnQtY29sb3I6ICMwZTc3Y2E7XFxufVxcbi5hbnQtYnRuLWdyb3VwIC5hbnQtYnRuLXByaW1hcnk6bGFzdC1jaGlsZDpub3QoOmZpcnN0LWNoaWxkKVtkaXNhYmxlZF0sXFxuLmFudC1idG4tZ3JvdXAgLmFudC1idG4tcHJpbWFyeSArIC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdIHtcXG4gIGJvcmRlci1sZWZ0LWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LWJ0bi1naG9zdCB7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjY1KTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LWJ0bi1naG9zdCA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1naG9zdCA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1naG9zdDpob3ZlcixcXG4uYW50LWJ0bi1naG9zdDpmb2N1cyB7XFxuICBjb2xvcjogIzEwOGVlOTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWNvbG9yOiAjMTA4ZWU5O1xcbn1cXG4uYW50LWJ0bi1naG9zdDpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1naG9zdDpmb2N1cyA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1naG9zdDpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1naG9zdDpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1naG9zdDphY3RpdmUsXFxuLmFudC1idG4tZ2hvc3QuYWN0aXZlIHtcXG4gIGNvbG9yOiAjMGU3N2NhO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItY29sb3I6ICMwZTc3Y2E7XFxufVxcbi5hbnQtYnRuLWdob3N0OmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1naG9zdC5hY3RpdmUgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tZ2hvc3Q6YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWdob3N0LmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1naG9zdC5kaXNhYmxlZCxcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF0sXFxuLmFudC1idG4tZ2hvc3QuZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1idG4tZ2hvc3RbZGlzYWJsZWRdOmhvdmVyLFxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkOmZvY3VzLFxcbi5hbnQtYnRuLWdob3N0W2Rpc2FibGVkXTpmb2N1cyxcXG4uYW50LWJ0bi1naG9zdC5kaXNhYmxlZDphY3RpdmUsXFxuLmFudC1idG4tZ2hvc3RbZGlzYWJsZWRdOmFjdGl2ZSxcXG4uYW50LWJ0bi1naG9zdC5kaXNhYmxlZC5hY3RpdmUsXFxuLmFudC1idG4tZ2hvc3RbZGlzYWJsZWRdLmFjdGl2ZSB7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjI1KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmN2Y3Zjc7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxufVxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWdob3N0W2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1naG9zdC5kaXNhYmxlZDpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZ2hvc3QuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZ2hvc3RbZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWdob3N0W2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1naG9zdC5kaXNhYmxlZDpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZ2hvc3QuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZ2hvc3RbZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWdob3N0LmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1naG9zdFtkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuLWRhc2hlZCB7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjY1KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxuICBib3JkZXItc3R5bGU6IGRhc2hlZDtcXG59XFxuLmFudC1idG4tZGFzaGVkID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWRhc2hlZCA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1kYXNoZWQ6aG92ZXIsXFxuLmFudC1idG4tZGFzaGVkOmZvY3VzIHtcXG4gIGNvbG9yOiAjMTA4ZWU5O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1jb2xvcjogIzEwOGVlOTtcXG59XFxuLmFudC1idG4tZGFzaGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhc2hlZDpmb2N1cyA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1kYXNoZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFzaGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuLWRhc2hlZDphY3RpdmUsXFxuLmFudC1idG4tZGFzaGVkLmFjdGl2ZSB7XFxuICBjb2xvcjogIzBlNzdjYTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXItY29sb3I6ICMwZTc3Y2E7XFxufVxcbi5hbnQtYnRuLWRhc2hlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFzaGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1kYXNoZWQ6YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhc2hlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF0sXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkOmhvdmVyLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF06aG92ZXIsXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkOmZvY3VzLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF06Zm9jdXMsXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkOmFjdGl2ZSxcXG4uYW50LWJ0bi1kYXNoZWRbZGlzYWJsZWRdOmFjdGl2ZSxcXG4uYW50LWJ0bi1kYXNoZWQuZGlzYWJsZWQuYWN0aXZlLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF0uYWN0aXZlIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMjUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmNztcXG4gIGJvcmRlci1jb2xvcjogI2Q5ZDlkOTtcXG59XFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF06Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1kYXNoZWRbZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1kYXNoZWQuZGlzYWJsZWQuYWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhc2hlZFtkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWRhc2hlZC5kaXNhYmxlZCA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYXNoZWRbZGlzYWJsZWRdID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhc2hlZC5kaXNhYmxlZDpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYXNoZWRbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhc2hlZC5kaXNhYmxlZDpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYXNoZWRbZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhc2hlZC5kaXNhYmxlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFzaGVkW2Rpc2FibGVkXTphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFzaGVkLmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYXNoZWRbZGlzYWJsZWRdLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1kYW5nZXIge1xcbiAgY29sb3I6ICNmMDQxMzQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LWJ0bi1kYW5nZXIgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tZGFuZ2VyID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuLWRhbmdlcjpob3ZlcixcXG4uYW50LWJ0bi1kYW5nZXI6Zm9jdXMge1xcbiAgY29sb3I6ICNmZmY7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjA0MTM0O1xcbiAgYm9yZGVyLWNvbG9yOiAjZjA0MTM0O1xcbn1cXG4uYW50LWJ0bi1kYW5nZXI6aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFuZ2VyOmZvY3VzID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWRhbmdlcjpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYW5nZXI6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG4tZGFuZ2VyOmFjdGl2ZSxcXG4uYW50LWJ0bi1kYW5nZXIuYWN0aXZlIHtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q3MzQzNTtcXG4gIGJvcmRlci1jb2xvcjogI2Q3MzQzNTtcXG59XFxuLmFudC1idG4tZGFuZ2VyOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1kYW5nZXIuYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWRhbmdlcjphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFuZ2VyLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXSxcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTpob3ZlcixcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6Zm9jdXMsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTpmb2N1cyxcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6YWN0aXZlLFxcbi5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06YWN0aXZlLFxcbi5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZC5hY3RpdmUsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXS5hY3RpdmUge1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTpmb2N1cyA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXS5hY3RpdmUgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tZGFuZ2VyLmRpc2FibGVkID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFuZ2VyLmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFuZ2VyLmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tZGFuZ2VyLmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYW5nZXJbZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQuYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtYnRuLWNpcmNsZSxcXG4uYW50LWJ0bi1jaXJjbGUtb3V0bGluZSB7XFxuICB3aWR0aDogMjhweDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBoZWlnaHQ6IDI4cHg7XFxufVxcbi5hbnQtYnRuLWNpcmNsZS5hbnQtYnRuLWxnLFxcbi5hbnQtYnRuLWNpcmNsZS1vdXRsaW5lLmFudC1idG4tbGcge1xcbiAgd2lkdGg6IDMycHg7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgaGVpZ2h0OiAzMnB4O1xcbn1cXG4uYW50LWJ0bi1jaXJjbGUuYW50LWJ0bi1zbSxcXG4uYW50LWJ0bi1jaXJjbGUtb3V0bGluZS5hbnQtYnRuLXNtIHtcXG4gIHdpZHRoOiAyMnB4O1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGhlaWdodDogMjJweDtcXG59XFxuLmFudC1idG46YmVmb3JlIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogLTFweDtcXG4gIGxlZnQ6IC0xcHg7XFxuICBib3R0b206IC0xcHg7XFxuICByaWdodDogLTFweDtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBvcGFjaXR5OiAwLjM1O1xcbiAgY29udGVudDogJyc7XFxuICBib3JkZXItcmFkaXVzOiBpbmhlcml0O1xcbiAgei1pbmRleDogMTtcXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjJzO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG4uYW50LWJ0biAuYW50aWNvbiB7XFxuICB0cmFuc2l0aW9uOiBtYXJnaW4tbGVmdCAwLjNzIGN1YmljLWJlemllcigwLjY0NSwgMC4wNDUsIDAuMzU1LCAxKTtcXG59XFxuLmFudC1idG4uYW50LWJ0bi1sb2FkaW5nOmJlZm9yZSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuLmFudC1idG4uYW50LWJ0bi1sb2FkaW5nOm5vdCguYW50LWJ0bi1jaXJjbGUpOm5vdCguYW50LWJ0bi1jaXJjbGUtb3V0bGluZSkge1xcbiAgcGFkZGluZy1sZWZ0OiAyOXB4O1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi5hbnQtYnRuLmFudC1idG4tbG9hZGluZzpub3QoLmFudC1idG4tY2lyY2xlKTpub3QoLmFudC1idG4tY2lyY2xlLW91dGxpbmUpIC5hbnRpY29uIHtcXG4gIG1hcmdpbi1sZWZ0OiAtMTRweDtcXG59XFxuLmFudC1idG4tc20uYW50LWJ0bi1sb2FkaW5nOm5vdCguYW50LWJ0bi1jaXJjbGUpOm5vdCguYW50LWJ0bi1jaXJjbGUtb3V0bGluZSkge1xcbiAgcGFkZGluZy1sZWZ0OiAyNHB4O1xcbn1cXG4uYW50LWJ0bi1zbS5hbnQtYnRuLWxvYWRpbmc6bm90KC5hbnQtYnRuLWNpcmNsZSk6bm90KC5hbnQtYnRuLWNpcmNsZS1vdXRsaW5lKSAuYW50aWNvbiB7XFxuICBtYXJnaW4tbGVmdDogLTE3cHg7XFxufVxcbi5hbnQtYnRuLWdyb3VwIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0biB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiAxO1xcbn1cXG4uYW50LWJ0bi1ncm91cCA+IC5hbnQtYnRuOmhvdmVyLFxcbi5hbnQtYnRuLWdyb3VwID4gLmFudC1idG46Zm9jdXMsXFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0bjphY3RpdmUsXFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0bi5hY3RpdmUge1xcbiAgei1pbmRleDogMjtcXG59XFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0bjpkaXNhYmxlZCB7XFxuICB6LWluZGV4OiAwO1xcbn1cXG4uYW50LWJ0bi1ncm91cC1sZyA+IC5hbnQtYnRuIHtcXG4gIHBhZGRpbmc6IDAgMTVweDtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIGhlaWdodDogMzJweDtcXG59XFxuLmFudC1idG4tZ3JvdXAtc20gPiAuYW50LWJ0biB7XFxuICBwYWRkaW5nOiAwIDdweDtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIGhlaWdodDogMjJweDtcXG59XFxuLmFudC1idG4tZ3JvdXAtc20gPiAuYW50LWJ0biA+IC5hbnRpY29uIHtcXG4gIGZvbnQtc2l6ZTogMTJweDtcXG59XFxuLmFudC1idG4tZ3JvdXAgLmFudC1idG4gKyAuYW50LWJ0bixcXG4uYW50LWJ0biArIC5hbnQtYnRuLWdyb3VwLFxcbi5hbnQtYnRuLWdyb3VwICsgLmFudC1idG4sXFxuLmFudC1idG4tZ3JvdXAgKyAuYW50LWJ0bi1ncm91cCB7XFxuICBtYXJnaW4tbGVmdDogLTFweDtcXG59XFxuLmFudC1idG4tZ3JvdXAgLmFudC1idG46bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XFxuICBib3JkZXItcmFkaXVzOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiA4cHg7XFxuICBwYWRkaW5nLXJpZ2h0OiA4cHg7XFxufVxcbi5hbnQtYnRuLWdyb3VwID4gLmFudC1idG46Zmlyc3QtY2hpbGQge1xcbiAgbWFyZ2luLWxlZnQ6IDA7XFxufVxcbi5hbnQtYnRuLWdyb3VwID4gLmFudC1idG46Zmlyc3QtY2hpbGQ6bm90KDpsYXN0LWNoaWxkKSB7XFxuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcXG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xcbiAgcGFkZGluZy1yaWdodDogOHB4O1xcbn1cXG4uYW50LWJ0bi1ncm91cCA+IC5hbnQtYnRuOmxhc3QtY2hpbGQ6bm90KDpmaXJzdC1jaGlsZCkge1xcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcXG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XFxuICBwYWRkaW5nLWxlZnQ6IDhweDtcXG59XFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0bi1ncm91cCB7XFxuICBmbG9hdDogbGVmdDtcXG59XFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0bi1ncm91cDpub3QoOmZpcnN0LWNoaWxkKTpub3QoOmxhc3QtY2hpbGQpID4gLmFudC1idG4ge1xcbiAgYm9yZGVyLXJhZGl1czogMDtcXG59XFxuLmFudC1idG4tZ3JvdXAgPiAuYW50LWJ0bi1ncm91cDpmaXJzdC1jaGlsZDpub3QoOmxhc3QtY2hpbGQpID4gLmFudC1idG46bGFzdC1jaGlsZCB7XFxuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcXG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xcbiAgcGFkZGluZy1yaWdodDogOHB4O1xcbn1cXG4uYW50LWJ0bi1ncm91cCA+IC5hbnQtYnRuLWdyb3VwOmxhc3QtY2hpbGQ6bm90KDpmaXJzdC1jaGlsZCkgPiAuYW50LWJ0bjpmaXJzdC1jaGlsZCB7XFxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcXG4gIHBhZGRpbmctbGVmdDogOHB4O1xcbn1cXG4uYW50LWJ0bjpub3QoLmFudC1idG4tY2lyY2xlKTpub3QoLmFudC1idG4tY2lyY2xlLW91dGxpbmUpLmFudC1idG4taWNvbi1vbmx5IHtcXG4gIHBhZGRpbmctbGVmdDogOHB4O1xcbiAgcGFkZGluZy1yaWdodDogOHB4O1xcbn1cXG4uYW50LWJ0bjpmb2N1cyA+IHNwYW4sXFxuLmFudC1idG46YWN0aXZlID4gc3BhbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi5hbnQtYnRuID4gLmFudGljb24gKyBzcGFuLFxcbi5hbnQtYnRuID4gc3BhbiArIC5hbnRpY29uIHtcXG4gIG1hcmdpbi1sZWZ0OiAwLjVlbTtcXG59XFxuLmFudC1idG4tY2xpY2tlZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogLTFweDtcXG4gIGxlZnQ6IC0xcHg7XFxuICBib3R0b206IC0xcHg7XFxuICByaWdodDogLTFweDtcXG4gIGJvcmRlci1yYWRpdXM6IGluaGVyaXQ7XFxuICBib3JkZXI6IDAgc29saWQgIzEwOGVlOTtcXG4gIG9wYWNpdHk6IDAuNDtcXG4gIGFuaW1hdGlvbjogYnV0dG9uRWZmZWN0IC40cztcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG4uYW50LWJ0bi1kYW5nZXIuYW50LWJ0bi1jbGlja2VkOmFmdGVyIHtcXG4gIGJvcmRlci1jb2xvcjogI2YwNDEzNDtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdCB7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCFpbXBvcnRhbnQ7XFxuICBib3JkZXItY29sb3I6ICNmZmY7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkge1xcbiAgY29sb3I6ICMxMDhlZTk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogIzEwOGVlOTtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6aG92ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6Zm9jdXMge1xcbiAgY29sb3I6ICM0OWE5ZWU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogIzQ5YTllZTtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6Zm9jdXMgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnk6YWN0aXZlLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5LmFjdGl2ZSB7XFxuICBjb2xvcjogIzBlNzdjYTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWNvbG9yOiAjMGU3N2NhO1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeTphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkuYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5OmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkOmhvdmVyLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXTpob3ZlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZDpmb2N1cyxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF06Zm9jdXMsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQ6YWN0aXZlLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXTphY3RpdmUsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQuYWN0aXZlLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXS5hY3RpdmUge1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZCA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXTpmb2N1cyA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdLmFjdGl2ZSA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZCA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeVtkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnkuZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5LmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1wcmltYXJ5W2Rpc2FibGVkXTpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tcHJpbWFyeS5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLXByaW1hcnlbZGlzYWJsZWRdLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyIHtcXG4gIGNvbG9yOiAjZjA0MTM0O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItY29sb3I6ICNmMDQxMzQ7XFxufVxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXIgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlciA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyOmhvdmVyLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXI6Zm9jdXMge1xcbiAgY29sb3I6ICNmNDZlNjU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogI2Y0NmU2NTtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcjpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyOmZvY3VzID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXI6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcjpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyOmFjdGl2ZSxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmFjdGl2ZSB7XFxuICBjb2xvcjogI2Q3MzQzNTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDczNDM1O1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmFjdGl2ZSA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmRpc2FibGVkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXJbZGlzYWJsZWRdLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06aG92ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZDpmb2N1cyxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTpmb2N1cyxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmRpc2FibGVkOmFjdGl2ZSxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTphY3RpdmUsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZC5hY3RpdmUsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF0uYWN0aXZlIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMjUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmNztcXG4gIGJvcmRlci1jb2xvcjogI2Q5ZDlkOTtcXG59XFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZCA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZCxcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXJbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQuYWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXJbZGlzYWJsZWRdLmFjdGl2ZSA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmRpc2FibGVkID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXJbZGlzYWJsZWRdID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtYnRuLWJhY2tncm91bmQtZ2hvc3QuYW50LWJ0bi1kYW5nZXIuZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZDpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyLmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LWJ0bi1iYWNrZ3JvdW5kLWdob3N0LmFudC1idG4tZGFuZ2VyW2Rpc2FibGVkXTphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlci5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1idG4tYmFja2dyb3VuZC1naG9zdC5hbnQtYnRuLWRhbmdlcltkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbkBrZXlmcmFtZXMgYnV0dG9uRWZmZWN0IHtcXG4gIHRvIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdG9wOiAtNnB4O1xcbiAgICBsZWZ0OiAtNnB4O1xcbiAgICBib3R0b206IC02cHg7XFxuICAgIHJpZ2h0OiAtNnB4O1xcbiAgICBib3JkZXItd2lkdGg6IDZweDtcXG4gIH1cXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vfi9hbnRkL2xpYi9idXR0b24vc3R5bGUvaW5kZXgubGVzc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiSGVsdmV0aWNhIE5ldWUgRm9yIE51bWJlclxcXCI7XFxuICBzcmM6IGxvY2FsKFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIpO1xcbiAgdW5pY29kZS1yYW5nZTogVSszMC0zOTtcXG59XFxuLmFudC1pbnB1dC1zZWFyY2gtaWNvbiB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICB0cmFuc2l0aW9uOiBhbGwgLjNzO1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbn1cXG4uYW50LWlucHV0LXNlYXJjaC1pY29uOmhvdmVyIHtcXG4gIGNvbG9yOiAjMTA4ZWU5O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dC13cmFwcGVyIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1pbnB1dC1ncm91cCAuYW50LWlucHV0OmZpcnN0LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1pbnB1dC1ncm91cCAuYW50LXNlbGVjdDpmaXJzdC1jaGlsZCB7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IC0xcHg7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LWlucHV0LWdyb3VwIC5hbnQtaW5wdXQ6Zmlyc3QtY2hpbGQge1xcbiAgcGFkZGluZy1yaWdodDogMzZweDtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNjUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1jb2xvcjogI2Q5ZDlkOTtcXG4gIGJvcmRlci1yYWRpdXM6IDAgM3B4IDNweCAwO1xcbiAgbGVmdDogLTFweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJvcmRlci13aWR0aDogMCAwIDAgMXB4O1xcbiAgei1pbmRleDogMjtcXG4gIHBhZGRpbmctbGVmdDogOHB4O1xcbiAgcGFkZGluZy1yaWdodDogOHB4O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4gPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bjpob3ZlcixcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG46Zm9jdXMge1xcbiAgY29sb3I6ICMxMDhlZTk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgYm9yZGVyLWNvbG9yOiAjMTA4ZWU5O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG46aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuOmZvY3VzID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bjpob3ZlciA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG46Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuOmFjdGl2ZSxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uYWN0aXZlIHtcXG4gIGNvbG9yOiAjMGU3N2NhO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1jb2xvcjogIzBlNzdjYTtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bjphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXSxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXTpob3ZlcixcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQ6Zm9jdXMsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXTpmb2N1cyxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQ6YWN0aXZlLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bltkaXNhYmxlZF06YWN0aXZlLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bi5kaXNhYmxlZC5hY3RpdmUsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXS5hY3RpdmUge1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXTpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXTpmb2N1cyA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQ6YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bltkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bi5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuW2Rpc2FibGVkXS5hY3RpdmUgPiBhOm9ubHktY2hpbGQge1xcbiAgY29sb3I6IGN1cnJlbnRDb2xvcjtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuLmRpc2FibGVkID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bltkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuLmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bltkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuLmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bltkaXNhYmxlZF06Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuLmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG5bZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uZGlzYWJsZWQuYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bltkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bjpob3ZlcixcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG46Zm9jdXMsXFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWFyY2gtYnRuOmFjdGl2ZSxcXG4uYW50LXNlYXJjaC1pbnB1dCAuYW50LXNlYXJjaC1idG4uYWN0aXZlIHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0IC5hbnQtc2VhcmNoLWJ0bjpob3ZlciB7XFxuICBib3JkZXItY29sb3I6ICNkOWQ5ZDk7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHksXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkge1xcbiAgY29sb3I6ICNmZmY7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTA4ZWU5O1xcbiAgYm9yZGVyLWNvbG9yOiAjMTA4ZWU5O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5ID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5ID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTpob3ZlcixcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTpob3ZlcixcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5OmZvY3VzLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5OmZvY3VzIHtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQ5YTllZTtcXG4gIGJvcmRlci1jb2xvcjogIzQ5YTllZTtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5OmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5OmZvY3VzID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHk6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHk6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTpmb2N1cyA+IGE6b25seS1jaGlsZDphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5OmFjdGl2ZSxcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTphY3RpdmUsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eS5hY3RpdmUsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuYWN0aXZlIHtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzBlNzdjYTtcXG4gIGJvcmRlci1jb2xvcjogIzBlNzdjYTtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHk6YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuYWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmFjdGl2ZSA+IGE6b25seS1jaGlsZCB7XFxuICBjb2xvcjogY3VycmVudENvbG9yO1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5OmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eTphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eS5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF0sXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6aG92ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF06aG92ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmhvdmVyLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6Zm9jdXMsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6Zm9jdXMsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF06Zm9jdXMsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmZvY3VzLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6YWN0aXZlLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmFjdGl2ZSxcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXTphY3RpdmUsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmFjdGl2ZSxcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkLmFjdGl2ZSxcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eS5kaXNhYmxlZC5hY3RpdmUsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF0uYWN0aXZlLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXS5hY3RpdmUge1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xcbiAgYm9yZGVyLWNvbG9yOiAjZDlkOWQ5O1xcbn1cXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXSA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXTpob3ZlciA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXTpmb2N1cyA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eS5kaXNhYmxlZDphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF06YWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXTphY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eS5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQuYWN0aXZlID4gYTpvbmx5LWNoaWxkLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdLmFjdGl2ZSA+IGE6b25seS1jaGlsZCxcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkIHtcXG4gIGNvbG9yOiBjdXJyZW50Q29sb3I7XFxufVxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF0gPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF06aG92ZXIgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmhvdmVyID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF06Zm9jdXMgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmZvY3VzID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0LmFudC1zZWFyY2gtaW5wdXQtZm9jdXMgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHkuZGlzYWJsZWQ6YWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXTphY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQ6aG92ZXIgLmFudC1zZWFyY2gtYnRuLW5vZW1wdHlbZGlzYWJsZWRdOmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dC5hbnQtc2VhcmNoLWlucHV0LWZvY3VzIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5LmRpc2FibGVkLmFjdGl2ZSA+IGE6b25seS1jaGlsZDphZnRlcixcXG4uYW50LXNlYXJjaC1pbnB1dDpob3ZlciAuYW50LXNlYXJjaC1idG4tbm9lbXB0eS5kaXNhYmxlZC5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIsXFxuLmFudC1zZWFyY2gtaW5wdXQuYW50LXNlYXJjaC1pbnB1dC1mb2N1cyAuYW50LXNlYXJjaC1idG4tbm9lbXB0eVtkaXNhYmxlZF0uYWN0aXZlID4gYTpvbmx5LWNoaWxkOmFmdGVyLFxcbi5hbnQtc2VhcmNoLWlucHV0OmhvdmVyIC5hbnQtc2VhcmNoLWJ0bi1ub2VtcHR5W2Rpc2FibGVkXS5hY3RpdmUgPiBhOm9ubHktY2hpbGQ6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuLmFudC1zZWFyY2gtaW5wdXQgLmFudC1zZWxlY3QtY29tYm9ib3ggLmFudC1zZWxlY3Qtc2VsZWN0aW9uX19yZW5kZXJlZCB7XFxuICBtYXJnaW4tcmlnaHQ6IDI5cHg7XFxufVxcbi5hbnQtaW5wdXQge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcGFkZGluZzogNHB4IDdweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAyOHB4O1xcbiAgY3Vyc29yOiB0ZXh0O1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNjUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZDlkOWQ5O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgdHJhbnNpdGlvbjogYWxsIC4zcztcXG59XFxuLmFudC1pbnB1dDo6LW1vei1wbGFjZWhvbGRlciB7XFxuICBjb2xvcjogI2NjYztcXG4gIG9wYWNpdHk6IDE7XFxufVxcbi5hbnQtaW5wdXQ6LW1zLWlucHV0LXBsYWNlaG9sZGVyIHtcXG4gIGNvbG9yOiAjY2NjO1xcbn1cXG4uYW50LWlucHV0Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyIHtcXG4gIGNvbG9yOiAjY2NjO1xcbn1cXG4uYW50LWlucHV0OmhvdmVyIHtcXG4gIGJvcmRlci1jb2xvcjogIzQ5YTllZTtcXG59XFxuLmFudC1pbnB1dDpmb2N1cyB7XFxuICBib3JkZXItY29sb3I6ICM0OWE5ZWU7XFxuICBvdXRsaW5lOiAwO1xcbiAgYm94LXNoYWRvdzogMCAwIDAgMnB4IHJnYmEoMTYsIDE0MiwgMjMzLCAwLjIpO1xcbn1cXG4uYW50LWlucHV0W2Rpc2FibGVkXSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xcbiAgb3BhY2l0eTogMTtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjI1KTtcXG59XFxuLmFudC1pbnB1dFtkaXNhYmxlZF06aG92ZXIge1xcbiAgYm9yZGVyLWNvbG9yOiAjZTJlMmUyO1xcbn1cXG50ZXh0YXJlYS5hbnQtaW5wdXQge1xcbiAgbWF4LXdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBhdXRvO1xcbiAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcXG59XFxuLmFudC1pbnB1dC1sZyB7XFxuICBwYWRkaW5nOiA2cHggN3B4O1xcbiAgaGVpZ2h0OiAzMnB4O1xcbn1cXG4uYW50LWlucHV0LXNtIHtcXG4gIHBhZGRpbmc6IDFweCA3cHg7XFxuICBoZWlnaHQ6IDIycHg7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogdGFibGU7XFxuICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlO1xcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuLmFudC1pbnB1dC1ncm91cFtjbGFzcyo9XFxcImNvbC1cXFwiXSB7XFxuICBmbG9hdDogbm9uZTtcXG4gIHBhZGRpbmctbGVmdDogMDtcXG4gIHBhZGRpbmctcmlnaHQ6IDA7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAgPiBbY2xhc3MqPVxcXCJjb2wtXFxcIl0ge1xcbiAgcGFkZGluZy1yaWdodDogOHB4O1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uLFxcbi5hbnQtaW5wdXQtZ3JvdXAtd3JhcCxcXG4uYW50LWlucHV0LWdyb3VwID4gLmFudC1pbnB1dCB7XFxuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uOm5vdCg6Zmlyc3QtY2hpbGQpOm5vdCg6bGFzdC1jaGlsZCksXFxuLmFudC1pbnB1dC1ncm91cC13cmFwOm5vdCg6Zmlyc3QtY2hpbGQpOm5vdCg6bGFzdC1jaGlsZCksXFxuLmFudC1pbnB1dC1ncm91cCA+IC5hbnQtaW5wdXQ6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XFxuICBib3JkZXItcmFkaXVzOiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uLFxcbi5hbnQtaW5wdXQtZ3JvdXAtd3JhcCB7XFxuICB3aWR0aDogMXB4O1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAtd3JhcCA+ICoge1xcbiAgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcXG59XFxuLmFudC1pbnB1dC1ncm91cCAuYW50LWlucHV0IHtcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBtYXJnaW4tYm90dG9tOiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uIHtcXG4gIHBhZGRpbmc6IDRweCA3cHg7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjY1KTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZDlkOWQ5O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdHJhbnNpdGlvbjogYWxsIC4zcztcXG59XFxuLmFudC1pbnB1dC1ncm91cC1hZGRvbiAuYW50LXNlbGVjdCB7XFxuICBtYXJnaW46IC01cHggLTdweDtcXG59XFxuLmFudC1pbnB1dC1ncm91cC1hZGRvbiAuYW50LXNlbGVjdCAuYW50LXNlbGVjdC1zZWxlY3Rpb24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdDtcXG4gIG1hcmdpbjogLTFweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm94LXNoYWRvdzogbm9uZTtcXG59XFxuLmFudC1pbnB1dC1ncm91cC1hZGRvbiAuYW50LXNlbGVjdC1vcGVuIC5hbnQtc2VsZWN0LXNlbGVjdGlvbixcXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uIC5hbnQtc2VsZWN0LWZvY3VzZWQgLmFudC1zZWxlY3Qtc2VsZWN0aW9uIHtcXG4gIGNvbG9yOiAjMTA4ZWU5O1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uID4gaTpvbmx5LWNoaWxkOmFmdGVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYm90dG9tOiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwID4gLmFudC1pbnB1dDpmaXJzdC1jaGlsZCxcXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uOmZpcnN0LWNoaWxkIHtcXG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAgPiAuYW50LWlucHV0OmZpcnN0LWNoaWxkIC5hbnQtc2VsZWN0IC5hbnQtc2VsZWN0LXNlbGVjdGlvbixcXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uOmZpcnN0LWNoaWxkIC5hbnQtc2VsZWN0IC5hbnQtc2VsZWN0LXNlbGVjdGlvbiB7XFxuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcXG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwID4gLmFudC1pbnB1dC1hZmZpeC13cmFwcGVyOm5vdCg6Zmlyc3QtY2hpbGQpIC5hbnQtaW5wdXQge1xcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcXG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAgPiAuYW50LWlucHV0LWFmZml4LXdyYXBwZXI6bm90KDpsYXN0LWNoaWxkKSAuYW50LWlucHV0IHtcXG4gIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAtYWRkb246Zmlyc3QtY2hpbGQge1xcbiAgYm9yZGVyLXJpZ2h0OiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uOmxhc3QtY2hpbGQge1xcbiAgYm9yZGVyLWxlZnQ6IDA7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAgPiAuYW50LWlucHV0Omxhc3QtY2hpbGQsXFxuLmFudC1pbnB1dC1ncm91cC1hZGRvbjpsYXN0LWNoaWxkIHtcXG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwID4gLmFudC1pbnB1dDpsYXN0LWNoaWxkIC5hbnQtc2VsZWN0IC5hbnQtc2VsZWN0LXNlbGVjdGlvbixcXG4uYW50LWlucHV0LWdyb3VwLWFkZG9uOmxhc3QtY2hpbGQgLmFudC1zZWxlY3QgLmFudC1zZWxlY3Qtc2VsZWN0aW9uIHtcXG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLWxnIC5hbnQtaW5wdXQsXFxuLmFudC1pbnB1dC1ncm91cC1sZyA+IC5hbnQtaW5wdXQtZ3JvdXAtYWRkb24ge1xcbiAgcGFkZGluZzogNnB4IDdweDtcXG4gIGhlaWdodDogMzJweDtcXG59XFxuLmFudC1pbnB1dC1ncm91cC1zbSAuYW50LWlucHV0LFxcbi5hbnQtaW5wdXQtZ3JvdXAtc20gPiAuYW50LWlucHV0LWdyb3VwLWFkZG9uIHtcXG4gIHBhZGRpbmc6IDFweCA3cHg7XFxuICBoZWlnaHQ6IDIycHg7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAtbGcgLmFudC1zZWxlY3Qtc2VsZWN0aW9uLS1zaW5nbGUge1xcbiAgaGVpZ2h0OiAzMnB4O1xcbn1cXG4uYW50LWlucHV0LWdyb3VwLXNtIC5hbnQtc2VsZWN0LXNlbGVjdGlvbi0tc2luZ2xlIHtcXG4gIGhlaWdodDogMjJweDtcXG59XFxuLmFudC1pbnB1dC1ncm91cCAuYW50LWlucHV0LWFmZml4LXdyYXBwZXIge1xcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgZmxvYXQ6IGxlZnQ7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAqIHtcXG4gIGJvcmRlci1yYWRpdXM6IDA7XFxuICBib3JkZXItcmlnaHQtd2lkdGg6IDA7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbiAgZmxvYXQ6IG5vbmU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgLmFudC1pbnB1dCB7XFxuICBmbG9hdDogbm9uZTtcXG4gIHotaW5kZXg6IGF1dG87XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LXNlbGVjdCA+IC5hbnQtc2VsZWN0LXNlbGVjdGlvbixcXG4uYW50LWlucHV0LWdyb3VwLmFudC1pbnB1dC1ncm91cC1jb21wYWN0ID4gLmFudC1jYWxlbmRhci1waWNrZXIgLmFudC1pbnB1dCxcXG4uYW50LWlucHV0LWdyb3VwLmFudC1pbnB1dC1ncm91cC1jb21wYWN0ID4gLmFudC1zZWxlY3QtYXV0by1jb21wbGV0ZSAuYW50LWlucHV0LFxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LWNhc2NhZGVyLXBpY2tlciAuYW50LWlucHV0LFxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LW1lbnRpb24td3JhcHBlciAuYW50LW1lbnRpb24tZWRpdG9yLFxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LXRpbWUtcGlja2VyIC5hbnQtdGltZS1waWNrZXItaW5wdXQge1xcbiAgYm9yZGVyLXJhZGl1czogMDtcXG4gIGJvcmRlci1yaWdodC13aWR0aDogMDtcXG59XFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+ICo6Zmlyc3QtY2hpbGQsXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtc2VsZWN0OmZpcnN0LWNoaWxkID4gLmFudC1zZWxlY3Qtc2VsZWN0aW9uLFxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LWNhbGVuZGFyLXBpY2tlcjpmaXJzdC1jaGlsZCAuYW50LWlucHV0LFxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LXNlbGVjdC1hdXRvLWNvbXBsZXRlOmZpcnN0LWNoaWxkIC5hbnQtaW5wdXQsXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtY2FzY2FkZXItcGlja2VyOmZpcnN0LWNoaWxkIC5hbnQtaW5wdXQsXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtbWVudGlvbi13cmFwcGVyOmZpcnN0LWNoaWxkIC5hbnQtbWVudGlvbi1lZGl0b3IsXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtdGltZS1waWNrZXI6Zmlyc3QtY2hpbGQgLmFudC10aW1lLXBpY2tlci1pbnB1dCB7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA0cHg7XFxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA0cHg7XFxufVxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAqOmxhc3QtY2hpbGQsXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtc2VsZWN0Omxhc3QtY2hpbGQgPiAuYW50LXNlbGVjdC1zZWxlY3Rpb24sXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtY2FsZW5kYXItcGlja2VyOmxhc3QtY2hpbGQgLmFudC1pbnB1dCxcXG4uYW50LWlucHV0LWdyb3VwLmFudC1pbnB1dC1ncm91cC1jb21wYWN0ID4gLmFudC1zZWxlY3QtYXV0by1jb21wbGV0ZTpsYXN0LWNoaWxkIC5hbnQtaW5wdXQsXFxuLmFudC1pbnB1dC1ncm91cC5hbnQtaW5wdXQtZ3JvdXAtY29tcGFjdCA+IC5hbnQtY2FzY2FkZXItcGlja2VyOmxhc3QtY2hpbGQgLmFudC1pbnB1dCxcXG4uYW50LWlucHV0LWdyb3VwLmFudC1pbnB1dC1ncm91cC1jb21wYWN0ID4gLmFudC1tZW50aW9uLXdyYXBwZXI6bGFzdC1jaGlsZCAuYW50LW1lbnRpb24tZWRpdG9yLFxcbi5hbnQtaW5wdXQtZ3JvdXAuYW50LWlucHV0LWdyb3VwLWNvbXBhY3QgPiAuYW50LXRpbWUtcGlja2VyOmxhc3QtY2hpbGQgLmFudC10aW1lLXBpY2tlci1pbnB1dCB7XFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNHB4O1xcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDRweDtcXG4gIGJvcmRlci1yaWdodC13aWR0aDogMXB4O1xcbn1cXG4uYW50LWlucHV0LWFmZml4LXdyYXBwZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcbi5hbnQtaW5wdXQtYWZmaXgtd3JhcHBlciAuYW50LWlucHV0IHtcXG4gIHotaW5kZXg6IDE7XFxufVxcbi5hbnQtaW5wdXQtYWZmaXgtd3JhcHBlcjpob3ZlciAuYW50LWlucHV0IHtcXG4gIGJvcmRlci1jb2xvcjogIzQ5YTllZTtcXG59XFxuLmFudC1pbnB1dC1hZmZpeC13cmFwcGVyIC5hbnQtaW5wdXQtcHJlZml4LFxcbi5hbnQtaW5wdXQtYWZmaXgtd3JhcHBlciAuYW50LWlucHV0LXN1ZmZpeCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gIHotaW5kZXg6IDI7XFxuICBsaW5lLWhlaWdodDogMDtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNjUpO1xcbn1cXG4uYW50LWlucHV0LWFmZml4LXdyYXBwZXIgLmFudC1pbnB1dC1wcmVmaXgge1xcbiAgbGVmdDogN3B4O1xcbn1cXG4uYW50LWlucHV0LWFmZml4LXdyYXBwZXIgLmFudC1pbnB1dC1zdWZmaXgge1xcbiAgcmlnaHQ6IDdweDtcXG59XFxuLmFudC1pbnB1dC1hZmZpeC13cmFwcGVyIC5hbnQtaW5wdXQ6bm90KDpmaXJzdC1jaGlsZCkge1xcbiAgcGFkZGluZy1sZWZ0OiAyNHB4O1xcbn1cXG4uYW50LWlucHV0LWFmZml4LXdyYXBwZXIgLmFudC1pbnB1dDpub3QoOmxhc3QtY2hpbGQpIHtcXG4gIHBhZGRpbmctcmlnaHQ6IDI0cHg7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL34vYW50ZC9saWIvaW5wdXQvc3R5bGUvaW5kZXgubGVzc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiSGVsdmV0aWNhIE5ldWUgRm9yIE51bWJlclxcXCI7XFxuICBzcmM6IGxvY2FsKFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIpO1xcbiAgdW5pY29kZS1yYW5nZTogVSszMC0zOTtcXG59XFxuLmFudC1sYXlvdXQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBmbGV4OiBhdXRvO1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxuICBiYWNrZ3JvdW5kOiAjZWNlY2VjO1xcbn1cXG4uYW50LWxheW91dC5hbnQtbGF5b3V0LWhhcy1zaWRlciB7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG4uYW50LWxheW91dC1oZWFkZXIsXFxuLmFudC1sYXlvdXQtZm9vdGVyIHtcXG4gIGZsZXg6IDAgMCBhdXRvO1xcbn1cXG4uYW50LWxheW91dC1oZWFkZXIge1xcbiAgYmFja2dyb3VuZDogIzQwNDA0MDtcXG4gIHBhZGRpbmc6IDAgNTBweDtcXG4gIGhlaWdodDogNjRweDtcXG4gIGxpbmUtaGVpZ2h0OiA2NHB4O1xcbn1cXG4uYW50LWxheW91dC1mb290ZXIge1xcbiAgcGFkZGluZzogMjRweCA1MHB4O1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42NSk7XFxuICBmb250LXNpemU6IDEycHg7XFxufVxcbi5hbnQtbGF5b3V0LWNvbnRlbnQge1xcbiAgZmxleDogYXV0bztcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG4uYW50LWxheW91dC1zaWRlciB7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC4yMTUsIDAuNjEsIDAuMzU1LCAxKTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJhY2tncm91bmQ6ICM0MDQwNDA7XFxuICAvKiBmaXggZmlyZWZveCBjYW4ndCBzZXQgd2lkdGggc21hbGxlciB0aGFuIGNvbnRlbnQgb24gZmxleCBpdGVtICovXFxuICBtaW4td2lkdGg6IDA7XFxufVxcbi5hbnQtbGF5b3V0LXNpZGVyLWhhcy10cmlnZ2VyIHtcXG4gIHBhZGRpbmctYm90dG9tOiA0OHB4O1xcbn1cXG4uYW50LWxheW91dC1zaWRlci1yaWdodCB7XFxuICBvcmRlcjogMTtcXG59XFxuLmFudC1sYXlvdXQtc2lkZXItdHJpZ2dlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJvdHRvbTogMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGhlaWdodDogNDhweDtcXG4gIGxpbmUtaGVpZ2h0OiA0OHB4O1xcbiAgYmFja2dyb3VuZDogcmdiYSg2NCwgNjQsIDY0LCAwLjg4KTtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYW50LWxheW91dC1zaWRlci16ZXJvLXdpZHRoID4gKiB7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG4uYW50LWxheW91dC1zaWRlci16ZXJvLXdpZHRoLXRyaWdnZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiA2NHB4O1xcbiAgcmlnaHQ6IC0zNnB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgd2lkdGg6IDM2cHg7XFxuICBoZWlnaHQ6IDQycHg7XFxuICBsaW5lLWhlaWdodDogNDJweDtcXG4gIGJhY2tncm91bmQ6ICM0MDQwNDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGZvbnQtc2l6ZTogMThweDtcXG4gIGJvcmRlci1yYWRpdXM6IDAgNHB4IDRweCAwO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAuM3MgZWFzZTtcXG59XFxuLmFudC1sYXlvdXQtc2lkZXItemVyby13aWR0aC10cmlnZ2VyOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6ICM1MzUzNTM7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL34vYW50ZC9saWIvbGF5b3V0L3N0eWxlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcIkhlbHZldGljYSBOZXVlIEZvciBOdW1iZXJcXFwiO1xcbiAgc3JjOiBsb2NhbChcXFwiSGVsdmV0aWNhIE5ldWVcXFwiKTtcXG4gIHVuaWNvZGUtcmFuZ2U6IFUrMzAtMzk7XFxufVxcbi5hbnQtbWVzc2FnZSB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB6LWluZGV4OiAxMDEwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICB0b3A6IDE2cHg7XFxuICBsZWZ0OiAwO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcbi5hbnQtbWVzc2FnZS1ub3RpY2Uge1xcbiAgcGFkZGluZzogOHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uYW50LW1lc3NhZ2Utbm90aWNlOmZpcnN0LWNoaWxkIHtcXG4gIG1hcmdpbi10b3A6IC04cHg7XFxufVxcbi5hbnQtbWVzc2FnZS1ub3RpY2UtY29udGVudCB7XFxuICBwYWRkaW5nOiA4cHggMTZweDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XFxuICBiYWNrZ3JvdW5kOiAjZmZmO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcG9pbnRlci1ldmVudHM6IGFsbDtcXG59XFxuLmFudC1tZXNzYWdlLXN1Y2Nlc3MgLmFudGljb24ge1xcbiAgY29sb3I6ICMwMGE4NTQ7XFxufVxcbi5hbnQtbWVzc2FnZS1lcnJvciAuYW50aWNvbiB7XFxuICBjb2xvcjogI2YwNDEzNDtcXG59XFxuLmFudC1tZXNzYWdlLXdhcm5pbmcgLmFudGljb24ge1xcbiAgY29sb3I6ICNmZmJmMDA7XFxufVxcbi5hbnQtbWVzc2FnZS1pbmZvIC5hbnRpY29uLFxcbi5hbnQtbWVzc2FnZS1sb2FkaW5nIC5hbnRpY29uIHtcXG4gIGNvbG9yOiAjMTA4ZWU5O1xcbn1cXG4uYW50LW1lc3NhZ2UgLmFudGljb24ge1xcbiAgbWFyZ2luLXJpZ2h0OiA4cHg7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICB0b3A6IDFweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuLmFudC1tZXNzYWdlLW5vdGljZS5tb3ZlLXVwLWxlYXZlLm1vdmUtdXAtbGVhdmUtYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBNZXNzYWdlTW92ZU91dDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBhbmltYXRpb24tZHVyYXRpb246IC4zcztcXG59XFxuQGtleWZyYW1lcyBNZXNzYWdlTW92ZU91dCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIG1heC1oZWlnaHQ6IDE1MHB4O1xcbiAgICBwYWRkaW5nOiA4cHg7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgbWF4LWhlaWdodDogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gIH1cXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vfi9hbnRkL2xpYi9tZXNzYWdlL3N0eWxlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcIkhlbHZldGljYSBOZXVlIEZvciBOdW1iZXJcXFwiO1xcbiAgc3JjOiBsb2NhbChcXFwiSGVsdmV0aWNhIE5ldWVcXFwiKTtcXG4gIHVuaWNvZGUtcmFuZ2U6IFUrMzAtMzk7XFxufVxcbi8qISBub3JtYWxpemUuY3NzIHY3LjAuMCB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW5cXG4gKiAgICBJRSBvbiBXaW5kb3dzIFBob25lIGFuZCBpbiBpT1MuXFxuICovXFxuaHRtbCB7XFxuICBsaW5lLWhlaWdodDogMS4xNTtcXG4gIC8qIDEgKi9cXG4gIC1tcy10ZXh0LXNpemUtYWRqdXN0OiAxMDAlO1xcbiAgLyogMiAqL1xcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlO1xcbiAgLyogMiAqL1xcbn1cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzIChvcGluaW9uYXRlZCkuXFxuICovXFxuYm9keSB7XFxuICBtYXJnaW46IDA7XFxufVxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqL1xcbmFydGljbGUsXFxuYXNpZGUsXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5uYXYsXFxuc2VjdGlvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuaDEge1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRS5cXG4gKi9cXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5tYWluIHtcXG4gIC8qIDEgKi9cXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgbWFyZ2luIGluIElFIDguXFxuICovXFxuZmlndXJlIHtcXG4gIG1hcmdpbjogMWVtIDQwcHg7XFxufVxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuaHIge1xcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICAvKiAxICovXFxuICBoZWlnaHQ6IDA7XFxuICAvKiAxICovXFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIC8qIDIgKi9cXG59XFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxucHJlIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcXG4gIC8qIDEgKi9cXG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLWxpbmUgKi9cXG4gIGZvbnQtc2l6ZTogMWVtO1xcbiAgLyogMiAqL1xcbn1cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqIDIuIFJlbW92ZSBnYXBzIGluIGxpbmtzIHVuZGVybGluZSBpbiBpT1MgOCsgYW5kIFNhZmFyaSA4Ky5cXG4gKi9cXG5hIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgLyogMSAqL1xcbiAgLXdlYmtpdC10ZXh0LWRlY29yYXRpb24tc2tpcDogb2JqZWN0cztcXG4gIC8qIDIgKi9cXG59XFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny0gYW5kIEZpcmVmb3ggMzktLlxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuYWJiclt0aXRsZV0ge1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTtcXG4gIC8qIDEgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcbiAgLyogMiAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xcbiAgLyogMiAqL1xcbn1cXG4vKipcXG4gKiBQcmV2ZW50IHRoZSBkdXBsaWNhdGUgYXBwbGljYXRpb24gb2YgYGJvbGRlcmAgYnkgdGhlIG5leHQgcnVsZSBpbiBTYWZhcmkgNi5cXG4gKi9cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogaW5oZXJpdDtcXG59XFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcXG4gIC8qIDEgKi9cXG4gIC8qIHN0eWxlbGludC1kaXNhYmxlLWxpbmUgKi9cXG4gIGZvbnQtc2l6ZTogMWVtO1xcbiAgLyogMiAqL1xcbn1cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzdHlsZSBpbiBBbmRyb2lkIDQuMy0uXFxuICovXFxuZGZuIHtcXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcXG59XFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGJhY2tncm91bmQgYW5kIGNvbG9yIGluIElFIDktLlxcbiAqL1xcbm1hcmsge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDtcXG4gIGNvbG9yOiAjMDAwO1xcbn1cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5zbWFsbCB7XFxuICBmb250LXNpemU6IDgwJTtcXG59XFxuLyoqXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICogYWxsIGJyb3dzZXJzLlxcbiAqL1xcbnN1YixcXG5zdXAge1xcbiAgZm9udC1zaXplOiA3NSU7XFxuICBsaW5lLWhlaWdodDogMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuc3ViIHtcXG4gIGJvdHRvbTogLTAuMjVlbTtcXG59XFxuc3VwIHtcXG4gIHRvcDogLTAuNWVtO1xcbn1cXG4vKiBFbWJlZGRlZCBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cXG4gKi9cXG5hdWRpbyxcXG52aWRlbyB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGlPUyA0LTcuXFxuICovXFxuYXVkaW86bm90KFtjb250cm9sc10pIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBoZWlnaHQ6IDA7XFxufVxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAtLlxcbiAqL1xcbmltZyB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcbi8qKlxcbiAqIEhpZGUgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqL1xcbnN2Zzpub3QoOnJvb3QpIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcbi8qIEZvcm1zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4vKipcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2VycyAob3BpbmlvbmF0ZWQpLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xcbiAgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgLyogMSAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7XFxuICAvKiAxICovXFxuICBtYXJnaW46IDA7XFxuICAvKiAyICovXFxufVxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuYnV0dG9uLFxcbmlucHV0IHtcXG4gIC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuYnV0dG9uLFxcbnNlbGVjdCB7XFxuICAvKiAxICovXFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuLyoqXFxuICogMS4gUHJldmVudCBhIFdlYktpdCBidWcgd2hlcmUgKDIpIGRlc3Ryb3lzIG5hdGl2ZSBgYXVkaW9gIGFuZCBgdmlkZW9gXFxuICogICAgY29udHJvbHMgaW4gQW5kcm9pZCA0LlxcbiAqIDIuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuYnV0dG9uLFxcbmh0bWwgW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIC8qIDIgKi9cXG59XFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG4vKipcXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICovXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuZmllbGRzZXQge1xcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxubGVnZW5kIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAvKiAxICovXFxuICBjb2xvcjogaW5oZXJpdDtcXG4gIC8qIDIgKi9cXG4gIGRpc3BsYXk6IHRhYmxlO1xcbiAgLyogMSAqL1xcbiAgbWF4LXdpZHRoOiAxMDAlO1xcbiAgLyogMSAqL1xcbiAgcGFkZGluZzogMDtcXG4gIC8qIDMgKi9cXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7XFxuICAvKiAxICovXFxufVxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxucHJvZ3Jlc3Mge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgLyogMSAqL1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgLyogMiAqL1xcbn1cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFLlxcbiAqL1xcbnRleHRhcmVhIHtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC0uXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLS5cXG4gKi9cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgLyogMSAqL1xcbiAgcGFkZGluZzogMDtcXG4gIC8qIDIgKi9cXG59XFxuLyoqXFxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAqL1xcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgaGVpZ2h0OiBhdXRvO1xcbn1cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gKi9cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxuICAvKiAxICovXFxuICBvdXRsaW5lLW9mZnNldDogLTJweDtcXG4gIC8qIDIgKi9cXG59XFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGFuZCBjYW5jZWwgYnV0dG9ucyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gKi9cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24sXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICovXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIC8qIDEgKi9cXG4gIGZvbnQ6IGluaGVyaXQ7XFxuICAvKiAyICovXFxufVxcbi8qIEludGVyYWN0aXZlXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFLCBhbmQgRmlyZWZveC5cXG4gKi9cXG5kZXRhaWxzLFxcbm1lbnUge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcbnN1bW1hcnkge1xcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG4vKiBTY3JpcHRpbmdcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqL1xcbmNhbnZhcyB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFLlxcbiAqL1xcbnRlbXBsYXRlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi8qIEhpZGRlblxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAtLlxcbiAqL1xcbltoaWRkZW5dIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbioge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcXG59XFxuKjpiZWZvcmUsXFxuKjphZnRlciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5odG1sLFxcbmJvZHkge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxufVxcbmJvZHkge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJIZWx2ZXRpY2EgTmV1ZSBGb3IgTnVtYmVyXFxcIiwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcXFwiU2Vnb2UgVUlcXFwiLCBSb2JvdG8sIFxcXCJQaW5nRmFuZyBTQ1xcXCIsIFxcXCJIaXJhZ2lubyBTYW5zIEdCXFxcIiwgXFxcIk1pY3Jvc29mdCBZYUhlaVxcXCIsIFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBsaW5lLWhlaWdodDogMS41O1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42NSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbn1cXG5ib2R5LFxcbmRpdixcXG5kbCxcXG5kdCxcXG5kZCxcXG51bCxcXG5vbCxcXG5saSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wcmUsXFxuY29kZSxcXG5mb3JtLFxcbmZpZWxkc2V0LFxcbmxlZ2VuZCxcXG5pbnB1dCxcXG50ZXh0YXJlYSxcXG5wLFxcbmJsb2NrcXVvdGUsXFxudGgsXFxudGQsXFxuaHIsXFxuYnV0dG9uLFxcbmFydGljbGUsXFxuYXNpZGUsXFxuZGV0YWlscyxcXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcbmJ1dHRvbixcXG5pbnB1dCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IGluaGVyaXQ7XFxuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcXG4gIGNvbG9yOiBpbmhlcml0O1xcbn1cXG51bCxcXG5vbCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5pbnB1dDo6LW1zLWNsZWFyLFxcbmlucHV0OjotbXMtcmV2ZWFsIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbjo6c2VsZWN0aW9uIHtcXG4gIGJhY2tncm91bmQ6ICMxMDhlZTk7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuYSB7XFxuICBjb2xvcjogIzEwOGVlOTtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHRyYW5zaXRpb246IGNvbG9yIC4zcyBlYXNlO1xcbn1cXG5hOmZvY3VzIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcbiAgdGV4dC1kZWNvcmF0aW9uLXNraXA6IGluaztcXG59XFxuYTpob3ZlciB7XFxuICBjb2xvcjogIzQ5YTllZTtcXG59XFxuYTphY3RpdmUge1xcbiAgY29sb3I6ICMwZTc3Y2E7XFxufVxcbmE6YWN0aXZlLFxcbmE6aG92ZXIge1xcbiAgb3V0bGluZTogMDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuYVtkaXNhYmxlZF0ge1xcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcbi5hbnQtZGl2aWRlciB7XFxuICBtYXJnaW46IDAgNnB4O1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgaGVpZ2h0OiA4cHg7XFxuICB3aWR0aDogMXB4O1xcbiAgYmFja2dyb3VuZDogI2NjYztcXG59XFxuY29kZSxcXG5rYmQsXFxucHJlLFxcbnNhbXAge1xcbiAgZm9udC1mYW1pbHk6IENvbnNvbGFzLCBNZW5sbywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG4uY2xlYXJmaXgge1xcbiAgem9vbTogMTtcXG59XFxuLmNsZWFyZml4OmJlZm9yZSxcXG4uY2xlYXJmaXg6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIiBcXFwiO1xcbiAgZGlzcGxheTogdGFibGU7XFxufVxcbi5jbGVhcmZpeDphZnRlciB7XFxuICBjbGVhcjogYm90aDtcXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gIGZvbnQtc2l6ZTogMDtcXG4gIGhlaWdodDogMDtcXG59XFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogJ2FudGljb24nO1xcbiAgc3JjOiB1cmwoJ2h0dHBzOi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfemNrOTB6bWxoN2hmNDd2aS5lb3QnKTtcXG4gIC8qIElFOSovXFxuICBzcmM6IHVybCgnaHR0cHM6Ly9hdC5hbGljZG4uY29tL3QvZm9udF96Y2s5MHptbGg3aGY0N3ZpLmVvdD8jaWVmaXgnKSBmb3JtYXQoJ2VtYmVkZGVkLW9wZW50eXBlJyksIC8qIGNocm9tZeOAgWZpcmVmb3ggKi8gdXJsKCdodHRwczovL2F0LmFsaWNkbi5jb20vdC9mb250X3pjazkwem1saDdoZjQ3dmkud29mZicpIGZvcm1hdCgnd29mZicpLCAvKiBjaHJvbWXjgIFmaXJlZm9444CBb3BlcmHjgIFTYWZhcmksIEFuZHJvaWQsIGlPUyA0LjIrKi8gdXJsKCdodHRwczovL2F0LmFsaWNkbi5jb20vdC9mb250X3pjazkwem1saDdoZjQ3dmkudHRmJykgZm9ybWF0KCd0cnVldHlwZScpLCAvKiBpT1MgNC4xLSAqLyB1cmwoJ2h0dHBzOi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfemNrOTB6bWxoN2hmNDd2aS5zdmcjaWNvbmZvbnQnKSBmb3JtYXQoJ3N2ZycpO1xcbn1cXG4uYW50aWNvbiB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbiAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcXG59XFxuLmFudGljb246YmVmb3JlIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJhbnRpY29uXFxcIiAhaW1wb3J0YW50O1xcbn1cXG4uYW50aWNvbi1zdGVwLWZvcndhcmQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwMFxcXCI7XFxufVxcbi5hbnRpY29uLXN0ZXAtYmFja3dhcmQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwMVxcXCI7XFxufVxcbi5hbnRpY29uLWZvcndhcmQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwMlxcXCI7XFxufVxcbi5hbnRpY29uLWJhY2t3YXJkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MDNcXFwiO1xcbn1cXG4uYW50aWNvbi1jYXJldC1yaWdodDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjA0XFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtbGVmdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjA1XFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtZG93bjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjA2XFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtdXA6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwN1xcXCI7XFxufVxcbi5hbnRpY29uLXJpZ2h0LWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjA4XFxcIjtcXG59XFxuLmFudGljb24tY2lyY2xlLXJpZ2h0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MDhcXFwiO1xcbn1cXG4uYW50aWNvbi1jYXJldC1jaXJjbGUtcmlnaHQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwOFxcXCI7XFxufVxcbi5hbnRpY29uLWxlZnQtY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MDlcXFwiO1xcbn1cXG4uYW50aWNvbi1jaXJjbGUtbGVmdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjA5XFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtY2lyY2xlLWxlZnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwOVxcXCI7XFxufVxcbi5hbnRpY29uLXVwLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjBBXFxcIjtcXG59XFxuLmFudGljb24tY2lyY2xlLXVwOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MEFcXFwiO1xcbn1cXG4uYW50aWNvbi1jYXJldC1jaXJjbGUtdXA6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwQVxcXCI7XFxufVxcbi5hbnRpY29uLWRvd24tY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MEJcXFwiO1xcbn1cXG4uYW50aWNvbi1jaXJjbGUtZG93bjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjBCXFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtY2lyY2xlLWRvd246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwQlxcXCI7XFxufVxcbi5hbnRpY29uLXJpZ2h0LWNpcmNsZS1vOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MENcXFwiO1xcbn1cXG4uYW50aWNvbi1jaXJjbGUtby1yaWdodDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjBDXFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtY2lyY2xlLW8tcmlnaHQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwQ1xcXCI7XFxufVxcbi5hbnRpY29uLWxlZnQtY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRFxcXCI7XFxufVxcbi5hbnRpY29uLWNpcmNsZS1vLWxlZnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRFxcXCI7XFxufVxcbi5hbnRpY29uLWNhcmV0LWNpcmNsZS1vLWxlZnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRFxcXCI7XFxufVxcbi5hbnRpY29uLXVwLWNpcmNsZS1vOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MEVcXFwiO1xcbn1cXG4uYW50aWNvbi1jaXJjbGUtby11cDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjBFXFxcIjtcXG59XFxuLmFudGljb24tY2FyZXQtY2lyY2xlLW8tdXA6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRVxcXCI7XFxufVxcbi5hbnRpY29uLWRvd24tY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRlxcXCI7XFxufVxcbi5hbnRpY29uLWNpcmNsZS1vLWRvd246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRlxcXCI7XFxufVxcbi5hbnRpY29uLWNhcmV0LWNpcmNsZS1vLWRvd246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYwRlxcXCI7XFxufVxcbi5hbnRpY29uLXZlcnRpY2xlLWxlZnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYxMFxcXCI7XFxufVxcbi5hbnRpY29uLXZlcnRpY2xlLXJpZ2h0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MTFcXFwiO1xcbn1cXG4uYW50aWNvbi1yb2xsYmFjazpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjEyXFxcIjtcXG59XFxuLmFudGljb24tcmV0d2VldDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjEzXFxcIjtcXG59XFxuLmFudGljb24tc2hyaW5rOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MTRcXFwiO1xcbn1cXG4uYW50aWNvbi1hcnJvd3MtYWx0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MTVcXFwiO1xcbn1cXG4uYW50aWNvbi1hcnJvdy1zYWx0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MTVcXFwiO1xcbn1cXG4uYW50aWNvbi1yZWxvYWQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYxNlxcXCI7XFxufVxcbi5hbnRpY29uLWRvdWJsZS1yaWdodDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjE3XFxcIjtcXG59XFxuLmFudGljb24tZG91YmxlLWxlZnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYxOFxcXCI7XFxufVxcbi5hbnRpY29uLWFycm93LWRvd246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYxOVxcXCI7XFxufVxcbi5hbnRpY29uLWFycm93LXVwOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MUFcXFwiO1xcbn1cXG4uYW50aWNvbi1hcnJvdy1yaWdodDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjFCXFxcIjtcXG59XFxuLmFudGljb24tYXJyb3ctbGVmdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjFDXFxcIjtcXG59XFxuLmFudGljb24tZG93bjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjFEXFxcIjtcXG59XFxuLmFudGljb24tdXA6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYxRVxcXCI7XFxufVxcbi5hbnRpY29uLXJpZ2h0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MUZcXFwiO1xcbn1cXG4uYW50aWNvbi1sZWZ0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MjBcXFwiO1xcbn1cXG4uYW50aWNvbi1taW51cy1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjIxXFxcIjtcXG59XFxuLmFudGljb24tbWludXMtY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MjJcXFwiO1xcbn1cXG4uYW50aWNvbi1taW51cy1jaXJjbGUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjIzXFxcIjtcXG59XFxuLmFudGljb24tbWludXM6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYyNFxcXCI7XFxufVxcbi5hbnRpY29uLXBsdXMtY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYyNVxcXCI7XFxufVxcbi5hbnRpY29uLXBsdXMtY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MjZcXFwiO1xcbn1cXG4uYW50aWNvbi1wbHVzOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MjdcXFwiO1xcbn1cXG4uYW50aWNvbi1pbmZvLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjI4XFxcIjtcXG59XFxuLmFudGljb24taW5mby1jaXJjbGUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjI5XFxcIjtcXG59XFxuLmFudGljb24taW5mbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjJBXFxcIjtcXG59XFxuLmFudGljb24tZXhjbGFtYXRpb246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYyQlxcXCI7XFxufVxcbi5hbnRpY29uLWV4Y2xhbWF0aW9uLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjJDXFxcIjtcXG59XFxuLmFudGljb24tZXhjbGFtYXRpb24tY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYyRFxcXCI7XFxufVxcbi5hbnRpY29uLWNsb3NlLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjJFXFxcIjtcXG59XFxuLmFudGljb24tY3Jvc3MtY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MkVcXFwiO1xcbn1cXG4uYW50aWNvbi1jbG9zZS1jaXJjbGUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjJGXFxcIjtcXG59XFxuLmFudGljb24tY3Jvc3MtY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYyRlxcXCI7XFxufVxcbi5hbnRpY29uLWNoZWNrLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjMwXFxcIjtcXG59XFxuLmFudGljb24tY2hlY2stY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYzMVxcXCI7XFxufVxcbi5hbnRpY29uLWNoZWNrOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MzJcXFwiO1xcbn1cXG4uYW50aWNvbi1jbG9zZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjMzXFxcIjtcXG59XFxuLmFudGljb24tY3Jvc3M6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYzM1xcXCI7XFxufVxcbi5hbnRpY29uLWN1c3RvbWVyLXNlcnZpY2U6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYzNFxcXCI7XFxufVxcbi5hbnRpY29uLWN1c3RvbWVyc2VydmljZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjM0XFxcIjtcXG59XFxuLmFudGljb24tY3JlZGl0LWNhcmQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYzNVxcXCI7XFxufVxcbi5hbnRpY29uLWNvZGUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjM2XFxcIjtcXG59XFxuLmFudGljb24tYm9vazpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjM3XFxcIjtcXG59XFxuLmFudGljb24tYmFyLWNoYXJ0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MzhcXFwiO1xcbn1cXG4uYW50aWNvbi1iYXJzOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2MzlcXFwiO1xcbn1cXG4uYW50aWNvbi1xdWVzdGlvbjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjNBXFxcIjtcXG59XFxuLmFudGljb24tcXVlc3Rpb24tY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2M0JcXFwiO1xcbn1cXG4uYW50aWNvbi1xdWVzdGlvbi1jaXJjbGUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjNDXFxcIjtcXG59XFxuLmFudGljb24tcGF1c2U6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYzRFxcXCI7XFxufVxcbi5hbnRpY29uLXBhdXNlLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjNFXFxcIjtcXG59XFxuLmFudGljb24tcGF1c2UtY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTYzRlxcXCI7XFxufVxcbi5hbnRpY29uLWNsb2NrLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjQwXFxcIjtcXG59XFxuLmFudGljb24tY2xvY2stY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0MVxcXCI7XFxufVxcbi5hbnRpY29uLXN3YXA6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0MlxcXCI7XFxufVxcbi5hbnRpY29uLXN3YXAtbGVmdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjQzXFxcIjtcXG59XFxuLmFudGljb24tc3dhcC1yaWdodDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjQ0XFxcIjtcXG59XFxuLmFudGljb24tcGx1cy1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjQ1XFxcIjtcXG59XFxuLmFudGljb24tZnJvd246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0NlxcXCI7XFxufVxcbi5hbnRpY29uLWZyb3duLWNpcmNsZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjQ2XFxcIjtcXG59XFxuLmFudGljb24tZWxsaXBzaXM6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0N1xcXCI7XFxufVxcbi5hbnRpY29uLWNvcHk6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0OFxcXCI7XFxufVxcbi5hbnRpY29uLW1lbnUtZm9sZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjU4XFxcIjtcXG59XFxuLmFudGljb24tbWFpbDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjU5XFxcIjtcXG59XFxuLmFudGljb24tbG9nb3V0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NUFcXFwiO1xcbn1cXG4uYW50aWNvbi1saW5rOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NUJcXFwiO1xcbn1cXG4uYW50aWNvbi1hcmVhLWNoYXJ0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NUNcXFwiO1xcbn1cXG4uYW50aWNvbi1saW5lLWNoYXJ0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NURcXFwiO1xcbn1cXG4uYW50aWNvbi1ob21lOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NUVcXFwiO1xcbn1cXG4uYW50aWNvbi1sYXB0b3A6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY1RlxcXCI7XFxufVxcbi5hbnRpY29uLXN0YXI6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY2MFxcXCI7XFxufVxcbi5hbnRpY29uLXN0YXItbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjYxXFxcIjtcXG59XFxuLmFudGljb24tZm9sZGVyOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NjJcXFwiO1xcbn1cXG4uYW50aWNvbi1maWx0ZXI6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY2M1xcXCI7XFxufVxcbi5hbnRpY29uLWZpbGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY2NFxcXCI7XFxufVxcbi5hbnRpY29uLWV4Y2VwdGlvbjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjY1XFxcIjtcXG59XFxuLmFudGljb24tbWVoOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NjZcXFwiO1xcbn1cXG4uYW50aWNvbi1tZWgtY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NjZcXFwiO1xcbn1cXG4uYW50aWNvbi1tZWgtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjY3XFxcIjtcXG59XFxuLmFudGljb24tc2hvcHBpbmctY2FydDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjY4XFxcIjtcXG59XFxuLmFudGljb24tc2F2ZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjY5XFxcIjtcXG59XFxuLmFudGljb24tdXNlcjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjZBXFxcIjtcXG59XFxuLmFudGljb24tdmlkZW8tY2FtZXJhOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NkJcXFwiO1xcbn1cXG4uYW50aWNvbi10by10b3A6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY2Q1xcXCI7XFxufVxcbi5hbnRpY29uLXRlYW06YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY2RFxcXCI7XFxufVxcbi5hbnRpY29uLXRhYmxldDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjZFXFxcIjtcXG59XFxuLmFudGljb24tc29sdXRpb246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY2RlxcXCI7XFxufVxcbi5hbnRpY29uLXNlYXJjaDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjcwXFxcIjtcXG59XFxuLmFudGljb24tc2hhcmUtYWx0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NzFcXFwiO1xcbn1cXG4uYW50aWNvbi1zZXR0aW5nOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NzJcXFwiO1xcbn1cXG4uYW50aWNvbi1wb3dlcm9mZjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkQ1XFxcIjtcXG59XFxuLmFudGljb24tcGljdHVyZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjc0XFxcIjtcXG59XFxuLmFudGljb24tcGhvbmU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY3NVxcXCI7XFxufVxcbi5hbnRpY29uLXBhcGVyLWNsaXA6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY3NlxcXCI7XFxufVxcbi5hbnRpY29uLW5vdGlmaWNhdGlvbjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjc3XFxcIjtcXG59XFxuLmFudGljb24tbW9iaWxlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NzhcXFwiO1xcbn1cXG4uYW50aWNvbi1tZW51LXVuZm9sZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjc5XFxcIjtcXG59XFxuLmFudGljb24taW5ib3g6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY3QVxcXCI7XFxufVxcbi5hbnRpY29uLWxvY2s6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY3QlxcXCI7XFxufVxcbi5hbnRpY29uLXFyY29kZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjdDXFxcIjtcXG59XFxuLmFudGljb24tcGxheS1jaXJjbGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZEMFxcXCI7XFxufVxcbi5hbnRpY29uLXBsYXktY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZEMVxcXCI7XFxufVxcbi5hbnRpY29uLXRhZzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkQyXFxcIjtcXG59XFxuLmFudGljb24tdGFnLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZEM1xcXCI7XFxufVxcbi5hbnRpY29uLXRhZ3M6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY3RFxcXCI7XFxufVxcbi5hbnRpY29uLXRhZ3MtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjdFXFxcIjtcXG59XFxuLmFudGljb24tY2xvdWQtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjdGXFxcIjtcXG59XFxuLmFudGljb24tY2xvdWQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY4MFxcXCI7XFxufVxcbi5hbnRpY29uLWNsb3VkLXVwbG9hZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjgxXFxcIjtcXG59XFxuLmFudGljb24tY2xvdWQtZG93bmxvYWQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY4MlxcXCI7XFxufVxcbi5hbnRpY29uLWNsb3VkLWRvd25sb2FkLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY4M1xcXCI7XFxufVxcbi5hbnRpY29uLWNsb3VkLXVwbG9hZC1vOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2ODRcXFwiO1xcbn1cXG4uYW50aWNvbi1lbnZpcm9ubWVudDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjg1XFxcIjtcXG59XFxuLmFudGljb24tZW52aXJvbm1lbnQtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjg2XFxcIjtcXG59XFxuLmFudGljb24tZXllOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2ODdcXFwiO1xcbn1cXG4uYW50aWNvbi1leWUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjg4XFxcIjtcXG59XFxuLmFudGljb24tY2FtZXJhOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2ODlcXFwiO1xcbn1cXG4uYW50aWNvbi1jYW1lcmEtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjhBXFxcIjtcXG59XFxuLmFudGljb24td2luZG93czpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjhCXFxcIjtcXG59XFxuLmFudGljb24tYXBwbGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY4Q1xcXCI7XFxufVxcbi5hbnRpY29uLWFwcGxlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZENFxcXCI7XFxufVxcbi5hbnRpY29uLWFuZHJvaWQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTkzOFxcXCI7XFxufVxcbi5hbnRpY29uLWFuZHJvaWQtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjhEXFxcIjtcXG59XFxuLmFudGljb24tYWxpd2FuZ3dhbmc6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY4RVxcXCI7XFxufVxcbi5hbnRpY29uLWFsaXdhbmd3YW5nLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY4RlxcXCI7XFxufVxcbi5hbnRpY29uLWV4cG9ydDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjkxXFxcIjtcXG59XFxuLmFudGljb24tZWRpdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjkyXFxcIjtcXG59XFxuLmFudGljb24tY2lyY2xlLWRvd24tbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjkzXFxcIjtcXG59XFxuLmFudGljb24tY2lyY2xlLWRvd24tOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2OTRcXFwiO1xcbn1cXG4uYW50aWNvbi1hcHBzdG9yZS1vOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2OTVcXFwiO1xcbn1cXG4uYW50aWNvbi1hcHBzdG9yZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjk2XFxcIjtcXG59XFxuLmFudGljb24tc2NhbjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjk3XFxcIjtcXG59XFxuLmFudGljb24tZmlsZS10ZXh0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2OThcXFwiO1xcbn1cXG4uYW50aWNvbi1mb2xkZXItb3BlbjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjk5XFxcIjtcXG59XFxuLmFudGljb24taGRkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2OUFcXFwiO1xcbn1cXG4uYW50aWNvbi1pZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjlCXFxcIjtcXG59XFxuLmFudGljb24tZmlsZS1qcGc6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY5Q1xcXCI7XFxufVxcbi5hbnRpY29uLWxpa2U6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0Q1xcXCI7XFxufVxcbi5hbnRpY29uLWxpa2UtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjlEXFxcIjtcXG59XFxuLmFudGljb24tZGlzbGlrZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjRCXFxcIjtcXG59XFxuLmFudGljb24tZGlzbGlrZS1vOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2OUVcXFwiO1xcbn1cXG4uYW50aWNvbi1kZWxldGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY5RlxcXCI7XFxufVxcbi5hbnRpY29uLWVudGVyOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QTBcXFwiO1xcbn1cXG4uYW50aWNvbi1wdXNocGluLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBMVxcXCI7XFxufVxcbi5hbnRpY29uLXB1c2hwaW46YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBMlxcXCI7XFxufVxcbi5hbnRpY29uLWhlYXJ0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QTNcXFwiO1xcbn1cXG4uYW50aWNvbi1oZWFydC1vOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QTRcXFwiO1xcbn1cXG4uYW50aWNvbi1wYXktY2lyY2xlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QTVcXFwiO1xcbn1cXG4uYW50aWNvbi1wYXktY2lyY2xlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBNlxcXCI7XFxufVxcbi5hbnRpY29uLXNtaWxlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QTdcXFwiO1xcbn1cXG4uYW50aWNvbi1zbWlsZS1jaXJjbGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBN1xcXCI7XFxufVxcbi5hbnRpY29uLXNtaWxlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBOFxcXCI7XFxufVxcbi5hbnRpY29uLWZyb3duLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBOVxcXCI7XFxufVxcbi5hbnRpY29uLWNhbGN1bGF0b3I6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBQVxcXCI7XFxufVxcbi5hbnRpY29uLW1lc3NhZ2U6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBQlxcXCI7XFxufVxcbi5hbnRpY29uLWNocm9tZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkFDXFxcIjtcXG59XFxuLmFudGljb24tZ2l0aHViOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QURcXFwiO1xcbn1cXG4uYW50aWNvbi1maWxlLXVua25vd246YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZBRlxcXCI7XFxufVxcbi5hbnRpY29uLWZpbGUtZXhjZWw6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCMFxcXCI7XFxufVxcbi5hbnRpY29uLWZpbGUtcHB0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QjFcXFwiO1xcbn1cXG4uYW50aWNvbi1maWxlLXdvcmQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCMlxcXCI7XFxufVxcbi5hbnRpY29uLWZpbGUtcGRmOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QjNcXFwiO1xcbn1cXG4uYW50aWNvbi1kZXNrdG9wOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QjRcXFwiO1xcbn1cXG4uYW50aWNvbi11cGxvYWQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCNlxcXCI7XFxufVxcbi5hbnRpY29uLWRvd25sb2FkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QjdcXFwiO1xcbn1cXG4uYW50aWNvbi1waWUtY2hhcnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCOFxcXCI7XFxufVxcbi5hbnRpY29uLXVubG9jazpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkJBXFxcIjtcXG59XFxuLmFudGljb24tY2FsZW5kYXI6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCQlxcXCI7XFxufVxcbi5hbnRpY29uLXdpbmRvd3MtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkJDXFxcIjtcXG59XFxuLmFudGljb24tZG90LWNoYXJ0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QkRcXFwiO1xcbn1cXG4uYW50aWNvbi1iYXItY2hhcnQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCRVxcXCI7XFxufVxcbi5hbnRpY29uLWNvZGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZCRlxcXCI7XFxufVxcbi5hbnRpY29uLWFwaTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFOTUxXFxcIjtcXG59XFxuLmFudGljb24tcGx1cy1zcXVhcmU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZDMFxcXCI7XFxufVxcbi5hbnRpY29uLW1pbnVzLXNxdWFyZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkMxXFxcIjtcXG59XFxuLmFudGljb24tY2xvc2Utc3F1YXJlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QzJcXFwiO1xcbn1cXG4uYW50aWNvbi1jbG9zZS1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkMzXFxcIjtcXG59XFxuLmFudGljb24tY2hlY2stc3F1YXJlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QzRcXFwiO1xcbn1cXG4uYW50aWNvbi1jaGVjay1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkM1XFxcIjtcXG59XFxuLmFudGljb24tZmFzdC1iYWNrd2FyZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkM2XFxcIjtcXG59XFxuLmFudGljb24tZmFzdC1mb3J3YXJkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QzdcXFwiO1xcbn1cXG4uYW50aWNvbi11cC1zcXVhcmU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZDOFxcXCI7XFxufVxcbi5hbnRpY29uLWRvd24tc3F1YXJlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2QzlcXFwiO1xcbn1cXG4uYW50aWNvbi1sZWZ0LXNxdWFyZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkNBXFxcIjtcXG59XFxuLmFudGljb24tcmlnaHQtc3F1YXJlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2Q0JcXFwiO1xcbn1cXG4uYW50aWNvbi1yaWdodC1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkNDXFxcIjtcXG59XFxuLmFudGljb24tbGVmdC1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkNEXFxcIjtcXG59XFxuLmFudGljb24tZG93bi1zcXVhcmUtbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkNFXFxcIjtcXG59XFxuLmFudGljb24tdXAtc3F1YXJlLW86YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZDRlxcXCI7XFxufVxcbi5hbnRpY29uLWxvYWRpbmc6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY0RFxcXCI7XFxufVxcbi5hbnRpY29uLWxvYWRpbmctMy1xdWFydGVyczpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkFFXFxcIjtcXG59XFxuLmFudGljb24tYnVsYjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjQ5XFxcIjtcXG59XFxuLmFudGljb24tc2VsZWN0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NEFcXFwiO1xcbn1cXG4uYW50aWNvbi1hZGRmaWxlOmJlZm9yZSxcXG4uYW50aWNvbi1maWxlLWFkZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFOTEwXFxcIjtcXG59XFxuLmFudGljb24tYWRkZm9sZGVyOmJlZm9yZSxcXG4uYW50aWNvbi1mb2xkZXItYWRkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU5MTRcXFwiO1xcbn1cXG4uYW50aWNvbi1zd2l0Y2hlcjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFOTEzXFxcIjtcXG59XFxuLmFudGljb24tcm9ja2V0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU5MEZcXFwiO1xcbn1cXG4uYW50aWNvbi1kaW5nZGluZzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFOTIzXFxcIjtcXG59XFxuLmFudGljb24tZGluZ2RpbmctbzpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFOTI1XFxcIjtcXG59XFxuLmFudGljb24tYmVsbDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjRFXFxcIjtcXG59XFxuLmFudGljb24tZGlzY29ubmVjdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjRGXFxcIjtcXG59XFxuLmFudGljb24tZGF0YWJhc2U6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY1MFxcXCI7XFxufVxcbi5hbnRpY29uLWNvbXBhc3M6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZEQlxcXCI7XFxufVxcbi5hbnRpY29uLWJhcmNvZGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY1MlxcXCI7XFxufVxcbi5hbnRpY29uLWhvdXJnbGFzczpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNjUzXFxcIjtcXG59XFxuLmFudGljb24ta2V5OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NTRcXFwiO1xcbn1cXG4uYW50aWNvbi1mbGFnOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NTVcXFwiO1xcbn1cXG4uYW50aWNvbi1sYXlvdXQ6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY1NlxcXCI7XFxufVxcbi5hbnRpY29uLWxvZ2luOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NTdcXFwiO1xcbn1cXG4uYW50aWNvbi1wcmludGVyOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2NzNcXFwiO1xcbn1cXG4uYW50aWNvbi1zb3VuZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkU5XFxcIjtcXG59XFxuLmFudGljb24tdXNiOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RDdcXFwiO1xcbn1cXG4uYW50aWNvbi1za2luOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RDhcXFwiO1xcbn1cXG4uYW50aWNvbi10b29sOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RDlcXFwiO1xcbn1cXG4uYW50aWNvbi1zeW5jOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2REFcXFwiO1xcbn1cXG4uYW50aWNvbi13aWZpOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RDZcXFwiO1xcbn1cXG4uYW50aWNvbi1jYXI6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZEQ1xcXCI7XFxufVxcbi5hbnRpY29uLWNvcHlyaWdodDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkRFXFxcIjtcXG59XFxuLmFudGljb24tc2NoZWR1bGU6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZERlxcXCI7XFxufVxcbi5hbnRpY29uLXVzZXItYWRkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RURcXFwiO1xcbn1cXG4uYW50aWNvbi11c2VyLWRlbGV0ZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkUwXFxcIjtcXG59XFxuLmFudGljb24tdXNlcmdyb3VwLWFkZDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkREXFxcIjtcXG59XFxuLmFudGljb24tdXNlcmdyb3VwLWRlbGV0ZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkUxXFxcIjtcXG59XFxuLmFudGljb24tbWFuOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RTJcXFwiO1xcbn1cXG4uYW50aWNvbi13b21hbjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkVDXFxcIjtcXG59XFxuLmFudGljb24tc2hvcDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkUzXFxcIjtcXG59XFxuLmFudGljb24tZ2lmdDpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkU0XFxcIjtcXG59XFxuLmFudGljb24taWRjYXJkOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RTVcXFwiO1xcbn1cXG4uYW50aWNvbi1tZWRpY2luZS1ib3g6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZFNlxcXCI7XFxufVxcbi5hbnRpY29uLXJlZC1lbnZlbG9wZTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkU3XFxcIjtcXG59XFxuLmFudGljb24tY29mZmVlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RThcXFwiO1xcbn1cXG4uYW50aWNvbi10cmFkZW1hcms6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTY1MVxcXCI7XFxufVxcbi5hbnRpY29uLXNhZmV0eTpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFxFNkVBXFxcIjtcXG59XFxuLmFudGljb24td2FsbGV0OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RUJcXFwiO1xcbn1cXG4uYW50aWNvbi1iYW5rOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RUVcXFwiO1xcbn1cXG4uYW50aWNvbi10cm9waHk6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZFRlxcXCI7XFxufVxcbi5hbnRpY29uLWNvbnRhY3RzOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RjBcXFwiO1xcbn1cXG4uYW50aWNvbi1nbG9iYWw6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcRTZGMVxcXCI7XFxufVxcbi5hbnRpY29uLXNoYWtlOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU5NEZcXFwiO1xcbn1cXG4uYW50aWNvbi1mb3JrOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcXEU2RjJcXFwiO1xcbn1cXG4uYW50aWNvbi1zcGluOmJlZm9yZSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBhbmltYXRpb246IGxvYWRpbmdDaXJjbGUgMXMgaW5maW5pdGUgbGluZWFyO1xcbn1cXG4uZmFkZS1lbnRlcixcXG4uZmFkZS1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5mYWRlLWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uZmFkZS1lbnRlci5mYWRlLWVudGVyLWFjdGl2ZSxcXG4uZmFkZS1hcHBlYXIuZmFkZS1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRGYWRlSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLmZhZGUtbGVhdmUuZmFkZS1sZWF2ZS1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudEZhZGVPdXQ7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLmZhZGUtZW50ZXIsXFxuLmZhZGUtYXBwZWFyIHtcXG4gIG9wYWNpdHk6IDA7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XFxufVxcbi5mYWRlLWxlYXZlIHtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGxpbmVhcjtcXG59XFxuQGtleWZyYW1lcyBhbnRGYWRlSW4ge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgYW50RmFkZU91dCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gIH1cXG59XFxuLm1vdmUtdXAtZW50ZXIsXFxuLm1vdmUtdXAtYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4ubW92ZS11cC1sZWF2ZSB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLm1vdmUtdXAtZW50ZXIubW92ZS11cC1lbnRlci1hY3RpdmUsXFxuLm1vdmUtdXAtYXBwZWFyLm1vdmUtdXAtYXBwZWFyLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50TW92ZVVwSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLm1vdmUtdXAtbGVhdmUubW92ZS11cC1sZWF2ZS1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudE1vdmVVcE91dDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4ubW92ZS11cC1lbnRlcixcXG4ubW92ZS11cC1hcHBlYXIge1xcbiAgb3BhY2l0eTogMDtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjA4LCAwLjgyLCAwLjE3LCAxKTtcXG59XFxuLm1vdmUtdXAtbGVhdmUge1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNiwgMC4wNCwgMC45OCwgMC4zNCk7XFxufVxcbi5tb3ZlLWRvd24tZW50ZXIsXFxuLm1vdmUtZG93bi1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5tb3ZlLWRvd24tbGVhdmUge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5tb3ZlLWRvd24tZW50ZXIubW92ZS1kb3duLWVudGVyLWFjdGl2ZSxcXG4ubW92ZS1kb3duLWFwcGVhci5tb3ZlLWRvd24tYXBwZWFyLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50TW92ZURvd25JbjtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4ubW92ZS1kb3duLWxlYXZlLm1vdmUtZG93bi1sZWF2ZS1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudE1vdmVEb3duT3V0O1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi5tb3ZlLWRvd24tZW50ZXIsXFxuLm1vdmUtZG93bi1hcHBlYXIge1xcbiAgb3BhY2l0eTogMDtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjA4LCAwLjgyLCAwLjE3LCAxKTtcXG59XFxuLm1vdmUtZG93bi1sZWF2ZSB7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC42LCAwLjA0LCAwLjk4LCAwLjM0KTtcXG59XFxuLm1vdmUtbGVmdC1lbnRlcixcXG4ubW92ZS1sZWZ0LWFwcGVhciB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLm1vdmUtbGVmdC1sZWF2ZSB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLm1vdmUtbGVmdC1lbnRlci5tb3ZlLWxlZnQtZW50ZXItYWN0aXZlLFxcbi5tb3ZlLWxlZnQtYXBwZWFyLm1vdmUtbGVmdC1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRNb3ZlTGVmdEluO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi5tb3ZlLWxlZnQtbGVhdmUubW92ZS1sZWZ0LWxlYXZlLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50TW92ZUxlZnRPdXQ7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLm1vdmUtbGVmdC1lbnRlcixcXG4ubW92ZS1sZWZ0LWFwcGVhciB7XFxuICBvcGFjaXR5OiAwO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMDgsIDAuODIsIDAuMTcsIDEpO1xcbn1cXG4ubW92ZS1sZWZ0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjYsIDAuMDQsIDAuOTgsIDAuMzQpO1xcbn1cXG4ubW92ZS1yaWdodC1lbnRlcixcXG4ubW92ZS1yaWdodC1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5tb3ZlLXJpZ2h0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4ubW92ZS1yaWdodC1lbnRlci5tb3ZlLXJpZ2h0LWVudGVyLWFjdGl2ZSxcXG4ubW92ZS1yaWdodC1hcHBlYXIubW92ZS1yaWdodC1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRNb3ZlUmlnaHRJbjtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4ubW92ZS1yaWdodC1sZWF2ZS5tb3ZlLXJpZ2h0LWxlYXZlLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50TW92ZVJpZ2h0T3V0O1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi5tb3ZlLXJpZ2h0LWVudGVyLFxcbi5tb3ZlLXJpZ2h0LWFwcGVhciB7XFxuICBvcGFjaXR5OiAwO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMDgsIDAuODIsIDAuMTcsIDEpO1xcbn1cXG4ubW92ZS1yaWdodC1sZWF2ZSB7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC42LCAwLjA0LCAwLjk4LCAwLjM0KTtcXG59XFxuQGtleWZyYW1lcyBhbnRNb3ZlRG93bkluIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTAwJSk7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpO1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudE1vdmVEb3duT3V0IHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpO1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwMCUpO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudE1vdmVMZWZ0SW4ge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpO1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudE1vdmVMZWZ0T3V0IHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpO1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTtcXG4gICAgb3BhY2l0eTogMDtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRNb3ZlUmlnaHRJbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDAlKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRNb3ZlUmlnaHRPdXQge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSk7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgYW50TW92ZVVwSW4ge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpO1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudE1vdmVVcE91dCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDAlKTtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgbG9hZGluZ0NpcmNsZSB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XFxuICB9XFxufVxcbi5zbGlkZS11cC1lbnRlcixcXG4uc2xpZGUtdXAtYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uc2xpZGUtdXAtbGVhdmUge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5zbGlkZS11cC1lbnRlci5zbGlkZS11cC1lbnRlci1hY3RpdmUsXFxuLnNsaWRlLXVwLWFwcGVhci5zbGlkZS11cC1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRTbGlkZVVwSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnNsaWRlLXVwLWxlYXZlLnNsaWRlLXVwLWxlYXZlLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50U2xpZGVVcE91dDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uc2xpZGUtdXAtZW50ZXIsXFxuLnNsaWRlLXVwLWFwcGVhciB7XFxuICBvcGFjaXR5OiAwO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMjMsIDEsIDAuMzIsIDEpO1xcbn1cXG4uc2xpZGUtdXAtbGVhdmUge1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNzU1LCAwLjA1LCAwLjg1NSwgMC4wNik7XFxufVxcbi5zbGlkZS1kb3duLWVudGVyLFxcbi5zbGlkZS1kb3duLWFwcGVhciB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLnNsaWRlLWRvd24tbGVhdmUge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5zbGlkZS1kb3duLWVudGVyLnNsaWRlLWRvd24tZW50ZXItYWN0aXZlLFxcbi5zbGlkZS1kb3duLWFwcGVhci5zbGlkZS1kb3duLWFwcGVhci1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFNsaWRlRG93bkluO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi5zbGlkZS1kb3duLWxlYXZlLnNsaWRlLWRvd24tbGVhdmUtYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRTbGlkZURvd25PdXQ7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnNsaWRlLWRvd24tZW50ZXIsXFxuLnNsaWRlLWRvd24tYXBwZWFyIHtcXG4gIG9wYWNpdHk6IDA7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4yMywgMSwgMC4zMiwgMSk7XFxufVxcbi5zbGlkZS1kb3duLWxlYXZlIHtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjc1NSwgMC4wNSwgMC44NTUsIDAuMDYpO1xcbn1cXG4uc2xpZGUtbGVmdC1lbnRlcixcXG4uc2xpZGUtbGVmdC1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5zbGlkZS1sZWZ0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uc2xpZGUtbGVmdC1lbnRlci5zbGlkZS1sZWZ0LWVudGVyLWFjdGl2ZSxcXG4uc2xpZGUtbGVmdC1hcHBlYXIuc2xpZGUtbGVmdC1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRTbGlkZUxlZnRJbjtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uc2xpZGUtbGVmdC1sZWF2ZS5zbGlkZS1sZWZ0LWxlYXZlLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50U2xpZGVMZWZ0T3V0O1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi5zbGlkZS1sZWZ0LWVudGVyLFxcbi5zbGlkZS1sZWZ0LWFwcGVhciB7XFxuICBvcGFjaXR5OiAwO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMjMsIDEsIDAuMzIsIDEpO1xcbn1cXG4uc2xpZGUtbGVmdC1sZWF2ZSB7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC43NTUsIDAuMDUsIDAuODU1LCAwLjA2KTtcXG59XFxuLnNsaWRlLXJpZ2h0LWVudGVyLFxcbi5zbGlkZS1yaWdodC1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi5zbGlkZS1yaWdodC1sZWF2ZSB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLnNsaWRlLXJpZ2h0LWVudGVyLnNsaWRlLXJpZ2h0LWVudGVyLWFjdGl2ZSxcXG4uc2xpZGUtcmlnaHQtYXBwZWFyLnNsaWRlLXJpZ2h0LWFwcGVhci1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFNsaWRlUmlnaHRJbjtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uc2xpZGUtcmlnaHQtbGVhdmUuc2xpZGUtcmlnaHQtbGVhdmUtYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRTbGlkZVJpZ2h0T3V0O1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi5zbGlkZS1yaWdodC1lbnRlcixcXG4uc2xpZGUtcmlnaHQtYXBwZWFyIHtcXG4gIG9wYWNpdHk6IDA7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4yMywgMSwgMC4zMiwgMSk7XFxufVxcbi5zbGlkZS1yaWdodC1sZWF2ZSB7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC43NTUsIDAuMDUsIDAuODU1LCAwLjA2KTtcXG59XFxuQGtleWZyYW1lcyBhbnRTbGlkZVVwSW4ge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwJSAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwJSAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgYW50U2xpZGVVcE91dCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAlIDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwJSAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRTbGlkZURvd25JbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAxMDAlIDEwMCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudFNsaWRlRG93bk91dCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxMDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudFNsaWRlTGVmdEluIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCUgMCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVYKDAuOCk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMCUgMCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudFNsaWRlTGVmdE91dCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAlIDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgxKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwJSAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVgoMC44KTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRTbGlkZVJpZ2h0SW4ge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAxMDAlIDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgwLjgpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudFNsaWRlUmlnaHRPdXQge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAxMDAlIDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgxKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAxMDAlIDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgwLjgpO1xcbiAgfVxcbn1cXG4uc3dpbmctZW50ZXIsXFxuLnN3aW5nLWFwcGVhciB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLnN3aW5nLWVudGVyLnN3aW5nLWVudGVyLWFjdGl2ZSxcXG4uc3dpbmctYXBwZWFyLnN3aW5nLWFwcGVhci1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFN3aW5nSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuQGtleWZyYW1lcyBhbnRTd2luZ0luIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcXG4gIH1cXG4gIDIwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTBweCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTBweCk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTVweCk7XFxuICB9XFxuICA4MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoNXB4KTtcXG4gIH1cXG59XFxuLnpvb20tZW50ZXIsXFxuLnpvb20tYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1sZWF2ZSB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLnpvb20tZW50ZXIuem9vbS1lbnRlci1hY3RpdmUsXFxuLnpvb20tYXBwZWFyLnpvb20tYXBwZWFyLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50Wm9vbUluO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi56b29tLWxlYXZlLnpvb20tbGVhdmUtYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRab29tT3V0O1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi56b29tLWVudGVyLFxcbi56b29tLWFwcGVhciB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMDgsIDAuODIsIDAuMTcsIDEpO1xcbn1cXG4uem9vbS1sZWF2ZSB7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC43OCwgMC4xNCwgMC4xNSwgMC44Nik7XFxufVxcbi56b29tLWJpZy1lbnRlcixcXG4uem9vbS1iaWctYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1iaWctbGVhdmUge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi56b29tLWJpZy1lbnRlci56b29tLWJpZy1lbnRlci1hY3RpdmUsXFxuLnpvb20tYmlnLWFwcGVhci56b29tLWJpZy1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRab29tQmlnSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnpvb20tYmlnLWxlYXZlLnpvb20tYmlnLWxlYXZlLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50Wm9vbUJpZ091dDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uem9vbS1iaWctZW50ZXIsXFxuLnpvb20tYmlnLWFwcGVhciB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMDgsIDAuODIsIDAuMTcsIDEpO1xcbn1cXG4uem9vbS1iaWctbGVhdmUge1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNzgsIDAuMTQsIDAuMTUsIDAuODYpO1xcbn1cXG4uem9vbS1iaWctZmFzdC1lbnRlcixcXG4uem9vbS1iaWctZmFzdC1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjFzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi56b29tLWJpZy1mYXN0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4xcztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1iaWctZmFzdC1lbnRlci56b29tLWJpZy1mYXN0LWVudGVyLWFjdGl2ZSxcXG4uem9vbS1iaWctZmFzdC1hcHBlYXIuem9vbS1iaWctZmFzdC1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRab29tQmlnSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnpvb20tYmlnLWZhc3QtbGVhdmUuem9vbS1iaWctZmFzdC1sZWF2ZS1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFpvb21CaWdPdXQ7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnpvb20tYmlnLWZhc3QtZW50ZXIsXFxuLnpvb20tYmlnLWZhc3QtYXBwZWFyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4wOCwgMC44MiwgMC4xNywgMSk7XFxufVxcbi56b29tLWJpZy1mYXN0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjc4LCAwLjE0LCAwLjE1LCAwLjg2KTtcXG59XFxuLnpvb20tdXAtZW50ZXIsXFxuLnpvb20tdXAtYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS11cC1sZWF2ZSB7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDAuMnM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHBhdXNlZDtcXG59XFxuLnpvb20tdXAtZW50ZXIuem9vbS11cC1lbnRlci1hY3RpdmUsXFxuLnpvb20tdXAtYXBwZWFyLnpvb20tdXAtYXBwZWFyLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50Wm9vbVVwSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnpvb20tdXAtbGVhdmUuem9vbS11cC1sZWF2ZS1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFpvb21VcE91dDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uem9vbS11cC1lbnRlcixcXG4uem9vbS11cC1hcHBlYXIge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcXG4gIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjA4LCAwLjgyLCAwLjE3LCAxKTtcXG59XFxuLnpvb20tdXAtbGVhdmUge1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNzgsIDAuMTQsIDAuMTUsIDAuODYpO1xcbn1cXG4uem9vbS1kb3duLWVudGVyLFxcbi56b29tLWRvd24tYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1kb3duLWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1kb3duLWVudGVyLnpvb20tZG93bi1lbnRlci1hY3RpdmUsXFxuLnpvb20tZG93bi1hcHBlYXIuem9vbS1kb3duLWFwcGVhci1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFpvb21Eb3duSW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnpvb20tZG93bi1sZWF2ZS56b29tLWRvd24tbGVhdmUtYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRab29tRG93bk91dDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uem9vbS1kb3duLWVudGVyLFxcbi56b29tLWRvd24tYXBwZWFyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4wOCwgMC44MiwgMC4xNywgMSk7XFxufVxcbi56b29tLWRvd24tbGVhdmUge1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNzgsIDAuMTQsIDAuMTUsIDAuODYpO1xcbn1cXG4uem9vbS1sZWZ0LWVudGVyLFxcbi56b29tLWxlZnQtYXBwZWFyIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1sZWZ0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1sZWZ0LWVudGVyLnpvb20tbGVmdC1lbnRlci1hY3RpdmUsXFxuLnpvb20tbGVmdC1hcHBlYXIuem9vbS1sZWZ0LWFwcGVhci1hY3RpdmUge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGFudFpvb21MZWZ0SW47XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZztcXG59XFxuLnpvb20tbGVmdC1sZWF2ZS56b29tLWxlZnQtbGVhdmUtYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRab29tTGVmdE91dDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uem9vbS1sZWZ0LWVudGVyLFxcbi56b29tLWxlZnQtYXBwZWFyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC4wOCwgMC44MiwgMC4xNywgMSk7XFxufVxcbi56b29tLWxlZnQtbGVhdmUge1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNzgsIDAuMTQsIDAuMTUsIDAuODYpO1xcbn1cXG4uem9vbS1yaWdodC1lbnRlcixcXG4uem9vbS1yaWdodC1hcHBlYXIge1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBwYXVzZWQ7XFxufVxcbi56b29tLXJpZ2h0LWxlYXZlIHtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMC4ycztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XFxuICBhbmltYXRpb24tcGxheS1zdGF0ZTogcGF1c2VkO1xcbn1cXG4uem9vbS1yaWdodC1lbnRlci56b29tLXJpZ2h0LWVudGVyLWFjdGl2ZSxcXG4uem9vbS1yaWdodC1hcHBlYXIuem9vbS1yaWdodC1hcHBlYXItYWN0aXZlIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBhbnRab29tUmlnaHRJbjtcXG4gIGFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nO1xcbn1cXG4uem9vbS1yaWdodC1sZWF2ZS56b29tLXJpZ2h0LWxlYXZlLWFjdGl2ZSB7XFxuICBhbmltYXRpb24tbmFtZTogYW50Wm9vbVJpZ2h0T3V0O1xcbiAgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7XFxufVxcbi56b29tLXJpZ2h0LWVudGVyLFxcbi56b29tLXJpZ2h0LWFwcGVhciB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuMDgsIDAuODIsIDAuMTcsIDEpO1xcbn1cXG4uem9vbS1yaWdodC1sZWF2ZSB7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC43OCwgMC4xNCwgMC4xNSwgMC44Nik7XFxufVxcbkBrZXlmcmFtZXMgYW50Wm9vbUluIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjIpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgYW50Wm9vbU91dCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjIpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudFpvb21CaWdJbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIGFudFpvb21CaWdPdXQge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRab29tVXBJbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDUwJSAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDUwJSAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRab29tVXBPdXQge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgMCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOCk7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgYW50Wm9vbUxlZnRJbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAlIDUwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAlIDUwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRab29tTGVmdE91dCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAlIDUwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwJSA1MCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRab29tUmlnaHRJbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgNTAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOCk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMTAwJSA1MCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgYW50Wm9vbVJpZ2h0T3V0IHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMTAwJSA1MCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogMTAwJSA1MCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRab29tRG93bkluIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDEwMCU7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgMTAwJTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBhbnRab29tRG93bk91dCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDUwJSAxMDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDUwJSAxMDAlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOCk7XFxuICB9XFxufVxcbi5hbnQtbW90aW9uLWNvbGxhcHNlIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcbi5hbnQtbW90aW9uLWNvbGxhcHNlLWFjdGl2ZSB7XFxuICB0cmFuc2l0aW9uOiBoZWlnaHQgLjEycywgb3BhY2l0eSAuMTJzO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9+L2FudGQvbGliL3N0eWxlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWxvZ2luQmxvY2stLS0ySzNQNyBoZWFkZXI6YWZ0ZXIsIC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWlucHV0Q29udGFpbmVyLS0tMXdJd3kgLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0taW5wdXRUaXRsZS0tLTFhSG9vOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjbGVhcjogYm90aDsgfVxcblxcbi5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWNvbnRhaW5lci0tLTNzbWNYIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlOyB9XFxuXFxuLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tbG9naW5CbG9jay0tLTJLM1A3IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHRvcDogMjAlO1xcbiAgd2lkdGg6IDQwMHB4O1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICBib3JkZXI6IDFweCAjZGRkIHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgcGFkZGluZzogMTZweDsgfVxcbiAgLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tbG9naW5CbG9jay0tLTJLM1A3IGhlYWRlciB7XFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDsgfVxcbiAgICAuc3JjLUhvbWUtTG9naW4tTG9naW4tLS1sb2dpbkJsb2NrLS0tMkszUDcgaGVhZGVyIHAge1xcbiAgICAgIGZsb2F0OiBsZWZ0OyB9XFxuXFxuLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0taW5wdXRDb250YWluZXItLS0xd0l3eSB7XFxuICBtYXJnaW46IDE0cHggMDtcXG4gIHBhZGRpbmc6IDAgNjRweDtcXG4gIGZvbnQtc2l6ZTogMTZweDsgfVxcbiAgLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0taW5wdXRDb250YWluZXItLS0xd0l3eSAuc3JjLUhvbWUtTG9naW4tTG9naW4tLS1pbnB1dFRpdGxlLS0tMWFIb28gcCB7XFxuICAgIGZsb2F0OiBsZWZ0OyB9XFxuICAuc3JjLUhvbWUtTG9naW4tTG9naW4tLS1pbnB1dENvbnRhaW5lci0tLTF3SXd5IC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWlucHV0U2VjdGlvbi0tLTJPMTlYIHtcXG4gICAgd2lkdGg6IDEwMCU7IH1cXG4gICAgLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0taW5wdXRDb250YWluZXItLS0xd0l3eSAuc3JjLUhvbWUtTG9naW4tTG9naW4tLS1pbnB1dFNlY3Rpb24tLS0yTzE5WCBpbnB1dCB7XFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgaGVpZ2h0OiAzMXB4O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcXG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjYTZhNmE2O1xcbiAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpLCAwIDFweCAwIHJnYmEoMCwgMCwgMCwgMC4wNykgaW5zZXQ7XFxuICAgICAgb3V0bGluZTogMDsgfVxcblxcbi5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWJ1dHRvbkNvbnRhaW5lci0tLTIzcUtPIHtcXG4gIG1hcmdpbjogMTRweCAwO1xcbiAgcGFkZGluZzogMCA2NHB4O1xcbiAgZm9udC1zaXplOiAxNnB4OyB9XFxuICAuc3JjLUhvbWUtTG9naW4tTG9naW4tLS1idXR0b25Db250YWluZXItLS0yM3FLTyA6aG92ZXIge1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7IH1cXG4gIC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWJ1dHRvbkNvbnRhaW5lci0tLTIzcUtPIGJ1dHRvbiB7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgYm9yZGVyOiAxcHggIzg0NmEyOSBzb2xpZDtcXG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAzMXB4O1xcbiAgICBvdXRsaW5lOiAwO1xcbiAgICBib3gtc2hhZG93OiAwIDFweCAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40KSBpbnNldDtcXG4gICAgbWFyZ2luOiAxNnB4IDA7IH1cXG4gIC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWJ1dHRvbkNvbnRhaW5lci0tLTIzcUtPIC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWxvZ2luQnRuLS0tM2U4YXAge1xcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAjZjdkZmE1LCAjZjBjMTRiKTsgfVxcbiAgLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tYnV0dG9uQ29udGFpbmVyLS0tMjNxS08gLnNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tY29uZmlybUJ0bi0tLTNLVFhFIHtcXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgIzEzZDcxZiwgIzYzZDcxZik7IH1cXG4gIC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWJ1dHRvbkNvbnRhaW5lci0tLTIzcUtPIC5zcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLXJlZ2lzdGVyQnRuLS0tcTR6MXYge1xcbiAgICBtYXJnaW4tdG9wOiA0cHg7XFxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICNmN2Y4ZmEsICNlN2U5ZWMpOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwibG9naW5CbG9ja1wiOiBcInNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tbG9naW5CbG9jay0tLTJLM1A3XCIsXG5cdFwiaW5wdXRDb250YWluZXJcIjogXCJzcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWlucHV0Q29udGFpbmVyLS0tMXdJd3lcIixcblx0XCJpbnB1dFRpdGxlXCI6IFwic3JjLUhvbWUtTG9naW4tTG9naW4tLS1pbnB1dFRpdGxlLS0tMWFIb29cIixcblx0XCJjb250YWluZXJcIjogXCJzcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWNvbnRhaW5lci0tLTNzbWNYXCIsXG5cdFwiaW5wdXRTZWN0aW9uXCI6IFwic3JjLUhvbWUtTG9naW4tTG9naW4tLS1pbnB1dFNlY3Rpb24tLS0yTzE5WFwiLFxuXHRcImJ1dHRvbkNvbnRhaW5lclwiOiBcInNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tYnV0dG9uQ29udGFpbmVyLS0tMjNxS09cIixcblx0XCJsb2dpbkJ0blwiOiBcInNyYy1Ib21lLUxvZ2luLUxvZ2luLS0tbG9naW5CdG4tLS0zZThhcFwiLFxuXHRcImNvbmZpcm1CdG5cIjogXCJzcmMtSG9tZS1Mb2dpbi1Mb2dpbi0tLWNvbmZpcm1CdG4tLS0zS1RYRVwiLFxuXHRcInJlZ2lzdGVyQnRuXCI6IFwic3JjLUhvbWUtTG9naW4tTG9naW4tLS1yZWdpc3RlckJ0bi0tLXE0ejF2XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXI/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4vfi9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vc3JjL0hvbWUvTG9naW4vTG9naW4uc2Nzc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnNyYy1Ib21lLWhlYWRlci0tLWxvZ291dC0tLTFkTWxaOmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjbGVhcjogYm90aDsgfVxcblxcbi5zcmMtSG9tZS1oZWFkZXItLS1jb250YWluZXItLS0xX1BGbiBoMSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IH1cXG5cXG4uc3JjLUhvbWUtaGVhZGVyLS0taWNvbi0tLVVEVnZUIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jazsgfVxcblxcbi5zcmMtSG9tZS1oZWFkZXItLS1sb2dvdXQtLS0xZE1sWiB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBmbG9hdDogcmlnaHQ7IH1cXG4gIC5zcmMtSG9tZS1oZWFkZXItLS1sb2dvdXQtLS0xZE1sWiA6aG92ZXIge1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJsb2dvdXRcIjogXCJzcmMtSG9tZS1oZWFkZXItLS1sb2dvdXQtLS0xZE1sWlwiLFxuXHRcImNvbnRhaW5lclwiOiBcInNyYy1Ib21lLWhlYWRlci0tLWNvbnRhaW5lci0tLTFfUEZuXCIsXG5cdFwiaWNvblwiOiBcInNyYy1Ib21lLWhlYWRlci0tLWljb24tLS1VRFZ2VFwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuL34vc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9Ib21lL2hlYWRlci5zY3NzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuc3JjLWNvbXBvbmVudHMtdGVzdDEtLS1jb250YWluZXItLS1hMmxGSCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcImNvbnRhaW5lclwiOiBcInNyYy1jb21wb25lbnRzLXRlc3QxLS0tY29udGFpbmVyLS0tYTJsRkhcIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmxvY2FsSWRlbnROYW1lPVtwYXRoXVtuYW1lXS0tLVtsb2NhbF0tLS1baGFzaDpiYXNlNjQ6NV0hLi9+L3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9zcmMvY29tcG9uZW50cy90ZXN0MS5zY3NzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuc3JjLWNvbXBvbmVudHMtdGVzdDItLS1jb250YWluZXItLS0ya3JJOCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbmV4cG9ydHMubG9jYWxzID0ge1xuXHRcImNvbnRhaW5lclwiOiBcInNyYy1jb21wb25lbnRzLXRlc3QyLS0tY29udGFpbmVyLS0tMmtySThcIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlcj9tb2R1bGVzJmxvY2FsSWRlbnROYW1lPVtwYXRoXVtuYW1lXS0tLVtsb2NhbF0tLS1baGFzaDpiYXNlNjQ6NV0hLi9+L3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9zcmMvY29tcG9uZW50cy90ZXN0Mi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuc3JjLWNvbXBvbmVudHMtdm9pY2VCdG4tLS1jb250YWluZXItLS1jd3lsdyB7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICBib3R0b206IDIlO1xcbiAgcmlnaHQ6IDIlO1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgd2lkdGg6IDhlbTtcXG4gIGhlaWdodDogMjBweDtcXG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiY29udGFpbmVyXCI6IFwic3JjLWNvbXBvbmVudHMtdm9pY2VCdG4tLS1jb250YWluZXItLS1jd3lsd1wiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuL34vc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9jb21wb25lbnRzL3ZvaWNlQnRuLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuL34vc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3NyYy9pbmRleC5zY3NzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgyMDEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDMyOCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlZHV4L2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDQyKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg2MCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNzMpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDc4Mik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FudGQvbGliL21lc3NhZ2UvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoODY5KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi8uLi9zdHlsZS9pbmRleC5sZXNzJyk7XG5cbnJlcXVpcmUoJy4vaW5kZXgubGVzcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnRkL2xpYi9pbnB1dC9zdHlsZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi8uLi9zdHlsZS9pbmRleC5sZXNzJyk7XG5cbnJlcXVpcmUoJy4vaW5kZXgubGVzcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnRkL2xpYi9sYXlvdXQvc3R5bGUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiB7IGU6IGZhbHNlLCB2OiBleGVjKCkgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IGU6IHRydWUsIHY6IGUgfTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcGVyZm9ybS5qc1xuLy8gbW9kdWxlIGlkID0gMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvbWlzZS1yZXNvbHZlLmpzXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi9faHRtbCcpO1xudmFyIGNlbCA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgc2V0VGFzayA9IGdsb2JhbC5zZXRJbW1lZGlhdGU7XG52YXIgY2xlYXJUYXNrID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xudmFyIE1lc3NhZ2VDaGFubmVsID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsO1xudmFyIERpc3BhdGNoID0gZ2xvYmFsLkRpc3BhdGNoO1xudmFyIGNvdW50ZXIgPSAwO1xudmFyIHF1ZXVlID0ge307XG52YXIgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG52YXIgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaWQgPSArdGhpcztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICBpZiAocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZiAoIXNldFRhc2sgfHwgIWNsZWFyVGFzaykge1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgaSA9IDE7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCkge1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZiAocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBTcGhlcmUgKEpTIGdhbWUgZW5naW5lKSBEaXNwYXRjaCBBUElcbiAgfSBlbHNlIGlmIChEaXNwYXRjaCAmJiBEaXNwYXRjaC5ub3cpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgRGlzcGF0Y2gubm93KGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYgKE1lc3NhZ2VDaGFubmVsKSB7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYgKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qc1xuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEVOVElUSUVTID0gW1snQWFjdXRlJywgWzE5M11dLCBbJ2FhY3V0ZScsIFsyMjVdXSwgWydBYnJldmUnLCBbMjU4XV0sIFsnYWJyZXZlJywgWzI1OV1dLCBbJ2FjJywgWzg3NjZdXSwgWydhY2QnLCBbODc2N11dLCBbJ2FjRScsIFs4NzY2LCA4MTldXSwgWydBY2lyYycsIFsxOTRdXSwgWydhY2lyYycsIFsyMjZdXSwgWydhY3V0ZScsIFsxODBdXSwgWydBY3knLCBbMTA0MF1dLCBbJ2FjeScsIFsxMDcyXV0sIFsnQUVsaWcnLCBbMTk4XV0sIFsnYWVsaWcnLCBbMjMwXV0sIFsnYWYnLCBbODI4OV1dLCBbJ0FmcicsIFsxMjAwNjhdXSwgWydhZnInLCBbMTIwMDk0XV0sIFsnQWdyYXZlJywgWzE5Ml1dLCBbJ2FncmF2ZScsIFsyMjRdXSwgWydhbGVmc3ltJywgWzg1MDFdXSwgWydhbGVwaCcsIFs4NTAxXV0sIFsnQWxwaGEnLCBbOTEzXV0sIFsnYWxwaGEnLCBbOTQ1XV0sIFsnQW1hY3InLCBbMjU2XV0sIFsnYW1hY3InLCBbMjU3XV0sIFsnYW1hbGcnLCBbMTA4MTVdXSwgWydhbXAnLCBbMzhdXSwgWydBTVAnLCBbMzhdXSwgWydhbmRhbmQnLCBbMTA4MzddXSwgWydBbmQnLCBbMTA4MzVdXSwgWydhbmQnLCBbODc0M11dLCBbJ2FuZGQnLCBbMTA4NDRdXSwgWydhbmRzbG9wZScsIFsxMDg0MF1dLCBbJ2FuZHYnLCBbMTA4NDJdXSwgWydhbmcnLCBbODczNl1dLCBbJ2FuZ2UnLCBbMTA2NjBdXSwgWydhbmdsZScsIFs4NzM2XV0sIFsnYW5nbXNkYWEnLCBbMTA2NjRdXSwgWydhbmdtc2RhYicsIFsxMDY2NV1dLCBbJ2FuZ21zZGFjJywgWzEwNjY2XV0sIFsnYW5nbXNkYWQnLCBbMTA2NjddXSwgWydhbmdtc2RhZScsIFsxMDY2OF1dLCBbJ2FuZ21zZGFmJywgWzEwNjY5XV0sIFsnYW5nbXNkYWcnLCBbMTA2NzBdXSwgWydhbmdtc2RhaCcsIFsxMDY3MV1dLCBbJ2FuZ21zZCcsIFs4NzM3XV0sIFsnYW5ncnQnLCBbODczNV1dLCBbJ2FuZ3J0dmInLCBbODg5NF1dLCBbJ2FuZ3J0dmJkJywgWzEwNjUzXV0sIFsnYW5nc3BoJywgWzg3MzhdXSwgWydhbmdzdCcsIFsxOTddXSwgWydhbmd6YXJyJywgWzkwODRdXSwgWydBb2dvbicsIFsyNjBdXSwgWydhb2dvbicsIFsyNjFdXSwgWydBb3BmJywgWzEyMDEyMF1dLCBbJ2FvcGYnLCBbMTIwMTQ2XV0sIFsnYXBhY2lyJywgWzEwODYzXV0sIFsnYXAnLCBbODc3Nl1dLCBbJ2FwRScsIFsxMDg2NF1dLCBbJ2FwZScsIFs4Nzc4XV0sIFsnYXBpZCcsIFs4Nzc5XV0sIFsnYXBvcycsIFszOV1dLCBbJ0FwcGx5RnVuY3Rpb24nLCBbODI4OV1dLCBbJ2FwcHJveCcsIFs4Nzc2XV0sIFsnYXBwcm94ZXEnLCBbODc3OF1dLCBbJ0FyaW5nJywgWzE5N11dLCBbJ2FyaW5nJywgWzIyOV1dLCBbJ0FzY3InLCBbMTE5OTY0XV0sIFsnYXNjcicsIFsxMTk5OTBdXSwgWydBc3NpZ24nLCBbODc4OF1dLCBbJ2FzdCcsIFs0Ml1dLCBbJ2FzeW1wJywgWzg3NzZdXSwgWydhc3ltcGVxJywgWzg3ODFdXSwgWydBdGlsZGUnLCBbMTk1XV0sIFsnYXRpbGRlJywgWzIyN11dLCBbJ0F1bWwnLCBbMTk2XV0sIFsnYXVtbCcsIFsyMjhdXSwgWydhd2NvbmludCcsIFs4NzU1XV0sIFsnYXdpbnQnLCBbMTA3NjldXSwgWydiYWNrY29uZycsIFs4NzgwXV0sIFsnYmFja2Vwc2lsb24nLCBbMTAxNF1dLCBbJ2JhY2twcmltZScsIFs4MjQ1XV0sIFsnYmFja3NpbScsIFs4NzY1XV0sIFsnYmFja3NpbWVxJywgWzg5MDldXSwgWydCYWNrc2xhc2gnLCBbODcyNl1dLCBbJ0JhcnYnLCBbMTA5ODNdXSwgWydiYXJ2ZWUnLCBbODg5M11dLCBbJ2JhcndlZCcsIFs4OTY1XV0sIFsnQmFyd2VkJywgWzg5NjZdXSwgWydiYXJ3ZWRnZScsIFs4OTY1XV0sIFsnYmJyaycsIFs5MTQxXV0sIFsnYmJya3RicmsnLCBbOTE0Ml1dLCBbJ2Jjb25nJywgWzg3ODBdXSwgWydCY3knLCBbMTA0MV1dLCBbJ2JjeScsIFsxMDczXV0sIFsnYmRxdW8nLCBbODIyMl1dLCBbJ2JlY2F1cycsIFs4NzU3XV0sIFsnYmVjYXVzZScsIFs4NzU3XV0sIFsnQmVjYXVzZScsIFs4NzU3XV0sIFsnYmVtcHR5dicsIFsxMDY3Ml1dLCBbJ2JlcHNpJywgWzEwMTRdXSwgWydiZXJub3UnLCBbODQ5Ml1dLCBbJ0Jlcm5vdWxsaXMnLCBbODQ5Ml1dLCBbJ0JldGEnLCBbOTE0XV0sIFsnYmV0YScsIFs5NDZdXSwgWydiZXRoJywgWzg1MDJdXSwgWydiZXR3ZWVuJywgWzg4MTJdXSwgWydCZnInLCBbMTIwMDY5XV0sIFsnYmZyJywgWzEyMDA5NV1dLCBbJ2JpZ2NhcCcsIFs4ODk4XV0sIFsnYmlnY2lyYycsIFs5NzExXV0sIFsnYmlnY3VwJywgWzg4OTldXSwgWydiaWdvZG90JywgWzEwNzUyXV0sIFsnYmlnb3BsdXMnLCBbMTA3NTNdXSwgWydiaWdvdGltZXMnLCBbMTA3NTRdXSwgWydiaWdzcWN1cCcsIFsxMDc1OF1dLCBbJ2JpZ3N0YXInLCBbOTczM11dLCBbJ2JpZ3RyaWFuZ2xlZG93bicsIFs5NjYxXV0sIFsnYmlndHJpYW5nbGV1cCcsIFs5NjUxXV0sIFsnYmlndXBsdXMnLCBbMTA3NTZdXSwgWydiaWd2ZWUnLCBbODg5N11dLCBbJ2JpZ3dlZGdlJywgWzg4OTZdXSwgWydia2Fyb3cnLCBbMTA1MDldXSwgWydibGFja2xvemVuZ2UnLCBbMTA3MzFdXSwgWydibGFja3NxdWFyZScsIFs5NjQyXV0sIFsnYmxhY2t0cmlhbmdsZScsIFs5NjUyXV0sIFsnYmxhY2t0cmlhbmdsZWRvd24nLCBbOTY2Ml1dLCBbJ2JsYWNrdHJpYW5nbGVsZWZ0JywgWzk2NjZdXSwgWydibGFja3RyaWFuZ2xlcmlnaHQnLCBbOTY1Nl1dLCBbJ2JsYW5rJywgWzkyNTFdXSwgWydibGsxMicsIFs5NjE4XV0sIFsnYmxrMTQnLCBbOTYxN11dLCBbJ2JsazM0JywgWzk2MTldXSwgWydibG9jaycsIFs5NjA4XV0sIFsnYm5lJywgWzYxLCA4NDIxXV0sIFsnYm5lcXVpdicsIFs4ODAxLCA4NDIxXV0sIFsnYk5vdCcsIFsxMDk4OV1dLCBbJ2Jub3QnLCBbODk3Nl1dLCBbJ0JvcGYnLCBbMTIwMTIxXV0sIFsnYm9wZicsIFsxMjAxNDddXSwgWydib3QnLCBbODg2OV1dLCBbJ2JvdHRvbScsIFs4ODY5XV0sIFsnYm93dGllJywgWzg5MDRdXSwgWydib3hib3gnLCBbMTA2OTddXSwgWydib3hkbCcsIFs5NDg4XV0sIFsnYm94ZEwnLCBbOTU1N11dLCBbJ2JveERsJywgWzk1NThdXSwgWydib3hETCcsIFs5NTU5XV0sIFsnYm94ZHInLCBbOTQ4NF1dLCBbJ2JveGRSJywgWzk1NTRdXSwgWydib3hEcicsIFs5NTU1XV0sIFsnYm94RFInLCBbOTU1Nl1dLCBbJ2JveGgnLCBbOTQ3Ml1dLCBbJ2JveEgnLCBbOTU1Ml1dLCBbJ2JveGhkJywgWzk1MTZdXSwgWydib3hIZCcsIFs5NTcyXV0sIFsnYm94aEQnLCBbOTU3M11dLCBbJ2JveEhEJywgWzk1NzRdXSwgWydib3hodScsIFs5NTI0XV0sIFsnYm94SHUnLCBbOTU3NV1dLCBbJ2JveGhVJywgWzk1NzZdXSwgWydib3hIVScsIFs5NTc3XV0sIFsnYm94bWludXMnLCBbODg2M11dLCBbJ2JveHBsdXMnLCBbODg2Ml1dLCBbJ2JveHRpbWVzJywgWzg4NjRdXSwgWydib3h1bCcsIFs5NDk2XV0sIFsnYm94dUwnLCBbOTU2M11dLCBbJ2JveFVsJywgWzk1NjRdXSwgWydib3hVTCcsIFs5NTY1XV0sIFsnYm94dXInLCBbOTQ5Ml1dLCBbJ2JveHVSJywgWzk1NjBdXSwgWydib3hVcicsIFs5NTYxXV0sIFsnYm94VVInLCBbOTU2Ml1dLCBbJ2JveHYnLCBbOTQ3NF1dLCBbJ2JveFYnLCBbOTU1M11dLCBbJ2JveHZoJywgWzk1MzJdXSwgWydib3h2SCcsIFs5NTc4XV0sIFsnYm94VmgnLCBbOTU3OV1dLCBbJ2JveFZIJywgWzk1ODBdXSwgWydib3h2bCcsIFs5NTA4XV0sIFsnYm94dkwnLCBbOTU2OV1dLCBbJ2JveFZsJywgWzk1NzBdXSwgWydib3hWTCcsIFs5NTcxXV0sIFsnYm94dnInLCBbOTUwMF1dLCBbJ2JveHZSJywgWzk1NjZdXSwgWydib3hWcicsIFs5NTY3XV0sIFsnYm94VlInLCBbOTU2OF1dLCBbJ2JwcmltZScsIFs4MjQ1XV0sIFsnYnJldmUnLCBbNzI4XV0sIFsnQnJldmUnLCBbNzI4XV0sIFsnYnJ2YmFyJywgWzE2Nl1dLCBbJ2JzY3InLCBbMTE5OTkxXV0sIFsnQnNjcicsIFs4NDkyXV0sIFsnYnNlbWknLCBbODI3MV1dLCBbJ2JzaW0nLCBbODc2NV1dLCBbJ2JzaW1lJywgWzg5MDldXSwgWydic29sYicsIFsxMDY5M11dLCBbJ2Jzb2wnLCBbOTJdXSwgWydic29saHN1YicsIFsxMDE4NF1dLCBbJ2J1bGwnLCBbODIyNl1dLCBbJ2J1bGxldCcsIFs4MjI2XV0sIFsnYnVtcCcsIFs4NzgyXV0sIFsnYnVtcEUnLCBbMTA5MjZdXSwgWydidW1wZScsIFs4NzgzXV0sIFsnQnVtcGVxJywgWzg3ODJdXSwgWydidW1wZXEnLCBbODc4M11dLCBbJ0NhY3V0ZScsIFsyNjJdXSwgWydjYWN1dGUnLCBbMjYzXV0sIFsnY2FwYW5kJywgWzEwODIwXV0sIFsnY2FwYnJjdXAnLCBbMTA4MjVdXSwgWydjYXBjYXAnLCBbMTA4MjddXSwgWydjYXAnLCBbODc0NV1dLCBbJ0NhcCcsIFs4OTE0XV0sIFsnY2FwY3VwJywgWzEwODIzXV0sIFsnY2FwZG90JywgWzEwODE2XV0sIFsnQ2FwaXRhbERpZmZlcmVudGlhbEQnLCBbODUxN11dLCBbJ2NhcHMnLCBbODc0NSwgNjUwMjRdXSwgWydjYXJldCcsIFs4MjU3XV0sIFsnY2Fyb24nLCBbNzExXV0sIFsnQ2F5bGV5cycsIFs4NDkzXV0sIFsnY2NhcHMnLCBbMTA4MjldXSwgWydDY2Fyb24nLCBbMjY4XV0sIFsnY2Nhcm9uJywgWzI2OV1dLCBbJ0NjZWRpbCcsIFsxOTldXSwgWydjY2VkaWwnLCBbMjMxXV0sIFsnQ2NpcmMnLCBbMjY0XV0sIFsnY2NpcmMnLCBbMjY1XV0sIFsnQ2NvbmludCcsIFs4NzUyXV0sIFsnY2N1cHMnLCBbMTA4MjhdXSwgWydjY3Vwc3NtJywgWzEwODMyXV0sIFsnQ2RvdCcsIFsyNjZdXSwgWydjZG90JywgWzI2N11dLCBbJ2NlZGlsJywgWzE4NF1dLCBbJ0NlZGlsbGEnLCBbMTg0XV0sIFsnY2VtcHR5dicsIFsxMDY3NF1dLCBbJ2NlbnQnLCBbMTYyXV0sIFsnY2VudGVyZG90JywgWzE4M11dLCBbJ0NlbnRlckRvdCcsIFsxODNdXSwgWydjZnInLCBbMTIwMDk2XV0sIFsnQ2ZyJywgWzg0OTNdXSwgWydDSGN5JywgWzEwNjNdXSwgWydjaGN5JywgWzEwOTVdXSwgWydjaGVjaycsIFsxMDAwM11dLCBbJ2NoZWNrbWFyaycsIFsxMDAwM11dLCBbJ0NoaScsIFs5MzVdXSwgWydjaGknLCBbOTY3XV0sIFsnY2lyYycsIFs3MTBdXSwgWydjaXJjZXEnLCBbODc5MV1dLCBbJ2NpcmNsZWFycm93bGVmdCcsIFs4NjM0XV0sIFsnY2lyY2xlYXJyb3dyaWdodCcsIFs4NjM1XV0sIFsnY2lyY2xlZGFzdCcsIFs4ODU5XV0sIFsnY2lyY2xlZGNpcmMnLCBbODg1OF1dLCBbJ2NpcmNsZWRkYXNoJywgWzg4NjFdXSwgWydDaXJjbGVEb3QnLCBbODg1N11dLCBbJ2NpcmNsZWRSJywgWzE3NF1dLCBbJ2NpcmNsZWRTJywgWzk0MTZdXSwgWydDaXJjbGVNaW51cycsIFs4ODU0XV0sIFsnQ2lyY2xlUGx1cycsIFs4ODUzXV0sIFsnQ2lyY2xlVGltZXMnLCBbODg1NV1dLCBbJ2NpcicsIFs5Njc1XV0sIFsnY2lyRScsIFsxMDY5MV1dLCBbJ2NpcmUnLCBbODc5MV1dLCBbJ2NpcmZuaW50JywgWzEwNzY4XV0sIFsnY2lybWlkJywgWzEwOTkxXV0sIFsnY2lyc2NpcicsIFsxMDY5MF1dLCBbJ0Nsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbCcsIFs4NzU0XV0sIFsnY2x1YnMnLCBbOTgyN11dLCBbJ2NsdWJzdWl0JywgWzk4MjddXSwgWydjb2xvbicsIFs1OF1dLCBbJ0NvbG9uJywgWzg3NTldXSwgWydDb2xvbmUnLCBbMTA4NjhdXSwgWydjb2xvbmUnLCBbODc4OF1dLCBbJ2NvbG9uZXEnLCBbODc4OF1dLCBbJ2NvbW1hJywgWzQ0XV0sIFsnY29tbWF0JywgWzY0XV0sIFsnY29tcCcsIFs4NzA1XV0sIFsnY29tcGZuJywgWzg3MjhdXSwgWydjb21wbGVtZW50JywgWzg3MDVdXSwgWydjb21wbGV4ZXMnLCBbODQ1MF1dLCBbJ2NvbmcnLCBbODc3M11dLCBbJ2Nvbmdkb3QnLCBbMTA4NjFdXSwgWydDb25ncnVlbnQnLCBbODgwMV1dLCBbJ2NvbmludCcsIFs4NzUwXV0sIFsnQ29uaW50JywgWzg3NTFdXSwgWydDb250b3VySW50ZWdyYWwnLCBbODc1MF1dLCBbJ2NvcGYnLCBbMTIwMTQ4XV0sIFsnQ29wZicsIFs4NDUwXV0sIFsnY29wcm9kJywgWzg3MjBdXSwgWydDb3Byb2R1Y3QnLCBbODcyMF1dLCBbJ2NvcHknLCBbMTY5XV0sIFsnQ09QWScsIFsxNjldXSwgWydjb3B5c3InLCBbODQ3MV1dLCBbJ0NvdW50ZXJDbG9ja3dpc2VDb250b3VySW50ZWdyYWwnLCBbODc1NV1dLCBbJ2NyYXJyJywgWzg2MjldXSwgWydjcm9zcycsIFsxMDAwN11dLCBbJ0Nyb3NzJywgWzEwNzk5XV0sIFsnQ3NjcicsIFsxMTk5NjZdXSwgWydjc2NyJywgWzExOTk5Ml1dLCBbJ2NzdWInLCBbMTA5NTldXSwgWydjc3ViZScsIFsxMDk2MV1dLCBbJ2NzdXAnLCBbMTA5NjBdXSwgWydjc3VwZScsIFsxMDk2Ml1dLCBbJ2N0ZG90JywgWzg5NDNdXSwgWydjdWRhcnJsJywgWzEwNTUyXV0sIFsnY3VkYXJycicsIFsxMDU0OV1dLCBbJ2N1ZXByJywgWzg5MjZdXSwgWydjdWVzYycsIFs4OTI3XV0sIFsnY3VsYXJyJywgWzg2MzBdXSwgWydjdWxhcnJwJywgWzEwNTU3XV0sIFsnY3VwYnJjYXAnLCBbMTA4MjRdXSwgWydjdXBjYXAnLCBbMTA4MjJdXSwgWydDdXBDYXAnLCBbODc4MV1dLCBbJ2N1cCcsIFs4NzQ2XV0sIFsnQ3VwJywgWzg5MTVdXSwgWydjdXBjdXAnLCBbMTA4MjZdXSwgWydjdXBkb3QnLCBbODg0NV1dLCBbJ2N1cG9yJywgWzEwODIxXV0sIFsnY3VwcycsIFs4NzQ2LCA2NTAyNF1dLCBbJ2N1cmFycicsIFs4NjMxXV0sIFsnY3VyYXJybScsIFsxMDU1Nl1dLCBbJ2N1cmx5ZXFwcmVjJywgWzg5MjZdXSwgWydjdXJseWVxc3VjYycsIFs4OTI3XV0sIFsnY3VybHl2ZWUnLCBbODkxMF1dLCBbJ2N1cmx5d2VkZ2UnLCBbODkxMV1dLCBbJ2N1cnJlbicsIFsxNjRdXSwgWydjdXJ2ZWFycm93bGVmdCcsIFs4NjMwXV0sIFsnY3VydmVhcnJvd3JpZ2h0JywgWzg2MzFdXSwgWydjdXZlZScsIFs4OTEwXV0sIFsnY3V3ZWQnLCBbODkxMV1dLCBbJ2N3Y29uaW50JywgWzg3NTRdXSwgWydjd2ludCcsIFs4NzUzXV0sIFsnY3lsY3R5JywgWzkwMDVdXSwgWydkYWdnZXInLCBbODIyNF1dLCBbJ0RhZ2dlcicsIFs4MjI1XV0sIFsnZGFsZXRoJywgWzg1MDRdXSwgWydkYXJyJywgWzg1OTVdXSwgWydEYXJyJywgWzg2MDldXSwgWydkQXJyJywgWzg2NTldXSwgWydkYXNoJywgWzgyMDhdXSwgWydEYXNodicsIFsxMDk4MF1dLCBbJ2Rhc2h2JywgWzg4NjddXSwgWydkYmthcm93JywgWzEwNTExXV0sIFsnZGJsYWMnLCBbNzMzXV0sIFsnRGNhcm9uJywgWzI3MF1dLCBbJ2RjYXJvbicsIFsyNzFdXSwgWydEY3knLCBbMTA0NF1dLCBbJ2RjeScsIFsxMDc2XV0sIFsnZGRhZ2dlcicsIFs4MjI1XV0sIFsnZGRhcnInLCBbODY1MF1dLCBbJ0REJywgWzg1MTddXSwgWydkZCcsIFs4NTE4XV0sIFsnRERvdHJhaGQnLCBbMTA1MTNdXSwgWydkZG90c2VxJywgWzEwODcxXV0sIFsnZGVnJywgWzE3Nl1dLCBbJ0RlbCcsIFs4NzExXV0sIFsnRGVsdGEnLCBbOTE2XV0sIFsnZGVsdGEnLCBbOTQ4XV0sIFsnZGVtcHR5dicsIFsxMDY3M11dLCBbJ2RmaXNodCcsIFsxMDYyM11dLCBbJ0RmcicsIFsxMjAwNzFdXSwgWydkZnInLCBbMTIwMDk3XV0sIFsnZEhhcicsIFsxMDU5N11dLCBbJ2RoYXJsJywgWzg2NDNdXSwgWydkaGFycicsIFs4NjQyXV0sIFsnRGlhY3JpdGljYWxBY3V0ZScsIFsxODBdXSwgWydEaWFjcml0aWNhbERvdCcsIFs3MjldXSwgWydEaWFjcml0aWNhbERvdWJsZUFjdXRlJywgWzczM11dLCBbJ0RpYWNyaXRpY2FsR3JhdmUnLCBbOTZdXSwgWydEaWFjcml0aWNhbFRpbGRlJywgWzczMl1dLCBbJ2RpYW0nLCBbODkwMF1dLCBbJ2RpYW1vbmQnLCBbODkwMF1dLCBbJ0RpYW1vbmQnLCBbODkwMF1dLCBbJ2RpYW1vbmRzdWl0JywgWzk4MzBdXSwgWydkaWFtcycsIFs5ODMwXV0sIFsnZGllJywgWzE2OF1dLCBbJ0RpZmZlcmVudGlhbEQnLCBbODUxOF1dLCBbJ2RpZ2FtbWEnLCBbOTg5XV0sIFsnZGlzaW4nLCBbODk0Nl1dLCBbJ2RpdicsIFsyNDddXSwgWydkaXZpZGUnLCBbMjQ3XV0sIFsnZGl2aWRlb250aW1lcycsIFs4OTAzXV0sIFsnZGl2b254JywgWzg5MDNdXSwgWydESmN5JywgWzEwMjZdXSwgWydkamN5JywgWzExMDZdXSwgWydkbGNvcm4nLCBbODk5MF1dLCBbJ2RsY3JvcCcsIFs4OTczXV0sIFsnZG9sbGFyJywgWzM2XV0sIFsnRG9wZicsIFsxMjAxMjNdXSwgWydkb3BmJywgWzEyMDE0OV1dLCBbJ0RvdCcsIFsxNjhdXSwgWydkb3QnLCBbNzI5XV0sIFsnRG90RG90JywgWzg0MTJdXSwgWydkb3RlcScsIFs4Nzg0XV0sIFsnZG90ZXFkb3QnLCBbODc4NV1dLCBbJ0RvdEVxdWFsJywgWzg3ODRdXSwgWydkb3RtaW51cycsIFs4NzYwXV0sIFsnZG90cGx1cycsIFs4NzI0XV0sIFsnZG90c3F1YXJlJywgWzg4NjVdXSwgWydkb3VibGViYXJ3ZWRnZScsIFs4OTY2XV0sIFsnRG91YmxlQ29udG91ckludGVncmFsJywgWzg3NTFdXSwgWydEb3VibGVEb3QnLCBbMTY4XV0sIFsnRG91YmxlRG93bkFycm93JywgWzg2NTldXSwgWydEb3VibGVMZWZ0QXJyb3cnLCBbODY1Nl1dLCBbJ0RvdWJsZUxlZnRSaWdodEFycm93JywgWzg2NjBdXSwgWydEb3VibGVMZWZ0VGVlJywgWzEwOTgwXV0sIFsnRG91YmxlTG9uZ0xlZnRBcnJvdycsIFsxMDIzMl1dLCBbJ0RvdWJsZUxvbmdMZWZ0UmlnaHRBcnJvdycsIFsxMDIzNF1dLCBbJ0RvdWJsZUxvbmdSaWdodEFycm93JywgWzEwMjMzXV0sIFsnRG91YmxlUmlnaHRBcnJvdycsIFs4NjU4XV0sIFsnRG91YmxlUmlnaHRUZWUnLCBbODg3Ml1dLCBbJ0RvdWJsZVVwQXJyb3cnLCBbODY1N11dLCBbJ0RvdWJsZVVwRG93bkFycm93JywgWzg2NjFdXSwgWydEb3VibGVWZXJ0aWNhbEJhcicsIFs4NzQxXV0sIFsnRG93bkFycm93QmFyJywgWzEwNTE1XV0sIFsnZG93bmFycm93JywgWzg1OTVdXSwgWydEb3duQXJyb3cnLCBbODU5NV1dLCBbJ0Rvd25hcnJvdycsIFs4NjU5XV0sIFsnRG93bkFycm93VXBBcnJvdycsIFs4NjkzXV0sIFsnRG93bkJyZXZlJywgWzc4NV1dLCBbJ2Rvd25kb3duYXJyb3dzJywgWzg2NTBdXSwgWydkb3duaGFycG9vbmxlZnQnLCBbODY0M11dLCBbJ2Rvd25oYXJwb29ucmlnaHQnLCBbODY0Ml1dLCBbJ0Rvd25MZWZ0UmlnaHRWZWN0b3InLCBbMTA1NzZdXSwgWydEb3duTGVmdFRlZVZlY3RvcicsIFsxMDU5MF1dLCBbJ0Rvd25MZWZ0VmVjdG9yQmFyJywgWzEwNTgyXV0sIFsnRG93bkxlZnRWZWN0b3InLCBbODYzN11dLCBbJ0Rvd25SaWdodFRlZVZlY3RvcicsIFsxMDU5MV1dLCBbJ0Rvd25SaWdodFZlY3RvckJhcicsIFsxMDU4M11dLCBbJ0Rvd25SaWdodFZlY3RvcicsIFs4NjQxXV0sIFsnRG93blRlZUFycm93JywgWzg2MTVdXSwgWydEb3duVGVlJywgWzg4NjhdXSwgWydkcmJrYXJvdycsIFsxMDUxMl1dLCBbJ2RyY29ybicsIFs4OTkxXV0sIFsnZHJjcm9wJywgWzg5NzJdXSwgWydEc2NyJywgWzExOTk2N11dLCBbJ2RzY3InLCBbMTE5OTkzXV0sIFsnRFNjeScsIFsxMDI5XV0sIFsnZHNjeScsIFsxMTA5XV0sIFsnZHNvbCcsIFsxMDc0Ml1dLCBbJ0RzdHJvaycsIFsyNzJdXSwgWydkc3Ryb2snLCBbMjczXV0sIFsnZHRkb3QnLCBbODk0NV1dLCBbJ2R0cmknLCBbOTY2M11dLCBbJ2R0cmlmJywgWzk2NjJdXSwgWydkdWFycicsIFs4NjkzXV0sIFsnZHVoYXInLCBbMTA2MDddXSwgWydkd2FuZ2xlJywgWzEwNjYyXV0sIFsnRFpjeScsIFsxMDM5XV0sIFsnZHpjeScsIFsxMTE5XV0sIFsnZHppZ3JhcnInLCBbMTAyMzldXSwgWydFYWN1dGUnLCBbMjAxXV0sIFsnZWFjdXRlJywgWzIzM11dLCBbJ2Vhc3RlcicsIFsxMDg2Ml1dLCBbJ0VjYXJvbicsIFsyODJdXSwgWydlY2Fyb24nLCBbMjgzXV0sIFsnRWNpcmMnLCBbMjAyXV0sIFsnZWNpcmMnLCBbMjM0XV0sIFsnZWNpcicsIFs4NzkwXV0sIFsnZWNvbG9uJywgWzg3ODldXSwgWydFY3knLCBbMTA2OV1dLCBbJ2VjeScsIFsxMTAxXV0sIFsnZUREb3QnLCBbMTA4NzFdXSwgWydFZG90JywgWzI3OF1dLCBbJ2Vkb3QnLCBbMjc5XV0sIFsnZURvdCcsIFs4Nzg1XV0sIFsnZWUnLCBbODUxOV1dLCBbJ2VmRG90JywgWzg3ODZdXSwgWydFZnInLCBbMTIwMDcyXV0sIFsnZWZyJywgWzEyMDA5OF1dLCBbJ2VnJywgWzEwOTA2XV0sIFsnRWdyYXZlJywgWzIwMF1dLCBbJ2VncmF2ZScsIFsyMzJdXSwgWydlZ3MnLCBbMTA5MDJdXSwgWydlZ3Nkb3QnLCBbMTA5MDRdXSwgWydlbCcsIFsxMDkwNV1dLCBbJ0VsZW1lbnQnLCBbODcxMl1dLCBbJ2VsaW50ZXJzJywgWzkxOTFdXSwgWydlbGwnLCBbODQ2N11dLCBbJ2VscycsIFsxMDkwMV1dLCBbJ2Vsc2RvdCcsIFsxMDkwM11dLCBbJ0VtYWNyJywgWzI3NF1dLCBbJ2VtYWNyJywgWzI3NV1dLCBbJ2VtcHR5JywgWzg3MDldXSwgWydlbXB0eXNldCcsIFs4NzA5XV0sIFsnRW1wdHlTbWFsbFNxdWFyZScsIFs5NzIzXV0sIFsnZW1wdHl2JywgWzg3MDldXSwgWydFbXB0eVZlcnlTbWFsbFNxdWFyZScsIFs5NjQzXV0sIFsnZW1zcDEzJywgWzgxOTZdXSwgWydlbXNwMTQnLCBbODE5N11dLCBbJ2Vtc3AnLCBbODE5NV1dLCBbJ0VORycsIFszMzBdXSwgWydlbmcnLCBbMzMxXV0sIFsnZW5zcCcsIFs4MTk0XV0sIFsnRW9nb24nLCBbMjgwXV0sIFsnZW9nb24nLCBbMjgxXV0sIFsnRW9wZicsIFsxMjAxMjRdXSwgWydlb3BmJywgWzEyMDE1MF1dLCBbJ2VwYXInLCBbODkxN11dLCBbJ2VwYXJzbCcsIFsxMDcyM11dLCBbJ2VwbHVzJywgWzEwODY1XV0sIFsnZXBzaScsIFs5NDldXSwgWydFcHNpbG9uJywgWzkxN11dLCBbJ2Vwc2lsb24nLCBbOTQ5XV0sIFsnZXBzaXYnLCBbMTAxM11dLCBbJ2VxY2lyYycsIFs4NzkwXV0sIFsnZXFjb2xvbicsIFs4Nzg5XV0sIFsnZXFzaW0nLCBbODc3MF1dLCBbJ2Vxc2xhbnRndHInLCBbMTA5MDJdXSwgWydlcXNsYW50bGVzcycsIFsxMDkwMV1dLCBbJ0VxdWFsJywgWzEwODY5XV0sIFsnZXF1YWxzJywgWzYxXV0sIFsnRXF1YWxUaWxkZScsIFs4NzcwXV0sIFsnZXF1ZXN0JywgWzg3OTldXSwgWydFcXVpbGlicml1bScsIFs4NjUyXV0sIFsnZXF1aXYnLCBbODgwMV1dLCBbJ2VxdWl2REQnLCBbMTA4NzJdXSwgWydlcXZwYXJzbCcsIFsxMDcyNV1dLCBbJ2VyYXJyJywgWzEwNjA5XV0sIFsnZXJEb3QnLCBbODc4N11dLCBbJ2VzY3InLCBbODQ5NV1dLCBbJ0VzY3InLCBbODQ5Nl1dLCBbJ2VzZG90JywgWzg3ODRdXSwgWydFc2ltJywgWzEwODY3XV0sIFsnZXNpbScsIFs4NzcwXV0sIFsnRXRhJywgWzkxOV1dLCBbJ2V0YScsIFs5NTFdXSwgWydFVEgnLCBbMjA4XV0sIFsnZXRoJywgWzI0MF1dLCBbJ0V1bWwnLCBbMjAzXV0sIFsnZXVtbCcsIFsyMzVdXSwgWydldXJvJywgWzgzNjRdXSwgWydleGNsJywgWzMzXV0sIFsnZXhpc3QnLCBbODcwN11dLCBbJ0V4aXN0cycsIFs4NzA3XV0sIFsnZXhwZWN0YXRpb24nLCBbODQ5Nl1dLCBbJ2V4cG9uZW50aWFsZScsIFs4NTE5XV0sIFsnRXhwb25lbnRpYWxFJywgWzg1MTldXSwgWydmYWxsaW5nZG90c2VxJywgWzg3ODZdXSwgWydGY3knLCBbMTA2MF1dLCBbJ2ZjeScsIFsxMDkyXV0sIFsnZmVtYWxlJywgWzk3OTJdXSwgWydmZmlsaWcnLCBbNjQyNTldXSwgWydmZmxpZycsIFs2NDI1Nl1dLCBbJ2ZmbGxpZycsIFs2NDI2MF1dLCBbJ0ZmcicsIFsxMjAwNzNdXSwgWydmZnInLCBbMTIwMDk5XV0sIFsnZmlsaWcnLCBbNjQyNTddXSwgWydGaWxsZWRTbWFsbFNxdWFyZScsIFs5NzI0XV0sIFsnRmlsbGVkVmVyeVNtYWxsU3F1YXJlJywgWzk2NDJdXSwgWydmamxpZycsIFsxMDIsIDEwNl1dLCBbJ2ZsYXQnLCBbOTgzN11dLCBbJ2ZsbGlnJywgWzY0MjU4XV0sIFsnZmx0bnMnLCBbOTY0OV1dLCBbJ2Zub2YnLCBbNDAyXV0sIFsnRm9wZicsIFsxMjAxMjVdXSwgWydmb3BmJywgWzEyMDE1MV1dLCBbJ2ZvcmFsbCcsIFs4NzA0XV0sIFsnRm9yQWxsJywgWzg3MDRdXSwgWydmb3JrJywgWzg5MTZdXSwgWydmb3JrdicsIFsxMDk2OV1dLCBbJ0ZvdXJpZXJ0cmYnLCBbODQ5N11dLCBbJ2ZwYXJ0aW50JywgWzEwNzY1XV0sIFsnZnJhYzEyJywgWzE4OV1dLCBbJ2ZyYWMxMycsIFs4NTMxXV0sIFsnZnJhYzE0JywgWzE4OF1dLCBbJ2ZyYWMxNScsIFs4NTMzXV0sIFsnZnJhYzE2JywgWzg1MzddXSwgWydmcmFjMTgnLCBbODUzOV1dLCBbJ2ZyYWMyMycsIFs4NTMyXV0sIFsnZnJhYzI1JywgWzg1MzRdXSwgWydmcmFjMzQnLCBbMTkwXV0sIFsnZnJhYzM1JywgWzg1MzVdXSwgWydmcmFjMzgnLCBbODU0MF1dLCBbJ2ZyYWM0NScsIFs4NTM2XV0sIFsnZnJhYzU2JywgWzg1MzhdXSwgWydmcmFjNTgnLCBbODU0MV1dLCBbJ2ZyYWM3OCcsIFs4NTQyXV0sIFsnZnJhc2wnLCBbODI2MF1dLCBbJ2Zyb3duJywgWzg5OTRdXSwgWydmc2NyJywgWzExOTk5NV1dLCBbJ0ZzY3InLCBbODQ5N11dLCBbJ2dhY3V0ZScsIFs1MDFdXSwgWydHYW1tYScsIFs5MTVdXSwgWydnYW1tYScsIFs5NDddXSwgWydHYW1tYWQnLCBbOTg4XV0sIFsnZ2FtbWFkJywgWzk4OV1dLCBbJ2dhcCcsIFsxMDg4Nl1dLCBbJ0dicmV2ZScsIFsyODZdXSwgWydnYnJldmUnLCBbMjg3XV0sIFsnR2NlZGlsJywgWzI5MF1dLCBbJ0djaXJjJywgWzI4NF1dLCBbJ2djaXJjJywgWzI4NV1dLCBbJ0djeScsIFsxMDQzXV0sIFsnZ2N5JywgWzEwNzVdXSwgWydHZG90JywgWzI4OF1dLCBbJ2dkb3QnLCBbMjg5XV0sIFsnZ2UnLCBbODgwNV1dLCBbJ2dFJywgWzg4MDddXSwgWydnRWwnLCBbMTA4OTJdXSwgWydnZWwnLCBbODkyM11dLCBbJ2dlcScsIFs4ODA1XV0sIFsnZ2VxcScsIFs4ODA3XV0sIFsnZ2Vxc2xhbnQnLCBbMTA4NzhdXSwgWydnZXNjYycsIFsxMDkyMV1dLCBbJ2dlcycsIFsxMDg3OF1dLCBbJ2dlc2RvdCcsIFsxMDg4MF1dLCBbJ2dlc2RvdG8nLCBbMTA4ODJdXSwgWydnZXNkb3RvbCcsIFsxMDg4NF1dLCBbJ2dlc2wnLCBbODkyMywgNjUwMjRdXSwgWydnZXNsZXMnLCBbMTA5MDBdXSwgWydHZnInLCBbMTIwMDc0XV0sIFsnZ2ZyJywgWzEyMDEwMF1dLCBbJ2dnJywgWzg4MTFdXSwgWydHZycsIFs4OTIxXV0sIFsnZ2dnJywgWzg5MjFdXSwgWydnaW1lbCcsIFs4NTAzXV0sIFsnR0pjeScsIFsxMDI3XV0sIFsnZ2pjeScsIFsxMTA3XV0sIFsnZ2xhJywgWzEwOTE3XV0sIFsnZ2wnLCBbODgyM11dLCBbJ2dsRScsIFsxMDg5OF1dLCBbJ2dsaicsIFsxMDkxNl1dLCBbJ2duYXAnLCBbMTA4OTBdXSwgWydnbmFwcHJveCcsIFsxMDg5MF1dLCBbJ2duZScsIFsxMDg4OF1dLCBbJ2duRScsIFs4ODA5XV0sIFsnZ25lcScsIFsxMDg4OF1dLCBbJ2duZXFxJywgWzg4MDldXSwgWydnbnNpbScsIFs4OTM1XV0sIFsnR29wZicsIFsxMjAxMjZdXSwgWydnb3BmJywgWzEyMDE1Ml1dLCBbJ2dyYXZlJywgWzk2XV0sIFsnR3JlYXRlckVxdWFsJywgWzg4MDVdXSwgWydHcmVhdGVyRXF1YWxMZXNzJywgWzg5MjNdXSwgWydHcmVhdGVyRnVsbEVxdWFsJywgWzg4MDddXSwgWydHcmVhdGVyR3JlYXRlcicsIFsxMDkxNF1dLCBbJ0dyZWF0ZXJMZXNzJywgWzg4MjNdXSwgWydHcmVhdGVyU2xhbnRFcXVhbCcsIFsxMDg3OF1dLCBbJ0dyZWF0ZXJUaWxkZScsIFs4ODE5XV0sIFsnR3NjcicsIFsxMTk5NzBdXSwgWydnc2NyJywgWzg0NThdXSwgWydnc2ltJywgWzg4MTldXSwgWydnc2ltZScsIFsxMDg5NF1dLCBbJ2dzaW1sJywgWzEwODk2XV0sIFsnZ3RjYycsIFsxMDkxOV1dLCBbJ2d0Y2lyJywgWzEwODc0XV0sIFsnZ3QnLCBbNjJdXSwgWydHVCcsIFs2Ml1dLCBbJ0d0JywgWzg4MTFdXSwgWydndGRvdCcsIFs4OTE5XV0sIFsnZ3RsUGFyJywgWzEwNjQ1XV0sIFsnZ3RxdWVzdCcsIFsxMDg3Nl1dLCBbJ2d0cmFwcHJveCcsIFsxMDg4Nl1dLCBbJ2d0cmFycicsIFsxMDYxNl1dLCBbJ2d0cmRvdCcsIFs4OTE5XV0sIFsnZ3RyZXFsZXNzJywgWzg5MjNdXSwgWydndHJlcXFsZXNzJywgWzEwODkyXV0sIFsnZ3RybGVzcycsIFs4ODIzXV0sIFsnZ3Ryc2ltJywgWzg4MTldXSwgWydndmVydG5lcXEnLCBbODgwOSwgNjUwMjRdXSwgWydndm5FJywgWzg4MDksIDY1MDI0XV0sIFsnSGFjZWsnLCBbNzExXV0sIFsnaGFpcnNwJywgWzgyMDJdXSwgWydoYWxmJywgWzE4OV1dLCBbJ2hhbWlsdCcsIFs4NDU5XV0sIFsnSEFSRGN5JywgWzEwNjZdXSwgWydoYXJkY3knLCBbMTA5OF1dLCBbJ2hhcnJjaXInLCBbMTA1NjhdXSwgWydoYXJyJywgWzg1OTZdXSwgWydoQXJyJywgWzg2NjBdXSwgWydoYXJydycsIFs4NjIxXV0sIFsnSGF0JywgWzk0XV0sIFsnaGJhcicsIFs4NDYzXV0sIFsnSGNpcmMnLCBbMjkyXV0sIFsnaGNpcmMnLCBbMjkzXV0sIFsnaGVhcnRzJywgWzk4MjldXSwgWydoZWFydHN1aXQnLCBbOTgyOV1dLCBbJ2hlbGxpcCcsIFs4MjMwXV0sIFsnaGVyY29uJywgWzg4ODldXSwgWydoZnInLCBbMTIwMTAxXV0sIFsnSGZyJywgWzg0NjBdXSwgWydIaWxiZXJ0U3BhY2UnLCBbODQ1OV1dLCBbJ2hrc2Vhcm93JywgWzEwNTMzXV0sIFsnaGtzd2Fyb3cnLCBbMTA1MzRdXSwgWydob2FycicsIFs4NzAzXV0sIFsnaG9tdGh0JywgWzg3NjNdXSwgWydob29rbGVmdGFycm93JywgWzg2MTddXSwgWydob29rcmlnaHRhcnJvdycsIFs4NjE4XV0sIFsnaG9wZicsIFsxMjAxNTNdXSwgWydIb3BmJywgWzg0NjFdXSwgWydob3JiYXInLCBbODIxM11dLCBbJ0hvcml6b250YWxMaW5lJywgWzk0NzJdXSwgWydoc2NyJywgWzExOTk5N11dLCBbJ0hzY3InLCBbODQ1OV1dLCBbJ2hzbGFzaCcsIFs4NDYzXV0sIFsnSHN0cm9rJywgWzI5NF1dLCBbJ2hzdHJvaycsIFsyOTVdXSwgWydIdW1wRG93bkh1bXAnLCBbODc4Ml1dLCBbJ0h1bXBFcXVhbCcsIFs4NzgzXV0sIFsnaHlidWxsJywgWzgyNTldXSwgWydoeXBoZW4nLCBbODIwOF1dLCBbJ0lhY3V0ZScsIFsyMDVdXSwgWydpYWN1dGUnLCBbMjM3XV0sIFsnaWMnLCBbODI5MV1dLCBbJ0ljaXJjJywgWzIwNl1dLCBbJ2ljaXJjJywgWzIzOF1dLCBbJ0ljeScsIFsxMDQ4XV0sIFsnaWN5JywgWzEwODBdXSwgWydJZG90JywgWzMwNF1dLCBbJ0lFY3knLCBbMTA0NV1dLCBbJ2llY3knLCBbMTA3N11dLCBbJ2lleGNsJywgWzE2MV1dLCBbJ2lmZicsIFs4NjYwXV0sIFsnaWZyJywgWzEyMDEwMl1dLCBbJ0lmcicsIFs4NDY1XV0sIFsnSWdyYXZlJywgWzIwNF1dLCBbJ2lncmF2ZScsIFsyMzZdXSwgWydpaScsIFs4NTIwXV0sIFsnaWlpaW50JywgWzEwNzY0XV0sIFsnaWlpbnQnLCBbODc0OV1dLCBbJ2lpbmZpbicsIFsxMDcxNl1dLCBbJ2lpb3RhJywgWzg0ODldXSwgWydJSmxpZycsIFszMDZdXSwgWydpamxpZycsIFszMDddXSwgWydJbWFjcicsIFsyOThdXSwgWydpbWFjcicsIFsyOTldXSwgWydpbWFnZScsIFs4NDY1XV0sIFsnSW1hZ2luYXJ5SScsIFs4NTIwXV0sIFsnaW1hZ2xpbmUnLCBbODQ2NF1dLCBbJ2ltYWdwYXJ0JywgWzg0NjVdXSwgWydpbWF0aCcsIFszMDVdXSwgWydJbScsIFs4NDY1XV0sIFsnaW1vZicsIFs4ODg3XV0sIFsnaW1wZWQnLCBbNDM3XV0sIFsnSW1wbGllcycsIFs4NjU4XV0sIFsnaW5jYXJlJywgWzg0NTNdXSwgWydpbicsIFs4NzEyXV0sIFsnaW5maW4nLCBbODczNF1dLCBbJ2luZmludGllJywgWzEwNzE3XV0sIFsnaW5vZG90JywgWzMwNV1dLCBbJ2ludGNhbCcsIFs4ODkwXV0sIFsnaW50JywgWzg3NDddXSwgWydJbnQnLCBbODc0OF1dLCBbJ2ludGVnZXJzJywgWzg0ODRdXSwgWydJbnRlZ3JhbCcsIFs4NzQ3XV0sIFsnaW50ZXJjYWwnLCBbODg5MF1dLCBbJ0ludGVyc2VjdGlvbicsIFs4ODk4XV0sIFsnaW50bGFyaGsnLCBbMTA3NzVdXSwgWydpbnRwcm9kJywgWzEwODEyXV0sIFsnSW52aXNpYmxlQ29tbWEnLCBbODI5MV1dLCBbJ0ludmlzaWJsZVRpbWVzJywgWzgyOTBdXSwgWydJT2N5JywgWzEwMjVdXSwgWydpb2N5JywgWzExMDVdXSwgWydJb2dvbicsIFszMDJdXSwgWydpb2dvbicsIFszMDNdXSwgWydJb3BmJywgWzEyMDEyOF1dLCBbJ2lvcGYnLCBbMTIwMTU0XV0sIFsnSW90YScsIFs5MjFdXSwgWydpb3RhJywgWzk1M11dLCBbJ2lwcm9kJywgWzEwODEyXV0sIFsnaXF1ZXN0JywgWzE5MV1dLCBbJ2lzY3InLCBbMTE5OTk4XV0sIFsnSXNjcicsIFs4NDY0XV0sIFsnaXNpbicsIFs4NzEyXV0sIFsnaXNpbmRvdCcsIFs4OTQ5XV0sIFsnaXNpbkUnLCBbODk1M11dLCBbJ2lzaW5zJywgWzg5NDhdXSwgWydpc2luc3YnLCBbODk0N11dLCBbJ2lzaW52JywgWzg3MTJdXSwgWydpdCcsIFs4MjkwXV0sIFsnSXRpbGRlJywgWzI5Nl1dLCBbJ2l0aWxkZScsIFsyOTddXSwgWydJdWtjeScsIFsxMDMwXV0sIFsnaXVrY3knLCBbMTExMF1dLCBbJ0l1bWwnLCBbMjA3XV0sIFsnaXVtbCcsIFsyMzldXSwgWydKY2lyYycsIFszMDhdXSwgWydqY2lyYycsIFszMDldXSwgWydKY3knLCBbMTA0OV1dLCBbJ2pjeScsIFsxMDgxXV0sIFsnSmZyJywgWzEyMDA3N11dLCBbJ2pmcicsIFsxMjAxMDNdXSwgWydqbWF0aCcsIFs1NjddXSwgWydKb3BmJywgWzEyMDEyOV1dLCBbJ2pvcGYnLCBbMTIwMTU1XV0sIFsnSnNjcicsIFsxMTk5NzNdXSwgWydqc2NyJywgWzExOTk5OV1dLCBbJ0pzZXJjeScsIFsxMDMyXV0sIFsnanNlcmN5JywgWzExMTJdXSwgWydKdWtjeScsIFsxMDI4XV0sIFsnanVrY3knLCBbMTEwOF1dLCBbJ0thcHBhJywgWzkyMl1dLCBbJ2thcHBhJywgWzk1NF1dLCBbJ2thcHBhdicsIFsxMDA4XV0sIFsnS2NlZGlsJywgWzMxMF1dLCBbJ2tjZWRpbCcsIFszMTFdXSwgWydLY3knLCBbMTA1MF1dLCBbJ2tjeScsIFsxMDgyXV0sIFsnS2ZyJywgWzEyMDA3OF1dLCBbJ2tmcicsIFsxMjAxMDRdXSwgWydrZ3JlZW4nLCBbMzEyXV0sIFsnS0hjeScsIFsxMDYxXV0sIFsna2hjeScsIFsxMDkzXV0sIFsnS0pjeScsIFsxMDM2XV0sIFsna2pjeScsIFsxMTE2XV0sIFsnS29wZicsIFsxMjAxMzBdXSwgWydrb3BmJywgWzEyMDE1Nl1dLCBbJ0tzY3InLCBbMTE5OTc0XV0sIFsna3NjcicsIFsxMjAwMDBdXSwgWydsQWFycicsIFs4NjY2XV0sIFsnTGFjdXRlJywgWzMxM11dLCBbJ2xhY3V0ZScsIFszMTRdXSwgWydsYWVtcHR5dicsIFsxMDY3Nl1dLCBbJ2xhZ3JhbicsIFs4NDY2XV0sIFsnTGFtYmRhJywgWzkyM11dLCBbJ2xhbWJkYScsIFs5NTVdXSwgWydsYW5nJywgWzEwMjE2XV0sIFsnTGFuZycsIFsxMDIxOF1dLCBbJ2xhbmdkJywgWzEwNjQxXV0sIFsnbGFuZ2xlJywgWzEwMjE2XV0sIFsnbGFwJywgWzEwODg1XV0sIFsnTGFwbGFjZXRyZicsIFs4NDY2XV0sIFsnbGFxdW8nLCBbMTcxXV0sIFsnbGFycmInLCBbODY3Nl1dLCBbJ2xhcnJiZnMnLCBbMTA1MjddXSwgWydsYXJyJywgWzg1OTJdXSwgWydMYXJyJywgWzg2MDZdXSwgWydsQXJyJywgWzg2NTZdXSwgWydsYXJyZnMnLCBbMTA1MjVdXSwgWydsYXJyaGsnLCBbODYxN11dLCBbJ2xhcnJscCcsIFs4NjE5XV0sIFsnbGFycnBsJywgWzEwNTUzXV0sIFsnbGFycnNpbScsIFsxMDYxMV1dLCBbJ2xhcnJ0bCcsIFs4NjEwXV0sIFsnbGF0YWlsJywgWzEwNTIxXV0sIFsnbEF0YWlsJywgWzEwNTIzXV0sIFsnbGF0JywgWzEwOTIzXV0sIFsnbGF0ZScsIFsxMDkyNV1dLCBbJ2xhdGVzJywgWzEwOTI1LCA2NTAyNF1dLCBbJ2xiYXJyJywgWzEwNTA4XV0sIFsnbEJhcnInLCBbMTA1MTBdXSwgWydsYmJyaycsIFsxMDA5OF1dLCBbJ2xicmFjZScsIFsxMjNdXSwgWydsYnJhY2snLCBbOTFdXSwgWydsYnJrZScsIFsxMDYzNV1dLCBbJ2xicmtzbGQnLCBbMTA2MzldXSwgWydsYnJrc2x1JywgWzEwNjM3XV0sIFsnTGNhcm9uJywgWzMxN11dLCBbJ2xjYXJvbicsIFszMThdXSwgWydMY2VkaWwnLCBbMzE1XV0sIFsnbGNlZGlsJywgWzMxNl1dLCBbJ2xjZWlsJywgWzg5NjhdXSwgWydsY3ViJywgWzEyM11dLCBbJ0xjeScsIFsxMDUxXV0sIFsnbGN5JywgWzEwODNdXSwgWydsZGNhJywgWzEwNTUwXV0sIFsnbGRxdW8nLCBbODIyMF1dLCBbJ2xkcXVvcicsIFs4MjIyXV0sIFsnbGRyZGhhcicsIFsxMDU5OV1dLCBbJ2xkcnVzaGFyJywgWzEwNTcxXV0sIFsnbGRzaCcsIFs4NjI2XV0sIFsnbGUnLCBbODgwNF1dLCBbJ2xFJywgWzg4MDZdXSwgWydMZWZ0QW5nbGVCcmFja2V0JywgWzEwMjE2XV0sIFsnTGVmdEFycm93QmFyJywgWzg2NzZdXSwgWydsZWZ0YXJyb3cnLCBbODU5Ml1dLCBbJ0xlZnRBcnJvdycsIFs4NTkyXV0sIFsnTGVmdGFycm93JywgWzg2NTZdXSwgWydMZWZ0QXJyb3dSaWdodEFycm93JywgWzg2NDZdXSwgWydsZWZ0YXJyb3d0YWlsJywgWzg2MTBdXSwgWydMZWZ0Q2VpbGluZycsIFs4OTY4XV0sIFsnTGVmdERvdWJsZUJyYWNrZXQnLCBbMTAyMTRdXSwgWydMZWZ0RG93blRlZVZlY3RvcicsIFsxMDU5M11dLCBbJ0xlZnREb3duVmVjdG9yQmFyJywgWzEwNTg1XV0sIFsnTGVmdERvd25WZWN0b3InLCBbODY0M11dLCBbJ0xlZnRGbG9vcicsIFs4OTcwXV0sIFsnbGVmdGhhcnBvb25kb3duJywgWzg2MzddXSwgWydsZWZ0aGFycG9vbnVwJywgWzg2MzZdXSwgWydsZWZ0bGVmdGFycm93cycsIFs4NjQ3XV0sIFsnbGVmdHJpZ2h0YXJyb3cnLCBbODU5Nl1dLCBbJ0xlZnRSaWdodEFycm93JywgWzg1OTZdXSwgWydMZWZ0cmlnaHRhcnJvdycsIFs4NjYwXV0sIFsnbGVmdHJpZ2h0YXJyb3dzJywgWzg2NDZdXSwgWydsZWZ0cmlnaHRoYXJwb29ucycsIFs4NjUxXV0sIFsnbGVmdHJpZ2h0c3F1aWdhcnJvdycsIFs4NjIxXV0sIFsnTGVmdFJpZ2h0VmVjdG9yJywgWzEwNTc0XV0sIFsnTGVmdFRlZUFycm93JywgWzg2MTJdXSwgWydMZWZ0VGVlJywgWzg4NjddXSwgWydMZWZ0VGVlVmVjdG9yJywgWzEwNTg2XV0sIFsnbGVmdHRocmVldGltZXMnLCBbODkwN11dLCBbJ0xlZnRUcmlhbmdsZUJhcicsIFsxMDcwM11dLCBbJ0xlZnRUcmlhbmdsZScsIFs4ODgyXV0sIFsnTGVmdFRyaWFuZ2xlRXF1YWwnLCBbODg4NF1dLCBbJ0xlZnRVcERvd25WZWN0b3InLCBbMTA1NzddXSwgWydMZWZ0VXBUZWVWZWN0b3InLCBbMTA1OTJdXSwgWydMZWZ0VXBWZWN0b3JCYXInLCBbMTA1ODRdXSwgWydMZWZ0VXBWZWN0b3InLCBbODYzOV1dLCBbJ0xlZnRWZWN0b3JCYXInLCBbMTA1NzhdXSwgWydMZWZ0VmVjdG9yJywgWzg2MzZdXSwgWydsRWcnLCBbMTA4OTFdXSwgWydsZWcnLCBbODkyMl1dLCBbJ2xlcScsIFs4ODA0XV0sIFsnbGVxcScsIFs4ODA2XV0sIFsnbGVxc2xhbnQnLCBbMTA4NzddXSwgWydsZXNjYycsIFsxMDkyMF1dLCBbJ2xlcycsIFsxMDg3N11dLCBbJ2xlc2RvdCcsIFsxMDg3OV1dLCBbJ2xlc2RvdG8nLCBbMTA4ODFdXSwgWydsZXNkb3RvcicsIFsxMDg4M11dLCBbJ2xlc2cnLCBbODkyMiwgNjUwMjRdXSwgWydsZXNnZXMnLCBbMTA4OTldXSwgWydsZXNzYXBwcm94JywgWzEwODg1XV0sIFsnbGVzc2RvdCcsIFs4OTE4XV0sIFsnbGVzc2VxZ3RyJywgWzg5MjJdXSwgWydsZXNzZXFxZ3RyJywgWzEwODkxXV0sIFsnTGVzc0VxdWFsR3JlYXRlcicsIFs4OTIyXV0sIFsnTGVzc0Z1bGxFcXVhbCcsIFs4ODA2XV0sIFsnTGVzc0dyZWF0ZXInLCBbODgyMl1dLCBbJ2xlc3NndHInLCBbODgyMl1dLCBbJ0xlc3NMZXNzJywgWzEwOTEzXV0sIFsnbGVzc3NpbScsIFs4ODE4XV0sIFsnTGVzc1NsYW50RXF1YWwnLCBbMTA4NzddXSwgWydMZXNzVGlsZGUnLCBbODgxOF1dLCBbJ2xmaXNodCcsIFsxMDYyMF1dLCBbJ2xmbG9vcicsIFs4OTcwXV0sIFsnTGZyJywgWzEyMDA3OV1dLCBbJ2xmcicsIFsxMjAxMDVdXSwgWydsZycsIFs4ODIyXV0sIFsnbGdFJywgWzEwODk3XV0sIFsnbEhhcicsIFsxMDU5NF1dLCBbJ2xoYXJkJywgWzg2MzddXSwgWydsaGFydScsIFs4NjM2XV0sIFsnbGhhcnVsJywgWzEwNjAyXV0sIFsnbGhibGsnLCBbOTYwNF1dLCBbJ0xKY3knLCBbMTAzM11dLCBbJ2xqY3knLCBbMTExM11dLCBbJ2xsYXJyJywgWzg2NDddXSwgWydsbCcsIFs4ODEwXV0sIFsnTGwnLCBbODkyMF1dLCBbJ2xsY29ybmVyJywgWzg5OTBdXSwgWydMbGVmdGFycm93JywgWzg2NjZdXSwgWydsbGhhcmQnLCBbMTA2MDNdXSwgWydsbHRyaScsIFs5NzIyXV0sIFsnTG1pZG90JywgWzMxOV1dLCBbJ2xtaWRvdCcsIFszMjBdXSwgWydsbW91c3RhY2hlJywgWzkxMzZdXSwgWydsbW91c3QnLCBbOTEzNl1dLCBbJ2xuYXAnLCBbMTA4ODldXSwgWydsbmFwcHJveCcsIFsxMDg4OV1dLCBbJ2xuZScsIFsxMDg4N11dLCBbJ2xuRScsIFs4ODA4XV0sIFsnbG5lcScsIFsxMDg4N11dLCBbJ2xuZXFxJywgWzg4MDhdXSwgWydsbnNpbScsIFs4OTM0XV0sIFsnbG9hbmcnLCBbMTAyMjBdXSwgWydsb2FycicsIFs4NzAxXV0sIFsnbG9icmsnLCBbMTAyMTRdXSwgWydsb25nbGVmdGFycm93JywgWzEwMjI5XV0sIFsnTG9uZ0xlZnRBcnJvdycsIFsxMDIyOV1dLCBbJ0xvbmdsZWZ0YXJyb3cnLCBbMTAyMzJdXSwgWydsb25nbGVmdHJpZ2h0YXJyb3cnLCBbMTAyMzFdXSwgWydMb25nTGVmdFJpZ2h0QXJyb3cnLCBbMTAyMzFdXSwgWydMb25nbGVmdHJpZ2h0YXJyb3cnLCBbMTAyMzRdXSwgWydsb25nbWFwc3RvJywgWzEwMjM2XV0sIFsnbG9uZ3JpZ2h0YXJyb3cnLCBbMTAyMzBdXSwgWydMb25nUmlnaHRBcnJvdycsIFsxMDIzMF1dLCBbJ0xvbmdyaWdodGFycm93JywgWzEwMjMzXV0sIFsnbG9vcGFycm93bGVmdCcsIFs4NjE5XV0sIFsnbG9vcGFycm93cmlnaHQnLCBbODYyMF1dLCBbJ2xvcGFyJywgWzEwNjI5XV0sIFsnTG9wZicsIFsxMjAxMzFdXSwgWydsb3BmJywgWzEyMDE1N11dLCBbJ2xvcGx1cycsIFsxMDc5N11dLCBbJ2xvdGltZXMnLCBbMTA4MDRdXSwgWydsb3dhc3QnLCBbODcyN11dLCBbJ2xvd2JhcicsIFs5NV1dLCBbJ0xvd2VyTGVmdEFycm93JywgWzg2MDFdXSwgWydMb3dlclJpZ2h0QXJyb3cnLCBbODYwMF1dLCBbJ2xveicsIFs5Njc0XV0sIFsnbG96ZW5nZScsIFs5Njc0XV0sIFsnbG96ZicsIFsxMDczMV1dLCBbJ2xwYXInLCBbNDBdXSwgWydscGFybHQnLCBbMTA2NDNdXSwgWydscmFycicsIFs4NjQ2XV0sIFsnbHJjb3JuZXInLCBbODk5MV1dLCBbJ2xyaGFyJywgWzg2NTFdXSwgWydscmhhcmQnLCBbMTA2MDVdXSwgWydscm0nLCBbODIwNl1dLCBbJ2xydHJpJywgWzg4OTVdXSwgWydsc2FxdW8nLCBbODI0OV1dLCBbJ2xzY3InLCBbMTIwMDAxXV0sIFsnTHNjcicsIFs4NDY2XV0sIFsnbHNoJywgWzg2MjRdXSwgWydMc2gnLCBbODYyNF1dLCBbJ2xzaW0nLCBbODgxOF1dLCBbJ2xzaW1lJywgWzEwODkzXV0sIFsnbHNpbWcnLCBbMTA4OTVdXSwgWydsc3FiJywgWzkxXV0sIFsnbHNxdW8nLCBbODIxNl1dLCBbJ2xzcXVvcicsIFs4MjE4XV0sIFsnTHN0cm9rJywgWzMyMV1dLCBbJ2xzdHJvaycsIFszMjJdXSwgWydsdGNjJywgWzEwOTE4XV0sIFsnbHRjaXInLCBbMTA4NzNdXSwgWydsdCcsIFs2MF1dLCBbJ0xUJywgWzYwXV0sIFsnTHQnLCBbODgxMF1dLCBbJ2x0ZG90JywgWzg5MThdXSwgWydsdGhyZWUnLCBbODkwN11dLCBbJ2x0aW1lcycsIFs4OTA1XV0sIFsnbHRsYXJyJywgWzEwNjE0XV0sIFsnbHRxdWVzdCcsIFsxMDg3NV1dLCBbJ2x0cmknLCBbOTY2N11dLCBbJ2x0cmllJywgWzg4ODRdXSwgWydsdHJpZicsIFs5NjY2XV0sIFsnbHRyUGFyJywgWzEwNjQ2XV0sIFsnbHVyZHNoYXInLCBbMTA1NzBdXSwgWydsdXJ1aGFyJywgWzEwNTk4XV0sIFsnbHZlcnRuZXFxJywgWzg4MDgsIDY1MDI0XV0sIFsnbHZuRScsIFs4ODA4LCA2NTAyNF1dLCBbJ21hY3InLCBbMTc1XV0sIFsnbWFsZScsIFs5Nzk0XV0sIFsnbWFsdCcsIFsxMDAxNl1dLCBbJ21hbHRlc2UnLCBbMTAwMTZdXSwgWydNYXAnLCBbMTA1MDFdXSwgWydtYXAnLCBbODYxNF1dLCBbJ21hcHN0bycsIFs4NjE0XV0sIFsnbWFwc3RvZG93bicsIFs4NjE1XV0sIFsnbWFwc3RvbGVmdCcsIFs4NjEyXV0sIFsnbWFwc3RvdXAnLCBbODYxM11dLCBbJ21hcmtlcicsIFs5NjQ2XV0sIFsnbWNvbW1hJywgWzEwNzkzXV0sIFsnTWN5JywgWzEwNTJdXSwgWydtY3knLCBbMTA4NF1dLCBbJ21kYXNoJywgWzgyMTJdXSwgWydtRERvdCcsIFs4NzYyXV0sIFsnbWVhc3VyZWRhbmdsZScsIFs4NzM3XV0sIFsnTWVkaXVtU3BhY2UnLCBbODI4N11dLCBbJ01lbGxpbnRyZicsIFs4NDk5XV0sIFsnTWZyJywgWzEyMDA4MF1dLCBbJ21mcicsIFsxMjAxMDZdXSwgWydtaG8nLCBbODQ4N11dLCBbJ21pY3JvJywgWzE4MV1dLCBbJ21pZGFzdCcsIFs0Ml1dLCBbJ21pZGNpcicsIFsxMDk5Ml1dLCBbJ21pZCcsIFs4NzM5XV0sIFsnbWlkZG90JywgWzE4M11dLCBbJ21pbnVzYicsIFs4ODYzXV0sIFsnbWludXMnLCBbODcyMl1dLCBbJ21pbnVzZCcsIFs4NzYwXV0sIFsnbWludXNkdScsIFsxMDc5NF1dLCBbJ01pbnVzUGx1cycsIFs4NzIzXV0sIFsnbWxjcCcsIFsxMDk3MV1dLCBbJ21sZHInLCBbODIzMF1dLCBbJ21ucGx1cycsIFs4NzIzXV0sIFsnbW9kZWxzJywgWzg4NzFdXSwgWydNb3BmJywgWzEyMDEzMl1dLCBbJ21vcGYnLCBbMTIwMTU4XV0sIFsnbXAnLCBbODcyM11dLCBbJ21zY3InLCBbMTIwMDAyXV0sIFsnTXNjcicsIFs4NDk5XV0sIFsnbXN0cG9zJywgWzg3NjZdXSwgWydNdScsIFs5MjRdXSwgWydtdScsIFs5NTZdXSwgWydtdWx0aW1hcCcsIFs4ODg4XV0sIFsnbXVtYXAnLCBbODg4OF1dLCBbJ25hYmxhJywgWzg3MTFdXSwgWydOYWN1dGUnLCBbMzIzXV0sIFsnbmFjdXRlJywgWzMyNF1dLCBbJ25hbmcnLCBbODczNiwgODQwMl1dLCBbJ25hcCcsIFs4Nzc3XV0sIFsnbmFwRScsIFsxMDg2NCwgODI0XV0sIFsnbmFwaWQnLCBbODc3OSwgODI0XV0sIFsnbmFwb3MnLCBbMzI5XV0sIFsnbmFwcHJveCcsIFs4Nzc3XV0sIFsnbmF0dXJhbCcsIFs5ODM4XV0sIFsnbmF0dXJhbHMnLCBbODQ2OV1dLCBbJ25hdHVyJywgWzk4MzhdXSwgWyduYnNwJywgWzE2MF1dLCBbJ25idW1wJywgWzg3ODIsIDgyNF1dLCBbJ25idW1wZScsIFs4NzgzLCA4MjRdXSwgWyduY2FwJywgWzEwODE5XV0sIFsnTmNhcm9uJywgWzMyN11dLCBbJ25jYXJvbicsIFszMjhdXSwgWydOY2VkaWwnLCBbMzI1XV0sIFsnbmNlZGlsJywgWzMyNl1dLCBbJ25jb25nJywgWzg3NzVdXSwgWyduY29uZ2RvdCcsIFsxMDg2MSwgODI0XV0sIFsnbmN1cCcsIFsxMDgxOF1dLCBbJ05jeScsIFsxMDUzXV0sIFsnbmN5JywgWzEwODVdXSwgWyduZGFzaCcsIFs4MjExXV0sIFsnbmVhcmhrJywgWzEwNTMyXV0sIFsnbmVhcnInLCBbODU5OV1dLCBbJ25lQXJyJywgWzg2NjNdXSwgWyduZWFycm93JywgWzg1OTldXSwgWyduZScsIFs4ODAwXV0sIFsnbmVkb3QnLCBbODc4NCwgODI0XV0sIFsnTmVnYXRpdmVNZWRpdW1TcGFjZScsIFs4MjAzXV0sIFsnTmVnYXRpdmVUaGlja1NwYWNlJywgWzgyMDNdXSwgWydOZWdhdGl2ZVRoaW5TcGFjZScsIFs4MjAzXV0sIFsnTmVnYXRpdmVWZXJ5VGhpblNwYWNlJywgWzgyMDNdXSwgWyduZXF1aXYnLCBbODgwMl1dLCBbJ25lc2VhcicsIFsxMDUzNl1dLCBbJ25lc2ltJywgWzg3NzAsIDgyNF1dLCBbJ05lc3RlZEdyZWF0ZXJHcmVhdGVyJywgWzg4MTFdXSwgWydOZXN0ZWRMZXNzTGVzcycsIFs4ODEwXV0sIFsnbmV4aXN0JywgWzg3MDhdXSwgWyduZXhpc3RzJywgWzg3MDhdXSwgWydOZnInLCBbMTIwMDgxXV0sIFsnbmZyJywgWzEyMDEwN11dLCBbJ25nRScsIFs4ODA3LCA4MjRdXSwgWyduZ2UnLCBbODgxN11dLCBbJ25nZXEnLCBbODgxN11dLCBbJ25nZXFxJywgWzg4MDcsIDgyNF1dLCBbJ25nZXFzbGFudCcsIFsxMDg3OCwgODI0XV0sIFsnbmdlcycsIFsxMDg3OCwgODI0XV0sIFsnbkdnJywgWzg5MjEsIDgyNF1dLCBbJ25nc2ltJywgWzg4MjFdXSwgWyduR3QnLCBbODgxMSwgODQwMl1dLCBbJ25ndCcsIFs4ODE1XV0sIFsnbmd0cicsIFs4ODE1XV0sIFsnbkd0dicsIFs4ODExLCA4MjRdXSwgWyduaGFycicsIFs4NjIyXV0sIFsnbmhBcnInLCBbODY1NF1dLCBbJ25ocGFyJywgWzEwOTk0XV0sIFsnbmknLCBbODcxNV1dLCBbJ25pcycsIFs4OTU2XV0sIFsnbmlzZCcsIFs4OTU0XV0sIFsnbml2JywgWzg3MTVdXSwgWydOSmN5JywgWzEwMzRdXSwgWyduamN5JywgWzExMTRdXSwgWydubGFycicsIFs4NjAyXV0sIFsnbmxBcnInLCBbODY1M11dLCBbJ25sZHInLCBbODIyOV1dLCBbJ25sRScsIFs4ODA2LCA4MjRdXSwgWydubGUnLCBbODgxNl1dLCBbJ25sZWZ0YXJyb3cnLCBbODYwMl1dLCBbJ25MZWZ0YXJyb3cnLCBbODY1M11dLCBbJ25sZWZ0cmlnaHRhcnJvdycsIFs4NjIyXV0sIFsnbkxlZnRyaWdodGFycm93JywgWzg2NTRdXSwgWydubGVxJywgWzg4MTZdXSwgWydubGVxcScsIFs4ODA2LCA4MjRdXSwgWydubGVxc2xhbnQnLCBbMTA4NzcsIDgyNF1dLCBbJ25sZXMnLCBbMTA4NzcsIDgyNF1dLCBbJ25sZXNzJywgWzg4MTRdXSwgWyduTGwnLCBbODkyMCwgODI0XV0sIFsnbmxzaW0nLCBbODgyMF1dLCBbJ25MdCcsIFs4ODEwLCA4NDAyXV0sIFsnbmx0JywgWzg4MTRdXSwgWydubHRyaScsIFs4OTM4XV0sIFsnbmx0cmllJywgWzg5NDBdXSwgWyduTHR2JywgWzg4MTAsIDgyNF1dLCBbJ25taWQnLCBbODc0MF1dLCBbJ05vQnJlYWsnLCBbODI4OF1dLCBbJ05vbkJyZWFraW5nU3BhY2UnLCBbMTYwXV0sIFsnbm9wZicsIFsxMjAxNTldXSwgWydOb3BmJywgWzg0NjldXSwgWydOb3QnLCBbMTA5ODhdXSwgWydub3QnLCBbMTcyXV0sIFsnTm90Q29uZ3J1ZW50JywgWzg4MDJdXSwgWydOb3RDdXBDYXAnLCBbODgxM11dLCBbJ05vdERvdWJsZVZlcnRpY2FsQmFyJywgWzg3NDJdXSwgWydOb3RFbGVtZW50JywgWzg3MTNdXSwgWydOb3RFcXVhbCcsIFs4ODAwXV0sIFsnTm90RXF1YWxUaWxkZScsIFs4NzcwLCA4MjRdXSwgWydOb3RFeGlzdHMnLCBbODcwOF1dLCBbJ05vdEdyZWF0ZXInLCBbODgxNV1dLCBbJ05vdEdyZWF0ZXJFcXVhbCcsIFs4ODE3XV0sIFsnTm90R3JlYXRlckZ1bGxFcXVhbCcsIFs4ODA3LCA4MjRdXSwgWydOb3RHcmVhdGVyR3JlYXRlcicsIFs4ODExLCA4MjRdXSwgWydOb3RHcmVhdGVyTGVzcycsIFs4ODI1XV0sIFsnTm90R3JlYXRlclNsYW50RXF1YWwnLCBbMTA4NzgsIDgyNF1dLCBbJ05vdEdyZWF0ZXJUaWxkZScsIFs4ODIxXV0sIFsnTm90SHVtcERvd25IdW1wJywgWzg3ODIsIDgyNF1dLCBbJ05vdEh1bXBFcXVhbCcsIFs4NzgzLCA4MjRdXSwgWydub3RpbicsIFs4NzEzXV0sIFsnbm90aW5kb3QnLCBbODk0OSwgODI0XV0sIFsnbm90aW5FJywgWzg5NTMsIDgyNF1dLCBbJ25vdGludmEnLCBbODcxM11dLCBbJ25vdGludmInLCBbODk1MV1dLCBbJ25vdGludmMnLCBbODk1MF1dLCBbJ05vdExlZnRUcmlhbmdsZUJhcicsIFsxMDcwMywgODI0XV0sIFsnTm90TGVmdFRyaWFuZ2xlJywgWzg5MzhdXSwgWydOb3RMZWZ0VHJpYW5nbGVFcXVhbCcsIFs4OTQwXV0sIFsnTm90TGVzcycsIFs4ODE0XV0sIFsnTm90TGVzc0VxdWFsJywgWzg4MTZdXSwgWydOb3RMZXNzR3JlYXRlcicsIFs4ODI0XV0sIFsnTm90TGVzc0xlc3MnLCBbODgxMCwgODI0XV0sIFsnTm90TGVzc1NsYW50RXF1YWwnLCBbMTA4NzcsIDgyNF1dLCBbJ05vdExlc3NUaWxkZScsIFs4ODIwXV0sIFsnTm90TmVzdGVkR3JlYXRlckdyZWF0ZXInLCBbMTA5MTQsIDgyNF1dLCBbJ05vdE5lc3RlZExlc3NMZXNzJywgWzEwOTEzLCA4MjRdXSwgWydub3RuaScsIFs4NzE2XV0sIFsnbm90bml2YScsIFs4NzE2XV0sIFsnbm90bml2YicsIFs4OTU4XV0sIFsnbm90bml2YycsIFs4OTU3XV0sIFsnTm90UHJlY2VkZXMnLCBbODgzMl1dLCBbJ05vdFByZWNlZGVzRXF1YWwnLCBbMTA5MjcsIDgyNF1dLCBbJ05vdFByZWNlZGVzU2xhbnRFcXVhbCcsIFs4OTI4XV0sIFsnTm90UmV2ZXJzZUVsZW1lbnQnLCBbODcxNl1dLCBbJ05vdFJpZ2h0VHJpYW5nbGVCYXInLCBbMTA3MDQsIDgyNF1dLCBbJ05vdFJpZ2h0VHJpYW5nbGUnLCBbODkzOV1dLCBbJ05vdFJpZ2h0VHJpYW5nbGVFcXVhbCcsIFs4OTQxXV0sIFsnTm90U3F1YXJlU3Vic2V0JywgWzg4NDcsIDgyNF1dLCBbJ05vdFNxdWFyZVN1YnNldEVxdWFsJywgWzg5MzBdXSwgWydOb3RTcXVhcmVTdXBlcnNldCcsIFs4ODQ4LCA4MjRdXSwgWydOb3RTcXVhcmVTdXBlcnNldEVxdWFsJywgWzg5MzFdXSwgWydOb3RTdWJzZXQnLCBbODgzNCwgODQwMl1dLCBbJ05vdFN1YnNldEVxdWFsJywgWzg4NDBdXSwgWydOb3RTdWNjZWVkcycsIFs4ODMzXV0sIFsnTm90U3VjY2VlZHNFcXVhbCcsIFsxMDkyOCwgODI0XV0sIFsnTm90U3VjY2VlZHNTbGFudEVxdWFsJywgWzg5MjldXSwgWydOb3RTdWNjZWVkc1RpbGRlJywgWzg4MzEsIDgyNF1dLCBbJ05vdFN1cGVyc2V0JywgWzg4MzUsIDg0MDJdXSwgWydOb3RTdXBlcnNldEVxdWFsJywgWzg4NDFdXSwgWydOb3RUaWxkZScsIFs4NzY5XV0sIFsnTm90VGlsZGVFcXVhbCcsIFs4NzcyXV0sIFsnTm90VGlsZGVGdWxsRXF1YWwnLCBbODc3NV1dLCBbJ05vdFRpbGRlVGlsZGUnLCBbODc3N11dLCBbJ05vdFZlcnRpY2FsQmFyJywgWzg3NDBdXSwgWyducGFyYWxsZWwnLCBbODc0Ml1dLCBbJ25wYXInLCBbODc0Ml1dLCBbJ25wYXJzbCcsIFsxMTAwNSwgODQyMV1dLCBbJ25wYXJ0JywgWzg3MDYsIDgyNF1dLCBbJ25wb2xpbnQnLCBbMTA3NzJdXSwgWyducHInLCBbODgzMl1dLCBbJ25wcmN1ZScsIFs4OTI4XV0sIFsnbnByZWMnLCBbODgzMl1dLCBbJ25wcmVjZXEnLCBbMTA5MjcsIDgyNF1dLCBbJ25wcmUnLCBbMTA5MjcsIDgyNF1dLCBbJ25yYXJyYycsIFsxMDU0NywgODI0XV0sIFsnbnJhcnInLCBbODYwM11dLCBbJ25yQXJyJywgWzg2NTVdXSwgWyducmFycncnLCBbODYwNSwgODI0XV0sIFsnbnJpZ2h0YXJyb3cnLCBbODYwM11dLCBbJ25SaWdodGFycm93JywgWzg2NTVdXSwgWyducnRyaScsIFs4OTM5XV0sIFsnbnJ0cmllJywgWzg5NDFdXSwgWyduc2MnLCBbODgzM11dLCBbJ25zY2N1ZScsIFs4OTI5XV0sIFsnbnNjZScsIFsxMDkyOCwgODI0XV0sIFsnTnNjcicsIFsxMTk5NzddXSwgWyduc2NyJywgWzEyMDAwM11dLCBbJ25zaG9ydG1pZCcsIFs4NzQwXV0sIFsnbnNob3J0cGFyYWxsZWwnLCBbODc0Ml1dLCBbJ25zaW0nLCBbODc2OV1dLCBbJ25zaW1lJywgWzg3NzJdXSwgWyduc2ltZXEnLCBbODc3Ml1dLCBbJ25zbWlkJywgWzg3NDBdXSwgWyduc3BhcicsIFs4NzQyXV0sIFsnbnNxc3ViZScsIFs4OTMwXV0sIFsnbnNxc3VwZScsIFs4OTMxXV0sIFsnbnN1YicsIFs4ODM2XV0sIFsnbnN1YkUnLCBbMTA5NDksIDgyNF1dLCBbJ25zdWJlJywgWzg4NDBdXSwgWyduc3Vic2V0JywgWzg4MzQsIDg0MDJdXSwgWyduc3Vic2V0ZXEnLCBbODg0MF1dLCBbJ25zdWJzZXRlcXEnLCBbMTA5NDksIDgyNF1dLCBbJ25zdWNjJywgWzg4MzNdXSwgWyduc3VjY2VxJywgWzEwOTI4LCA4MjRdXSwgWyduc3VwJywgWzg4MzddXSwgWyduc3VwRScsIFsxMDk1MCwgODI0XV0sIFsnbnN1cGUnLCBbODg0MV1dLCBbJ25zdXBzZXQnLCBbODgzNSwgODQwMl1dLCBbJ25zdXBzZXRlcScsIFs4ODQxXV0sIFsnbnN1cHNldGVxcScsIFsxMDk1MCwgODI0XV0sIFsnbnRnbCcsIFs4ODI1XV0sIFsnTnRpbGRlJywgWzIwOV1dLCBbJ250aWxkZScsIFsyNDFdXSwgWydudGxnJywgWzg4MjRdXSwgWydudHJpYW5nbGVsZWZ0JywgWzg5MzhdXSwgWydudHJpYW5nbGVsZWZ0ZXEnLCBbODk0MF1dLCBbJ250cmlhbmdsZXJpZ2h0JywgWzg5MzldXSwgWydudHJpYW5nbGVyaWdodGVxJywgWzg5NDFdXSwgWydOdScsIFs5MjVdXSwgWydudScsIFs5NTddXSwgWydudW0nLCBbMzVdXSwgWydudW1lcm8nLCBbODQ3MF1dLCBbJ251bXNwJywgWzgxOTldXSwgWydudmFwJywgWzg3ODEsIDg0MDJdXSwgWydudmRhc2gnLCBbODg3Nl1dLCBbJ252RGFzaCcsIFs4ODc3XV0sIFsnblZkYXNoJywgWzg4NzhdXSwgWyduVkRhc2gnLCBbODg3OV1dLCBbJ252Z2UnLCBbODgwNSwgODQwMl1dLCBbJ252Z3QnLCBbNjIsIDg0MDJdXSwgWydudkhhcnInLCBbMTA1MDBdXSwgWydudmluZmluJywgWzEwNzE4XV0sIFsnbnZsQXJyJywgWzEwNDk4XV0sIFsnbnZsZScsIFs4ODA0LCA4NDAyXV0sIFsnbnZsdCcsIFs2MCwgODQwMl1dLCBbJ252bHRyaWUnLCBbODg4NCwgODQwMl1dLCBbJ252ckFycicsIFsxMDQ5OV1dLCBbJ252cnRyaWUnLCBbODg4NSwgODQwMl1dLCBbJ252c2ltJywgWzg3NjQsIDg0MDJdXSwgWydud2FyaGsnLCBbMTA1MzFdXSwgWydud2FycicsIFs4NTk4XV0sIFsnbndBcnInLCBbODY2Ml1dLCBbJ253YXJyb3cnLCBbODU5OF1dLCBbJ253bmVhcicsIFsxMDUzNV1dLCBbJ09hY3V0ZScsIFsyMTFdXSwgWydvYWN1dGUnLCBbMjQzXV0sIFsnb2FzdCcsIFs4ODU5XV0sIFsnT2NpcmMnLCBbMjEyXV0sIFsnb2NpcmMnLCBbMjQ0XV0sIFsnb2NpcicsIFs4ODU4XV0sIFsnT2N5JywgWzEwNTRdXSwgWydvY3knLCBbMTA4Nl1dLCBbJ29kYXNoJywgWzg4NjFdXSwgWydPZGJsYWMnLCBbMzM2XV0sIFsnb2RibGFjJywgWzMzN11dLCBbJ29kaXYnLCBbMTA4MDhdXSwgWydvZG90JywgWzg4NTddXSwgWydvZHNvbGQnLCBbMTA2ODRdXSwgWydPRWxpZycsIFszMzhdXSwgWydvZWxpZycsIFszMzldXSwgWydvZmNpcicsIFsxMDY4N11dLCBbJ09mcicsIFsxMjAwODJdXSwgWydvZnInLCBbMTIwMTA4XV0sIFsnb2dvbicsIFs3MzFdXSwgWydPZ3JhdmUnLCBbMjEwXV0sIFsnb2dyYXZlJywgWzI0Ml1dLCBbJ29ndCcsIFsxMDY4OV1dLCBbJ29oYmFyJywgWzEwNjc3XV0sIFsnb2htJywgWzkzN11dLCBbJ29pbnQnLCBbODc1MF1dLCBbJ29sYXJyJywgWzg2MzRdXSwgWydvbGNpcicsIFsxMDY4Nl1dLCBbJ29sY3Jvc3MnLCBbMTA2ODNdXSwgWydvbGluZScsIFs4MjU0XV0sIFsnb2x0JywgWzEwNjg4XV0sIFsnT21hY3InLCBbMzMyXV0sIFsnb21hY3InLCBbMzMzXV0sIFsnT21lZ2EnLCBbOTM3XV0sIFsnb21lZ2EnLCBbOTY5XV0sIFsnT21pY3JvbicsIFs5MjddXSwgWydvbWljcm9uJywgWzk1OV1dLCBbJ29taWQnLCBbMTA2NzhdXSwgWydvbWludXMnLCBbODg1NF1dLCBbJ09vcGYnLCBbMTIwMTM0XV0sIFsnb29wZicsIFsxMjAxNjBdXSwgWydvcGFyJywgWzEwNjc5XV0sIFsnT3BlbkN1cmx5RG91YmxlUXVvdGUnLCBbODIyMF1dLCBbJ09wZW5DdXJseVF1b3RlJywgWzgyMTZdXSwgWydvcGVycCcsIFsxMDY4MV1dLCBbJ29wbHVzJywgWzg4NTNdXSwgWydvcmFycicsIFs4NjM1XV0sIFsnT3InLCBbMTA4MzZdXSwgWydvcicsIFs4NzQ0XV0sIFsnb3JkJywgWzEwODQ1XV0sIFsnb3JkZXInLCBbODUwMF1dLCBbJ29yZGVyb2YnLCBbODUwMF1dLCBbJ29yZGYnLCBbMTcwXV0sIFsnb3JkbScsIFsxODZdXSwgWydvcmlnb2YnLCBbODg4Nl1dLCBbJ29yb3InLCBbMTA4MzhdXSwgWydvcnNsb3BlJywgWzEwODM5XV0sIFsnb3J2JywgWzEwODQzXV0sIFsnb1MnLCBbOTQxNl1dLCBbJ09zY3InLCBbMTE5OTc4XV0sIFsnb3NjcicsIFs4NTAwXV0sIFsnT3NsYXNoJywgWzIxNl1dLCBbJ29zbGFzaCcsIFsyNDhdXSwgWydvc29sJywgWzg4NTZdXSwgWydPdGlsZGUnLCBbMjEzXV0sIFsnb3RpbGRlJywgWzI0NV1dLCBbJ290aW1lc2FzJywgWzEwODA2XV0sIFsnT3RpbWVzJywgWzEwODA3XV0sIFsnb3RpbWVzJywgWzg4NTVdXSwgWydPdW1sJywgWzIxNF1dLCBbJ291bWwnLCBbMjQ2XV0sIFsnb3ZiYXInLCBbOTAyMV1dLCBbJ092ZXJCYXInLCBbODI1NF1dLCBbJ092ZXJCcmFjZScsIFs5MTgyXV0sIFsnT3ZlckJyYWNrZXQnLCBbOTE0MF1dLCBbJ092ZXJQYXJlbnRoZXNpcycsIFs5MTgwXV0sIFsncGFyYScsIFsxODJdXSwgWydwYXJhbGxlbCcsIFs4NzQxXV0sIFsncGFyJywgWzg3NDFdXSwgWydwYXJzaW0nLCBbMTA5OTVdXSwgWydwYXJzbCcsIFsxMTAwNV1dLCBbJ3BhcnQnLCBbODcwNl1dLCBbJ1BhcnRpYWxEJywgWzg3MDZdXSwgWydQY3knLCBbMTA1NV1dLCBbJ3BjeScsIFsxMDg3XV0sIFsncGVyY250JywgWzM3XV0sIFsncGVyaW9kJywgWzQ2XV0sIFsncGVybWlsJywgWzgyNDBdXSwgWydwZXJwJywgWzg4NjldXSwgWydwZXJ0ZW5rJywgWzgyNDFdXSwgWydQZnInLCBbMTIwMDgzXV0sIFsncGZyJywgWzEyMDEwOV1dLCBbJ1BoaScsIFs5MzRdXSwgWydwaGknLCBbOTY2XV0sIFsncGhpdicsIFs5ODFdXSwgWydwaG1tYXQnLCBbODQ5OV1dLCBbJ3Bob25lJywgWzk3NDJdXSwgWydQaScsIFs5MjhdXSwgWydwaScsIFs5NjBdXSwgWydwaXRjaGZvcmsnLCBbODkxNl1dLCBbJ3BpdicsIFs5ODJdXSwgWydwbGFuY2snLCBbODQ2M11dLCBbJ3BsYW5ja2gnLCBbODQ2Ml1dLCBbJ3BsYW5rdicsIFs4NDYzXV0sIFsncGx1c2FjaXInLCBbMTA3ODddXSwgWydwbHVzYicsIFs4ODYyXV0sIFsncGx1c2NpcicsIFsxMDc4Nl1dLCBbJ3BsdXMnLCBbNDNdXSwgWydwbHVzZG8nLCBbODcyNF1dLCBbJ3BsdXNkdScsIFsxMDc4OV1dLCBbJ3BsdXNlJywgWzEwODY2XV0sIFsnUGx1c01pbnVzJywgWzE3N11dLCBbJ3BsdXNtbicsIFsxNzddXSwgWydwbHVzc2ltJywgWzEwNzkwXV0sIFsncGx1c3R3bycsIFsxMDc5MV1dLCBbJ3BtJywgWzE3N11dLCBbJ1BvaW5jYXJlcGxhbmUnLCBbODQ2MF1dLCBbJ3BvaW50aW50JywgWzEwNzczXV0sIFsncG9wZicsIFsxMjAxNjFdXSwgWydQb3BmJywgWzg0NzNdXSwgWydwb3VuZCcsIFsxNjNdXSwgWydwcmFwJywgWzEwOTM1XV0sIFsnUHInLCBbMTA5MzldXSwgWydwcicsIFs4ODI2XV0sIFsncHJjdWUnLCBbODgyOF1dLCBbJ3ByZWNhcHByb3gnLCBbMTA5MzVdXSwgWydwcmVjJywgWzg4MjZdXSwgWydwcmVjY3VybHllcScsIFs4ODI4XV0sIFsnUHJlY2VkZXMnLCBbODgyNl1dLCBbJ1ByZWNlZGVzRXF1YWwnLCBbMTA5MjddXSwgWydQcmVjZWRlc1NsYW50RXF1YWwnLCBbODgyOF1dLCBbJ1ByZWNlZGVzVGlsZGUnLCBbODgzMF1dLCBbJ3ByZWNlcScsIFsxMDkyN11dLCBbJ3ByZWNuYXBwcm94JywgWzEwOTM3XV0sIFsncHJlY25lcXEnLCBbMTA5MzNdXSwgWydwcmVjbnNpbScsIFs4OTM2XV0sIFsncHJlJywgWzEwOTI3XV0sIFsncHJFJywgWzEwOTMxXV0sIFsncHJlY3NpbScsIFs4ODMwXV0sIFsncHJpbWUnLCBbODI0Ml1dLCBbJ1ByaW1lJywgWzgyNDNdXSwgWydwcmltZXMnLCBbODQ3M11dLCBbJ3BybmFwJywgWzEwOTM3XV0sIFsncHJuRScsIFsxMDkzM11dLCBbJ3BybnNpbScsIFs4OTM2XV0sIFsncHJvZCcsIFs4NzE5XV0sIFsnUHJvZHVjdCcsIFs4NzE5XV0sIFsncHJvZmFsYXInLCBbOTAwNl1dLCBbJ3Byb2ZsaW5lJywgWzg5NzhdXSwgWydwcm9mc3VyZicsIFs4OTc5XV0sIFsncHJvcCcsIFs4NzMzXV0sIFsnUHJvcG9ydGlvbmFsJywgWzg3MzNdXSwgWydQcm9wb3J0aW9uJywgWzg3NTldXSwgWydwcm9wdG8nLCBbODczM11dLCBbJ3Byc2ltJywgWzg4MzBdXSwgWydwcnVyZWwnLCBbODg4MF1dLCBbJ1BzY3InLCBbMTE5OTc5XV0sIFsncHNjcicsIFsxMjAwMDVdXSwgWydQc2knLCBbOTM2XV0sIFsncHNpJywgWzk2OF1dLCBbJ3B1bmNzcCcsIFs4MjAwXV0sIFsnUWZyJywgWzEyMDA4NF1dLCBbJ3FmcicsIFsxMjAxMTBdXSwgWydxaW50JywgWzEwNzY0XV0sIFsncW9wZicsIFsxMjAxNjJdXSwgWydRb3BmJywgWzg0NzRdXSwgWydxcHJpbWUnLCBbODI3OV1dLCBbJ1FzY3InLCBbMTE5OTgwXV0sIFsncXNjcicsIFsxMjAwMDZdXSwgWydxdWF0ZXJuaW9ucycsIFs4NDYxXV0sIFsncXVhdGludCcsIFsxMDc3NF1dLCBbJ3F1ZXN0JywgWzYzXV0sIFsncXVlc3RlcScsIFs4Nzk5XV0sIFsncXVvdCcsIFszNF1dLCBbJ1FVT1QnLCBbMzRdXSwgWydyQWFycicsIFs4NjY3XV0sIFsncmFjZScsIFs4NzY1LCA4MTddXSwgWydSYWN1dGUnLCBbMzQwXV0sIFsncmFjdXRlJywgWzM0MV1dLCBbJ3JhZGljJywgWzg3MzBdXSwgWydyYWVtcHR5dicsIFsxMDY3NV1dLCBbJ3JhbmcnLCBbMTAyMTddXSwgWydSYW5nJywgWzEwMjE5XV0sIFsncmFuZ2QnLCBbMTA2NDJdXSwgWydyYW5nZScsIFsxMDY2MV1dLCBbJ3JhbmdsZScsIFsxMDIxN11dLCBbJ3JhcXVvJywgWzE4N11dLCBbJ3JhcnJhcCcsIFsxMDYxM11dLCBbJ3JhcnJiJywgWzg2NzddXSwgWydyYXJyYmZzJywgWzEwNTI4XV0sIFsncmFycmMnLCBbMTA1NDddXSwgWydyYXJyJywgWzg1OTRdXSwgWydSYXJyJywgWzg2MDhdXSwgWydyQXJyJywgWzg2NThdXSwgWydyYXJyZnMnLCBbMTA1MjZdXSwgWydyYXJyaGsnLCBbODYxOF1dLCBbJ3JhcnJscCcsIFs4NjIwXV0sIFsncmFycnBsJywgWzEwNTY1XV0sIFsncmFycnNpbScsIFsxMDYxMl1dLCBbJ1JhcnJ0bCcsIFsxMDUxOF1dLCBbJ3JhcnJ0bCcsIFs4NjExXV0sIFsncmFycncnLCBbODYwNV1dLCBbJ3JhdGFpbCcsIFsxMDUyMl1dLCBbJ3JBdGFpbCcsIFsxMDUyNF1dLCBbJ3JhdGlvJywgWzg3NThdXSwgWydyYXRpb25hbHMnLCBbODQ3NF1dLCBbJ3JiYXJyJywgWzEwNTA5XV0sIFsnckJhcnInLCBbMTA1MTFdXSwgWydSQmFycicsIFsxMDUxMl1dLCBbJ3JiYnJrJywgWzEwMDk5XV0sIFsncmJyYWNlJywgWzEyNV1dLCBbJ3JicmFjaycsIFs5M11dLCBbJ3JicmtlJywgWzEwNjM2XV0sIFsncmJya3NsZCcsIFsxMDYzOF1dLCBbJ3JicmtzbHUnLCBbMTA2NDBdXSwgWydSY2Fyb24nLCBbMzQ0XV0sIFsncmNhcm9uJywgWzM0NV1dLCBbJ1JjZWRpbCcsIFszNDJdXSwgWydyY2VkaWwnLCBbMzQzXV0sIFsncmNlaWwnLCBbODk2OV1dLCBbJ3JjdWInLCBbMTI1XV0sIFsnUmN5JywgWzEwNTZdXSwgWydyY3knLCBbMTA4OF1dLCBbJ3JkY2EnLCBbMTA1NTFdXSwgWydyZGxkaGFyJywgWzEwNjAxXV0sIFsncmRxdW8nLCBbODIyMV1dLCBbJ3JkcXVvcicsIFs4MjIxXV0sIFsnQ2xvc2VDdXJseURvdWJsZVF1b3RlJywgWzgyMjFdXSwgWydyZHNoJywgWzg2MjddXSwgWydyZWFsJywgWzg0NzZdXSwgWydyZWFsaW5lJywgWzg0NzVdXSwgWydyZWFscGFydCcsIFs4NDc2XV0sIFsncmVhbHMnLCBbODQ3N11dLCBbJ1JlJywgWzg0NzZdXSwgWydyZWN0JywgWzk2NDVdXSwgWydyZWcnLCBbMTc0XV0sIFsnUkVHJywgWzE3NF1dLCBbJ1JldmVyc2VFbGVtZW50JywgWzg3MTVdXSwgWydSZXZlcnNlRXF1aWxpYnJpdW0nLCBbODY1MV1dLCBbJ1JldmVyc2VVcEVxdWlsaWJyaXVtJywgWzEwNjA3XV0sIFsncmZpc2h0JywgWzEwNjIxXV0sIFsncmZsb29yJywgWzg5NzFdXSwgWydyZnInLCBbMTIwMTExXV0sIFsnUmZyJywgWzg0NzZdXSwgWydySGFyJywgWzEwNTk2XV0sIFsncmhhcmQnLCBbODY0MV1dLCBbJ3JoYXJ1JywgWzg2NDBdXSwgWydyaGFydWwnLCBbMTA2MDRdXSwgWydSaG8nLCBbOTI5XV0sIFsncmhvJywgWzk2MV1dLCBbJ3Job3YnLCBbMTAwOV1dLCBbJ1JpZ2h0QW5nbGVCcmFja2V0JywgWzEwMjE3XV0sIFsnUmlnaHRBcnJvd0JhcicsIFs4Njc3XV0sIFsncmlnaHRhcnJvdycsIFs4NTk0XV0sIFsnUmlnaHRBcnJvdycsIFs4NTk0XV0sIFsnUmlnaHRhcnJvdycsIFs4NjU4XV0sIFsnUmlnaHRBcnJvd0xlZnRBcnJvdycsIFs4NjQ0XV0sIFsncmlnaHRhcnJvd3RhaWwnLCBbODYxMV1dLCBbJ1JpZ2h0Q2VpbGluZycsIFs4OTY5XV0sIFsnUmlnaHREb3VibGVCcmFja2V0JywgWzEwMjE1XV0sIFsnUmlnaHREb3duVGVlVmVjdG9yJywgWzEwNTg5XV0sIFsnUmlnaHREb3duVmVjdG9yQmFyJywgWzEwNTgxXV0sIFsnUmlnaHREb3duVmVjdG9yJywgWzg2NDJdXSwgWydSaWdodEZsb29yJywgWzg5NzFdXSwgWydyaWdodGhhcnBvb25kb3duJywgWzg2NDFdXSwgWydyaWdodGhhcnBvb251cCcsIFs4NjQwXV0sIFsncmlnaHRsZWZ0YXJyb3dzJywgWzg2NDRdXSwgWydyaWdodGxlZnRoYXJwb29ucycsIFs4NjUyXV0sIFsncmlnaHRyaWdodGFycm93cycsIFs4NjQ5XV0sIFsncmlnaHRzcXVpZ2Fycm93JywgWzg2MDVdXSwgWydSaWdodFRlZUFycm93JywgWzg2MTRdXSwgWydSaWdodFRlZScsIFs4ODY2XV0sIFsnUmlnaHRUZWVWZWN0b3InLCBbMTA1ODddXSwgWydyaWdodHRocmVldGltZXMnLCBbODkwOF1dLCBbJ1JpZ2h0VHJpYW5nbGVCYXInLCBbMTA3MDRdXSwgWydSaWdodFRyaWFuZ2xlJywgWzg4ODNdXSwgWydSaWdodFRyaWFuZ2xlRXF1YWwnLCBbODg4NV1dLCBbJ1JpZ2h0VXBEb3duVmVjdG9yJywgWzEwNTc1XV0sIFsnUmlnaHRVcFRlZVZlY3RvcicsIFsxMDU4OF1dLCBbJ1JpZ2h0VXBWZWN0b3JCYXInLCBbMTA1ODBdXSwgWydSaWdodFVwVmVjdG9yJywgWzg2MzhdXSwgWydSaWdodFZlY3RvckJhcicsIFsxMDU3OV1dLCBbJ1JpZ2h0VmVjdG9yJywgWzg2NDBdXSwgWydyaW5nJywgWzczMF1dLCBbJ3Jpc2luZ2RvdHNlcScsIFs4Nzg3XV0sIFsncmxhcnInLCBbODY0NF1dLCBbJ3JsaGFyJywgWzg2NTJdXSwgWydybG0nLCBbODIwN11dLCBbJ3Jtb3VzdGFjaGUnLCBbOTEzN11dLCBbJ3Jtb3VzdCcsIFs5MTM3XV0sIFsncm5taWQnLCBbMTA5OTBdXSwgWydyb2FuZycsIFsxMDIyMV1dLCBbJ3JvYXJyJywgWzg3MDJdXSwgWydyb2JyaycsIFsxMDIxNV1dLCBbJ3JvcGFyJywgWzEwNjMwXV0sIFsncm9wZicsIFsxMjAxNjNdXSwgWydSb3BmJywgWzg0NzddXSwgWydyb3BsdXMnLCBbMTA3OThdXSwgWydyb3RpbWVzJywgWzEwODA1XV0sIFsnUm91bmRJbXBsaWVzJywgWzEwNjA4XV0sIFsncnBhcicsIFs0MV1dLCBbJ3JwYXJndCcsIFsxMDY0NF1dLCBbJ3JwcG9saW50JywgWzEwNzcwXV0sIFsncnJhcnInLCBbODY0OV1dLCBbJ1JyaWdodGFycm93JywgWzg2NjddXSwgWydyc2FxdW8nLCBbODI1MF1dLCBbJ3JzY3InLCBbMTIwMDA3XV0sIFsnUnNjcicsIFs4NDc1XV0sIFsncnNoJywgWzg2MjVdXSwgWydSc2gnLCBbODYyNV1dLCBbJ3JzcWInLCBbOTNdXSwgWydyc3F1bycsIFs4MjE3XV0sIFsncnNxdW9yJywgWzgyMTddXSwgWydDbG9zZUN1cmx5UXVvdGUnLCBbODIxN11dLCBbJ3J0aHJlZScsIFs4OTA4XV0sIFsncnRpbWVzJywgWzg5MDZdXSwgWydydHJpJywgWzk2NTddXSwgWydydHJpZScsIFs4ODg1XV0sIFsncnRyaWYnLCBbOTY1Nl1dLCBbJ3J0cmlsdHJpJywgWzEwNzAyXV0sIFsnUnVsZURlbGF5ZWQnLCBbMTA3NDBdXSwgWydydWx1aGFyJywgWzEwNjAwXV0sIFsncngnLCBbODQ3OF1dLCBbJ1NhY3V0ZScsIFszNDZdXSwgWydzYWN1dGUnLCBbMzQ3XV0sIFsnc2JxdW8nLCBbODIxOF1dLCBbJ3NjYXAnLCBbMTA5MzZdXSwgWydTY2Fyb24nLCBbMzUyXV0sIFsnc2Nhcm9uJywgWzM1M11dLCBbJ1NjJywgWzEwOTQwXV0sIFsnc2MnLCBbODgyN11dLCBbJ3NjY3VlJywgWzg4MjldXSwgWydzY2UnLCBbMTA5MjhdXSwgWydzY0UnLCBbMTA5MzJdXSwgWydTY2VkaWwnLCBbMzUwXV0sIFsnc2NlZGlsJywgWzM1MV1dLCBbJ1NjaXJjJywgWzM0OF1dLCBbJ3NjaXJjJywgWzM0OV1dLCBbJ3NjbmFwJywgWzEwOTM4XV0sIFsnc2NuRScsIFsxMDkzNF1dLCBbJ3NjbnNpbScsIFs4OTM3XV0sIFsnc2Nwb2xpbnQnLCBbMTA3NzFdXSwgWydzY3NpbScsIFs4ODMxXV0sIFsnU2N5JywgWzEwNTddXSwgWydzY3knLCBbMTA4OV1dLCBbJ3Nkb3RiJywgWzg4NjVdXSwgWydzZG90JywgWzg5MDFdXSwgWydzZG90ZScsIFsxMDg1NF1dLCBbJ3NlYXJoaycsIFsxMDUzM11dLCBbJ3NlYXJyJywgWzg2MDBdXSwgWydzZUFycicsIFs4NjY0XV0sIFsnc2VhcnJvdycsIFs4NjAwXV0sIFsnc2VjdCcsIFsxNjddXSwgWydzZW1pJywgWzU5XV0sIFsnc2Vzd2FyJywgWzEwNTM3XV0sIFsnc2V0bWludXMnLCBbODcyNl1dLCBbJ3NldG1uJywgWzg3MjZdXSwgWydzZXh0JywgWzEwMDM4XV0sIFsnU2ZyJywgWzEyMDA4Nl1dLCBbJ3NmcicsIFsxMjAxMTJdXSwgWydzZnJvd24nLCBbODk5NF1dLCBbJ3NoYXJwJywgWzk4MzldXSwgWydTSENIY3knLCBbMTA2NV1dLCBbJ3NoY2hjeScsIFsxMDk3XV0sIFsnU0hjeScsIFsxMDY0XV0sIFsnc2hjeScsIFsxMDk2XV0sIFsnU2hvcnREb3duQXJyb3cnLCBbODU5NV1dLCBbJ1Nob3J0TGVmdEFycm93JywgWzg1OTJdXSwgWydzaG9ydG1pZCcsIFs4NzM5XV0sIFsnc2hvcnRwYXJhbGxlbCcsIFs4NzQxXV0sIFsnU2hvcnRSaWdodEFycm93JywgWzg1OTRdXSwgWydTaG9ydFVwQXJyb3cnLCBbODU5M11dLCBbJ3NoeScsIFsxNzNdXSwgWydTaWdtYScsIFs5MzFdXSwgWydzaWdtYScsIFs5NjNdXSwgWydzaWdtYWYnLCBbOTYyXV0sIFsnc2lnbWF2JywgWzk2Ml1dLCBbJ3NpbScsIFs4NzY0XV0sIFsnc2ltZG90JywgWzEwODU4XV0sIFsnc2ltZScsIFs4NzcxXV0sIFsnc2ltZXEnLCBbODc3MV1dLCBbJ3NpbWcnLCBbMTA5MTBdXSwgWydzaW1nRScsIFsxMDkxMl1dLCBbJ3NpbWwnLCBbMTA5MDldXSwgWydzaW1sRScsIFsxMDkxMV1dLCBbJ3NpbW5lJywgWzg3NzRdXSwgWydzaW1wbHVzJywgWzEwNzg4XV0sIFsnc2ltcmFycicsIFsxMDYxMF1dLCBbJ3NsYXJyJywgWzg1OTJdXSwgWydTbWFsbENpcmNsZScsIFs4NzI4XV0sIFsnc21hbGxzZXRtaW51cycsIFs4NzI2XV0sIFsnc21hc2hwJywgWzEwODAzXV0sIFsnc21lcGFyc2wnLCBbMTA3MjRdXSwgWydzbWlkJywgWzg3MzldXSwgWydzbWlsZScsIFs4OTk1XV0sIFsnc210JywgWzEwOTIyXV0sIFsnc210ZScsIFsxMDkyNF1dLCBbJ3NtdGVzJywgWzEwOTI0LCA2NTAyNF1dLCBbJ1NPRlRjeScsIFsxMDY4XV0sIFsnc29mdGN5JywgWzExMDBdXSwgWydzb2xiYXInLCBbOTAyM11dLCBbJ3NvbGInLCBbMTA2OTJdXSwgWydzb2wnLCBbNDddXSwgWydTb3BmJywgWzEyMDEzOF1dLCBbJ3NvcGYnLCBbMTIwMTY0XV0sIFsnc3BhZGVzJywgWzk4MjRdXSwgWydzcGFkZXN1aXQnLCBbOTgyNF1dLCBbJ3NwYXInLCBbODc0MV1dLCBbJ3NxY2FwJywgWzg4NTFdXSwgWydzcWNhcHMnLCBbODg1MSwgNjUwMjRdXSwgWydzcWN1cCcsIFs4ODUyXV0sIFsnc3FjdXBzJywgWzg4NTIsIDY1MDI0XV0sIFsnU3FydCcsIFs4NzMwXV0sIFsnc3FzdWInLCBbODg0N11dLCBbJ3Nxc3ViZScsIFs4ODQ5XV0sIFsnc3FzdWJzZXQnLCBbODg0N11dLCBbJ3Nxc3Vic2V0ZXEnLCBbODg0OV1dLCBbJ3Nxc3VwJywgWzg4NDhdXSwgWydzcXN1cGUnLCBbODg1MF1dLCBbJ3Nxc3Vwc2V0JywgWzg4NDhdXSwgWydzcXN1cHNldGVxJywgWzg4NTBdXSwgWydzcXVhcmUnLCBbOTYzM11dLCBbJ1NxdWFyZScsIFs5NjMzXV0sIFsnU3F1YXJlSW50ZXJzZWN0aW9uJywgWzg4NTFdXSwgWydTcXVhcmVTdWJzZXQnLCBbODg0N11dLCBbJ1NxdWFyZVN1YnNldEVxdWFsJywgWzg4NDldXSwgWydTcXVhcmVTdXBlcnNldCcsIFs4ODQ4XV0sIFsnU3F1YXJlU3VwZXJzZXRFcXVhbCcsIFs4ODUwXV0sIFsnU3F1YXJlVW5pb24nLCBbODg1Ml1dLCBbJ3NxdWFyZicsIFs5NjQyXV0sIFsnc3F1JywgWzk2MzNdXSwgWydzcXVmJywgWzk2NDJdXSwgWydzcmFycicsIFs4NTk0XV0sIFsnU3NjcicsIFsxMTk5ODJdXSwgWydzc2NyJywgWzEyMDAwOF1dLCBbJ3NzZXRtbicsIFs4NzI2XV0sIFsnc3NtaWxlJywgWzg5OTVdXSwgWydzc3RhcmYnLCBbODkwMl1dLCBbJ1N0YXInLCBbODkwMl1dLCBbJ3N0YXInLCBbOTczNF1dLCBbJ3N0YXJmJywgWzk3MzNdXSwgWydzdHJhaWdodGVwc2lsb24nLCBbMTAxM11dLCBbJ3N0cmFpZ2h0cGhpJywgWzk4MV1dLCBbJ3N0cm5zJywgWzE3NV1dLCBbJ3N1YicsIFs4ODM0XV0sIFsnU3ViJywgWzg5MTJdXSwgWydzdWJkb3QnLCBbMTA5NDFdXSwgWydzdWJFJywgWzEwOTQ5XV0sIFsnc3ViZScsIFs4ODM4XV0sIFsnc3ViZWRvdCcsIFsxMDk0N11dLCBbJ3N1Ym11bHQnLCBbMTA5NDVdXSwgWydzdWJuRScsIFsxMDk1NV1dLCBbJ3N1Ym5lJywgWzg4NDJdXSwgWydzdWJwbHVzJywgWzEwOTQzXV0sIFsnc3VicmFycicsIFsxMDYxN11dLCBbJ3N1YnNldCcsIFs4ODM0XV0sIFsnU3Vic2V0JywgWzg5MTJdXSwgWydzdWJzZXRlcScsIFs4ODM4XV0sIFsnc3Vic2V0ZXFxJywgWzEwOTQ5XV0sIFsnU3Vic2V0RXF1YWwnLCBbODgzOF1dLCBbJ3N1YnNldG5lcScsIFs4ODQyXV0sIFsnc3Vic2V0bmVxcScsIFsxMDk1NV1dLCBbJ3N1YnNpbScsIFsxMDk1MV1dLCBbJ3N1YnN1YicsIFsxMDk2NV1dLCBbJ3N1YnN1cCcsIFsxMDk2M11dLCBbJ3N1Y2NhcHByb3gnLCBbMTA5MzZdXSwgWydzdWNjJywgWzg4MjddXSwgWydzdWNjY3VybHllcScsIFs4ODI5XV0sIFsnU3VjY2VlZHMnLCBbODgyN11dLCBbJ1N1Y2NlZWRzRXF1YWwnLCBbMTA5MjhdXSwgWydTdWNjZWVkc1NsYW50RXF1YWwnLCBbODgyOV1dLCBbJ1N1Y2NlZWRzVGlsZGUnLCBbODgzMV1dLCBbJ3N1Y2NlcScsIFsxMDkyOF1dLCBbJ3N1Y2NuYXBwcm94JywgWzEwOTM4XV0sIFsnc3VjY25lcXEnLCBbMTA5MzRdXSwgWydzdWNjbnNpbScsIFs4OTM3XV0sIFsnc3VjY3NpbScsIFs4ODMxXV0sIFsnU3VjaFRoYXQnLCBbODcxNV1dLCBbJ3N1bScsIFs4NzIxXV0sIFsnU3VtJywgWzg3MjFdXSwgWydzdW5nJywgWzk4MzRdXSwgWydzdXAxJywgWzE4NV1dLCBbJ3N1cDInLCBbMTc4XV0sIFsnc3VwMycsIFsxNzldXSwgWydzdXAnLCBbODgzNV1dLCBbJ1N1cCcsIFs4OTEzXV0sIFsnc3VwZG90JywgWzEwOTQyXV0sIFsnc3VwZHN1YicsIFsxMDk2OF1dLCBbJ3N1cEUnLCBbMTA5NTBdXSwgWydzdXBlJywgWzg4MzldXSwgWydzdXBlZG90JywgWzEwOTQ4XV0sIFsnU3VwZXJzZXQnLCBbODgzNV1dLCBbJ1N1cGVyc2V0RXF1YWwnLCBbODgzOV1dLCBbJ3N1cGhzb2wnLCBbMTAxODVdXSwgWydzdXBoc3ViJywgWzEwOTY3XV0sIFsnc3VwbGFycicsIFsxMDYxOV1dLCBbJ3N1cG11bHQnLCBbMTA5NDZdXSwgWydzdXBuRScsIFsxMDk1Nl1dLCBbJ3N1cG5lJywgWzg4NDNdXSwgWydzdXBwbHVzJywgWzEwOTQ0XV0sIFsnc3Vwc2V0JywgWzg4MzVdXSwgWydTdXBzZXQnLCBbODkxM11dLCBbJ3N1cHNldGVxJywgWzg4MzldXSwgWydzdXBzZXRlcXEnLCBbMTA5NTBdXSwgWydzdXBzZXRuZXEnLCBbODg0M11dLCBbJ3N1cHNldG5lcXEnLCBbMTA5NTZdXSwgWydzdXBzaW0nLCBbMTA5NTJdXSwgWydzdXBzdWInLCBbMTA5NjRdXSwgWydzdXBzdXAnLCBbMTA5NjZdXSwgWydzd2FyaGsnLCBbMTA1MzRdXSwgWydzd2FycicsIFs4NjAxXV0sIFsnc3dBcnInLCBbODY2NV1dLCBbJ3N3YXJyb3cnLCBbODYwMV1dLCBbJ3N3bndhcicsIFsxMDUzOF1dLCBbJ3N6bGlnJywgWzIyM11dLCBbJ1RhYicsIFs5XV0sIFsndGFyZ2V0JywgWzg5ODJdXSwgWydUYXUnLCBbOTMyXV0sIFsndGF1JywgWzk2NF1dLCBbJ3RicmsnLCBbOTE0MF1dLCBbJ1RjYXJvbicsIFszNTZdXSwgWyd0Y2Fyb24nLCBbMzU3XV0sIFsnVGNlZGlsJywgWzM1NF1dLCBbJ3RjZWRpbCcsIFszNTVdXSwgWydUY3knLCBbMTA1OF1dLCBbJ3RjeScsIFsxMDkwXV0sIFsndGRvdCcsIFs4NDExXV0sIFsndGVscmVjJywgWzg5ODFdXSwgWydUZnInLCBbMTIwMDg3XV0sIFsndGZyJywgWzEyMDExM11dLCBbJ3RoZXJlNCcsIFs4NzU2XV0sIFsndGhlcmVmb3JlJywgWzg3NTZdXSwgWydUaGVyZWZvcmUnLCBbODc1Nl1dLCBbJ1RoZXRhJywgWzkyMF1dLCBbJ3RoZXRhJywgWzk1Ml1dLCBbJ3RoZXRhc3ltJywgWzk3N11dLCBbJ3RoZXRhdicsIFs5NzddXSwgWyd0aGlja2FwcHJveCcsIFs4Nzc2XV0sIFsndGhpY2tzaW0nLCBbODc2NF1dLCBbJ1RoaWNrU3BhY2UnLCBbODI4NywgODIwMl1dLCBbJ1RoaW5TcGFjZScsIFs4MjAxXV0sIFsndGhpbnNwJywgWzgyMDFdXSwgWyd0aGthcCcsIFs4Nzc2XV0sIFsndGhrc2ltJywgWzg3NjRdXSwgWydUSE9STicsIFsyMjJdXSwgWyd0aG9ybicsIFsyNTRdXSwgWyd0aWxkZScsIFs3MzJdXSwgWydUaWxkZScsIFs4NzY0XV0sIFsnVGlsZGVFcXVhbCcsIFs4NzcxXV0sIFsnVGlsZGVGdWxsRXF1YWwnLCBbODc3M11dLCBbJ1RpbGRlVGlsZGUnLCBbODc3Nl1dLCBbJ3RpbWVzYmFyJywgWzEwODAxXV0sIFsndGltZXNiJywgWzg4NjRdXSwgWyd0aW1lcycsIFsyMTVdXSwgWyd0aW1lc2QnLCBbMTA4MDBdXSwgWyd0aW50JywgWzg3NDldXSwgWyd0b2VhJywgWzEwNTM2XV0sIFsndG9wYm90JywgWzkwMTRdXSwgWyd0b3BjaXInLCBbMTA5OTNdXSwgWyd0b3AnLCBbODg2OF1dLCBbJ1RvcGYnLCBbMTIwMTM5XV0sIFsndG9wZicsIFsxMjAxNjVdXSwgWyd0b3Bmb3JrJywgWzEwOTcwXV0sIFsndG9zYScsIFsxMDUzN11dLCBbJ3RwcmltZScsIFs4MjQ0XV0sIFsndHJhZGUnLCBbODQ4Ml1dLCBbJ1RSQURFJywgWzg0ODJdXSwgWyd0cmlhbmdsZScsIFs5NjUzXV0sIFsndHJpYW5nbGVkb3duJywgWzk2NjNdXSwgWyd0cmlhbmdsZWxlZnQnLCBbOTY2N11dLCBbJ3RyaWFuZ2xlbGVmdGVxJywgWzg4ODRdXSwgWyd0cmlhbmdsZXEnLCBbODc5Nl1dLCBbJ3RyaWFuZ2xlcmlnaHQnLCBbOTY1N11dLCBbJ3RyaWFuZ2xlcmlnaHRlcScsIFs4ODg1XV0sIFsndHJpZG90JywgWzk3MDhdXSwgWyd0cmllJywgWzg3OTZdXSwgWyd0cmltaW51cycsIFsxMDgxMF1dLCBbJ1RyaXBsZURvdCcsIFs4NDExXV0sIFsndHJpcGx1cycsIFsxMDgwOV1dLCBbJ3RyaXNiJywgWzEwNzAxXV0sIFsndHJpdGltZScsIFsxMDgxMV1dLCBbJ3RycGV6aXVtJywgWzkxODZdXSwgWydUc2NyJywgWzExOTk4M11dLCBbJ3RzY3InLCBbMTIwMDA5XV0sIFsnVFNjeScsIFsxMDYyXV0sIFsndHNjeScsIFsxMDk0XV0sIFsnVFNIY3knLCBbMTAzNV1dLCBbJ3RzaGN5JywgWzExMTVdXSwgWydUc3Ryb2snLCBbMzU4XV0sIFsndHN0cm9rJywgWzM1OV1dLCBbJ3R3aXh0JywgWzg4MTJdXSwgWyd0d29oZWFkbGVmdGFycm93JywgWzg2MDZdXSwgWyd0d29oZWFkcmlnaHRhcnJvdycsIFs4NjA4XV0sIFsnVWFjdXRlJywgWzIxOF1dLCBbJ3VhY3V0ZScsIFsyNTBdXSwgWyd1YXJyJywgWzg1OTNdXSwgWydVYXJyJywgWzg2MDddXSwgWyd1QXJyJywgWzg2NTddXSwgWydVYXJyb2NpcicsIFsxMDU2OV1dLCBbJ1VicmN5JywgWzEwMzhdXSwgWyd1YnJjeScsIFsxMTE4XV0sIFsnVWJyZXZlJywgWzM2NF1dLCBbJ3VicmV2ZScsIFszNjVdXSwgWydVY2lyYycsIFsyMTldXSwgWyd1Y2lyYycsIFsyNTFdXSwgWydVY3knLCBbMTA1OV1dLCBbJ3VjeScsIFsxMDkxXV0sIFsndWRhcnInLCBbODY0NV1dLCBbJ1VkYmxhYycsIFszNjhdXSwgWyd1ZGJsYWMnLCBbMzY5XV0sIFsndWRoYXInLCBbMTA2MDZdXSwgWyd1ZmlzaHQnLCBbMTA2MjJdXSwgWydVZnInLCBbMTIwMDg4XV0sIFsndWZyJywgWzEyMDExNF1dLCBbJ1VncmF2ZScsIFsyMTddXSwgWyd1Z3JhdmUnLCBbMjQ5XV0sIFsndUhhcicsIFsxMDU5NV1dLCBbJ3VoYXJsJywgWzg2MzldXSwgWyd1aGFycicsIFs4NjM4XV0sIFsndWhibGsnLCBbOTYwMF1dLCBbJ3VsY29ybicsIFs4OTg4XV0sIFsndWxjb3JuZXInLCBbODk4OF1dLCBbJ3VsY3JvcCcsIFs4OTc1XV0sIFsndWx0cmknLCBbOTcyMF1dLCBbJ1VtYWNyJywgWzM2Ml1dLCBbJ3VtYWNyJywgWzM2M11dLCBbJ3VtbCcsIFsxNjhdXSwgWydVbmRlckJhcicsIFs5NV1dLCBbJ1VuZGVyQnJhY2UnLCBbOTE4M11dLCBbJ1VuZGVyQnJhY2tldCcsIFs5MTQxXV0sIFsnVW5kZXJQYXJlbnRoZXNpcycsIFs5MTgxXV0sIFsnVW5pb24nLCBbODg5OV1dLCBbJ1VuaW9uUGx1cycsIFs4ODQ2XV0sIFsnVW9nb24nLCBbMzcwXV0sIFsndW9nb24nLCBbMzcxXV0sIFsnVW9wZicsIFsxMjAxNDBdXSwgWyd1b3BmJywgWzEyMDE2Nl1dLCBbJ1VwQXJyb3dCYXInLCBbMTA1MTRdXSwgWyd1cGFycm93JywgWzg1OTNdXSwgWydVcEFycm93JywgWzg1OTNdXSwgWydVcGFycm93JywgWzg2NTddXSwgWydVcEFycm93RG93bkFycm93JywgWzg2NDVdXSwgWyd1cGRvd25hcnJvdycsIFs4NTk3XV0sIFsnVXBEb3duQXJyb3cnLCBbODU5N11dLCBbJ1VwZG93bmFycm93JywgWzg2NjFdXSwgWydVcEVxdWlsaWJyaXVtJywgWzEwNjA2XV0sIFsndXBoYXJwb29ubGVmdCcsIFs4NjM5XV0sIFsndXBoYXJwb29ucmlnaHQnLCBbODYzOF1dLCBbJ3VwbHVzJywgWzg4NDZdXSwgWydVcHBlckxlZnRBcnJvdycsIFs4NTk4XV0sIFsnVXBwZXJSaWdodEFycm93JywgWzg1OTldXSwgWyd1cHNpJywgWzk2NV1dLCBbJ1Vwc2knLCBbOTc4XV0sIFsndXBzaWgnLCBbOTc4XV0sIFsnVXBzaWxvbicsIFs5MzNdXSwgWyd1cHNpbG9uJywgWzk2NV1dLCBbJ1VwVGVlQXJyb3cnLCBbODYxM11dLCBbJ1VwVGVlJywgWzg4NjldXSwgWyd1cHVwYXJyb3dzJywgWzg2NDhdXSwgWyd1cmNvcm4nLCBbODk4OV1dLCBbJ3VyY29ybmVyJywgWzg5ODldXSwgWyd1cmNyb3AnLCBbODk3NF1dLCBbJ1VyaW5nJywgWzM2Nl1dLCBbJ3VyaW5nJywgWzM2N11dLCBbJ3VydHJpJywgWzk3MjFdXSwgWydVc2NyJywgWzExOTk4NF1dLCBbJ3VzY3InLCBbMTIwMDEwXV0sIFsndXRkb3QnLCBbODk0NF1dLCBbJ1V0aWxkZScsIFszNjBdXSwgWyd1dGlsZGUnLCBbMzYxXV0sIFsndXRyaScsIFs5NjUzXV0sIFsndXRyaWYnLCBbOTY1Ml1dLCBbJ3V1YXJyJywgWzg2NDhdXSwgWydVdW1sJywgWzIyMF1dLCBbJ3V1bWwnLCBbMjUyXV0sIFsndXdhbmdsZScsIFsxMDY2M11dLCBbJ3ZhbmdydCcsIFsxMDY1Ml1dLCBbJ3ZhcmVwc2lsb24nLCBbMTAxM11dLCBbJ3ZhcmthcHBhJywgWzEwMDhdXSwgWyd2YXJub3RoaW5nJywgWzg3MDldXSwgWyd2YXJwaGknLCBbOTgxXV0sIFsndmFycGknLCBbOTgyXV0sIFsndmFycHJvcHRvJywgWzg3MzNdXSwgWyd2YXJyJywgWzg1OTddXSwgWyd2QXJyJywgWzg2NjFdXSwgWyd2YXJyaG8nLCBbMTAwOV1dLCBbJ3ZhcnNpZ21hJywgWzk2Ml1dLCBbJ3ZhcnN1YnNldG5lcScsIFs4ODQyLCA2NTAyNF1dLCBbJ3ZhcnN1YnNldG5lcXEnLCBbMTA5NTUsIDY1MDI0XV0sIFsndmFyc3Vwc2V0bmVxJywgWzg4NDMsIDY1MDI0XV0sIFsndmFyc3Vwc2V0bmVxcScsIFsxMDk1NiwgNjUwMjRdXSwgWyd2YXJ0aGV0YScsIFs5NzddXSwgWyd2YXJ0cmlhbmdsZWxlZnQnLCBbODg4Ml1dLCBbJ3ZhcnRyaWFuZ2xlcmlnaHQnLCBbODg4M11dLCBbJ3ZCYXInLCBbMTA5ODRdXSwgWydWYmFyJywgWzEwOTg3XV0sIFsndkJhcnYnLCBbMTA5ODVdXSwgWydWY3knLCBbMTA0Ml1dLCBbJ3ZjeScsIFsxMDc0XV0sIFsndmRhc2gnLCBbODg2Nl1dLCBbJ3ZEYXNoJywgWzg4NzJdXSwgWydWZGFzaCcsIFs4ODczXV0sIFsnVkRhc2gnLCBbODg3NV1dLCBbJ1ZkYXNobCcsIFsxMDk4Ml1dLCBbJ3ZlZWJhcicsIFs4ODkxXV0sIFsndmVlJywgWzg3NDRdXSwgWydWZWUnLCBbODg5N11dLCBbJ3ZlZWVxJywgWzg3OTRdXSwgWyd2ZWxsaXAnLCBbODk0Ml1dLCBbJ3ZlcmJhcicsIFsxMjRdXSwgWydWZXJiYXInLCBbODIxNF1dLCBbJ3ZlcnQnLCBbMTI0XV0sIFsnVmVydCcsIFs4MjE0XV0sIFsnVmVydGljYWxCYXInLCBbODczOV1dLCBbJ1ZlcnRpY2FsTGluZScsIFsxMjRdXSwgWydWZXJ0aWNhbFNlcGFyYXRvcicsIFsxMDA3Ml1dLCBbJ1ZlcnRpY2FsVGlsZGUnLCBbODc2OF1dLCBbJ1ZlcnlUaGluU3BhY2UnLCBbODIwMl1dLCBbJ1ZmcicsIFsxMjAwODldXSwgWyd2ZnInLCBbMTIwMTE1XV0sIFsndmx0cmknLCBbODg4Ml1dLCBbJ3Zuc3ViJywgWzg4MzQsIDg0MDJdXSwgWyd2bnN1cCcsIFs4ODM1LCA4NDAyXV0sIFsnVm9wZicsIFsxMjAxNDFdXSwgWyd2b3BmJywgWzEyMDE2N11dLCBbJ3Zwcm9wJywgWzg3MzNdXSwgWyd2cnRyaScsIFs4ODgzXV0sIFsnVnNjcicsIFsxMTk5ODVdXSwgWyd2c2NyJywgWzEyMDAxMV1dLCBbJ3ZzdWJuRScsIFsxMDk1NSwgNjUwMjRdXSwgWyd2c3VibmUnLCBbODg0MiwgNjUwMjRdXSwgWyd2c3VwbkUnLCBbMTA5NTYsIDY1MDI0XV0sIFsndnN1cG5lJywgWzg4NDMsIDY1MDI0XV0sIFsnVnZkYXNoJywgWzg4NzRdXSwgWyd2emlnemFnJywgWzEwNjUwXV0sIFsnV2NpcmMnLCBbMzcyXV0sIFsnd2NpcmMnLCBbMzczXV0sIFsnd2VkYmFyJywgWzEwODQ3XV0sIFsnd2VkZ2UnLCBbODc0M11dLCBbJ1dlZGdlJywgWzg4OTZdXSwgWyd3ZWRnZXEnLCBbODc5M11dLCBbJ3dlaWVycCcsIFs4NDcyXV0sIFsnV2ZyJywgWzEyMDA5MF1dLCBbJ3dmcicsIFsxMjAxMTZdXSwgWydXb3BmJywgWzEyMDE0Ml1dLCBbJ3dvcGYnLCBbMTIwMTY4XV0sIFsnd3AnLCBbODQ3Ml1dLCBbJ3dyJywgWzg3NjhdXSwgWyd3cmVhdGgnLCBbODc2OF1dLCBbJ1dzY3InLCBbMTE5OTg2XV0sIFsnd3NjcicsIFsxMjAwMTJdXSwgWyd4Y2FwJywgWzg4OThdXSwgWyd4Y2lyYycsIFs5NzExXV0sIFsneGN1cCcsIFs4ODk5XV0sIFsneGR0cmknLCBbOTY2MV1dLCBbJ1hmcicsIFsxMjAwOTFdXSwgWyd4ZnInLCBbMTIwMTE3XV0sIFsneGhhcnInLCBbMTAyMzFdXSwgWyd4aEFycicsIFsxMDIzNF1dLCBbJ1hpJywgWzkyNl1dLCBbJ3hpJywgWzk1OF1dLCBbJ3hsYXJyJywgWzEwMjI5XV0sIFsneGxBcnInLCBbMTAyMzJdXSwgWyd4bWFwJywgWzEwMjM2XV0sIFsneG5pcycsIFs4OTU1XV0sIFsneG9kb3QnLCBbMTA3NTJdXSwgWydYb3BmJywgWzEyMDE0M11dLCBbJ3hvcGYnLCBbMTIwMTY5XV0sIFsneG9wbHVzJywgWzEwNzUzXV0sIFsneG90aW1lJywgWzEwNzU0XV0sIFsneHJhcnInLCBbMTAyMzBdXSwgWyd4ckFycicsIFsxMDIzM11dLCBbJ1hzY3InLCBbMTE5OTg3XV0sIFsneHNjcicsIFsxMjAwMTNdXSwgWyd4c3FjdXAnLCBbMTA3NThdXSwgWyd4dXBsdXMnLCBbMTA3NTZdXSwgWyd4dXRyaScsIFs5NjUxXV0sIFsneHZlZScsIFs4ODk3XV0sIFsneHdlZGdlJywgWzg4OTZdXSwgWydZYWN1dGUnLCBbMjIxXV0sIFsneWFjdXRlJywgWzI1M11dLCBbJ1lBY3knLCBbMTA3MV1dLCBbJ3lhY3knLCBbMTEwM11dLCBbJ1ljaXJjJywgWzM3NF1dLCBbJ3ljaXJjJywgWzM3NV1dLCBbJ1ljeScsIFsxMDY3XV0sIFsneWN5JywgWzEwOTldXSwgWyd5ZW4nLCBbMTY1XV0sIFsnWWZyJywgWzEyMDA5Ml1dLCBbJ3lmcicsIFsxMjAxMThdXSwgWydZSWN5JywgWzEwMzFdXSwgWyd5aWN5JywgWzExMTFdXSwgWydZb3BmJywgWzEyMDE0NF1dLCBbJ3lvcGYnLCBbMTIwMTcwXV0sIFsnWXNjcicsIFsxMTk5ODhdXSwgWyd5c2NyJywgWzEyMDAxNF1dLCBbJ1lVY3knLCBbMTA3MF1dLCBbJ3l1Y3knLCBbMTEwMl1dLCBbJ3l1bWwnLCBbMjU1XV0sIFsnWXVtbCcsIFszNzZdXSwgWydaYWN1dGUnLCBbMzc3XV0sIFsnemFjdXRlJywgWzM3OF1dLCBbJ1pjYXJvbicsIFszODFdXSwgWyd6Y2Fyb24nLCBbMzgyXV0sIFsnWmN5JywgWzEwNDddXSwgWyd6Y3knLCBbMTA3OV1dLCBbJ1pkb3QnLCBbMzc5XV0sIFsnemRvdCcsIFszODBdXSwgWyd6ZWV0cmYnLCBbODQ4OF1dLCBbJ1plcm9XaWR0aFNwYWNlJywgWzgyMDNdXSwgWydaZXRhJywgWzkxOF1dLCBbJ3pldGEnLCBbOTUwXV0sIFsnemZyJywgWzEyMDExOV1dLCBbJ1pmcicsIFs4NDg4XV0sIFsnWkhjeScsIFsxMDQ2XV0sIFsnemhjeScsIFsxMDc4XV0sIFsnemlncmFycicsIFs4NjY5XV0sIFsnem9wZicsIFsxMjAxNzFdXSwgWydab3BmJywgWzg0ODRdXSwgWydac2NyJywgWzExOTk4OV1dLCBbJ3pzY3InLCBbMTIwMDE1XV0sIFsnendqJywgWzgyMDVdXSwgWyd6d25qJywgWzgyMDRdXV07XG5cbnZhciBhbHBoYUluZGV4ID0ge307XG52YXIgY2hhckluZGV4ID0ge307XG5cbmNyZWF0ZUluZGV4ZXMoYWxwaGFJbmRleCwgY2hhckluZGV4KTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSHRtbDVFbnRpdGllcygpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDVFbnRpdGllcy5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyYoIz9bXFx3XFxkXSspOz8vZywgZnVuY3Rpb24ocywgZW50aXR5KSB7XG4gICAgICAgIHZhciBjaHI7XG4gICAgICAgIGlmIChlbnRpdHkuY2hhckF0KDApID09PSBcIiNcIikge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSBlbnRpdHkuY2hhckF0KDEpID09PSAneCcgP1xuICAgICAgICAgICAgICAgIHBhcnNlSW50KGVudGl0eS5zdWJzdHIoMikudG9Mb3dlckNhc2UoKSwgMTYpIDpcbiAgICAgICAgICAgICAgICBwYXJzZUludChlbnRpdHkuc3Vic3RyKDEpKTtcblxuICAgICAgICAgICAgaWYgKCEoaXNOYU4oY29kZSkgfHwgY29kZSA8IC0zMjc2OCB8fCBjb2RlID4gNjU1MzUpKSB7XG4gICAgICAgICAgICAgICAgY2hyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNociA9IGFscGhhSW5kZXhbZW50aXR5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hyIHx8IHM7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBIdG1sNUVudGl0aWVzLmRlY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDVFbnRpdGllcygpLmRlY29kZShzdHIpO1xuIH07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDVFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjaGFySW5mbyA9IGNoYXJJbmRleFtzdHIuY2hhckNvZGVBdChpKV07XG4gICAgICAgIGlmIChjaGFySW5mbykge1xuICAgICAgICAgICAgdmFyIGFscGhhID0gY2hhckluZm9bc3RyLmNoYXJDb2RlQXQoaSArIDEpXTtcbiAgICAgICAgICAgIGlmIChhbHBoYSkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxwaGEgPSBjaGFySW5mb1snJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxwaGEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCImXCIgKyBhbHBoYSArIFwiO1wiO1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG4gSHRtbDVFbnRpdGllcy5lbmNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw1RW50aXRpZXMoKS5lbmNvZGUoc3RyKTtcbiB9O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw1RW50aXRpZXMucHJvdG90eXBlLmVuY29kZU5vblVURiA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgY2hhckluZm8gPSBjaGFySW5kZXhbY107XG4gICAgICAgIGlmIChjaGFySW5mbykge1xuICAgICAgICAgICAgdmFyIGFscGhhID0gY2hhckluZm9bc3RyLmNoYXJDb2RlQXQoaSArIDEpXTtcbiAgICAgICAgICAgIGlmIChhbHBoYSkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxwaGEgPSBjaGFySW5mb1snJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxwaGEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCImXCIgKyBhbHBoYSArIFwiO1wiO1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYyA8IDMyIHx8IGMgPiAxMjYpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSAnJiMnICsgYyArICc7JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzdHIuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIEh0bWw1RW50aXRpZXMuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNUVudGl0aWVzKCkuZW5jb2RlTm9uVVRGKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5IdG1sNUVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8PSAyNTUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzdHJbaSsrXTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSAnJiMnICsgYyArICc7JztcbiAgICAgICAgaSsrXG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBIdG1sNUVudGl0aWVzLmVuY29kZU5vbkFTQ0lJID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNUVudGl0aWVzKCkuZW5jb2RlTm9uQVNDSUkoc3RyKTtcbiB9O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBhbHBoYUluZGV4IFBhc3NlZCBieSByZWZlcmVuY2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY2hhckluZGV4IFBhc3NlZCBieSByZWZlcmVuY2UuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluZGV4ZXMoYWxwaGFJbmRleCwgY2hhckluZGV4KSB7XG4gICAgdmFyIGkgPSBFTlRJVElFUy5sZW5ndGg7XG4gICAgdmFyIF9yZXN1bHRzID0gW107XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2YXIgZSA9IEVOVElUSUVTW2ldO1xuICAgICAgICB2YXIgYWxwaGEgPSBlWzBdO1xuICAgICAgICB2YXIgY2hhcnMgPSBlWzFdO1xuICAgICAgICB2YXIgY2hyID0gY2hhcnNbMF07XG4gICAgICAgIHZhciBhZGRDaGFyID0gKGNociA8IDMyIHx8IGNociA+IDEyNikgfHwgY2hyID09PSA2MiB8fCBjaHIgPT09IDYwIHx8IGNociA9PT0gMzggfHwgY2hyID09PSAzNCB8fCBjaHIgPT09IDM5O1xuICAgICAgICB2YXIgY2hhckluZm87XG4gICAgICAgIGlmIChhZGRDaGFyKSB7XG4gICAgICAgICAgICBjaGFySW5mbyA9IGNoYXJJbmRleFtjaHJdID0gY2hhckluZGV4W2Nocl0gfHwge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYXJzWzFdKSB7XG4gICAgICAgICAgICB2YXIgY2hyMiA9IGNoYXJzWzFdO1xuICAgICAgICAgICAgYWxwaGFJbmRleFthbHBoYV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocikgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChhZGRDaGFyICYmIChjaGFySW5mb1tjaHIyXSA9IGFscGhhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbHBoYUluZGV4W2FscGhhXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyKTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goYWRkQ2hhciAmJiAoY2hhckluZm9bJyddID0gYWxwaGEpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sNUVudGl0aWVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2h0bWwtZW50aXRpZXMvbGliL2h0bWw1LWVudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vTG9naW4uc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmxvY2FsSWRlbnROYW1lPVtwYXRoXVtuYW1lXS0tLVtsb2NhbF0tLS1baGFzaDpiYXNlNjQ6NV0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9Mb2dpbi5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9tb2R1bGVzJmxvY2FsSWRlbnROYW1lPVtwYXRoXVtuYW1lXS0tLVtsb2NhbF0tLS1baGFzaDpiYXNlNjQ6NV0hLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9Mb2dpbi5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9Ib21lL0xvZ2luL0xvZ2luLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDE0NCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FudGQvbGliL2lucHV0L2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDE3MTApO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWR1eC1zYWdhL2VzL2VmZmVjdHMuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMjAwKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSA0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg2KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2V4dGVuZHMuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNzMwKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvZDMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNzMyKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3Qtcm91dGVyL2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDc3OCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FudGQvbGliL2xheW91dC9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg5NSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgUm91dGVyLCBSb3V0ZSwgYnJvd3Nlckhpc3RvcnksIEluZGV4Um91dGUsIFJlZGlyZWN0IH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0ICdtb21lbnQvbG9jYWxlL3poLWNuJztcclxubW9tZW50LmxvY2FsZSgnemgtY24nKTtcclxuXHJcbi8v5re75YqgbW9tZW506I635Y+W5pel5pyf5qC85byP55qE5Y6f5Z6L5Ye95pWwXHJcbm1vbWVudC5wcm90b3R5cGUuWU1ESG1zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XHJcbn07XHJcbmltcG9ydCB7TGF5b3V0fSBmcm9tICdhbnRkJztcclxuaW1wb3J0IExvZ2luIGZyb20gJy4vSG9tZS9Mb2dpbi9Mb2dpbic7XHJcbmltcG9ydCBSZWdpc3RlciBmcm9tICcuL0hvbWUvTG9naW4vUmVnaXN0ZXInO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vSG9tZS9oZWFkZXInO1xyXG5pbXBvcnQgVGVzdDEgZnJvbSAnLi9jb21wb25lbnRzL3Rlc3QxJztcclxuaW1wb3J0IFRlc3QyIGZyb20gJy4vY29tcG9uZW50cy90ZXN0Mic7XHJcbmltcG9ydCBWb2ljZUJ1dHRvbiBmcm9tICcuL2NvbXBvbmVudHMvdm9pY2VCdG4nO1xyXG5cclxuaW1wb3J0IHtQcm92aWRlcn0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQge3N5bmNIaXN0b3J5V2l0aFN0b3JlfSBmcm9tICdyZWFjdC1yb3V0ZXItcmVkdXgnO1xyXG5pbXBvcnQgc3RvcmUgZnJvbSAnLi9zdG9yZSc7XHJcbmNvbnN0IGhpc3RvcnkgPSBzeW5jSGlzdG9yeVdpdGhTdG9yZShicm93c2VySGlzdG9yeSwgc3RvcmUpO1xyXG5cclxuY29uc3QgeyBDb250ZW50IH0gPSBMYXlvdXQ7XHJcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9pbmRleC5zY3NzJztcclxuXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbmlmIChtb2R1bGUuaG90KSB7XHJcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xyXG59XHJcbi8qIGVzbGludC1lbmFibGUgKi9cclxuXHJcbmNsYXNzIFJvb3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPExheW91dCBjbGFzc05hbWU9J2xheW91dCc+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyLz5cclxuICAgICAgICAgICAgICAgIDxDb250ZW50IGNsYXNzTmFtZT17c3R5bGVzLnBhZ2VDb250ZW50fT5cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuICYmIGNoaWxkcmVuIHx8IG51bGxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L0NvbnRlbnQ+XHJcbiAgICAgICAgICAgICAgICA8Vm9pY2VCdXR0b24vPlxyXG4gICAgICAgICAgICA8L0xheW91dD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBOb3RGb3VuZFBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICByZXR1cm4oXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8aDE+Um91dGUgUGFnZSBub3QgZm91bmQ8L2gxPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByb3V0ZXMgPSAoXHJcbiAgICA8Um91dGU+XHJcbiAgICAgICAgPFJvdXRlIHBhdGg9Jy9sb2dpbicgY29tcG9uZW50PXtMb2dpbn0gLz5cclxuICAgICAgICA8Um91dGUgcGF0aD0nL3JlZ2lzdGVyJyBjb21wb25lbnQ9e1JlZ2lzdGVyfSAvPlxyXG4gICAgICAgIDxSb3V0ZSBwYXRoPScvJyBjb21wb25lbnQ9e1Jvb3R9PlxyXG4gICAgICAgICAgICA8SW5kZXhSb3V0ZSBjb21wb25lbnQ9e1Rlc3QxfSAvPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nL3Rlc3QxJyBjb21wb25lbnQ9e1Rlc3QxfSAvPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nL3Rlc3QyJyBjb21wb25lbnQ9e1Rlc3QyfSAvPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nLzQwNCcgY29tcG9uZW50PXtOb3RGb3VuZFBhZ2V9IC8+XHJcbiAgICAgICAgICAgIDxSZWRpcmVjdCBmcm9tPScqJyB0bz0nLzQwNCcgLz5cclxuICAgICAgICA8L1JvdXRlPlxyXG4gICAgPC9Sb3V0ZT5cclxuKTtcclxuXHJcbi8qIGVzbGludC1lbmFibGUgKi9cclxuY2xhc3MgUm91dGVycyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxSb3V0ZXIgaGlzdG9yeT17aGlzdG9yeX0gPlxyXG4gICAgICAgICAgICAgICAge3JvdXRlc31cclxuICAgICAgICAgICAgPC9Sb3V0ZXI+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKChcclxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgIDxSb3V0ZXJzIC8+XHJcbiAgICA8L1Byb3ZpZGVyPlxyXG4pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzeCIsIi8qXG4gICAqIENvbW1vbkpTIG1vZHVsZSB0aGF0IGV4cG9ydHMgRXZlbnRTb3VyY2UgcG9seWZpbGwgdmVyc2lvbiAwLjkuNlxuICAgKiBUaGlzIG1vZHVsZSBpcyBpbnRlbmRlZCBmb3IgYnJvd3NlciBzaWRlIHVzZVxuICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICogVEhJUyBJUyBBIFBPTFlGSUxMIE1PRFVMRSwgU08gSVQgSEFTIFNJREUgRUZGRUNUU1xuICAgKiBJVCBBVVRPTUFUSUNBTExZIENIRUNLUyBJRiB3aW5kb3cgT0JKRUNUIERFRklORVMgRXZlbnRTb3VyY2VcbiAgICogQU5EIEFERCBUSEUgRVhQT1JURUQgT05FIElOIENBU0UgSVQgSVMgVU5ERUZJTkVEXG4gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgKiBTdXBwb3J0ZWQgYnkgc2MgQW12VGVrIHNybFxuICAgKiA6ZW1haWw6IGRldmVsQGFtdnRlay5jb21cbiAqL1xuXG5cbnZhciBQb2x5ZmlsbEV2ZW50U291cmNlID0gcmVxdWlyZSgnLi9ldmVudHNvdXJjZS5qcycpLkV2ZW50U291cmNlO1xubW9kdWxlLmV4cG9ydHMgPSBQb2x5ZmlsbEV2ZW50U291cmNlO1xuXG4vLyBBZGQgRXZlbnRTb3VyY2UgdG8gd2luZG93IGlmIGl0IGlzIG1pc3NpbmcuLi5cbmlmICh3aW5kb3cgJiYgIXdpbmRvdy5FdmVudFNvdXJjZSl7XG4gICAgd2luZG93LkV2ZW50U291cmNlID0gUG9seWZpbGxFdmVudFNvdXJjZTtcbiAgICBpZiAoY29uc29sZSl7XG5cdGNvbnNvbGUubG9nKFwicG9seWZpbGwtZXZlbnRzb3VyY2UgYWRkZWQgbWlzc2luZyBFdmVudFNvdXJjZSB0byB3aW5kb3dcIik7XG4gICAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2V2ZW50c291cmNlLXBvbHlmaWxsL2Rpc3QvYnJvd3NlcmlmeS1ldmVudHNvdXJjZS5qc1xuLy8gbW9kdWxlIGlkID0gNTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibnVsbFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjayktaG90LW1pZGRsZXdhcmUvY2xpZW50LmpzP3BhdGg9aHR0cDovMTI3LjAuMC4xOjMwMDAvX193ZWJwYWNrX2htciZ0aW1lb3V0PTIwMDAwIiwiLyplc2xpbnQtZW52IGJyb3dzZXIqL1xuLypnbG9iYWwgX19yZXNvdXJjZVF1ZXJ5IF9fd2VicGFja19wdWJsaWNfcGF0aF9fKi9cblxudmFyIG9wdGlvbnMgPSB7XG4gIHBhdGg6IFwiL19fd2VicGFja19obXJcIixcbiAgdGltZW91dDogMjAgKiAxMDAwLFxuICBvdmVybGF5OiB0cnVlLFxuICByZWxvYWQ6IGZhbHNlLFxuICBsb2c6IHRydWUsXG4gIHdhcm46IHRydWUsXG4gIG5hbWU6ICcnXG59O1xuaWYgKF9fcmVzb3VyY2VRdWVyeSkge1xuICB2YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuICB2YXIgb3ZlcnJpZGVzID0gcXVlcnlzdHJpbmcucGFyc2UoX19yZXNvdXJjZVF1ZXJ5LnNsaWNlKDEpKTtcbiAgaWYgKG92ZXJyaWRlcy5wYXRoKSBvcHRpb25zLnBhdGggPSBvdmVycmlkZXMucGF0aDtcbiAgaWYgKG92ZXJyaWRlcy50aW1lb3V0KSBvcHRpb25zLnRpbWVvdXQgPSBvdmVycmlkZXMudGltZW91dDtcbiAgaWYgKG92ZXJyaWRlcy5vdmVybGF5KSBvcHRpb25zLm92ZXJsYXkgPSBvdmVycmlkZXMub3ZlcmxheSAhPT0gJ2ZhbHNlJztcbiAgaWYgKG92ZXJyaWRlcy5yZWxvYWQpIG9wdGlvbnMucmVsb2FkID0gb3ZlcnJpZGVzLnJlbG9hZCAhPT0gJ2ZhbHNlJztcbiAgaWYgKG92ZXJyaWRlcy5ub0luZm8gJiYgb3ZlcnJpZGVzLm5vSW5mbyAhPT0gJ2ZhbHNlJykge1xuICAgIG9wdGlvbnMubG9nID0gZmFsc2U7XG4gIH1cbiAgaWYgKG92ZXJyaWRlcy5uYW1lKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gb3ZlcnJpZGVzLm5hbWU7XG4gIH1cbiAgaWYgKG92ZXJyaWRlcy5xdWlldCAmJiBvdmVycmlkZXMucXVpZXQgIT09ICdmYWxzZScpIHtcbiAgICBvcHRpb25zLmxvZyA9IGZhbHNlO1xuICAgIG9wdGlvbnMud2FybiA9IGZhbHNlO1xuICB9XG4gIGlmIChvdmVycmlkZXMuZHluYW1pY1B1YmxpY1BhdGgpIHtcbiAgICBvcHRpb25zLnBhdGggPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIG9wdGlvbnMucGF0aDtcbiAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gZG8gbm90aGluZ1xufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93LkV2ZW50U291cmNlID09PSAndW5kZWZpbmVkJykge1xuICBjb25zb2xlLndhcm4oXG4gICAgXCJ3ZWJwYWNrLWhvdC1taWRkbGV3YXJlJ3MgY2xpZW50IHJlcXVpcmVzIEV2ZW50U291cmNlIHRvIHdvcmsuIFwiICtcbiAgICBcIllvdSBzaG91bGQgaW5jbHVkZSBhIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHN1cHBvcnQgdGhpcyBicm93c2VyOiBcIiArXG4gICAgXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmVyLXNlbnRfZXZlbnRzI1Rvb2xzXCJcbiAgKTtcbn0gZWxzZSB7XG4gIGNvbm5lY3QoKTtcbn1cblxuZnVuY3Rpb24gRXZlbnRTb3VyY2VXcmFwcGVyKCkge1xuICB2YXIgc291cmNlO1xuICB2YXIgbGFzdEFjdGl2aXR5ID0gbmV3IERhdGUoKTtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuXG4gIGluaXQoKTtcbiAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgaWYgKChuZXcgRGF0ZSgpIC0gbGFzdEFjdGl2aXR5KSA+IG9wdGlvbnMudGltZW91dCkge1xuICAgICAgaGFuZGxlRGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfSwgb3B0aW9ucy50aW1lb3V0IC8gMik7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzb3VyY2UgPSBuZXcgd2luZG93LkV2ZW50U291cmNlKG9wdGlvbnMucGF0aCk7XG4gICAgc291cmNlLm9ub3BlbiA9IGhhbmRsZU9ubGluZTtcbiAgICBzb3VyY2Uub25lcnJvciA9IGhhbmRsZURpc2Nvbm5lY3Q7XG4gICAgc291cmNlLm9ubWVzc2FnZSA9IGhhbmRsZU1lc3NhZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPbmxpbmUoKSB7XG4gICAgaWYgKG9wdGlvbnMubG9nKSBjb25zb2xlLmxvZyhcIltITVJdIGNvbm5lY3RlZFwiKTtcbiAgICBsYXN0QWN0aXZpdHkgPSBuZXcgRGF0ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgIGxhc3RBY3Rpdml0eSA9IG5ldyBEYXRlKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXShldmVudCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRGlzY29ubmVjdCgpIHtcbiAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICBzb3VyY2UuY2xvc2UoKTtcbiAgICBzZXRUaW1lb3V0KGluaXQsIG9wdGlvbnMudGltZW91dCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFkZE1lc3NhZ2VMaXN0ZW5lcjogZnVuY3Rpb24oZm4pIHtcbiAgICAgIGxpc3RlbmVycy5wdXNoKGZuKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEV2ZW50U291cmNlV3JhcHBlcigpIHtcbiAgaWYgKCF3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXIpIHtcbiAgICB3aW5kb3cuX193aG1FdmVudFNvdXJjZVdyYXBwZXIgPSB7fTtcbiAgfVxuICBpZiAoIXdpbmRvdy5fX3dobUV2ZW50U291cmNlV3JhcHBlcltvcHRpb25zLnBhdGhdKSB7XG4gICAgLy8gY2FjaGUgdGhlIHdyYXBwZXIgZm9yIG90aGVyIGVudHJpZXMgbG9hZGVkIG9uXG4gICAgLy8gdGhlIHNhbWUgcGFnZSB3aXRoIHRoZSBzYW1lIG9wdGlvbnMucGF0aFxuICAgIHdpbmRvdy5fX3dobUV2ZW50U291cmNlV3JhcHBlcltvcHRpb25zLnBhdGhdID0gRXZlbnRTb3VyY2VXcmFwcGVyKCk7XG4gIH1cbiAgcmV0dXJuIHdpbmRvdy5fX3dobUV2ZW50U291cmNlV3JhcHBlcltvcHRpb25zLnBhdGhdO1xufVxuXG5mdW5jdGlvbiBjb25uZWN0KCkge1xuICBnZXRFdmVudFNvdXJjZVdyYXBwZXIoKS5hZGRNZXNzYWdlTGlzdGVuZXIoaGFuZGxlTWVzc2FnZSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgIGlmIChldmVudC5kYXRhID09IFwiXFx1RDgzRFxcdURDOTNcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcHJvY2Vzc01lc3NhZ2UoSlNPTi5wYXJzZShldmVudC5kYXRhKSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiSW52YWxpZCBITVIgbWVzc2FnZTogXCIgKyBldmVudC5kYXRhICsgXCJcXG5cIiArIGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gdGhlIHJlcG9ydGVyIG5lZWRzIHRvIGJlIGEgc2luZ2xldG9uIG9uIHRoZSBwYWdlXG4vLyBpbiBjYXNlIHRoZSBjbGllbnQgaXMgYmVpbmcgdXNlZCBieSBtdWx0aXBsZSBidW5kbGVzXG4vLyB3ZSBvbmx5IHdhbnQgdG8gcmVwb3J0IG9uY2UuXG4vLyBhbGwgdGhlIGVycm9ycyB3aWxsIGdvIHRvIGFsbCBjbGllbnRzXG52YXIgc2luZ2xldG9uS2V5ID0gJ19fd2VicGFja19ob3RfbWlkZGxld2FyZV9yZXBvcnRlcl9fJztcbnZhciByZXBvcnRlcjtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBpZiAoIXdpbmRvd1tzaW5nbGV0b25LZXldKSB7XG4gICAgd2luZG93W3NpbmdsZXRvbktleV0gPSBjcmVhdGVSZXBvcnRlcigpO1xuICB9XG4gIHJlcG9ydGVyID0gd2luZG93W3NpbmdsZXRvbktleV07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlcG9ydGVyKCkge1xuICB2YXIgc3RyaXAgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG5cbiAgdmFyIG92ZXJsYXk7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMub3ZlcmxheSkge1xuICAgIG92ZXJsYXkgPSByZXF1aXJlKCcuL2NsaWVudC1vdmVybGF5Jyk7XG4gIH1cblxuICB2YXIgc3R5bGVzID0ge1xuICAgIGVycm9yczogXCJjb2xvcjogI2ZmMDAwMDtcIixcbiAgICB3YXJuaW5nczogXCJjb2xvcjogIzk5OTkzMztcIlxuICB9O1xuICB2YXIgcHJldmlvdXNQcm9ibGVtcyA9IG51bGw7XG4gIGZ1bmN0aW9uIGxvZyh0eXBlLCBvYmopIHtcbiAgICB2YXIgbmV3UHJvYmxlbXMgPSBvYmpbdHlwZV0ubWFwKGZ1bmN0aW9uKG1zZykgeyByZXR1cm4gc3RyaXAobXNnKTsgfSkuam9pbignXFxuJyk7XG4gICAgaWYgKHByZXZpb3VzUHJvYmxlbXMgPT0gbmV3UHJvYmxlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNQcm9ibGVtcyA9IG5ld1Byb2JsZW1zO1xuICAgIH1cblxuICAgIHZhciBzdHlsZSA9IHN0eWxlc1t0eXBlXTtcbiAgICB2YXIgbmFtZSA9IG9iai5uYW1lID8gXCInXCIgKyBvYmoubmFtZSArIFwiJyBcIiA6IFwiXCI7XG4gICAgdmFyIHRpdGxlID0gXCJbSE1SXSBidW5kbGUgXCIgKyBuYW1lICsgXCJoYXMgXCIgKyBvYmpbdHlwZV0ubGVuZ3RoICsgXCIgXCIgKyB0eXBlO1xuICAgIC8vIE5PVEU6IGNvbnNvbGUud2FybiBvciBjb25zb2xlLmVycm9yIHdpbGwgcHJpbnQgdGhlIHN0YWNrIHRyYWNlXG4gICAgLy8gd2hpY2ggaXNuJ3QgaGVscGZ1bCBoZXJlLCBzbyB1c2luZyBjb25zb2xlLmxvZyB0byBlc2NhcGUgaXQuXG4gICAgaWYgKGNvbnNvbGUuZ3JvdXAgJiYgY29uc29sZS5ncm91cEVuZCkge1xuICAgICAgY29uc29sZS5ncm91cChcIiVjXCIgKyB0aXRsZSwgc3R5bGUpO1xuICAgICAgY29uc29sZS5sb2coXCIlY1wiICsgbmV3UHJvYmxlbXMsIHN0eWxlKTtcbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiJWNcIiArIHRpdGxlICsgXCJcXG5cXHQlY1wiICsgbmV3UHJvYmxlbXMucmVwbGFjZSgvXFxuL2csIFwiXFxuXFx0XCIpLFxuICAgICAgICBzdHlsZSArIFwiZm9udC13ZWlnaHQ6IGJvbGQ7XCIsXG4gICAgICAgIHN0eWxlICsgXCJmb250LXdlaWdodDogbm9ybWFsO1wiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xlYW5Qcm9ibGVtc0NhY2hlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2aW91c1Byb2JsZW1zID0gbnVsbDtcbiAgICB9LFxuICAgIHByb2JsZW1zOiBmdW5jdGlvbih0eXBlLCBvYmopIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgbG9nKHR5cGUsIG9iaik7XG4gICAgICB9XG4gICAgICBpZiAob3ZlcmxheSAmJiB0eXBlICE9PSAnd2FybmluZ3MnKSBvdmVybGF5LnNob3dQcm9ibGVtcyh0eXBlLCBvYmpbdHlwZV0pO1xuICAgIH0sXG4gICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5jbGVhcigpO1xuICAgIH0sXG4gICAgdXNlQ3VzdG9tT3ZlcmxheTogZnVuY3Rpb24oY3VzdG9tT3ZlcmxheSkge1xuICAgICAgb3ZlcmxheSA9IGN1c3RvbU92ZXJsYXk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgcHJvY2Vzc1VwZGF0ZSA9IHJlcXVpcmUoJy4vcHJvY2Vzcy11cGRhdGUnKTtcblxudmFyIGN1c3RvbUhhbmRsZXI7XG52YXIgc3Vic2NyaWJlQWxsSGFuZGxlcjtcbmZ1bmN0aW9uIHByb2Nlc3NNZXNzYWdlKG9iaikge1xuICBzd2l0Y2gob2JqLmFjdGlvbikge1xuICAgIGNhc2UgXCJidWlsZGluZ1wiOlxuICAgICAgaWYgKG9wdGlvbnMubG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiW0hNUl0gYnVuZGxlIFwiICsgKG9iai5uYW1lID8gXCInXCIgKyBvYmoubmFtZSArIFwiJyBcIiA6IFwiXCIpICtcbiAgICAgICAgICBcInJlYnVpbGRpbmdcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJ1aWx0XCI6XG4gICAgICBpZiAob3B0aW9ucy5sb2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJbSE1SXSBidW5kbGUgXCIgKyAob2JqLm5hbWUgPyBcIidcIiArIG9iai5uYW1lICsgXCInIFwiIDogXCJcIikgK1xuICAgICAgICAgIFwicmVidWlsdCBpbiBcIiArIG9iai50aW1lICsgXCJtc1wiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICBjYXNlIFwic3luY1wiOlxuICAgICAgaWYgKG9iai5uYW1lICYmIG9wdGlvbnMubmFtZSAmJiBvYmoubmFtZSAhPT0gb3B0aW9ucy5uYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHJlcG9ydGVyKSByZXBvcnRlci5wcm9ibGVtcygnZXJyb3JzJywgb2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXBvcnRlcikge1xuICAgICAgICAgIGlmIChvYmoud2FybmluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVwb3J0ZXIucHJvYmxlbXMoJ3dhcm5pbmdzJywgb2JqKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVwb3J0ZXIuY2xlYW5Qcm9ibGVtc0NhY2hlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcG9ydGVyLnN1Y2Nlc3MoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzVXBkYXRlKG9iai5oYXNoLCBvYmoubW9kdWxlcywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKGN1c3RvbUhhbmRsZXIpIHtcbiAgICAgICAgY3VzdG9tSGFuZGxlcihvYmopO1xuICAgICAgfVxuICB9XG5cbiAgaWYgKHN1YnNjcmliZUFsbEhhbmRsZXIpIHtcbiAgICBzdWJzY3JpYmVBbGxIYW5kbGVyKG9iaik7XG4gIH1cbn1cblxuaWYgKG1vZHVsZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdWJzY3JpYmVBbGw6IGZ1bmN0aW9uIHN1YnNjcmliZUFsbChoYW5kbGVyKSB7XG4gICAgICBzdWJzY3JpYmVBbGxIYW5kbGVyID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gc3Vic2NyaWJlKGhhbmRsZXIpIHtcbiAgICAgIGN1c3RvbUhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIH0sXG4gICAgdXNlQ3VzdG9tT3ZlcmxheTogZnVuY3Rpb24gdXNlQ3VzdG9tT3ZlcmxheShjdXN0b21PdmVybGF5KSB7XG4gICAgICBpZiAocmVwb3J0ZXIpIHJlcG9ydGVyLnVzZUN1c3RvbU92ZXJsYXkoY3VzdG9tT3ZlcmxheSk7XG4gICAgfVxuICB9O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL2NsaWVudC5qcz9wYXRoPWh0dHA6Ly8xMjcuMC4wLjE6MzAwMC9fX3dlYnBhY2tfaG1yJnRpbWVvdXQ9MjAwMDBcbi8vIG1vZHVsZSBpZCA9IDU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuc2lIVE1MXG5cbi8vIFJlZmVyZW5jZSB0byBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2Fuc2ktcmVnZXhcbnZhciBfcmVnQU5TSSA9IC8oPzooPzpcXHUwMDFiXFxbKXxcXHUwMDliKSg/Oig/OlswLTldezEsM30pPyg/Oig/OjtbMC05XXswLDN9KSopP1tBLU18Zi1tXSl8XFx1MDAxYltBLU1dL1xuXG52YXIgX2RlZkNvbG9ycyA9IHtcbiAgcmVzZXQ6IFsnZmZmJywgJzAwMCddLCAvLyBbRk9SRUdST1VEX0NPTE9SLCBCQUNLR1JPVU5EX0NPTE9SXVxuICBibGFjazogJzAwMCcsXG4gIHJlZDogJ2ZmMDAwMCcsXG4gIGdyZWVuOiAnMjA5ODA1JyxcbiAgeWVsbG93OiAnZThiZjAzJyxcbiAgYmx1ZTogJzAwMDBmZicsXG4gIG1hZ2VudGE6ICdmZjAwZmYnLFxuICBjeWFuOiAnMDBmZmVlJyxcbiAgbGlnaHRncmV5OiAnZjBmMGYwJyxcbiAgZGFya2dyZXk6ICc4ODgnXG59XG52YXIgX3N0eWxlcyA9IHtcbiAgMzA6ICdibGFjaycsXG4gIDMxOiAncmVkJyxcbiAgMzI6ICdncmVlbicsXG4gIDMzOiAneWVsbG93JyxcbiAgMzQ6ICdibHVlJyxcbiAgMzU6ICdtYWdlbnRhJyxcbiAgMzY6ICdjeWFuJyxcbiAgMzc6ICdsaWdodGdyZXknXG59XG52YXIgX29wZW5UYWdzID0ge1xuICAnMSc6ICdmb250LXdlaWdodDpib2xkJywgLy8gYm9sZFxuICAnMic6ICdvcGFjaXR5OjAuNScsIC8vIGRpbVxuICAnMyc6ICc8aT4nLCAvLyBpdGFsaWNcbiAgJzQnOiAnPHU+JywgLy8gdW5kZXJzY29yZVxuICAnOCc6ICdkaXNwbGF5Om5vbmUnLCAvLyBoaWRkZW5cbiAgJzknOiAnPGRlbD4nIC8vIGRlbGV0ZVxufVxudmFyIF9jbG9zZVRhZ3MgPSB7XG4gICcyMyc6ICc8L2k+JywgLy8gcmVzZXQgaXRhbGljXG4gICcyNCc6ICc8L3U+JywgLy8gcmVzZXQgdW5kZXJzY29yZVxuICAnMjknOiAnPC9kZWw+JyAvLyByZXNldCBkZWxldGVcbn1cblxuO1swLCAyMSwgMjIsIDI3LCAyOCwgMzksIDQ5XS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gIF9jbG9zZVRhZ3Nbbl0gPSAnPC9zcGFuPidcbn0pXG5cbi8qKlxuICogQ29udmVydHMgdGV4dCB3aXRoIEFOU0kgY29sb3IgY29kZXMgdG8gSFRNTCBtYXJrdXAuXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGFuc2lIVE1MICh0ZXh0KSB7XG4gIC8vIFJldHVybnMgdGhlIHRleHQgaWYgdGhlIHN0cmluZyBoYXMgbm8gQU5TSSBlc2NhcGUgY29kZS5cbiAgaWYgKCFfcmVnQU5TSS50ZXN0KHRleHQpKSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxuXG4gIC8vIENhY2hlIG9wZW5lZCBzZXF1ZW5jZS5cbiAgdmFyIGFuc2lDb2RlcyA9IFtdXG4gIC8vIFJlcGxhY2Ugd2l0aCBtYXJrdXAuXG4gIHZhciByZXQgPSB0ZXh0LnJlcGxhY2UoL1xcMDMzXFxbKFxcZCspKm0vZywgZnVuY3Rpb24gKG1hdGNoLCBzZXEpIHtcbiAgICB2YXIgb3QgPSBfb3BlblRhZ3Nbc2VxXVxuICAgIGlmIChvdCkge1xuICAgICAgLy8gSWYgY3VycmVudCBzZXF1ZW5jZSBoYXMgYmVlbiBvcGVuZWQsIGNsb3NlIGl0LlxuICAgICAgaWYgKCEhfmFuc2lDb2Rlcy5pbmRleE9mKHNlcSkpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1leHRyYS1ib29sZWFuLWNhc3RcbiAgICAgICAgYW5zaUNvZGVzLnBvcCgpXG4gICAgICAgIHJldHVybiAnPC9zcGFuPidcbiAgICAgIH1cbiAgICAgIC8vIE9wZW4gdGFnLlxuICAgICAgYW5zaUNvZGVzLnB1c2goc2VxKVxuICAgICAgcmV0dXJuIG90WzBdID09PSAnPCcgPyBvdCA6ICc8c3BhbiBzdHlsZT1cIicgKyBvdCArICc7XCI+J1xuICAgIH1cblxuICAgIHZhciBjdCA9IF9jbG9zZVRhZ3Nbc2VxXVxuICAgIGlmIChjdCkge1xuICAgICAgLy8gUG9wIHNlcXVlbmNlXG4gICAgICBhbnNpQ29kZXMucG9wKClcbiAgICAgIHJldHVybiBjdFxuICAgIH1cbiAgICByZXR1cm4gJydcbiAgfSlcblxuICAvLyBNYWtlIHN1cmUgdGFncyBhcmUgY2xvc2VkLlxuICB2YXIgbCA9IGFuc2lDb2Rlcy5sZW5ndGhcbiAgOyhsID4gMCkgJiYgKHJldCArPSBBcnJheShsICsgMSkuam9pbignPC9zcGFuPicpKVxuXG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBDdXN0b21pemUgY29sb3JzLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbG9ycyByZWZlcmVuY2UgdG8gX2RlZkNvbG9yc1xuICovXG5hbnNpSFRNTC5zZXRDb2xvcnMgPSBmdW5jdGlvbiAoY29sb3JzKSB7XG4gIGlmICh0eXBlb2YgY29sb3JzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcignYGNvbG9yc2AgcGFyYW1ldGVyIG11c3QgYmUgYW4gT2JqZWN0LicpXG4gIH1cblxuICB2YXIgX2ZpbmFsQ29sb3JzID0ge31cbiAgZm9yICh2YXIga2V5IGluIF9kZWZDb2xvcnMpIHtcbiAgICB2YXIgaGV4ID0gY29sb3JzLmhhc093blByb3BlcnR5KGtleSkgPyBjb2xvcnNba2V5XSA6IG51bGxcbiAgICBpZiAoIWhleCkge1xuICAgICAgX2ZpbmFsQ29sb3JzW2tleV0gPSBfZGVmQ29sb3JzW2tleV1cbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICAgIGlmICgncmVzZXQnID09PSBrZXkpIHtcbiAgICAgIGlmICh0eXBlb2YgaGV4ID09PSAnc3RyaW5nJykge1xuICAgICAgICBoZXggPSBbaGV4XVxuICAgICAgfVxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGhleCkgfHwgaGV4Lmxlbmd0aCA9PT0gMCB8fCBoZXguc29tZShmdW5jdGlvbiAoaCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGggIT09ICdzdHJpbmcnXG4gICAgICB9KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB2YWx1ZSBvZiBgJyArIGtleSArICdgIHByb3BlcnR5IG11c3QgYmUgYW4gQXJyYXkgYW5kIGVhY2ggaXRlbSBjb3VsZCBvbmx5IGJlIGEgaGV4IHN0cmluZywgZS5nLjogRkYwMDAwJylcbiAgICAgIH1cbiAgICAgIHZhciBkZWZIZXhDb2xvciA9IF9kZWZDb2xvcnNba2V5XVxuICAgICAgaWYgKCFoZXhbMF0pIHtcbiAgICAgICAgaGV4WzBdID0gZGVmSGV4Q29sb3JbMF1cbiAgICAgIH1cbiAgICAgIGlmIChoZXgubGVuZ3RoID09PSAxIHx8ICFoZXhbMV0pIHtcbiAgICAgICAgaGV4ID0gW2hleFswXV1cbiAgICAgICAgaGV4LnB1c2goZGVmSGV4Q29sb3JbMV0pXG4gICAgICB9XG5cbiAgICAgIGhleCA9IGhleC5zbGljZSgwLCAyKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGhleCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHZhbHVlIG9mIGAnICsga2V5ICsgJ2AgcHJvcGVydHkgbXVzdCBiZSBhIGhleCBzdHJpbmcsIGUuZy46IEZGMDAwMCcpXG4gICAgfVxuICAgIF9maW5hbENvbG9yc1trZXldID0gaGV4XG4gIH1cbiAgX3NldFRhZ3MoX2ZpbmFsQ29sb3JzKVxufVxuXG4vKipcbiAqIFJlc2V0IGNvbG9ycy5cbiAqL1xuYW5zaUhUTUwucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gIF9zZXRUYWdzKF9kZWZDb2xvcnMpXG59XG5cbi8qKlxuICogRXhwb3NlIHRhZ3MsIGluY2x1ZGluZyBvcGVuIGFuZCBjbG9zZS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmFuc2lIVE1MLnRhZ3MgPSB7fVxuXG5pZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhbnNpSFRNTC50YWdzLCAnb3BlbicsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9vcGVuVGFncyB9XG4gIH0pXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhbnNpSFRNTC50YWdzLCAnY2xvc2UnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfY2xvc2VUYWdzIH1cbiAgfSlcbn0gZWxzZSB7XG4gIGFuc2lIVE1MLnRhZ3Mub3BlbiA9IF9vcGVuVGFnc1xuICBhbnNpSFRNTC50YWdzLmNsb3NlID0gX2Nsb3NlVGFnc1xufVxuXG5mdW5jdGlvbiBfc2V0VGFncyAoY29sb3JzKSB7XG4gIC8vIHJlc2V0IGFsbFxuICBfb3BlblRhZ3NbJzAnXSA9ICdmb250LXdlaWdodDpub3JtYWw7b3BhY2l0eToxO2NvbG9yOiMnICsgY29sb3JzLnJlc2V0WzBdICsgJztiYWNrZ3JvdW5kOiMnICsgY29sb3JzLnJlc2V0WzFdXG4gIC8vIGludmVyc2VcbiAgX29wZW5UYWdzWyc3J10gPSAnY29sb3I6IycgKyBjb2xvcnMucmVzZXRbMV0gKyAnO2JhY2tncm91bmQ6IycgKyBjb2xvcnMucmVzZXRbMF1cbiAgLy8gZGFyayBncmV5XG4gIF9vcGVuVGFnc1snOTAnXSA9ICdjb2xvcjojJyArIGNvbG9ycy5kYXJrZ3JleVxuXG4gIGZvciAodmFyIGNvZGUgaW4gX3N0eWxlcykge1xuICAgIHZhciBjb2xvciA9IF9zdHlsZXNbY29kZV1cbiAgICB2YXIgb3JpQ29sb3IgPSBjb2xvcnNbY29sb3JdIHx8ICcwMDAnXG4gICAgX29wZW5UYWdzW2NvZGVdID0gJ2NvbG9yOiMnICsgb3JpQ29sb3JcbiAgICBjb2RlID0gcGFyc2VJbnQoY29kZSlcbiAgICBfb3BlblRhZ3NbKGNvZGUgKyAxMCkudG9TdHJpbmcoKV0gPSAnYmFja2dyb3VuZDojJyArIG9yaUNvbG9yXG4gIH1cbn1cblxuYW5zaUhUTUwucmVzZXQoKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Fuc2ktaHRtbC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAvW1xcdTAwMWJcXHUwMDliXVtbKCkjOz9dKig/OlswLTldezEsNH0oPzo7WzAtOV17MCw0fSkqKT9bMC05QS1QUlpjZi1ucXJ5PT48XS9nO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnNpLXJlZ2V4L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uLy4uL3N0eWxlL2luZGV4Lmxlc3MnKTtcblxucmVxdWlyZSgnLi9pbmRleC5sZXNzJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FudGQvbGliL2J1dHRvbi9zdHlsZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi8uLi9zdHlsZS9pbmRleC5sZXNzJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FudGQvbGliL2ljb24vc3R5bGUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDU5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzIvNi5cclxuICovXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQge3JvdXRlckFjdGlvbnN9IGZyb20gJ3JlYWN0LXJvdXRlci1yZWR1eCc7XHJcbmltcG9ydCB7SW5wdXQsIG1lc3NhZ2V9IGZyb20gJ2FudGQnO1xyXG5pbXBvcnQge3Nlc3Npb25BY3Rpb25zfSBmcm9tICcuLi8uLi9hY3Rpb25zL2luZGV4JztcclxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL0xvZ2luLnNjc3MnO1xyXG5cclxuY29uc3QgY2hlY2tVc2VybmFtZSA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgaWYoIXVzZXJuYW1lKXtcclxuICAgICAgICByZXR1cm4gJ+eUqOaIt+WQjeS4jeiDveS4uuepuic7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrUGFzc3dvcmQgPSAocGFzc3dvcmQpID0+IHtcclxuICAgIGlmKCFwYXNzd29yZCl7XHJcbiAgICAgICAgcmV0dXJuICflr4bnoIHkuI3og73kuLrnqbonO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5jbGFzcyBMb2dpbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgICAgIGVtYWlsOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2hhbmdlID0gKHBhcmFtKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdGUsXHJcbiAgICAgICAgICAgIC4uLnBhcmFtXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgY29uc3Qge2hhbmRsZUxvZ2luLCBpc0xvYWRpbmcsIGp1bXBUb1JlZ2lzdGVyfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgY29uc3Qge3VzZXJuYW1lLCBwYXNzd29yZH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17c3R5bGVzLmxvZ2luQmxvY2t9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPXtzdHlsZXMuaGVhZGVyfT48cD7nmbvlvZU8L3A+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaW5wdXRUaXRsZX0+PHA+55So5oi35ZCNPC9wPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmlucHV0U2VjdGlvbn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXQgZGlzYWJsZWQ9e2lzTG9hZGluZ30gdHlwZT1cInRleHRcIiB2YWx1ZT17dXNlcm5hbWV9IG9uQ2hhbmdlPXsoZSkgPT4ge3RoaXMuaGFuZGxlQ2hhbmdlKHt1c2VybmFtZTogZS50YXJnZXQudmFsdWV9KTt9fSBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeeUqOaIt+WQjVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaW5wdXRDb250YWluZXJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmlucHV0VGl0bGV9PjxwPuWvhueggTwvcD48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5pbnB1dFNlY3Rpb259PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0IGRpc2FibGVkPXtpc0xvYWRpbmd9IHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPXtwYXNzd29yZH0gb25DaGFuZ2U9eyhlKSA9PiB7dGhpcy5oYW5kbGVDaGFuZ2Uoe3Bhc3N3b3JkOiBlLnRhcmdldC52YWx1ZX0pO319IHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl5a+G56CBXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5idXR0b25Db250YWluZXJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRpc2FibGVkPXtpc0xvYWRpbmd9IGNsYXNzTmFtZT17YCR7c3R5bGVzLmJ1dHRvbn0gJHtzdHlsZXMubG9naW5CdG59YH0gb25DbGljaz17KCkgPT4ge2hhbmRsZUxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCk7fX0+55m75b2VPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGlzYWJsZWQ9e2lzTG9hZGluZ30gY2xhc3NOYW1lPXtgJHtzdHlsZXMuYnV0dG9ufSAke3N0eWxlcy5yZWdpc3RlckJ0bn1gfSBvbkNsaWNrPXtqdW1wVG9SZWdpc3Rlcn0+5rOo5YaMPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0YXRlID0+IHtcclxuICAgIGNvbnN0IHt1c2VyLCBpc0xvYWRpbmd9ID0gc3RhdGUuZ2V0U2Vzc2lvbjtcclxuICAgIHJldHVybiB7dXNlciwgaXNMb2FkaW5nfTtcclxufTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IGRpc3BhdGNoID0+ICh7XHJcbiAgICBoYW5kbGVMb2dpbjogKHVzZXJuYW1lLCBwYXNzd29yZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVzbkNoZWNrUmVzID0gY2hlY2tVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgICAgY29uc3QgcHdkQ2hlY2tSZXMgPSBjaGVja1Bhc3N3b3JkKHBhc3N3b3JkKTtcclxuICAgICAgICBpZih1c25DaGVja1Jlcyl7XHJcbiAgICAgICAgICAgIG1lc3NhZ2Uud2Fybih1c25DaGVja1Jlcyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocHdkQ2hlY2tSZXMpe1xyXG4gICAgICAgICAgICBtZXNzYWdlLndhcm4ocHdkQ2hlY2tSZXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKHNlc3Npb25BY3Rpb25zLmxvZ2luKCdyZXF1ZXN0Jywge3VzZXJuYW1lLCBwYXNzd29yZH0pKTtcclxuICAgIH0sXHJcbiAgICBqdW1wVG9SZWdpc3RlcjogKCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHJvdXRlckFjdGlvbnMucHVzaCgnL3JlZ2lzdGVyJykpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKExvZ2luKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSG9tZS9Mb2dpbi9Mb2dpbi5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzMvNC5cclxuICovXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQge3JvdXRlckFjdGlvbnN9IGZyb20gJ3JlYWN0LXJvdXRlci1yZWR1eCc7XHJcbmltcG9ydCB7SW5wdXQsIG1lc3NhZ2V9IGZyb20gJ2FudGQnO1xyXG5pbXBvcnQge3Nlc3Npb25BY3Rpb25zfSBmcm9tICcuLy4uLy4uL2FjdGlvbnMnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vTG9naW4uc2Nzcyc7XHJcblxyXG5jb25zdCBjaGVja1VzZXJuYW1lID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICBpZighdXNlcm5hbWUpe1xyXG4gICAgICAgIHJldHVybiAn55So5oi35ZCN5LiN6IO95Li656m6JztcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuY29uc3QgY2hlY2tQYXNzd29yZCA9IChwYXNzd29yZCkgPT4ge1xyXG4gICAgaWYoIXBhc3N3b3JkKXtcclxuICAgICAgICByZXR1cm4gJ+WvhueggeS4jeiDveS4uuepuic7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrRW1haWwgPSAoZW1haWwpID0+IHtcclxuICAgIGlmKCFlbWFpbCl7XHJcbiAgICAgICAgcmV0dXJuICfpgq7nrrHkuI3og73kuLrnqbonO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5cclxuY2xhc3MgUmVnaXN0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyl7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgICAgICBlbWFpbDogJycsXHJcbiAgICAgICAgICAgIGlzUmVnaXN0ZXI6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDaGFuZ2UgPSAocGFyYW0pID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZSxcclxuICAgICAgICAgICAgLi4ucGFyYW1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCB7aXNMb2FkaW5nLCBoYW5kbGVSZWdpc3RlciwganVtcFRvTG9naW59ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7dXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17c3R5bGVzLmxvZ2luQmxvY2t9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPXtzdHlsZXMuaGVhZGVyfT48cD7ms6jlhow8L3A+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaW5wdXRUaXRsZX0+PHA+55So5oi35ZCNPC9wPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmlucHV0U2VjdGlvbn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXQgZGlzYWJsZWQ9e2lzTG9hZGluZ30gdHlwZT1cInRleHRcIiB2YWx1ZT17dXNlcm5hbWV9IG9uQ2hhbmdlPXsoZSkgPT4ge3RoaXMuaGFuZGxlQ2hhbmdlKHt1c2VybmFtZTogZS50YXJnZXQudmFsdWV9KTt9fSBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeeUqOaIt+WQjVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaW5wdXRDb250YWluZXJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmlucHV0VGl0bGV9PjxwPuWvhueggTwvcD48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5pbnB1dFNlY3Rpb259PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0IGRpc2FibGVkPXtpc0xvYWRpbmd9IHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPXtwYXNzd29yZH0gb25DaGFuZ2U9eyhlKSA9PiB7dGhpcy5oYW5kbGVDaGFuZ2Uoe3Bhc3N3b3JkOiBlLnRhcmdldC52YWx1ZX0pO319IHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl5a+G56CBXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaW5wdXRUaXRsZX0+PHA+6YKu566xPC9wPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmlucHV0U2VjdGlvbn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXQgZGlzYWJsZWQ9e2lzTG9hZGluZ30gdHlwZT1cInRleHRcIiB2YWx1ZT17ZW1haWx9IG9uQ2hhbmdlPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKHtlbWFpbDogZS50YXJnZXQudmFsdWV9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19IHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl6YKu566x5Zyw5Z2AXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmJ1dHRvbkNvbnRhaW5lcn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGlzYWJsZWQ9e2lzTG9hZGluZ30gY2xhc3NOYW1lPXtgJHtzdHlsZXMuYnV0dG9ufSAke3N0eWxlcy5jb25maXJtQnRufWB9IG9uQ2xpY2s9eygpID0+IHtoYW5kbGVSZWdpc3Rlcih1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsKTt9fT7noa7orqQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkaXNhYmxlZD17aXNMb2FkaW5nfSBjbGFzc05hbWU9e2Ake3N0eWxlcy5idXR0b259ICR7c3R5bGVzLnJlZ2lzdGVyQnRufWB9IG9uQ2xpY2s9e2p1bXBUb0xvZ2lufT7lj5bmtog8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RhdGUgPT4ge1xyXG4gICAgY29uc3Qge3VzZXIsIGlzTG9hZGluZ30gPSBzdGF0ZS5nZXRTZXNzaW9uO1xyXG4gICAgcmV0dXJuIHt1c2VyLCBpc0xvYWRpbmd9O1xyXG59O1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4gKHtcclxuICAgIGhhbmRsZVJlZ2lzdGVyOiAodXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVzbkNoZWNrUmVzID0gY2hlY2tVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgICAgY29uc3QgcHdkQ2hlY2tSZXMgPSBjaGVja1Bhc3N3b3JkKHBhc3N3b3JkKTtcclxuICAgICAgICBjb25zdCBlbWFpbENoZWNrUmVzID0gY2hlY2tFbWFpbChlbWFpbCk7XHJcbiAgICAgICAgaWYodXNuQ2hlY2tSZXMpe1xyXG4gICAgICAgICAgICBtZXNzYWdlLndhcm4odXNuQ2hlY2tSZXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHB3ZENoZWNrUmVzKXtcclxuICAgICAgICAgICAgbWVzc2FnZS53YXJuKHB3ZENoZWNrUmVzKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihlbWFpbENoZWNrUmVzKXtcclxuICAgICAgICAgICAgbWVzc2FnZS53YXJuKGVtYWlsQ2hlY2tSZXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKHNlc3Npb25BY3Rpb25zLnJlZ2lzdGVyKCdyZXF1ZXN0Jywge3VzZXJuYW1lLCBwYXNzd29yZCwgZW1haWx9KSk7XHJcbiAgICB9LFxyXG4gICAganVtcFRvTG9naW46ICgpID0+IHtcclxuICAgICAgICBkaXNwYXRjaChyb3V0ZXJBY3Rpb25zLnB1c2goJy9sb2dpbicpKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShSZWdpc3Rlcik7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0hvbWUvTG9naW4vUmVnaXN0ZXIuanMiLCIvKipcclxuICogQ3JlYXRlZCBieSBKYWRfUEMgb24gMjAxOC8yLzcuXHJcbiAqL1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge0xheW91dCwgSWNvbn0gZnJvbSAnYW50ZCc7XHJcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vaGVhZGVyLnNjc3MnO1xyXG5pbXBvcnQge3Nlc3Npb25BY3Rpb25zfSBmcm9tICcuLy4uL2FjdGlvbnMnO1xyXG5cclxuY29uc3Qge0hlYWRlcn0gPSBMYXlvdXQ7XHJcblxyXG5jbGFzcyBNeUhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxIZWFkZXIgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuaWNvbn0+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8aDE+SGVhZGVyPC9oMT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMubG9nb3V0fSB0aXRsZT1cIueZu+WHulwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25Mb2dvdXR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XCJsb2dvdXRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnVzZXJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9IZWFkZXI+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RhdGUgPT4gKHtcclxuICAgIHVzZXI6IHN0YXRlLmdldFNlc3Npb24udXNlclxyXG59KTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IGRpc3BhdGNoID0+ICh7XHJcbiAgICBvbkxvZ291dDogKCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHNlc3Npb25BY3Rpb25zLmxvZ291dCgncmVxdWVzdCcpKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNeUhlYWRlcik7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Ib21lL2hlYWRlci5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzIvNi5cclxuICovXHJcblxyXG5leHBvcnQgY29uc3QgTE9HSU5fUkVRVUVTVCA9ICflj5HotbfnmbvlvZXor7fmsYInO1xyXG5leHBvcnQgY29uc3QgTE9HSU5fUkVDRUlWRSA9ICfnmbvlvZXmiJDlip8nO1xyXG5leHBvcnQgY29uc3QgTE9HSU5fRVJST1IgPSAn55m75b2V5aSx6LSlJztcclxuZXhwb3J0IGNvbnN0IFJFR0lTVEVSX1JFUVVFU1QgPSAn5Y+R6LW35rOo5YaM6K+35rGCJztcclxuZXhwb3J0IGNvbnN0IFJFR0lTVEVSX1JFQ0VJVkUgPSAn5rOo5YaM5oiQ5YqfJztcclxuZXhwb3J0IGNvbnN0IFJFR0lTVEVSX0VSUk9SID0gJ+azqOWGjOWksei0pSc7XHJcbmV4cG9ydCBjb25zdCBMT0dPVVRfUkVRVUVTVCA9ICflj5Hotbfms6jplIDor7fmsYInO1xyXG5leHBvcnQgY29uc3QgTE9HT1VUX1JFQ0VJVkUgPSAn5rOo6ZSA5oiQ5YqfJztcclxuZXhwb3J0IGNvbnN0IExPR09VVF9FUlJPUiA9ICfms6jplIDlpLHotKUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyID0gKHN0YXR1cywgcGFyYW0pID0+IHtcclxuICAgIHN3aXRjaCAoc3RhdHVzKXtcclxuICAgICAgICBjYXNlICdyZXF1ZXN0JzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFJFR0lTVEVSX1JFUVVFU1QsXHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogcGFyYW0udXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFyYW0ucGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogcGFyYW0uZW1haWxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBjYXNlICdyZWNlaXZlJzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFJFR0lTVEVSX1JFQ0VJVkUsXHJcbiAgICAgICAgICAgICAgICB1c2VyOiBwYXJhbVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFJFR0lTVEVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IHBhcmFtXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgbG9naW4gPSAoc3RhdHVzLCBwYXJhbSkgPT4ge1xyXG4gICAgc3dpdGNoIChzdGF0dXMpe1xyXG4gICAgICAgIGNhc2UgJ3JlcXVlc3QnOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogTE9HSU5fUkVRVUVTVCxcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBwYXJhbS51c2VybmFtZSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXJhbS5wYXNzd29yZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGNhc2UgJ3JlY2VpdmUnOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogTE9HSU5fUkVDRUlWRSxcclxuICAgICAgICAgICAgICAgIHVzZXI6IHBhcmFtXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgY2FzZSAnZXJyb3InOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogTE9HSU5fRVJST1IsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogcGFyYW1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBsb2dvdXQgPSAoc3RhdHVzLCBwYXJhbSkgPT4ge1xyXG4gICAgc3dpdGNoIChzdGF0dXMpe1xyXG4gICAgICAgIGNhc2UgJ3JlcXVlc3QnOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogTE9HT1VUX1JFUVVFU1RcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBjYXNlICdyZWNlaXZlJzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IExPR09VVF9SRUNFSVZFXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgY2FzZSAnZXJyb3InOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogTE9HT1VUX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IHBhcmFtXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FjdGlvbnMvc2Vzc2lvbkFjdGlvbnMuanMiLCIvKipcclxuICogQ3JlYXRlZCBieSBKYWRfUEMgb24gMjAxNy85LzEzLlxyXG4gKi9cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vdGVzdDEuc2Nzcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCl7XHJcbiAgICAgICAgZDMuc2VsZWN0KGAuJHtzdHlsZXMuY29udGFpbmVyfWApXHJcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoJ3AnKVxyXG4gICAgICAgICAgICAudGV4dCgn6L+Z5piv5rWL6K+V5LiAJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgcmV0dXJuKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmNvbnRhaW5lcn0+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXN0XCI+PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvdGVzdDEuanMiLCIvKipcclxuICogQ3JlYXRlZCBieSBKYWRfUEMgb24gMjAxNy85LzEzLlxyXG4gKi9cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vdGVzdDIuc2Nzcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCl7XHJcbiAgICAgICAgZDMuc2VsZWN0KGAuJHtzdHlsZXMuY29udGFpbmVyfWApXHJcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoJ3AnKVxyXG4gICAgICAgICAgICAudGV4dCgn6L+Z5piv5rWL6K+V5LqMJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgcmV0dXJuKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmNvbnRhaW5lcn0+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXN0XCI+PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvdGVzdDIuanMiLCIvKipcclxuICogQ3JlYXRlZCBieSBKYWRfUEMgb24gMjAxOC8yLzI3LlxyXG4gKi9cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtCdXR0b259IGZyb20gJ2FudGQnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vdm9pY2VCdG4uc2Nzcyc7XHJcbmltcG9ydCB7c3RhcnRWb2ljZVJlY29yZCwgc3RvcEFuZFNlbmRSZWNvcmR9IGZyb20gJy4vLi4vdXRpbHMvdm9pY2VDYXB0dXJlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpc01vdXNlZG93bjogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgY29uc3Qge2lzTW91c2Vkb3dufSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNNb3VzZWRvd246IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFZvaWNlUmVjb3JkKCk7IC8v5oyJ5LiL5oyJ6ZKu5ZCO5byA5aeL5b2V6Z+zXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTW91c2Vkb3duOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3BBbmRTZW5kUmVjb3JkKCk7IC8v5p2+5byA5oyJ6ZKu5ZCO5YGc5q2i5b2V6Z+z77yM5bm25bCG5b2V6Z+z5Y+R6YCB5Yiw5pyN5Yqh5Zmo6L+b6KGM6K+G5YirXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8QnV0dG9uPnshaXNNb3VzZWRvd24gPyAn5oyJ5LiL5byA5aeL5b2V6Z+zJyA6ICfmnb7lvIDlgZzmraLlvZXpn7MnfTwvQnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL3ZvaWNlQnRuLmpzIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmFkX1BDIG9uIDIwMTgvMi82LlxyXG4gKi9cclxuXHJcbmltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7c2Vzc2lvbkFjdGlvbnN9IGZyb20gJy4vLi4vYWN0aW9ucyc7XHJcblxyXG5jb25zdCB1c2VyID0gKHN0YXRlID0gd2luZG93LnVzZXIsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSl7XHJcbiAgICAgICAgY2FzZSBzZXNzaW9uQWN0aW9ucy5MT0dJTl9SRUNFSVZFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnVzZXIudXNlcm5hbWU7XHJcbiAgICAgICAgY2FzZSBzZXNzaW9uQWN0aW9ucy5MT0dPVVRfUkVDRUlWRTpcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgZW1haWwgPSAoc3RhdGUgPSB3aW5kb3cuZW1haWwsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSl7XHJcbiAgICAgICAgY2FzZSBzZXNzaW9uQWN0aW9ucy5MT0dJTl9SRUNFSVZFOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnVzZXIuZW1haWw7XHJcbiAgICAgICAgY2FzZSBzZXNzaW9uQWN0aW9ucy5MT0dPVVRfUkVDRUlWRTpcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgaXNMb2FkaW5nID0gKHN0YXRlID0gZmFsc2UsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSl7XHJcbiAgICAgICAgY2FzZSBzZXNzaW9uQWN0aW9ucy5MT0dJTl9SRVFVRVNUOlxyXG4gICAgICAgIGNhc2Ugc2Vzc2lvbkFjdGlvbnMuTE9HT1VUX1JFUVVFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGNhc2Ugc2Vzc2lvbkFjdGlvbnMuTE9HSU5fUkVDRUlWRTpcclxuICAgICAgICBjYXNlIHNlc3Npb25BY3Rpb25zLkxPR0lOX0VSUk9SOlxyXG4gICAgICAgIGNhc2Ugc2Vzc2lvbkFjdGlvbnMuTE9HT1VUX1JFQ0VJVkU6XHJcbiAgICAgICAgY2FzZSBzZXNzaW9uQWN0aW9ucy5MT0dPVVRfRVJST1I6XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBnZXRTZXNzaW9uID0gY29tYmluZVJlZHVjZXJzKHtcclxuICAgIGlzTG9hZGluZyxcclxuICAgIHVzZXIsXHJcbiAgICBlbWFpbFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFNlc3Npb247XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JlZHVjZXJzL3Nlc3Npb25SZWR1Y2Vycy5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzEvMjUuXHJcbiAqL1xyXG5pbXBvcnQge2NhbGwsIGFsbH0gZnJvbSAncmVkdXgtc2FnYS9lZmZlY3RzJztcclxuaW1wb3J0IHNlc3Npb25TYWdhcyBmcm9tICcuL3Nlc3Npb25TYWdhcyc7XHJcblxyXG5mdW5jdGlvbiogcm9vdFNhZ2EoKXtcclxuICAgIHlpZWxkIGFsbChbY2FsbChzZXNzaW9uU2FnYXMpXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvb3RTYWdhO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zYWdhcy9pbmRleC5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzIvNi5cclxuICovXHJcblxyXG5pbXBvcnQge2FsbCwgdGFrZSwgY2FsbCwgcHV0LCBmb3JrfSBmcm9tICdyZWR1eC1zYWdhL2VmZmVjdHMnO1xyXG5pbXBvcnQge3JvdXRlckFjdGlvbnN9IGZyb20gJ3JlYWN0LXJvdXRlci1yZWR1eCc7XHJcbmltcG9ydCB7c2Vzc2lvbkFjdGlvbnN9IGZyb20gJy4vLi4vYWN0aW9ucyc7XHJcbmltcG9ydCB7bWVzc2FnZX0gZnJvbSAnYW50ZCc7XHJcbmltcG9ydCBmZXRjaFByb3h5IGZyb20gJy4vLi4vdXRpbHMvZmV0Y2hQcm94eSc7XHJcblxyXG53aW5kb3cubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbmNvbnN0IGRlbGF5ID0gdGltZSA9PiBuZXcgUHJvbWlzZShyZXMgPT4ge3NldFRpbWVvdXQocmVzLCB0aW1lKTt9KTtcclxuY29uc3QgbG9naW5VcmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59L2xvZ2luYDtcclxuY29uc3QgbG9nb3V0VXJsID0gYCR7bG9jYXRpb24ub3JpZ2lufS9sb2dvdXRgO1xyXG5jb25zdCByZWdpc3RlclVybCA9IGAke2xvY2F0aW9uLm9yaWdpbn0vcmVnaXN0ZXJgO1xyXG5cclxud2luZG93LnJvdXRlckFjdGlvbnMgPSByb3V0ZXJBY3Rpb25zO1xyXG5mdW5jdGlvbiogbG9naW4oe3VzZXJuYW1lLCBwYXNzd29yZH0pe1xyXG4gICAgdHJ5e1xyXG4gICAgICAgIHlpZWxkIGRlbGF5KDUwMCk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHlpZWxkIGNhbGwoZmV0Y2hQcm94eSwgbG9naW5VcmwsIHttZXRob2Q6ICdQT1NUJywgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJywgcGF5bG9hZDoge3VzZXJuYW1lLCBwYXNzd29yZH19KTtcclxuICAgICAgICBpZihyZXN1bHQuc3VjY2VzcyA9PT0gJzEnKXtcclxuICAgICAgICAgICAgeWllbGQgcHV0KHNlc3Npb25BY3Rpb25zLmxvZ2luKCdyZWNlaXZlJywgcmVzdWx0LnZhbHVlKSk7XHJcbiAgICAgICAgICAgIC8v55m75b2V5oiQ5Yqf5ZCO5o6n5Yi26aG16Z2i6Lez6L2s6Iez55m75b2V5YmN55qE6aG16Z2iXHJcbiAgICAgICAgICAgIGxldCBuZXh0VXJsID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnbmV4dFVybD0nKVsxXSB8fCBudWxsO1xyXG4gICAgICAgICAgICBuZXh0VXJsID0gKG5leHRVcmwpID8gZGVjb2RlVVJJQ29tcG9uZW50KG5leHRVcmwpIDogJy8nO1xyXG4gICAgICAgICAgICBpZihuZXh0VXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpe1xyXG4gICAgICAgICAgICAgICAgLy/lpoLmnpznmbvlvZXliY3orr/pl67nmoTmmK8vYXBp5o6l5Y+j77yM5YiZ55u05o6l5bCG6aG16Z2idXJs6Lez6L2s6Iez6K+l5o6l5Y+j77yM5Zug5Li65YmN56uv6Lev55Sx5Lit5LiN5ZCr5pyJL2FwaeaOpeWPo++8jOS8mui3s+i9rOiHszQwNOmhtemdolxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5vcmlnaW4gKyBuZXh0VXJsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgcHV0KHJvdXRlckFjdGlvbnMucHVzaChuZXh0VXJsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtZXNzYWdlLmVycm9yKHJlc3VsdC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHlpZWxkIHB1dChzZXNzaW9uQWN0aW9ucy5sb2dpbignZXJyb3InLCByZXN1bHQudmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpe1xyXG4gICAgICAgIG1lc3NhZ2UuZXJyb3IoZXJyKTtcclxuICAgICAgICB5aWVsZCBwdXQoc2Vzc2lvbkFjdGlvbnMubG9naW4oJ2Vycm9yJywgZXJyKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uKiBsb2dvdXQoKXtcclxuICAgIHRyeXtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB5aWVsZCBjYWxsKGZldGNoUHJveHksIGxvZ291dFVybCk7XHJcbiAgICAgICAgaWYocmVzdWx0LnN1Y2Nlc3MgPT0gJzAnKXtcclxuICAgICAgICAgICAgbWVzc2FnZS5lcnJvcihyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgICAgICB5aWVsZCBwdXQoc2Vzc2lvbkFjdGlvbnMubG9nb3V0KCdlcnJvcicsIHJlc3VsdC52YWx1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlpZWxkIHB1dChzZXNzaW9uQWN0aW9ucy5sb2dvdXQoJ3JlY2VpdmUnKSk7XHJcbiAgICAgICAgICAgIHlpZWxkIHB1dChyb3V0ZXJBY3Rpb25zLnB1c2goJy9sb2dpbicpKTtcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoKGVycil7XHJcbiAgICAgICAgbWVzc2FnZS5lcnJvcihlcnIpO1xyXG4gICAgICAgIHlpZWxkIHB1dChzZXNzaW9uQWN0aW9ucy5sb2dvdXQoJ2Vycm9yJywgZXJyKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uKiByZWdpc3Rlcih7dXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbH0pe1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0geWllbGQgY2FsbChmZXRjaFByb3h5LCByZWdpc3RlclVybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICAgcGF5bG9hZDoge25hbWU6IHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWx9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzID09PSAnMCcpIHtcclxuICAgICAgICAgICAgbWVzc2FnZS5lcnJvcihyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgPT09ICcxJykge1xyXG4gICAgICAgICAgICBtZXNzYWdlLnN1Y2Nlc3MocmVzdWx0LnZhbHVlKTtcclxuICAgICAgICAgICAgeWllbGQgcHV0KHJvdXRlckFjdGlvbnMucHVzaCgnL2xvZ2luJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICBtZXNzYWdlLmVycm9yKGVycik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uKiB3YXRjaExvZ2luKCl7XHJcbiAgICB3aGlsZSh0cnVlKXtcclxuICAgICAgICBjb25zdCB7dXNlcm5hbWUsIHBhc3N3b3JkfSA9IHlpZWxkIHRha2Uoc2Vzc2lvbkFjdGlvbnMuTE9HSU5fUkVRVUVTVCk7XHJcbiAgICAgICAgeWllbGQgZm9yayhsb2dpbiwge3VzZXJuYW1lLCBwYXNzd29yZH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiogd2F0Y2hMb2dvdXQoKXtcclxuICAgIHdoaWxlKHRydWUpe1xyXG4gICAgICAgIHlpZWxkIHRha2Uoc2Vzc2lvbkFjdGlvbnMuTE9HT1VUX1JFUVVFU1QpO1xyXG4gICAgICAgIHlpZWxkIGZvcmsobG9nb3V0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24qIHdhdGNoUmVnaXN0ZXIoKXtcclxuICAgIHdoaWxlKHRydWUpe1xyXG4gICAgICAgIGNvbnN0IHt1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsfSA9IHlpZWxkIHRha2Uoc2Vzc2lvbkFjdGlvbnMuUkVHSVNURVJfUkVRVUVTVCk7XHJcbiAgICAgICAgeWllbGQgZm9yayhyZWdpc3Rlciwge3VzZXJuYW1lLCBwYXNzd29yZCwgZW1haWx9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24qIHNlc3Npb25TYWdhKCl7XHJcbiAgICB5aWVsZCBhbGwoW2NhbGwod2F0Y2hMb2dpbiksIGNhbGwod2F0Y2hMb2dvdXQpLCBjYWxsKHdhdGNoUmVnaXN0ZXIpXSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2FnYXMvc2Vzc2lvblNhZ2FzLmpzIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmFkX1BDIG9uIDIwMTgvMS8yNS5cclxuICovXHJcbmltcG9ydCB7Y3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZX0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQge2Jyb3dzZXJIaXN0b3J5fSBmcm9tICdyZWFjdC1yb3V0ZXInO1xyXG5pbXBvcnQge3JvdXRlck1pZGRsZXdhcmUsIHJvdXRlckFjdGlvbnN9IGZyb20gJ3JlYWN0LXJvdXRlci1yZWR1eCc7XHJcbmltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tICdyZWR1eC1zYWdhJztcclxuaW1wb3J0IHtjcmVhdGVMb2dnZXJ9IGZyb20gJ3JlZHV4LWxvZ2dlcic7XHJcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLy4uL3JlZHVjZXJzJztcclxuaW1wb3J0IHJvb3RTYWdhIGZyb20gJy4vLi4vc2FnYXMnO1xyXG5cclxuY29uc3Qgc2FnYU1pZGRsZXdhcmUgPSBjcmVhdGVTYWdhTWlkZGxld2FyZSgpO1xyXG5jb25zdCByb3V0ZU1pZGRsZXdhcmUgPSByb3V0ZXJNaWRkbGV3YXJlKGJyb3dzZXJIaXN0b3J5KTtcclxuXHJcbmNvbnN0IG1pZGRsZXdhcmVzID0gW3NhZ2FNaWRkbGV3YXJlLCByb3V0ZU1pZGRsZXdhcmVdO1xyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG5pZihwcm9jZXNzLmVudi5OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKXtcclxuICAgIG1pZGRsZXdhcmVzLnB1c2goY3JlYXRlTG9nZ2VyKCkpO1xyXG59XHJcblxyXG5jb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxyXG4gICAgcm9vdFJlZHVjZXIsXHJcbiAgICBhcHBseU1pZGRsZXdhcmUoLi4ubWlkZGxld2FyZXMpXHJcbik7XHJcbndpbmRvdy5zdG9yZSA9IHN0b3JlO1xyXG53aW5kb3cucm91dGVyQWN0aW9ucyA9IHJvdXRlckFjdGlvbnM7XHJcblxyXG5pZihwcm9jZXNzLmVudi5OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnICYmIG1vZHVsZS5ob3Qpe1xyXG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vLi4vcmVkdWNlcnMnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV4dFJvb3RSZWR1Y2VyID0gcmVxdWlyZSgnLi8uLi9yZWR1Y2VycycpO1xyXG4gICAgICAgIHN0b3JlLnJlcGxhY2VSZWR1Y2VyKG5leHRSb290UmVkdWNlcik7XHJcbiAgICB9KTtcclxufVxyXG4vKiBlc2xpbnQtZW5hYmxlICovXHJcblxyXG5zYWdhTWlkZGxld2FyZS5ydW4ocm9vdFNhZ2EpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RvcmU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N0b3JlL2luZGV4LmpzIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmFkX1BDIG9uIDIwMTgvMi82LlxyXG4gKi9cclxuXHJcbmNvbnN0IGRvRmV0Y2ggPSAodXJsLCBwYXJhbSA9IHt9KSA9PiB7XHJcbiAgICBsZXQgbWV0aG9kID0gcGFyYW0ubWV0aG9kIHx8ICdnZXQnO1xyXG4gICAgbGV0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgICdQcmFnbWEnOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIC8vICdDYWNoZS1Db250cm9sJzogJ21heC1hZ2U9MTIwMCcsXHJcbiAgICAgICAgLy8gJ1ByYWdtYSc6ICdtYXgtYWdlPTEyMDAnXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChtZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gJ2dldCcpIHtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7aGVhZGVycywgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcGF5bG9hZCA9IHBhcmFtLnBheWxvYWQgfHwgJyc7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gcGFyYW0uY29udGVudFR5cGUgfHwgbnVsbDtcclxuICAgICAgICBpZighY29udGVudFR5cGUpe1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgIGZvcihsZXQga2V5IGluIHBheWxvYWQpe1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFwcGVuZChgJHtrZXl9YCwgcGF5bG9hZFtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBwYXJhbXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgICAgICAgYm9keTogcGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgZmV0Y2hQcm94eSA9ICh1cmwsIHBhcmFtKSA9PiB7XHJcbiAgICByZXR1cm4gZG9GZXRjaCh1cmwsIHBhcmFtKS50aGVuKGRhdGEgPT4gZGF0YS5qc29uKCkpLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hQcm94eTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvZmV0Y2hQcm94eS5qcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEphZF9QQyBvbiAyMDE4LzEvMzAuXHJcbiAqL1xyXG5jb25zdCBNZWRpYVV0aWxzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bnlKjmiLflqpLkvZPorr7lpIco5aSE55CG5YW85a6555qE6Zeu6aKYKVxyXG4gICAgICogQHBhcmFtIHZpZGVvRW5hYmxlIHtib29sZWFufSAtIOaYr+WQpuWQr+eUqOaRhOWDj+WktFxyXG4gICAgICogQHBhcmFtIGF1ZGlvRW5hYmxlIHtib29sZWFufSAtIOaYr+WQpuWQr+eUqOm6puWFi+mjjlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gLSDlpITnkIblm57osINcclxuICAgICAqL1xyXG4gICAgZ2V0VXNlck1lZGlhOiAodmlkZW9FbmFibGUsIGF1ZGlvRW5hYmxlLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYVxyXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWEgfHwgd2luZG93LmdldFVzZXJNZWRpYTtcclxuICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHt2aWRlbzogdmlkZW9FbmFibGUsIGF1ZGlvOiBhdWRpb0VuYWJsZX07XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcclxuICAgICAgICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oKHN0cmVhbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIHN0cmVhbSk7XHJcbiAgICAgICAgICAgIH0pWydjYXRjaCddKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMsIHN0cmVhbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgc3RyZWFtKTtcclxuICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IHN1cHBvcnQgdXNlck1lZGlhJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbPpl63lqpLkvZPmtYFcclxuICAgICAqIEBwYXJhbSBzdHJlYW0ge01lZGlhU3RyZWFtfSAtIOmcgOimgeWFs+mXreeahOa1gVxyXG4gICAgICovXHJcbiAgICBjbG9zZVN0cmVhbTogc3RyZWFtID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHN0cmVhbS5zdG9wID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHN0cmVhbS5zdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdHJhY2tMaXN0ID0gW3N0cmVhbS5nZXRBdWRpb1RyYWNrcygpLCBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYWNrTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyYWNrcyA9IHRyYWNrTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFja3MgJiYgdHJhY2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRyYWNrcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhY2sgPSB0cmFja3Nbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdHJhY2suc3RvcCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLy8g55So5LqO5a2Y5pS+IE1lZGlhUmVjb3JkZXIg5a+56LGh5ZKM6Z+z6aKRVHJhY2vvvIzlhbPpl63lvZXliLblkozlhbPpl63lqpLkvZPorr7lpIfpnIDopoHnlKjliLBcclxubGV0IHJlY29yZGVyLCBtZWRpYVN0cmVhbTtcclxuXHJcbi8vIOeUqOS6juWtmOaUvuW9leWItuWQjueahOmfs+mikeaWh+S7tuWvueixoeWSjOW9leWItue7k+adn+Wbnuiwg1xyXG5sZXQgcmVjb3JkZXJGaWxlLCBzdG9wUmVjb3JkQ2FsbGJhY2s7XHJcblxyXG4vLyDnlKjkuo7lrZjmlL7mmK/lkKblvIDlkK/kuobop4bpopHlvZXliLZcclxubGV0IHZpZGVvRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuLy8g5b2V5Yi255+t6K+t6Z+zXHJcbmV4cG9ydCBjb25zdCBzdGFydFJlY29yZCA9IGVuYWJsZVZpZGVvID0+IHtcclxuICAgIHZpZGVvRW5hYmxlZCA9IGVuYWJsZVZpZGVvO1xyXG4gICAgTWVkaWFVdGlscy5nZXRVc2VyTWVkaWEoZW5hYmxlVmlkZW8sIHRydWUsIChlcnIsIHN0cmVhbSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIOmAmui/hyBNZWRpYVJlY29yZGVyIOiusOW9leiOt+WPluWIsOeahOWqkuS9k+a1gVxyXG4gICAgICAgICAgICByZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSk7XHJcbiAgICAgICAgICAgIG1lZGlhU3RyZWFtID0gc3RyZWFtO1xyXG4gICAgICAgICAgICBsZXQgY2h1bmtzID0gW107XHJcbiAgICAgICAgICAgIHJlY29yZGVyLm9uZGF0YWF2YWlsYWJsZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNodW5rcy5wdXNoKGUuZGF0YSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlY29yZGVyLm9uc3RvcCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlY29yZGVyRmlsZSA9IG5ldyBCbG9iKGNodW5rcywgeyAndHlwZScgOiByZWNvcmRlci5taW1lVHlwZSB9KTtcclxuICAgICAgICAgICAgICAgIGNodW5rcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gc3RvcFJlY29yZENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcFJlY29yZENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlY29yZGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vLyDlgZzmraLlvZXliLZcclxuY29uc3Qgc3RvcFJlY29yZCA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgc3RvcFJlY29yZENhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAvLyDnu4jmraLlvZXliLblmahcclxuICAgIHJlY29yZGVyLnN0b3AoKTtcclxuICAgIC8vIOWFs+mXreWqkuS9k+a1gVxyXG4gICAgTWVkaWFVdGlscy5jbG9zZVN0cmVhbShtZWRpYVN0cmVhbSk7XHJcbn07XHJcblxyXG4vLyDmkq3mlL7lvZXliLbnmoTpn7PpopFcclxuZXhwb3J0IGNvbnN0IHBsYXlSZWNvcmQgPSAoKSA9PiB7XHJcbiAgICBsZXQgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChyZWNvcmRlckZpbGUpO1xyXG4gICAgbGV0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodmlkZW9FbmFibGVkID8gJ3ZpZGVvJyA6ICdhdWRpbycpO1xyXG4gICAgZG9tLmF1dG9wbGF5ID0gdHJ1ZTtcclxuICAgIGRvbS5zcmMgPSB1cmw7XHJcbiAgICBpZiAodmlkZW9FbmFibGVkKSB7XHJcbiAgICAgICAgZG9tLndpZHRoID0gNjQwO1xyXG4gICAgICAgIGRvbS5oZWlnaHQgPSA0ODA7XHJcbiAgICAgICAgZG9tLnN0eWxlLnpJbmRleCA9ICc5OTk5OTk5JztcclxuICAgICAgICBkb20uc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgIGRvbS5zdHlsZS5sZWZ0ID0gJzAnO1xyXG4gICAgICAgIGRvbS5zdHlsZS5yaWdodCA9ICcwJztcclxuICAgICAgICBkb20uc3R5bGUudG9wID0gJzAnO1xyXG4gICAgICAgIGRvbS5zdHlsZS5ib3R0b20gPSAnMCc7XHJcbiAgICAgICAgZG9tLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvbSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBzZW5kUmVjb3JkRmlsZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnXHJcbiAgICB9O1xyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgcmVjb3JkZXJGaWxlKTtcclxuICAgIG9wdGlvbnMuYm9keSA9IGZvcm1EYXRhO1xyXG4gICAgZmV0Y2goJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvcmVjb3JkLWZpbGUnLCBvcHRpb25zKS50aGVuKHJlcyA9PiByZXMuanNvbigpKS50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICByZXMgPSByZXNbMF0gfHwgJyc7XHJcbiAgICAgICAgaWYocmVzLmluY2x1ZGVzKCfmtYvor5XkuIAnKSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zdG9yZS5kaXNwYXRjaCh3aW5kb3cucm91dGVyQWN0aW9ucy5wdXNoKCcvdGVzdDEnKSk7XHJcbiAgICAgICAgfWVsc2UgaWYocmVzLmluY2x1ZGVzKCfmtYvor5XkuownKSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zdG9yZS5kaXNwYXRjaCh3aW5kb3cucm91dGVyQWN0aW9ucy5wdXNoKCcvdGVzdDInKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc3RhcnRWb2ljZVJlY29yZCA9ICgpID0+IHtcclxuICAgIHN0YXJ0UmVjb3JkKGZhbHNlKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzdG9wQW5kU2VuZFJlY29yZCA9ICgpID0+IHtcclxuICAgIHN0b3BSZWNvcmQoc2VuZFJlY29yZEZpbGUpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvdm9pY2VDYXB0dXJlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2pzb24vc3RyaW5naWZ5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeS5qc1xuLy8gbW9kdWxlIGlkID0gNzNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2VcIiksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanNcbi8vIG1vZHVsZSBpZCA9IDc0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBjb3JlID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpO1xudmFyICRKU09OID0gY29yZS5KU09OIHx8IChjb3JlLkpTT04gPSB7IHN0cmluZ2lmeTogSlNPTi5zdHJpbmdpZnkgfSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiAkSlNPTi5zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3VtZW50cyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeS5qc1xuLy8gbW9kdWxlIGlkID0gNzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcucHJvbWlzZS50cnknKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2UuanNcbi8vIG1vZHVsZSBpZCA9IDc2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qc1xuLy8gbW9kdWxlIGlkID0gNzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzXG4vLyBtb2R1bGUgaWQgPSA3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCBhcmdzLCB0aGF0KSB7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ludm9rZS5qc1xuLy8gbW9kdWxlIGlkID0gNzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgU2FmYXJpIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMzOVxuICB9IGVsc2UgaWYgKE9ic2VydmVyICYmICEoZ2xvYmFsLm5hdmlnYXRvciAmJiBnbG9iYWwubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSB7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZiAoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpIHtcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHRhc2sgPSB7IGZuOiBmbiwgbmV4dDogdW5kZWZpbmVkIH07XG4gICAgaWYgKGxhc3QpIGxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYgKCFoZWFkKSB7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanNcbi8vIG1vZHVsZSBpZCA9IDgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGlmIChzYWZlICYmIHRhcmdldFtrZXldKSB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS1hbGwuanNcbi8vIG1vZHVsZSBpZCA9IDgxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qc1xuLy8gbW9kdWxlIGlkID0gODJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHByb21pc2VSZXNvbHZlID0gcmVxdWlyZSgnLi9fcHJvbWlzZS1yZXNvbHZlJyk7XG52YXIgUFJPTUlTRSA9ICdQcm9taXNlJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpc1JlamVjdCkge1xuICBpZiAocHJvbWlzZS5fbikgcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciBvayA9IHByb21pc2UuX3MgPT0gMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbDtcbiAgICAgIHZhciByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZTtcbiAgICAgIHZhciByZWplY3QgPSByZWFjdGlvbi5yZWplY3Q7XG4gICAgICB2YXIgZG9tYWluID0gcmVhY3Rpb24uZG9tYWluO1xuICAgICAgdmFyIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgaWYgKHByb21pc2UuX2ggPT0gMikgb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhbmRsZXIgPT09IHRydWUpIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2UpIHtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkgcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYgKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKSBvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIHVuaGFuZGxlZCA9IGlzVW5oYW5kbGVkKHByb21pc2UpO1xuICAgIHZhciByZXN1bHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYgKHVuaGFuZGxlZCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKSB7XG4gICAgICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZiAodW5oYW5kbGVkICYmIHJlc3VsdC5lKSB0aHJvdyByZXN1bHQudjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UuX2ggIT09IDEgJiYgKHByb21pc2UuX2EgfHwgcHJvbWlzZS5fYykubGVuZ3RoID09PSAwO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKSB7XG4gICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92IH0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmICghcHJvbWlzZS5fYSkgcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIHZhciB0aGVuO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZiAodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgICRyZWplY3QuY2FsbCh7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmICghVVNFX05BVElWRSkge1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fYSkgdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9zKSBub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG4gIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmYgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgcmV0dXJuIEMgPT09ICRQcm9taXNlIHx8IEMgPT09IFdyYXBwZXJcbiAgICAgID8gbmV3IE93blByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICA6IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBQcm9taXNlOiAkUHJvbWlzZSB9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocikge1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcyk7XG4gICAgdmFyICQkcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKExJQlJBUlkgJiYgdGhpcyA9PT0gV3JhcHBlciA/ICRQcm9taXNlIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikge1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciAkaW5kZXggPSBpbmRleCsrO1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanNcbi8vIG1vZHVsZSBpZCA9IDgzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtZmluYWxseVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1Byb21pc2UnLCB7ICdmaW5hbGx5JzogZnVuY3Rpb24gKG9uRmluYWxseSkge1xuICB2YXIgQyA9IHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBjb3JlLlByb21pc2UgfHwgZ2xvYmFsLlByb21pc2UpO1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBvbkZpbmFsbHkgPT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBpc0Z1bmN0aW9uID8gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShDLCBvbkZpbmFsbHkoKSkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9KTtcbiAgICB9IDogb25GaW5hbGx5LFxuICAgIGlzRnVuY3Rpb24gPyBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKEMsIG9uRmluYWxseSgpKS50aGVuKGZ1bmN0aW9uICgpIHsgdGhyb3cgZTsgfSk7XG4gICAgfSA6IG9uRmluYWxseVxuICApO1xufSB9KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcucHJvbWlzZS5maW5hbGx5LmpzXG4vLyBtb2R1bGUgaWQgPSA4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcm9taXNlLXRyeVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1Byb21pc2UnLCB7ICd0cnknOiBmdW5jdGlvbiAoY2FsbGJhY2tmbikge1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gcGVyZm9ybShjYWxsYmFja2ZuKTtcbiAgKHJlc3VsdC5lID8gcHJvbWlzZUNhcGFiaWxpdHkucmVqZWN0IDogcHJvbWlzZUNhcGFiaWxpdHkucmVzb2x2ZSkocmVzdWx0LnYpO1xuICByZXR1cm4gcHJvbWlzZUNhcGFiaWxpdHkucHJvbWlzZTtcbn0gfSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UudHJ5LmpzXG4vLyBtb2R1bGUgaWQgPSA4NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuICAgKiBFdmVudFNvdXJjZSBwb2x5ZmlsbCB2ZXJzaW9uIDAuOS42XG4gICAqIFN1cHBvcnRlZCBieSBzYyBBbXZUZWsgc3JsXG4gICAqIDplbWFpbDogZGV2ZWxAYW12dGVrLmNvbVxuICovXG47KGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIGlmIChnbG9iYWwuRXZlbnRTb3VyY2UgJiYgIWdsb2JhbC5fZXZlbnRTb3VyY2VJbXBvcnRQcmVmaXgpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGV2c0ltcG9ydE5hbWUgPSAoZ2xvYmFsLl9ldmVudFNvdXJjZUltcG9ydFByZWZpeHx8JycpK1wiRXZlbnRTb3VyY2VcIjtcblxuICAgIHZhciBFdmVudFNvdXJjZSA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcblxuICAgICAgICBpZiAoIXVybCB8fCB0eXBlb2YgdXJsICE9ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ05vdCBlbm91Z2ggYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLlVSTCA9IHVybDtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB2YXIgZXZzID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe2V2cy5wb2xsKCl9LCAwKTtcbiAgICB9O1xuXG4gICAgRXZlbnRTb3VyY2UucHJvdG90eXBlID0ge1xuXG4gICAgICAgIENPTk5FQ1RJTkc6IDAsXG5cbiAgICAgICAgT1BFTjogMSxcblxuICAgICAgICBDTE9TRUQ6IDIsXG5cbiAgICAgICAgZGVmYXVsdE9wdGlvbnM6IHtcblxuICAgICAgICAgICAgbG9nZ2luZ0VuYWJsZWQ6IGZhbHNlLFxuXG4gICAgICAgICAgICBsb2dnaW5nUHJlZml4OiBcImV2ZW50c291cmNlXCIsXG5cbiAgICAgICAgICAgIGludGVydmFsOiA1MDAsIC8vIG1pbGxpc2Vjb25kc1xuXG4gICAgICAgICAgICBidWZmZXJTaXplTGltaXQ6IDI1NioxMDI0LCAvLyBieXRlc1xuXG4gICAgICAgICAgICBzaWxlbnRUaW1lb3V0OiAzMDAwMDAsIC8vIG1pbGxpc2Vjb25kc1xuXG4gICAgICAgICAgICBnZXRBcmdzOntcbiAgICAgICAgICAgICAgICAnZXZzX2J1ZmZlcl9zaXplX2xpbWl0JzogMjU2KjEwMjRcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHhockhlYWRlcnM6e1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxuICAgICAgICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgICAgICAgICAgICAnWC1SZXF1ZXN0ZWQtV2l0aCc6ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKXtcblxuICAgICAgICAgICAgdmFyIGRlZmF1bHRzID0gdGhpcy5kZWZhdWx0T3B0aW9ucztcbiAgICAgICAgICAgIHZhciBvcHRpb247XG5cbiAgICAgICAgICAgIC8vIHNldCBhbGwgZGVmYXVsdCBvcHRpb25zLi4uXG4gICAgICAgICAgICBmb3IgKG9wdGlvbiBpbiBkZWZhdWx0cyl7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGRlZmF1bHRzLmhhc093blByb3BlcnR5KG9wdGlvbikgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tvcHRpb25dID0gZGVmYXVsdHNbb3B0aW9uXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG92ZXJyaWRlIHdpdGggd2hhdCBpcyBpbiBvcHRpb25zXG4gICAgICAgICAgICBmb3IgKG9wdGlvbiBpbiBvcHRpb25zKXtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRpb24gaW4gZGVmYXVsdHMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tvcHRpb25dID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgZ2V0QXJncyBvcHRpb24gaXMgZW5hYmxlZFxuICAgICAgICAgICAgLy8gZW5zdXJlIGV2c19idWZmZXJfc2l6ZV9saW1pdCBjb3JyZXNwb25kcyB0byBidWZmZXJTaXplTGltaXRcbiAgICAgICAgICAgIGlmICh0aGlzLmdldEFyZ3MgJiYgdGhpcy5idWZmZXJTaXplTGltaXQpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QXJnc1snZXZzX2J1ZmZlcl9zaXplX2xpbWl0J10gPSB0aGlzLmJ1ZmZlclNpemVMaW1pdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgY29uc29sZSBpcyBub3QgYXZhaWxhYmxlLCBmb3JjZSBsb2dnaW5nRW5hYmxlZCB0byBmYWxzZVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlLmxvZyA9PT0gXCJ1bmRlZmluZWRcIikge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvZzogZnVuY3Rpb24obWVzc2FnZSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sb2dnaW5nRW5hYmxlZCkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbXCIgKyB0aGlzLmxvZ2dpbmdQcmVmaXggK1wiXTpcIiArIG1lc3NhZ2UpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9sbDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IHRoaXMuQ0xPU0VEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSB0aGlzLkNPTk5FQ1RJTkc7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUgPSAnJztcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIgPSBuZXcgdGhpcy5YSFIodGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldE5vQWN0aXZpdHlUaW1lcigpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gaW4gYW4gYXR0ZW1wdCB0byBzaWxlbmNlIHRoZSBlcnJvcnNcbiAgICAgICAgICAgICAgICB0aGlzLmxvZygnVGhlcmUgd2VyZSBlcnJvcnMgaW5zaWRlIHRoZSBwb29sIHRyeS1jYXRjaCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnZXJyb3InLCB7IHR5cGU6ICdlcnJvcicsIGRhdGE6IGUubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwb2xsQWdhaW46IGZ1bmN0aW9uIChpbnRlcnZhbCkge1xuXG4gICAgICAgICAgICAvLyBzY2hlZHVsZSBwb2xsIHRvIGJlIGNhbGxlZCBhZnRlciBpbnRlcnZhbCBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIHZhciBldnMgPSB0aGlzO1xuICAgICAgICAgICAgZXZzLnJlYWR5U3RhdGUgPSBldnMuQ09OTkVDVElORztcbiAgICAgICAgICAgIGV2cy5kaXNwYXRjaEV2ZW50KCdlcnJvcicsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIGRhdGE6IFwiUmVjb25uZWN0aW5nIFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3BvbGxUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtldnMucG9sbCgpfSwgaW50ZXJ2YWx8fDApO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgY2xlYW51cDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMubG9nKCdldnMgY2xlYW5pbmcgdXAnKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcG9sbFRpbWVyKXtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3BvbGxUaW1lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9sbFRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX25vQWN0aXZpdHlUaW1lcil7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9ub0FjdGl2aXR5VGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX25vQWN0aXZpdHlUaW1lciA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl94aHIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3hociA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXROb0FjdGl2aXR5VGltZXI6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNpbGVudFRpbWVvdXQpe1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25vQWN0aXZpdHlUaW1lcil7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fbm9BY3Rpdml0eVRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGV2cyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5fbm9BY3Rpdml0eVRpbWVyID0gc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCl7IGV2cy5sb2coJ1RpbWVvdXQhIHNpbGVudFRJbWVvdXQ6JytldnMuc2lsZW50VGltZW91dCk7IGV2cy5wb2xsQWdhaW4oKTsgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2lsZW50VGltZW91dFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSB0aGlzLkNMT1NFRDtcbiAgICAgICAgICAgIHRoaXMubG9nKCdDbG9zaW5nIGNvbm5lY3Rpb24uIHJlYWR5U3RhdGU6ICcrdGhpcy5yZWFkeVN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYW51cCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uZGF0YTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gdGhpcy5feGhyO1xuXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5pc1JlYWR5KCkgJiYgIXJlcXVlc3QuaGFzRXJyb3IoKSApIHtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgdGltZXIsIGFzIHdlIGhhdmUgYWN0aXZpdHlcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0Tm9BY3Rpdml0eVRpbWVyKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRoaXMgRXZlbnRTb3VyY2UgdG8gT1BFTiBzdGF0ZS4uLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gdGhpcy5DT05ORUNUSU5HKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IHRoaXMuT1BFTjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdvcGVuJywgeyB0eXBlOiAnb3BlbicgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IHJlcXVlc3QuZ2V0QnVmZmVyKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IHRoaXMuYnVmZmVyU2l6ZUxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKCdidWZmZXIubGVuZ3RoID4gdGhpcy5idWZmZXJTaXplTGltaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2xsQWdhaW4oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJzb3IgPT0gMCAmJiBidWZmZXIubGVuZ3RoID4gMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc2tpcCBieXRlIG9yZGVyIG1hcmsgXFx1RkVGRiBjaGFyYWN0ZXIgaWYgaXQgc3RhcnRzIHRoZSBzdHJlYW1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5zdWJzdHJpbmcoMCwxKSA9PSAnXFx1RkVGRicpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RNZXNzYWdlSW5kZXggPSB0aGlzLmxhc3RNZXNzYWdlSW5kZXgoYnVmZmVyKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdE1lc3NhZ2VJbmRleFswXSA+PSB0aGlzLmN1cnNvcil7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld2N1cnNvciA9IGxhc3RNZXNzYWdlSW5kZXhbMV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3BhcnNlID0gYnVmZmVyLnN1YnN0cmluZyh0aGlzLmN1cnNvciwgbmV3Y3Vyc29yKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVN0cmVhbSh0b3BhcnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSBuZXdjdXJzb3I7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgcmVxdWVzdCBpcyBmaW5pc2hlZCwgcmVvcGVuIHRoZSBjb25uZWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuaXNEb25lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coJ3JlcXVlc3QuaXNEb25lKCkuIHJlb3BlbmluZyB0aGUgY29ubmVjdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvbGxBZ2Fpbih0aGlzLmludGVydmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnJlYWR5U3RhdGUgIT09IHRoaXMuQ0xPU0VEKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmxvZygndGhpcy5yZWFkeVN0YXRlICE9PSB0aGlzLkNMT1NFRCcpO1xuICAgICAgICAgICAgICAgIHRoaXMucG9sbEFnYWluKHRoaXMuaW50ZXJ2YWwpO1xuXG4gICAgICAgICAgICAgICAgLy9NVjogVW5zdXJlIHdoeSBhbiBlcnJvciB3YXMgcHJldmlvdXNseSBkaXNwYXRjaGVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VTdHJlYW06IGZ1bmN0aW9uKGNodW5rKSB7XG5cbiAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSBsaW5lIHNlcGFyYXRvcnMgKFxcclxcbixcXHIsXFxuKSB0byBcXG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSB3aGl0ZSBzcGFjZXMgdGhhdCBtYXkgcHJlY2VkZSBcXG5cbiAgICAgICAgICAgIGNodW5rID0gdGhpcy5jYWNoZSArIHRoaXMubm9ybWFsaXplVG9MRihjaHVuayk7XG5cbiAgICAgICAgICAgIHZhciBldmVudHMgPSBjaHVuay5zcGxpdCgnXFxuXFxuJyk7XG5cbiAgICAgICAgICAgIHZhciBpLCBqLCBldmVudFR5cGUsIGRhdGFzLCBsaW5lLCByZXRyeTtcblxuICAgICAgICAgICAgZm9yIChpPTA7IGkgPCAoZXZlbnRzLmxlbmd0aCAtIDEpOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGV2ZW50VHlwZSA9ICdtZXNzYWdlJztcbiAgICAgICAgICAgICAgICBkYXRhcyA9IFtdO1xuICAgICAgICAgICAgICAgIHBhcnRzID0gZXZlbnRzW2ldLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICAgICAgICAgIGZvciAoaj0wOyBqIDwgcGFydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gdGhpcy50cmltV2hpdGVTcGFjZShwYXJ0c1tqXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignZXZlbnQnKSA9PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZSA9IGxpbmUucmVwbGFjZSgvZXZlbnQ6P1xccyovLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5pbmRleE9mKCdyZXRyeScpID09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0cnkgPSBwYXJzZUludChsaW5lLnJlcGxhY2UoL3JldHJ5Oj9cXHMqLywgJycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc05hTihyZXRyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVydmFsID0gcmV0cnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5pbmRleE9mKCdkYXRhJykgPT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhcy5wdXNoKGxpbmUucmVwbGFjZSgvZGF0YTo/XFxzKi8sICcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZS5pbmRleE9mKCdpZDonKSA9PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdEV2ZW50SWQgPSBsaW5lLnJlcGxhY2UoL2lkOj9cXHMqLywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmUuaW5kZXhPZignaWQnKSA9PSAwKSB7IC8vIHRoaXMgcmVzZXRzIHRoZSBpZFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RFdmVudElkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkYXRhcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYSBuZXcgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IE1lc3NhZ2VFdmVudChldmVudFR5cGUsIGRhdGFzLmpvaW4oJ1xcbicpLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luLCB0aGlzLmxhc3RFdmVudElkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50VHlwZSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IGV2ZW50c1tldmVudHMubGVuZ3RoIC0gMV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzcGF0Y2hFdmVudDogZnVuY3Rpb24gKHR5cGUsIGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzWydfJyArIHR5cGUgKyAnSGFuZGxlcnMnXTtcblxuICAgICAgICAgICAgaWYgKGhhbmRsZXJzKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzW2ldLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXNbJ29uJyArIHR5cGVdKSB7XG4gICAgICAgICAgICAgICAgdGhpc1snb24nICsgdHlwZV0uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAodHlwZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzWydfJyArIHR5cGUgKyAnSGFuZGxlcnMnXSkge1xuICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgdHlwZSArICdIYW5kbGVycyddID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXNbJ18nICsgdHlwZSArICdIYW5kbGVycyddLnB1c2goaGFuZGxlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXNbJ18nICsgdHlwZSArICdIYW5kbGVycyddO1xuICAgICAgICAgICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBoYW5kbGVycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyc1tpXSA9PT0gaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcG9sbFRpbWVyOiBudWxsLFxuXG4gICAgICAgIF9ub2FjdGl2aXR5VGltZXI6IG51bGwsXG5cbiAgICAgICAgX3hocjogbnVsbCxcblxuICAgICAgICBsYXN0RXZlbnRJZDogbnVsbCxcblxuICAgICAgICBjYWNoZTogJycsXG5cbiAgICAgICAgY3Vyc29yOiAwLFxuXG4gICAgICAgIG9uZXJyb3I6IG51bGwsXG5cbiAgICAgICAgb25tZXNzYWdlOiBudWxsLFxuXG4gICAgICAgIG9ub3BlbjogbnVsbCxcblxuICAgICAgICByZWFkeVN0YXRlOiAwLFxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gaGVscGVycyBmdW5jdGlvbnNcbiAgICAgICAgLy8gdGhvc2UgYXJlIGF0dGFjaGVkIHRvIHByb3RvdHlwZSB0byBlYXNlIHJldXNlIGFuZCB0ZXN0aW5nLi4uXG5cbiAgICAgICAgdXJsV2l0aFBhcmFtczogZnVuY3Rpb24gKGJhc2VVUkwsIHBhcmFtcykge1xuXG4gICAgICAgICAgICB2YXIgZW5jb2RlZEFyZ3MgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHBhcmFtcyl7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5LCB1cmxhcmc7XG4gICAgICAgICAgICAgICAgdmFyIHVybGl6ZSA9IGVuY29kZVVSSUNvbXBvbmVudDtcblxuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIHBhcmFtcyl7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsYXJnID0gdXJsaXplKGtleSkrJz0nK3VybGl6ZShwYXJhbXNba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVkQXJncy5wdXNoKHVybGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbmNvZGVkQXJncy5sZW5ndGggPiAwKXtcblxuICAgICAgICAgICAgICAgIGlmIChiYXNlVVJMLmluZGV4T2YoJz8nKSA9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2VVUkwgKyAnPycgKyBlbmNvZGVkQXJncy5qb2luKCcmJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJhc2VVUkwgKyAnJicgKyBlbmNvZGVkQXJncy5qb2luKCcmJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmFzZVVSTDtcbiAgICAgICAgfSxcblxuICAgICAgICBsYXN0TWVzc2FnZUluZGV4OiBmdW5jdGlvbih0ZXh0KSB7XG5cbiAgICAgICAgICAgIHZhciBsbjIgPXRleHQubGFzdEluZGV4T2YoJ1xcblxcbicpO1xuICAgICAgICAgICAgdmFyIGxyMiA9IHRleHQubGFzdEluZGV4T2YoJ1xcclxccicpO1xuICAgICAgICAgICAgdmFyIGxybG4yID0gdGV4dC5sYXN0SW5kZXhPZignXFxyXFxuXFxyXFxuJyk7XG5cbiAgICAgICAgICAgIGlmIChscmxuMiA+IE1hdGgubWF4KGxuMiwgbHIyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbHJsbjIsIGxybG4yKzRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtNYXRoLm1heChsbjIsIGxyMiksIE1hdGgubWF4KGxuMiwgbHIyKSArIDJdXG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpbVdoaXRlU3BhY2U6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgLy8gdG8gcmVtb3ZlIHdoaXRlc3BhY2VzIGxlZnQgYW5kIHJpZ2h0IG9mIHN0cmluZ1xuXG4gICAgICAgICAgICB2YXIgcmVUcmltID0gL14oXFxzfFxcdTAwQTApK3woXFxzfFxcdTAwQTApKyQvZztcbiAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBub3JtYWxpemVUb0xGOiBmdW5jdGlvbihzdHIpIHtcblxuICAgICAgICAgICAgLy8gcmVwbGFjZSBcXHIgYW5kIFxcclxcbiB3aXRoIFxcblxuICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGlmICghaXNPbGRJRSgpKXtcblxuICAgICAgICBFdmVudFNvdXJjZS5pc1BvbHlmaWxsID0gXCJYSFJcIjtcblxuICAgICAgICAvLyBFdmVudFNvdXJjZSB3aWxsIHNlbmQgcmVxdWVzdCB1c2luZyBYTUxIdHRwUmVxdWVzdFxuICAgICAgICBFdmVudFNvdXJjZS5wcm90b3R5cGUuWEhSID0gZnVuY3Rpb24oZXZzKSB7XG5cbiAgICAgICAgICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICAgICAgZXZzLl94aHIgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBzZXQgaGFuZGxlcnNcbiAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID4gMSAmJiBldnMucmVhZHlTdGF0ZSAhPSBldnMuQ0xPU0VEKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDAgfHwgKHJlcXVlc3Quc3RhdHVzPj0zMDAgJiYgcmVxdWVzdC5zdGF0dXM8NDAwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBldnMub25kYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Ll9mYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZzLnJlYWR5U3RhdGUgPSBldnMuQ0xPU0VEO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZzLmRpc3BhdGNoRXZlbnQoJ2Vycm9yJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogXCJUaGUgc2VydmVyIHJlc3BvbmRlZCB3aXRoIFwiK3JlcXVlc3Quc3RhdHVzXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2cy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBldnMudXJsV2l0aFBhcmFtcyhldnMuVVJMLCBldnMuZ2V0QXJncyksIHRydWUpO1xuXG4gICAgICAgICAgICB2YXIgaGVhZGVycyA9IGV2cy54aHJIZWFkZXJzOyAvLyBtYXliZSBudWxsXG4gICAgICAgICAgICBmb3IgKHZhciBoZWFkZXIgaW4gaGVhZGVycykge1xuICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGhlYWRlcikpe1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldnMubGFzdEV2ZW50SWQpIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0xhc3QtRXZlbnQtSWQnLCBldnMubGFzdEV2ZW50SWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBFdmVudFNvdXJjZS5wcm90b3R5cGUuWEhSLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAgICAgdXNlWERvbWFpblJlcXVlc3Q6IGZhbHNlLFxuXG4gICAgICAgICAgICBfcmVxdWVzdDogbnVsbCxcblxuICAgICAgICAgICAgX2ZhaWxlZDogZmFsc2UsIC8vIHRydWUgaWYgd2UgaGF2ZSBoYWQgZXJyb3JzLi4uXG5cbiAgICAgICAgICAgIGlzUmVhZHk6IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdC5yZWFkeVN0YXRlID49IDI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpc0RvbmU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9yZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYXNFcnJvcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZhaWxlZCB8fCAodGhpcy5fcmVxdWVzdC5zdGF0dXMgPj0gNDAwKSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRCdWZmZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJ2ID0gJyc7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSB0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dCB8fCAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpe31cbiAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhYm9ydDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuX3JlcXVlc3QgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuXG5cdEV2ZW50U291cmNlLmlzUG9seWZpbGwgPSBcIklFXzgtOVwiO1xuXG4gICAgICAgIC8vIHBhdGNoIEV2ZW50U291cmNlIGRlZmF1bHRPcHRpb25zXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IEV2ZW50U291cmNlLnByb3RvdHlwZS5kZWZhdWx0T3B0aW9ucztcbiAgICAgICAgZGVmYXVsdHMueGhySGVhZGVycyA9IG51bGw7IC8vIG5vIGhlYWRlcnMgd2lsbCBiZSBzZW50XG4gICAgICAgIGRlZmF1bHRzLmdldEFyZ3NbJ2V2c19wcmVhbWJsZSddID0gMjA0OCArIDg7XG5cbiAgICAgICAgLy8gRXZlbnRTb3VyY2Ugd2lsbCBzZW5kIHJlcXVlc3QgdXNpbmcgSW50ZXJuZXQgRXhwbG9yZXIgWERvbWFpblJlcXVlc3RcbiAgICAgICAgRXZlbnRTb3VyY2UucHJvdG90eXBlLlhIUiA9IGZ1bmN0aW9uKGV2cykge1xuXG4gICAgICAgICAgICByZXF1ZXN0ID0gbmV3IFhEb21haW5SZXF1ZXN0KCk7XG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdDtcblxuICAgICAgICAgICAgLy8gc2V0IGhhbmRsZXJzXG4gICAgICAgICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJlcXVlc3QuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldnMub25kYXRhKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldnMub25kYXRhKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXZzLnJlYWR5U3RhdGUgPSBldnMuQ0xPU0VEO1xuICAgICAgICAgICAgICAgIGV2cy5kaXNwYXRjaEV2ZW50KCdlcnJvcicsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogXCJYRG9tYWluUmVxdWVzdCBlcnJvclwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldnMucmVhZHlTdGF0ZSA9IGV2cy5DTE9TRUQ7XG4gICAgICAgICAgICAgICAgZXZzLmRpc3BhdGNoRXZlbnQoJ2Vycm9yJywge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBcIlhEb21haW5SZXF1ZXN0IHRpbWVkIG91dFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBYRG9tYWluUmVxdWVzdCBkb2VzIG5vdCBhbGxvdyBzZXR0aW5nIGN1c3RvbSBoZWFkZXJzXG4gICAgICAgICAgICAvLyBJZiBFdmVudFNvdXJjZSBoYXMgZW5hYmxlZCB0aGUgdXNlIG9mIEdFVCBhcmd1bWVudHNcbiAgICAgICAgICAgIC8vIHdlIGFkZCBwYXJhbWV0ZXJzIHRvIFVSTCBzbyB0aGF0IHNlcnZlciBjYW4gYWRhcHQgdGhlIHN0cmVhbS4uLlxuICAgICAgICAgICAgdmFyIHJlcUdldEFyZ3MgPSB7fTtcbiAgICAgICAgICAgIGlmIChldnMuZ2V0QXJncykge1xuXG4gICAgICAgICAgICAgICAgLy8gY29weSBldnMuZ2V0QXJncyBpbiByZXFHZXRBcmdzXG4gICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRBcmdzID0gZXZzLmdldEFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0QXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRBcmdzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcUdldEFyZ3Nba2V5XSA9IGRlZmF1bHRBcmdzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXZzLmxhc3RFdmVudElkKXtcbiAgICAgICAgICAgICAgICAgICAgcmVxR2V0QXJnc1snZXZzX2xhc3RfZXZlbnRfaWQnXSA9IGV2cy5sYXN0RXZlbnRJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZW5kIHRoZSByZXF1ZXN0XG5cbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgZXZzLnVybFdpdGhQYXJhbXMoZXZzLlVSTCxyZXFHZXRBcmdzKSk7XG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBFdmVudFNvdXJjZS5wcm90b3R5cGUuWEhSLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAgICAgdXNlWERvbWFpblJlcXVlc3Q6IHRydWUsXG5cbiAgICAgICAgICAgIF9yZXF1ZXN0OiBudWxsLFxuXG4gICAgICAgICAgICBfcmVhZHk6IGZhbHNlLCAvLyB0cnVlIHdoZW4gcHJvZ3Jlc3MgZXZlbnRzIGFyZSBkaXNwYXRjaGVkXG5cbiAgICAgICAgICAgIF9sb2FkZWQ6IGZhbHNlLCAvLyB0cnVlIHdoZW4gcmVxdWVzdCBoYXMgYmVlbiBsb2FkZWRcblxuICAgICAgICAgICAgX2ZhaWxlZDogZmFsc2UsIC8vIHRydWUgaWYgd2hlbiByZXF1ZXN0IGlzIGluIGVycm9yXG5cbiAgICAgICAgICAgIGlzUmVhZHk6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QuX3JlYWR5O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNEb25lOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0Ll9sb2FkZWQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYXNFcnJvcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdC5fZmFpbGVkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0QnVmZmVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBydiA9ICcnO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gdGhpcy5fcmVxdWVzdC5yZXNwb25zZVRleHQgfHwgJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKXt9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLl9yZXF1ZXN0KXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBNZXNzYWdlRXZlbnQodHlwZSwgZGF0YSwgb3JpZ2luLCBsYXN0RXZlbnRJZCkge1xuXG4gICAgICAgIHRoaXMuYnViYmxlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YSB8fCBudWxsO1xuICAgICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbiB8fCAnJztcbiAgICAgICAgdGhpcy5sYXN0RXZlbnRJZCA9IGxhc3RFdmVudElkIHx8ICcnO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlIHx8ICdtZXNzYWdlJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09sZElFICgpIHtcblxuICAgICAgICAvL3JldHVybiB0cnVlIGlmIHdlIGFyZSBpbiBJRTggb3IgSUU5XG4gICAgICAgIHJldHVybiAod2luZG93LlhEb21haW5SZXF1ZXN0ICYmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QgJiYgbmV3IFhNTEh0dHBSZXF1ZXN0KCkucmVzcG9uc2VUeXBlID09PSB1bmRlZmluZWQpKSA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBnbG9iYWxbZXZzSW1wb3J0TmFtZV0gPSBFdmVudFNvdXJjZTtcbn0pKHRoaXMpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2V2ZW50c291cmNlLXBvbHlmaWxsL2Rpc3QvZXZlbnRzb3VyY2UuanNcbi8vIG1vZHVsZSBpZCA9IDg2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBYbWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIveG1sLWVudGl0aWVzLmpzJyksXG4gIEh0bWw0RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw0LWVudGl0aWVzLmpzJyksXG4gIEh0bWw1RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw1LWVudGl0aWVzLmpzJyksXG4gIEFsbEh0bWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIvaHRtbDUtZW50aXRpZXMuanMnKVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA4N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgSFRNTF9BTFBIQSA9IFsnYXBvcycsICduYnNwJywgJ2lleGNsJywgJ2NlbnQnLCAncG91bmQnLCAnY3VycmVuJywgJ3llbicsICdicnZiYXInLCAnc2VjdCcsICd1bWwnLCAnY29weScsICdvcmRmJywgJ2xhcXVvJywgJ25vdCcsICdzaHknLCAncmVnJywgJ21hY3InLCAnZGVnJywgJ3BsdXNtbicsICdzdXAyJywgJ3N1cDMnLCAnYWN1dGUnLCAnbWljcm8nLCAncGFyYScsICdtaWRkb3QnLCAnY2VkaWwnLCAnc3VwMScsICdvcmRtJywgJ3JhcXVvJywgJ2ZyYWMxNCcsICdmcmFjMTInLCAnZnJhYzM0JywgJ2lxdWVzdCcsICdBZ3JhdmUnLCAnQWFjdXRlJywgJ0FjaXJjJywgJ0F0aWxkZScsICdBdW1sJywgJ0FyaW5nJywgJ0FlbGlnJywgJ0NjZWRpbCcsICdFZ3JhdmUnLCAnRWFjdXRlJywgJ0VjaXJjJywgJ0V1bWwnLCAnSWdyYXZlJywgJ0lhY3V0ZScsICdJY2lyYycsICdJdW1sJywgJ0VUSCcsICdOdGlsZGUnLCAnT2dyYXZlJywgJ09hY3V0ZScsICdPY2lyYycsICdPdGlsZGUnLCAnT3VtbCcsICd0aW1lcycsICdPc2xhc2gnLCAnVWdyYXZlJywgJ1VhY3V0ZScsICdVY2lyYycsICdVdW1sJywgJ1lhY3V0ZScsICdUSE9STicsICdzemxpZycsICdhZ3JhdmUnLCAnYWFjdXRlJywgJ2FjaXJjJywgJ2F0aWxkZScsICdhdW1sJywgJ2FyaW5nJywgJ2FlbGlnJywgJ2NjZWRpbCcsICdlZ3JhdmUnLCAnZWFjdXRlJywgJ2VjaXJjJywgJ2V1bWwnLCAnaWdyYXZlJywgJ2lhY3V0ZScsICdpY2lyYycsICdpdW1sJywgJ2V0aCcsICdudGlsZGUnLCAnb2dyYXZlJywgJ29hY3V0ZScsICdvY2lyYycsICdvdGlsZGUnLCAnb3VtbCcsICdkaXZpZGUnLCAnb3NsYXNoJywgJ3VncmF2ZScsICd1YWN1dGUnLCAndWNpcmMnLCAndXVtbCcsICd5YWN1dGUnLCAndGhvcm4nLCAneXVtbCcsICdxdW90JywgJ2FtcCcsICdsdCcsICdndCcsICdPRWxpZycsICdvZWxpZycsICdTY2Fyb24nLCAnc2Nhcm9uJywgJ1l1bWwnLCAnY2lyYycsICd0aWxkZScsICdlbnNwJywgJ2Vtc3AnLCAndGhpbnNwJywgJ3p3bmonLCAnendqJywgJ2xybScsICdybG0nLCAnbmRhc2gnLCAnbWRhc2gnLCAnbHNxdW8nLCAncnNxdW8nLCAnc2JxdW8nLCAnbGRxdW8nLCAncmRxdW8nLCAnYmRxdW8nLCAnZGFnZ2VyJywgJ0RhZ2dlcicsICdwZXJtaWwnLCAnbHNhcXVvJywgJ3JzYXF1bycsICdldXJvJywgJ2Zub2YnLCAnQWxwaGEnLCAnQmV0YScsICdHYW1tYScsICdEZWx0YScsICdFcHNpbG9uJywgJ1pldGEnLCAnRXRhJywgJ1RoZXRhJywgJ0lvdGEnLCAnS2FwcGEnLCAnTGFtYmRhJywgJ011JywgJ051JywgJ1hpJywgJ09taWNyb24nLCAnUGknLCAnUmhvJywgJ1NpZ21hJywgJ1RhdScsICdVcHNpbG9uJywgJ1BoaScsICdDaGknLCAnUHNpJywgJ09tZWdhJywgJ2FscGhhJywgJ2JldGEnLCAnZ2FtbWEnLCAnZGVsdGEnLCAnZXBzaWxvbicsICd6ZXRhJywgJ2V0YScsICd0aGV0YScsICdpb3RhJywgJ2thcHBhJywgJ2xhbWJkYScsICdtdScsICdudScsICd4aScsICdvbWljcm9uJywgJ3BpJywgJ3JobycsICdzaWdtYWYnLCAnc2lnbWEnLCAndGF1JywgJ3Vwc2lsb24nLCAncGhpJywgJ2NoaScsICdwc2knLCAnb21lZ2EnLCAndGhldGFzeW0nLCAndXBzaWgnLCAncGl2JywgJ2J1bGwnLCAnaGVsbGlwJywgJ3ByaW1lJywgJ1ByaW1lJywgJ29saW5lJywgJ2ZyYXNsJywgJ3dlaWVycCcsICdpbWFnZScsICdyZWFsJywgJ3RyYWRlJywgJ2FsZWZzeW0nLCAnbGFycicsICd1YXJyJywgJ3JhcnInLCAnZGFycicsICdoYXJyJywgJ2NyYXJyJywgJ2xBcnInLCAndUFycicsICdyQXJyJywgJ2RBcnInLCAnaEFycicsICdmb3JhbGwnLCAncGFydCcsICdleGlzdCcsICdlbXB0eScsICduYWJsYScsICdpc2luJywgJ25vdGluJywgJ25pJywgJ3Byb2QnLCAnc3VtJywgJ21pbnVzJywgJ2xvd2FzdCcsICdyYWRpYycsICdwcm9wJywgJ2luZmluJywgJ2FuZycsICdhbmQnLCAnb3InLCAnY2FwJywgJ2N1cCcsICdpbnQnLCAndGhlcmU0JywgJ3NpbScsICdjb25nJywgJ2FzeW1wJywgJ25lJywgJ2VxdWl2JywgJ2xlJywgJ2dlJywgJ3N1YicsICdzdXAnLCAnbnN1YicsICdzdWJlJywgJ3N1cGUnLCAnb3BsdXMnLCAnb3RpbWVzJywgJ3BlcnAnLCAnc2RvdCcsICdsY2VpbCcsICdyY2VpbCcsICdsZmxvb3InLCAncmZsb29yJywgJ2xhbmcnLCAncmFuZycsICdsb3onLCAnc3BhZGVzJywgJ2NsdWJzJywgJ2hlYXJ0cycsICdkaWFtcyddO1xudmFyIEhUTUxfQ09ERVMgPSBbMzksIDE2MCwgMTYxLCAxNjIsIDE2MywgMTY0LCAxNjUsIDE2NiwgMTY3LCAxNjgsIDE2OSwgMTcwLCAxNzEsIDE3MiwgMTczLCAxNzQsIDE3NSwgMTc2LCAxNzcsIDE3OCwgMTc5LCAxODAsIDE4MSwgMTgyLCAxODMsIDE4NCwgMTg1LCAxODYsIDE4NywgMTg4LCAxODksIDE5MCwgMTkxLCAxOTIsIDE5MywgMTk0LCAxOTUsIDE5NiwgMTk3LCAxOTgsIDE5OSwgMjAwLCAyMDEsIDIwMiwgMjAzLCAyMDQsIDIwNSwgMjA2LCAyMDcsIDIwOCwgMjA5LCAyMTAsIDIxMSwgMjEyLCAyMTMsIDIxNCwgMjE1LCAyMTYsIDIxNywgMjE4LCAyMTksIDIyMCwgMjIxLCAyMjIsIDIyMywgMjI0LCAyMjUsIDIyNiwgMjI3LCAyMjgsIDIyOSwgMjMwLCAyMzEsIDIzMiwgMjMzLCAyMzQsIDIzNSwgMjM2LCAyMzcsIDIzOCwgMjM5LCAyNDAsIDI0MSwgMjQyLCAyNDMsIDI0NCwgMjQ1LCAyNDYsIDI0NywgMjQ4LCAyNDksIDI1MCwgMjUxLCAyNTIsIDI1MywgMjU0LCAyNTUsIDM0LCAzOCwgNjAsIDYyLCAzMzgsIDMzOSwgMzUyLCAzNTMsIDM3NiwgNzEwLCA3MzIsIDgxOTQsIDgxOTUsIDgyMDEsIDgyMDQsIDgyMDUsIDgyMDYsIDgyMDcsIDgyMTEsIDgyMTIsIDgyMTYsIDgyMTcsIDgyMTgsIDgyMjAsIDgyMjEsIDgyMjIsIDgyMjQsIDgyMjUsIDgyNDAsIDgyNDksIDgyNTAsIDgzNjQsIDQwMiwgOTEzLCA5MTQsIDkxNSwgOTE2LCA5MTcsIDkxOCwgOTE5LCA5MjAsIDkyMSwgOTIyLCA5MjMsIDkyNCwgOTI1LCA5MjYsIDkyNywgOTI4LCA5MjksIDkzMSwgOTMyLCA5MzMsIDkzNCwgOTM1LCA5MzYsIDkzNywgOTQ1LCA5NDYsIDk0NywgOTQ4LCA5NDksIDk1MCwgOTUxLCA5NTIsIDk1MywgOTU0LCA5NTUsIDk1NiwgOTU3LCA5NTgsIDk1OSwgOTYwLCA5NjEsIDk2MiwgOTYzLCA5NjQsIDk2NSwgOTY2LCA5NjcsIDk2OCwgOTY5LCA5NzcsIDk3OCwgOTgyLCA4MjI2LCA4MjMwLCA4MjQyLCA4MjQzLCA4MjU0LCA4MjYwLCA4NDcyLCA4NDY1LCA4NDc2LCA4NDgyLCA4NTAxLCA4NTkyLCA4NTkzLCA4NTk0LCA4NTk1LCA4NTk2LCA4NjI5LCA4NjU2LCA4NjU3LCA4NjU4LCA4NjU5LCA4NjYwLCA4NzA0LCA4NzA2LCA4NzA3LCA4NzA5LCA4NzExLCA4NzEyLCA4NzEzLCA4NzE1LCA4NzE5LCA4NzIxLCA4NzIyLCA4NzI3LCA4NzMwLCA4NzMzLCA4NzM0LCA4NzM2LCA4NzQzLCA4NzQ0LCA4NzQ1LCA4NzQ2LCA4NzQ3LCA4NzU2LCA4NzY0LCA4NzczLCA4Nzc2LCA4ODAwLCA4ODAxLCA4ODA0LCA4ODA1LCA4ODM0LCA4ODM1LCA4ODM2LCA4ODM4LCA4ODM5LCA4ODUzLCA4ODU1LCA4ODY5LCA4OTAxLCA4OTY4LCA4OTY5LCA4OTcwLCA4OTcxLCA5MDAxLCA5MDAyLCA5Njc0LCA5ODI0LCA5ODI3LCA5ODI5LCA5ODMwXTtcblxudmFyIGFscGhhSW5kZXggPSB7fTtcbnZhciBudW1JbmRleCA9IHt9O1xuXG52YXIgaSA9IDA7XG52YXIgbGVuZ3RoID0gSFRNTF9BTFBIQS5sZW5ndGg7XG53aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgIHZhciBhID0gSFRNTF9BTFBIQVtpXTtcbiAgICB2YXIgYyA9IEhUTUxfQ09ERVNbaV07XG4gICAgYWxwaGFJbmRleFthXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG4gICAgbnVtSW5kZXhbY10gPSBhO1xuICAgIGkrKztcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSHRtbDRFbnRpdGllcygpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyYoIz9bXFx3XFxkXSspOz8vZywgZnVuY3Rpb24ocywgZW50aXR5KSB7XG4gICAgICAgIHZhciBjaHI7XG4gICAgICAgIGlmIChlbnRpdHkuY2hhckF0KDApID09PSBcIiNcIikge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSBlbnRpdHkuY2hhckF0KDEpLnRvTG93ZXJDYXNlKCkgPT09ICd4JyA/XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoZW50aXR5LnN1YnN0cigyKSwgMTYpIDpcbiAgICAgICAgICAgICAgICBwYXJzZUludChlbnRpdHkuc3Vic3RyKDEpKTtcblxuICAgICAgICAgICAgaWYgKCEoaXNOYU4oY29kZSkgfHwgY29kZSA8IC0zMjc2OCB8fCBjb2RlID4gNjU1MzUpKSB7XG4gICAgICAgICAgICAgICAgY2hyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNociA9IGFscGhhSW5kZXhbZW50aXR5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hyIHx8IHM7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw0RW50aXRpZXMuZGVjb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBIdG1sNEVudGl0aWVzKCkuZGVjb2RlKHN0cik7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbkh0bWw0RW50aXRpZXMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHN0ckxlbmd0aCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHN0ckxlbmd0aCkge1xuICAgICAgICB2YXIgYWxwaGEgPSBudW1JbmRleFtzdHIuY2hhckNvZGVBdChpKV07XG4gICAgICAgIHJlc3VsdCArPSBhbHBoYSA/IFwiJlwiICsgYWxwaGEgKyBcIjtcIiA6IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw0RW50aXRpZXMoKS5lbmNvZGUoc3RyKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uVVRGID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3RyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgYWxwaGEgPSBudW1JbmRleFtjY107XG4gICAgICAgIGlmIChhbHBoYSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFwiJlwiICsgYWxwaGEgKyBcIjtcIjtcbiAgICAgICAgfSBlbHNlIGlmIChjYyA8IDMyIHx8IGNjID4gMTI2KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCImI1wiICsgY2MgKyBcIjtcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzdHIuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IEh0bWw0RW50aXRpZXMoKS5lbmNvZGVOb25VVEYoc3RyKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPD0gMjU1KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyW2krK107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSHRtbDRFbnRpdGllcy5lbmNvZGVOb25BU0NJSSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgSHRtbDRFbnRpdGllcygpLmVuY29kZU5vbkFTQ0lJKHN0cik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWw0RW50aXRpZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaHRtbC1lbnRpdGllcy9saWIvaHRtbDQtZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDg4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBBTFBIQV9JTkRFWCA9IHtcbiAgICAnJmx0JzogJzwnLFxuICAgICcmZ3QnOiAnPicsXG4gICAgJyZxdW90JzogJ1wiJyxcbiAgICAnJmFwb3MnOiAnXFwnJyxcbiAgICAnJmFtcCc6ICcmJyxcbiAgICAnJmx0Oyc6ICc8JyxcbiAgICAnJmd0Oyc6ICc+JyxcbiAgICAnJnF1b3Q7JzogJ1wiJyxcbiAgICAnJmFwb3M7JzogJ1xcJycsXG4gICAgJyZhbXA7JzogJyYnXG59O1xuXG52YXIgQ0hBUl9JTkRFWCA9IHtcbiAgICA2MDogJ2x0JyxcbiAgICA2MjogJ2d0JyxcbiAgICAzNDogJ3F1b3QnLFxuICAgIDM5OiAnYXBvcycsXG4gICAgMzg6ICdhbXAnXG59O1xuXG52YXIgQ0hBUl9TX0lOREVYID0ge1xuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgICdcXCcnOiAnJmFwb3M7JyxcbiAgICAnJic6ICcmYW1wOydcbn07XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFhtbEVudGl0aWVzKCkge31cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5YbWxFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKCFzdHIgfHwgIXN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLzx8PnxcInwnfCYvZywgZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gQ0hBUl9TX0lOREVYW3NdO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG4gWG1sRW50aXRpZXMuZW5jb2RlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBYbWxFbnRpdGllcygpLmVuY29kZShzdHIpO1xuIH07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuWG1sRW50aXRpZXMucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmICghc3RyIHx8ICFzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIz9bMC05YS16QS1aXSs7Py9nLCBmdW5jdGlvbihzKSB7XG4gICAgICAgIGlmIChzLmNoYXJBdCgxKSA9PT0gJyMnKSB7XG4gICAgICAgICAgICB2YXIgY29kZSA9IHMuY2hhckF0KDIpLnRvTG93ZXJDYXNlKCkgPT09ICd4JyA/XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQocy5zdWJzdHIoMyksIDE2KSA6XG4gICAgICAgICAgICAgICAgcGFyc2VJbnQocy5zdWJzdHIoMikpO1xuXG4gICAgICAgICAgICBpZiAoaXNOYU4oY29kZSkgfHwgY29kZSA8IC0zMjc2OCB8fCBjb2RlID4gNjU1MzUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQUxQSEFfSU5ERVhbc10gfHwgcztcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIFhtbEVudGl0aWVzLmRlY29kZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgWG1sRW50aXRpZXMoKS5kZWNvZGUoc3RyKTtcbiB9O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblhtbEVudGl0aWVzLnByb3RvdHlwZS5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzdHJMZW5ndGggPSBzdHIubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgdmFyIGFscGhhID0gQ0hBUl9JTkRFWFtjXTtcbiAgICAgICAgaWYgKGFscGhhKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCImXCIgKyBhbHBoYSArIFwiO1wiO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMgPCAzMiB8fCBjID4gMTI2KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbiBYbWxFbnRpdGllcy5lbmNvZGVOb25VVEYgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gbmV3IFhtbEVudGl0aWVzKCkuZW5jb2RlTm9uVVRGKHN0cik7XG4gfTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5YbWxFbnRpdGllcy5wcm90b3R5cGUuZW5jb2RlTm9uQVNDSUkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoIXN0ciB8fCAhc3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciBzdHJMZW5naHQgPSBzdHIubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzdHJMZW5naHQpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPD0gMjU1KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gc3RyW2krK107XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gJyYjJyArIGMgKyAnOyc7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuIFhtbEVudGl0aWVzLmVuY29kZU5vbkFTQ0lJID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBYbWxFbnRpdGllcygpLmVuY29kZU5vbkFTQ0lJKHN0cik7XG4gfTtcblxubW9kdWxlLmV4cG9ydHMgPSBYbWxFbnRpdGllcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9odG1sLWVudGl0aWVzL2xpYi94bWwtZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDg5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qc1xuLy8gbW9kdWxlIGlkID0gOTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qc1xuLy8gbW9kdWxlIGlkID0gOTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8vIFVzZSBgZ2V0T3duUHJvcGVydHlOYW1lc2AgYmVjYXVzZSBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgY2FsbGluZ1xuLy8gYGhhc093blByb3BlcnR5YCBvbiB0aGUgZ2xvYmFsIGBzZWxmYCBvYmplY3QgaW4gYSB3b3JrZXIuIFNlZSAjMTgzLlxudmFyIGhhZFJ1bnRpbWUgPSBnLnJlZ2VuZXJhdG9yUnVudGltZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnKS5pbmRleE9mKFwicmVnZW5lcmF0b3JSdW50aW1lXCIpID49IDA7XG5cbi8vIFNhdmUgdGhlIG9sZCByZWdlbmVyYXRvclJ1bnRpbWUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZXN0b3JlZCBsYXRlci5cbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcblxuLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcblxuaWYgKGhhZFJ1bnRpbWUpIHtcbiAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcnVudGltZS5cbiAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBvbGRSdW50aW1lO1xufSBlbHNlIHtcbiAgLy8gUmVtb3ZlIHRoZSBnbG9iYWwgcHJvcGVydHkgYWRkZWQgYnkgcnVudGltZS5qcy5cbiAgdHJ5IHtcbiAgICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIH0gY2F0Y2goZSkge1xuICAgIGcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLW1vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gOTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG4gIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cbiAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cbiAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanNcbi8vIG1vZHVsZSBpZCA9IDk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcbnZhciBhbnNpUmVnZXggPSByZXF1aXJlKCdhbnNpLXJlZ2V4JykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdHJldHVybiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyA/IHN0ci5yZXBsYWNlKGFuc2lSZWdleCwgJycpIDogc3RyO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHJpcC1hbnNpL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qc1xuLy8gbW9kdWxlIGlkID0gOTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYW50ZC9saWIvYnV0dG9uL3N0eWxlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDk3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FudGQvbGliL2lucHV0L3N0eWxlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDk4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbGVzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbmRleC5sZXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FudGQvbGliL2xheW91dC9zdHlsZS9pbmRleC5sZXNzXG4vLyBtb2R1bGUgaWQgPSA5OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXgubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4Lmxlc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbnRkL2xpYi9tZXNzYWdlL3N0eWxlL2luZGV4Lmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDEwMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaGVhZGVyLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaGVhZGVyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2hlYWRlci5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9Ib21lL2hlYWRlci5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxMDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3Rlc3QxLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGVzdDEuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGVzdDEuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy90ZXN0MS5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxMDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3Rlc3QyLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGVzdDIuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGVzdDIuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy90ZXN0Mi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxMDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3ZvaWNlQnRuLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdm9pY2VCdG4uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdm9pY2VCdG4uc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy92b2ljZUJ0bi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxMDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP21vZHVsZXMmbG9jYWxJZGVudE5hbWU9W3BhdGhdW25hbWVdLS0tW2xvY2FsXS0tLVtoYXNoOmJhc2U2NDo1XSEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2luZGV4LnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaW5kZXguc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/bW9kdWxlcyZsb2NhbElkZW50TmFtZT1bcGF0aF1bbmFtZV0tLS1bbG9jYWxdLS0tW2hhc2g6YmFzZTY0OjVdIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaW5kZXguc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguc2Nzc1xuLy8gbW9kdWxlIGlkID0gMTA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qZXNsaW50LWVudiBicm93c2VyKi9cblxudmFyIGNsaWVudE92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmNsaWVudE92ZXJsYXkuaWQgPSAnd2VicGFjay1ob3QtbWlkZGxld2FyZS1jbGllbnRPdmVybGF5JztcbnZhciBzdHlsZXMgPSB7XG4gIGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLDAuODUpJyxcbiAgY29sb3I6ICcjRThFOEU4JyxcbiAgbGluZUhlaWdodDogJzEuMicsXG4gIHdoaXRlU3BhY2U6ICdwcmUnLFxuICBmb250RmFtaWx5OiAnTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UnLFxuICBmb250U2l6ZTogJzEzcHgnLFxuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiA5OTk5LFxuICBwYWRkaW5nOiAnMTBweCcsXG4gIGxlZnQ6IDAsXG4gIHJpZ2h0OiAwLFxuICB0b3A6IDAsXG4gIGJvdHRvbTogMCxcbiAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgZGlyOiAnbHRyJyxcbiAgdGV4dEFsaWduOiAnbGVmdCdcbn07XG5mb3IgKHZhciBrZXkgaW4gc3R5bGVzKSB7XG4gIGNsaWVudE92ZXJsYXkuc3R5bGVba2V5XSA9IHN0eWxlc1trZXldO1xufVxuXG52YXIgYW5zaUhUTUwgPSByZXF1aXJlKCdhbnNpLWh0bWwnKTtcbnZhciBjb2xvcnMgPSB7XG4gIHJlc2V0OiBbJ3RyYW5zcGFyZW50JywgJ3RyYW5zcGFyZW50J10sXG4gIGJsYWNrOiAnMTgxODE4JyxcbiAgcmVkOiAnRTM2MDQ5JyxcbiAgZ3JlZW46ICdCM0NCNzQnLFxuICB5ZWxsb3c6ICdGRkQwODAnLFxuICBibHVlOiAnN0NBRkMyJyxcbiAgbWFnZW50YTogJzdGQUNDQScsXG4gIGN5YW46ICdDM0MyRUYnLFxuICBsaWdodGdyZXk6ICdFQkU3RTMnLFxuICBkYXJrZ3JleTogJzZENzg5MSdcbn07XG5hbnNpSFRNTC5zZXRDb2xvcnMoY29sb3JzKTtcblxudmFyIEVudGl0aWVzID0gcmVxdWlyZSgnaHRtbC1lbnRpdGllcycpLkFsbEh0bWxFbnRpdGllcztcbnZhciBlbnRpdGllcyA9IG5ldyBFbnRpdGllcygpO1xuXG5leHBvcnRzLnNob3dQcm9ibGVtcyA9XG5mdW5jdGlvbiBzaG93UHJvYmxlbXModHlwZSwgbGluZXMpIHtcbiAgY2xpZW50T3ZlcmxheS5pbm5lckhUTUwgPSAnJztcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihtc2cpIHtcbiAgICBtc2cgPSBhbnNpSFRNTChlbnRpdGllcy5lbmNvZGUobXNnKSk7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMjZweCc7XG4gICAgZGl2LmlubmVySFRNTCA9IHByb2JsZW1UeXBlKHR5cGUpICsgJyBpbiAnICsgbXNnO1xuICAgIGNsaWVudE92ZXJsYXkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfSk7XG4gIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjbGllbnRPdmVybGF5KTtcbiAgfVxufTtcblxuZXhwb3J0cy5jbGVhciA9XG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgaWYgKGRvY3VtZW50LmJvZHkgJiYgY2xpZW50T3ZlcmxheS5wYXJlbnROb2RlKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChjbGllbnRPdmVybGF5KTtcbiAgfVxufTtcblxudmFyIHByb2JsZW1Db2xvcnMgPSB7XG4gIGVycm9yczogY29sb3JzLnJlZCxcbiAgd2FybmluZ3M6IGNvbG9ycy55ZWxsb3dcbn07XG5cbmZ1bmN0aW9uIHByb2JsZW1UeXBlICh0eXBlKSB7XG4gIHZhciBjb2xvciA9IHByb2JsZW1Db2xvcnNbdHlwZV0gfHwgY29sb3JzLnJlZDtcbiAgcmV0dXJuIChcbiAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiMnICsgY29sb3IgKyAnOyBjb2xvcjojZmZmOyBwYWRkaW5nOjJweCA0cHg7IGJvcmRlci1yYWRpdXM6IDJweFwiPicgK1xuICAgICAgdHlwZS5zbGljZSgwLCAtMSkudG9VcHBlckNhc2UoKSArXG4gICAgJzwvc3Bhbj4nXG4gICk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjayktaG90LW1pZGRsZXdhcmUvY2xpZW50LW92ZXJsYXkuanNcbi8vIG1vZHVsZSBpZCA9IDEwNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIEJhc2VkIGhlYXZpbHkgb24gaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2svd2VicGFjay9ibG9iL1xuICogIGMwYWZkZjljNmFiYzFkZDcwNzA3YzU5NGU0NzM4MDJhNTY2ZjdiNmUvaG90L29ubHktZGV2LXNlcnZlci5qc1xuICogT3JpZ2luYWwgY29weXJpZ2h0IFRvYmlhcyBLb3BwZXJzIEBzb2tyYSAoTUlUIGxpY2Vuc2UpXG4gKi9cblxuLyogZ2xvYmFsIHdpbmRvdyBfX3dlYnBhY2tfaGFzaF9fICovXG5cbmlmICghbW9kdWxlLmhvdCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cblxudmFyIGhtckRvY3NVcmwgPSBcImh0dHA6Ly93ZWJwYWNrLmdpdGh1Yi5pby9kb2NzL2hvdC1tb2R1bGUtcmVwbGFjZW1lbnQtd2l0aC13ZWJwYWNrLmh0bWxcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG5cbnZhciBsYXN0SGFzaDtcbnZhciBmYWlsdXJlU3RhdHVzZXMgPSB7IGFib3J0OiAxLCBmYWlsOiAxIH07XG52YXIgYXBwbHlPcHRpb25zID0geyBpZ25vcmVVbmFjY2VwdGVkOiB0cnVlIH07XG5cbmZ1bmN0aW9uIHVwVG9EYXRlKGhhc2gpIHtcbiAgaWYgKGhhc2gpIGxhc3RIYXNoID0gaGFzaDtcbiAgcmV0dXJuIGxhc3RIYXNoID09IF9fd2VicGFja19oYXNoX187XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGFzaCwgbW9kdWxlTWFwLCBvcHRpb25zKSB7XG4gIHZhciByZWxvYWQgPSBvcHRpb25zLnJlbG9hZDtcbiAgaWYgKCF1cFRvRGF0ZShoYXNoKSAmJiBtb2R1bGUuaG90LnN0YXR1cygpID09IFwiaWRsZVwiKSB7XG4gICAgaWYgKG9wdGlvbnMubG9nKSBjb25zb2xlLmxvZyhcIltITVJdIENoZWNraW5nIGZvciB1cGRhdGVzIG9uIHRoZSBzZXJ2ZXIuLi5cIik7XG4gICAgY2hlY2soKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrKCkge1xuICAgIHZhciBjYiA9IGZ1bmN0aW9uKGVyciwgdXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBoYW5kbGVFcnJvcihlcnIpO1xuXG4gICAgICBpZighdXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIENhbm5vdCBmaW5kIHVwZGF0ZSAoRnVsbCByZWxvYWQgbmVlZGVkKVwiKTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSAoUHJvYmFibHkgYmVjYXVzZSBvZiByZXN0YXJ0aW5nIHRoZSBzZXJ2ZXIpXCIpO1xuICAgICAgICB9XG4gICAgICAgIHBlcmZvcm1SZWxvYWQoKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBhcHBseUNhbGxiYWNrID0gZnVuY3Rpb24oYXBwbHlFcnIsIHJlbmV3ZWRNb2R1bGVzKSB7XG4gICAgICAgIGlmIChhcHBseUVycikgcmV0dXJuIGhhbmRsZUVycm9yKGFwcGx5RXJyKTtcblxuICAgICAgICBpZiAoIXVwVG9EYXRlKCkpIGNoZWNrKCk7XG5cbiAgICAgICAgbG9nVXBkYXRlcyh1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGFwcGx5UmVzdWx0ID0gbW9kdWxlLmhvdC5hcHBseShhcHBseU9wdGlvbnMsIGFwcGx5Q2FsbGJhY2spO1xuICAgICAgLy8gd2VicGFjayAyIHByb21pc2VcbiAgICAgIGlmIChhcHBseVJlc3VsdCAmJiBhcHBseVJlc3VsdC50aGVuKSB7XG4gICAgICAgIC8vIEhvdE1vZHVsZVJlcGxhY2VtZW50LnJ1bnRpbWUuanMgcmVmZXJzIHRvIHRoZSByZXN1bHQgYXMgYG91dGRhdGVkTW9kdWxlc2BcbiAgICAgICAgYXBwbHlSZXN1bHQudGhlbihmdW5jdGlvbihvdXRkYXRlZE1vZHVsZXMpIHtcbiAgICAgICAgICBhcHBseUNhbGxiYWNrKG51bGwsIG91dGRhdGVkTW9kdWxlcyk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHBseVJlc3VsdC5jYXRjaChhcHBseUNhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICB2YXIgcmVzdWx0ID0gbW9kdWxlLmhvdC5jaGVjayhmYWxzZSwgY2IpO1xuICAgIC8vIHdlYnBhY2sgMiBwcm9taXNlXG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xuICAgICAgICByZXN1bHQudGhlbihmdW5jdGlvbih1cGRhdGVkTW9kdWxlcykge1xuICAgICAgICAgICAgY2IobnVsbCwgdXBkYXRlZE1vZHVsZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzdWx0LmNhdGNoKGNiKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsb2dVcGRhdGVzKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuICAgIHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xuICAgICAgcmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcbiAgICB9KTtcblxuICAgIGlmKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiBcIiArXG4gICAgICAgICAgXCIoRnVsbCByZWxvYWQgbmVlZGVkKVxcblwiICtcbiAgICAgICAgICBcIlRoaXMgaXMgdXN1YWxseSBiZWNhdXNlIHRoZSBtb2R1bGVzIHdoaWNoIGhhdmUgY2hhbmdlZCBcIiArXG4gICAgICAgICAgXCIoYW5kIHRoZWlyIHBhcmVudHMpIGRvIG5vdCBrbm93IGhvdyB0byBob3QgcmVsb2FkIHRoZW1zZWx2ZXMuIFwiICtcbiAgICAgICAgICBcIlNlZSBcIiArIGhtckRvY3NVcmwgKyBcIiBmb3IgbW9yZSBkZXRhaWxzLlwiXG4gICAgICAgICk7XG4gICAgICAgIHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSAgLSBcIiArIG1vZHVsZU1hcFttb2R1bGVJZF0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHBlcmZvcm1SZWxvYWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5sb2cpIHtcbiAgICAgIGlmKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcbiAgICAgICAgcmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVNYXBbbW9kdWxlSWRdKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1cFRvRGF0ZSgpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0hNUl0gQXBwIGlzIHVwIHRvIGRhdGUuXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycikge1xuICAgIGlmIChtb2R1bGUuaG90LnN0YXR1cygpIGluIGZhaWx1cmVTdGF0dXNlcykge1xuICAgICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSBDYW5ub3QgY2hlY2sgZm9yIHVwZGF0ZSAoRnVsbCByZWxvYWQgbmVlZGVkKVwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiW0hNUl0gXCIgKyBlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgcGVyZm9ybVJlbG9hZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSBVcGRhdGUgY2hlY2sgZmFpbGVkOiBcIiArIGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGVyZm9ybVJlbG9hZCgpIHtcbiAgICBpZiAocmVsb2FkKSB7XG4gICAgICBpZiAob3B0aW9ucy53YXJuKSBjb25zb2xlLndhcm4oXCJbSE1SXSBSZWxvYWRpbmcgcGFnZVwiKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjayktaG90LW1pZGRsZXdhcmUvcHJvY2Vzcy11cGRhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgxMSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMTUwKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMTkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9hbnRkL2xpYi9pY29uL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDExMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgyKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMjA0KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMTEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDIwOCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMjE1KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMjg4KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvbW9tZW50L2xvY2FsZS96aC1jbi5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMzI2KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL21vZHVsZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoMzU5KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMTE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDM2MCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDExOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgzNjkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDExOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSgzNzApO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMTIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDYyKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNzM0KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVkdXgtbG9nZ2VyL2Rpc3QvcmVkdXgtbG9nZ2VyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDEyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg3MzUpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWR1eC1zYWdhL2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDEyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg3NCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoODc0KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMTI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDg3NSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDEyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg4NzcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDEyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg4NzkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMgZnJvbSBkbGwtcmVmZXJlbmNlIGxpYlxuLy8gbW9kdWxlIGlkID0gMTI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDg5OCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIGZyb20gZGxsLXJlZmVyZW5jZSBsaWJcbi8vIG1vZHVsZSBpZCA9IDEyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg5MSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2FudGQvbGliL2J1dHRvbi9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoOTQpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgbGliXG4vLyBtb2R1bGUgaWQgPSAxMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==