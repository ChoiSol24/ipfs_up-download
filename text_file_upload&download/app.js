const express = require('express')

var multer = require('multer')

var upload = multer({dest:'uploads/'})

const app = express()

const fs = require('fs')

const IPFS = require('ipfs-core')




const ipfsAPI = require('ipfs-api')
var ipfs2 = ipfsAPI('ipfs.infura.io','5001',{protocol:'https'})

app.get('/', function(req, res){
    res.sendFile(__dirname+ '/public/index.html');
})

app.post('/profile', upload.single('avatar'),function(req, res, next){
    console.log(req.file)
    var data = new Buffer(fs.readFileSync(req.file.path))
    ipfs2.add(data, function(err, file){
        if(err) {console.log(err);}
        console.log(file);
        console.log(file[0].hash)
        res.send(file[0].hash);
    })
})

app.get('/show/:ID', function(req,res){
    res.redirect('https://ipfs.io/ipfs/'+req.params.ID);
    console.log(req.params.ID)
})

app.get('/download/:ID',function(req,res){
    
    async function run() {
        try{
        const ipfs = await IPFS.create()

        const chunks=[]
        for await (const chunk of ipfs.cat('/ipfs/'+req.params.ID)){
            chunks.push(chunk)
            }
        
        //console.log(chunks.join())

        fs.writeFile(`${req.params.ID}.txt`, chunks.join(), (err)=>{
            if(err){console.log(err)}
        })

        ipfs.stop()
        }

        catch(err){console.log(err)}
         
    }
    run()
})


app.listen(3002)