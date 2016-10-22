import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';

function parseParams(req, method) {
  const params = {};
  try {
    Object.keys(req.params).forEach(v => {
      params[v] = req.params[v];
    });

    if (method === 'GET') {
      Object.keys(req.query).forEach(v => {
        params[v] = req.query[v];
      });
    } else if (method === 'POST' || method === 'PUT') {
      Object.keys(req.body).forEach(v => {
        params[v] = req.body[v];
      });
    }
    return params;
  } catch (err) {
    return {};
  }
}

class HTTP {
  constructor(opts) {
    if (!opts.port) {
      throw new Error('http `port` should not be null.');
    }
    this.port = opts.port;
    this.app = express();

    morgan.token('params', req => JSON.stringify(parseParams(req, req.method)));
    this.use(morgan('[:date[iso]] [:method :url] [:status] [:response-time ms] [:params]'));

    this.use(cors());
    this.use(bodyParser.json({ limit: '64mb' }));
    this.use(bodyParser.urlencoded({ limit: '64mb', extended: true }));
    this.use(compression());

    this.app.all('*', (req, res, next) => {
      req.header('Access-Control-Request-Headers', '*');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('X-Frame-Options', 'DENY');
      res.header('Access-Control-Allow-Headers',
                 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-app-id');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
      next();
    });
  }

  errorLog = (e, req, res, next) => {
    console.error(req.path, 'error = ', e, e.stack);
    next(e);
  };

  clientErrorHandler = (e, req, res, next) => {
    if (req.xhr) {
      return res.send({ code: 0, message: '请求异常' });
    }
    return next(e);
  };

  errorHandler = (e, req, res) => {
    console.error(e, e.stack);
    res.statusCode = 500;
    res.send({ code: 500 });
  };

  notFoundHandler = (req, res) => {
    res.statusCode = 404;
    res.end();
  };

  use = (...args) => {
    this.app.use.apply(this.app, args);
  };

  start = () => {
    this.app.get('*', this.notFoundHandler);
    this.use(this.errorLog);
    this.use(this.clientErrorHandler);
    this.use(this.errorHandler);

    const server = this.app.listen(this.port, () => {
      console.log('http listen on', this.port);
      console.log('http run at env:', process.env.NODE_ENV);
    });
    process.on('SIGINT', () => {
      console.log('http exiting...');
      server.close(() => {
        console.log('http exited.');
        process.exit(0);
      });
    });
  }
}

export default HTTP;
