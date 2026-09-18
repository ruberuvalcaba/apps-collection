type ReduceCallback<T, U> = ( accumulator: U, currentValue: T, currentIndex: number, array: T[] ) => U;

export default Array.prototype.myReduce = function <T, U>(
  this: T[],
  callbackFn: ReduceCallback<T, U>,
  initialValue?: U
): U {
  let accumulator = initialValue as U;
  let start = 0;

  if (arguments.length > 1) {
    accumulator = initialValue as U;
  } else {
    while (start < this.length && !(start in this)) {
      start++;
    }

    if (start === this.length) {
      throw new TypeError(
        "Reduce of empty array with no initial value"
      );
    }

    accumulator = this[start] as U;
    start++;
  }

  for (let i = start; i < this.length; i++) {
    if (i in this) {
      accumulator = callbackFn(
        accumulator,
        this[i],
        i,
        this
      );
    }
  }

  return accumulator;
};
