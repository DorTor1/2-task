import { createUserServiceApp } from './app';

const start = async () => {
  const { app, config } = await createUserServiceApp();
  app.listen(config.userServicePort, () => {
    // eslint-disable-next-line no-console
    console.log(`User service running on port ${config.userServicePort}`);
  });
};

void start();
