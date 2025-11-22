# 🛒 Smart Mart Utility Web App

A lightweight, fast, and mobile-friendly utility dashboard for mart owners.
The app includes product navigation, product verification, discount calculation, and a powerful cash-counter calculator.

---

## 🚀 Features

### **1️⃣ Jump-To Product Navigation**

Quickly jump to any product category with one click:

* 🍎 Apples
* 🍌 Bananas
* 🥭 Mangoes
* 🥒 Vegetables
* 🧂 Remaining Items

Each button smoothly scrolls to the correct section.

---

### **2️⃣ Product Verification Panel**

Click any product card to view:

* Product Code
* Product Name
* Product Image
* Correct / Incorrect verification
  Useful for checking product accuracy during billing or inventory.

---

### **3️⃣ Discount Calculator (5% Auto-Apply)**

A dedicated discount section where users enter any amount.
The app automatically calculates:

```
Discount = 5%
Final Amount = Amount - Discount
```

**Example:**
₨100 → Discount: ₨5 → Final: ₨95

---

### **4️⃣ Money Notes & Coins Calculator**

Built for mart closing-time cash counting.
Supports:

* ₹500, ₹200, ₹100, ₹50, ₹20, ₹10
* ₹5, ₹2, ₹1 coins
* Optional chocolate coins (₹5, ₹1)

**Outputs:**

* Total Amount
* Mandatory ₹3100 Counter Setup
* Remaining Amount
* Prioritized change distribution (₹1 → ₹2 → ₹5 → higher notes)
* Save / Load daily data
* LocalStorage persistence

---

## 🧩 Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**
* **LocalStorage API**
* **Smooth Scroll Navigation**

---

## 📂 Project Structure

```
/project
│── index.html
│── style.css
│── script.js
└── assets/
      └── product-images/
```

---

## ⚙️ How It Works

### **Navigation**

Uses `scrollIntoView()` to reach any section instantly.

### **Discount**

Simple JS logic:

```js
let discount = amount * 0.05;
let final = amount - discount;
```

### **Money Calculator**

Counts total value and performs business-logic for counter setup (₹3100 rule).

---

## 📸 Screenshots

<img width="1861" height="861" alt="image" src="https://github.com/user-attachments/assets/55940a87-50e5-4d0d-85cb-e5fa5c3ce720" />
<img width="1868" height="180" alt="image" src="https://github.com/user-attachments/assets/a2d45645-539c-4471-8fdf-835177ac5544" />
<img width="432" height="856" alt="image" src="https://github.com/user-attachments/assets/c386ca86-8aef-4cd7-a647-53f2530fb406" />


---

## 🧑‍💻 Author

**Nagaraj S Patil**
Java Full Stack Developer
Bengaluru, India

---
