/**
 * Round a number to a given precision
 * @param value The value to round
 * @param precision The precision to round to
 */
export const roundUp = (value: number, precision: number = 0): number => {
    const multiplier = Math.pow(10, precision);
    return Math.ceil(value * multiplier) / multiplier;
}

/**
 * Round a number down to a given precision
 * @param value The value to round
 * @param precision The precision to round to
 */
export const roundDown = (value: number, precision: number = 0): number => {
    const multiplier = Math.pow(10, precision);
    return Math.floor(value * multiplier) / multiplier;
}

/**
 * Sum an array of numbers
 * @param values The values to sum
 */
export const sum = (values: number[]): number => {
    return values.reduce((total, value) => total + value, 0)
}