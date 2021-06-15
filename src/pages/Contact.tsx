import React from 'react'

export default function Contact() {
    return (
        <div className="contact-box">
            <h2 className="title">Kapcsolat</h2>
            <h3>Felhívás</h3>
            <p>
                Az oldal nem profitszerzési célból működik. Létrejötte a rádiózás és a webfejlesztés iránti érdeklődés eredménye.
                Ebből az okból kifolyólag megkérjük az oldal minden látogatóját, hogy azt ne terjessze széles nyilvánosság felé. Ha szeretné felvenni az oldal készítőivel a kapcsolatot, azt a feltüntetett e-mail címek egyikével tegye meg. 
            </p>
            <h3>Elérhetőség</h3>
            <ul>
                <li>sphagettivid@gmail.com</li>
                <li>sandor.z.bence@gmail.com</li>
            </ul>
            <p>
                A rádió adást készíti: <b>Medvegy Dávid</b>
            </p>
            <p>Honlap fejlesztése</p>
            <ul>
                <li>Szerver oldali fejlesztés: <b>Medvegy Dávid</b></li>
                <li>Kliens oldali fejlesztés: <b>Sándor Bence</b></li>
            </ul>
        </div>
    )
}
