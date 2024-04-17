const express = require("express");
const pool = require('../src/Config/ormconfig');
const clientRouter = require('../src/Routers/clientRouter');
const staffRouter = require('../src/Routers/staffRouter');
const positionRouter = require('../src/Routers/positionRouter');
const officeRouter = require('../src/Routers/officeRouter');
const serviceRouter = require('../src/Routers/serviceRouter');
const orderStatusRouter = require('../src/Routers/statusOfOrderRouter');
const cardOfOrderRouter = require('../src/Routers/cardOfOrderRouter');
const devicesRouter = require('../src/Routers/devicesRouter');
const devicesToCardRouter = require('../src/Routers/devicesToCardRouter');
const officesToCardRouter = require('../src/Routers/officesToCardRouter');
const positionToStaffRouter = require('../src/Routers/positionToStaffRouter');
const serviceToCardRouter = require('../src/Routers/serviceToCardRouter');
const staffToCardRouter = require('../src/Routers/staffToCardRouter')
const statusOfOrderToCardRouter = require('../src/Routers/statusOfOrderToCardRouter')

const app = express();
const PORT = process.env.PORT || 5002;

//User Json Parser
app.use(express.json());

//  CRUD ROUTERS
app.use('/clients', clientRouter);
app.use('/staff', staffRouter); 
app.use('/positions', positionRouter);
app.use('/offices', officeRouter);
app.use('/services', serviceRouter);
app.use('/statuses', orderStatusRouter);
app.use('/devices',devicesRouter);
app.use('/order-card',cardOfOrderRouter);
// M : M entities
app.use('/positions-staff',positionToStaffRouter)
app.use('/devices-order', devicesToCardRouter) 
app.use('/services-order',serviceToCardRouter)
app.use('/offices-order', officesToCardRouter)
app.use('/staff-order', staffToCardRouter)
app.use('/status-order',statusOfOrderToCardRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.set('view engine', 'ejs');

async function startApp() {
    try {
        await pool.connect();
        console.log("Successful connection to the database");
    }
    catch (error) {
        console.log("Eror in connection to the database");
        throw new Error(error);
    }
    try {
        app.listen(PORT, () => {
            console.log("Server started on port - ", PORT);
        });
    } catch (error) {
        console.error(`Error starting the server: ${error}`);
        throw new Error(error);
    }
}

startApp();
