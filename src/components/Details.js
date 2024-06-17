import React, { useContext } from 'react';
import Card from './Card';
import ThemeContext from '../context/ThemeContext';

const Details = ({ details }) => {
  const { darkMode } = useContext(ThemeContext);
  const detailsList = {
    Name: 'Name',
    Country: 'Country',
    Currency: 'Currency',
    Exchange: 'Exchange',
    ipoDate: 'IPO Date',
    MarketCapitalization: 'Market Capitalization',
    Industry: 'Industry',
  };

  const convertMillionToBillion = (number) => {
    if (number === undefined || number === null) {
      return 'N/A';
    }
    if (number >= 1e9) {
      return (number / 1e9).toFixed(1) + ' B';
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(1) + ' M';
    }
    return number.toString();
  };

  return (
    <Card>
      <ul
        className={`w-full h-full flex flex-col justify-between divide-y-1 ${
          darkMode ? 'divide-gray-800' : null
        }`}
      >
        {Object.keys(detailsList).map((item) => {
          const value = details[item];
          return (
            <li key={item} className="flex-1 flex justify-between items-center">
              <span>{detailsList[item]}</span>
              <span className="font-bold">
                {item === 'MarketCapitalization'
                  ? convertMillionToBillion(value)
                  : value || 'N/A'}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default Details;
