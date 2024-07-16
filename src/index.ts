import { buildApp, AppOptions } from './app';
import { PORT } from './config';

const options: AppOptions = {
  logger: true,
};

const start = async () => {
  const app = await buildApp(options);

  try {
    await app.listen({
      port: PORT,
      host: '0.0.0.0',
    });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
