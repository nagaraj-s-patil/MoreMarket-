const localStorageKey = "moneyCalculatorAllData";
const allData = JSON.parse(localStorage.getItem(localStorageKey)) || {};
const dataDisplay = document.getElementById("dataDisplay");

function renderData() {
  dataDisplay.innerHTML = "";

  if (Object.keys(allData).length === 0) {
    dataDisplay.innerHTML = "<p>No data available.</p>";
    return;
  }

  for (const date in allData) {
    const dateBlock = document.createElement("div");
    dateBlock.className = "date-block";
    dateBlock.innerHTML = `<h2>📅 Date: ${date}</h2>`;

    const users = allData[date];
    for (const user in users) {
      const entry = users[user];
      const denominations = ['n2000', 'n500', 'n200', 'n100', 'n50', 'n20', 'n10', 'n5', 'n2', 'n1'];
      let total = 0;

      denominations.forEach(den => {
        if (entry[den]) {
          const value = parseInt(den.replace('n', '')) * entry[den];
          total += value;
        }
      });

      if (entry.chocolates) {
        total += entry.chocolates * 10;
      }

      const userEntry = document.createElement("div");
      userEntry.className = "user-entry";
      userEntry.innerHTML = `
  <strong>👤 ${user}</strong><br/>
  💰 Total: ₹${total}<br/>
  🍫 Chocolates: ${entry.chocolates || 0}<br/>
  📝 Note: ${entry.note || ''}<br/>
  🕒 Saved: ${new Date(entry.timestamp || Date.now()).toLocaleString()}<br/>
  <button onclick="deleteUserEntry('${date}', '${user}')">🗑️ Delete</button>
  <button onclick="sendToCalculator('${date}', '${user}')">➕ Add</button>
`;

      dateBlock.appendChild(userEntry);
    }

    dataDisplay.appendChild(dateBlock);
  }
}
function sendToCalculator(date, user) {
  const entryData = allData[date][user];
  
  // Save selected data temporarily
  localStorage.setItem("moneyCalculatorSelectedEntry", JSON.stringify(entryData));
  
  // Redirect to calculator page
  window.location.href = "../html/calculater.html"; // change to your calculator file path
}


function deleteUserEntry(date, user) {
  if (confirm(`Are you sure you want to delete data for ${user} on ${date}?`)) {
    delete allData[date][user];
    if (Object.keys(allData[date]).length === 0) {
      delete allData[date]; // remove date block if no users left
    }
    localStorage.setItem(localStorageKey, JSON.stringify(allData));
    renderData(); // re-render after delete
  }
}

function clearAllData() {
  if (confirm("Are you sure you want to clear ALL saved data?")) {
    localStorage.removeItem(localStorageKey);
    location.reload();
  }
}

renderData();