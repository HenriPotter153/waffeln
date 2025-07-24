const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzqfgZgV9Atk_JRl_S88uS8GyMCVRmwg6axBxcdcLSI3rUBtJEPbsuyLm1BcNoXfsDjsA/exec";

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: event.body
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      body: text,
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: "Fehler beim Weiterleiten an Google Apps Script: " + error.toString()
    };
  }
};
