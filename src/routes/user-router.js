import express from 'express';
import { body } from 'express-validator';

import {
  addUser,
  userLogin,
  deleteUser,
  editUser,
  findUserById,
  getUsers
} from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();

// POST /api/users - käyttäjän lisääminen (rekisteröityminen)
userRouter
  .route('/')
  .post(
    body('kayttajanimi').trim().isLength({ min: 6, max: 20 }).isAlphanumeric(),
    body('salasana').trim().isLength({ min: 8, max: 50 }),
    body('kayttajarooli').isInt({ min: 1, max: 3 }),
    validationErrorHandler,
    addUser
  )
  .get(authenticateToken, getUsers); // GET /api/users - vain kirjautuneille

// Kirjautuminen
userRouter.route('/login').post(userLogin);

// GET /api/users/:id - yksittäinen käyttäjä
// PUT ja DELETE - editoi tai poista käyttäjä (vain oma käyttäjä tai admin)
userRouter
  .route('/:id')
  .get(authenticateToken, findUserById)
  .put(
    authenticateToken,
    body('kayttajanimi').optional().trim().isLength({ min: 6, max: 20 }).isAlphanumeric(),
    body('salasana').optional().trim().isLength({ min: 8, max: 50 }),
    validationErrorHandler,
    editUser
  )
  .delete(authenticateToken, deleteUser);

export default userRouter;
