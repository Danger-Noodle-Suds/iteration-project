import React from "react";
import Signup from "../components/SignupPage";
import Login from "../components/Login";

function AuthContainer({
  authtype,
  firstName,
  setFirstName,
  age,
  setAge,
  email,
  setEmail,
  password,
  setPassword,
  contactName,
  contactPhone,
  setContactName,
  setContactPhone,
  missedLogin,
  setMissedLogin,
  addiction,
  setAddiction,
  setMoodHistory,
  setJournalHistory,
  setIsLoggedIn,
}) {
  const renderThis = [];
  if (authtype === "signup") {
    renderThis.push(
      <Signup
        key="signup"
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
    );
  } else if (authtype === "login") {
    renderThis.push(
      <Login
        key="signup"
        setFirstName={setFirstName}
        setAge={setAge}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setContactName={setContactName}
        setContactPhone={setContactPhone}
        setMissedLogin={setMissedLogin}
        addiction={addiction}
        setAddiction={setAddiction}
        setMoodHistory={setMoodHistory}
        setJournalHistory={setJournalHistory}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  return (
    <div className="auth-container">
      <section id="inputFields">{renderThis}</section>
    </div>
  );
}

export default AuthContainer;
