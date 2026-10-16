/*
  AI EDITOR by Santiago Remedio · configuración
  ─────────────────────────────────────────────
  Lo único que tenés que tocar está acá. Pegá cada link entre las comillas.
*/
window.AIE = {
  // Tu link de pago de Stripe (Payment Link). Ej: "https://buy.stripe.com/abc123"
  stripe: "https://buy.stripe.com/7sYbITdMV1Ydf4l8rz67S05",

  // El link de Google Drive del zip (se muestra solo en la página de gracias, /paid).
  descarga: "https://drive.google.com/file/d/1BHkpZYqBDehJkP37l9kFKW4ufHGCVzn7/view?usp=sharing",

  // Puente a Cardinal: a dónde va el botón de "lista de espera" en la página de gracias. Vacío = esa tarjeta no aparece.
  comunidad: "https://santiagoremedio.com/#lista",

  // Planilla donde caen los mails (la misma de /mails y de la home). Vacío = no hay captación de mails.
  mails: "https://script.google.com/macros/s/AKfycbyPwpSiizF6S37QYn69LuG-luGTpX9TYDhQ5G8bQ75AI5T3jzoCZYGyv_cu3tI7IaS4/exec",

  // Las guías que se regalan a cambio del mail (y de bonus en /paid). Mismas que en la home.
  guias: [
    { t: "5 plugins de Claude Code", u: "https://drive.google.com/file/d/1exdSLv1Ol9UvTxqbiDiA3Q4Iwv51mkdv/view" },
    { t: "5 Claude Skills que tenés que instalar", u: "https://drive.google.com/file/d/1VRZCAv8kRDeuOYiHlMrjzCrzK9yyw50S/view" },
    { t: "Que Claude maneje tu Instagram", u: "https://drive.google.com/file/d/16Gq2iEFmBncrLvzrsHRWdAgMEaEEVz51/view" }
  ],

  // Precio que se muestra en la página
  precio: "20",
  precioAntes: "", // ej: "39" para mostrarlo tachado. Vacío = no se muestra.
};
