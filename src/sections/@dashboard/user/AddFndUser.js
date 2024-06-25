/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */

import { Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { sentenceCase } from 'change-case';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFndUserService } from '../../../Services/Admin/AddFndUser';

export default function AddFndUser() {
  const navigate = useNavigate();
  const [showMenuLines, setShowMenuLines] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [fnduser, setFnduser] = useState([
    {
      userName: '',
      userPassword: '',
      startDate: '',
      endDate: '',
      description: '',
      employeeId: '',
    },
  ]);
  const handleMenuChange = (index, name, value) => {
    const updatedRows = [...fnduser];
    updatedRows[index][name] = value;
    setFnduser(updatedRows);
    console.log(fnduser);
  };

  const handleAddRow = () => {
    if (fnduser.length === 1) setShowMenuLines(true);

    if (showMenuLines) {
      setFnduser([
        ...fnduser,
        {
          userName: '',
          userPassword: '',
          startDate: '',
          endDate: '',
          description: '',
          employeeId: '',
        },
      ]);
      console.log(fnduser);
    }
  };

  const options = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Writer' },
    { value: 3, label: 'Viewer' },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  // const onValueChange = (e) => {
  //   setFnduser({ ...fnduser, [e.target.name]: e.target.value });
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClick = async () => {
    try {
      const filteredArray = fnduser.filter((item) => Object.values(item).some((value) => value !== ''));

      let c;
      for (c = 0; c < filteredArray.length; c++) {
        const lineInfo = filteredArray[c];

        const requestBody = {
          userName: lineInfo.userName,
          userPassword: lineInfo.userPassword,
          startDate: lineInfo.startDate,
          endDate: lineInfo.endDate,
          description: lineInfo.description,
          employeeId: lineInfo.employeeId,
        };

        const response = await addFndUserService(requestBody);
        console.log('Pass to home after request ');
        handleClose();
      }
    } catch (err) {
      console.log(err.message);
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
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Fnd User Add
          </Typography>
        </Stack>
        <Grid item xs={3}>
          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={() => {
              handleAddRow();
            }}
          >
            Add Fnd User
          </Button>

          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Grid>

        <div>
          <form className="form-horizontal" style={{ marginTop: '5%' }}>
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
                    <th>
                      End Date <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Description <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Employee Id <span style={{ color: 'red' }}>*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showMenuLines &&
                    fnduser.map((row, index) => (
                      <tr key={index}>
                        <td style={{ width: '500px' }}>
                          <input
                            type="text"
                            className="form-control"
                            name="userName"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td style={{ width: '500px' }}>
                          <input
                            type="text"
                            className="form-control"
                            name="userPassword"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td style={{ width: '150px' }}>
                          <TextField
                            type="date"
                            name="startDate"
                            label={sentenceCase('startDate')}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={fnduser.startDate}
                          />
                        </td>
                        <td style={{ width: '150px' }}>
                          <TextField
                            type="date"
                            name="endDate"
                            label={sentenceCase('endDate')}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={fnduser.endDate}
                          />
                        </td>

                        <td style={{ width: '700px' }}>
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td style={{ width: '100px' }}>
                          <input
                            type="text"
                            className="form-control"
                            name="employeeId"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        {/* <td>
                          <Button>
                            <AddIcon onClick={handleAddRow} />
                          </Button>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {showMenuLines && (
              <Grid item xs={3}>
               
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
              
              </Grid>
            )}
          </form>
        </div>

        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">{'Add New Locations'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                required
                name="userName"
                label="User Name"
                autoComplete="given-name"
                onChange={(e) => onValueChange(e)}
              />

              <TextField
                required
                name="userPassword"
                label="User Password"
                autoComplete="given-name"
                onChange={(e) => onValueChange(e)}
              />

              <TextField
                type="date"
                name="startDate"
                label={sentenceCase('startDate')}
                onChange={(e) => onValueChange(e)}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{
                  shrink: true,
                }}
                value={fnduser.startDate}
              />

              <TextField
                type="date"
                name="endDate"
                label={sentenceCase('endDate')}
                onChange={(e) => onValueChange(e)}
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{
                  shrink: true,
                }}
                value={fnduser.endDate}
              />
              <TextField
                name="description"
                label="Description"
                autoComplete="given-name"
                onChange={(e) => onValueChange(e)}
              />
              <TextField
                name="employeeId"
                label="Employee ID"
                autoComplete="given-name"
                onChange={(e) => onValueChange(e)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClick}>
              Submit
            </Button>
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
