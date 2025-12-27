import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const RangeSliderTooltips = ({ value, onChange }) => {
  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <label className="text-sm font-semibold mb-1 block">Price Range</label>
      <Slider
        getAriaLabel={() => 'Price range'}
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        min={1000}
        max={10000}
        step={500}
      />
      <div className="flex justify-between text-sm text-gray-700 mt-1">
        <span>Rs. {value[0]}</span>
        <span>Rs. {value[1]}</span>
      </div>
    </Box>
  );
};

export default RangeSliderTooltips;