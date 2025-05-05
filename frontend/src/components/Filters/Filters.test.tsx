// frontend/src/components/Filters/Filters.test.tsx
import { render, screen } from '@testing-library/react';
import Filters from './Filters';

test('renders date picker and type selector', () => {
  render(<Filters onDateChange={() => {}} onTypeChange={() => {}} />);
  expect(screen.getByLabelText('Диапазон дат:')).toBeInTheDocument();
  expect(screen.getByLabelText('Тип потребления:')).toBeInTheDocument();
});