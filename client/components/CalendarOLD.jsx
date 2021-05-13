import * as React from "react";
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const Frame = styled.div`
  margin-left: 20%;
  margin-top: 10%;
  width: 60%;
  border: 5px #e4ffe1;
  background: VscSmiley;
  /* border-radius: 10px; */
  box-shadow: 2px 2px 2px #eee;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #ffe8c2;
  /* padding: 10px 10px 5px 10px; */
  display: flex;
  justify-content: space-between;
  background-color: #f0a868;
`;

const Button = styled.div`
  cursor: pointer;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Day = styled.div`
  width: 14.2%;
  height: 40px;
  border-bottom: 1px solid #6a8d73;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${(props) =>
    props.isToday &&
    css`
      border: 1px solid #e9ffdb;
      background: lightgrey;
      /* border-bottom: 1px solid #6a8d73; */
    `}

  ${(props) =>
    props.isSelected &&
    css`
      background: ;
    `}

    ${(props) =>
    props.isGreat &&
    css`
      background: #6a8d73;
    `}

    ${(props) =>
    props.isOk &&
    css`
      background: #e9ffdb;
    `}

    ${(props) =>
    props.isNotGreat &&
    css`
      background: #ffe8c2;
    `}
`;

function Calendar({ moodHistory }) {
  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
  }, [date]);

  function getStartDayOfMonth(date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return startDate === 0 ? 7 : startDate;
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days = isLeapYear(date.getFullYear()) ? DAYS_LEAP : DAYS;

  return (
    <Frame>
      <Header>
        <Button onClick={() => setDate(new Date(year, month - 1, day))}>
          Prev
        </Button>
        <div>
          {MONTHS[month]} {year}
        </div>
        <Button onClick={() => setDate(new Date(year, month + 1, day))}>
          Next
        </Button>
      </Header>
      <Body>
        {DAYS_OF_THE_WEEK.map((d) => (
          <Day key={d}>
            <strong>{d}</strong>
          </Day>
        ))}
        {Array(days[month] + (startDay - 1))
          .fill(null)
          .map((_, index) => {
            const d = index - (startDay - 2);

            const moodDate = {};

            moodHistory.forEach((el) => {
              let shortDate = el.date.slice(0, 10);
              let newEl = Number(shortDate.split("-")[2]);
              moodDate[newEl] = el.mood;
            });

            return (
              <Day
                key={index}
                isGreat={moodDate[d] === "great" && month === 4}
                isOk={moodDate[d] === "neutral" && month === 4}
                isNotGreat={moodDate[d] === "unwell" && month === 4}
                isToday={d === today.getDate()}
                isSelected={d === day}
                onClick={() => setDate(new Date(year, month, d))}
              >
                {d > 0 ? d : ""}
              </Day>
            );
          })}
      </Body>
    </Frame>
  );
}

export default Calendar;
