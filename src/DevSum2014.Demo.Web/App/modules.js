﻿

angular.module('xsockets.helpers', []).service('visibility', ['$rootScope', function ($rootScope) {
    var getProp = function () {
        var prefixes = ['webkit', 'moz', 'ms', 'o'];
        if ('hidden' in document) return 'hidden';
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
                return prefixes[i] + 'Hidden';
        }
        return null;
    };
    var visProp = getProp();
    if (visProp) {
        var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
        document.addEventListener(evtname, visibilitychanged);
    }
    function visibilitychanged(evt) {

        $rootScope.$broadcast('visibilityChanged', document.hidden);
    }


}]).provider("scheduler", function() {
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    this.$get = [
        "$q", function () {

            function getInstance() {
                var self = this;
                this.todos = {};
                this.elapsedMs = 0;
                this.id = undefined;
                this.start = function () {
                    this.id = requestAnimFrame(animloop);
                };
                this.addToDo = function(name, task, when) {
                    this.todos[name] = {
                        task: task,
                        when: when + this.elapsedMs
                };
                };

               this.stop = function() {
                   cancelAnimationFrame(this.id);
               }
               function animloop(a) {

                   self.elapsedMs = a;
                   // What to do?

                   Object.keys(self.todos).forEach(function (key) {
                       if (self.todos[key].when <= a) {
                           self.todos[key].task(a);
                           delete self.todos[key];
                       }
                   });

                   self.id = requestAnimFrame(animloop);
                   
                 
                };
                return this;
            }
          
          
            return {
                getInstance: getInstance
        }
        }
    ];

});




// You canfind the XSockets.anguarjs javascript API ( Provider ) in this repo :
// https://github.com/MagnusThor/XSockets.AngularJS.Animal.Example/tree/master/src/app/js


angular.module('xsockets.angular', []).provider('xsockets', function () {

    
    var self = this;
    this.$get = ['$q', '$rootScope',
        function ($q, $rootScope) {
            var isConnected, subscriptions = {}, socket, queued = [];
            var subscription = (function () {
                function _subscription(fn) {
                    this._a = fn;
                }
                _subscription.prototype.delegate = function (fn) {
                    this._a = fn;
                    return this;
                };
                _subscription.prototype.invoke = function (a) {
                    this._a(a);
                    return this;
                };
                return _subscription;
            })();

            function bind(topic, fn, cb) {
                socket.subscribe(topic, function (a) {
                    $rootScope.$apply(function () {
                        subscriptions[topic].invoke(a);
                    }, cb);
                }, cb);
            }

            function bindOne(topic, fn, cb) {
                socket.one(topic, function (a) {
                    $rootScope.$apply(function () {
                        subscriptions[topic].invoke(a);
                    }, cb);

                    $rootScope.$broadcast(topic, a);

                }, cb);
            }

            function bindMany(topic, count, fn, cb) {
                socket.many(topic, count, function (a) {
                    $rootScope.$apply(function () {
                        subscriptions[topic].invoke(a);
                    }, cb);
                }, cb);
            }

            function unbind(topic, fn) {
                if (subscriptions.hasOwnProperty(topic)) {
                    socket.unsubscribe(topic);
                    delete subscriptions[topic];
                    if (fn) fn(topic);
                } else {
                    throw "Missing '" + topic + "'.unable to remove binding";
                }
            }

            function publish(topic, data, fn) {
                if (isConnected) {
                    socket.publish(topic, data);
                } else {
                    queued.push({
                        t: topic,
                        d: data || {}
                    });
                }
                if (fn) fn(data, isConnected);
            }

            function one(topic, cb) {
                if (!subscriptions.hasOwnProperty(topic)) {
                    subscriptions[topic] = new subscription();
                    bindOne(topic, subscriptions[topic], cb);
                    return subscriptions[topic];
                }
                return subscriptions[topic];
            }

            function many(topic, count, cb) {
                if (!subscriptions.hasOwnProperty(topic)) {
                    subscriptions[topic] = new subscription();
                    bindMany(topic, count, subscriptions[topic], cb);
                    return subscriptions[topic];
                }
                return subscriptions[topic];
            }

            function subscribe(topic, cb) {
                if (!subscriptions.hasOwnProperty(topic)) {
                    subscriptions[topic] = new subscription();
                    bind(topic, subscriptions[topic], cb);
                    return subscriptions[topic];
                }
                return subscriptions[topic];
            }
            var connect = function () {
                var deferred = $q.defer();

                socket = new XSockets.WebSocket(self.url);
                socket.on(XSockets.Events.open, function (conn) {
                    $rootScope.$apply(function () {
                        deferred.resolve(conn);
                    });
                });

                return deferred.promise;
            };

            var onclose = function () {
                var deferred = $q.defer();
                socket.on(XSockets.Events.close, function (reason) {
                    $rootScope.$apply(function () {
                        deferred.resolve(reason);
                    });
                });


                socket.on(XSockets.Events.close, function (reason) {
                    $rootScope.$apply(function () {
                        deferred.resolve(reason);
                    });
                });

                return deferred.promise;
            };

            var onerror = function () {
                var deferred = $q.defer();
                socket.on(XSockets.Events.onError, function (err) {
                    $rootScope.$apply(function () {
                        deferred.resolve(err);
                    });
                });
                return deferred.promise;
            };
            var clientType = function () {
                return socket.clientType();
            };

            var close = function () {
                socket.close();
            };

            var reconnect = function () {
                var a = $q.all(connect()).then(function (a) {
                    isConnected = true;
                    queued.forEach(function (msg) {
                        publish(msg.t, msg.d);
                    });
                    queued = [];
                    return a;
                });
            };


            var readyState = function () {
                return socket.readyState();
            };

            var onopen = $q.all(connect()).then(function (a) {
                isConnected = true;
                queued.forEach(function (msg) {
                    publish(msg.t, msg.d);
                });
                queued = [];
                return a;
            });
            return {
                clientType: clientType,
                one: one,
                many: many,
                subscribe: subscribe,
                unsubscribe: unbind,
                publish: publish,
                onopen: onopen,
                onerror: onerror(),
                onclose: onclose(),
                close: close,
                reconnect: reconnect,
                readyState: readyState
            };
        }
    ];
    this.url = 'ws://joinaspot.com:4509/Generic';
    this.setUrl = function (url) {
        this.url = url;
    };
  
});