/*
//For stylesheets

import "./style-dm-right.css"

//DOM ELEMENTS

const productNameExists = document.querySelector(".dm-r-result-subtitle");
const resultDescrip = document.querySelector(".dm-r-result-description");
const btnBack = document.querySelector(".dm-r-btn-back-to-game");

//URLS

const currentUrl = window.location.href;
const port = currentUrl.split(':')[2].split('/')[0];

const urlParams = new URLSearchParams(window.location.search);
const correctOnes = urlParams.get('correctOnes');

let correctOnesBack = 0;

if (correctOnes > correctOnesBack) {
    correctOnesBack = correctOnes;
}

//FUNCTIONS

function getQuestionsIDs () {
    return new Promise((resolve, reject) => {
        fetch(`http://127.0.0.1:8000/questions/api/used/`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error();
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(`We have an error: ${error}`);
        })
    })
}
async function currentQuestionID () {
    const data = await getQuestionsIDs();
    const number = data[data.length - 1].question_id;
    return number;
}
async function getCurrentQuestion () {
    const currentID = await currentQuestionID();
    return new Promise((resolve, reject) => {
        fetch(`http://127.0.0.1:8000/questions/api/${currentID}/`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error();
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(`We have an error: ${error}.`)
        })
    })
}

    async function formFeedback () {
        try {
            const result = await getCurrentQuestion();
            let item = result;
            resultDescrip.textContent = item.question;
            if (item.is_true === true) {
                productNameExists.textContent = `${item.title} СУЩЕСТВУЕТ`;
            } else {
                productNameExists.textContent = `${item.title} НЕ СУЩЕСТВУЕТ`;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function redirect () {
        const totalAmount = await getQuestionsIDs();
        if (totalAmount.length % 6 === 0) {
            if (btnBack) {
                btnBack.onclick = () => {
                    window.location.href=`http://localhost:${port}/dark-mode-result.html?correctOnesBack=${correctOnesBack}`;
                }
            }
            } else {
                if (btnBack) {
                    btnBack.onclick = () => {
                        window.location.href=`http://localhost:${port}/dark-mode-questions.html?correctOnesBack=${correctOnesBack}`;
                }
            }
        }
    }

window.addEventListener("DOMContentLoaded", () => {
        formFeedback();
        redirect();
})
*/

//Нужно будет добавить к company-title существует или не существует, иначе непонятно
const body = document.querySelector('body');
const titleGood = document.querySelector('.title-good');
const titleBad = document.querySelector('.title-bad');
const imgGood = document.querySelector('.image-good-wrapper');
const imgBad = document.querySelector('.image-bad-wrapper');
const container = document.querySelector('.container');

function toggleStyles () {
    if (container.classList.contains('container-right')) {
        container.classList.remove('container-right');
        container.classList.add('container-false');
        titleGood.style.display = 'none';
        titleBad.style.display = 'block';
        imgGood.style.display = 'none';
        imgBad.style.display = 'flex';
    } else {
        container.classList.remove('container-false');
        container.classList.add('container-right');
        titleGood.style.display = 'block';
        titleBad.style.display = 'none';
        imgGood.style.display = 'flex';
        imgBad.style.display = 'none';
    }
}

body.addEventListener('click', toggleStyles);