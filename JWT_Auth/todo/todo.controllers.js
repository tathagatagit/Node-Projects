const { todoModel } = require("./todo.model");

exports.createToDoo = async (req, res, next) => {
    const {email} = req.user;
    const {name, desc} = req.body;
    if(name && desc){
        try{
            let newTodo = new todoModel({email, name, desc});
            let data = await newTodo.save();
            res.json({message: "New todo created", data: data.id});
        }
        catch(e){
            next(new Error(`Database query error ${e.message}`));            
        }
    }
    else{
        next(new Error(`Invalid inputs`));
    }
}

exports.getToDoo = async (req, res, next) => {
    const {email} = req.user;
    try{
        let todo = await todoModel.find({email});
        let todo_temp = todo.map((e) => {
            return({
                id: e._id, name: e.name, desc: e.desc
            });        
        });       
        res.json({message: "list", data: {todos: todo_temp, total_todo: todo_temp.length}});
    }
    catch(e){
        next(new Error(`Database query error ${e.message}`));            
    }
}

exports.updateToDoo = async (req, res, next) => {
    const todoId = req.params.id;
    const {email} = req.user;
    if(todoId){
        try{            
            let data = await todoModel.updateOne({_id: todoId}, {$set: req.body}, {new: true});
            if(data.matchedCount === 1 && data.modifiedCount === 1){
                res.json({message: "Todo updated", data});
            }
            else{
                res.json({message: "Todo not updated", data});
            }
        }
        catch(e){
            next(new Error(`Database query error ${e.message}`));            
        }
    }
    else{
        next(new Error(`Invalid todo id`));
    }
}

exports.deleteToDoo = async (req, res, next) => {
    const todoId = req.params.id;
    // console.log(todoId)
    const {email} = req.user;
    // const {name, desc} = req.body;
    if(todoId){
        try{            
            let data = await todoModel.deleteOne({_id: todoId});
            if(data.deletedCount === 1){
                res.json({message: "Todo deleted", data});
            }
            else{
                res.json({message: "Todo not deleted", data});
            }
        }
        catch(e){
            next(new Error(`Database query error ${e.message}`));            
        }
    }
    else{
        next(new Error(`Invalid todo id`));
    }
}
