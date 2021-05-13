import React from "react";



function JournalEntryCard (props) {
    return (
        <div className="entryCard">
            <p>Date: {props.date}</p>
            <p>Journal Entry: {props.entry}</p>
        </div>
    )
}

export default JournalEntryCard;