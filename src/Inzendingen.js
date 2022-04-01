import React, {useEffect, useState} from 'react'
import {query, collection, where, getDocs} from "firebase/firestore"

import {db} from "./firebase/Firebase"

import {useRouteMatch} from "react-router-dom"

import {Spelerlink} from "./Links"
import moment from "moment-timezone"

const Inzendingen = ({deviceWidth}) => {
    const [dezeRonde, setDezeRonde] = useState(null)
    const [inzendingen, setInzendingen] = useState([])
    const [datumFormaat, setDatumFormaat] = useState("dddd HH:mm.ss")

    let rondeMatch = useRouteMatch({
        path: '/ronde/:rondenummer',
        strict: true,
        sensitive: true
    })

    useEffect(() => {
        if (deviceWidth < 600) {
            setDatumFormaat("dd HH:mm.ss")
        }
    }, [deviceWidth])

    useEffect(() => {
        if (rondeMatch) {
            setDezeRonde(rondeMatch.params.rondenummer)
        } else {
            setDezeRonde(730)
        }
    }, [rondeMatch])

    useEffect(() => {
        const fetchData = async () => {
            let nieuweInzendingen = []
            let snapshot = await getDocs(query(collection(db,"inzendingen"),where("ronde","==",parseInt(dezeRonde,10))))
            for (let doc of snapshot.docs) {
                let data = doc.data()
                if (data.punten && data.punten > 0) {
                    nieuweInzendingen.push({id: doc.id, ...doc.data()})
                }
            }
            nieuweInzendingen.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
            setInzendingen(nieuweInzendingen)
        }

        if (dezeRonde > 0 && dezeRonde <= 730) fetchData()
    }, [dezeRonde])


    const padLeadingZeros = (num, size) => {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    return <div className="content">

            <h3>Scores</h3>
            <hr className="scorelijn"/>
            {inzendingen.length > 0 ? <table className="scoretabel">
                    <thead>
                    <tr>
                        <td>#</td>
                        <td>naam</td>
                        <td>tijdstip</td>
                    </tr>
                    </thead>
                    <tbody>

                    {inzendingen.map((inzending, i) =>
                        inzending.timestamp &&
                        <tr key={inzending.timestamp}>
                            <td>{i + 1}</td>
                            <td><Spelerlink speler={inzending.gebruiker}/></td>
                            <td>{moment.unix(Math.floor(inzending.timestamp / 1000)).format(datumFormaat)}<span
                                style={{fontSize: '0.6em'}}>.{padLeadingZeros(inzending.timestamp - (Math.floor(inzending.timestamp / 1000) * 1000), 3)}</span>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                :
                <span>nog geen goede antwoorden ontvangen</span>
            }
            <hr className="scorelijn"/>
            {inzendingen.length > 0 && <>Aantal: {inzendingen.length}</>}
    </div>
}

export default Inzendingen