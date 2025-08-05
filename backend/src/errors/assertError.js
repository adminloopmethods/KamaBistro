import AppError from "./AppError.js";

// Function to assert a condition, if the condition is not met, it throws an error
const assert = (condition, errorName, message) => {
  if (condition) return;
  throw new AppError(errorName, message);
};

// Function to assert every condition in an array, if any condition is not met, it throws an error with a single message
const assertEvery = (conditionArray, errorName, message) => {
  const allTrue = conditionArray.every(condition => condition);
  if (!allTrue) {
    throw new AppError(errorName, message);
  }
  return true;
};

export { assert, assertEvery };
