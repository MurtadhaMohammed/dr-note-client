import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "./components";
import { FaArrowLeft } from "react-icons/fa";

import "./css/app.css";
import "./css/custom.css";
import {
  HomeScreen,
  AttachmentsScreen,
  ChekupScreen,
  DrugsScreen,
} from "./screens";
import { Button } from "antd";

import { HashRouter as Router, Switch, Route, useLocation } from "react-router-dom";

const SreachComponent = () => (
  <div className="search-box">
    <img src={require("./assets/search.svg")} />
    <input placeholder="Search for list . . ." />
  </div>
);

const GoBackComponent = () => (
  <div style={{ display: "inline-block" }}>
    <Button type="text" icon={<FaArrowLeft />} />
    <span
      style={{
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 20,
        marginTop: -5,
      }}
    >
      مصطفى سلام نوري
    </span>
  </div>
);

function App() {
  //let location = useLocation();
  useEffect(()=>{

    
     console.log(location.hash)
  },[location.hash])
  return (
    <Router>
      <AppContainer head={SreachComponent()}>
        <Switch>
          <Route path="/patients/:id">
            <ChekupScreen />
          </Route>
          <Route path="/drugs">
            <DrugsScreen />
          </Route>
          <Route path="/attachements">
            <AttachmentsScreen />
          </Route>
          <Route path="/">
            <HomeScreen />
          </Route>
        </Switch>
      </AppContainer>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
