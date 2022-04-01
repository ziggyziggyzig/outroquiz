import {useRouteMatch} from "react-router-dom"
import React, {useEffect, useState} from "react"
import {doc, getDoc, getDocs, query, collection, where} from "firebase/firestore"
import {db} from "./firebase/Firebase"
import {Rondelink} from "./Links"

import moment from "moment"

const Speler = ({deviceWidth}) => {
    const [spelerId, setSpelerId] = useState(null)
    const [statsInzendingenAantal, setStatsInzendingenAantal] = useState(null)
    // const [statsInzendingenSeries, setStatsInzendingenSeries] = useState([])
    // const [statsInzendingenSpeed, setStatsInzendingenSpeed] = useState([])
    const [statsInzendingenWins, setStatsInzendingenWins] = useState(null)
    const [eersteInzending, setEersteInzending] = useState([])
    // const [huidigeRonde, setHuidigeRonde] = useState(null)
    const [bonusrondes, setBonusrondes] = useState(null)

    const padLeadingZeroes = (num, size, str) => {
        let s = num + "";
        while (s.length < size) s = str + s;
        return s;
    }

    let spelerMatch = useRouteMatch({
        path: '/speler/:spelerid',
        strict: true,
        sensitive: true
    })

    useEffect(() => {
        if (spelerMatch && spelerMatch.params.spelerid) {
            setSpelerId(spelerMatch.params.spelerid)
        }
    }, [spelerMatch])

    useEffect(() => {
            const fetchData = async () => {
                // const statsInzendingenAantalSnap = await getDoc(doc(db, "stats", "inzendingen", "aantal", spelerId))
                // if (statsInzendingenAantalSnap.exists()) {
                //     let data = statsInzendingenAantalSnap.data()
                //     setStatsInzendingenAantal(data.count)
                // }
                //
                const spelerSnap = await getDoc(doc(db, "spelers", spelerId))
                if (spelerSnap.exists()) {
                    let data = spelerSnap.data()
                    setBonusrondes(data.bonus || null)
                }

                // const statsInzendingenSeriesSnap = await getDocs(query(collection(db, "stats", "inzendingen", "series"), where("gebruiker", "==", spelerId)))
                // let statsInzendingenSeriesToState = []
                // statsInzendingenSeriesSnap.forEach(doc => statsInzendingenSeriesToState.push(doc.data()))
                // statsInzendingenSeriesToState.sort((a, b) => a.serie[0] - b.serie[0])
                // setStatsInzendingenSeries(statsInzendingenSeriesToState)
                //
                // const statsInzendingenSpeedSnap = await getDocs(query(collection(db, "stats", "inzendingen", "speed"), where("gebruiker", "==", spelerId)))
                // let statsInzendingenSpeedToState = []
                // statsInzendingenSpeedSnap.forEach(doc => statsInzendingenSpeedToState.push(doc.data()))
                // statsInzendingenSpeedToState.sort((a, b) => {
                //     if (a.speed === b.speed) {
                //         return a.ronde - b.ronde
                //     }
                //     return a.speed - b.speed
                // })
                // setStatsInzendingenSpeed(statsInzendingenSpeedToState.slice(0, 5))
                //
                // const statsInzendingenWinsSnap = await getDoc(doc(db, "stats", "winnaars", "aantal", spelerId))
                // if (statsInzendingenWinsSnap.exists()) {
                //     let data = statsInzendingenWinsSnap.data()
                //     setStatsInzendingenWins(data.count)
                // } else {
                //     setStatsInzendingenWins(0)
                // }
                //
                const inzendingenSnap = await getDocs(query(collection(db, "inzendingen"), where("gebruiker", "==", spelerId)))
                let inzendingen = []
                let overwinningen=0
                inzendingenSnap.forEach(doc => {
                    let data = doc.data()
                    if (data.punten > 0) {
                        inzendingen.push(data)
                    }
                    if (data.punten%10===0) {
                        overwinningen++
                    }
                })
                inzendingen.sort((a, b) => a.timestamp - b.timestamp)
                setEersteInzending({
                        ...inzendingen[0],
                        tijdstip: moment.unix(Math.floor(inzendingen[0].timestamp / 1000)).format("dd D MMMM YYYY HH:mm.ss")
                    }
                )
                setStatsInzendingenAantal(inzendingen.length)
                setStatsInzendingenWins(overwinningen)
            }

            if (spelerId) fetchData()

        }, [spelerId]
    )


    return <div className="content">
        {spelerId &&
            <>
                <h3>@{spelerId}</h3>
                <table className={`scoretabel ${deviceWidth < 640 ? 'scoretabelklein' : ''}`}>
                    <tbody>
                    {eersteInzending.tijdstip &&
                        <tr key='eersteAntwoord'>
                            <td style={{textAlign: 'right', width: '40%'}}>Eerste juiste antwoord:&nbsp;</td>
                            <td style={{textAlign: 'left', width: '60%'}}>&nbsp;{eersteInzending.tijdstip} (<Rondelink
                                text='ronde' ronde={eersteInzending.ronde}/>)
                            </td>
                        </tr>
                    }
                    {statsInzendingenAantal !== null &&
                        <tr key='statsScoresAantal'>
                            <td style={{textAlign: 'right', width: '40%'}}>Aantal juiste antwoorden:&nbsp;</td>
                            <td style={{
                                textAlign: 'left',
                                width: '60%'
                            }}>&nbsp;{padLeadingZeroes(statsInzendingenAantal, 3, String.fromCharCode(160))}</td>
                        </tr>
                    }
                    {bonusrondes !== null &&
                        <tr key='bonusrondes'>
                            <td style={{textAlign: 'right', width: '40%'}}>waarvan in bonusrondes:&nbsp;</td>
                            <td style={{
                                textAlign: 'left',
                                width: '60%'
                            }}>&nbsp;{padLeadingZeroes(bonusrondes, 3, String.fromCharCode(160))}</td>
                        </tr>
                    }
                    {statsInzendingenWins !== null &&
                        <tr key='statsScoresWins'>
                            <td style={{textAlign: 'right', width: '40%'}}>Aantal overwinningen:&nbsp;</td>
                            <td style={{
                                textAlign: 'left',
                                width: '60%'
                            }}>&nbsp;{padLeadingZeroes(statsInzendingenWins, 3, String.fromCharCode(160))}</td>
                        </tr>
                    }
                    {/*{statsInzendingenSpeed.length > 0 &&*/}
                    {/*    <tr key='statsScoresSpeed'>*/}
                    {/*        <td style={{textAlign: 'right', width: '40%', verticalAlign: 'top'}}>Snelste*/}
                    {/*            antwoorden:&nbsp;<br/>*/}
                    {/*            <i style={{fontSize: '0.6em'}}>(u:m:s)</i>&nbsp;&nbsp;</td>*/}
                    {/*        <td style={{textAlign: 'left', width: '60%'}}>{*/}
                    {/*            statsInzendingenSpeed.map(s =>*/}
                    {/*                <Fragment*/}
                    {/*                    key={s.speed}>&nbsp;*/}
                    {/*                    {moment.utc(s.speed).format('H:mm.ss')}*/}
                    {/*                    <span*/}
                    {/*                        style={{fontSize: '0.6em'}}>.{padLeadingZeroes(s.speed - (Math.floor(s.speed / 1000) * 1000), 3, '0')}&nbsp;</span>*/}
                    {/*                    (<Rondelink*/}
                    {/*                        text='ronde' ronde={s.ronde}/>)<br/>*/}
                    {/*                </Fragment>*/}
                    {/*            )*/}
                    {/*        }*/}
                    {/*        </td>*/}
                    {/*    </tr>*/}
                    {/*}*/}
                    {/*{statsInzendingenSeries.length > 0 &&*/}
                    {/*    <>*/}
                    {/*        <tr key='statsScoresSeries'>*/}
                    {/*            <td style={{textAlign: 'right', width: '40%', verticalAlign: 'top'}}>Series juiste*/}
                    {/*                antwoorden:&nbsp;</td>*/}
                    {/*            <td style={{textAlign: 'left', width: '60%'}}>{*/}
                    {/*                statsInzendingenSeries.map(s =>*/}
                    {/*                    <Fragment key={`${s.serie[0]}`}>&nbsp;*/}
                    {/*                        {padLeadingZeroes(s.serie.length, 3, String.fromCharCode(160))}x*/}
                    {/*                        (rondes <Rondelink ronde={s.serie[0]}/> t/m <Rondelink*/}
                    {/*                            ronde={s.serie[s.serie.length - 1]}/>{s.serie[s.serie.length - 1] === huidigeRonde && '*'})<br/>*/}
                    {/*                    </Fragment>*/}
                    {/*                )*/}
                    {/*            }*/}
                    {/*            </td>*/}
                    {/*        </tr>*/}
                    {/*        <tr>*/}
                    {/*            <td colSpan={2}>*/}
                    {/*                <br/>*/}
                    {/*                * lopende serie*/}
                    {/*            </td>*/}
                    {/*        </tr>*/}
                    {/*    </>*/}
                    {/*}*/}
                    </tbody>
                </table>
            </>
        }
    </div>
}

export default Speler