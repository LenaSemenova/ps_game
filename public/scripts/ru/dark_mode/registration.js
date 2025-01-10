//For successful functioning of the sign-up-form

const playerName = document.querySelector('#name');
const phoneNumber = document.querySelector('#phone-number');
const email = document.querySelector('#email');
const confirmation = document.querySelector('#confirmation');
const btnStart = document.querySelector('.btn-start');
const modalWindow = document.querySelector('.modal-window');
const boxForErrors = document.querySelector('.for-errors');
const btnBack = document.querySelector('.btn-back');
const closeBtn = document.querySelector('.close');

const newPlayer = {};
let errors = [];

function handlingFirstErrors (errors) {
    errors.forEach((err) => {
        const anotherError = document.createElement('p');
        anotherError.textContent = err;
        boxForErrors.appendChild(anotherError);
    })
    btnBack.onclick = () => {
        while(errors.length) {
            errors.pop();
        }
        while(boxForErrors.firstChild) {
            boxForErrors.removeChild(boxForErrors.firstChild);
        }
        modalWindow.style.display = 'none';
    }
    closeBtn.onclick = () => {
        while(errors.length) {
            errors.pop();
        }
        while(boxForErrors.firstChild) {
            boxForErrors.removeChild(boxForErrors.firstChild);
        }
        modalWindow.style.display = 'none';
    }
    modalWindow.style.display = 'flex';
}

async function sendData(data) {
    try {
    return await fetch('http://localhost:3000/game/ru/registration/newUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    } catch(error) {
        console.error('Occurred while fetching: ', error);
    }
}



async function collectData (event) {
    event.preventDefault();
    if (playerName.value) {
        newPlayer.playerName = playerName.value;
    } else {
        errors.push('Поле ИМЯ необходимо заполнить!');
    }   
    if (phoneNumber.value) {
        newPlayer.phoneNumber = phoneNumber.value;
    }
    if (email.value) {
        newPlayer.email = email.value;
    } else {
        errors.push('Поле ЭЛЕКТРОННАЯ ПОЧТА необходимо заполнить!');
    }
    if (confirmation.checked) {
        newPlayer.agreement = true;
    } else {
        errors.push('СОГЛАСИЕ на обработку персональных данных обязательно!')
    }
    
    if (errors.length > 0) {
        console.log(errors);
        handlingFirstErrors(errors);
    } else {
        const response = await sendData(newPlayer);
        if (response.status === 200) {
            window.location.href = response.url;
        }
        const result = await response.json();
        const errors = result.errors;
        let errorMessages = [];
        for (let i = 0; i < errors.length; i++) {
            errorMessages.push(errors[i].msg);
        }
        handlingFirstErrors(errorMessages);
    } 
}





window.addEventListener("DOMContentLoaded", () => {
    btnStart.addEventListener('click', collectData);
});



