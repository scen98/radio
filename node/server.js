const express = require("express");
const app = express();
const { getChart } = require('billboard-top-100');
const cors = require("cors");

app.use(cors());

app.get("/billboard/artist-100", (req, res)=>{
    try{
        requestChart(res, "artist-100");
    } catch(err){
        res.status(500);
        res.send(err.toString());
    }
}); 

app.get("/billboard/hot-100", (req, res)=>{
    try{
        requestChart(res, "hot-100");
    } catch(err){
        res.status(500);
        res.send(err.toString());
    }
});

app.get("/billboard/top-200", (req, res)=>{
    try{
        requestChart(res, "billboard-global-200");
    } catch(err){
        res.status(500);
        res.send(err.toString());
    }
});

app.get("/billboard/greatest", (req, res)=>{
    try{
        requestChart(res, "greatest-billboard-200-artists");
    } catch(err){
        res.status(500);
        res.send(err.toString());
    }
});

function requestChart(res, chart){
    getChart(chart, (err, chart)=>{ 
        if(err) {
            res.status(500);
            res.send(err.toString());
        }         
        if(chart != null && chart.songs != null){
            res.status(200);
            res.send(chart.songs);
        } else {
            res.status(500);
            res.send();
        }      
    });
}

app.listen(4000, ()=>{
    console.log("Billboard running.");
});