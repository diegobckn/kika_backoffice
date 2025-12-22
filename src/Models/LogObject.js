const LogObject = (object, nivelTab = 0) => {
  // if (object === undefined) return " ".repeat(nivelTab) + "undefined" + ",\n"
  // if (object === null) return " ".repeat(nivelTab) + "null" + ",\n"
  if (typeof (object) == "string") {
    try {
      object = JSON.parse(object)
    } catch (er) {
      console.log("err", er)
      return ""
    }
  }

  var json2 = ""
  Object.keys(object).forEach((prop) => {
    // console.log("prop", prop)
    const valor = object[prop]
    if (valor === undefined) {
      json2 += " ".repeat(nivelTab) + prop + ": undefined,\n"
    } else if (valor === null) {
      json2 += " ".repeat(nivelTab) + prop + ": null,\n"
    } else if (Array.isArray(valor)) {
      json2 += " ".repeat(nivelTab) + prop + ":[" + "\n" + LogObject(valor, nivelTab + 1) + " ".repeat(nivelTab) + "],\n"
    } else if (typeof (valor) == "object") {
      json2 += " ".repeat(nivelTab) + prop + ":{" + "\n" + LogObject(valor, nivelTab + 1) + " ".repeat(nivelTab) + "},\n"
    } else if (typeof (valor) == "string") {
      json2 += " ".repeat(nivelTab) + prop + ": \"" + valor + "\",\n"
    } else {
      json2 += " ".repeat(nivelTab) + prop + ": " + valor + ",\n"
    }
  })
  return json2
}

export default LogObject