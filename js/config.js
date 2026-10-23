// Configuratie van het live bord (fase 2). Leeg laten = geen bord, de game werkt gewoon.
// eventId: korte naam van de sessie, bijv. "9nov". firebaseUrl: database-URL zonder pad, bijv. "https://xxx-default-rtdb.europe-west1.firebasedatabase.app".
const CONFIG = {
  eventId: '',
  firebaseUrl: '',
  boardEnabled: false,
};
if (typeof module === 'object' && module.exports) module.exports = CONFIG;
