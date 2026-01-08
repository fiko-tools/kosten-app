function berechnen() {

  // ===== EINGABEN =====
  let ek = Number(document.getElementById("ek").value);
  let waehrung = document.getElementById("waehrung").value;
  let set = Number(document.getElementById("set").value);

  let gewicht = Number(document.getElementById("gewicht").value);
  let laenge = Number(document.getElementById("laenge").value);
  let breite = Number(document.getElementById("breite").value);
  let hoehe = Number(document.getElementById("hoehe").value);

  let amazonProzent = Number(document.getElementById("amazon_prozent").value);
  let amazonFix = Number(document.getElementById("amazon_fix").value);
  let ppc = Number(document.getElementById("ppc").value);

  let versand = Number(document.getElementById("versand").value);
  let verpackung = Number(document.getElementById("verpackung").value);

  let verkauf = Number(document.getElementById("verkauf").value);

  // ===== WÄHRUNG =====
  let wechselkurs = 0.92; // USD → EUR konservativ
  if (waehrung === "usd") ek = ek * wechselkurs;

  // ===== VOLUMENGEWICHT =====
  let volumenGewicht = (laenge * breite * hoehe) / 6000;
  let abrechnungsGewicht = Math.max(gewicht, volumenGewicht);

  // ===== TRANSPORT (REALISTISCHER DURCHSCHNITT) =====
  let transport = abrechnungsGewicht * 6; // €/kg DDP Durchschnitt

  // ===== ZOLL (PAUSCHAL 6 %) =====
  let zoll = (ek + transport) * 0.06;

  // ===== EINFUHRUMSATZSTEUER =====
  let eust = (ek + transport + zoll) * 0.19;

  // ===== DDP =====
  let ddpProStueck = ek + transport + zoll + eust;
  document.getElementById("ddp").value = ddpProStueck.toFixed(2);

  let warenkosten = ddpProStueck * set;

  // ===== AMAZON =====
  let amazonGebuehr = verkauf * (amazonProzent / 100);

  // ===== GESAMTKOSTEN =====
  let gesamtkosten =
    warenkosten +
    amazonGebuehr +
    amazonFix +
    ppc +
    versand +
    verpackung;

  let gewinn = verkauf - gesamtkosten;
  let marge = (gewinn / verkauf) * 100;

  // ===== AMPEL =====
  let klasse = "gruen";
  if (marge < 20) klasse = "rot";
  else if (marge < 25) klasse = "gelb";

  document.getElementById("ergebnis").innerHTML = `
    <p>DDP pro Stück: ${ddpProStueck.toFixed(2)} €</p>
    <p>Warenkosten pro Set: ${warenkosten.toFixed(2)} €</p>
    <p>Amazon % Gebühr: ${amazonGebuehr.toFixed(2)} €</p>
    <p>Amazon Fix: ${amazonFix.toFixed(2)} €</p>
    <p>PPC: ${ppc.toFixed(2)} €</p>
    <p>Versand: ${versand.toFixed(2)} €</p>
    <p>Verpackung: ${verpackung.toFixed(2)} €</p>
    <hr>
    <p><strong>Gesamtkosten: ${gesamtkosten.toFixed(2)} €</strong></p>
    <p><strong>Gewinn: ${gewinn.toFixed(2)} €</strong></p>
    <p class="${klasse}">Marge: ${marge.toFixed(2)} %</p>
  `;
  // ===== Druckdaten setzen =====
document.getElementById("printProdukt").innerText =
  "Produkt: " + document.getElementById("produkt").value;

document.getElementById("printDatum").innerText =
  "Datum: " + new Date().toLocaleDateString();
}
function berechneSet(stueck, verkauf) {

  let ddp = Number(document.getElementById("ddp").value);
  let amazonProzent = Number(document.getElementById("amazon_prozent").value);
  let amazonFix = Number(document.getElementById("amazon_fix").value);
  let ppc = Number(document.getElementById("ppc").value);
  let versand = Number(document.getElementById("versand").value);
  let verpackung = Number(document.getElementById("verpackung").value);

  let warenkosten = ddp * stueck;
  let amazonGebuehr = verkauf * (amazonProzent / 100);

  let gesamtkosten =
    warenkosten +
    amazonGebuehr +
    amazonFix +
    ppc +
    versand +
    verpackung;

  let gewinn = verkauf - gesamtkosten;
  let marge = (gewinn / verkauf) * 100;

  let farbe = "gruen";
  if (marge < 20) farbe = "rot";
  else if (marge < 25) farbe = "gelb";

  return {
    kosten: gesamtkosten,
    gewinn: gewinn,
    marge: marge,
    farbe: farbe
  };
}

function setVergleich() {


  let p1 = Number(document.getElementById("preis1").value);
  let p2 = Number(document.getElementById("preis2").value);
  let p3 = Number(document.getElementById("preis3").value);

  let s1 = berechneSet(1, p1);
  let s2 = berechneSet(2, p2);
  let s3 = berechneSet(3, p3);

  document.getElementById("setErgebnis").innerHTML = `
    <h3>Set-Vergleich</h3>

    <p><strong>1er-Set</strong><br>
    Gewicht: ${s1.setGewicht.toFixed(2)} kg<br>
    Versand: ${s1.versand.toFixed(2)} €<br>
    Gewinn: ${s1.gewinn.toFixed(2)} €<br>
    <span class="${s1.farbe}">Marge: ${s1.marge.toFixed(2)} %</span></p>

    <p><strong>2er-Set</strong><br>
    Gewicht: ${s2.setGewicht.toFixed(2)} kg<br>
    Versand: ${s2.versand.toFixed(2)} €<br>
    Gewinn: ${s2.gewinn.toFixed(2)} €<br>
    <span class="${s2.farbe}">Marge: ${s2.marge.toFixed(2)} %</span></p>

    <p><strong>3er-Set</strong><br>
    Gewicht: ${s3.setGewicht.toFixed(2)} kg<br>
    Versand: ${s3.versand.toFixed(2)} €<br>
    Gewinn: ${s3.gewinn.toFixed(2)} €<br>
    <span class="${s3.farbe}">Marge: ${s3.marge.toFixed(2)} %</span></p>

    <hr>

    <strong>Versandkosten-Übersicht</strong><br>
    1er-Set: ${s1.versand.toFixed(2)} €<br>
    2er-Set: ${s2.versand.toFixed(2)} €<br>
    3er-Set: ${s3.versand.toFixed(2)} €
  `;
}

function berechneVersandkosten(setGewicht) {

  if (setGewicht <= 2) return 5.49;
  if (setGewicht <= 5) return 6.99;
  if (setGewicht <= 10) return 10.49;

  return 0; // manuell setzen bei >10 kg
}
function berechneSet(stueck, verkauf) {

  let ddp = Number(document.getElementById("ddp").value);
  let gewichtProStueck = Number(document.getElementById("gewicht").value);

  let amazonProzent = Number(document.getElementById("amazon_prozent").value);
  let amazonFix = Number(document.getElementById("amazon_fix").value);
  let ppc = Number(document.getElementById("ppc").value);
  let verpackung = Number(document.getElementById("verpackung").value);

  // Setgewicht & Versand
  let setGewicht = gewichtProStueck * stueck;
  let versand = berechneVersandkosten(setGewicht);

  // Kosten
  let warenkosten = ddp * stueck;
  let amazonGebuehr = verkauf * (amazonProzent / 100);

  let gesamtkosten =
    warenkosten +
    amazonGebuehr +
    amazonFix +
    ppc +
    versand +
    verpackung;

  let gewinn = verkauf - gesamtkosten;
  let marge = (gewinn / verkauf) * 100;

  let farbe = "gruen";
  if (marge < 20) farbe = "rot";
  else if (marge < 25) farbe = "gelb";

  return {
    kosten: gesamtkosten,
    gewinn: gewinn,
    marge: marge,
    farbe: farbe,
    versand: versand,
    setGewicht: setGewicht
  };
}
// ================================
// 🔐 STABILE SPEICHERUNG (IndexedDB)
// ================================

const dbName = "KostenAppDB";
const storeName = "produkte";
let gespeichertesBild = "";
// 📸 Produktbild auswählen & merken
document.addEventListener("DOMContentLoaded", function () {
  const bildInput = document.getElementById("bild");
  const preview = document.getElementById("preview");

  if (!bildInput) return;

  bildInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      gespeichertesBild = e.target.result;
      preview.src = gespeichertesBild;
    };
    reader.readAsDataURL(file);
  });
});

// Datenbank öffnen
function openDB(callback) {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = function (e) {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (e) {
    callback(e.target.result);
  };
}

// 💾 SPEICHERN
function speichern() {
  openDB(db => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    const produkt = {
      name: document.getElementById("produkt").value,
      datum: new Date().toLocaleString(),
      bild: gespeichertesBild,
      felder: {
        ddp: document.getElementById("ddp").value,
        set: document.getElementById("set").value,
        verkauf: document.getElementById("verkauf").value
      },
      ergebnis: document.getElementById("ergebnis").innerHTML
    };

    store.add(produkt);
    alert("Produkt sicher gespeichert ✅");
  });
}

// 🔄 LETZTES PRODUKT BEIM START LADEN
window.addEventListener("load", function () {
  openDB(db => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.openCursor(null, "prev");

    request.onsuccess = function (e) {
      const cursor = e.target.result;
      if (!cursor) return;

      const p = cursor.value;

      document.getElementById("produkt").value = p.name || "";
      document.getElementById("ddp").value = p.felder.ddp || "";
      document.getElementById("set").value = p.felder.set || "";
      document.getElementById("verkauf").value = p.felder.verkauf || "";
      document.getElementById("ergebnis").innerHTML = p.ergebnis || "";

      if (p.bild) {
        gespeichertesBild = p.bild;
        document.getElementById("preview").src = p.bild;
      }
    };
  });
});


