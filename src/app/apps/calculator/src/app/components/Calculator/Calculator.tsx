// apps/calculator/src/app/components/Calculator/Calculator.tsx
import React, { useState, useReducer, useCallback, useRef, useEffect } from 'react';
import './Calculator.scss';

// Types
type CalculatorState = {
  currentValue: string;
  previousValue: string;
  operation: string | null;
  overwrite: boolean;
};

type CalculatorAction =
  | { type: 'ADD_DIGIT'; payload: { digit: string } }
  | { type: 'CHOOSE_OPERATION'; payload: { operation: string } }
  | { type: 'CLEAR' }
  | { type: 'DELETE' }
  | { type: 'EVALUATE' };

// 3D Rotation state
type RotationState = {
  rotateX: number;
  rotateY: number;
  isDragging: boolean;
  initialX: number;
  initialY: number;
};

// Initial state
const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operation: null,
  overwrite: true,
};

// Initial rotation state
const initialRotationState: RotationState = {
  rotateX: 15,
  rotateY: -15,
  isDragging: false,
  initialX: 0,
  initialY: 0,
};

// Reducer function
const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState => {
  switch (action.type) {
    case 'ADD_DIGIT': {
      const { digit } = action.payload;

      // Handle overwrite case (after result or initial state)
      if (state.overwrite) {
        return {
          ...state,
          currentValue: digit === '.' ? '0.' : digit,
          overwrite: false,
        };
      }

      // Prevent multiple zeros at start
      if (digit === '0' && state.currentValue === '0') return state;

      // Prevent multiple decimals
      if (digit === '.' && state.currentValue.includes('.')) return state;

      return {
        ...state,
        currentValue: state.currentValue + digit,
      };
    }

    case 'CHOOSE_OPERATION': {
      const { operation } = action.payload;

      // If no current value, just change operation
      if (state.currentValue === '0' && state.previousValue === '')
        return state;

      // If we already have an operation and previous value, update operation
      if (state.previousValue !== '' && state.operation && state.overwrite) {
        return {
          ...state,
          operation,
        };
      }

      // If no previous value, move current to previous and set operation
      if (state.previousValue === '') {
        return {
          ...state,
          previousValue: state.currentValue,
          operation,
          currentValue: '0',
          overwrite: true,
        };
      }

      // Otherwise, evaluate the current expression and set new operation
      return {
        ...state,
        previousValue: evaluate(state),
        operation,
        currentValue: '0',
        overwrite: true,
      };
    }

    case 'EVALUATE': {
      // Nothing to evaluate
      if (
        state.operation === null ||
        state.previousValue === '' ||
        state.currentValue === '0'
      ) {
        return state;
      }

      return {
        ...state,
        currentValue: evaluate(state),
        previousValue: '',
        operation: null,
        overwrite: true,
      };
    }

    case 'CLEAR':
      return initialState;

    case 'DELETE':
      if (state.overwrite) return state;

      if (state.currentValue.length === 1) {
        return {
          ...state,
          currentValue: '0',
          overwrite: true,
        };
      }

      return {
        ...state,
        currentValue: state.currentValue.slice(0, -1),
      };

    default:
      return state;
  }
};

// Helper for evaluating expressions
const evaluate = ({
  currentValue,
  previousValue,
  operation,
}: CalculatorState): string => {
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  if (isNaN(prev) || isNaN(current)) return '0';

  // Easter egg: 7 * 7 = "Feiner Sand!"
  if (prev === 7 && current === 7 && operation === '×') {
    return "Feiner Sand!";
  }

  let result = 0;
  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      if (current === 0) return 'Error';
      result = prev / current;
      break;
    default:
      return '0';
  }

  return result.toString();
};

// Custom hook for formatting calculator display
const useFormattedValue = (value: string): string => {
  // Handle special text values
  if (value === 'Error' || value === 'Feiner Sand!') return value;
  
  const [integer, decimal] = value.split('.');
  const formattedInteger = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Number(integer));
  
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

const Calculator: React.FC = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const [rotation, setRotation] = useState<RotationState>(initialRotationState);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  const formattedValue = useFormattedValue(state.currentValue);
  const formattedPreviousValue = useFormattedValue(state.previousValue);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  // 3D Rotation handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only activate on middle mouse button (button 1)
    if (e.button === 1) {
      e.preventDefault();
      setRotation(prev => ({
        ...prev,
        isDragging: true,
        initialX: e.clientX,
        initialY: e.clientY
      }));
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rotation.isDragging) {
      const deltaX = e.clientX - rotation.initialX;
      const deltaY = e.clientY - rotation.initialY;
      
      setRotation(prev => ({
        ...prev,
        rotateX: prev.rotateX + deltaY * 0.5,
        rotateY: prev.rotateY + deltaX * 0.5,
        initialX: e.clientX,
        initialY: e.clientY
      }));
    }
  }, [rotation.isDragging, rotation.initialX, rotation.initialY]);

  const handleMouseUp = useCallback(() => {
    setRotation(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Reset rotation on double click
  const handleDoubleClick = useCallback(() => {
    setRotation({
      ...initialRotationState,
      isDragging: false
    });
  }, []);

  // Memoized event handlers
  const handleDigitClick = useCallback((digit: string) => {
    dispatch({ type: 'ADD_DIGIT', payload: { digit } });
  }, []);

  const handleOperationClick = useCallback((operation: string) => {
    dispatch({ type: 'CHOOSE_OPERATION', payload: { operation } });
  }, []);

  // Keyboard support
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (/^[0-9.]$/.test(event.key)) {
      event.preventDefault();
      dispatch({ type: 'ADD_DIGIT', payload: { digit: event.key } });
    } else if (['+', '-'].includes(event.key)) {
      event.preventDefault();
      dispatch({ type: 'CHOOSE_OPERATION', payload: { operation: event.key } });
    } else if (event.key === '*') {
      event.preventDefault();
      dispatch({ type: 'CHOOSE_OPERATION', payload: { operation: '×' } });
    } else if (event.key === '/') {
      event.preventDefault();
      dispatch({ type: 'CHOOSE_OPERATION', payload: { operation: '÷' } });
    } else if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      dispatch({ type: 'EVALUATE' });
    } else if (event.key === 'Escape') {
      event.preventDefault();
      dispatch({ type: 'CLEAR' });
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      dispatch({ type: 'DELETE' });
    }
  }, []);

  // Calculate 3D transform style
  const calculatorStyle = {
    transform: `
      perspective(1000px) 
      rotateX(${rotation.rotateX}deg) 
      rotateY(${rotation.rotateY}deg)
    `,
    transition: rotation.isDragging ? 'none' : 'transform 0.5s ease-out'
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-controls">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="rotation-hint">
          <span>Middle-click + drag to rotate</span>
          <span>Double-click to reset</span>
        </div>
      </div>
      
      <div
        className={`calculator ${theme}-theme`}
        style={calculatorStyle}
        ref={calculatorRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        aria-label="Calculator"
      >
        <div className="edge-top"></div>
        <div className="edge-bottom"></div>
        <div className="edge-left"></div>
        <div className="edge-right"></div>
        
        <div className="display">
          {state.previousValue && (
            <div className="previous-operand">
              {formattedPreviousValue} {state.operation}
            </div>
          )}
          <div className="current-operand" aria-live="polite">
            {formattedValue}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Calculator;
