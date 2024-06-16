import React, { useContext } from 'react';
import Card from './Card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ThemeContext from '../context/ThemeContext';

const Chart = ({ data }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Card>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FA8072" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FA8072" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke="#312e81"
            fillOpacity={1}
            strokeWidth={0.5}
            fill="url(#chartColor)"
          />
          <Tooltip contentStyle={darkMode ? { backgroundColor: "#111827" } : null} itemStyle={darkMode ? { color: "#FA8072" } : null} />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin', 'dataMax']} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
