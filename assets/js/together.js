(function () {
  const START = new Date("2025-06-15T00:00:00");

  const yEl = document.getElementById("tYears");
  const mEl = document.getElementById("tMonths");
  const dEl = document.getElementById("tDays");
  if (!yEl) return;

  function calc() {
    const now = new Date();
    let years = now.getFullYear() - START.getFullYear();
    let months = now.getMonth() - START.getMonth();
    let days = now.getDate() - START.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  }

  function render() {
    const { years, months, days } = calc();
    yEl.textContent = years;
    mEl.textContent = months;
    dEl.textContent = days;
  }

  render();
  setInterval(render, 60000);
})();
