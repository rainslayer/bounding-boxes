export function throttle(func: Function, limit: number) {
  let throttled = false;

  return function () {
    if (!throttled) {
      func();
      throttled = true;
      setTimeout(() => (throttled = false), limit);
    }
  };
};