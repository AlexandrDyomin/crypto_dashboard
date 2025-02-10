export const compose = (...fns) => (arg) => 
    fns.reduce(async (composed, f) => f(await composed), arg);