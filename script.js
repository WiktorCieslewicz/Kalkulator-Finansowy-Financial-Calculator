
const VAT_RATE = 0.23;

document.getElementById('loanForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const priceInput = parseFloat(document.getElementById('priceInput').value);
  const downPayment = parseFloat(document.getElementById('downPayment').value);
  const interest = parseFloat(document.getElementById('interest').value);
  const months = parseInt(document.getElementById('months').value);
  const priceType = document.querySelector('input[name="priceType"]:checked').value;

  if (
    isNaN(priceInput) || isNaN(downPayment) || isNaN(interest) || isNaN(months) ||
    priceInput <= 0 || downPayment < 0 || interest < 0 || months <= 0
  ) {
    document.getElementById('result').innerText = 'Proszę wprowadzić poprawne dane.';
    return;
  }

  let nettoPrice, bruttoPrice;
  if (priceType === 'netto') {
    nettoPrice = priceInput;
    bruttoPrice = priceInput * (1 + VAT_RATE);
  } else {
    bruttoPrice = priceInput;
    nettoPrice = priceInput / (1 + VAT_RATE);
  }

  if (downPayment > bruttoPrice) {
    document.getElementById('result').innerText = 'Wpłata własna nie może być większa niż cena brutto zakupu!';
    return;
  }

  const loanAmount = bruttoPrice - downPayment;
  if (loanAmount <= 0) {
    document.getElementById('result').innerHTML = `
      <p>Kredyt nie jest potrzebny – wpłata własna pokrywa całość zakupu!</p>
      <p>Cena brutto: <strong>${bruttoPrice.toFixed(2)} zł</strong></p>
    `;
    return;
  }

  const monthlyRate = interest / 100 / 12;
  let monthlyPayment;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / months;
  } else {
    const pow = Math.pow(1 + monthlyRate, months);
    monthlyPayment = (loanAmount * monthlyRate * pow) / (pow - 1);
  }

  document.getElementById('result').innerHTML = `
    <p>Cena netto: <strong>${nettoPrice.toFixed(2)} zł</strong></p>
    <p>Cena brutto: <strong>${bruttoPrice.toFixed(2)} zł</strong></p>
    <p>Kwota kredytu (brutto − wpłata): <strong>${loanAmount.toFixed(2)} zł</strong></p>
    <p>Miesięczna rata: <strong>${monthlyPayment.toFixed(2)} zł</strong></p>
  `;

});
