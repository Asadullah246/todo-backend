const express = require('express');
const app = express();
const cors = require("cors")
require('dotenv').config();
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxm06.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const dataCollection = client.db("todo").collection("todoData");
        app.get("/", async (req, res) => {
            res.send("running")
        })
        app.get("/todo", async (req, res) => {
            const query = {};
            const cursor = dataCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)
        })
        app.post('/login', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.DB_JWTTOKEN)
            console.log(email, token);
            res.send({ token })
        })

        app.get("/userData", async (req,res)=>{
            const query = {};
            const cursor = dataCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)

        })

        app.post('/user', async(req, res) =>{
            const user = req.body;  
            const accessToken=req.body.token;
            const getEmail=req.body.email;
            console.log(user, accessToken, getEmail);
            try {
                const decoded =await  jwt.verify(accessToken,  process.env.DB_JWTTOKEN, function(err, decoded) {
                    let email ;
                    if(err) {
                       email="invalid email"
                    }
                    if(decoded) {
                        email = decoded.email 
                    }
                    return email;
                  });
                if (getEmail === decoded) {
                    const insertUser = await dataCollection.insertOne(user);
                    res.send(insertUser)
                    }
                    else{
                        res.send("invalid email")
                    }
                   
                }
               
                
            catch (err) {

            }
             
        } )
 
    }
    finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})