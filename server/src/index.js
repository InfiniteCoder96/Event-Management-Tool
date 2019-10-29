const bodyparser = require('body-parser');
const cors = require('cors');
const myapp = express();
// boady parser middleware
myapp.use(bodyparser.json());
myapp.use(bodyparser.urlencoded({extended: false}));

// enable cors
myapp.use(cors());

const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
