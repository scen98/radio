import React from 'react'
import MostPopular from '../components/MostPopular'

export default function MostPopularPage() {
    return (
        <div className="main">
            <h2 className="title">Népszerű</h2>
            <MostPopular limit={30} />
        </div>
    )
}
