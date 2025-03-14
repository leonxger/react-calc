import { useCallback } from 'react';
import { CalculatorAction } from '../types';

/**
 * Custom hook for handling keyboard input for the calculator
 * @param dispatch Dispatch function from useReducer
 */
export const useKeyboardInput = (
  dispatch: React.Dispatch<CalculatorAction>
) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Handle digit keys (0-9) and decimal point
      if (/^[0-9.]$/.test(event.key)) {
        event.preventDefault();
        dispatch({ type: 'ADD_DIGIT', payload: { digit: event.key } });
        return;
      }

      // Handle operation keys
      switch (event.key) {
        case '+':
        case '-':
          event.preventDefault();
          dispatch({ type: 'CHOOSE_OPERATION', payload: { operation: event.key } });
          break;
        case '*':
          event.preventDefault();
          dispatch({ type: 'CHOOSE_OPERATION', payload: { operation: '×' } });
          break;
        case '/':
          event.preventDefault();
          dispatch({ type: 'CHOOSE_OPERATION', payload: { operation: '÷' } });
          break;
        case 'Enter':
        case '=':
          event.preventDefault();
          dispatch({ type: 'EVALUATE' });
          break;
        case 'Escape':
          event.preventDefault();
          dispatch({ type: 'CLEAR' });
          break;
        case 'Backspace':
          event.preventDefault();
          dispatch({ type: 'DELETE' });
          break;
        default:
          // Do nothing for other keys
          break;
      }
    },
    [dispatch]
  );

  return { handleKeyDown };
};

export default useKeyboardInput; 