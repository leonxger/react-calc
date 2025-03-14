import React, { useRef } from 'react';
import './Calculator.scss';
import { useCalculator } from '../../hooks/useCalculator';
import { useRotation } from '../../hooks/useRotation';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { formatDisplayValue } from '../../utils/calculator-utils';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKeypad from './CalculatorKeypad';

/**
 * Calculator component
 */
const Calculator: React.FC = () => {
  const { state, dispatch } = useCalculator();
  const { calculatorStyle, handleMouseDown, handleDoubleClick } = useRotation();
  const { handleKeyDown } = useKeyboardInput(dispatch);
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  // Format display values
  const formattedValue = formatDisplayValue(state.currentValue);
  const formattedPreviousValue = state.previousValue 
    ? formatDisplayValue(state.previousValue) 
    : '';

  return (
    <div className="calculator-wrapper">
      <div className="calculator-controls">
        <div className="rotation-hint">
          <span>Middle-click + drag to rotate</span>
          <span>Double-click to reset</span>
        </div>
      </div>
      
      <div
        className="calculator"
        style={calculatorStyle}
        ref={calculatorRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        data-testid="calculator"
      >
        <div className="edge-top"></div>
        <div className="edge-bottom"></div>
        <div className="edge-left"></div>
        <div className="edge-right"></div>
        
        <CalculatorDisplay 
          currentValue={formattedValue} 
          previousValue={formattedPreviousValue}
          operation={state.operation}
        />

        <CalculatorKeypad dispatch={dispatch} />
      </div>
    </div>
  );
};

export default Calculator; 