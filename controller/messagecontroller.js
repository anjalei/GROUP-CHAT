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



const getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']]
        });

        const formatted = messages.map(msg => ({
            id: msg.id,
            message: msg.message,
            name: msg.user.name,
            createdAt: msg.createdAt
        }));

        res.status(200).json({ messages: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};


module.exports={
    postMesage,
    getMessages
};