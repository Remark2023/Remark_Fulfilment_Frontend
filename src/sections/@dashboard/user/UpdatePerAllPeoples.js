/* eslint-disable camelcase */
/* eslint-disable no-undef */
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getperPerAllPeoplesService } from '../../../Services/Admin/GetperPerAllPeoples';

export default function UpdatePerAllPeoples() {
  const { person_id } = useParams();
  const navigate = useNavigate();
  console.log('update page person', person_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [people, setPeople] = useState({
    effectiveStartDate: '',
    effectiveEndDate: '',
    businessGroupId: '',
    workTelephone: '',
    employeeNumber: '',

    fullName: '',

    emailAddress: '',

    originalDateOfHire: '',
  });

  const onValueChange = (e) => {
    setPeople({ ...people, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { person_id });
        console.log('without', person_id);
        const result = await getperPerAllPeoplesService(person_id);
        console.log('Eiii', result.data[0].person_id);
        setPeople({
          ...people,
          effectiveStartDate: result.data[0].effective_start_date,
          effectiveEndDate: result.data[0].effective_end_date,
          businessGroupId: result.data[0].business_group_id,
          employeeNumber: result.data[0].employee_number,
          workTelephone: result.data[0].work_telephone,
          fullName: result.data[0].full_name,
          emailAddress: result.data[0].email_address,
          originalDateOfHire: result.data[0].original_date_of_hire,
        });
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      console.log('loc', people);
      const response = await axios.put(`http://182.160.114.100:5001/update-per-all-peoples/${person_id}`, people);

      console.log('Pass to home after request ');
      handleClose();
    } catch (err) {
      console.log(err.message.TextField);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    // navigate('/dashboard/showperallpeoples');
    // window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <div>
        <h3 style={{ marginLeft: '50px' }}>Update {people.fullName} </h3>
        <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-highlight">
              <thead>
                <tr>
                  {/* <th>
                    Effective Start Date <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Effective End Date<span style={{ color: 'red' }}>*</span>
                  </th> */}
                  <th>
                    Business Group Id <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Email Address <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Employee Number <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Work Telephone<span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Full Name<span style={{ color: 'red' }}>*</span>
                  </th>
                  {/* <th>
                  Original Date Of Hire<span style={{ color: 'red' }}>*</span>
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {/* <td style={{ width: '250px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="effectiveStartDate"
                    label="Effective Start Date"
                    value={people.effectiveStartDate}
                    onChange={(e) => onValueChange(e)}
                    //  onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '400px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="effectiveEndDate"
                    label="Effective End Date"
                    value={people.effectiveEndDate}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td> */}

                <td style={{ width: '150px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="businessGroupId"
                    label="Business Group Id"
                    value={people.businessGroupId}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="emailAddress"
                    label="Email Address"
                    value={people.emailAddress}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '250px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="employeeNumber"
                    label="Employee Number"
                    value={people.employeeNumber}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '250px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="workTelephone"
                    label="Work Telephone"
                    value={people.workTelephone}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    label="Full Name"
                    value={people.fullName}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                {/* <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="originalDateOfHire"
                    label="Original Date Of Hire"
                    value={people.originalDateOfHire}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td> */}
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
    </div>
  );
}
