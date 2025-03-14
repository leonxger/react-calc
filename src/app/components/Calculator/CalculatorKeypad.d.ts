import React from 'react';
import { CalculatorAction } from '../../types';

interface CalculatorKeypadProps {
  dispatch: React.Dispatch<CalculatorAction>;
}

declare const CalculatorKeypad: React.FC<CalculatorKeypadProps>;

export default CalculatorKeypad; 