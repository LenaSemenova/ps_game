import DB_GENERAL from "../db_model/db_general.js";
import updateInfos from "../db_model/db_while_playing.js";
import startGame from "../db_model/db_start.js";

// MAIN PAGE - DARK MODE - DIFFERENT LANGUAGES 
const startRedirect = (req, res) => {
    res.redirect('/game/ru');
}
const dm_mainPage = (req, res) => {
    const lang = req.params.lang;
    if (lang === 'ru') {
        res.render('ru/dark_mode/start');
    }
    if (lang === 'en') {
        res.render('en/dark_mode/start');
    }
    if (lang === 'de') {
        res.render('de/dark_mode/start');
    }
}

// RIGISTRATION - DARK MODE - DIFFERENT LANGUAGES

const dm_registrationPage = (req, res) => {
    const lang = req.params.lang;
    if (lang === 'ru') {
    res.render('ru/dark_mode/registration');
    }
    if (lang === 'en') {
        res.render('en/dark_mode/registration');
    }
    if (lang === 'de') {
        res.render('de/dark_mode/registration');
    }
}

// NEW PLAYER - DARK MODE - DIFFERENT LANGUAGES

const dm_addNewPlayer = async(req, res) => {
    let newPlayer = {};
    let playerID; 
    console.log('Check if this email is already in the database');
    const data = req.body;
    const lang = req.params.lang;
    try {
    const isRegistered = await DB_GENERAL.isRegistered(data.email);
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
        playerID = await startGame(newPlayer);
        return res.redirect(`/game/${lang}/questions/${playerID}`);
    } else {
        console.log(isRegistered.length);
        console.log(isRegistered[0].total_questions);
        if (isRegistered[0].total_questions < 6) {
            console.log(`Your questions: ${isRegistered[0].total_questions}`);
            playerID = isRegistered[0].player_id;
            return res.redirect(`/game/${lang}/questions/${playerID}`);
        } else {
            console.log(`Your questions: ${isRegistered[0].total_questions}`);
            playerID = isRegistered[0].player_id;
            return res.redirect(`/game/${lang}/${playerID}/final_result`);
        }
    }
    } catch (error) {
        console.log('Error while registration: ', error);
    }
}

// NEW QUESTION - DARK MODE - DIFFERENT LANGZUAGES

const dm_newQuestion = async(req, res) => {
    const playerID = req.params.player_id;
    const lang = req.params.lang;
    try {
        const player_data = await DB_GENERAL.aboutPlayer(playerID);
        console.log(player_data);
        const randomIndex = (availableQuestions) => {
            return Math.floor(Math.random() * availableQuestions);
        };
        const questions = await DB_GENERAL.availableQuestions(playerID);
        console.log(questions.length);
        let questionIndex = randomIndex(questions.length);
        console.log(questionIndex);
        const pulledQuestion = questions[questionIndex];
        console.log(pulledQuestion);
            if (lang === 'ru') { 
                return res.render('ru/dark_mode/questions', {pulledQuestion, player_data});
            }
            if (lang === 'en') {
                return res.render('en/dark_mode/questions', {pulledQuestion, player_data});
            }
            if (lang === 'de') {
                return res.render('de/dark_mode/questions', {pulledQuestion, player_data})
            }
    }  catch (error) {
        console.log('You have to deal with: ' + error);
        return res.status(500).json({errorMessage: 'No data has been given!'});
    }
}

// BUILD FEEDBACK - DARK MODE - DIFFERENT LANGUAGES

const dm_buildFeedback = async(req, res) => {

    // taking player's guess

    const data = req.body;
    let guess;
    if (data.guess === 'true') {
        guess = 1;
    } else {
        guess = 0;
    }

    // taking all the infos to render feedback


    const playerID = req.params.player_id;
    const playerInfo = await DB_GENERAL.aboutPlayer(playerID);
    const questionID = req.params.question_id;
    const question = await DB_GENERAL.getQuestion(questionID, playerID);
    const lang = req.params.lang;
    
    let playerTotalScore = playerInfo[0].total_questions;
    let playerRightScore = playerInfo[0].right_answers;

    if (question[0].company_exists === guess) {
        console.log('You are right!');
        playerTotalScore = playerTotalScore + 1;
        playerRightScore = playerRightScore + 1;
        const resultOfTransaction = await updateInfos(playerTotalScore, playerRightScore, playerID, questionID);
        if (resultOfTransaction === "ok") {
            const newPlayerInfo = await DB_GENERAL.aboutPlayer(playerID);
            if (lang === 'ru') { 
                return res.render('ru/dark_mode/feedback', {question, newPlayerInfo, guess});
            }
            if (lang === 'en') {
                return res.render('en/dark_mode/feedback', {question, newPlayerInfo, guess});
            }
            if (lang === 'de') {
                return res.render('de/dark_mode/feedback', {question, newPlayerInfo, guess});
            }
        }
    } else {
        console.log('You are false!');
        playerTotalScore = playerTotalScore + 1;
        const resultOfTransaction = await updateInfos(playerTotalScore, playerRightScore, playerID, questionID);
        if (resultOfTransaction) {
            const newPlayerInfo = await DB_GENERAL.aboutPlayer(playerID);
            if (lang === 'ru') { 
                return res.render('ru/dark_mode/feedback', {question, newPlayerInfo, guess});
            }
            if (lang === 'en') {
                return res.render('en/dark_mode/feedback', {question, newPlayerInfo, guess});
            }
            if (lang === 'de') {
                return res.render('de/dark_mode/feedback', {question, newPlayerInfo, guess});
            }
        }    
}
}

// FINAL RESULT - DARK MODE - DIFFERENT LANGUAGES

const dm_finalResult = async(req, res) => {
    const playerID = req.params.player_id;
    const lang = req.params.lang;
    try {
    const playerInfo = await DB_GENERAL.aboutPlayer(playerID);
    const isTable = await DB_GENERAL.isTable();
    console.log(isTable.length);
    for (let i = 0; i < isTable.length; i++) {
            console.log('Current table: ', isTable[i].Tables_in_petproject_game);
            if (isTable[i].Tables_in_petproject_game === `questions_for_${playerID}`) {
            console.log(`There is a table for ${playerInfo[0].name}`);
            const deleted = await DB_GENERAL.deleteCopies(playerID);
            console.log(deleted);
        }
    }
        if (lang === 'ru') { 
            return res.render('ru/dark_mode/final_result', { playerInfo });
        }
        if (lang === 'en') {
            return res.render('en/dark_mode/final_result', { playerInfo });
        }
        if (lang === 'de') {
            return res.render('de/dark_mode/final_result', { playerInfo });
        }
    } catch (error) {
        console.log(error);
    }
}


export default {
    startRedirect,
    dm_mainPage,
    dm_registrationPage,
    dm_addNewPlayer,
    dm_newQuestion,
    dm_buildFeedback,
    dm_finalResult
}