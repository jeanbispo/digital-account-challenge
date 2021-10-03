const deepClone = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let cloned
  let i

  if (obj instanceof Date) {
    cloned = new Date(obj.getTime())
    return cloned
  }

  if (obj instanceof Array) {
    let l
    cloned = []
    for (i = 0, l = obj.length; i < l; i++) {
      cloned[i] = deepClone(obj[i])
    }

    return cloned
  }

  cloned = {}
  for (i in obj)
    if (obj.hasOwnProperty(i)) {
      cloned[i] = deepClone(obj[i])
    }

  return cloned
}
export default deepClone
