import { faThinkPeaks } from '@fortawesome/free-brands-svg-icons';
import { faAward, faCalendarWeek, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react'
import { IBillboard, IBillboardInfo } from '../model/billboardManager';

interface IBillboardBox {
    billboardInfo: IBillboardInfo;
}

export const BillboardBox: React.FC<IBillboardBox> = ({ billboardInfo }) => {

    function getPositionChange(billboard: IBillboard) {
        return billboard.position.positionLastWeek - billboard.rank;
    }

    return (
        <div>
            {billboardInfo.hot != null ?
                (<div className="billboard-box">
                    <div className="billboard-text">Hot 100</div>
                    <div className="billboard-second-row">
                        <div className="position-box" title="Jelenlegi"><FontAwesomeIcon icon={faAward} />{billboardInfo.hot.rank}</div>
                        <div className="peak-box" title="Legmagasabb"><FontAwesomeIcon icon={faThinkPeaks} />{billboardInfo.hot.position.peakPosition}</div>
                        <div className="week-box" title="Ennyi hete"><FontAwesomeIcon icon={faCalendarWeek} />{billboardInfo.hot.position.weeksOnChart}</div>
                        {billboardInfo.hot.position.positionLastWeek != null && getPositionChange(billboardInfo.hot) !== 0 ?
                            (<div className="change-box" title="Helyezés változása">
                                {getPositionChange(billboardInfo.hot) > 0 ?
                                    (<FontAwesomeIcon icon={faChevronUp} style={{ color: "green" }} />) :
                                    (<FontAwesomeIcon icon={faChevronDown} style={{ color: "red" }} />)}
                                {Math.abs(getPositionChange(billboardInfo.hot))}
                            </div>) :
                            (<div className="change-box" title="Helyezés változása">-</div>)}
                    </div>
                </div>) :
                (<Fragment></Fragment>)}
            {billboardInfo.top != null ?
                (<div className="billboard-box">
                    <div className="billboard-text">Top 200 Global</div>
                    <div className="billboard-second-row">
                        <div className="position-box" title="Billboard jelenlegi helyezés"><FontAwesomeIcon icon={faAward} />{billboardInfo.top.rank}</div>
                        <div className="peak-box" title="Legmagasabb"><FontAwesomeIcon icon={faThinkPeaks} />{billboardInfo.top.position.peakPosition}</div>
                        <div className="week-box" title="Ennyi hete"><FontAwesomeIcon icon={faCalendarWeek} />{billboardInfo.top.position.weeksOnChart}</div>
                        {billboardInfo.top.position.positionLastWeek != null && getPositionChange(billboardInfo.top) !== 0 ?
                            (<div className="change-box" title="Helyezés változása">
                                {getPositionChange(billboardInfo.top) > 0 ?
                                    (<FontAwesomeIcon icon={faChevronUp} style={{ color: "green" }} />) :
                                    (<FontAwesomeIcon icon={faChevronDown} style={{ color: "red" }} />)}
                                {Math.abs(getPositionChange(billboardInfo.top))}
                            </div>) :
                            (<div className="change-box" title="Helyezés változása">-</div>)}
                    </div>
                </div>) :
                (<Fragment></Fragment>)}
            {billboardInfo.artist != null ?
                (<div className="billboard-box">
                    <div className="billboard-text">Top 100 Artist</div>
                    <div className="billboard-second-row">
                        <div className="position-box" title="Billboard jelenlegi helyezés"><FontAwesomeIcon icon={faAward} />{billboardInfo.artist.rank}</div>
                        <div className="peak-box" title="Legmagasabb"><FontAwesomeIcon icon={faThinkPeaks} />{billboardInfo.artist.position.peakPosition}</div>
                        <div className="week-box" title="Ennyi hete"><FontAwesomeIcon icon={faCalendarWeek} />{billboardInfo.artist.position.weeksOnChart}</div>
                        {billboardInfo.artist.position.positionLastWeek != null && getPositionChange(billboardInfo.artist) !== 0 ?
                            (<div className="change-box" title="Helyezés változása">
                                {getPositionChange(billboardInfo.artist) > 0 ?
                                    (<FontAwesomeIcon icon={faChevronUp} style={{ color: "green" }} />) :
                                    (<FontAwesomeIcon icon={faChevronDown} style={{ color: "red" }} />)}
                                {Math.abs(getPositionChange(billboardInfo.artist))}
                            </div>) :
                            (<div className="change-box" title="Helyezés változása">-</div>)}
                    </div>
                </div>) :
                (<Fragment></Fragment>)}
            {billboardInfo.allTimeArtist != null ?
                (<div className="one-line-bill">
                    <div className="billboard-text">Greatest of All Time Artist</div>
                    <div className="one-line-position" title="Billboard jelenlegi helyezés">
                        <div className="one-line-container">
                            <FontAwesomeIcon icon={faAward} />{billboardInfo.allTimeArtist.rank}
                        </div>
                    </div>
                </div>) :
                (<Fragment></Fragment>)}
        </div>
    )
}

export default BillboardBox;