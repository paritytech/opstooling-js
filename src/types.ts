export class Ok<T> {
  constructor(public value: T) {}
}
export class Err<T> {
  constructor(public value: T) {}
}
