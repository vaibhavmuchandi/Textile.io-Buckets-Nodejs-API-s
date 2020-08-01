;(global as any).WebSocket = require('isomorphic-ws')

import { Buckets, Identity, KeyInfo, PushPathResult } from '@textile/hub'
import {Libp2pCryptoIdentity} from '@textile/threads-core';
import express = require('express');
const multer  = require('multer');
const axios = require('axios')
const CryptoJS = require('crypto-js')
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const config = require('../config.js')

// Create a new express application instance
const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: true}));

// const identity = async() => {
//     const lidentity = await Libp2pCryptoIdentity.fromRandom()
//     console.log(lidentity.toString())
// }
    
// identity()
 

const setup = async () => {
  const identity = await Libp2pCryptoIdentity.fromString(config.libp2pkey)
  const key: KeyInfo = {
    key: config.bucketKey,
    secret: ''
    }
  // Use the insecure key to setup a new session
  const buckets = await Buckets.withKeyInfo(key)
  // Authorize the user and your insecure keys with getToken
  await buckets.getToken(identity) 

   const root = await buckets.open('io.textile.dropzone')
   if (!root) {
     throw new Error('Failed to open bucket')
   }
   const bucket = buckets
   const bucketKey = root.key

   const index = {
    author: identity.public.toString(),
    date: (new Date()).getTime(),
    paths: [],
  }
  // Store the index in the Bucket (or in the Thread later)
  const buf = Buffer.from(JSON.stringify(index, null, 2))
  const path = `index.json`
  const resp = await buckets.pushPath(bucketKey, path, buf)
  console.log(resp)
 }

const insertFile = async (file: any) : Promise<PushPathResult> => {
    const path = '/ipfs/'+config.path
    const identity = await Libp2pCryptoIdentity.fromString(config.libp2pkey)
    const key: KeyInfo = {
      key: config.bucketKey,
      secret: ''
      }
    // Use the insecure key to setup a new session
    const buckets = await Buckets.withKeyInfo(key)
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity) 
  
     const root = await buckets.open('io.textile.dropzone')
     if (!root) {
       throw new Error('Failed to open bucket')
     }
     const bucket = buckets
     const bucketKey = root.key

     return new Promise((resolve, reject) => {
        
          const binaryStr = file
          // Finally, push the full file to the bucket
          buckets.pushPath(bucketKey, path, binaryStr).then((raw) => {
            resolve(raw)
          })
        
      })
}


app.post('/post', async(req, res) => {
    const key = config.libp2pkey
    const image = req.body.image
    const resp = await insertFile(image)
    //res.send({cid: resp.path.cid.toString()})
    const cipherId = await CryptoJS.AES.encrypt(resp.path.cid.toString(), key).toString()
    res.json({cid: cipherId.replace(/\+/g, 'xMl3Jk').replace(/\//g,'Por21Ld').replace(/=/g,'Ml32')})
})

app.get('/photo/:id', async(req, res) => {
    const key = config.libp2pkey
    const id = req.params.id
    const bytes = await CryptoJS.AES.decrypt(id.replace(/\+/g, 'xMl3Jk').replace(/\//g,'Por21Ld').replace(/=/g,'Ml32'), key)
    const originalText = await bytes.toString(CryptoJS.enc.Utf8)
    const url = 'https://'+originalText+'.ipfs.hub.textile.io'
    console.log(url)
    const resp = await axios.get(url).catch((err: any) => {res.send('error')})
    res.render('display.ejs', {img: resp.data});
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Server running!');
  });

