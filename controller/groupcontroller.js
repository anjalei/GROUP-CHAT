const User=require('../model/user');
const Message=require('../model/message');
const Group = require('../model/group');
const GroupMember = require('../model/groupmember');

async function createNewGroup(req,res,next){
    const {groupname}=req.body;
    try {
        const group=await Group.create({groupname,createdBy:req.user.id});
        await GroupMember.create({groupId:group.id,userId:req.user.id});
        res.status(201).json({msg:`Successfully Created group ${groupname}`,
         group,           
        success: true})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"No Group created",error})
        
    }
}


async function fetchGroups(req,res,next){
    try {
        const user=await User.findOne({where : {id:req.user.id}});
        const groups=await user.getGroups();
        res.status(201).json({groups,success:true})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Cannot Get Groups',error})
        
    }
}

async function Membership(req,res,next){
    const email=req.body.memberEmail;
    const groupId=req.body.groupid

  try {
      const user=await User.findOne({where: {email}});
      if(!user) return res.status(404).json({msg:"No user Registered with that email",success:false});
      const group = await Group.findOne({where: {id:groupId}})
      if (!group) return res.status(404).json({msg:"Group not found",success:false});
      const member=await GroupMember.findOne({where:{groupId,userId:user.id}})
      if(member) return res.status(409).json({msg:"User Already present in the group",success:false}) 
      await GroupMember.create({groupId,userId:user.id});
      res.status(200).json({msg:"Member Added Successfully",success:true})
  } catch (error) {
      console.log(error);
      res.status(500).json({msg:"Some error occured!",success:false,error})
    
  }
}
async function removeMemberinGroup(req,res,next){
    const email=req.body.memberEmail;
    const groupId=req.body.groupid;
  try {
      const user=await User.findOne({where: {email}});
      const group = await Group.findOne({where: {id:groupId}})
      if(!user)   return res.status(404).json({msg:"No user Registered with that email",success:false});
      if (!group) return res.status(404).json({msg:"Group not found",success:false});
      const member=await GroupMember.findOne({where:{groupId,userId:user.id}})
      if(!member) return res.status(404).json({msg:"User Already not a Member in the group",success:false})
       
      await GroupMember.destroy({
            where: { groupId, userId: user.id }
        });
      res.status(200).json({msg:"Member Removed Successfully",success:true})
  } catch (error) {
      console.log(error);
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
    
  }
}
async function changeAdmin(req,res,next){
    const email=req.body.memberEmail;
    const groupId=req.body.groupid;

  try {
      const user=await User.findOne({where: {email}});
      const group = await Group.findOne({where: {id:groupId}})
      if (!group) return res.status(404).json({msg:"Group not found",success:false});
      if(!user)   return res.status(404).json({msg:"No user Registered with that email",success:false});
      const member=await GroupMember.findOne({where:{groupId,userId:user.id}})
      if(!member) return res.status(404).json({msg:"User not a Member in the group please add and change admin",success:false})
       
      await Group.update({createdBy:user.id},{where:{id:groupId}});
      res.status(200).json({msg:"changed admin successfully,You are no longer an admin",success:true})
  } catch (error) {
      console.log(error);
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
    
  }
}

async function deleteGroup(req,res,next){
    const {id}=req.params;
    try {
        await Group.destroy({where:{id}});
        await GroupMember.destroy({where:{groupId:id}});
        await Message.destroy({where:{groupId:id}});
        res.status(200).json({msg:"Group Deleted Successsfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
      
        
    }

}

const getGroupDetails = async (req, res) => {
  const groupId = req.params.id;
  try {
    const group = await Group.findOne({
      where: { id: groupId },
      include: [
        {
          model: User,
          through: { attributes: [] }, 
          attributes: ["id", "name"]
        }
      ]
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    const admin = await User.findOne({
      where: { id: group.createdBy },
      attributes: ["id", "name"]
    });

    res.status(200).json({
      success: true,
      admin: admin,
      members: group.users 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch group details" });
  }
};

module.exports = {
    createNewGroup,
    fetchGroups,
    Membership,
    removeMemberinGroup,
    changeAdmin,
    deleteGroup,
    getGroupDetails
};