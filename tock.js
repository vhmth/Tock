/* Tock: Timeout and interval javascript manager.
 *
 * Author: Vinay Hiremath
 *         vhiremath4@gmail.com
 *         www.vhmath.com
 *
 * Terms: There is no legitimate license associated with
 *        Tock and I don't intend there to be. All I ask
 *        is that you don't try to sell Tock to others
 *        on its own. If you're simply using it as a tool
 *        (even for a profitable website), that's cool with
 *        me. Other than that, feel free to do whatever you
 *        want with Tock. If you wish, you may also remove
 *        this header. Code on broski.
 */

(function (namespace) {
	'use strict';

	var
		VER = '0.1',
		Tock,
		jeeves,
		clockShop = {},
		idleJobs = 0,
		completedJobs = 0;

	// Personal assistant, providing useful helper functions.
	jeeves = {
		isArray: function (o) {
			return Object.prototype.toString.call(o) === '[object Array]';
		},

		each: function (list, iterator, context) {
			var iterFunc =
				(context !== undefined) ? iterator.bind(context) : iterator,
				i,
				prop;

			if (this.isArray(list)) {
				if (Array.forEach !== undefined) {
					list.forEach(iterFunc);
				} else {
					for (i = 0; i < list.length; i += 1) {
						iterFunc(list[i], i, list);
					}
				}
			} else {
				for (prop in list) {
					if (list.hasOwnProperty(prop)) {
						iterFunc(list[prop], prop, list);
					}
				}
			}
		}
	};

	function clockFired(id) {
		// console.log('Clock Fired: ' + id);
		if (!clockShop[id].isInterval) {
			Tock.unwind(id);
		}
	}

	function clearCountInterval(id) {
		clearInterval(clockShop[id].countInterval);
	}

	function wind(id, wait, isInterval) {
		clockShop[id] = {};
		clockShop[id].wait = wait;
		clockShop[id].msRun = 0;
		clockShop[id].isInterval = isInterval;
	}

	Tock = {
		wind: function (fn, wait, id, context) {
			if (id === undefined || id === '') {
				// console.error('You must specify a valid id when calling wind.');
				return;
			}
			if (clockShop[id] !== undefined) {
				// console.warn('This id already has a clock associated with it.');
				return;
			}
			if (context !== undefined) {
				fn = fn.bind(context);
			}

			wind(id, wait, false);

			clockShop[id].timeout = setTimeout(function () {
				fn();
				clockFired(id);
			}, wait);

			clockShop[id].countInterval = setInterval(function () {
				if (clockShop[id].secondsRun >= clockShop[id].wait) {
					clearCountInterval(id);
				}
				clockShop[id].msRun += 1000;
			}, 1000);

			clockShop[id].secondsLeft = function () {
				var timeLeft = clockShop[id].wait - clockShop[id].msRun;
				if (timeLeft < 0) {
					timeLeft = 0;
				}
				return timeLeft / 1000;
			};

			// console.log('Clock Wound: ' + id);
			idleJobs += 1;
		},

		windInterval: function (fn, wait, id, context) {
			if (id === undefined || id === '') {
				// console.error('You must specify a valid id when calling windInterval.');
				return;
			}
			if (clockShop[id] !== undefined) {
				// console.warn('This id already has a clock associated with it.');
				return;
			}
			if (context !== undefined) {
				fn = fn.bind(context);
			}

			wind(id, wait, true);

			clockShop[id].timeout = setInterval(function () {
				clockShop[id].msRun = 0;
				fn();
				clockFired(id);
			}, wait);

			clockShop[id].countInterval = setInterval(function () {
				clockShop[id].msRun += 1000;
			}, 1000);

			clockShop[id].secondsLeft = function () {
				var timeLeft = clockShop[id].wait - clockShop[id].msRun;
				if (timeLeft < 0) {
					timeLeft = 0;
				}
				return timeLeft / 1000;
			};

			// console.log('Clock Wound: ' + id);
			idleJobs += 1;
		},

		secondsLeft: function (id) {
			var timeLeft = 0;
			if (clockShop[id] !== undefined) {
				timeLeft = clockShop[id].secondsLeft();
			}
			return timeLeft;
		},

		unwind: function (id) {
			var tick;

			if (clockShop[id] === undefined) {
				// console.warn('Undefined id passed into clock. The timeout has either been fired or was not wound.');
			} else {
				if (clockShop[id].isInterval) {
					clearInterval(clockShop[id].timeout);
				} else {
					clearTimeout(clockShop[id].timeout);
				}
				clearInterval(clockShop[id].countInterval);
				idleJobs -= 1;
				completedJobs += 1;
				delete clockShop[id];
				// console.log('Clock Unwound: ' + id);
			}
		},

		numTicking: function () {
			return idleJobs;
		},

		numComplete: function () {
			return completedJobs;
		},

		tockStatus: function () {
			var statusStr = 'No clocks wound.',
				type;
			if (idleJobs > 0) {
				statusStr = '';
				jeeves.each(clockShop, function (clock, id) {
					type = clockShop[id].isInterval ? 'interval' : 'timeout';
					statusStr += id + ' (' + type + '): ' + clock.secondsLeft() + ' seconds left\n';
				});
				statusStr = statusStr.slice(0, statusStr.length - 1);
			}
			return statusStr;
		},

		unwindAll: function () {
			var that = this;
			jeeves.each(clockShop, function (clock, id) {
				that.unwind(id);
			});
		},

		destroy: function () {
			this.unwindAll();
			delete namespace.Tock;
		},

		version: function () {
			return VER;
		}
	};

	namespace.Tock = Tock;
}((typeof process !== 'undefined' && typeof process.title !== 'undefined' &&
	typeof exports !== 'undefined') ? exports : window));
