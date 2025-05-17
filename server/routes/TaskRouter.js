
const { getAllTasks, addTask, deleteTask, updateTask, getAllUsers } = require('../controllers/TaskController');


const router = require('express').Router();

router.post('/alltasks',getAllTasks);
router.post('/addtask',addTask);
router.post('/deletetask',deleteTask);
router.post('/updateTask',updateTask);
router.post('/allusers', getAllUsers); 



module.exports = router;