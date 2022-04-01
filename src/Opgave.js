import React, {useState, useEffect} from 'react'

import {db} from './firebase/Firebase'
import {doc, getDoc} from "firebase/firestore"
import {storage} from "./firebase/Firebase"

import {ref, getDownloadURL} from "firebase/storage"

import {useRouteMatch} from "react-router-dom"
import moment from "moment-timezone"

const Opgave = () => {
    const [dezeRonde, setDezeRonde] = useState(null)
    const [clip, setClip] = useState("")
    const [clipUrl, setClipUrl] = useState("")
    const [start, setStart] = useState(null)
    const [toelichting, setToelichting] = useState(null)
    const [bonus, setBonus] = useState(false)
    const [titel, setTitel] = useState(null)
    const [artiest, setArtiest] = useState(null)
    const [spotify, setSpotify] = useState(null)
    const [rondeantwoord, setRondeantwoord] = useState(null)

    let rondeMatch = useRouteMatch({
        path: '/ronde/:rondenummer',
        strict: true,
        sensitive: true
    })

    useEffect(() => {
            if (document.getElementById("antwoord")) {
                document.getElementById("antwoord").style.display = "none"
            }
        }, [rondeMatch, dezeRonde]
    )

    useEffect(() => {
        if (rondeMatch && (parseInt(rondeMatch.params.rondenummer, 10) >= 730 || parseInt(rondeMatch.params.rondenummer, 10) < 1)) {
            window.location = '/'
        }
    }, [rondeMatch])

    useEffect(() => {
        if (rondeMatch) {
            setDezeRonde(parseInt(rondeMatch.params.rondenummer, 10))
        } else {
            setDezeRonde(730)
        }

        const fetchData = async () => {
            const r = await getDoc(doc(db, "rondes", `${dezeRonde}`))
            if (r.data()) {
                r.data().clip && setClip(r.data().clip)
                let newStart = moment(r.data().start)
                setStart(newStart.format("dddd D MMMM YYYY HH:mm[u]"))
                r.data().artiest && setArtiest(r.data().artiest)
                r.data().titel && setTitel(r.data().titel)
                r.data().spotify_id && setSpotify(r.data().spotify_id)
                r.data().toelichting && setToelichting(r.data().toelichting)
                r.data().bonus && setBonus(r.data().bonus)
                if (dezeRonde < 730 && r.data().antwoord && r.data().bonus) setRondeantwoord(r.data().antwoord)
            }
            return true
        }
        if (!rondeMatch || (rondeMatch && Number(rondeMatch.params.rondenummer < 730))) fetchData()
    }, [rondeMatch, dezeRonde])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const snapshot = await getDoc(doc(db, "clips", clip))
    //         if (snapshot.exists()) {
    //             let data = snapshot.data()
    //             setTitel(data.titel)
    //             setArtiest(data.artiest)
    //             setYoutube(data.youtube)
    //         }
    //         return true
    //     }
    //     if (dezeRonde < 730 && clip) fetchData()
    //
    // }, [clip, dezeRonde])

    useEffect(() => {
        const fetchData = async () => {
            if (clip !== "") {
                setClipUrl(await getDownloadURL(ref(storage, `audio/${clip}.mp3`)))
            } else {
                setClipUrl("")
            }
            return true
        }
        fetchData()
    }, [clip])

    return <div className="content" style={bonus ? {border: '5px red double 4px'} : {border:'1px gold dotted 4px'}}>
        {dezeRonde <= 730 && dezeRonde > 0 &&
            <>
                {bonus ?
                    <h3 className='bonus'>Bonusronde <span className="oranje">{dezeRonde}</span> van {start}</h3>
                    :
                    <h3>Ronde <span className="oranje">{dezeRonde}</span> van {start}</h3>
                }
                {toelichting &&
                    <p>
                        {toelichting}
                    </p>
                }
                <h4 style={{color: 'orange'}}>Let op: dit is een oude ronde. Je kan geen antwoord meer insturen.</h4>
                <p>
                    {clipUrl !== "" &&
                        <audio controls src={clipUrl} type="audio/mp3"/>
                    }
                </p>
                <p onClick={() => document.getElementById("antwoord").style.display = "block"}
                   style={{cursor: "pointer"}}>Klik hier om het antwoord op deze opgave te tonen</p>
                <p id="antwoord" style={{display: "none"}}>Antwoord:<br/>
                    {bonus ?
                        <b>{titel}</b>
                        :
                        <><b>{artiest} - {titel}</b><br/>&nbsp;<br/>
                            <iframe
                                title='spotify'
                                src={`https://embed.spotify.com/?uri=spotify:track:${spotify}?view=list&amp;size=compact`}
                                style={{width: 300, height: 80, border: 0}}/>
                        </>

                    }
                </p>
            </>
        }
    </div>
}

export default Opgave