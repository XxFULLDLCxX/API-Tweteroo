import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const USERS = [];
const TWEETS = [];

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;
  USERS.push({ username, avatar });
  res.status(201).send('OK');
});
app.post('/tweets', (req, res) => {
  const { username, tweet } = req.body;
  if (!USERS.find((e) => e.username === username)) {
    return res.status(401).send('UNAUTHORIZED');
  }
  TWEETS.push({ username, tweet });
  res.status(201).send('OK');
});

app.get('/tweets', (req, res) => {
  const getAvatar = (username) => USERS.find((e) => e.username === username).avatar;
  const last_10 = TWEETS.slice(-10).map((e) => ({ ...e, avatar: getAvatar(e.username) }));
  res.send(last_10);
});

app.listen(5000, () => console.log('Ouvindo a Porta 5000...'));

/* 
{
	username: 'bobesponja', 
	avatar: "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png" 
}
{
	username: "bobesponja",
  tweet: "Eu amo hambúrguer de siri!"
}
 */
