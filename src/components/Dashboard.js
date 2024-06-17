import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './Header';
import Details from './Details';
import Overview from './Overview';
import Chart from './Chart';
import Loading from './Loading';
import Notification from './Notification';
import ThemeContext from '../context/ThemeContext';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [companyDetails, setCompanyDetails] = useState({});
  const [stockQuote, setStockQuote] = useState({});
  const [symbol, setSymbol] = useState('AAPL');
  const [latestPrice, setLatestPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [filter, setFilter] = useState('1D'); // Set initial filter to 1D

  const fetchStockData = useCallback(async (symbol) => {
    setLoading(true);
    try {
      const companyResponse = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=P67MZWEN1P5E5P7O`);
      const quoteResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=P67MZWEN1P5E5P7O`);

      setCompanyDetails(companyResponse.data);
      const newPrice = parseFloat(quoteResponse.data['Global Quote']['05. price']).toFixed(2);
      setStockQuote(quoteResponse.data['Global Quote']);
      setSymbol(symbol);

      if (latestPrice) {
        if (newPrice > latestPrice) {
          setNotification({
            message: `The stock price has risen to ${newPrice} from ${latestPrice}.`,
            type: 'success',
          });
        } else if (newPrice < latestPrice) {
          setNotification({
            message: `The stock price has fallen to ${newPrice} from ${latestPrice}.`,
            type: 'error',
          });
        }
      }
      setLatestPrice(newPrice);
    } catch (error) {
      setNotification({
        message: 'Error fetching stock data.',
        type: 'error',
      });
      console.error('Error fetching stock data:', error);
    }
    setLoading(false);
  }, [latestPrice]);

  useEffect(() => {
    fetchStockData(symbol);
  }, [symbol, fetchStockData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStockData(symbol);
    }, 60000); // Update data every 60 seconds

    return () => clearInterval(interval);
  }, [symbol, fetchStockData]);

  return (
    <div
      className={`h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand ${
        darkMode ? 'bg-gray-900 text-gray-300' : 'bg-neutral-100'
      }`}
    >
      <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center">
        <Header name={companyDetails.Name || 'Stock Dashboard'} onStockSelect={fetchStockData} />
      </div>
      <div className="md:col-span-2 row-span-4">
        {loading ? <Loading /> : <Chart symbol={symbol} initialFilter={filter} />}
      </div>
      <div>
        <Overview
          symbol={companyDetails.Symbol}
          price={latestPrice}
          change={stockQuote['09. change']}
          changePercent={stockQuote['10. change percent']}
          currency={companyDetails.Currency}
        />
      </div>
      <div className="row-span-2 xl:row-span-3">
        <Details details={companyDetails} />
      </div>
      <Notification message={notification.message} type={notification.type} />
    </div>
  );
};

export default Dashboard;
