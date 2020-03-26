const app = require('./config/app');

app.listen(process.env.PORT, () => {
    console.log(`➡➡➡ The server is online: http://localhost:${process.env.PORT}/ 🥳`)
});
