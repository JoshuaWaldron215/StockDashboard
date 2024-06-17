import React from 'react';
import Card from './Card';

const Overview = ({ symbol, price, change, changePercent, currency }) => {
  return (
    <Card>
      <span className="absolute left-2 top-1 text-neutral-400 text-lg sl:text-xl 2xl:text-2xl">
        {symbol}
      </span>
      <div className="w-full h-full flex items-center justify-around">
        <span className="text-2xl xl:text-4xl 2xl:text-5xl flex items-center">
          ${parseFloat(price).toFixed(2)}
          <span className="text-lg xl:text-xl 2xl:text-2xl text-neutral-400 m-2">
            {currency}
          </span>
        </span>

        <span
          className={`text-lg xl:text-xl 2xl:text-2xl ${
            parseFloat(change) > 0 ? 'text-lime-500' : 'text-red-500'
          }`}
        >
          {parseFloat(change).toFixed(2)} <span>({parseFloat(changePercent).toFixed(2)}%)</span>
        </span>
      </div>
    </Card>
  );
};

export default Overview;