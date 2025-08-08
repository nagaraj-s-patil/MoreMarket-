
  // Run when page is ready
window.onload = function () {
  // Set today's date in the date picker
  document.getElementById("datePicker").value = new Date().toISOString().split('T')[0];

  // Optional: auto-total when input changes
  const inputs = document.querySelectorAll("input[type='number'], #includeChoco, #notes");
  inputs.forEach(input => {
    input.addEventListener("input", total);
    input.addEventListener("change", total);
  });

  total(); // Initial total calculation
};
function getSelectedDate() {
  const picker = document.getElementById("datePicker");
  return picker.value || new Date().toISOString().split('T')[0]; // fallback to today
}
function getUserName() {
  return document.getElementById("userName").value.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const savedEntry = localStorage.getItem("moneyCalculatorSelectedEntry");
  
  if (savedEntry) {
    const entry = JSON.parse(savedEntry);
    
    // Fill calculator fields
    for (const key in entry) {
      const field = document.getElementById(key);
      if (field) {
        field.value = entry[key];
      }
    }

    // Remove temp data so it doesn't override next time
    localStorage.removeItem("moneyCalculatorSelectedEntry");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const localStorageKey = "moneyCalculatorAllData";
  const allData = JSON.parse(localStorage.getItem(localStorageKey)) || {};
  const datalist = document.getElementById("usernameSuggestions");

  const usernames = new Set();

  for (const date in allData) {
    for (const user in allData[date]) {
      usernames.add(user);
    }
  }

  // Add suggestions to datalist
  datalist.innerHTML = "";
  usernames.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    datalist.appendChild(option);
  });
});


function getFormData() {
  return {
    n500: parseInt(document.getElementById("n500").value) || 0,
    n200: parseInt(document.getElementById("n200").value) || 0,
    n100: parseInt(document.getElementById("n100").value) || 0,
    n50: parseInt(document.getElementById("n50").value) || 0,
    n20: parseInt(document.getElementById("n20").value) || 0,
    n10: parseInt(document.getElementById("n10").value) || 0,
    n5: parseInt(document.getElementById("n5").value) || 0,
    c2: parseInt(document.getElementById("c2").value) || 0,
    c1: parseInt(document.getElementById("c1").value) || 0,
    ch5: parseInt(document.getElementById("ch5").value) || 0,
    ch1: parseInt(document.getElementById("ch1").value) || 0,
    includeChoco: document.getElementById("includeChoco").checked,
    notes: document.getElementById("notes").value,
    timestamp: new Date().toISOString()
  };
}

function saveData() {
  const date = getSelectedDate();
  const user = getUserName();

  if (!user) {
    alert("❌ Please enter a user name.");
    return;
  }

  const data = getFormData();
  let allData = JSON.parse(localStorage.getItem("moneyCalculatorAllData")) || {};

  if (!allData[date]) {
    allData[date] = {};
  }

  allData[date][user] = data;

  localStorage.setItem("moneyCalculatorAllData", JSON.stringify(allData));
  document.getElementById("output").innerHTML =
    `<div class="success">✅ Data saved for ${user} on ${date}!</div>`;
}

function loadData() {
  const date = getSelectedDate();
  const user = getUserName();

  if (!user) {
    alert("❌ Please enter a user name.");
    return;
  }

  const allData = JSON.parse(localStorage.getItem("moneyCalculatorAllData")) || {};
  const dayData = allData[date] || {};
  const data = dayData[user];

  if (!data) {
    document.getElementById("output").innerHTML =
      `<div class="error">❌ No data found for ${user} on ${date}</div>`;
    return;
  }

  document.getElementById("n500").value = data.n500;
  document.getElementById("n200").value = data.n200;
  document.getElementById("n100").value = data.n100;
  document.getElementById("n50").value = data.n50;
  document.getElementById("n20").value = data.n20;
  document.getElementById("n10").value = data.n10;
  document.getElementById("n5").value = data.n5;
  document.getElementById("c2").value = data.c2;
  document.getElementById("c1").value = data.c1;
  document.getElementById("ch5").value = data.ch5;
  document.getElementById("ch1").value = data.ch1;
  document.getElementById("includeChoco").checked = data.includeChoco;
  document.getElementById("notes").value = data.notes || '';

  document.getElementById("output").innerHTML =
    `<div class="success">✅ Loaded data for ${user} on ${date}!</div>`;
  total();
}
window.onload = function () {
  document.getElementById("datePicker").value = new Date().toISOString().split('T')[0];
  total();
  updateMembershipCount();
};


function downloadCSV() {
  const data = getFormData();

  if (!window.lastUsedBreakdown) {
    alert("❌ Please click 'Breakdown ₹3100' before downloading!");
    return;
  }

  const used = window.lastUsedBreakdown || {};
  const remaining = window.lastRemainingBreakdown || {};

  // Start CSV content
  let csv = "Denomination,Count,Value\n";

  const denominations = [
    { id: 'n500', name: '₹500 Notes', value: 500 },
    { id: 'n200', name: '₹200 Notes', value: 200 },
    { id: 'n100', name: '₹100 Notes', value: 100 },
    { id: 'n50',  name: '₹50 Notes',  value: 50 },
    { id: 'n20',  name: '₹20 Notes',  value: 20 },
    { id: 'n10',  name: '₹10 Notes',  value: 10 },
    { id: 'n5',   name: '₹5 Notes',   value: 5 },
    { id: 'c2',   name: '₹2 Coins',   value: 2 },
    { id: 'c1',   name: '₹1 Coins',   value: 1 },
    { id: 'ch5',  name: '₹5 Chocolates', value: 5 },
    { id: 'ch1',  name: '₹1 Chocolates', value: 1 }
  ];

  let totalEntered = 0;
  for (const denom of denominations) {
    const count = data[denom.id];
    if (count > 0) {
      const amount = count * denom.value;
      totalEntered += amount;
      csv += `${denom.name},${count},${amount}\n`;
    }
  }

  csv += `\nTotal Entered,,${totalEntered}\n`;

  // Used Breakdown
  csv += `\n🧾 Used for ₹3100:\nDenomination,Count,Value\n`;
  let usedTotal = 0;
  for (const id in used) {
    const denom = denominations.find(d => d.id === `n${id}` || d.id === `c${id}` || d.id === `ch${id}` || d.id === id);
    const count = used[id];
    if (denom) {
      const value = count * denom.value;
      usedTotal += value;
      csv += `${denom.name},${count},${value}\n`;
    }
  }
  csv += `Used Total,,${usedTotal}\n`;

  // Remaining Breakdown
  csv += `\n💰 Remaining:\nDenomination,Count,Value\n`;
  let remTotal = 0;
  for (const id in remaining) {
    const denom = denominations.find(d => d.id === `n${id}` || d.id === `c${id}` || d.id === `ch${id}` || d.id === id);
    const count = remaining[id];
    if (denom) {
      const value = count * denom.value;
      remTotal += value;
      csv += `${denom.name},${count},${value}\n`;
    }
  }
  csv += `Remaining Total,,${remTotal}\n`;

  // Notes and timestamp
  csv += `\nNotes,"${data.notes.replace(/"/g, '""')}"\n`;
  csv += `Date,${new Date().toLocaleString('en-IN', { hour12: true })}\n`;

  // Download
 const now = new Date();
const formattedDateTime = now.toLocaleString('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).replace(/[/,: ]/g, '-'); // Makes it filename-safe

const filename = `money_calculator_${formattedDateTime}.csv`;
downloadFile(csv, filename, 'text/csv');

}
function downloadFile(content, filename, type) {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



function calculateTotal(data) {
  let totalAmount =
    500 * data.n500 +
    200 * data.n200 +
    100 * data.n100 +
    50 * data.n50 +
    20 * data.n20 +
    10 * data.n10 +
    5 * data.n5 +
    2 * data.c2 +
    1 * data.c1;

  if (data.includeChoco) {
    totalAmount += 5 * data.ch5 + 1 * data.ch1;
  }

  return totalAmount;
}

function total() {
  const data = getFormData();
  const totalAmount = calculateTotal(data);

  let resultText = `<div class="success">✅ Total Amount: ₹${totalAmount}</div>`;
  resultText += data.includeChoco ?
    `<div class="breakdown">🍫 Chocolates Included</div>` :
    `<div class="breakdown">❌ Chocolates Not Included</div>`;

  if (data.notes) {
    resultText += `<div class="breakdown">📝 Notes: ${data.notes}</div>`;
  }

  document.getElementById("totalAmountOutput").innerHTML = resultText;
}

function changeValue(id, delta) {
  const input = document.getElementById(id);
  const current = parseInt(input.value) || 0;
  const min = parseInt(input.min) || 0;
  const newVal = Math.max(current + delta, min);
  input.value = newVal;
  input.dispatchEvent(new Event('input')); // To trigger live calculation
}
function calculateBreakdown() {
 setTimeout(() => {
  const available = {
    500: parseInt(document.getElementById("n500").value) || 0,
    200: parseInt(document.getElementById("n200").value) || 0,
    100: parseInt(document.getElementById("n100").value) || 0,
    50: parseInt(document.getElementById("n50").value) || 0,
    20: parseInt(document.getElementById("n20").value) || 0,
    10: parseInt(document.getElementById("n10").value) || 0,
    5: parseInt(document.getElementById("n5").value) || 0,
    2: parseInt(document.getElementById("c2").value) || 0,
    1: parseInt(document.getElementById("c1").value) || 0,
    ch5: parseInt(document.getElementById("ch5").value) || 0,
    ch1: parseInt(document.getElementById("ch1").value) || 0
  };

  const useChoco = document.getElementById("includeChoco").checked;
  const target = 3100;
  let remaining = target;
  const used = {};

  const denominations = [
    { type: 'coin', value: 1, id: '1' },
    { type: 'coin', value: 2, id: '2' },
    { type: 'note', value: 5, id: '5' },
    { type: 'note', value: 10, id: '10' },
    { type: 'note', value: 20, id: '20' },
    { type: 'note', value: 50, id: '50' },
    { type: 'note', value: 100, id: '100' },
    { type: 'note', value: 200, id: '200' },
    { type: 'note', value: 500, id: '500' }
  ];

  if (useChoco) {
    denominations.push({ type: 'chocolate', value: 5, id: 'ch5' });
    denominations.push({ type: 'chocolate', value: 1, id: 'ch1' });
  }

  // Step 1: Smallest first
  denominations.sort((a, b) => a.value - b.value);
  for (const denom of denominations) {
    if (remaining <= 0) break;
    const maxPossible = Math.min(Math.floor(remaining / denom.value), available[denom.id]);
    if (maxPossible > 0) {
      used[denom.id] = maxPossible;
      remaining -= maxPossible * denom.value;
    }
  }

  // Step 2: Fill remaining with big notes if possible
  if (remaining > 0) {
    denominations.sort((a, b) => b.value - a.value);
    for (const denom of denominations) {
      if (remaining <= 0) break;
      const availableCount = available[denom.id] - (used[denom.id] || 0);
      const needed = Math.ceil(remaining / denom.value);
      const add = Math.min(needed, availableCount);
      if (add > 0) {
        used[denom.id] = (used[denom.id] || 0) + add;
        remaining -= add * denom.value;
      }
    }
  }

  // Calculate total used
  let total = 0;
  for (const id in used) {
    const val = (id === 'ch5') ? 5 : (id === 'ch1') ? 1 : parseInt(id);
    total += used[id] * val;
  }

  // Store used and remaining for export
window.lastUsedBreakdown = used;
window.lastRemainingBreakdown = {};

for (const denom of Object.keys(available)) {
  const remainingCount = available[denom] - (used[denom] || 0);
  if (remainingCount > 0) {
    window.lastRemainingBreakdown[denom] = remainingCount;
  }
}


  // Try to reduce excess
  if (total > 3200) {
    let excess = total - 3100;
    const reduceOrder = [
      { id: '500', value: 500 },
      { id: '200', value: 200 },
      { id: '100', value: 100 },
      { id: '50', value: 50 },
      { id: '20', value: 20 },
      { id: '10', value: 10 },
      { id: '5', value: 5 },
      { id: '2', value: 2 },
      { id: '1', value: 1 },
      { id: 'ch5', value: 5 },
      { id: 'ch1', value: 1 }
    ];
    for (const denom of reduceOrder) {
      while (used[denom.id] > 0 && total - denom.value >= 3100) {
        used[denom.id] -= 1;
        total -= denom.value;
        excess -= denom.value;
      }
      if (total <= 3125) break;
    }
  }

  // Step 3: Create breakdown HTML
  let breakdownHTML = '<div class="breakdown"><strong>🧾 Used :</strong>';
  const displayOrder = [
    { id: '500', name: '₹500' },
    { id: '200', name: '₹200' },
    { id: '100', name: '₹100' },
    { id: '50', name: '₹50' },
    { id: '20', name: '₹20' },
    { id: '10', name: '₹10' },
    { id: '5', name: '₹5' },
    { id: '2', name: '₹2' },
    { id: '1', name: '₹1' },
    { id: 'ch5', name: '₹5 Chocolate' },
    { id: 'ch1', name: '₹1 Chocolate' }
  ];

  for (const denom of displayOrder) {
    if (used[denom.id] > 0) {
      const value = denom.id === 'ch5' ? 5 : denom.id === 'ch1' ? 1 : parseInt(denom.id);
      const count = used[denom.id];
      const amount = count * value;
      breakdownHTML += `
        <div class="denomination">
          <span>${denom.name} × ${count}</span>
          <span>= ₹${amount}</span>
        </div>`;
    }
  }
  breakdownHTML += `</div><div class="total">Total: ₹${total}</div>`;

  // Step 4: Remaining HTML
  let remainingHTML = '<div class="breakdown"><strong>💰 Remaining:</strong>';
  for (const denom of displayOrder) {
    const totalAvailable = available[denom.id] || 0;
    const usedCount = used[denom.id] || 0;
    const remainCount = totalAvailable - usedCount;
    if (remainCount > 0) {
      const value = denom.id === 'ch5' ? 5 : denom.id === 'ch1' ? 1 : parseInt(denom.id);
      let amount = remainCount * value;
      
      remainingHTML += `
        <div class="denomination">
          <span>${denom.name} × ${remainCount}</span>
          <span>= ₹${amount}</span>
        </div>`;
    }
  }
  remainingHTML += '</div>';

  const resultBox = document.getElementById("output");

  if (remaining === 0 || (total >= 3100 && total <= 3200)) {
    resultBox.innerHTML = `
      <div class="success">✅ ₹${total} (within acceptable range of ₹3100–₹3050)</div>
      ${breakdownHTML}
      ${remainingHTML}`;
  } else {
    resultBox.innerHTML = `
      <div class="error">❌ Cannot reach ₹3100. Maximum possible: ₹${total}</div>
      ${breakdownHTML}
      ${remainingHTML}`;
  }
  }, 300);
}




function resetToZero() {
  const fields = [
    "n500", "n200", "n100", "n50", "n20", "n10",
    "n5", "c2", "c1", "ch5", "ch1"
  ];
  fields.forEach(id => document.getElementById(id).value = 0);

  document.getElementById("includeChoco").checked = true;
  document.getElementById("notes").value = "";

  total(); // Recalculate total
}

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");
  const userParam = params.get("user");

  if (dateParam && userParam) {
    // Fill the date and user fields
    document.getElementById("date").value = dateParam;
    document.getElementById("user").value = userParam;

    // Now load the saved data for that date and user
    if (typeof loadData === "function") {
      loadData();
    }
  }
};
