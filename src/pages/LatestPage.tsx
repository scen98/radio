import React from 'react'
import Latest from '../components/Latest'

export default function LatestPage() {
    return (
        <div className="main">
            <h2 className="title">Legújabb</h2>
            <Latest limit={30} />
        </div>
    )
}
