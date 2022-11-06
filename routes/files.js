const router  = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4: uuid4} = require('uuid');

let storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limits : {fileSize : 1000000 * 1000}
}).single('myfile');

router.post('/', (req, res) =>{
    //Validate request
    // Store file
    upload(req, res, async (err) => {
        if(!req.file){
            return res.json({error : ' this could be send, If you could deployment.'});
        }
            if(err){
                return res.status(500).send({error : err.message})
            }
        // Stor into Database
            const file = new File({
                filename : req.file.filename,
                uuid : uuid4(),
                path: req.file.path,
                size : req.file.size
            });
            const response = await file.save();
            return res.json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`})
        }   );
    // Response -> Link 
});


router.post('/send',  async (req, res) =>{
    const{ uuid, emailTo, emailFrom } = req.body;

    
    //
    if( !uuid || !emailTo || !emailFrom ){
        return res.status(422).send({error : 'All field ard.'});
    }
    // Get data from database
    const file = await File.findOne({ uuid : uuid});   

    console.log("here ", file);
    // if(file.sender){
    //     return res.status(422).send({error : 'Email already sent.'});
    // }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    // send email
    const sendMail = require('../services/emailService');

    await sendMail({
        from : emailFrom,
        to : emailTo,
        subject : 'inshaare file sharing',
        text : `${emailFrom} Shared a file  with you.`,
        html : require('../services/emailTemplate')({
            emailFrom : emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size : parseInt(file.size/1000) + 'kB',
            expires : '24 hours'
        })

    });
    return res.send({success : true});

});



module.exports = router;