import {ListWrapper, List} from 'facade/collection';
import {stringify} from 'facade/lang';
import {Key} from './key';

function constructResolvingPath(keys: List) {
  if (keys.length > 1) {
    var reversed = ListWrapper.reversed(keys);
    var tokenStrs = ListWrapper.map(reversed, (k) => stringify(k.token));
    return " (" + tokenStrs.join(' -> ') + ")";
  } else {
    return "";
  }
}

export class ProviderError extends Error {
  constructor(key:Key, constructResolvingMessage:Function){
    this.keys = [key];
    this.constructResolvingMessage = constructResolvingMessage;
    this.message = this.constructResolvingMessage(this.keys);
  }

  addKey(key: Key) {
    ListWrapper.push(this.keys, key);
    this.message = this.constructResolvingMessage(this.keys);
  }

  toString() {
    return this.message;
  }
}

export class NoProviderError extends ProviderError {
  constructor(key:Key){
    super(key, function(keys:List) {
      var first = stringify(ListWrapper.first(keys).token);
      return `No provider for ${first}!${constructResolvingPath(keys)}`;
    });
  }
}

export class AsyncProviderError extends ProviderError {
  constructor(key:Key){
    super(key, function(keys:List) {
      var first = stringify(ListWrapper.first(keys).token);
      return `Cannot instantiate ${first} synchronously. ` +
        `It is provided as a future!${constructResolvingPath(keys)}`;
    });
  }
}

export class InvalidBindingError extends Error {
  constructor(binding){
    this.message = `Invalid binding ${binding}`;
  }

  toString() {
    return this.message;
  }
}