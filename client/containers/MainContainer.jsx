import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "../components/Navbar";
import AuthContainer from "./AuthContainer";
import ContentContainer from "./ContentContainer";
import HomepageContainer from "../components/HomepageContainer";
import Journal from "../components/Journal";

function MainContainer() {
  const [firstName, setFirstName] = useState(() => "");
  const [age, setAge] = useState(() => 0);
  const [email, setEmail] = useState(() => "");
  const [password, setPassword] = useState(() => "");
  const [contactName, setContactName] = useState(() => "");
  const [contactPhone, setContactPhone] = useState(() => 0);
  const [missedLogin, setMissedLogin] = useState(() => 0);
  const [addiction, setAddiction] = useState(() => "");
  const [isLoggedIn, setIsLoggedIn] = useState(() => false);
  const [moodHistory, setMoodHistory] = useState(() => []);
  const [journalHistory, setJournalHistory] = useState(() => [])

  return (
    <div className="main-container">
      <Router>
        <NavBar
          setFirstName={setFirstName}
          age={age}
          contactName={contactName}
          contactPhone={contactPhone}
          setContactName={setContactName}
          setContactPhone={setContactPhone}
          missedLogin={missedLogin}
          addiction={addiction}
          moodHistory={moodHistory}
          isLoggedIn={isLoggedIn}
          journalHistory={journalHistory}
        />

        <Switch>
          <Route path="/login" exact>
            <AuthContainer
              authtype="login"
              setFirstName={setFirstName}
              setAge={setAge}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              setContactName={setContactName}
              setContactPhone={setContactPhone}
              setMissedLogin={setMissedLogin}
              setAddiction={setAddiction}
              setIsLoggedIn={setIsLoggedIn}
              setMoodHistory={setMoodHistory}
              setJournalHistory={setJournalHistory}
            />
          </Route>
        </Switch>
        <Switch>
          <Route path="/signup" exact>
            <AuthContainer
              authtype="signup"
              firstName={firstName}
              setFirstName={setFirstName}
              age={age}
              setAge={setAge}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              contactName={contactName}
              contactPhone={contactPhone}
              setContactName={setContactName}
              setContactPhone={setContactPhone}
              missedLogin={missedLogin}
              setMissedLogin={setMissedLogin}
              addiction={addiction}
              setAddiction={setAddiction}
            />
          </Route>
        </Switch>
        <Switch>
          <Route path="/user" exact>
            <ContentContainer
              email={email}
              firstName={firstName}
              age={age}
              contactName={contactName}
              contactPhone={contactPhone}
              setContactName={setContactName}
              setContactPhone={setContactPhone}
              missedLogin={missedLogin}
              addiction={addiction}
              moodHistory={moodHistory}
              setMoodHistory={setMoodHistory}
              setJournalHistory={setJournalHistory}
              isLoggedIn={isLoggedIn}
            />
          </Route>
        </Switch>
        <Switch>
          <Route path="/journal" exact>
            <Journal
              email={email}
              firstName={firstName}
              age={age}
              contactName={contactName}
              contactPhone={contactPhone}
              setContactName={setContactName}
              setContactPhone={setContactPhone}
              missedLogin={missedLogin}
              addiction={addiction}
              moodHistory={moodHistory}
              setMoodHistory={setMoodHistory}
              setJournalHistory={setJournalHistory}
              journalHistory={journalHistory}
              isLoggedIn={isLoggedIn}
            />
          </Route>
        </Switch>
        <Switch>
          <Route path="/" exact>
            <HomepageContainer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default MainContainer;
