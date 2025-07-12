const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const JWT_SECRET = "todoist"
const users = {}; 
const userdata =[];
app.use(express.json());  

function authmiddleware(req,res,next){
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const decodeddata= jwt.verify(token,JWT_SECRET);

    if(decodeddata){
        req.username = decodeddata.username; // passing the username to the function which next calls
        next();
    }else{
        res.send("you're not authorised ");
    }
}
// for testing in postman
app.get('/me',authmiddleware,(req,res)=>{
    
    let userfound = null;

    for(let i =0;i<userdata.length;i++){
        if(userdata[i].username=req.username){
            userfound = userdata[i];
            break;
        }
    }
    if(userfound){
        res.json({
            name :userfound.username,
            password :userfound.password

        })
    }else{
        res.json({
            message:"you're not authorised "
        })
    }
})


app.post('/signup',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;


    users[username]={ todos: {}};

    userdata.push({
        "username":username,
        "password":password
    })
    
    
    res.send("you're logged in");
    console.log(userdata);

})

app.post('/signin',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    let userfound = null;
    for(let i =0;i<userdata.length;i++){
        if(userdata[i].username==username && userdata[i].password==password){
            userfound = true;
            break;
        }
    }

    if(userfound){
        const token  = jwt.sign({username},JWT_SECRET);
        res.json({
            "token":token
        })
    }else{
        res.json({
            "message":"You're not signed in !"
        })
    }


})
app.post('/addtask',authmiddleware, (req, res) => {
    const username = req.username;
    const todo = req.body.todo;

    if (!username || !todo) {
        return res.status(400).json({ error: "Username and todo are required!" });
    }

    
    if (!users[username]) {
        users[username] = { todos: {} };
    }

    
    const todoCount = Object.keys(users[username].todos).length + 1;
    
    
    users[username].todos[`todo${todoCount}`] = todo;

    console.log(users);
    res.json({ message: "Todo added successfully!", userTodos: users[username] });
});
// to print todos
app.get('/getdata',(req,res)=>{
    res.json(userdata)
})
//to print all the users
app.get('/tasks',(req,res)=>{
    res.json(users);
})
// to update name in home page
app.post('/getname',authmiddleware,(req,res)=>{
    const name = req.username;
    res.json({name});
})



app.listen(3000, () => console.log('Server running on port 3000'));

//express endpoints for html pages
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/front.html')
})
app.get('/signin',(req,res)=>{
    res.sendFile(__dirname + '/public/signin.html')
})
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname + '/public/signup.html')
})
app.get('/front',(req,res)=>{
    res.sendFile(__dirname +'/public/home.html')
})  

app.get('/members',(req,res)=>{
    res.sendFile(__dirname + '/public/members.html')
})

app.get('/mytasks',(req,res)=>{
    res.sendFile(__dirname + '/public/mytasks.html')
})

app.get('/addtask',(req,res)=>{
    res.sendFile(__dirname + '/public/addtask.html')
})