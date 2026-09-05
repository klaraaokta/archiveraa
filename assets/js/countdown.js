(function () {
  const TARGET = new Date("2026-09-09T00:00:00");

  const els = {
    days: document.getElementById("cDays"),
    hours: document.getElementById("cHours"),
    mins: document.getElementById("cMins"),
    secs: document.getElementById("cSecs"),
  };
  const dayBadge = document.getElementById("dayBadge");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = new Date();
    let diff = TARGET - now;

    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.mins.textContent = "00";
      els.secs.textContent = "00";
      if (dayBadge) dayBadge.textContent = "hari ini! 🎉";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);

    if (dayBadge) dayBadge.textContent = `H-${days}`;
  }

  tick();
  setInterval(tick, 1000);
})();
