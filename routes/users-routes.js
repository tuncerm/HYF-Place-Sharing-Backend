const express = require('express');

const router =  express.Router();

router.get('/', (req, res, next)=>{
    console.log('GET user');
    res.json({message: 'OK'});
});


module.exports = router;