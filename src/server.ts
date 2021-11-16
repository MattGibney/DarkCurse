import application from './app';
import Config from '../config/environment';

const app = application(Config);

app.listen(Config.port, () => {
  console.log(`Server is running on port ${Config.port}`);
});
