import express from "express";
import { json, urlencoded } from "express";
import { Router } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import controllers from "./controllers/controllers.js";



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

router.get('/', mainPage);
router.get('/en', mainPage_EN);
router.get('/de', mainPage_DE);
router.get('/registration', registrationPage);
router.get('/registration/en', registrationPage_EN);
router.get('/registration/de', registrationPage_DE);
router.post('/registration/newUser', controllers.addNewPlayer);
router.get('/questions/:player_id', controllers.newQuestion);
router.post('/questions/:player_id/:question_id/feedback', controllers.buildFeedback);
router.get('/:player_id/final_result', controllers.renderFinalResult);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
