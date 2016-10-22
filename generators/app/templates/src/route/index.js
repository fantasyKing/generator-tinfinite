import express from 'express';
import controllers from '../controller';

const router = express.Router();

function middleware(req, res, next) {
  next();
}

async function handler(req, res) {
  const { model, action, params } = req.body;
  try {
    console.log('body = ', req.body);
    if (controllers[model] && controllers[model][action]) {
      const result = await controllers[model][action](params);
      res.send({ code: 1, result });
    } else {
      res.send({ code: 0, message: '100000006' });
    }
  } catch (e) {
    logger.error(`${model}'.'${action}'中发生错误：'`, e, e.stack);
    res.send({ code: 0, message: e.message });
  }
}

router.post('/', middleware, handler);

export default router;
