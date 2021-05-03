import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import createHistory from 'history/createBrowserHistory';

import HomePage from "./components/Homepage/Homepage"
import Meeting from "./components/MeetingScrren/Meeting"
import NotFound from "./components/NotFound/NotFound"
import "./App.css"

const history=createHistory();

function App() {

  return (
       <Router history={history}>
       <Switch>
       <Route exact path="/" component={HomePage} />
       <Route path="/instantMeeting/:roomId" component={Meeting} />
       <Route path='*' component={NotFound} />
        </Switch>
       </Router>
  )
}

export default App
