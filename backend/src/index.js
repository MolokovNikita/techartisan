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
app.use('/clients', clientRouter); // id, f_name, l_name, login, pass, email, created, deleted
app.use('/staff', staffRouter);  // id , f_name, l_name, login, pass, hired, dismissed
app.use('/positions', positionRouter); // id, position
app.use('/offices', officeRouter); // id, adress
app.use('/services', serviceRouter); //id, price, name
app.use('/statuses', orderStatusRouter); // id, orderstatus 
app.use('/devices',devicesRouter); // id, name
app.use('/order-card',cardOfOrderRouter); // id, price, description, created, ended, client_id
// M : M entities
app.use('/positions-staff',positionToStaffRouter) // staff_id, positions_id
app.use('/devices-order', devicesToCardRouter) //cardoforder_id, devices_id
app.use('/services-order',serviceToCardRouter) // cardoforder_id, services_id
app.use('/offices-order', officesToCardRouter) //cardoforder_id, offices_id
app.use('/staff-order', staffToCardRouter) // cardoforder_id, staff_id
app.use('/status-order',statusOfOrderToCardRouter) // cardoforder_id, statusoforder_id

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
