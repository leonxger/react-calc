import { useState, useCallback, useEffect } from 'react';
import { RotationState } from '../types';

/**
 * Initial rotation state
 */
export const initialRotationState: RotationState = {
  rotateX: 15,
  rotateY: -15,
  isDragging: false,
  initialX: 0,
  initialY: 0,
};

/**
 * Custom hook for handling 3D rotation
 */
export const useRotation = () => {
  const [rotation, setRotation] = useState<RotationState>(initialRotationState);

  // Start dragging on mouse down
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

  // Update rotation on mouse move
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

  // Stop dragging on mouse up
  const handleMouseUp = useCallback(() => {
    setRotation(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  // Reset rotation on double click
  const handleDoubleClick = useCallback(() => {
    setRotation({
      ...initialRotationState,
      isDragging: false
    });
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

  // Calculate 3D transform style
  const calculatorStyle = {
    transform: `
      perspective(1000px) 
      rotateX(${rotation.rotateX}deg) 
      rotateY(${rotation.rotateY}deg)
    `,
    transition: rotation.isDragging ? 'none' : 'transform 0.5s ease-out'
  };

  return {
    rotation,
    calculatorStyle,
    handleMouseDown,
    handleDoubleClick
  };
};

export default useRotation; 