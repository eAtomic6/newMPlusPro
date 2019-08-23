let noNull = function (key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}
export {
  noNull
}
