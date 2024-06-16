import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Details from './Details';
import Overview from './Overview';
import Chart from './Chart';
import Search from './Search';
import ThemeContext from '../context/ThemeContext';

const API_KEY = 'cpn41s1r01qtggbae8v0cpn41s1r01qtggbae8vg';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [stockData, setStockData] = useState([]);
  const [companyOverview, setCompanyOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('AAPL');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        
        if (response.data) {
          const formattedData = [
            { date: new Date().toISOString(), price: response.data.c },
            { date: new Date().toISOString(), price: response.data.pc }
          ];
          setStockData(formattedData);
        } else {
          setError('No data available');
          setStockData([]);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching stock data");
        setLoading(false);
      }
    };

    const fetchCompanyOverview = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
        if (response.data) {
          setCompanyOverview(response.data);
        } else {
          setCompanyOverview({});
        }
      } catch (error) {
        setError("Error fetching company overview");
      }
    };

    fetchStockData();
    fetchCompanyOverview();

    const interval = setInterval(() => {
      fetchStockData();
      fetchCompanyOverview();
    }, 60000); // Update every 1 minute
    return () => clearInterval(interval);
  }, [symbol]);

  const handleSearch = (newSymbol) => {
    setSymbol(newSymbol.toUpperCase());
  };

  if (loading) {
    return <div>AYO ITS LOADING...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (stockData.length < 2) {
    return <div>No data available</div>;
  }

  const latestPrice = stockData[0].price;
  const previousPrice = stockData[1].price;
  const change = latestPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;

  return (
    <div className={`h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand ${darkMode ? "bg-gray-900 text-gray-300" : "bg-neutral-100"}`}>
      <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center">
        <Header name={`${symbol} Stock Dashboard`} />
      </div>
      <div className="col-span-1 md:col-span-2 xl:grid-cols-3 row-span-1">
        <Search onSearch={handleSearch} />
      </div>
      <div className="md:col-span-2 row-span-4">
        <Chart data={stockData} />
      </div>
      <div>
        <Overview
          symbol={symbol}
          price={latestPrice}
          change={change}
          changePercent={changePercent}
          currency="USD"
        />
      </div>
      <div className="row-span-2 xl:row-span-3">
        <Details details={companyOverview} />
      </div>
    </div>
  );
};

export default Dashboard;