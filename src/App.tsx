import { useState } from 'react';
import Select from './component/Select';
import { SelectOption } from './types';

const options: SelectOption[] = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 },
];
function App() {
  const [value1, setValue1] = useState<SelectOption[]>([options[0]]);
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);
  return (
    <>
      <Select multiple options={options} value={value1} onChange={setValue1} />
      <br />
      <Select options={options} value={value2} onChange={setValue2} />
    </>
  );
}

export default App;
