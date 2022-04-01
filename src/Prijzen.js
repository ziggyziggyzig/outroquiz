import {useEffect, useState} from "react"
import {collection, getDocs, query, limit, orderBy, getDoc, doc} from "firebase/firestore"
import {db} from "./firebase/Firebase"

const Prijzen = ({gebruiker}) => {
    const [snelste, setSnelste] = useState(false)
    const [meeste, setMeeste] = useState(false)
    const [winste, setWinste] = useState(false)
    const [serie,setSerie]=useState(false)
    // const [valreep, setValreep] = useState(false)
    const [bonus, setBonus] = useState(0)

    useEffect(() => {
        const fetchData = async () => {

            // snelste
            let qSnelste = query(collection(db, 'stats', 'inzendingen', 'speed'), orderBy('speed', 'asc'), limit(1))
            let sSnelste = await getDocs(qSnelste)
            sSnelste.forEach(doc => {
                let data = doc.data()
                if (data.gebruiker === gebruiker) setSnelste(true)
                return true
            })

            // meeste
            let qMeeste = query(collection(db, 'stats', 'inzendingen', 'aantal'), orderBy('count', 'desc'), limit(5))
            let sMeeste=await getDocs(qMeeste)
            let vorigeCount

            sMeeste.forEach(doc=>{
                let data=doc.data()
                if (!vorigeCount || data.count===vorigeCount) {
                    data.gebruiker === gebruiker && setMeeste(true)
                }
                else {
                    return true
                }
                vorigeCount=data.count
                return true
            })

            // winst
            let qWinste = query(collection(db, 'stats', 'winnaars', 'aantal'), orderBy('count', 'desc'), limit(5))
            let sWinste=await getDocs(qWinste)
            vorigeCount=undefined

            sWinste.forEach(doc=>{
                let data=doc.data()
                if (!vorigeCount || data.count===vorigeCount) {
                    data.gebruiker === gebruiker && setWinste(true)
                }
                else {
                    return true
                }
                vorigeCount=data.count
                return true
            })

            // serie
            let qSerie = query(collection(db, 'stats', 'inzendingen', 'series'), orderBy('lengte', 'desc'), limit(5))
            let sSerie=await getDocs(qSerie)
            vorigeCount=undefined

            sSerie.forEach(doc=>{
                let data=doc.data()
                if (!vorigeCount || data.lengte===vorigeCount) {
                    data.gebruiker === gebruiker && setSerie(true)
                }
                else {
                    return true
                }
                vorigeCount=data.lengte
                return true
            })

            // bonus
            let qBonus = query(doc(db, 'spelers', gebruiker))
            let sBonus=await getDoc(qBonus)
            if (sBonus.data().bonus) {
                setBonus(sBonus.data().bonus)
            }
            return true
        }

        fetchData()
    }, [gebruiker])

    return (
        <>
            {snelste && <i className="far fa-clock prijs" title='Snelste antwoord ooit'/>}
            {meeste && <i className="far fa-check-square prijs" title='Meeste juiste antwoorden'/>}
            {winste && <i className="fas fa-trophy prijs" title='Meeste rondewinsten'/>}
            {serie && <i className="fas fa-sync-alt prijs" title='Langste serie antwoorden'/>}
            {/*{<i className="fa-regular fa-alarm-clock prijs"/>}*/}
            {[...Array(bonus)].map((e,i)=><i className="far fa-star prijsje" key={i} title='Bonusronde beantwoord'/>)}
        </>
    )
}

export default Prijzen