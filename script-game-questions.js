/*
//For stylesheets
import "./style-dm-questions.css"

// DOM ELEMENTS
const productName = document.querySelector('.dm-q-product-name');
const productLogo = document.querySelector('.dm-q-product-pic');
const productDescription = document.querySelector('.dm-q-product-description');
const boxForCurrent = document.querySelector('.dm-q-current-question');
const btnTrue = document.querySelector('.dm-q-btn-true');
const btnFalse = document.querySelector('.dm-q-btn-false');

//URLS
const currentUrl = window.location.href;
const port = currentUrl.split(':')[2].split('/')[0];
const urlParams = new URLSearchParams(window.location.search);
const correctOnesBack = urlParams.get('correctOnesBack');

let correctOnes = 0;

if (correctOnesBack > correctOnes) {
    correctOnes = correctOnesBack;
}

let item;

function rndNmbr() {
    return Math.floor((Math.random() * 20) + 1);
}

function getQuestionID () {
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
            reject(`We have an error: ${error}.`)
        })
    })
}

async function checkQuestionID (number) {
    const allIDs = await getQuestionID();
    let questionIDs = [];
    for (let i=0; i<allIDs.length; i++) {
        questionIDs.push(allIDs[i].question_id)
    }
    return questionIDs.includes(number);
}
async function brandNewID () {
    let newNumber = rndNmbr();

    while (await checkQuestionID(newNumber)) {
        newNumber = rndNmbr();
    }
    return newNumber;
}
async function pushID(data) {
    return await fetch('http://127.0.0.1:8000/questions/api/used/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
}

async function getQuestions () {
    let toBePushed = {
        question_id: "",
    }
    const questionID = await brandNewID();
    toBePushed.question_id = questionID;
    const response = await pushID(toBePushed);
    if (response.status === 201) {
    }
    return new Promise((resolve, reject) => {
        fetch(`http://127.0.0.1:8000/questions/api/${questionID}/`)
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
async function formQuestion () {
    try {
        const result = await getQuestions();
        item = result;
        productName.textContent = item.title;
        productLogo.src = item.image;
        productLogo.alt = item.title;
        productDescription.textContent = item.question;
        
        if (btnTrue) {
            btnTrue.onclick = () => {
                if (item.is_true === true) {
                    correctOnes++; 
                    window.location.href= `http://localhost:${port}/dark-mode-right.html?correctOnes=${correctOnes}`;
                } else {
                    window.location.href= `http://localhost:${port}/dark-mode-false.html?correctOnes=${correctOnes}`; 
                }
            }
        }
        if (btnFalse) {
            btnFalse.onclick = () => {
                if (item.is_true === false) {
                    correctOnes++;  
                    window.location.href= `http://localhost:${port}/dark-mode-right.html?correctOnes=${correctOnes}`;
                } else {
                    window.location.href= `http://localhost:${port}/dark-mode-false.html?correctOnes=${correctOnes}`;
                }
            }
        }

    } catch(error) {
        console.log(error);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    formQuestion();
})
*/
/*
const btnTrue = document.querySelector('.btn-true');
const btnFalse = document.querySelector('.btn-false');
const img = document.querySelector('img');
let imgs = [
    'ranorex.png',
    'telerik.png',
    'progress.png',
    'outsystems.png',
    'puppet_enterprise.png',
    'micro_focus.png',
    'axure.png',
    'jenkins_x.png',
    'jfrog_a.png',
    'data_mind.png',
    'robo_chef.png',
    'mind_mapper.png',
    'genie_code.png',
    'infinity_drive.png'
]



let intervalID;
let arr_intervalID;

function useImgs () {
        let randomIndex = Math.floor(Math.random() * 14);
        console.log(randomIndex);
        img.src=`./public/logos/${imgs[randomIndex]}`;
    }

function startChange() {
    if(!intervalID) {
        intervalID = setInterval(useImgs, 1000);
    }
}

startChange();


img.onclick = () => {
    console.log(img.src);
}
btnTrue.onclick = (e) => {
    console.log(btnTrue.value);
}
btnFalse.onclick = (e) => {
    console.log(btnFalse.value);
}
*/

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