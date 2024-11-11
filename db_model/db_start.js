import mysql from "mysql2/promise";

//connection with the database

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_game'
});

const connectionTransaction = await connectionPool.getConnection();

const DB_START = {
    registerPlayer: async (player_data) => {
        const [result] = await connectionTransaction.query('INSERT INTO players (name, phone_number, email, total_questions, right_answers, agreement) VALUES(?, ?, ?, ?, ?, ?)',
            [player_data.name, player_data.phone_number, player_data.email, player_data.total_questions, player_data.right_answers, player_data.agreement]);
            console.log(result.insertId);
            return result.insertId;
    },
    copyQuestions: async(player_id) => {
        const [result] = await connectionTransaction.query(`CREATE TABLE questions_for_${player_id} AS SELECT * FROM questions`);
        return result;
    }
}

const startGame = async(player_data) => {
    try {
        await connectionTransaction.beginTransaction();
        const registeredPlayerID = await DB_START.registerPlayer(player_data);
        const copiedQuestions = await DB_START.copyQuestions(registeredPlayerID);
        console.log(registeredPlayerID);
        console.log(copiedQuestions);
        await connectionTransaction.commit();
        return registeredPlayerID;
    } catch (error) {
        await connectionTransaction.rollback();
        console.log('You have to deal with: ', error);
    } finally {
        connectionTransaction.release();
    }
}

export default startGame;