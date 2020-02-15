export const IdentityFunction = (obj) => obj;
export const NoOperation = () => {};
export const TrueFunction = () => true;
export const FalseFunction = () => false;
export const RejectFunction = (msg) => Promise.reject(new Error(msg));
export const ResolveFunction = (value) => Promise.resolve(value);
