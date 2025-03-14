import React from 'react';

interface CalculatorDisplayProps {
  currentValue: string;
  previousValue: string;
  operation: string | null;
}

declare const CalculatorDisplay: React.FC<CalculatorDisplayProps>;

export default CalculatorDisplay; 