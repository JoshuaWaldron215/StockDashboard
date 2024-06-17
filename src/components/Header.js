import React from 'react';
import Search from './Search';
import ThemeIcon from './ThemeIcon';

const Header = ({ name, onStockSelect }) => {
  return (
    <>
      <div className="xl:px-32">
        <h1 className="text-5xl">{name}</h1>
        <Search onStockSelect={onStockSelect} />
      </div>
      <ThemeIcon />
    </>
  );
};

export default Header;
