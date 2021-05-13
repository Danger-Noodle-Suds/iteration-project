import React, { useEffect, useState } from 'react';
import { isSameDay } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Calendar } from 'react-nice-dates';

// Very rough implementation of multiple date selection

const EntryCalendar = () => {
  // use effect takes a second optional paramater. This specifices when it should run.
  // Passing in an empty array, ensure it runs once, and not each time set state is called.
  useEffect(() => {
    handleDayPopulate();
  }, []);
  const [selectedDates, setSelectedDates] = useState([]);
  const [populatedDates, setPopulatedDates] = useState();
  const modifiers = {
    selected: (date) =>
      selectedDates.some((selectedDate) => isSameDay(selectedDate, date)),
  };
  const handleDayClick = (date) => {
    // if the day is in populated dates, make fetch request.
    for (let i = 0; i < populatedDates.length; i++) {
      // cannot compare objects with ==, because that would look for the same reference.
      if (date.getTime() === populatedDates[i].getTime()) {
        // make fetch request here;
        console.log('found the date');
        break;
        // look for the journal entries on that day, and mood for that day
        // create a popup that lets you see the data
      }
    }
    // this means the date was not in the DB, does nothing.
    console.log('this date has no entries');
  };

  const handleDayPopulate = () => {
    // Initial fetch request here to backend here
    // for each date, create a new js date object and add it to an array : populated dates
    // sample data here
    const selectedDatesA = new Date('Wed May 02 2021 00:00:00 GMT-0700');
    const selectedDatesB = new Date('Wed May 03 2021 00:00:00 GMT-0700');
    const selectedDatesC = new Date('Wed May 04 2021 00:00:00 GMT-0700');
    const selectedDatesD = new Date('Wed May 05 2021 00:00:00 GMT-0700');
    const populatedDates = [
      selectedDatesA,
      selectedDatesB,
      selectedDatesC,
      selectedDatesD,
    ];
    // highlights each day that had login/input so the user can click it
    setPopulatedDates(populatedDates);
    setSelectedDates(populatedDates);
  };

  return (
    <Calendar onDayClick={handleDayClick} modifiers={modifiers} locale={enGB} />
  );
};

export default EntryCalendar;
