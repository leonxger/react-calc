/**
 * Evaluates a basic arithmetic expression
 * @param prev Previous value as string
 * @param current Current value as string
 * @param operation Operation symbol ('+', '-', '×', '÷')
 * @returns Result as string
 */
export const evaluateExpression = (
  prev: string,
  current: string,
  operation: string | null
): string => {
  const prevNum = parseFloat(prev);
  const currentNum = parseFloat(current);

  if (isNaN(prevNum) || isNaN(currentNum)) return '0';

  let result = 0;
  switch (operation) {
    case '+':
      result = prevNum + currentNum;
      break;
    case '-':
      result = prevNum - currentNum;
      break;
    case '×':
      result = prevNum * currentNum;
      break;
    case '÷':
      if (currentNum === 0) return 'Error';
      result = prevNum / currentNum;
      break;
    default:
      return '0';
  }

  // Handle potential floating point precision issues
  return parseFloat(result.toFixed(10)).toString();
};

/**
 * Formats a number for display with proper thousand separators
 * @param value Number as string
 * @returns Formatted number string
 */
export const formatDisplayValue = (value: string): string => {
  // Handle special text values
  if (value === 'Error' || value === 'Feiner Sand!') return value;

  const [integer, decimal] = value.split('.');
  const formattedInteger = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Number(integer));

  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

/**
 * Determines if a value is a valid number
 * @param value String to check
 * @returns Boolean indicating if value is numeric
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}; 