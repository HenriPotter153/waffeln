const { Octokit } = require("@octokit/rest");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // GitHub Client initialisieren
  const octokit = new Octokit({ 
    auth: process.env.GITHUB_TOKEN 
  });

  const body = JSON.parse(event.body);
  const newEntry = {
    name: body.name,
    menge: body.menge,
    puderzucker: body.puderzucker,
    zeit: new Date().toISOString()
  };

  try {
    // 1. Aktuelle bestellungen.json abrufen
    const { data } = await octokit.repos.getContent({
      owner: "HenriPotter153",
      repo: "waffeln",
      path: "bestellungen.json",
      ref: "main"
    });

    // 2. Bestehende Daten dekodieren
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    let bestellungen = JSON.parse(content);
    bestellungen.push(newEntry);

    // 3. Aktualisierte Datei hochladen
    await octokit.repos.createOrUpdateFileContents({
      owner: "HenriPotter153",
      repo: "waffeln",
      path: "bestellungen.json",
      message: "Neue Bestellung: " + newEntry.name,
      content: Buffer.from(JSON.stringify(bestellungen, null, 2)).toString('base64'),
      sha: data.sha, // Wichtig für Updates!
      branch: "main"
    });

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type" 
      },
      body: "Bestellung gespeichert"
    };
  } catch (error) {
    console.error("GitHub API Fehler:", error);
    return { 
      statusCode: 500,
      body: "Fehler beim Speichern der Bestellung"
    };
  }
};
