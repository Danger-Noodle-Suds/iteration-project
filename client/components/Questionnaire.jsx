import React, { useState } from "react";

function Questionnaire({ addiction, setMoodHistory, setJournalHistory, email }) {
  const [mood, setMood] = useState(() => "");
  const [todayMood, setTodayMood] = useState(() => false);
  const [entry, setJournal] = useState("")

  function sendJournal() {
    
      fetch("/user/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entry }),
      })
        .then((data) => data.json())
        .then((response) => {
          setJournalHistory(response.journalHistory);
        });
  }

  function sendMood() {
    
    if (mood && mood !== "") {
      fetch("/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mood }),
      })
        .then((data) => data.json())
        .then((response) => {
          setMoodHistory(response.moodHistory);
          setTodayMood(true);
        });
    }
  }

  const questionnaire = (
    <div>
      {/* <form onSubmit={}>
         <select className="c-options" name="mood" placeholder="Mood"  value={mood || ""}>
                    <option className="c-options" value="" defaultValue={true} disabled="disabled" placeholder="How are you feeling today?">How are you feeling today?</option>
                    <option className="c-options" value={5}>Excellent!</option>
                    <option className="c-options" value={4}>Pretty Good</option>
                    <option className="c-options" value={3}>Not Bad</option>
                    <option className="c-options" value={2}>Could Be Better</option>
                    <option className="c-options" value={1}>Not Doing Well</option>
         </select>
         <input className="submitButton" type="submit" onClick={() => sendMood()}>
        Submit
      </input>
      </form> */}
      <span>
        <input
          type="radio"
          id="unwell"
          value={5}
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="Excellent">Excellent</label>
        <input
          type="radio"
          id="neutral"
          value={4}
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="Pretty Good"> Pretty Good</label>
        <input
          type="radio"
          id="great"
          value={3}
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="Not Bad">Not Bad</label>
        <input
          type="radio"
          id="great"
          value={2}
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="Could Be Better">Could Be Better</label>
        <input
          type="radio"
          id="great"
          value={5}
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="Not Doing Well">Not Doing Well</label>
      </span>
      <button className="submitButton" type="submit" onClick={() => sendMood()}>
        Submit
      </button>
    </div>
  );
  const journalEntry = (
    <div>
      <textarea maxLength="2000" rows="5" cols="30" placeholder="Please Write Your Thoughts On Today" onChange={(e) => setJournal(e.target.value)}></textarea>
      <button type="submit" onClick={() => sendJournal()}>
        Submit
      </button>
    </div>
  );
  const finished = (
    <div>
      <p>You're all checked in for today!</p>
    </div>
  );

  return (
    <div className="entryContainer">
      <div className="questionnaire">
      <p>How Are You Feeling Today?</p>
      {!todayMood ? questionnaire : finished}
      </div>
      <div className="journal">
        <p>Please, Journal Some Thoughts From Today. You May Enter As Many As You Like.
        (This is kept confidential)
        </p>
        {/* <p>(This is kept confidential)</p> */}
        {journalEntry}
      </div>
    </div>
  );
}

export default Questionnaire;
