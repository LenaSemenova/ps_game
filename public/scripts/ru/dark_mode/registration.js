//For successful functioning of the sign-up-form

const playerName = document.querySelector('#name');
const phoneNumber = document.querySelector('#phone-number');
const email = document.querySelector('#email');
const confirmation = document.querySelector('#confirmation');
const btnStart = document.querySelector('.btn-start');

let newPlayer = {};
let errors = [];

async function sendData(data) {
    console.log('Router is called!');
    console.log(data);
    return await fetch('http://localhost:3000/game/ru/registration/newUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
}

async function collectData (event) {
    event.preventDefault();
    if (playerName.value) {
        newPlayer.playerName = playerName.value;
    } else {
        errors.push('* Поле ИМЯ необходимо заполнить!');
    }   
    if (phoneNumber.value) {
        newPlayer.phoneNumber = phoneNumber.value;
    }
    if (email.value) {
        newPlayer.email = email.value;
    } else {
        errors.push('* Поле ЭЛЕКТРОННАЯ ПОЧТА необходимо заполнить!');
    }
    if (confirmation.checked) {
        newPlayer.agreement = true;
    } else {
        errors.push('* СОГЛАСИЕ на обработку персональных данных обязательно!')
    }
    
    if (errors.length > 0) {
        console.log(errors);
        alert(errors.join('\n'));
        errors = [];
    } else {
        const response = await sendData(newPlayer);
        if (response.status === 200) {
            window.location.href = response.url;
        }
    }
    
}


window.addEventListener("DOMContentLoaded", () => {
    btnStart.addEventListener('click', collectData);
});



