/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { Container, Grid, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addHzCustAccountsDetails,
  getPerHzCustAccountsDetails,
  getUserProfileDetails,
} from '../../../Services/ApiServices';

export default function AddHzCustAccounts() {
  const navigate = useNavigate();
  const { cust_account_id } = useParams();
  console.log(cust_account_id);
  console.log(cust_account_id === 'null');
  const [e, setE] = useState();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [errors, setErrors] = useState({});
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showMenuLines, setShowMenuLines] = useState(!(cust_account_id === 'null'));
  console.log(showMenuLines);

  const [clonelocation, setClonelocation] = useState([{}]);
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = `${date}/${month}/${year}`;

  useEffect(() => {
    async function fetchData() {
      try {
        const usersDetailslogin = await getUserProfileDetails();
        console.log(usersDetailslogin);
        setE(usersDetailslogin);

        //  if (usersDetailslogin) setE(usersDetails.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { cust_account_id });
        console.log('without', typeof cust_account_id);

        console.log(typeof cust_account_id);
        if (cust_account_id !== 'null') {
          const result = await getPerHzCustAccountsDetails(parseInt(cust_account_id, 10));

          setClonelocation(result.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log(clonelocation);

  const handleMenuChange = (index, name, value) => {
    const updatedRows = [...clonelocation];
    updatedRows[index][name] = value;
    setClonelocation(updatedRows);
    console.log(clonelocation);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [count, setCount] = useState(0);
  const handleClick = async () => {
    try {
      console.log('clone', clonelocation.cust_account_id);

      const filteredArray = clonelocation.filter((item) => Object.values(item).some((value) => value !== ''));

      let c;
      for (c = 0; c < filteredArray.length; c++) {
        const lineInfo = filteredArray[c];
        console.log('line info ', lineInfo);
        if (cust_account_id === 'null' || lineInfo.cust_account_id === '') {
          const requestBody = {
            lastUpdateDate: currentDate,
            accountNumber: lineInfo.account_number,
            lastUpdatedBy: e.user_id,
            creationDate: currentDate,
            createdBy: e.user_id,
            lastUpdateLogin: lineInfo.last_update_login,

            primarySalesrepId: lineInfo.primary_salesrep_id,
            salesChannelCode: lineInfo.sales_channel_code,

            accountName: lineInfo.account_name,
            emailAddress: lineInfo.email_address,
            workTelephone: lineInfo.work_telephone,
          };

          const response = await addHzCustAccountsDetails(requestBody);
          console.log('Pass to home after request ');
          handleClose();
        } else {
          const requestBody = {
            lastUpdateDate: currentDate,
            accountNumber: lineInfo.account_number,
            lastUpdatedBy: e.user_id,
            creationDate: currentDate,
            createdBy: e.user_id,
            lastUpdateLogin: lineInfo.last_update_login,

            primarySalesrepId: lineInfo.primary_salesrep_id,
            salesChannelCode: lineInfo.sales_channel_code,
            paymentTermId: lineInfo.payment_term_id,
            accountName: lineInfo.account_name,
            emailAddress: lineInfo.email_address,
            workTelephone: lineInfo.work_telephone,
          };

          const response = await axios.put(
            `http://182.160.114.100:5001/update-hz-cust-accounts/${lineInfo.cust_account_id}`,
            requestBody
          );
          console.log('Pass to home after request ');
          handleClose();
        }
      }
      setClonelocation([]);
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };
  const handleAddRow = () => {
    console.log('ll', clonelocation.length);
    if (clonelocation.length === 1) setShowMenuLines(true);

    console.log(clonelocation);
    if (showMenuLines) {
      console.log('dd', showMenuLines);
      setClonelocation([
        ...clonelocation,
        {
          last_update_date: '',
          account_number: '',
          last_updated_by: '',
          creation_date: '',
          created_by: '',
          last_update_login: '',
          customer_type: '',
          customer_class_code: '',
          primary_salesrep_id: '',
          sales_channel_code: '',
          payment_term_id: '',
          account_name: '',
          email_address: '',
          work_telephone: '',
        },
      ]);
    }
    console.log(clonelocation);
  };

  const handleClose = () => {
    // navigate('/dashboard/showhzcustaccounts');

    // window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Business Partner Accounts
          </Typography>
        </Stack>
        <Grid item xs={3}>
          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={() => {
              handleAddRow();
            }}
          >
            Create Accounts
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
                      Account Number <span style={{ color: 'red' }}>*</span>
                    </th>

                    <th>Last Update Login</th>

                    <th>Primary Salesrep Id</th>
                    <th>Sales Channel Code</th>

                    <th>Account Name</th>

                    <th>Email Address</th>
                    <th>Work Telephone</th>
                  </tr>
                </thead>
                <tbody>
                  {showMenuLines &&
                    clonelocation.map((row, index) => (
                      <tr key={index}>
                        {/* <td style={{ width: '150px' }}>
                          <TextField
                            type="date"
                            name="last_update_date"
                            label={sentenceCase('last_update_date')}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                            error={!!errors.last_update_date}
                            helperText={errors.last_update_date}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={row.last_update_date}
                          />
                        </td> */}
                        <td style={{ width: '300px' }}>
                          <input
                            style={{ width: '170px' }}
                            type="text"
                            className="form-control"
                            name="account_number"
                            value={row.account_number}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="last_update_login"
                            value={row.last_update_login}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="primary_salesrep_id"
                            value={row.primary_salesrep_id}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="sales_channel_code"
                            value={row.sales_channel_code}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="account_name"
                            value={row.account_name}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="email_address"
                            value={row.email_address}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="work_telephone"
                            value={row.work_telephone}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {showMenuLines && (
              <Grid item xs={3} style={{ marginTop: '20px' }}>
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
      </Container>
    </div>
  );
}
