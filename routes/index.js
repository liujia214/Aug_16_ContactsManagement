var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test',function(err){
  if(!err){
    console.log('Successfully connected to mongodb....');
  }else{
    console.log('was not able to connect to mongodb....');
  }
});

var Contact = mongoose.model('contact',{
  name:String,
  email:{
    type:String,
    unique:true,
    required:true
  },
  phone:{
    type:String,
    required:true
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Contact' });
});

router.get('/contacts',function(req,res){
  res.set('Cache-Control','public');
  //console.log(req.headers.accept);
  Contact.find(function(err,response){
    if(err){
      res.status(500).json({message:'Something Broke!'});
    }else{
      if(req.accepts('application/json')){
        res.status(200).json(response);
      }else{
        res.status(406).json({message:'Not acceptable'});
      }
    }
  })
});

router.post('/contacts',function(req,res){
  //console.log(req.headers);
  (new Contact(req.body)).save(function(err,response){
    if(err){
      res.status(500).json({message:'Something Broke!'});
    }else{
      console.log(response);
      res.status(201).json(response);
    }
  });
  //res.status(200).json({message:'contact create successfully'});
});


router.put('/contacts/:id',function(req,res){

  //console.log(req.url);
  Contact.findByIdAndUpdate(req.params.id,req.body,function(err,response){
    if(err){
      res.status(500).json({message:'Something Broke!'});
    }else{
      res.status(200).json({message:'Successfully Update!'});
    }
  })

});

router.delete('/contacts/:id',function(req,res){
    Contact.findByIdAndRemove(req.params.id,function(err,response){
      if(err){
        res.status(500).json({message:'Someting Broke!'});
      }else{
        res.status(200).json({message:'Successfully Delete!'});
      }
    })
});
module.exports = router;
