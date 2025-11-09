import React from 'react';

export const Tooltip = ({ children, title }) => {
    return (
      <div className='tooltip'>
        { children }
        <div className='tooltiptext tooltip-right light'>
          <span className='font-black text-sm  whitespace-nowrap'>
            { title }
          </span>
        </div>
      </div>
    );
}

export default Tooltip;
