export const format = (str, args) => {
  for (k in args) {
    str = str.replace('{' + k + '}', args[k]);
  }
  return str;
};
