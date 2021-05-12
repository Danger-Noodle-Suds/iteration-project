import React, { useState } from "react";

function Questionnaire({ addiction, setMoodHistory, email }) {
  const [mood, setMood] = useState(() => "");
  const [todayMood, setTodayMood] = useState(() => false);
  const [journal, setTodayJournal] = useState("")
  const moodvals = [];

  function moodSetter (vals) {
    for(i = 0; i < vals.length; i ++){
      
    };
  };
  function sendJournal() {
    
      fetch("/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, journal }),
      })
        .then((data) => data.json())
        .then((response) => {
          setMoodHistory(response.journalHistory);
          setTodayMood(true);
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
      <span>
         <select className="c-options" name="mood" placeholder="Mood"  value={mood || ""}>
                    <option className="c-options" value="" selected="true" disabled="disabled">How are you feeling today?</option>
                    <option className="c-options" value="5">Excellent!</option>
                    <option className="c-options" value="4">Pretty Good</option>
                    <option className="c-options" value="3">Not Bad</option>
                    <option className="c-options" value="2">Could Be Better</option>
                    <option className="c-options" value="1">Not Doing Well</option>
         </select>
      </span>
      {/* <span>
        <input
          type="radio"
          id="unwell"
          value="unwell"
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="unwell">Unwell</label>
        <input
          type="radio"
          id="neutral"
          value="neutral"
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="neutral">Neutral</label>
        <input
          type="radio"
          id="great"
          value="great"
          name="mood"
          onChange={(e) => setMood(e.target.value)}
        ></input>
        <label htmlFor="great">Great</label>
      </span>
      <p>Describe your day :</p>
      <textarea rows="5" cols="30"></textarea> */}
      <button type="submit" onClick={() => sendMood()}>
        Submit
      </button>
    </div>
  );
  const journal = (
    <div>
      <textarea rows="5" cols="30" placeholder="Please Write Your Thoughts On Today" onChange={(e) => setJournal(e.target.value)}></textarea>
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
        {journal}
      </div>
    </div>
  );
}

export default Questionnaire;
