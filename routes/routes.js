import express from "express";
import { Router } from "express";
import controllers_dm from "../controllers/controllers_dm.js";
import controllers_lm from "../controllers/controllers_lm.js";

const router = new Router();

// CONTROLLERS - DARK MODE

router.get('/', controllers_dm.startRedirect);
router.get('/:lang', controllers_dm.dm_mainPage);
router.get('/:lang/registration', controllers_dm.dm_registrationPage);
router.post('/:lang/registration/newUser', controllers_dm.dm_addNewPlayer);
router.get('/:lang/questions/:player_id', controllers_dm.dm_newQuestion);
router.post('/:lang/questions/:player_id/:question_id/feedback', controllers_dm.dm_buildFeedback);
router.get('/:lang/:player_id/final_result', controllers_dm.dm_finalResult);


// CONTROLLERS - LIGHT MODE

router.get('/light-mode/:lang', controllers_lm.lm_mainPage);
router.get('/light-mode/:lang/registration', controllers_lm.lm_registrationPage);
router.post('/light-mode/:lang/registration/newUser', controllers_lm.lm_addNewPlayer);
router.get('/light-mode/:lang/questions/:player_id', controllers_lm.lm_newQuestion);
router.post('/light-mode/:lang/questions/:player_id/:question_id/feedback', controllers_lm.lm_buildFeedback);
router.get('/light-mode/:lang/:player_id/final_result', controllers_lm.lm_finalResult);


export default router