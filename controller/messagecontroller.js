const User=require('../model/user');
const Message=require('../model/message');
const {Op}=require('sequelize')


const postMessage=async (req,res,next)=>{
    const {message}=req.body;
    try {
        const data=await Message.create({message,userId:req.user.id,name:req.user.name});
        res.status(200).json({newMessage:data,name:req.user.name,success:true});
        
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({error})
    }
}



const getMessages = async (req, res,next) => {
     const msgId=req.query.lastmessageid;
    try {
        const messages = await Message.findAll({
            where:{
                id:{
            [Op.gt]:msgId
                }}
        });

        

        res.status(202).json({allMessages:messages,success:true})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};


module.exports={
    postMessage,
    getMessages
};