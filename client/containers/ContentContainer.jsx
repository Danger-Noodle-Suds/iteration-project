import React from "react";
import Calendar from "../components/Calendar";
import Questionnaire from "../components/Questionnaire";

function ContentContainer({
  email,
  firstName,
  age,
  missedLogin,
  addiction,
  moodHistory,
  setMoodHistory,
  setJournalHistory,
  set
}) {
  return (
    <div className="content-container">
      <div id="greeting">
        <p>Welcome back {firstName}.</p>
        <p>It's been {missedLogin} days since you've last logged on.</p>
        <p>You can beat {addiction}. You've got this!</p>
      </div>
      <Questionnaire
        addiction={addiction}
        setMoodHistory={setMoodHistory}
        email={email}
        setJournalHistory={setJournalHistory}
      />
      <Calendar moodHistory={moodHistory} />
    </div>
  );
}

export default ContentContainer;
