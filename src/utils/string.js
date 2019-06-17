export const format = (str, args) => {
  for (k in args) {
    str = str.replace("{" + k + "}", args[k])
  }
  return str
}

const stringConstants = Object.freeze({
  cashType: "CASH",
  creditType: "CREDIT",
})

export default stringConstants
