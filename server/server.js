import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('server/public/dist'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
