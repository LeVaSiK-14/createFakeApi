const cors = require('cors');
const express = require('express');
const uuid = require('uuid');
const {initDb} = require('./db/init');

const {dataI} = require('./db/inventory');
const {dataT} = require('./db/trainer');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

initDb.read();

initDb.defaults(dataI).write();
initDb.defaults(dataT).write();


app.get('/inventory', (req, res) => {
    const inventory = initDb.get('inventory');
    res.send(inventory);
});

app.get('/trainer', (req, res) => {
    const trainer = initDb.get('trainer');
    res.send(trainer);
});

app.get('/inventory/id', (req, res) => {
    const {id} = req.query;
    const inventory = initDb.get('inventory').find({ id }).value();
    if (!inventory) return error(res, 404, 'cannot find inventory with this id');
    res.send(inventory);
});

app.get('/trainer/id', (req, res) => {
    const {id} = req.query;
    const trainer = initDb.get('trainer').find({ id }).value();
    if (!trainer) return error(res, 404, 'cannot find trainer with this id');
    res.send(trainer);
});


app.post('/inventory/create', (req, res) => {
    const body = req.body;
    try{
        const {
            name,
            isInGoodCondition,
            quantity,
            weight,
            producedBy
        } = body;
        const objToCreate = {
            id: uuid.v4(),
            name,
            isInGoodCondition,
            quantity,
            weight,
            producedBy
        };
        initDb.get('inventory').push(objToCreate).write();
        res.send(objToCreate);
    } catch (error) {
        res.status(500).json({
            errorCode: "INTERNAL_SERVER_ERROR",
            errorString: "Внутреняя ошибка сервера",
        });
    };
});

app.post('/trainer/create', (req, res) => {
    const body = req.body;
    try{
        const {
            name,
            isGood,
            age,
            weight,
        } = body;
        const objToCreate = {
            id: uuid.v4(),
            name,
            isGood,
            age,
            weight,
        };
        initDb.get('trainer').push(objToCreate).write();
        res.send(objToCreate);
    } catch (error) {
        res.status(500).json({
            errorCode: "INTERNAL_SERVER_ERROR",
            errorString: "Внутреняя ошибка сервера",
        });
    };
});

app.put('/inventory/update/:id', (req, res) => {
    try{
        const {id} = req.params;
        const body = req.body;
        const item = initDb.get('inventory').find({ id }).value();
        const {
            name,
            isInGoodCondition,
            quantity,
            weight,
            producedBy
        } = body;
        if(typeof name !== 'string') throw new Error(`Invalid data type for ${name}`);
        const updatedItem = {...item, ...body};
        initDb.get('inventory').find({ id }).assign(updatedItem).write();
        res.send(updatedItem);
    } catch (error) {
        res.status(500).json({
            errorCode: "INTERNAL_SERVER_ERROR",
            errorString: error.message
        });
    };
});

app.put('/trainer/update/:id', (req, res) => {
    try{
        const {id} = req.params;
        const body = req.body;
        const item = initDb.get('trainer').find({ id }).value();
        const {
            name,
            isGood,
            age,
            weight,
        } = body;
        if(typeof name !== 'string') throw new Error(`Invalid data type for ${name}`);
        const updatedItem = {...item, ...body};
        initDb.get('trainer').find({ id }).assign(updatedItem).write();
        res.send(updatedItem);
    } catch (error) {
        res.status(500).json({
            errorCode: "INTERNAL_SERVER_ERROR",
            errorString: error.message
        });
    };
});

app.delete('/inventory/delete/:id', (req, res) => {
    const { id } = req.params;
    initDb.get('inventory').remove({ id }).write();
    res.send('Success deleted!');
});

app.delete('/trainer/delete/:id', (req, res) => {
    const { id } = req.params;
    initDb.get('trainer').remove({ id }).write();
    res.send('Success deleted!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



