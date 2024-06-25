/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */

import { Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { sentenceCase } from 'change-case';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMtlTransactionTypes } from '../../../Services/Admin/AddMtlTransactionTypes';

export default function AddMtlTransactionTypes() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showMenuLines, setShowMenuLines] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${month}-${day}-${year}`;

  const [transaction, setTransaction] = useState([
    {
      lastUpdateDate: '',
      lastUpdatedBy: '',
      creationDate: formattedDate,
      createdBy: '',
      transactionTypeName: '',
      description: '',
      transactionActionId: '',
      transactionSourceTypeId: '',
    },
  ]);
  const handleMenuChange = (index, name, value) => {
    const updatedRows = [...transaction];
    updatedRows[index][name] = value;
    setTransaction(updatedRows);
    console.log(transaction);
  };
  const handleAddRow = () => {
    if (transaction.length === 1) setShowMenuLines(true);

    if (showMenuLines) {
      setTransaction([
        ...transaction,
        {
          lastUpdateDate: '',
          lastUpdatedBy: '',
          creationDate: formattedDate,
          createdBy: '',
          transactionTypeName: '',
          description: '',
          transactionActionId: '',
          transactionSourceTypeId: '',
        },
      ]);
      console.log(transaction);
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

  const onValueChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClick = async () => {
    const filteredArray = transaction.filter((item) => Object.values(item).some((value) => value !== ''));
    try {
      let c;
      for (c = 0; c < filteredArray.length; c++) {
        const lineInfo = filteredArray[c];

        const requestBody = {
          lastUpdateDate: lineInfo.lastUpdateDate,
          lastUpdatedBy: lineInfo.lastUpdatedBy,
          creationDate: formattedDate,
          createdBy: lineInfo.createdBy,
          transactionTypeName: lineInfo.transactionTypeName,
          description: lineInfo.description,
          transactionActionId: lineInfo.transactionActionId,
          transactionSourceTypeId: lineInfo.transactionSourceTypeId,
        };

        const response = await addMtlTransactionTypes(requestBody);
        console.log('Pass to home after request ');
        handleClose();
      }

      setTransaction([]);
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    navigate('/dashboard/showmtltransactiontypes');
    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Transaction Types Add
          </Typography>
        </Stack>

        <Grid item xs={3}>
      
            <Button
              style={{ marginRight: '10px', fontWeight: 'bold', color: 'black',backgroundColor:"lightgray" }}
              onClick={() => {
                handleAddRow();
              }}
            >
              Add Transaction Types
            </Button>
            <Button style={{ marginRight: '10px', fontWeight: 'bold', color: 'black',backgroundColor:"lightgray" }} onClick={handleClose}>
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
                      Last Update Date <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Last Updated By <span style={{ color: 'red' }}>*</span>
                    </th>

                    <th>
                      Created By <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Transaction Type Name <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Description <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Transaction Action Id <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Transaction Source Type Id <span style={{ color: 'red' }}>*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showMenuLines &&
                    transaction.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <TextField
                            type="date"
                            name="lastUpdateDate"
                            label={sentenceCase('lastUpdateDate')}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                            error={!!errors.lastUpdateDate}
                            helperText={errors.lastUpdateDate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={transaction.lastUpdateDate}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="lastUpdatedBy"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="createdBy"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="transactionTypeName"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="description"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="transactionActionId"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="transactionSourceTypeId"
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {showMenuLines && (
              <Grid item xs={3} style={{marginTop:"20px"}}>
              
                  <Button style={{ marginRight: '10px', fontWeight: 'bold', color: 'black',backgroundColor:"lightgray" }} onClick={handleClick}>
                    Submit
                  </Button>
                  <Button style={{ marginRight: '10px', fontWeight: 'bold', color: 'black',backgroundColor:"lightgray" }} onClick={handleClose}>
                    Cancel
                  </Button>
             
              </Grid>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}
