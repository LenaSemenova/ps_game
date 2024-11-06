const btnTrue = document.querySelector('.btn-true');
const btnFalse = document.querySelector('.btn-false');

function getValue (event) {
    event.preventDefault();
    console.log(event.target.value);
}

window.addEventListener('DOMContentLoaded', () => {
    btnTrue.addEventListener('click', getValue);
    btnFalse.addEventListener('click', getValue);
})