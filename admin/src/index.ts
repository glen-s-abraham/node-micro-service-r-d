import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import amqplib, { Channel } from 'amqplib/callback_api';
import { Product } from './models/product.model'


let amqpChannel: Channel;

amqplib.connect('amqp://admin:password@localhost:5672', (err: any, conn: any) => {
    if (err) throw err;
    if (!conn) console.log('Not connected to rabbitmq')
    else
        conn.createChannel((err: any, ch: any) => {
            if (err) throw new err;
            amqpChannel = ch;
        })
})



const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));


app.get("/api/products", async (req: Request, res: Response) => {
    res.status(200).json(await Product.find());
    amqpChannel.sendToQueue('hello', Buffer.from('hello'));
})

app.get("/api/products/:id", async (req: Request, res: Response) => {
    res.status(200).json(await Product.findById(req.params.id));
})

app.post("/api/products", async (req: Request, res: Response) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ err: err })
    }

})

app.put("/api/products/:id", async (req: Request, res: Response) => {
    res.status(200).json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }));
})

app.delete("/api/products/:id", async (req: Request, res: Response) => {
    res.status(200).json(await Product.findByIdAndDelete(req.params.id));
})

mongoose.connect("mongodb://localhost:27017/ms_admin");
mongoose.connection.on('error', (err) => console.error(err));
mongoose.connection.once('open', () => {

})
app.listen(8000, () => console.log('listening on port 8000'))

