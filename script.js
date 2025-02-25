// Luhn's Algorithm to validate credit card number
function luhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through the card number in reverse
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9; // Subtract 9 if the doubled number is greater than 9
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0; // If the sum is divisible by 10, it's valid
}

// Event listener for form submission
document.getElementById('credit-card-form').addEventListener('submit', function(event) {
    event.preventDefault();
    //
    console.log('Form submitted'); //
    
    let cardNumber = document.getElementById('card-number').value.trim();
    
    // Call backend API to validate
    console.log('Sending request with card Number:', cardNumber);
   fetch('http://localhost:3000/validate-card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardNumber: cardNumber })
    })
    .then(response => response.json())
    .then(data => {
        const result = document.getElementById('validation-result');
        if (data.valid) {
            result.textContent = 'Credit Card Number is valid.';
            result.style.color = 'green';
        } else {
            result.textContent = 'Invalid Credit Card Number.';
            result.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
