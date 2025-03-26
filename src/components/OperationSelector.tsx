
import { useState } from 'react';
import { Operation } from '../utils/mathUtils';
import { Plus, Minus, X } from 'lucide-react';

interface OperationSelectorProps {
  selectedOperation: Operation;
  onSelectOperation: (operation: Operation) => void;
}

const OperationSelector = ({ 
  selectedOperation, 
  onSelectOperation 
}: OperationSelectorProps) => {
  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3 text-center">
        Select Operation
      </p>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onSelectOperation('addition')}
          data-active={selectedOperation === 'addition'}
          className="operation-button"
        >
          <Plus 
            size={20} 
            className={`transition-colors duration-200 ${
              selectedOperation === 'addition' ? 'text-primary' : 'text-gray-600'
            }`} 
          />
          <span className="ml-2">Add</span>
        </button>
        
        <button
          onClick={() => onSelectOperation('subtraction')}
          data-active={selectedOperation === 'subtraction'}
          className="operation-button"
        >
          <Minus 
            size={20} 
            className={`transition-colors duration-200 ${
              selectedOperation === 'subtraction' ? 'text-primary' : 'text-gray-600'
            }`} 
          />
          <span className="ml-2">Subtract</span>
        </button>
        
        <button
          onClick={() => onSelectOperation('multiplication')}
          data-active={selectedOperation === 'multiplication'}
          className="operation-button"
        >
          <X 
            size={20} 
            className={`transition-colors duration-200 ${
              selectedOperation === 'multiplication' ? 'text-primary' : 'text-gray-600'
            }`} 
          />
          <span className="ml-2">Multiply</span>
        </button>
      </div>
    </div>
  );
};

export default OperationSelector;
