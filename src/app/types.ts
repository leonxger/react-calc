/**
 * Theme options for the application
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Calculator state interface
 */
export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: string | null;
  overwrite: boolean;
}

/**
 * Calculator action types
 */
export type CalculatorAction =
  | { type: 'ADD_DIGIT'; payload: { digit: string } }
  | { type: 'CHOOSE_OPERATION'; payload: { operation: string } }
  | { type: 'CLEAR' }
  | { type: 'DELETE' }
  | { type: 'EVALUATE' };

/**
 * 3D Rotation state interface
 */
export interface RotationState {
  rotateX: number;
  rotateY: number;
  isDragging: boolean;
  initialX: number;
  initialY: number;
} 