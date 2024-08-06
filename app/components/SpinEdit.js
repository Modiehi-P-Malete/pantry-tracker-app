import { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const SpinEdit = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleIncrease = () => {
    const newValue = localValue + 1;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleDecrease = () => {
    if (localValue > 0) {
      const newValue = localValue - 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleDecrease} aria-label="decrease">
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        value={localValue}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          setLocalValue(newValue);
          onChange(newValue);
        }}
        inputProps={{ min: 0 }}
        style={{ width: '60px', textAlign: 'center' }}
      />
      <IconButton onClick={handleIncrease} aria-label="increase">
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default SpinEdit;
