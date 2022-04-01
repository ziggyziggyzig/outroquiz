import {Link} from "react-router-dom"
import Prijzen from "./Prijzen"

const scrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    return true
}

export const Rondelink = ({text, ronde}) =>
    text ?
        <Link to={`/ronde/${ronde}`} onClick={() => scrollToTop()}
              className='linkslink'>{<>{text}&nbsp;</>}{ronde}</Link>
        :
        <Link to={`/ronde/${ronde}`} onClick={() => scrollToTop()} className='linkslink'>{ronde}</Link>

export const Spelerlink = ({speler, prijzen = true}) =>
    <><Link to={`/speler/${speler}`} onClick={() => scrollToTop()} className='linkslink'>@{speler}</Link>
        {prijzen && <Prijzen gebruiker={speler}/>}</>

