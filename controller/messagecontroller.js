const User=require('../model/user');
const Message=require('../model/message');


const postMesage=async (req,res,next)=>{
    const {message}=req.body;
    try {
        const data=await Message.create({message,userId:req.user.id});
        res.status(200).json({newMessage:data,name:req.user.name,success:true});
        
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({error})
    }
}



module.exports={
    postMesage
};