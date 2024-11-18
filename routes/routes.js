import express from "express";
import { Router } from "express";
import controllers from "../controllers/controllers.js";

const router = new Router();

router.get('/', controllers.startRedirect);
router.get('/:lang', controllers.mainPageLang);
router.get('/light-mode/:lang', controllers.lightModeMainPage);
router.get('/:lang/registration', controllers.registrationPage);
router.get('/light-mode/:lang/registration', controllers.lightModeRegistrationPage);
router.post('/:lang/registration/newUser', controllers.addNewPlayer);
router.post('/light-mode/:lang/registration/newUser', controllers.lightModeAddNewPlayer);
router.get('/:lang/questions/:player_id', controllers.newQuestion);
router.get('/light-mode/:lang/questions/:player_id', controllers.lightModeNewQuestion);
router.post('/:lang/questions/:player_id/:question_id/feedback', controllers.buildFeedback);
router.post('/light-mode/:lang/questions/:player_id/:question_id/feedback', controllers.lightModeBuildFeedback);
router.get('/:lang/:player_id/final_result', controllers.renderFinalResult);
router.get('/light-mode/:lang/:player_id/final_result', controllers.lightModeRenderFinalResult);

export default router