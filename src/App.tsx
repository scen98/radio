/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import './App.css';
import BillboardProvider from './BillboardProvider';
import Footer from './components/Footer';
import Header from './components/Header';
import Player, { EPlayMode } from './components/Player';
import { useAsyncReference, useHeight } from './customHooks';
import { getCaller } from './model/caller';
import { displayTrackText, IApiTrackResponse, ITrack, trackFactory } from './model/track';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import HistoryPage from './pages/HistoryPage';
import Home from './pages/Home';
import LatestPage from './pages/LatestPage';
import MostPopularPage from './pages/MostPopularPage';
import ShowPage from './pages/ShowPage';
import { getParameter } from './urlManager';
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from './components/globalStyles';
import { saveNightMode } from './model/nightMode';
import { isNightModeOn as nightMode } from "./model/nightMode";

export const lighTheme = {
  body: "linear-gradient(to right, rgba(43,145,147,1), rgba(47,113,171,1))",
  shadow: "white",
  mainRow: "linear-gradient(to right, #78ffd6, #a8ff78);",
  color: "black",
  secondaryRow: "linear-gradient(to right, #29ffc6, #20e3b2, #0cebeb);",
  time: "linear-gradient(to right, #6E48AA, #9D50BB)",
  player: "rgba(125, 115, 201, 0.93);",
  fontColor: "rgba(166, 236, 126, 1);",
  textShadow: "rgb(12, 139, 0)",
  mobileHeader: "linear-gradient(to right, #a044ff, #6a3093)"
}

export const darkTheme = {
  body: "linear-gradient(to right, #232526, #192531);",
  shadow: "white",
  mainRow: "linear-gradient(to right, #1f2852, #8d1919, #8d1919, #1f2852); ",
  color: "white",
  secondaryRow: "linear-gradient(to left, #421046, #6f0000);",
  time: "linear-gradient(to left, #642b73, #a82f58, #642b73)",
  player : "linear-gradient(to bottom, rgba(155, 40, 78, 0.93), rgba(100, 43, 115, 0.93))",
  fontColor: "#db5582;",
  textShadow: "#833896",
  mobileHeader: "linear-gradient(to right, #a82f58, #642b73, #a82f58)"
}

function App() {
  const [currentWindowState, listenHeight] = useHeight([{ name: "normal", maxValue: 100000 }, { name: "mini", maxValue: 150 }]);
  const [pageDataCaller, signal] = getCaller("/radio/api/pagedataapi.php");
  const [pageData, setPageData] = useAsyncReference([]); //így emlékszik a setInterval
  const [streamURL, setStreamURL] = useState("");
  const [playMode, setPlayMode] = useState<EPlayMode>(EPlayMode.Normal);
  const [theme, setTheme] = useState(lighTheme);

  useEffect(() => {
    listenHeight();
    requestPageData();
    requestConfig();
    if(nightMode()){
      setTheme(darkTheme);
    } else {
      setTheme(lighTheme);
    }
    const timerId = setInterval(async () => {
      const newTracks = trackFactory(await pageDataCaller("/radio/api/pagedataapi.php"));
      if (toUpdate(newTracks)) setPageData(newTracks);
    }, 10 * 1000);
    return () => {
      signal.abort();
      clearInterval(timerId);
    }
  }, []);

  useEffect(() => {
    if (pageData.current != null) {
      document.title = displayTrackText(pageData.current[1]);
      console.log(displayTrackText(pageData.current[1]))
    } else {
      document.title = "Rádió 1";
    }
  }, [pageData.current]);

  const toUpdate = (newPageData: ITrack[]): boolean => {
    if (newPageData.length < 2 || pageData.current.length < 2) return false;
    if (newPageData[0].trackId !== pageData.current[0].trackId || newPageData[1].trackId !== pageData.current[1].trackId) return true;
    return false;
  }

  const requestPageData = async () => {
    const newPageData: IApiTrackResponse = await pageDataCaller("/radio/api/pagedataapi.php");
    if (newPageData != null) {
      setPageData(trackFactory(newPageData));
    }
  }

  const requestConfig = async () => {
    const config = await pageDataCaller("/radio/api/config.json");
    if (config != null) {
      setStreamURL(config.streamURL);
    }
  }

  useEffect(() => {
    if (currentWindowState.name === "mini") {
      setPlayMode(EPlayMode.Mini);
    } else {
      setPlayMode(EPlayMode.Normal);
    }
  }, [currentWindowState]);

  function isNightModeOn(isOn: boolean){
    if(isOn){
      setTheme(darkTheme);
    } else {
      setTheme(lighTheme);
    }
    saveNightMode(isOn);
  }

  return (
    <Router>
      <ThemeProvider theme={theme} >
        <GlobalStyles />
        {currentWindowState.name !== "mini" ?
          (<BillboardProvider>
            <Header currentTrack={pageData.current[1]} nextTrack={pageData.current[0]} isNightModeOn={theme === darkTheme} setIsNightModeOn={(isOn)=> { isNightModeOn(isOn) }  } />
            <Switch>
              <Route exact path="/radio" render={() => <Home pageData={pageData.current} />} />
              <Route exact path="/radio/history" render={() => <HistoryPage key={`${getParameter("kereses")}-${getParameter("datum")}`} />} />
              <Route exact path="/radio/nepszeru" component={MostPopularPage} />
              <Route exact path="/radio/uj" component={LatestPage} />
              <Route exact path="/radio/fo-oldal" render={() => <Home pageData={pageData.current} />} />
              <Route exact path="/radio/musor" render={() => <ShowPage pageData={pageData.current} />} />
              <Route exact path="/radio/kapcsolat" component={Contact} />
              <Route exact path="/radio/admin" component={Admin} />
            </Switch>
            <Footer />
          </BillboardProvider>) :
          (<Fragment></Fragment>)}
        <Player streamURL={streamURL} currentTrack={pageData.current[1]} nextTrack={pageData.current[0]} playMode={playMode} />
      </ThemeProvider>
    </Router>
  );
}

export default App;