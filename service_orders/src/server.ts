import { createOrderServiceApp } from './app';

const start = async () => {
  const { app, config } = await createOrderServiceApp();
  app.listen(config.orderServicePort, () => {
    // eslint-disable-next-line no-console
    console.log(`Order service running on port ${config.orderServicePort}`);
  });
};

void start();
