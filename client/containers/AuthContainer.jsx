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
  emergencyContactName,
  emergencyContactPhone,
  setEmergencyContactName,
  setEmergencyContactPhone,
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
        emergencyContactName={emergencyContactName}
        emergencyContactPhone={emergencyContactPhone}
        setEmergencyContactName={setEmergencyContactName}
        setEmergencyContactPhone={setEmergencyContactPhone}
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
        setEmergencyContactName={setEmergencyContactName}
        setEmergencyContactPhone={setEmergencyContactPhone}
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
