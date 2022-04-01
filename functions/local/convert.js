const {db_fb} = require('../outside_connections/firebase/client')
const {BigBatch} = require("@qualdesk/firestore-big-batch")

const dms = require('./dms.json')
const spelers = require('./players.json')
const rondes = require('./rounds.json')
const klassementen = require('./standings.json')
const superrondes = require('./superrounds.json')
const leftovers = require('./vault.json')

const moment = require("moment-timezone")

const convert_spelers = () =>
    new Promise(async (resolve, reject) => {
        let data = spelers[2].data
        let batch = new BigBatch({firestore: db_fb})
        for (let s of data) {
            let {twittername} = s
            batch.set(db_fb.collection('spelers').doc(twittername),
                {
                    speler: twittername
                },
                {merge: true}
            )
        }
        batch.commit()
            .then(() => resolve(true))
    })

const convert_dms = () =>
    new Promise((resolve) => {
        let data = dms[2].data
        let batch = new BigBatch({firestore: db_fb})
        for (let d of data) {
            let beoordeling = parseInt(d.correctness, 10) || 0
            let gebruiker = d.twittername
            let ronde = parseInt(d.round_id, 10) || 0
            let tekst = d.text || ''
            let timestamp = parseInt(moment.tz(d.time, "Europe/Amsterdam").tz("UTC").add(parseInt(d.time_sub, 10), 'milliseconds').format("x"), 10)
            let punten = parseInt(d.points, 10) || 0
            let newData = {
                beoordeling: beoordeling,
                gebruiker: gebruiker,
                ronde: ronde,
                tekst: tekst,
                timestamp: timestamp,
                punten: punten
            }
            // console.log(newData)
            batch.set(db_fb.collection('inzendingen').doc(String(timestamp)),
                newData,
                {merge: true}
            )
        }
        batch.commit()
            .then(() => resolve(true))
    })

const convert_rondes = () =>
    new Promise((resolve) => {
        let data = rondes[2].data
        let batch = new BigBatch({firestore: db_fb})
        for (let d of data) {
            let newData = {
                clip: d.filename === 'xxxxxxxxxxxxxxxx' ? null : d.filename,
                artiest: d.artist,
                titel: d.title,
                start: d.datetime,
                ronde: parseInt(d.id, 10),
                spotify_id: d.spotify_id === '' ? null : d.spotify_id,
                jaar: d.year === '0' ? null : parseInt(d.year, 10),
                toelichting: d.remarks === '' ? null : d.remarks,
                bonus: d.superround === '1'
            }
            console.log(newData)
            batch.set(db_fb.collection('rondes').doc(d.id),
                newData,
                {merge: true}
            )
        }
        batch.commit()
            .then(() => resolve(true))
    })

const convert_klassementen = () =>
    new Promise((resolve) => {
        let data = klassementen[2].data
        let batch = new BigBatch({firestore: db_fb})
        for (let d of data) {
            let newData = {
                regel: parseInt(d.line_id, 10),
                ronde: parseInt(d.round_id, 10),
                positie: parseInt(d.position, 10),
                speler: d.twittername,
                punten: parseInt(d.points, 10),
                winsten: parseInt(d.wins, 10),
                kopposities: parseInt(d.leads, 10)
            }
            console.log(newData)
            batch.set(db_fb.collection('klassementen').doc(d.line_id),
                newData,
                {merge: true}
            )
        }
        batch.commit()
            .then(() => resolve(true))
    })

const convert_superrondes = () =>
    new Promise((resolve) => {
        let data = superrondes[2].data
        let batch = new BigBatch({firestore: db_fb})
        for (let d of data) {
            let newData = {
                ronde: parseInt(d.id, 10),
                volgnummer: parseInt(d.clip, 10),
                clip: d.filename,
                toelichting: d.pretext === "" ? null : d.pretext,
                antwoord: d.answer === "" ? null : d.answer,
                artiest: d.artist === "" ? null : d.artist,
                titel: d.title === "" ? null : d.title,
                letter: d.letter === "" ? null : d.letter
            }
            console.log(newData)
            batch.set(db_fb.collection('superrondes').doc(`${d.id}_${d.clip}`),
                newData,
                {merge: true}
            )
        }
        batch.commit()
            .then(() => resolve(true))
    })

const convert_leftovers = () =>
    new Promise((resolve) => {
        let data = leftovers[2].data
        let batch = new BigBatch({firestore: db_fb})
        for (let d of data) {
            let newData = {
                clip: d.filename,
                artiest: d.artist,
                titel: d.title,
                spotify_id: d.spotify_id === '' ? null : d.spotify_id,
                jaar: d.year === '0' ? null : parseInt(d.year, 10)
            }
            console.log(newData)
            batch.set(db_fb.collection('leftovers').doc(d.filename),
                newData,
                {merge: true}
            )
        }
        batch.commit()
            .then(() => resolve(true))
    })
