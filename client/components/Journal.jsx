import React, { useState } from "react";
import JournalEntryCard from "./JournalEntryCard";
function Journal({ setJournalHistory, email, journalHistory }) {
  const [entry, setJournal] = useState("")
  const journalEntries = [
    {date: "2021-12-5",
    entry: "Test entry 1"},
    {date: "2021-11-5",
    entry: "Test entry 2"},
    {date: "2021-10-5",
    entry: "Test entry 3"},
    {date: "2021-9-5",
    entry: "Test entry 4"},
    {date: "2021-8-5",
    entry: "Test entry 5"},
    {date: "2021-7-5",
    entry: "Test entry 6"},
    {date: "2021-6-5",
    entry: "Test entry 7"},
  ];
  // for (let i = 0; i < journalHistory.length; i++){
  //   journalEntries.push(
  //     <JournalEntryCard
  //     date={journalHistory[i].date}
  //     entry={journalHistory[i].entry}
  //     />
  //   )
  // };
  function sendJournal() {
    
      fetch("/user/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entry }),
      })
        .then((data) => data.json())
        .then((res) => {
          setJournalHistory(res.journalHistory);
        });
  }
  const journalEntry = (
    <div>
      <textarea maxLength="2000" rows="5" cols="30" placeholder="Please Write Your Thoughts On Today" onChange={(e) => setJournal(e.target.value)}></textarea>
      <button type="submit" onClick={() => sendJournal()}>
        Submit
      </button>
    </div>
  );

  return (
    <div className="journalContainer">
      <div className="entryContainer">
        <div className="journal">
          <p>Please, Journal Some Thoughts From Today. You May Enter As Many As You Like.
          (This is kept confidential)
          </p>
          {/* <p>(This is kept confidential)</p> */}
          {journalEntry}
        </div>
      </div>
      <div className="entries">
          {journalEntries.map(data=> <JournalEntryCard
        date={data.date}
        entry={data.entry}
        />)}
        </div>
    </div>
  );
}

export default Journal;
