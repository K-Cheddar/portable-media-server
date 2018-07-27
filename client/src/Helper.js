var lastCall = 0;

export function debounce(func, wait, immediate){
  var timeout;
  console.log(":YW(DQ)");
  return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function throttle(func, interval) {
  console.log(func, interval);
    return function() {
        var now = Date.now();
        console.log("DATe", now);
          console.log("lase", (lastCall + interval));
        if (lastCall + interval < now) {
            lastCall = now;
            return func.apply(this, arguments);
        }
    };
}
