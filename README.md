Tock
====

Timeout and interval javascript manager.

Tock in action: http://vhiremath4.github.com/Tock

Winding
=======

To wind a clock (set an interval or timeout), you need only follow two steps:

1.) Include tock.js (or tock.min.js) before calling anything on the global Tock object.

2.) Call Tock.wind or Tock.windInterval.

That's really it. After that, Tock will take care of the rest and you may interact
with the Tock API to get statistics on different clocks (intervals and timeouts)
you have wound with Tock.

Core API
========

1.) "wind": Calling Tock.wind sets a timeout. It takes the following arguments:

    (
        fn,      // the function to be fired after the specified wait time
        wait,    // the wait time in milliseconds until the specified function is fired

        id,      // the id you wish to give the clock

        context  // (optional) the value of this for the specified function
    )

  So a call to Tock.wind may look something like this:

    Tock.wind(function () {
        alert('Yay!');
    }, 1000, 'yay');

2.) "windInterval": Calling Tock.windInterval sets an interval. It takes the same
arguments as "wind".

  A call to Tock.windInterval may look something like this:

    Tock.windInterval(function () {
        alert('Yay!');
    }, 1000, 'yay');

3.) "unwind": Calling Tock.unwind destroys the clock associated with the provided id and
clears its interval or timeout created by "wind" or "windInterval". It takes the
following argument:

    (
        id // the id of the clock you wish to unwind
    )

  A call to Tock.unwind may look something like this:

    Tock.wind(function () {
        alert('yay');
    }, 10000, 'yay');
    Tock.unwind('yay');
    // 'yay' will never get alerted

4.) "unwindAll": Calling Tock.unwindAll calls Tock.unwind on each clock Tock currently owns/manages.

  A call to Tock.unwindAll may look something like this:

    Tock.wind(function () {}, 4000, 'id1');
    Tock.wind(function () {}, 3000, 'id2');
    Tock.numTicking(); // 2
    Tock.unwindAll();
    Tock.numTicking(); // 0

API for Stastics
================

The real reason to use Tock is not merely because of its core API, but because of the stastics
it can offer you.

1.) "numTicking": Calling Tock.numTicking returns the number of active clocks (intervals and timeouts)
Tock is currently managing.

  A call to Tock.numTicking may look something like this:

    Tock.wind(function () {}, 4444, 'sampleId');
    Tock.numTicking(); // 1
    Tock.unwind('sampleId');
    Tock.numTicking(); // 0

2.) "numComplete": Calling Tock.numComplete returns the number of clocks (intervals and timeouts) that
have finished to completion. Note that, calling unwind manually on a clock adds to this count.

  A call to Tock.numComplete may look something like this:

    Tock.wind(function () {}, 100, 'sampleId');
    // ... wait 100 milliseconds
    Tock.numComplete(); // 1

3.) "secondsLeft": Calling Tock.secndsLeft returns the number of seconds left until the clock associated
with the specified id fires. It takes the following arguments:

    (
        id  // the id of the clock
    )

  A call to Tock.secondsLeft may look something like this:

    Tock.wind(function () {}, 10000, 'sampleId');
    // wait 7 seconds
    Tock.secondsLeft('sampleId'); // 3

4.) "tockStatus": Calling Tock.tockStatus returns a string that gives information for all the active clocks
Tock is managing. Each line of the string takes the following format, where ID is the id of the clock,
TYPE specifies if the clock is a timeout or interval and SECONDS_LEFT denotes the seconds until the
clock fires:

    "<ID> (<TYPE>): <SECONDS_LEFT> seconds left"

Removing Tock
=============

You may notice that Tock adds itself to the global namespace (window). If you wish to remove it, call
destroy on it. This will additionally unwind all clocks it owns.

    Tock.destroy();
    Tock // undefined

Tock Console Prints
===================

Since Tock was made with the developer in mind, using tock.js offers useful console prints indicating
when the following events occur:

1.) When a clock has been successfully wound up. (log)

2.) When a clock has been successfully unwound. (log)

3.) When a clock is not owned by Tock and an unwind was attempted. (warn)

4.) When a clock's function has been fired. (log)

5.) When an id is undefined or the empty string when a wind was attempted. (error)

6.) When an id already has a clock associated with it and a wind was attempted. (warn)

The minified version of Tock does not contain these console prints.

Version
=======

Tock may be updated in the future. To figure out which version of Tock you have, call version on it. The
current version is 0.1.

    Tock.version(); // '0.1'
