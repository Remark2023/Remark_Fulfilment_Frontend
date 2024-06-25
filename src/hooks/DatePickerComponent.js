import { useState } from "react";
import DatePicker from "react-datepicker";

export default function DatePickerComponent() {
  const [date, setDate] = useState(new Date());
  return (
    <div>
      <DatePicker selected={date} onChange={(date) => setDate(date)} />
    </div>
  );
}