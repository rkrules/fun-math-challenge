
import { Operation } from '../utils/mathUtils';
import { Plus, Minus, X, Divide, Grid3X3, RotateCcw, ArrowLeftRight, PieChart } from 'lucide-react';

interface OperationSelectorProps {
  selectedOperation: Operation;
  onSelectOperation: (operation: Operation) => void;
}

const operations: { id: Operation; label: string; icon: React.ReactNode }[] = [
  { id: 'addition', label: 'Addition', icon: <Plus size={20} /> },
  { id: 'subtraction', label: 'Subtraction', icon: <Minus size={20} /> },
  { id: 'multiplication', label: 'Multiply', icon: <X size={20} /> },
  { id: 'division', label: 'Division', icon: <Divide size={20} /> },
  { id: 'multiplication_table', label: 'Times Tables', icon: <Grid3X3 size={20} /> },
  { id: 'rounding', label: 'Rounding', icon: <RotateCcw size={20} /> },
  { id: 'comparing', label: 'Comparing', icon: <ArrowLeftRight size={20} /> },
  { id: 'fractions', label: 'Fractions', icon: <PieChart size={20} /> },
];

const OperationSelector = ({ selectedOperation, onSelectOperation }: OperationSelectorProps) => {
  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3 text-center">
        Select Operation
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {operations.map(op => (
          <button
            key={op.id}
            onClick={() => onSelectOperation(op.id)}
            data-active={selectedOperation === op.id}
            className="operation-button flex-col gap-1 py-3"
          >
            <span className={`transition-colors duration-200 ${
              selectedOperation === op.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {op.icon}
            </span>
            <span className="text-xs font-medium">{op.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OperationSelector;
