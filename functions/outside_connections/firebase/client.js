require("dotenv").config({path: '../../.env'})

const admin = require('firebase-admin')
const {Firestore} = require("@bountyrush/firestore")

admin.initializeApp({
    credential: admin.credential.cert(
        require(`../../outroquiz-firebase-adminsdk-7ugiu-37955e731f.json`)
    ),
    storageBucket: "outroquiz.appspot.com"
})

exports.db = new Firestore(admin)

exports.db_fb = admin.firestore()

exports.storage = admin.storage()
