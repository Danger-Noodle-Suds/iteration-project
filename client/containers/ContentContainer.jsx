import React from 'react';
import EntryCalendar from '../components/EntryCalendar';
import Questionnaire from '../components/Questionnaire';
import './../styles/styles.scss';

function ContentContainer({
  email,
  firstName,
  age,
  missedLogin,
  addiction,
  moodHistory,
  setMoodHistory,
  setJournalHistory,
}) {
  if(!missedLogin){
    const loginCheck =  (
      <p>Another consecutive day logged! Keep it up!</p>
    )
  } else if(missedLogin === 1){
    const loginCheck = (
      <p>Missed you yesterday! Glad you're back!</p>
    )
  } else {
    const loginCheck = (
      <p>It's been {missedLogin} days since you last logged. Glad You're back!</p>
    )
  }
  return (
    <div className="content-container">
      <div id="greeting">
        <p>Welcome back {firstName}.</p>
        {loginCheck}
        <p>You can beat {addiction}. You've got this!</p>
      </div>
      <Questionnaire
        addiction={addiction}
        setMoodHistory={setMoodHistory}
        email={email}
        setJournalHistory={setJournalHistory}
      />
      <div id="calendarDiv" style={{ width: '50vw', margin: '0 auto' }}>
        <EntryCalendar />
      </div>
    </div>
  );
}

export default ContentContainer;
