const express = require('express');
const router = express.Router();
const {createNewGroup,
    fetchGroups,
    Membership,
    removeMemberinGroup,
    changeAdmin,
    deleteGroup,
 getGroupDetails} = require('../controller/groupcontroller');
const authenticateUser = require('../middleware/auth');

router.post('/create',authenticateUser,createNewGroup);
router.get('/fetch',authenticateUser,fetchGroups);
router.post('/addmember',authenticateUser,Membership);
router.post('/removemember',authenticateUser,removeMemberinGroup);
router.patch('/changeadmin',authenticateUser,changeAdmin);
router.delete('/delete/:id',authenticateUser,deleteGroup);
router.get('/details/:id',authenticateUser, getGroupDetails)

module.exports = router;









