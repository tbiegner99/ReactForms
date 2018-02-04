import {IdentityFunction,TrueFunction} from "./CommonFunctions"
import Assert from "./Assert"
import ValueEnforcer from "./ValueEnforcer"

const keyAsIndex = (item,index) => index;
export default class ArrayUtilities {
  static mapToObject(arr, keyMapFunction,valueMapFunction) {
    if(!arr) return null;
    Assert.toBeArray(arr, "Expected array as first argument");
    const keyFunc = ValueEnforcer.toBeFunction(keyMapFunction,keyAsIndex);
    const valueFunc = ValueEnforcer.toBeFunction(valueMapFunction,IdentityFunction);

    const mapperFunction = (item,index) => {
      const key = keyFunc(item,index,arr);
      const value = valueFunc(item,index,arr);
      if(typeof key === "undefined" || key === null) return {};
      return  {[key]:value}
    }
    return arr.map(mapperFunction)
              .reduce((acc,item)=> Object.assign(acc,item), {});
  }

  static partitionBy(arr, keyMapFunction, allowNullKeys) {
    if(!arr) return null;
    Assert.toBeArray(arr, "Expected array as first argument");
    const keyFunc = ValueEnforcer.toBeFunction(keyMapFunction,TrueFunction);

    const reducerFunction = (accumulator,item,index) => {
      const key = keyFunc(item,index,arr);
      const keyIsNull = (key === null || typeof key ==="undefined")
      if(keyIsNull && !allowNullKeys) return accumulator;
      const existingItem = accumulator[key];
      if(existingItem) {
        existingItem.push(item);
      } else {
        accumulator[key] = [item];
      }
      return accumulator;
    }
    return arr.reduce(reducerFunction, {});
  }
}
