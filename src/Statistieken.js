import React, {useEffect, useState} from 'react'
import {collection, query, orderBy, onSnapshot, limit, doc} from "firebase/firestore"
import {db} from "./firebase/Firebase"
import {Rondelink, Spelerlink} from "./Links"
import moment from "moment"

const Statistieken = () => {
    const [inzendingenAantal, setInzendingenAantal] = useState([])
    const [inzendingenSpeed, setInzendingenSpeed] = useState([])
    const [inzendingenValreep, setInzendingenValreep] = useState([])
    const [winnaarsAantal, setWinnaarsAantal] = useState([])
    const [inzendingenSeries, setInzendingenSeries] = useState([])
    const [rondesMeeste, setRondesMeeste] = useState([])
    const [rondesMinste, setRondesMinste] = useState([])
    const [update, setUpdate] = useState(null)
    const [inzendingenTotaal, setInzendingenTotaal] = useState(null)
    const [gebruikersTotaal, setGebruikersTotaal] = useState(null)
    const [winnaarsTotaal, setWinnaarsTotaal] = useState(null)
    const [slowStarters, setSlowStarters] = useState([])
    const [huidigeRonde, setHuidigeRonde] = useState(null)
    const [clipsStatuses, setClipsStatuses] = useState([])

    const padLeadingZeroes = (num, size) => {
        let s = num + "";
        while (s.length < size) s = '0' + s;
        return s;
    }

    function toggleCollapse(elementId) {
        let ele = document.getElementById(elementId);
        if (ele.style.display === "block") {
            ele.style.display = "none";
        } else {
            ele.style.display = "block";
        }
    }

    useEffect(() => {
        const q = query(doc(db, "tellers", "huidige_ronde"))
        const unsub_updatetime = onSnapshot(q, (doc) => {
            let data = doc.data()
            data && data.id && setHuidigeRonde(parseInt(doc.data().id, 10))
        })
        return () => {
            unsub_updatetime()
        }
    })

    useEffect(() => {
        const q = query(collection(db, "stats", "inzendingen", "aantal"), orderBy("gebruiker", "asc"))
        const unsub_inzendingen_aantal = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            toState.sort((a, b) => {
                if (a.count === b.count) {
                    return a.gebruiker.toLowerCase().localeCompare(b.gebruiker.toLowerCase())
                }
                return a.count < b.count ? 1 : -1
            })
            let lastCount = 0
            let counter = 0
            let toState2 = []
            toState.forEach(i => {
                if (counter > 9 && i.count !== lastCount) {
                    return true
                }
                toState2.push(i)
                lastCount = i.count
                counter++
            })
            setInzendingenAantal(toState2)
        })
        return () => {
            unsub_inzendingen_aantal()
        }

    }, [])

    useEffect(() => {
        const q = query(collection(db, "stats", "winnaars", "aantal"), orderBy("count", "desc"))
        const unsub_winnaars_aantal = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            toState.sort((a, b) => {
                if (a.count === b.count) {
                    return a.gebruiker.toLowerCase().localeCompare(b.gebruiker.toLowerCase())
                }
                return a.count < b.count ? 1 : -1
            })
            let lastCount = 0
            let counter = 0
            let toState2 = []
            toState.forEach(i => {
                if (counter > 9 && i.count !== lastCount) {
                    return true
                }
                toState2.push(i)
                lastCount = i.count
                counter++
            })
            setWinnaarsAantal(toState2)
        })
        return () => {
            unsub_winnaars_aantal()
        }

    }, [])

    useEffect(() => {
        const q = query(collection(db, "stats", "winnaars", "speed"), orderBy("speed", "desc"), limit(10))
        const unsub_winnaars_speed = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            setSlowStarters(toState)
        })
        return () => {
            unsub_winnaars_speed()
        }

    }, [])

    useEffect(() => {
        const q = query(collection(db, "stats", "inzendingen", "speed"), orderBy("speed", "asc"), limit(10))
        const unsub_inzendingen_speed = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            setInzendingenSpeed(toState)
        })
        return () => {
            unsub_inzendingen_speed()
        }

    }, [])

    useEffect(() => {
        const q = query(collection(db, "stats", "inzendingen", "speed"), orderBy("speed", "desc"), limit(10))
        const unsub_inzendingen_valreep = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            setInzendingenValreep(toState)
        })
        return () => {
            unsub_inzendingen_valreep()
        }

    }, [])

    useEffect(() => {
        const q = query(collection(db, "stats", "inzendingen", "series"), orderBy("lengte", "desc"))
        const unsub_inzendingen_series = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            toState.sort((a, b) => {
                if (a.lengte === b.lengte) {
                    return a.gebruiker.toLowerCase().localeCompare(b.gebruiker.toLowerCase())
                }
                return a.lengte < b.lengte ? 1 : -1
            })
            let lastLengte = 0
            let counter = 0
            let toState2 = []
            toState.forEach(i => {
                if (counter > 9 && i.lengte !== lastLengte) {
                    return true
                }
                toState2.push(i)
                lastLengte = i.lengte
                counter++
            })
            setInzendingenSeries(toState2)
        })
        return () => {
            unsub_inzendingen_series()
        }

    }, [])

    useEffect(() => {
        const q = query(collection(db, "stats", "rondes", "aantal"), orderBy("count", "desc"))
        const unsub_rondes_aantal = onSnapshot(q, (querySnapshot) => {
            const toState = []
            querySnapshot.forEach(doc => {
                toState.push(doc.data())
            })
            let lastCount = 0
            let counter = 0
            let toState2 = []
            toState.forEach(i => {
                if (counter > 9 && i.count !== lastCount) {
                    return true
                }
                toState2.push(i)
                lastCount = i.count
                counter++
            })
            setRondesMeeste(toState2)
            toState.sort((a, b) => {
                if (a.count === b.count) {
                    return a.ronde < b.ronde
                }
                return a.count > b.count ? 1 : -1
            })
            lastCount = 0
            counter = 0
            let toState3 = []
            toState.forEach(i => {
                if (counter > 9 && i.count !== lastCount) {
                    return true
                }
                toState3.push(i)
                lastCount = i.count
                counter++
            })
            setRondesMinste(toState3)
        })
        return () => {
            unsub_rondes_aantal()
        }

    }, [])

    useEffect(() => {
        const q = query(doc(db, "stats", "inzendingen"))
        const unsub_updatetime = onSnapshot(q, (doc) => {
            let data = doc.data()
            data && data.updated && setUpdate(doc.data().updated)
            data && data.totaal && setInzendingenTotaal(doc.data().totaal)
        })
        return () => {
            unsub_updatetime()
        }

    }, [])

    useEffect(() => {
        const q = query(doc(db, "stats", "gebruikers"))
        const unsubscribe = onSnapshot(q, (doc) => {
            let data = doc.data()
            data && data.totaal && setGebruikersTotaal(doc.data().totaal)
        })
        return () => {
            unsubscribe()
        }

    }, [])

    useEffect(() => {
        const q = query(doc(db, "stats", "winnaars"))
        const unsubscribe = onSnapshot(q, (doc) => {
            let data = doc.data()
            data && data.totaal && setWinnaarsTotaal(doc.data().totaal)
        })
        return () => {
            unsubscribe()
        }

    }, [])

    useEffect(() => {
        const q = query(doc(db, "stats", "clips"))
        const unsub_clips_statuses = onSnapshot(q, (doc) => {
            setClipsStatuses(doc.data())
        })
        return () => {
            unsub_clips_statuses()
        }
    }, [])

    return <div className="content">
        <h3>Statistieken</h3>
        <table className="scoretabel">
            <tbody>
            <tr key='spelerstotaal'>
                <td style={{textAlign: 'right', width: '50%'}}>Totaal aantal spelers&nbsp;</td>
                <td style={{textAlign: 'left', width: '50%'}}>&nbsp;{gebruikersTotaal || null}</td>
            </tr>
            <tr key='winnaarstotaal'>
                <td style={{textAlign: 'right', width: '50%'}}>Aantal verschillende winnaars&nbsp;</td>
                <td style={{textAlign: 'left', width: '50%'}}>&nbsp;{winnaarsTotaal || null}</td>
            </tr>
            <tr key='scorestotaal'>
                <td style={{textAlign: 'right', width: '50%'}}>Totaal aantal juiste antwoorden&nbsp;</td>
                <td style={{textAlign: 'left', width: '50%'}}>&nbsp;{inzendingenTotaal || null}</td>
            </tr>
            <tr key='scoresspelersavg'>
                <td style={{textAlign: 'right', width: '50%'}}>Gemiddeld aantal antwoorden per speler&nbsp;</td>
                <td style={{
                    textAlign: 'left',
                    width: '50%'
                }}>&nbsp;{Math.round(inzendingenTotaal / gebruikersTotaal) || null}</td>
            </tr>
            <tr key='scoresrondesavg'>
                <td style={{textAlign: 'right', width: '50%'}}>Gemiddeld aantal antwoorden per ronde&nbsp;</td>
                <td style={{
                    textAlign: 'left',
                    width: '50%'
                }}>&nbsp;{Math.round(inzendingenTotaal / huidigeRonde) || null}</td>
            </tr>
            <tr key='clips_totaal'>
                <td style={{textAlign: 'right', width: '50%'}}>Totaal aantal clipfragmenten&nbsp;</td>
                <td style={{
                    textAlign: 'left',
                    width: '50%'
                }}>&nbsp;{clipsStatuses['gebruikt'] + clipsStatuses['gepland'] + clipsStatuses['ongebruikt'] || null}</td>
            </tr>
            <tr key='clips_gepland'>
                <td style={{textAlign: 'right', width: '50%'}}><i>waarvan ingepland</i>&nbsp;</td>
                <td style={{
                    textAlign: 'left',
                    width: '50%'
                }}>&nbsp;{clipsStatuses['gepland'] || null}</td>
            </tr>
            <tr key='clips_ongebruikt'>
                <td style={{textAlign: 'right', width: '50%'}}><i>waarvan nog niet ingepland</i>&nbsp;</td>
                <td style={{
                    textAlign: 'left',
                    width: '50%'
                }}>&nbsp;{clipsStatuses['ongebruikt'] || null}</td>
            </tr>
            </tbody>
        </table>
        <hr className="scorelijn"/>
        <h4 className="statsKop" onClick={() => toggleCollapse("winnaarsAantal")}>Spelers
            met de meeste winsten <i className="fas fa-trophy"/></h4>
        {winnaarsAantal.length > 0 && <div id="winnaarsAantal" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>naam</td>
                    <td>aantal winsten</td>
                </tr>
                </thead>
                <tbody>
                {winnaarsAantal.map((inzending) =>
                    <tr key={`${inzending.gebruiker} ${inzending.count}`}>
                        <td><Spelerlink speler={inzending.gebruiker} prijzen={false}/></td>
                        <td>{inzending.count}x</td>
                    </tr>
                )}
                </tbody>
            </table>
            <br/>
            <hr className="scorelijn"/>
        </div>
        }
        <h4 className="statsKop" onClick={() => toggleCollapse("scoresAantal")}>Spelers met de meeste juiste
            antwoorden <i
                className="far fa-check-square"/></h4>
        {inzendingenAantal.length > 0 && <div id="scoresAantal" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>naam</td>
                    <td>aantal scores</td>
                </tr>
                </thead>
                <tbody>
                {inzendingenAantal.map((inzending) =>
                    <tr key={`${inzending.gebruiker} ${inzending.count}`}>
                        <td><Spelerlink speler={inzending.gebruiker} prijzen={false}/></td>
                        <td>{inzending.count}x</td>
                    </tr>
                )}
                </tbody>
            </table>

            <br/>
            <hr className="scorelijn"/>
        </div>
        }
        <h4 className="statsKop" onClick={() => toggleCollapse("scoresSpeed")}>Snelste
            juiste antwoorden <i className="far fa-clock"/></h4>
        {inzendingenSpeed.length > 0 && <div id="scoresSpeed" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>naam</td>
                    <td>ronde</td>
                    <td>snelheid</td>
                </tr>
                </thead>
                <tbody>
                {inzendingenSpeed.map((inzending) =>
                    <tr key={`${inzending.gebruiker} ${inzending.ronde}`}>
                        <td><Spelerlink speler={inzending.gebruiker} prijzen={false}/></td>
                        <td><Rondelink ronde={inzending.ronde}/></td>
                        <td>{Math.floor(inzending.speed / 1000)}<span
                            style={{fontSize: '0.6em'}}>.{padLeadingZeroes(inzending.speed - (Math.floor(inzending.speed / 1000) * 1000), 3)}</span> seconden
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <br/>
            <hr className="scorelijn"/>
        </div>
        }
        <h4 className="statsKop" onClick={() => toggleCollapse("slowStarters")}>Slow starters<br/>
            <span className='oranje' style={{fontSize: '0.8em'}}>(langzaamste overwinningen)</span>
        </h4>
        {slowStarters.length > 0 && <div id="slowStarters" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>naam</td>
                    <td>ronde</td>
                    <td>tijd sinds start van ronde</td>
                </tr>
                </thead>
                <tbody>
                {slowStarters.map((inzending) =>
                    <tr key={`${inzending.gebruiker} ${inzending.ronde}`}>
                        <td><Spelerlink speler={inzending.gebruiker} prijzen={false}/></td>
                        <td><Rondelink ronde={inzending.ronde}/></td>
                        <td>
                            <>{moment.utc(inzending.speed).format('H:mm.ss')}</>
                            <span
                                style={{fontSize: '0.6em'}}>.{padLeadingZeroes(inzending.speed - (Math.floor(inzending.speed / 1000) * 1000), 3)}</span>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <br/>
            <hr className="scorelijn"/>
        </div>
        }

        <h4 className="statsKop" onClick={() => toggleCollapse("scoresValreep")}>
            Op de valreep
        </h4>
        {inzendingenSpeed.length > 0 && <div id="scoresValreep" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>naam</td>
                    <td>ronde</td>
                    <td>tijd tot sluiten ronde</td>
                </tr>
                </thead>
                <tbody>
                {inzendingenValreep.map((inzending) =>
                    <tr key={`${inzending.gebruiker} ${inzending.ronde}`}>
                        <td><Spelerlink speler={inzending.gebruiker} prijzen={false}/></td>
                        <td><Rondelink ronde={inzending.ronde}/></td>
                        <td>{Math.floor((86400000 - inzending.speed) / 1000)}<span
                            style={{fontSize: '0.6em'}}>.{padLeadingZeroes(86400000 - inzending.speed - (Math.floor((86400000 - inzending.speed) / 1000) * 1000), 3)}</span> seconden
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <br/>
            <hr className="scorelijn"/>
        </div>
        }
        <h4 className="statsKop" onClick={() => toggleCollapse("scoresSeries")}>
            Langste serie juiste antwoorden <i className="fas fa-sync-alt"/>
        </h4>
        {inzendingenSeries.length > 0 && <div id="scoresSeries" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>naam</td>
                    <td>aantal antwoorden</td>
                    <td>rondes</td>
                </tr>
                </thead>
                <tbody>
                {inzendingenSeries.map((inzending) =>
                    <tr key={`${inzending.gebruiker}-${inzending.serie[0]}`}>
                        <td><Spelerlink speler={inzending.gebruiker} prijzen={false}/></td>
                        <td>{inzending.serie.length}</td>
                        <td><Rondelink ronde={inzending.serie[0]}/> t/m <Rondelink
                            ronde={inzending.serie[inzending.serie.length - 1]}/>{inzending.serie[inzending.serie.length - 1] === huidigeRonde && '*'}
                        </td>
                    </tr>
                )}
                <tr>
                    <td colSpan={3} style={{textAlign: 'right'}}>
                        <br/>
                        * lopende serie&nbsp;&nbsp;&nbsp;&nbsp;
                    </td>
                </tr>
                </tbody>
            </table>
            <br/>
            <hr className="scorelijn"/>
        </div>
        }
        <h4 className="statsKop" onClick={() => toggleCollapse("rondesMeeste")}>Rondes met de meeste antwoorden</h4>
        {rondesMeeste.length > 0 && <div id="rondesMeeste" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>ronde</td>
                    <td>aantal antwoorden</td>
                </tr>
                </thead>
                <tbody>
                {rondesMeeste.map((inzending) =>
                    <tr key={`${inzending.ronde}`}>
                        <td><Rondelink ronde={inzending.ronde}/></td>
                        <td>{inzending.count}x</td>
                    </tr>
                )}
                </tbody>
            </table>

            <br/>
            <hr className="scorelijn"/>
        </div>
        }
        <h4 className="statsKop" onClick={() => toggleCollapse("rondesMinste")}>Rondes met de minste antwoorden</h4>
        {rondesMinste.length > 0 && <div id="rondesMinste" className="statsLijst">
            <table className="scoretabel">
                <thead>
                <tr>
                    <td>ronde</td>
                    <td>aantal antwoorden</td>
                </tr>
                </thead>
                <tbody>
                {rondesMinste.map((inzending) =>
                    <tr key={`${inzending.ronde}`}>
                        <td>
                            <Rondelink ronde={inzending.ronde}/></td>
                        <td>{inzending.count}x</td>
                    </tr>
                )}
                </tbody>
            </table>
            <br/>
        </div>
        }
        <hr className="scorelijn"/>
        <p className='oranje'>
            Klik op een titel om de lijst te tonen of te verbergen.<br/>
            Statistieken worden om de minuut geüpdated.<br/>
            {update && <>Laatste update: {update} uur.</>}
        </p>
    </div>
}

export default Statistieken