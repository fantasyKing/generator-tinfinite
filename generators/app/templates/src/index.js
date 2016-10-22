/**
 * Created on <%= time %>.
 */
import HTTP from './server/http';
import ms_utils from 'ms-utils';
import config from './config';

global.logger = ms_utils.logger(config.logger.category,
                                config.logger.level);

const port = process.env.PORT || 30600;

async function main() {
  const result = await ms_utils.load_clients(config.service);
  if (!result) {
    throw new Error('proto 文件同步失败');
  }
  const router = require('./route');
  const server = new HTTP({ port });
  server.use('/', router);
  const stats = await ms_utils.stats(1);
  server.use('/stats', await stats);
  server.start();
}

main();
