/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import { useState } from 'react';
function ShowEmployee() {
  const [displayValue, setDisplayValue] = useState('');
  const [input, setInput] = useState({
    inputValue: '',
  });

  const onValueChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    try {
      console.log(typeof input);
      const response = await await axios.get(`http://182.160.114.100:5001/get-employee-id/${input.inputValue}`);
      console.log('Pass to home after request ', response.data[0].fn_get_emp_id);
      setDisplayValue(response.data[0].fn_get_emp_id);
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };

  return (
    <div>
      <center>
        <label>
          Input Field:
          <input type="text" name="inputValue" onChange={(e) => onValueChange(e)} />
        </label>
        <br />
        <button onClick={handleClick}>Display</button>
        <br />
        <label>
          Display Field:
          <div>{displayValue}</div>
        </label>
      </center>
    </div>
  );
}

export default ShowEmployee;
