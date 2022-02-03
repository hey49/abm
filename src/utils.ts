const debounce = (func: Function, delay: number, leading: boolean = false) => {
  let timeout: any;
  let run = false;
  return (...args: any[]) => {
    clearTimeout(timeout);
    if (leading && !run) {
      func.apply(this, args);
      run = true;
    }
    timeout = setTimeout(() => {
      if (leading) {
        run = false;
      } else {
        func.apply(this, args);
      }
    }, delay);
  };
};

const throttle = (func: Function, delay: number, leading: boolean = false) => {
  let run = true;
  return (...args: any[]) => {
    if (!run) return;
    run = false;
    if (leading) func.apply(this, args);
    setTimeout(() => {
      if (!leading) func.apply(this, args);
      run = true;
    }, delay);
  };
};

type clsType = Array<string | boolean>;

const cls = (...xs: clsType): string => xs.filter((x) => x !== false).join(' ');

export {
  debounce,
  throttle,
  cls,
};
