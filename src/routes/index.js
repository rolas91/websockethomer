let express = require('express');
let router = express.Router();
const {nearBy} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/probando',(req, res)=>{
    res.status(200).json({message:"exito"});
})

module.exports = router;