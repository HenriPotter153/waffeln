const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const filePath = path.join(__dirname, "../../bestellungen.json");
  let arr = [];

  try {
    const data = fs.readFileSync(filePath, "utf8");
    arr = JSON.parse(data);
  } catch (e) {
    // Datei existiert möglicherweise noch nicht – kein Problem
  }

  arr.push({
    name: body.name,
    menge: body.menge,
    puderzucker: body.puderzucker,
    zeit: new Date().toISOString()
  });

  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
  return { statusCode: 200, body: "Bestellung gespeichert" };
};
