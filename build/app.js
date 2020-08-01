"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
;
global.WebSocket = require('isomorphic-ws');
var firebase = __importStar(require("firebase/app"));
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
var hub_1 = require("@textile/hub");
var threads_core_1 = require("@textile/threads-core");
var express = require("express");
var multer = require('multer');
var axios = require('axios');
var CryptoJS = require('crypto-js');
var upload = multer({ dest: 'uploads/' });
var bodyParser = require('body-parser');
var config = require('../config.js');
// Create a new express application instance
var app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
var firebaseConfig = {
    apiKey: config.firebaseAPI,
    authDomain: config.firebaseauthDomain,
    databaseURL: config.firebaseDbUrl,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebasemsgId,
    appId: config.firebaseAppId
};
firebase.initializeApp(firebaseConfig);
// const identity = async() => {
//     const lidentity = await Libp2pCryptoIdentity.fromRandom()
//     console.log(lidentity.toString())
// }
// identity()
var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var identity, key, buckets, root, bucket, bucketKey, index, buf, path, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, threads_core_1.Libp2pCryptoIdentity.fromString(config.libp2pkey)];
            case 1:
                identity = _a.sent();
                key = {
                    key: config.bucketKey,
                    secret: ''
                };
                return [4 /*yield*/, hub_1.Buckets.withKeyInfo(key)
                    // Authorize the user and your insecure keys with getToken
                ];
            case 2:
                buckets = _a.sent();
                // Authorize the user and your insecure keys with getToken
                return [4 /*yield*/, buckets.getToken(identity)];
            case 3:
                // Authorize the user and your insecure keys with getToken
                _a.sent();
                return [4 /*yield*/, buckets.open('io.textile.dropzone')];
            case 4:
                root = _a.sent();
                if (!root) {
                    throw new Error('Failed to open bucket');
                }
                bucket = buckets;
                bucketKey = root.key;
                index = {
                    author: identity.public.toString(),
                    date: (new Date()).getTime(),
                    paths: [],
                };
                buf = Buffer.from(JSON.stringify(index, null, 2));
                path = "index.json";
                return [4 /*yield*/, buckets.pushPath(bucketKey, path, buf)];
            case 5:
                resp = _a.sent();
                console.log(resp);
                return [2 /*return*/];
        }
    });
}); };
var insertFile = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var path, identity, key, buckets, root, bucket, bucketKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = '/ipfs/' + config.path;
                return [4 /*yield*/, threads_core_1.Libp2pCryptoIdentity.fromString(config.libp2pkey)];
            case 1:
                identity = _a.sent();
                key = {
                    key: config.bucketKey,
                    secret: ''
                };
                return [4 /*yield*/, hub_1.Buckets.withKeyInfo(key)
                    // Authorize the user and your insecure keys with getToken
                ];
            case 2:
                buckets = _a.sent();
                // Authorize the user and your insecure keys with getToken
                return [4 /*yield*/, buckets.getToken(identity)];
            case 3:
                // Authorize the user and your insecure keys with getToken
                _a.sent();
                return [4 /*yield*/, buckets.open('io.textile.dropzone')];
            case 4:
                root = _a.sent();
                if (!root) {
                    throw new Error('Failed to open bucket');
                }
                bucket = buckets;
                bucketKey = root.key;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var binaryStr = file;
                        // Finally, push the full file to the bucket
                        buckets.pushPath(bucketKey, path, binaryStr).then(function (raw) {
                            resolve(raw);
                        });
                    })];
        }
    });
}); };
app.post('/post', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function makeid(length) {
        return __awaiter(this, void 0, void 0, function () {
            var result, characters, charactersLength, i;
            return __generator(this, function (_a) {
                result = '';
                characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                charactersLength = characters.length;
                for (i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return [2 /*return*/, result];
            });
        });
    }
    var key, image, resp, cipherId, id, dbresp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = config.libp2pkey;
                image = req.body.image;
                return [4 /*yield*/, insertFile(image)
                    //res.send({cid: resp.path.cid.toString()})
                ];
            case 1:
                resp = _a.sent();
                return [4 /*yield*/, CryptoJS.AES.encrypt(resp.path.cid.toString(), key).toString()];
            case 2:
                cipherId = _a.sent();
                return [4 /*yield*/, makeid(8)];
            case 3:
                id = _a.sent();
                return [4 /*yield*/, firebase.database().ref(id).set({
                        cid: cipherId
                    })];
            case 4:
                dbresp = _a.sent();
                res.json({ rid: id });
                return [2 /*return*/];
        }
    });
}); });
app.get('/photo/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, rid, cid, bytes, originalText, url, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = config.libp2pkey;
                rid = req.params.id;
                return [4 /*yield*/, firebase.database().ref(rid).once('value').then(function (snapshot) {
                        var details = snapshot.val();
                        return details.cid;
                    })];
            case 1:
                cid = _a.sent();
                return [4 /*yield*/, CryptoJS.AES.decrypt(cid, key)];
            case 2:
                bytes = _a.sent();
                return [4 /*yield*/, bytes.toString(CryptoJS.enc.Utf8)];
            case 3:
                originalText = _a.sent();
                url = 'https://' + originalText + '.ipfs.hub.textile.io';
                return [4 /*yield*/, axios.get(url).catch(function (err) { res.send('error'); })];
            case 4:
                resp = _a.sent();
                res.render('display.ejs', { img: resp.data });
                return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
