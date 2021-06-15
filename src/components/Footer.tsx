import { useState, useEffect } from 'react'
import { useWidth } from '../customHooks'

export default function Footer() {
	const [windowState, listen, cleanUp] = useWidth([{ name: "mobile", maxValue: 800 }, { name: "desktop", maxValue: 100000 }]);
	const [mainClass, setMainClass] = useState("warningdiv");
	useEffect(()=>{
		listen();
		return ()=>{
			cleanUp();
		}
	}, []);
    return (
        <div className={mainClass}>
			<div className="footer-grid">
				<div className="warningcell">
					<h1>Figyelem!</h1>
					<p>
					Az oldalon <b>nem az igazi Rádió 1 adása hallható!</b> Ez egy rajongói oldal saját műsorokkal, saját adásgépről.<br />
					Az oldal bármiféle terjesztése <b>tilos!</b> (Kérlek, ne linkeld ki sehova...)<br />
					Az igazi Rádió 1-et itt találod: <a  href="http://www.radio1.hu/" rel="noreferrer" target="_blank">radio1.hu</a><br />
					Bármilyen problémával kapcsolatban kérlek, vedd fel velem a kapcsolatot itt: <b>sphagettivid@gmail.com</b>
					</p>
					<br />
				</div>
				<div className="warningcell">
					<a href="http://www.radio1.hu/" target="_blank" rel="noreferrer" ><img src="/radio/page_elements/frequency_map.png" className="map" alt="Map"/></a>
				</div>
			</div>			
		</div>
    )
}
