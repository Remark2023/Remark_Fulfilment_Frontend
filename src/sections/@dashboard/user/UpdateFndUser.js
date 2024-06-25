/* eslint-disable import/named */
/* eslint-disable camelcase */
/* eslint-disable no-undef */

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPerFndUserService } from '../../../Services/Admin/GetPerFndUser';

export default function UpdateFndUser() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  console.log('update page person', user_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [fnduser, setFnduser] = useState({
    userName: '',
    userPassword: '',
    startDate: '',
    endDate: '',
    description: '',
    employeeId: '',
  });

  const onValueChange = (e) => {
    setFnduser({ ...fnduser, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { user_id });
        console.log('without', user_id);
        const result = await getPerFndUserService(user_id);
        console.log('Eiii', result.data[0].user_id);
        setFnduser({
          ...fnduser,
          userName: result.data[0].user_name,
          userPassword: result.data[0].user_password,
          startDate: result.data[0].start_date,
          endDate: result.data[0].end_date,
          description: result.data[0].description,
          employeeId: result.data[0].employee_id,
        });
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      console.log('loc', fnduser);
      const response = await axios.put(`http://localhost:5001/update-fnd-user/${user_id}`, fnduser);

      console.log('Pass to home after request ');
      handleClose();
    } catch (err) {
      console.log(err.message.TextField);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    navigate('/dashboard/showfnduser');
    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <h3 style={{ marginLeft: '50px' }}>Update {fnduser.employeeId} FndUser</h3>
      <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
                <th>
                  User Name <span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  User Password <span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  Start Date <span style={{ color: 'red' }}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <td style={{ width: '100px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="userName"
                  label="User Name"
                  value={fnduser.userName}
                  onChange={(e) => onValueChange(e)}
                  //  onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '550px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="userPassword"
                  label="User Password"
                  value={fnduser.userPassword}
                  onChange={(e) => onValueChange(e)}
                  // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>

              <td style={{ width: '550px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="  startDate"
                  label="  Start Date"
                  value={fnduser.startDate}
                 // onChange={(e) => onValueChange(e)}
                  // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
            </tbody>
          </table>

          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={handleClick}
          >
            Submit
          </Button>
          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
