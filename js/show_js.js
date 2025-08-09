const localStorageKey = "moneyCalculatorAllData";
let allData = JSON.parse(localStorage.getItem(localStorageKey)) || {};
const dataDisplay = document.getElementById("dataDisplay");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

// Paging variables
let currentPage = 1;
const pageSize = 5; // number of user entries per page
let filteredEntries = [];

// Convert allData into an array for easier paging
function getAllEntriesArray(data) {
  let arr = [];
  for (const date in data) {
    for (const user in data[date]) {
      arr.push({ date, user, entry: data[date][user] });
    }
  }
  return arr;
}

// Search handler
function handleSearch() {
  const term = searchInput.value.toLowerCase();
  const allEntries = getAllEntriesArray(allData);

  filteredEntries = allEntries.filter(
    item =>
      item.date.toLowerCase().includes(term) ||
      item.user.toLowerCase().includes(term)
  );

  currentPage = 1;
  renderData();
}

// Render data with paging
function renderData() {
  dataDisplay.innerHTML = "";

  if (filteredEntries.length === 0) {
    dataDisplay.innerHTML = "<p>No data available.</p>";
    paginationContainer.innerHTML = "";
    return;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredEntries.slice(startIndex, startIndex + pageSize);

  let lastDate = "";
  paginatedItems.forEach(({ date, user, entry }) => {
    if (date !== lastDate) {
      const dateBlock = document.createElement("div");
      dateBlock.className = "date-block";
      dateBlock.innerHTML = `<h2>📅 Date: ${date}</h2>`;
      dataDisplay.appendChild(dateBlock);
      lastDate = date;
    }

    const denominations = ['n2000', 'n500', 'n200', 'n100', 'n50', 'n20', 'n10', 'n5', 'n2', 'n1'];
    let total = 0;
    denominations.forEach(den => {
      if (entry[den]) total += parseInt(den.replace('n', '')) * entry[den];
    });
    if (entry.chocolates) total += entry.chocolates * 10;

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

    dataDisplay.lastChild.appendChild(userEntry);
  });

  renderPagination();
}

// Pagination buttons
function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(filteredEntries.length / pageSize);

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === currentPage) ? "active" : "";
    btn.onclick = () => {
      currentPage = i;
      renderData();
    };
    paginationContainer.appendChild(btn);
  }
}

function sendToCalculator(date, user) {
  const entryData = allData[date][user];
  localStorage.setItem("moneyCalculatorSelectedEntry", JSON.stringify(entryData));
  window.location.href = "../html/calculater.html";
}

function deleteUserEntry(date, user) {
  if (confirm(`Are you sure you want to delete data for ${user} on ${date}?`)) {
    delete allData[date][user];
    if (Object.keys(allData[date]).length === 0) {
      delete allData[date];
    }
    localStorage.setItem(localStorageKey, JSON.stringify(allData));
    handleSearch();
  }
}

function clearAllData() {
  if (confirm("Are you sure you want to clear ALL saved data?")) {
    localStorage.removeItem(localStorageKey);
    location.reload();
  }
}

// Initialize
filteredEntries = getAllEntriesArray(allData);
renderData();
