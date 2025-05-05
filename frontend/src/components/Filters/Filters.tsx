import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FiltersProps {
  onDateChange: (dates: [Date | null, Date | null]) => void;
  onTypeChange: (type: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ onDateChange, onTypeChange }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="filters">
      <div>
        <label>Диапазон дат:</label>
        <DatePicker
          selectsRange
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={(dates) => {
            setDateRange(dates);
            onDateChange(dates);
          }}
        />
      </div>
      <div>
        <label>Тип потребления:</label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            onTypeChange(e.target.value);
          }}
        >
          <option value="">Все</option>
          <option value="residential">Бытовое</option>
          <option value="industrial">Промышленное</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;