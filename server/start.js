const express = require('express');
const ssr = require('goldpage');

const app = express();

app.use(ssr.express);

app.get('/hello-from-express', (req, res) => res.send('Hello from an Express route.'))

app.listen(3000, () => {console.log('Server is running')});
