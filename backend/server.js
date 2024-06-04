const express=require('express');
const proutes=require("./routes/products");
const app=express();
const cors=require('cors');
const env=require('dotenv');
env.config();
app.use(cors({
    origin: 'http://localhost:3001'
}));

app.use(express.json());
app.use('/categories',proutes);

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running`);
})