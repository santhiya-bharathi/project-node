import express from "express";
// import dotenv from "dotenv";
// import { MongoClient } from "mongodb";
// import { ObjectId } from "mongodb";
// import cors from "cors";  


// dotenv.config();

const app = express();
const PORT = 9000;
// const PORT = process.env.PORT;

// app.use(cors());
// app.use(express.json());

// const MONGO_URL = "mongodb://localhost";
// // const MONGO_URL = process.env.MONGO_URL;

// async function createConnection(){
//     const client =  new MongoClient(MONGO_URL); 
//     await client.connect();  
//     console.log("Mongodb Connected");
//     return client;
// }
// const client = await createConnection();


app.get("/",(request,response)=>{
    response.send("hello happy world");
});

// app.get("/bloglist", async (request,response)=>{
//     const blog = await client 
//     .db("b28wd")
//     .collection("blog")
//     .find({})
//     .toArray();
//     response.send(blog);
// });

// app.get("/stackoverflow/:id", async (request,response)=>{
//     console.log(request.params);
//     const {id} = request.params;
// 	const stackresult = await getStackById(id);
//     console.log(stackresult);

//     stackresult? response.send(stackresult) : response.status(404).send({message:"no matching movie found"});
// });

// app.post("/bloglist", async (request,response)=>{
//     const data = request.body;
//     const result = await client.db("b28wd").collection("blog").insertMany(data);
//     response.send(result);
//     });

    // app.put("/stackoverflow/:id", async (request,response)=>{
    //     console.log(request.params);
    //     const {id} = request.params;
    //     const data = request.body;
    //     const result = await editStackById(id, data);
    //     const stackresult = await getStackById(id);
    //     console.log(result);
    //     response.send(stackresult);
    // });
    // async function editStackById(id, data) {
    //     return await client
    //         .db("b28wd")
    //         .collection("stack")
    //         .updateOne({ _id: ObjectId(id) }, { $set: data });
    // }
    // async function getStackById(id) {
    //     return await client
    //         .db("b28wd")
    //         .collection("stack")
    //         .findOne({ _id: ObjectId(id) });
    // }

app.listen(PORT,()=>console.log("App is started in", PORT));