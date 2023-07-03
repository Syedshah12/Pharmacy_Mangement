const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
const Seller = require('./models/seller');
const Stock = require('./models/schema');

const { log } = require('console');
const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');
require('./db/connect')

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})



// middlewares
app.use(express.json());
app.use(express.static(static_path))
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);


// hbs.registerHelper("minus", function(thing1,thin2) {
//     return Number(thing1-thin2); 
//   });

//Get all
app.get('/', async (req, res) => {
    try {
        const stock = await Stock.find({});
        res.render('index', {
            data: stock
        })
    } catch (error) {
        res.send(error)
    }
})

//Add
app.get('/add', async (req, res) => {
    try {
        res.render('add');
    } catch (error) {
        res.status(400).send(error);
    }
})


//post

app.post('/add', async (req, res) => {
    try {
        const newMed = new Stock({
            id: req.body.id,
            name: req.body.name,
            actualprice: req.body.actualprice,
            sellprice: req.body.sellprice,
            stock: req.body.stock,
            formula: req.body.formula

        })
        const med = await newMed.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error);
    }
})



// del
app.get("/del/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const deltask = await Stock.deleteOne({ id: id });
        res.redirect('/')
    } catch (error) {
        res.status(404).send(error);
    }
});

app.get('/search', async (req, res) => {
    try {
        const value = req.query.name
        const data = await Stock.find({
            "$or": [{
                name: { $regex: value }
            }]
        })

        res.render('send', {
            name: data
        });
    } catch (error) {

    }
})




//for update
app.get('/update/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const med = await Stock.find({ id: id }, {
            useFindAndModify: false
        });
        res.render('update', {
            data: med
        });
        console.log(id);
    } catch (error) {
        res.send(error)
    }
})




app.post('/update/:id', async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const formula = req.body.formula;
        const stock = req.body.stock;
        const actualprice = req.body.actualprice;
        const sellprice = req.body.sellprice;
        const result = await Stock.updateOne({ id: id },
            {
                $set: {
                    id: id,
                    name: name,
                    formula: formula,
                    stock: stock,
                    actualprice: actualprice,
                    sellprice: sellprice

                }
            })

        res.redirect('/')
    } catch (error) {
        res.send(error)
    }
})





app.post('/sold', async (req, res) => {
    try {
        const a = await Stock.findOne({ id: req.body.id });
        const amount = req.body.amount;
        const actualprize = a.actualprice * amount;
        const finalprize = a.sellprice * amount;
        const ttl_profit = Number(finalprize - actualprize);

        console.log(ttl_profit);

        const prevStock = a.stock;
        const update = await Stock.updateOne({ id: req.body.id }, {
            $set: {
                stock: prevStock - amount
            }
        })
        const soldItem = await Seller.create({
            id: req.body.id,
            stock_id: a._id,
            amount: req.body.amount,
            date: new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }),
            totalProfit: ttl_profit
        })
        const stock = a.stock;
        const saved = await soldItem.save();
        res.redirect('/')
    } catch (error) {
        res.send(error)
    }
})

app.get('/sold', async (req, res) => {
    try {
        const groupData = await Seller.find({}).populate('stock_id');
        res.render('sold', {
            wholeData: groupData
        })

    } catch (error) {
        res.send(error)
    }
})

app.get('/profit', async (req, res) => {
    try {
        const dta = await Seller.aggregate([
            { $group: { _id: null, totalProfit: { $sum: "$totalProfit" } } }
        ])
        res.render('profit', {
            data1: dta
        })


    } catch (error) {
        res.send(error)
    }
})

app.post('/reset', async (req, res) => {
    try {
        const delAll = await Seller.deleteMany();
        res.redirect('/');
    } catch (error) {
        res.send(error)
    }
})