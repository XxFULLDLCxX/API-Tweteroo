import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const USERS = [];
const TWEETS = [];

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;
  if (typeof username !== 'string' || typeof avatar !== 'string' || !username || !avatar)
    return res.status(400).send('Todos os campos são obrigatórios!');

  USERS.push({ username, avatar });
  res.status(201).send('OK');
});
app.post('/tweets', (req, res) => {
  const { tweet } = req.body;
  const { user: username } = req.headers;
  if (typeof username !== 'string' || typeof tweet !== 'string' || !username || !tweet)
    return res.status(400).send('Todos os campos são obrigatórios!');

  if (!USERS.find((e) => e.username === username)) return res.status(401).send('UNAUTHORIZED');

  TWEETS.push({ username, tweet });
  res.status(201).send('OK');
});

const getAvatar = (username) => USERS.find((e) => e.username === username).avatar;

app.get('/tweets', (req, res) => {
  const page = 'page' in req.query ? req.query.page : 1;
  if (isNaN(page) || page <= 0) res.status(400).send('Informe uma página válida!');

  const magic = TWEETS.slice(-10 * page, Math.max(0, TWEETS.length - 10 * (page - 1)));
  const range = magic.map((e) => ({ ...e, avatar: getAvatar(e.username) }));
  res.send(range);
});

app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const search = TWEETS.filter((e) => e.username === username);
  res.send(search.map((e) => ({ ...e, avatar: getAvatar(e.username) })));
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
