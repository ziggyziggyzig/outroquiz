import React, {useEffect, useState} from 'react'
import {query, collection, where, getDocs} from "firebase/firestore"

import {db} from "./firebase/Firebase"

import {useRouteMatch} from "react-router-dom"

import {Spelerlink} from "./Links"

const Klassement = () => {
    const [dezeRonde, setDezeRonde] = useState(null)
    const [scores, setScores] = useState([])

    let rondeMatch = useRouteMatch({
        path: '/ronde/:rondenummer',
        strict: true,
        sensitive: true
    })

    useEffect(() => {
        if (rondeMatch) {
            setDezeRonde(rondeMatch.params.rondenummer)
        } else {
            setDezeRonde(730)
        }
    }, [rondeMatch])

    useEffect(() => {
        const fetchData = async () => {
            let nieuweScores = []
            let snapshot = await getDocs(query(collection(db, "klassementen"), where("ronde", "==", parseInt(dezeRonde, 10))))
            for (let doc of snapshot.docs) {
                nieuweScores.push(doc.data())
            }
            nieuweScores.sort((a, b) => a.regel > b.regel ? 1 : -1)
            setScores(nieuweScores)
        }
        fetchData()
    }, [dezeRonde])

    return <div className="content">
        <h3>Klassement na deze ronde</h3>
        <hr className="scorelijn"/>
        {scores.length > 0 && <table className="scoretabel">
                <thead>
                <tr>
                    <td>#</td>
                    <td>naam</td>
                    <td>punten</td>
                    <td>winsten</td>
                    <td>kopposities</td>
                </tr>
                </thead>
                <tbody>

                {scores.map((score, i) =>
                    <tr key={i}>
                        <td>{((i>0 && scores[i-1].positie!==score.positie) || i===0) && score.positie}</td>
                        <td><Spelerlink speler={score.speler}/></td>
                        <td>{score.punten}</td>
                        <td>{score.winsten}</td>
                        <td>{score.kopposities}</td>
                    </tr>
                )}
                </tbody>
            </table>

        }
        {dezeRonde>14 && <p className="scoretabelklein">* alleen de punten uit de laatste 14 rondes telden mee voor het klassement.</p>}
    </div>
}

export default Klassement