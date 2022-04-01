import React, {useEffect, useState} from 'react'
import {db} from "./firebase/Firebase"

import {getDownloadURL, ref} from "firebase/storage"
import {storage} from "./firebase/Firebase"
import {useRouteMatch} from "react-router-dom"

import moment from "moment-timezone"
import {collection, getDocs, query, where} from "firebase/firestore"

const Navigatie = () => {
    const [headerUrl, setHeaderUrl] = useState(null)
    const [dezeRonde, setDezeRonde] = useState(null)
    const [alert, setAlert] = useState(false)
    const [zoekterm, setZoekterm] = useState(null)
    const [zoekResultaten, setZoekResultaten] = useState([])

    let rondeMatch = useRouteMatch({
        path: '/ronde/:rondenummer',
        strict: true,
        sensitive: true
    })

    useEffect(() => {
        if (rondeMatch) {
            setDezeRonde(parseInt(rondeMatch.params.rondenummer, 10))
        } else {
            setDezeRonde(730)
        }
    }, [rondeMatch])

    useEffect(() => {
        const fetchHeader = async () =>
            setHeaderUrl(await getDownloadURL(ref(storage, `assets/outroquiz_logo.png`)))

        fetchHeader()
    }, [])

    useEffect(() => {
        const zoeken = () => new Promise(async (resolve) => {
            let toState = []
            let clipsSnap = await getDocs(query(collection(db, "rondes")))
            clipsSnap.forEach(clip => {
                if (clip.data().artiest.toLowerCase().includes(zoekterm.toLowerCase()) || clip.data().titel.toLowerCase().includes(zoekterm.toLowerCase()) || String(clip.data().ronde) === zoekterm.toLowerCase()) {
                    toState.push({
                        type: 'ronde',
                        resultaat: clip.data().ronde % 100 === 0 ? `bonusronde` : `${clip.data().artiest} - ${clip.data().titel}`,
                        id: clip.data().ronde
                    })
                }
            })
            let spelerSnap = await getDocs(query(collection(db, "spelers")))
            spelerSnap.forEach(speler => {
                if (speler.id.toLowerCase().includes(zoekterm.toLowerCase()) || speler.data().speler.toLowerCase().includes(zoekterm.toLowerCase())) {
                    toState.push({
                        type: 'speler',
                        resultaat: `@${speler.id}`,
                        id: speler.id
                    })
                }
            })
            return resolve(toState)
        })

        if (zoekterm && zoekterm !== '' && zoekterm.length >= 1) {
            zoeken()
                .then(s => s.sort((a, b) => a.id > b.id ? -1 : 1))
                .then(s => s.sort((a, b) => a.type > b.type ? 1 : -1))
                .then(s => setZoekResultaten(s))
        } else {
            setZoekResultaten([])
        }
    }, [zoekterm])

    return <div className="navigatie" id="top">
        <span className="titel">
            <img src={headerUrl || ''} className="titellogo" alt="outroquiz"
                                     title={`versie ${require("../package.json").version}`}/>
        </span><br/>
        <table className="navigatiepijlen">
            <tbody>
            <tr>
                <td>
                    {dezeRonde > 10 || !dezeRonde ?
                        <i onClick={() => window.location.href = `/ronde/${dezeRonde - 10}`}
                           className="fas fa-angle-double-left navigatiepijl" title="10 rondes terug"/>
                        :
                        dezeRonde <= 10 && dezeRonde > 1 ?
                            <i onClick={() => window.location.href = `/ronde/1`}
                               className="fas fa-angle-double-left navigatiepijl" title="10 rondes terug"/>
                            :
                            <i className="fas fa-angle-double-left navigatiepijldisabled"/>
                    }
                    {dezeRonde > 1 ?
                        <i onClick={() => window.location.href = `/ronde/${dezeRonde - 1}`}
                           className="fas fa-angle-left navigatiepijl" title="vorige ronde"/>
                        :
                        <i className="fas fa-angle-left navigatiepijldisabled"/>
                    }
                    <i onClick={() => window.location.href = `/`}
                       className={`fas fa-home navigatiepijl ${alert && "navigatiepijlknipper"}`}
                       title="huidige ronde"/>
                    {730 - dezeRonde > 1 && dezeRonde && dezeRonde !== 730 ?
                        <i onClick={() => window.location.href = `/ronde/${dezeRonde + 1}`}
                           className="fas fa-angle-right navigatiepijl" title="volgende ronde"/>
                        :
                        730 - dezeRonde === 1 && dezeRonde && dezeRonde !== 730 ?
                            <i onClick={() => window.location.href = `/`}
                               className="fas fa-angle-right navigatiepijl" title="volgende ronde"/>
                            :
                            <i className="fas fa-angle-right navigatiepijldisabled"/>

                    }
                    {dezeRonde && 730 - dezeRonde > 10 && dezeRonde !== 730 ?
                        <i onClick={() => window.location.href = `/ronde/${dezeRonde + 10}`}
                           className="fas fa-angle-double-right navigatiepijl" title="10 rondes vooruit"/>
                        :
                        dezeRonde && 730 - dezeRonde <= 10 && dezeRonde !== 730 ?
                            <i onClick={() => window.location.href = `/`}
                               className="fas fa-angle-double-right navigatiepijl" title="10 rondes vooruit"/>
                            :
                            <i className="fas fa-angle-double-right navigatiepijldisabled"/>
                    }
                </td>
            </tr>
            <tr>
                <td style={{padding: '6px'}}>
                    {/*{spring && spring.length > 0 && <>*/}
                    {/*    naar ronde:&nbsp;*/}
                    {/*    <select className='navInput' onChange={e => window.location.href = `/ronde/${e.target.value}`}>*/}
                    {/*        <option key={0} value={0}/>*/}
                    {/*        {spring.map(i =>*/}
                    {/*            <option key={i} value={i}>{i}</option>*/}
                    {/*        )}*/}
                    {/*    </select>*/}
                    {/*</>*/}
                    {/*}*/}
                    {/*&nbsp;|&nbsp;*/}
                    <span className='navInput' style={{padding: '4px',border:'1px gold dotted'}}><i className="fas fa-search"/>&nbsp;
                        <input type='text' className='navInput' style={{width: '8em'}}
                               onKeyUp={(e) => setZoekterm(String(e.target.value))}/>
                        {zoekResultaten && zoekResultaten.length > 0 && <div className='zoekresultaten'>
                            {zoekResultaten.map(r => {
                                return (r.type === 'ronde' ?
                                        <p key={r.id}>ronde {r.id}: <a className='zoekresultaat'
                                                                       href={`/ronde/${r.id}`}>{r.resultaat}</a></p>
                                        :
                                        r.type === 'speler' && <p key={r.id}>speler: <a className='zoekresultaat'
                                                                                        href={`/speler/${r.id}`}>{r.resultaat}</a>
                                        </p>
                                )
                            })
                            }

                        </div>}
                    </span>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}

export default Navigatie