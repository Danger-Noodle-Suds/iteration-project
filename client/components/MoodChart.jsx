import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Delete this later, just sample data until we connect to backend with sessions.
const data = [
  {
    name: 'May 7',
    Mood: 5,
  },
  {
    name: 'May 8',
    Mood: 5,
  },
  {
    name: 'May 9',
    Mood: 4,
  },
  {
    name: 'May 10',
    Mood: 3,
  },
  {
    name: 'May 11',
    Mood: 2,
  },
  {
    name: 'May 12',
    Mood: 4,
  },
  {
    name: 'May 13',
    Mood: 5,
  },
];

const MoodChart = () => {
  // invokes the getMoodData function once at inital render.
  useEffect(() => {
    getMoodData();
  }, []);

  // defaults gatheredMoods to an empty array, initializes react hooks to update state.
  const [gatheredMoods, setGatheredMoods] = useState([]);

  const getMoodData = () => {
    // make a fetch request to SQL for the last 7 days of mood data for this user
    // save the data in an array of objects
    // set the gatheredMoods
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2>Mood History</h2>
      <ResponsiveContainer>
        <AreaChart
          width={500}
          height={500}
          // update data to gatheredMoods when DB is available.
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis dataKey="Mood" scale="linear" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Mood"
            stroke="#708c75"
            fill="#708c75"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
