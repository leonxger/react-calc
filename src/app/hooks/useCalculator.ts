import { useReducer } from 'react';
import { CalculatorState, CalculatorAction } from '../types';
import { evaluateExpression } from '../utils/calculator-utils';

/**
 * Initial calculator state
 */
export const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operation: null,
  overwrite: true,
};

/**
 * Calculator reducer function
 */
export const calculatorReducer = (
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
        previousValue: evaluateExpression(
          state.previousValue,
          state.currentValue,
          state.operation
        ),
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

      // Special case: 7 * 7 = "Feiner Sand!"
      if (
        parseFloat(state.previousValue) === 7 &&
        parseFloat(state.currentValue) === 7 &&
        state.operation === '×'
      ) {
        return {
          ...state,
          currentValue: 'Feiner Sand!',
          previousValue: '',
          operation: null,
          overwrite: true,
        };
      }

      return {
        ...state,
        currentValue: evaluateExpression(
          state.previousValue,
          state.currentValue,
          state.operation
        ),
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

/**
 * Custom hook for calculator functionality
 */
export const useCalculator = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  
  return { state, dispatch };
};

export default useCalculator; 