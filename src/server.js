const app = require("./index");
const cors = require('cors');

// Configuração do CORS com origens permitidas
const corsOptions = {
  origin: '*', // Substitua pela origem permitida
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.listen(5000);