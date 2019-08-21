const app = require('./app');

app.get("/", (req, res) => {
  res.send("Welcome to a basic express App");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
