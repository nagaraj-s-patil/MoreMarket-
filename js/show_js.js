let allData = JSON.parse(localStorage.getItem("moneyCalculatorAllData")) || [];
let filteredData = [...allData];
let currentPage = 1;
const itemsPerPage = 4;

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);

  pageData.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date || "-"}</td>
      <td>${item.user || "Unknown"}</td>
      <td>${item.total || 0}</td>
      <td><button onclick="loadToCalculator('${item.date}')">Load</button></td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("pageInfo").textContent =
    `Page ${currentPage} of ${Math.max(1, Math.ceil(filteredData.length / itemsPerPage))}`;
}

function nextPage() {
  if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
    currentPage++;
    renderTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function applyDateFilter() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  filteredData = allData.filter(item => {
    if (!item.date) return false;
    const itemDate = new Date(item.date);
    return (!from || itemDate >= new Date(from)) &&
           (!to || itemDate <= new Date(to));
  });

  filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

  currentPage = 1;
  renderTable();
}

function resetFilter() {
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  filteredData = [...allData];
  currentPage = 1;
  renderTable();
}

function loadToCalculator(date) {
  alert(`Loading data for ${date} into calculator...`);
}

// Initial load
renderTable();
