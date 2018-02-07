import { IdentityFunction, TrueFunction } from './CommonFunctions';
import Assert from './Assert';
import ValueEnforcer from './ValueEnforcer';

export default class ObjectUtilies {
    static filter(objectToMap, doIncludeKey) {
        Assert.toNotBeNullOrUndefined(
            objectToMap,
            'Object to map must be supplied as first argument'
        );
        Assert.toBeObject(objectToMap, 'First argument must be an object');
        const keyFilter = ValueEnforcer.toBeFunction(doIncludeKey, TrueFunction);
        const appendKeyToObject = (existingObject, key) =>
            Object.assign(existingObject, { [key]: objectToMap[key] });

        return Object.keys(objectToMap)
            .filter((key) => keyFilter(key, objectToMap[key], objectToMap))
            .reduce(appendKeyToObject, {});
    }

    static mapToArray(objectToMap, mapFuncion) {
        Assert.toNotBeNullOrUndefined(
            objectToMap,
            'Object to map must be supplied as first argument'
        );
        Assert.toBeObject(objectToMap, 'First argument must be an object');
        const mapFunc = ValueEnforcer.toBeFunction(mapFuncion, IdentityFunction);
        return Object.keys(objectToMap)
            .map((key, index) => mapFunc(objectToMap[key],key,index,objectToMap))
            .filter((obj)=>typeof obj !== "undefined")
    }

    static map(objectToMap, keyMapFuncion, valueMapFunction) {
        Assert.toNotBeNullOrUndefined(
            objectToMap,
            'Object to map must be supplied as first argument'
        );
        Assert.toBeObject(objectToMap, 'First argument must be an object');
        const keyFunc = ValueEnforcer.toBeFunction(keyMapFuncion, IdentityFunction);
        const valueFunc = ValueEnforcer.toBeFunction(valueMapFunction, IdentityFunction);
        const getValueFromMapperObjectForKey = (keyObj) => {
            const { key, index } = keyObj;
            const value = objectToMap[key];
            const mappedKey = keyFunc(key, value, index, objectToMap);
            if (mappedKey === null || typeof mappedKey === 'undefined') {
                return {};
            }
            const mappedValue = valueFunc(value, key, index, objectToMap);

            return { [mappedKey]: mappedValue };
        };
        const appendKeyToObject = (existingObject, key) =>
            Object.assign(existingObject, getValueFromMapperObjectForKey(key));

        return Object.keys(objectToMap)
            .map((key, index) => ({ key, index }))
            .reduce(appendKeyToObject, {});
    }
}
