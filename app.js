import express from "express";
import { json, urlencoded } from "express";
import { Router } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();
const PORT = 3000;
const router = new Router();

//reaching to the directory named 'public'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

//settings for ejs-templates
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

//additional settings
app.use(json());
app.use(urlencoded({ extended : true}));
app.use(cors());

//connection with the database

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_game'
});

const DB_Model = {
    isRegistered : async (player_data) => {
        const [result] = await connectionPool.query('SELECT * FROM players WHERE email = ?',
            [player_data]);
            return result;
    },
    getRegistered: async (player_data) => {
        const [result] = await connectionPool.query('INSERT INTO players (name, phone_number, email, total_questions, right_answers, agreement) VALUES(?, ?, ?, ?, ?, ?)',
            [player_data.name, player_data.phone_number, player_data.email, player_data.total_questions, player_data.right_answers, player_data.agreement]);
            console.log(result.insertId);
            return result.insertId;
    },
    getInfos: async (player_id) => {
        const [result] = await connectionPool.query('SELECT * FROM players WHERE player_id = ?',
            [player_id]);
        return result;
    },
    getQuestion: async(index) => {
        const [result] = await connectionPool.query('SELECT * FROM questions WHERE question_id = ?', 
            [index]);
            return result;
    },
    updateScore: async(total_questions, right_answers, player_id) => {
        const [result] = await connectionPool.query('UPDATE players SET total_questions = ?, right_answers = ? WHERE player_id = ?',
            [total_questions, right_answers, player_id]);
        return result;
    }
}
// redirecting the main router
app.use('/game', router);

app.get('/', (req, res) => {
   res.redirect('/game');
})
// describing controllers
const mainPage = (req, res) => {
    res.render('ru/dark_mode/start');
}
const mainPage_EN = (req, res) => {
    res.render('en/dark_mode/start');
}
const mainPage_DE = (req, res) => {
    res.render('de/dark_mode/start');
}
const registrationPage = (req, res) => {
    res.render('ru/dark_mode/registration');
}
const registrationPage_EN = (req, res) => {
    res.render('en/dark_mode/registration');
}
const registrationPage_DE = (req, res) => {
    res.render('de/dark_mode/registration');
}

const addNewPlayer = async(req, res) => {
    let newPlayer = {};
    let playerID; 
    console.log('Check if this email is already in the database');
    const data = req.body;
    console.log(data);
    console.log(data.email);
    const isRegistered = await DB_Model.isRegistered(data.email);
    console.log(isRegistered);
    if(isRegistered.length === 0) {
        newPlayer.name = data.playerName;
        if (!data.phoneNumber) {
            newPlayer.phone_number = null;
        }
        newPlayer.email = data.email;
        newPlayer.total_questions = 0;
        newPlayer.right_answers = 0;
        newPlayer.agreement = data.agreement;
        playerID = await DB_Model.getRegistered(newPlayer);
        return res.redirect(`/game/questions/${playerID}`);
    } else {
        console.log('You are already registered!');
    }
    
}

//const renderQuestions = async (req, res) => {
//
//}

const newQuestion = async(req, res) => {
    console.log('GET request to the database!');
    const playerID = req.params.player_id;
    console.log(playerID);
    try {
        const player_data = await DB_Model.getInfos(playerID);
        console.log(player_data);
        let randomIndex = Math.floor(Math.random() * 20 + 1);
        const question = await DB_Model.getQuestion(randomIndex);
        console.log(question);
        return res.render('ru/dark_mode/questions', {question, player_data}); 
    } catch (error) {
        console.log('You have to deal with: ' + error);
        return res.status(500).json({errorMessage: 'No data has been given!'});
    }
}

const buildFeedback = async(req, res) => {
    console.log('Router to build feedback is called!');
    const data = req.body;
    console.log(data);
    let guess;
    if (data.guess === 'true') {
        guess = 1;
    } else {
        guess = 0;
    }
    console.log(guess);
    const playerID = req.params.player_id;
    const questionID = req.params.question_id;
    const question = await DB_Model.getQuestion(questionID);
    const playerInfo = await DB_Model.getInfos(playerID);
    let playerTotalScore = playerInfo[0].total_questions;
    let playerRightScore = playerInfo[0].right_answers;
    if (question[0].company_exists === guess) {
        console.log('You are right!');
        playerTotalScore = playerTotalScore + 1;
        playerRightScore = playerRightScore + 1;
        const result = await DB_Model.updateScore(playerTotalScore, playerRightScore, playerInfo[0].player_id);
        if (result.affectedRows !== 0) {
            const newPlayerInfo = await DB_Model.getInfos(playerID);
            return res.render('ru/dark_mode/feedback', {question, newPlayerInfo});
        }
    } else {
        console.log('You are false!');
        playerTotalScore = playerTotalScore + 1;
        const result = await DB_Model.updateScore(playerTotalScore, playerRightScore, playerInfo[0].player_id);
        if (result.affectedRows !== 0) {
            const newPlayerInfo = await DB_Model.getInfos(playerID);
            return res.render('ru/dark_mode/feedback', {question, newPlayerInfo});
        }
    }
}

router.get('/', mainPage);
router.get('/en', mainPage_EN);
router.get('/de', mainPage_DE);
router.get('/registration', registrationPage);
router.get('/registration/en', registrationPage_EN);
router.get('/registration/de', registrationPage_DE);
router.post('/registration/newUser', addNewPlayer);
router.get('/questions/:player_id', newQuestion);
router.post('/questions/:player_id/:question_id/feedback', buildFeedback);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
