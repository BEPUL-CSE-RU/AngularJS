var express = require('express');
var multer = require('multer'),
bodyParser = require('body-parser'),
path = require('path');
var mongoose = require('mongoose');
var Detail = require('./models/detail');
var fs = require('fs');
var dir = './uploads';
/*var upload = multer({ dest: 'uploads/' });*/
//mongoose.connect('mongodb://localhost/forum');
const mongdata = "mongodb://Bepul:Bepul@cluster0-shard-00-00-lo1zs.mongodb.net:27017,cluster0-shard-00-01-lo1zs.mongodb.net:27017,cluster0-shard-00-02-lo1zs.mongodb.net:27017/database?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(mongdata)


var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, './uploads');
  },
  filename: function (req, file, callback) 
  { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});

var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));

app.get('/', function(req, res){
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('index',{data:data});
    }
  })
  
});

app.post('/', upload.any(), function(req,res){
  
  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files); //form files
  
  if(!req.body && !req.files){
    res.json({success: false});
  } else {    
    var c;
    Detail.findOne({},function(err,data){
      console.log("into detail");

      if (data) {
        console.log("if");
        c = data.unique_id + 1;
      }else{
        c=1;
      }

      var detail = new Detail({

        unique_id:c,
        Name: req.body.title,
        image1: req.files[0] && req.files[0].filename ? req.files[0].filename : '',
        image2: req.files[1] && req.files[1].filename ? req.files[1].filename : '',
      });

      detail.save(function(err, Person){
        if(err)
          console.log(err);
        else
          res.redirect('/');

      });

    }).sort({_id: -1}).limit(1);

  }
});

app.post('/delete',function(req,res){

   Detail.findByIdAndRemove(req.body.prodId,function(err, data) {

    console.log(data);

   })
  res.redirect('/');
});

var port = process.env.PORT || 4037;
app.listen( port, function(){ console.log('listening on port '+port); } );