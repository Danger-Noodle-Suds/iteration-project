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
      />
      <div id="calendarDiv" style={{ width: '50vw', margin: '0 auto' }}>
        <EntryCalendar />
      </div>
    </div>
  );
}

export default ContentContainer;
