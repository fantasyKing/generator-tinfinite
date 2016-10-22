/**
 * Created on <%= time %>.
 */
import request from 'request';
import conf from '../config';

class HttpClient {
  constructor(opt) {
    this.address = opt.address;
  }

  get(url, param) {
    const opt = {};
    if (typeof param === 'undefined' || Object.keys(param).length === 0) {
      opt.url = url ? this.address + url : null;
    } else {
      if (url) {
        opt.url = `${this.address}${url}/?`;
        for (const k of Object.keys(param)) {
          opt.url = `${opt.url}${k}=${param[k]}&`;
        }
        opt.url = opt.url.slice(0, opt.url.length - 1);
        console.log(opt.url);
      } else {
        opt.url = null;
      }
    }
    logger.debug('get ', opt);
    return new Promise((resolve, reject) => {
      request(opt, (err, response, body) => {
        if (err) {
          return reject(100000011);
        }
        try {
          const data = JSON.parse(body);
          // 不需要改成!== 否侧订阅服务会异常
          if (data.code != 1) {
            return reject(data.code);
          }
          return resolve(data.result);
        } catch (e) {
          console.error('request.get.error', e);
          return reject(body);
        }
      });
    });
  }

  post(url, param) {
    const opt = {};
    opt.url = this.address + url;
    if (typeof param === 'undefined' || Object.keys(param).length === 0) {
      opt.form = null;
    } else {
      const form = {};
      for (const k of Object.keys(param)) {
        logger.debug(`k: ${k}, value: ${param[k]}`);
        if (param[k] && typeof param[k] === 'object' && param[k].constructor === Array) {
          form[k] = JSON.stringify(param[k]);
        } else {
          form[k] = param[k];
        }
      }
      opt.form = form;
    }
    logger.debug('post ', opt);
    return new Promise((resolve, reject) => {
      request.post(opt, (err, response, body) => {
        if (err) {
          return reject(100000011);
        }
        try {
          const data = JSON.parse(body);
          // 不需要改成!== 否侧订阅服务会异常
          if (data.code != 1) {
            return reject(data.code);
          }
          return resolve(data.result);
        } catch (e) {
          console.error('request.post.error', e);
          return reject(body);
        }
      });
    });
  }
}

function getClients() {
  const HttpClients = {};
  try {
    for (const server of conf.service.http_service) {
      let address = '';
      if (typeof server.commonUrl !== 'undefined' && server.commonUrl !== '') {
        address = `http://${server.address}/${server.commonUrl}/`;
      } else {
        address = `http://${server.address}/`;
      }
      HttpClients[server.name] = new HttpClient({ address });
    }
    console.log(HttpClients);
    return HttpClients;
  } catch (e) {
    logger.error('http.getClients error = ', e);
    throw e;
  }
}

export default getClients();
