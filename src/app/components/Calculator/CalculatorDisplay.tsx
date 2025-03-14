import React from 'react';

interface CalculatorDisplayProps {
  currentValue: string;
  previousValue: string;
  operation: string | null;
}

/**
 * Calculator display component
 */
const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  currentValue,
  previousValue,
  operation
}) => {
  return (
    <div className="display">
      {previousValue && (
        <div className="previous-operand">
          {previousValue} {operation}
        </div>
      )}
      <div className="current-operand" aria-live="polite">
        {currentValue}
      </div>
    </div>
  );
};

export default CalculatorDisplay; 