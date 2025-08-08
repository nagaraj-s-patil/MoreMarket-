    function generateBarcode(code) {
      // Instead of generating a barcode, we'll just display the code number
      const card = event.currentTarget;
      const codeDisplay = card.querySelector('.code-display');

      if (!codeDisplay) {
        // Create code display element if it doesn't exist
        const p = document.createElement('p');
        p.className = 'code-display';
        p.textContent = code;
        card.appendChild(p);
      } else {
        // Toggle code display
        codeDisplay.style.display = codeDisplay.style.display === 'none' ? 'block' : 'none';
      }
    }

    const cards = document.querySelectorAll('.card');
    let lastSelected = null;

    cards.forEach(card => {
      card.addEventListener('click', function () {
        if (lastSelected) {
          lastSelected.classList.remove('selected');
        }
        this.classList.add('selected');
        lastSelected = this;
      });
    });

    function searchItems() {
      const input = document.getElementById('searchInput');
      const filter = input.value.toUpperCase();
      const cards = document.querySelectorAll('.card p:first-of-type'); // Only search the item name

      cards.forEach(card => {
        const text = card.textContent || card.innerText;
        const cardParent = card.parentElement;
        if (text.toUpperCase().indexOf(filter) > -1) {
          cardParent.style.display = "";
        } else {
          cardParent.style.display = "none";
        }
      });
    }

    function calculateDiscount() {
      const amount = parseFloat(document.getElementById('amount').value);
      const discount = 5;
      const resultBox = document.getElementById('result');

      if (isNaN(amount) || isNaN(discount)) {
        resultBox.innerHTML = "❌ Please enter valid numbers.";
        return;
      }

      const discountValue = (amount * discount) / 100;
      const finalPrice = amount - discountValue;

      resultBox.innerHTML = `
        🔻 Amount next youer more account: ₹${discountValue.toFixed(2)} <br>
        
      `;
    }
