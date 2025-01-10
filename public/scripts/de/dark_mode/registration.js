//For successful functioning of the sign-up-form

const playerName = document.querySelector('#name');
const phoneNumber = document.querySelector('#phone-number');
const email = document.querySelector('#email');
const confirmation = document.querySelector('#confirmation');
const btnStart = document.querySelector('.btn-start');
const modalWindow = document.querySelector('.modal-window');
const boxForErrors = document.querySelector('.for-errors');
const closeBtn = document.querySelector('.close');
const btnBack = document.querySelector('.btn-back');

const newPlayer = {};
let errors = [];

function handlingFirstErrors(errors) {
    errors.forEach((err) => {
        const anotherError = document.createElement('p');
        anotherError.textContent = err;
        boxForErrors.appendChild(anotherError);
    })
    closeBtn.onclick = () => {
        while(errors.length) {
            errors.pop();
        }
        while(boxForErrors.firstChild) {
            boxForErrors.removeChild(boxForErrors.firstChild);
        }
        modalWindow.style.display = 'none';
    }
    btnBack.onclick = () => {
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
    return await fetch('http://localhost:3000/game/de/registration/newUser', {
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
        errors.push('Feld NAME ist erforderlich!');
    }   
    if (phoneNumber.value) {
        newPlayer.phoneNumber = phoneNumber.value;
    }
    if (email.value) {
        newPlayer.email = email.value;
    } else {
        errors.push('Feld E-MAIL ist erforderlich!');
    }
    if (confirmation.checked) {
        newPlayer.agreement = true;
    } else {
        errors.push('Deine EINWILLIGUNG muss bestätigt werden!');
    }
    
    if (errors.length > 0) {
        handlingFirstErrors(errors);
    } else {
        const response = await sendData(newPlayer);
        if (response.status === 200) {
            window.location.href = response.url;
        } else {
            const result = await response.json();
            const errorData = result.errors;
            let errArr = [];
            for(let i = 0; i < errorData.length; i++) {
                errArr.push(errorData[i].msg);
            }
            handlingFirstErrors(errArr);
        }
    }
    
}


window.addEventListener("DOMContentLoaded", () => {
    btnStart.addEventListener('click', collectData);
});



