import mysql from "mysql2/promise";

//connection with the database

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_game'
});

const connectionTransaction = await connectionPool.getConnection();

const DB_Model_Transactions = {
    updateScore: async(total_questions, right_answers, player_id) => {
        const [result] = await connectionTransaction.query('UPDATE players SET total_questions = ?, right_answers = ? WHERE player_id = ?',
            [total_questions, right_answers, player_id]);
        return result;
    },
    updateQuestionStatus: async(question_id) => {
        const [result] = await connectionTransaction.query('UPDATE questions SET question_used = 1 WHERE question_id = ?',
            [question_id]);
            return result;
    }
}

const updateInfos = async(total_questions, right_answers, player_id, question_id) => {
    try {
    await connectionTransaction.beginTransaction();
    const updatedQuestion = await DB_Model_Transactions.updateQuestionStatus(question_id);
    const updatedPlayersScore = await DB_Model_Transactions.updateScore(total_questions, right_answers, player_id);
    await connectionTransaction.commit();
    if (updatedQuestion.changedRows === 1 && updatedPlayersScore.changedRows === 1) {
        return "ok";
    }
} catch (error) {
    await connectionTransaction.rollback();
    console.log('Something went wrong', error);
} finally {
    connectionTransaction.release();
}
}

export default updateInfos;