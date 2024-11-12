import DB_GENERAL from "../db_model/db_general.js";
import updateInfos from "../db_model/db_while_playing.js";
import startGame from "../db_model/db_start.js";

const addNewPlayer = async(req, res) => {
    let newPlayer = {};
    let playerID; 
    console.log('Check if this email is already in the database');
    const data = req.body;
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
        return res.redirect(`/game/questions/${playerID}`);
    } else {
        console.log(isRegistered.length);
        console.log(isRegistered[0].total_questions);
        if (isRegistered[0].total_questions < 6) {
            console.log(`Your questions: ${isRegistered[0].total_questions}`);
            playerID = isRegistered[0].player_id;
            return res.redirect(`/game/questions/${playerID}`);
        } else {
            console.log(`Your questions: ${isRegistered[0].total_questions}`);
            playerID = isRegistered[0].player_id;
            return res.redirect(`/game/${playerID}/final_result`);
        }
}
}

const newQuestion = async(req, res) => {
    const playerID = req.params.player_id;
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
        return res.render('ru/dark_mode/questions', {pulledQuestion, player_data}); 
    }  catch (error) {
        console.log('You have to deal with: ' + error);
        return res.status(500).json({errorMessage: 'No data has been given!'});
    }
}

const buildFeedback = async(req, res) => {

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
    
    let playerTotalScore = playerInfo[0].total_questions;
    let playerRightScore = playerInfo[0].right_answers;

    if (question[0].company_exists === guess) {
        console.log('You are right!');
        playerTotalScore = playerTotalScore + 1;
        playerRightScore = playerRightScore + 1;
        const resultOfTransaction = await updateInfos(playerTotalScore, playerRightScore, playerID, questionID);
        if (resultOfTransaction === "ok") {
            const newPlayerInfo = await DB_GENERAL.aboutPlayer(playerID);
            return res.render('ru/dark_mode/feedback', {question, newPlayerInfo, guess});
        }
    } else {
        console.log('You are false!');
        playerTotalScore = playerTotalScore + 1;
        const resultOfTransaction = await updateInfos(playerTotalScore, playerRightScore, playerID, questionID);
        if (resultOfTransaction) {
            const newPlayerInfo = await DB_GENERAL.aboutPlayer(playerID);
            return res.render('ru/dark_mode/feedback', {question, newPlayerInfo, guess});
        }    
}
}

const renderFinalResult = async(req, res) => {
    const playerID = req.params.player_id;
    const playerInfo = await DB_GENERAL.aboutPlayer(playerID);
    const deleted = await DB_GENERAL.deleteCopies(playerID);
    console.log(deleted);
    return res.render('ru/dark_mode/final_result', { playerInfo });
}

export default {addNewPlayer, newQuestion, buildFeedback, renderFinalResult}