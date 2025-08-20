const User=require('../model/user');
const Message=require('../model/message');
const {Op}=require('sequelize')
const AWS = require('aws-sdk');
const UUID=require('uuid');
const multer = require('multer');
const { io } = require("../server");
const id=UUID.v4();



const postMessage=async (req,res,next)=>{
    const {message,groupId}=req.body;
    try {
        const data=await Message.create({message,userId:req.user.id,senderName:req.user.name,groupId,type:"text"});
        io.to(groupId).emit("message", {
      message: data.message,
      senderName: req.user.name,
      groupId: groupId,
      userId: req.user.id
    });
        res.status(200).json({newMessage:data,senderName:req.user.name,success:true});
        
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({error})
    }
}

const getMessages = async (req, res,next) => {
     const groupId= req.params.groupId
    try {
        const messages = await Message.findAll({where:{groupId}})
        res.status(202).json({allGroupMessages:messages,success:true})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};
const uploadFile=async(req,res,next)=>{
    const {groupId}=req.params;
    const userId=req.user.id;
    const userName=req.user.name;
  
    try {
       
 
        const filename="File"+userId+"/"+Date.now()+Math.random();
        console.log(filename);
        const fileUrl=await uploadToS3(req.file,filename);
        await Message.create({groupId,userId,message:fileUrl,senderName:userName,type:'file'});
        const userFile={
            message:fileUrl,
            senderName:userName,
            userId
        }
        io.to(groupId).emit("message", {
  message: fileUrl,
  senderName: userName,
  groupId,
  userId,
  type: "file"
});

        res.status(201).json({userFile,success:true})  
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({msg:'Error uploading file',error})
    }


}


async function uploadToS3(data, filename) {
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    const s3= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET

    });
const file=data;
const key=`uploads/${id}-${file.originalname}`
      const params = {
        Bucket:BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('Error Uploading File', err);
            reject(err);
          } else {
            console.log('File Uploaded Successfully:', data.Location);
            resolve(data.Location);
          }
        });
      });
  }

module.exports={
    postMessage,
    getMessages,
    uploadFile,
    uploadToS3
    
};
