const express = require('express');
const app = express();
const port =8000;


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const toDo = require('./models/todo');
const mongoose = require('mongoose');
const todo = require('./models/todo');
mongoose.connect('mongodb://localhost/todo',{useNewUrlParser:true,useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('connected to db');
    app.listen(port,()=>{
        console.log("server up and running");
    })
});


 //const note = new toDo({head:'saurav',desc:'rt'});

app.set('view engine','ejs');
app.use('/static',express.static('static'))


const response = function(a){
    toDo.find((err,toDos)=>{
        console.log(toDos);
        a.status(200).render('base',{addNote:toDos});
    })
}

app.get("/",(req,res)=>{
    response(res);

});
app.post('/',async(req,res)=>{
   const note = new toDo({
       head:req.body.head,
       desc:req.body.desc
   });
    await note.save(function(note,err){
       if(err) return console.error(err);
   });
   response(res);

})

app.route('/delete/:id').get( async(req,res)=>{
    const id = req.params.id;
    console.log(id);
    await toDo.findByIdAndDelete(id,(err,todo)=>{
        if(err) console.error(err);

    })
    toDo.find((err,toDos)=>{

        console.log(toDos);
        res.status(200).render('base',{addNote:toDos});
    })
    
    //res.redirect('/');
})

app.route('/edit/:id').get((req,res)=>{
    const id = req.params.id;
    console.log(id)
    toDo.find({},(err,toDos)=>{
        if(err) console.error(err);
        res.render('edit',{addNote:toDos,id:id})

    })
    
}).post(async (req,res)=>{
    const id = req.params.id;
    console.log(id)
   await toDo.findByIdAndUpdate(id,{head:req.body.head,desc:req.body.desc},err=>{
        if(err)
        { return res.send(500,err);
        }
res.redirect("/");
    
});
});
