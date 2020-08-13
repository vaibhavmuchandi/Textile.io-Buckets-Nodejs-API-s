# Textile.io-Buckets-Nodejs-API-s

### How does this work ?
You can send base64 or bytearray of image to the '/post' route as formData. That image will be then uploaded to Inter Planetary File System (IPFS) via [Textile.io's Bucket Hub](https://textile.io).
The cid of the image from IPFS is then encrypted and stored in a database. In response on the client side, you will receive a rid. That rid can then be used to view the image.
'https://hosting_url/photo/rid' is where you can view the image.

### Why were these API's developed ? 
This package was a dependency for eAarogya Portal for Electronic Health Record Management, winning solution developed during Smart India Hackathon 2020 for Ministry of Health and Family
Welfare, GOI. It was used to store medical images.

### How to use :

```
1. Clone the repo

2. In the root of the project directory run 'npm install'

3. Run 'npm run tsc' - This app uses Typescript express-js.

4. Run 'node build/app.js', the server will then start on port 3000 or env-port

5. Incase any changes done in app/app.ts, you are required to repeat the step 3 again.

```

##### Can be used on Heroku at [https://earogya-ipfs.herokuapp.com](https://earogya-ipfs.herokuapp.com)

### Built with

• [Textile.io](https://textile.io)

• [Nodejs](https://nodejs.org)

### Author
**Vaibhav Muchandi** - [vaibhavmuchandi](https://github.com/vaibhavmuchandi)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
