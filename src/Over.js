import React from 'react'

const Over = () => {
    function toggleCollapse(elementId) {
        let ele = document.getElementById(elementId);
        if (ele.style.display === "block") {
            ele.style.display = "none";
        } else {
            ele.style.display = "block";
        }
    }

    return <div className="content over">
        <h3>
            Dit is <i>ziggy's videoclipgifquiz</i>.
        </h3>
        <p>
            Raad de titel en artiest bij een stukje videoclip.<br/>
            Je kan niets winnen, het gaat om het plezier en om de eer.<br/>
            In tegenstelling tot de outroquiz, worden er geen punten uitgedeeld.
        </p>
        <p>
            Een ronde start elke dag om 20:15u, je hebt tot het begin van de volgende ronde de tijd om je antwoord te
            geven.
        </p>
        <p>
            Geef je antwoord via een DM, een privébericht, op Twitter. Je krijgt automagisch antwoord. Je kan ook op de
            site zelf je antwoord insturen: klik linksboven op het Twittericoontje om in te loggen. Vervolgens
            verschijnt er onder de opgave een antwoordinvulding.
        </p>
        <p>
            Mocht je antwoord onterecht worden afgekeurd, laat het even weten en ik kijk er naar. Ik kan het
            antwoordapparaat overrulen en je antwoord alsnog goedkeuren.
        </p>
        {/*<p>*/}
        {/*    Als je dagelijks een reminder wil ontvangen dat de nieuwe ronde bijna begint, stuur dan een DM met de tekst*/}
        {/*    "#reminder aan" (vergeet het #-teken niet!). Je krijgt dan iedere dag rond acht uur een DM ter*/}
        {/*    herinnering.<br/>*/}
        {/*    Om te zien of de reminder op dit moment aan of uit staat, stuur je een DM met alleen "#reminder" (vergeet*/}
        {/*    weer het #-teken niet).*/}
        {/*</p>*/}
        <p>
            Deze quiz is een vervolg op de <i>outroquiz</i>, die van 15 januari 2017 tot 15 januari 2019 liep. Alle
            opgaves en scores uit die quiz zijn bewaard gebleven en worden op een later tijdstip weer in een website
            opgenomen.
        </p>
        <p>
            Vragen, opmerkingen, suggesties? Je kan me vinden op Twitter, gebruikersnaam <a
            href="https://twitter.com/ziggyziggyzig" target="_new">@ziggyziggyzig</a>.
        </p>
        <h4 className="statsKop" onClick={() => toggleCollapse("FAQ")}>FAQ</h4>
        <p className="oranje" onClick={() => toggleCollapse("FAQ")}>(klik om te bekijken)</p>
        <div id="FAQ" className="statsLijst">
            <p>
                <i><b>Waarom krijg ik zo traag antwoord van het antwoordapparaat?</b></i>
            </p>
            <p>
                <i><b>Wat betekenen de symbolen rechtsboven?</b></i>
            </p>
            <p>
                Met de pijltjes rechtsboven kun je bladeren naar oude rondes. Met het huisje ga je altijd weer terug
                naar de
                huidige opgave.
            </p>
            <p>
                <i><b>Waarom knippert er rechtsboven soms een symbool in het rood?</b></i>
            </p>
            <p>
                Als je een oude ronde aan het bekijken bent op het moment dat een nieuwe ronde start, gaat het huisje
                rood
                knipperen, om aan te geven dat het tijd is om de nieuwe opgave te bekijken. Klik op het huisje voor de
                nieuwste opgave.
            </p>
            <p>
                <i><b>Wat betekenen de symbooltjes achter de namen van de deelnemers?</b></i>
            </p>
            <p>
                Dat zijn symbooltjes die verdiend kunnen worden door bijvoorbeeld het snelste antwoord ooit te geven of
                de meeste goede antwoorden op rij te geven. Een sterretje verdien je met een goed antwoord in een
                bonusronde. Bonusrondes komen elke 100 dagen langs.
            </p>
            <p style={{fontSize: "0.8em"}}>
                De frontend van deze quiz draait op React en maakt o.a. gebruik van moment-timezone, normalize.css,
                react-router-dom en Google Fonts.<br/>
                De backend draait op Node.js en maakt o.a. gebruik van @bountyrush/firestore, express, moment-timezone
                en twitter-lite.<br/>
                Deze hele quiz wordt gehost door Firebase.
            </p>
        </div>
    </div>
}

export default Over