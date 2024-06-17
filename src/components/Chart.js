import React, { useContext, useState, useEffect } from 'react';
import Card from './Card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFilter from './ChartFilter';
import { chartConfig } from '../constants/config';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';

const Chart = ({ symbol, initialFilter }) => {
  const { darkMode } = useContext(ThemeContext);
  const [filter, setFilter] = useState(initialFilter); // Use initialFilter prop
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChartData(symbol, filter);
    }, 60000); // Update data every 60 seconds

    fetchChartData(symbol, filter);

    return () => clearInterval(interval);
  }, [symbol, filter]);

  const fetchChartData = async (symbol, filter) => {
    try {
      let response;
      if (filter === '1D') {
        response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=P67MZWEN1P5E5P7O`
        );
        const timeSeries = response.data['Time Series (5min)'];
        if (timeSeries) {
          const formattedData = Object.entries(timeSeries)
            .map(([date, values]) => ({
              date,
              value: parseFloat(values['4. close']),
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
          setData(formattedData);
        } else {
          setData([]);
          console.error('No intraday data found');
        }
      } else {
        response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=P67MZWEN1P5E5P7O`
        );
        const timeSeries = response.data['Time Series (Daily)'];
        if (timeSeries) {
          const filteredData = Object.entries(timeSeries)
            .map(([date, values]) => ({
              date,
              value: parseFloat(values['4. close']),
            }))
            .filter((item) => {
              const itemDate = new Date(item.date);
              const now = new Date();
              let filterDate;
              if (filter === '1W') {
                filterDate = new Date(now.setDate(now.getDate() - 7));
              } else if (filter === '1M') {
                filterDate = new Date(now.setMonth(now.getMonth() - 1));
              }
              return itemDate >= filterDate;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

          // Aggregate data for 1W and 1M filters
          if (filter === '1W' || filter === '1M') {
            const aggregatedData = aggregateData(filteredData, filter);
            setData(aggregatedData);
          } else {
            setData(filteredData);
          }
        } else {
          setData([]);
          console.error('No daily data found');
        }
      }
    } catch (error) {
      setData([]);
      console.error('Error fetching chart data:', error);
    }
  };

  const aggregateData = (data, filter) => {
    const aggregated = [];
    if (filter === '1W') {
      // Aggregate data by day for 1W filter
      data.forEach((item) => {
        const date = new Date(item.date).toLocaleDateString();
        const existing = aggregated.find((d) => d.date === date);
        if (existing) {
          existing.value = (existing.value + item.value) / 2;
        } else {
          aggregated.push({ date, value: item.value });
        }
      });
    } else if (filter === '1M') {
      // Aggregate data by week for 1M filter
      data.forEach((item) => {
        const week = getWeekNumber(new Date(item.date));
        const existing = aggregated.find((d) => d.week === week);
        if (existing) {
          existing.value = (existing.value + item.value) / 2;
        } else {
          aggregated.push({ week, date: item.date, value: item.value });
        }
      });
      // Format week data to display dates
      aggregated.forEach((item) => {
        item.date = `Week ${item.week}`;
        delete item.week;
      });
    }
    return aggregated;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatData = () => {
    return data.map((item) => ({
      value: item.value.toFixed(2),
      date: filter === '1D' ? new Date(item.date).toLocaleString() : item.date,
    }));
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
          );
        })}
      </ul>
      <ResponsiveContainer>
        <AreaChart data={formatData(data)}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FA8072" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FA8072" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#312e81"
            fillOpacity={1}
            strokeWidth={0.5}
            fill="url(#chartColor)"
            dot={false}
          />
          <Tooltip
            contentStyle={darkMode ? { backgroundColor: '#111827' } : null}
            itemStyle={darkMode ? { color: '#FA8072' } : null}
          />
          <XAxis dataKey={'date'} />
          <YAxis domain={['dataMin', 'dataMax']} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;



