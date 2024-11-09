import mysql from "mysql2/promise";

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
    getQuestions: async() => {
        const [result] = await connectionPool.query('SELECT * FROM questions WHERE question_used = 0');
            return result;
    },
    getQuestion: async(index) => {
        const [result] = await connectionPool.query('SELECT * FROM questions WHERE question_id = ?',
            [index]);
            return result;
    }
}

export default DB_Model;