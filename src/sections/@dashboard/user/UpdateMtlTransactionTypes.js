/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getPerAllMtlTransactionTypesService } from '../../../Services/Admin/GetPerAllMtlTransactionTypes';

export default function UpdateMtlTransactionTypes() {
  const { transaction_type_id } = useParams();
  const navigate = useNavigate();
  console.log('update page ', transaction_type_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const currentDate = new Date();

  // Extract the date components
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = currentDate.getDate().toString().padStart(2, '0');

  // Create the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  const [transaction, setTransaction] = useState({
    transactionTypeId: '',
    lastUpdateDate: '',
    lastUpdatedBy: '',
    creationDate: formattedDate,
    createdBy: '',
    transactionTypeName: '',
    description: '',
    transactionActionId: '',
    transactionSourceTypeId: '',
  });

  const onValueChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets update', { transaction_type_id });
    console.log('without', transaction_type_id);
    const result = await getPerAllMtlTransactionTypesService(transaction_type_id);


    setTransaction({
      ...transaction,
      transactionTypeId: result.data[0].transaction_type_id,
      lastUpdateDate: result.data[0].last_update_date,

      lastUpdatedBy: result.data[0].last_updated_by,
      creationDate: result.data[0].creation_date,
      createdBy: result.data[0].created_by,

      transactionTypeName: result.data[0].transaction_type_name,
      description: result.data[0].description,
      transactionActionId: result.data[0].transaction_action_id,
      transactionSourceTypeId: result.data[0].transaction_source_type_id,
    });

    console.log('transaction Details', transaction);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  

  const handleClick = async () => {
    try {
      console.log('loc', transaction);
      const response = await axios.put(
        `http://182.160.114.100:5001/update-mtl-transaction-types/${transaction.transactionTypeId}`,
        transaction
      );

      console.log('Pass to home after request ');
      handleClose();
      
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
      <div>
        <h3 style={{ marginLeft: '50px' }}>
          Update {transaction.transactionTypeId} of {transaction.transactionTypeName} transaction
        </h3>
        <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
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
                
                </tr>
              </thead>
              <tbody>
                <td style={{ width: '250px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="lastUpdateDate"
                    label="Last Update Date "
                    value={transaction.lastUpdateDate}
                    // onChange={(e) => onValueChange(e)}
                    //  onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '400px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="lastUpdatedBy"
                    label="Last Updated By"
                    value={transaction.lastUpdatedBy}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>

                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="createdBy"
                    label="Created By"
                    value={transaction.createdBy}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
          
              </tbody>
            </table>
            <table className="table table-bordered table-striped table-highlight">
              <thead>
                <tr>
             
                  <th>
                  Transaction Type Name<span style={{ color: 'red' }}>*</span>
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
           
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="transactionTypeName"
                    label="Transaction Type Name"
                    value={transaction.transactionTypeName}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '750px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    label="Description"
                    value={transaction.description}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="transactionActionId"
                    label="Transaction Action Id"
                    value={transaction.transactionActionId}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="transactionSourceTypeId"
                    label="Transaction Source Type Id"
                    value={transaction.transactionSourceTypeId}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
              </tbody>
            </table>
          
            <Button style={{ marginRight: '10px', fontWeight: 'bold', color: 'black',backgroundColor:"lightgray" }} onClick={handleClick}>
                    Submit
                  </Button>
                  <Button style={{ marginRight: '10px', fontWeight: 'bold', color: 'black',backgroundColor:"lightgray" }} onClick={handleClose}>
                    Cancel
                  </Button>
         
          </div>
        </form>
      </div>
    </div>
   
  );
}
