const cors = require('cors');
const express = require('express');
const uuid = require('uuid');

const {inventory} = require('./inventory');

const {trainer} = require('./trainer');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/inventory', (req, res) => {
    res.send(inventory);
});

app.get('/trainer', (req, res) => {
    res.send(trainer);
});

app.get('/inventory/id', (req, res) => {
    const {id} = req.query;

    if(!id || id.length < 10){
        res.status(400).json({
            errorCode: "INVALID_REQUEST",
            errorString: "Все неверно",
        });
    }else{
        inventory.forEach(elem => {
            if (elem.id === id){
                res.send(elem);
            }else{
                res.status(404).json({
                    errorCode: "ITEM_NOT_FOUND",
                    errorString: "Предмет не найден",
                });
            };
        });
    };
});



app.get('/trainer/id', (req, res) => {
    const {id} = req.query;

    if(!id || id.length < 10){
        res.status(400).json({
            errorCode: "INVALID_REQUEST",
            errorString: "Все неверно",
        });
    }else{
        trainer.forEach(elem => {
            if (elem.id === id){
                res.send(elem);
            }else{
                res.status(404).json({
                    errorCode: "ITEM_NOT_FOUND",
                    errorString: "Тренер не найден",
                });
            };
        });
    };
});


app.post('/inventory/create', (req, res) => {
    console.log('inCreate')
    const body = req.body;
    console.log(body);

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

        inventory.push(objToCreate);
        res.send(objToCreate);

    } catch (error) {
        res.status(500).json({
            errorCode: "INTERNAL_SERVER_ERROR",
            errorString: "Внутреняя ошибка сервера",
        });
    };
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



