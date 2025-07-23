// netlify/functions/neueBestellung.js

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const bestellung = JSON.parse(event.body);
  const bestellungMitZeit = {
    ...bestellung,
    zeit: new Date().toISOString(),
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bestellungMitZeit),
  };
};
