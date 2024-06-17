import React from 'react';

const Notification = ({ message, type, position = "top" }) => {
  if (!message) return null;

  const notificationStyles = {
    container: {
      position: 'fixed',
      [position]: 0, // Use the position prop to determine top or bottom placement
      left: 0,
      right: 0,
      backgroundColor: type === 'success' ? 'green' : 'red',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      zIndex: 1000,
    },
  };

  return (
    <div style={notificationStyles.container}>
      {message}
    </div>
  );
};

export default Notification;

