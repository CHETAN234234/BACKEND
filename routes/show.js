const router = require('express').Router();
const File  = require('../models/file');

router.get('/:uuid', async (req, res) =>{
    try{

        const  file = await File.findOne({ uuid : req.params.uuid});
        if(!file){
            return res.render('download',{error : 'Link has been expired.'});    
        }
        return res.render('download',{
            uuid : file.uuid,
            fileName : file.filename,
            fileSize : file.fileSize,
            downloadLink : `${process.env.APP_BASE_URL}/file/download/${file.uuid}`
            //domain_name /files/download/ dlfj23-dfnln [uuid] 
        });
    } catch(err) {
        return res.render('download',{error : 'Something went wrong '});
    }
});


module.exports  = router;