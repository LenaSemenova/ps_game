//For successful functioning of the sign-up-form

const playerName = document.querySelector('#name');
const phoneNumber = document.querySelector('#phone-number');
const email = document.querySelector('#email');
const confirmation = document.querySelector('#confirmation');
const btnStart = document.querySelector('.btn-start');

let newPlayer = {};
let errors = [];

/*async function sendData(data) {
    return await fetch('http://127.0.0.1:8000/users/api/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
}
*/



function collectData (event) {
    event.preventDefault();
    if (playerName.value) {
        newPlayer.playerName = playerName.value;
    } else {
        errors.push('* Feld NAME ist obligatorisch!');
    }   
    if (phoneNumber.value) {
        newPlayer.phoneNumber = 'none';
    }
    if (email.value) {
        newPlayer.email = email.value;
    } else {
        errors.push('* Feld E-MAIL ist obligatorisch!');
    }
    if (confirmation.checked) {
        newPlayer.agreement = true;
    } else {
        errors.push('* Deine EINWILLIGUNG muss bestätigt werden!')
    }
    
    if (errors.length > 0) {
        console.log(errors);
        alert(errors.join('\n'));
        errors = [];
    } else {
        console.log(newPlayer);
        setTimeout(() => {
            window.location.href='./1st_page.html';
        }, '2000');
    }
    
    //const response = await sendData(newPlayer);
    //if (response.status === 201) {
    //window.location.href = "./dark-mode-questions.html"; ??? redirect - server-side solution
    //}
}



window.addEventListener("DOMContentLoaded", () => {
    btnStart.addEventListener('click', collectData)
});



