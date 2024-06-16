import React, { useContext, useState } from 'react'
import Card from './Card';
import { mockhistoricalData } from '../constants/mock'
import { convertUnixTimestampToDate } from '../helpers/date-helper';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFilter from './ChartFilter';
import { chartConfig } from "../constants/config";
import ThemeContext from '../context/ThemeContext';

const Chart = () => {
    const [data, setData] = useState(mockhistoricalData);
    const [filter, setFilter] = useState("1W");

const {darkMode} = useContext(ThemeContext);
const formatData = () => {
    return data.c.map((item, index) => {
        return {
            value: item.toFixed(2),
            date: convertUnixTimestampToDate(data.t[index]),
        };
    });
};
  return (
    <Card>
        <ul className="flex absolute top-2 right-2 z-40">
            {Object.keys(chartConfig).map((item) => {
            return (
                <li key={item}>
                    <ChartFilter 
                    text={item} 
                    active={filter === item} 
                    onClick={() => {
                        setFilter(item);
                    }}
                    />
                </li>
            )})}

        </ul>
        <ResponsiveContainer>
            <AreaChart data={formatData(data)}>
            <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FA8072" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FA8072" stopOpacity={0}/>
                 </linearGradient>
            </defs>

            <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#312e81"
            fillOpacity={1}
            strokeWidth={0.5}
            fill="url(#chartColor"
            />
            <Tooltip contentStyle={darkMode ? {backgroundColor: "#111827"}: null }
            itemStyle={darkMode ? { color: "#FA8072"}: null}/>
            <XAxis dataKey={"date"}/>
            <YAxis domain={["dataMin","dataMax"]}/>
            </AreaChart>
        </ResponsiveContainer>
    </Card>
  );
}

export default Chart