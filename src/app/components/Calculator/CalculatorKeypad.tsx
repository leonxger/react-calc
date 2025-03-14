// src/app/components/Calculator/CalculatorKeypad.tsx
import React, { useCallback } from 'react';
import { CalculatorAction } from '../../types';

interface CalculatorKeypadProps {
  dispatch: React.Dispatch<CalculatorAction>;
}

/**
 * Calculator keypad component
 */
const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({ dispatch }) => {
  // Memoized event handlers
  const handleDigitClick = useCallback((digit: string) => {
    dispatch({ type: 'ADD_DIGIT', payload: { digit } });
  }, [dispatch]);

  const handleOperationClick = useCallback((operation: string) => {
    dispatch({ type: 'CHOOSE_OPERATION', payload: { operation } });
  }, [dispatch]);

  return (
    <div className="keypad">
      <button
        className="span-two"
        onClick={() => dispatch({ type: 'CLEAR' })}
        aria-label="Clear"
      >
        AC
      </button>
      <button
        onClick={() => dispatch({ type: 'DELETE' })}
        aria-label="Delete"
      >
        DEL
      </button>
      <button
        className="operation"
        onClick={() => handleOperationClick('÷')}
        aria-label="Divide"
      >
        ÷
      </button>

      {[7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => handleDigitClick(num.toString())}
          aria-label={num.toString()}
        >
          {num}
        </button>
      ))}
      <button
        className="operation"
        onClick={() => handleOperationClick('×')}
        aria-label="Multiply"
      >
        ×
      </button>

      {[4, 5, 6].map((num) => (
        <button
          key={num}
          onClick={() => handleDigitClick(num.toString())}
          aria-label={num.toString()}
        >
          {num}
        </button>
      ))}
      <button
        className="operation"
        onClick={() => handleOperationClick('-')}
        aria-label="Subtract"
      >
        -
      </button>

      {[1, 2, 3].map((num) => (
        <button
          key={num}
          onClick={() => handleDigitClick(num.toString())}
          aria-label={num.toString()}
        >
          {num}
        </button>
      ))}
      <button
        className="operation"
        onClick={() => handleOperationClick('+')}
        aria-label="Add"
      >
        +
      </button>

      <button
        className="span-two"
        onClick={() => handleDigitClick('0')}
        aria-label="Zero"
      >
        0
      </button>
      <button
        onClick={() => handleDigitClick('.')}
        aria-label="Decimal point"
      >
        .
      </button>
      <button
        className="operation equals"
        onClick={() => dispatch({ type: 'EVALUATE' })}
        aria-label="Equals"
      >
        =
      </button>
    </div>
  );
};

export default CalculatorKeypad; 