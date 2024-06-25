/* eslint-disable react/jsx-fragments */
/* eslint-disable prefer-arrow-callback */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import * as React from 'react';
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPerAllMtlTransactionTypesService } from '../../../Services/Admin/GetPerAllMtlTransactionTypes';
import Iconify from '../../../components/iconify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteMtlTransactionTypes({ transaction_type_id }) {
  const navigate = useNavigate();
  console.log('delete page ', transaction_type_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

 

  const [transaction, setTransaction] = useState({
    transactionTypeId:'',

  });

  const onValueChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };
  const loadUser = async () => {
    console.log('with brackets', {transaction_type_id });
    console.log('without', transaction_type_id);
    const result = await getPerAllMtlTransactionTypesService(transaction_type_id);
   
    setTransaction({
      ...transaction,
      transactionTypeId: result.data[0].transaction_type_id,
      
    });

    console.log('location Details', transaction);
  };

  const handleClick = async () => {
    try {
      console.log('loc',transaction);
      const response = await axios.delete(
        `http://localhost:5001/delete-mtl-transaction-types/${transaction.transactionTypeId}`
      );

      console.log('Pass to home after request ');
      handleClose();
      navigate('/showmtltransactiontypes');
      window.location.reload();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
    // const { email, password, confirmPassword } = user;
    // const newErrors = {};

    // // Validate email
    // if (!validateEmail(email)) {
    //   newErrors.email = !email ? 'Email is required' : 'Invalid email address';
    // }

    // // Validate password
    // if (!validatePassword(password)) {
    //   newErrors.password = !password ? 'Password is required' : 'Password must be at least 6 characters long';
    // }

    // // Validate confirmPassword
    // if (password !== confirmPassword) {
    //   newErrors.confirmPassword = 'Passwords do not match';
    // }

    // // Check if there are any errors
    // if (Object.keys(newErrors).length === 0) {
    //   try {
    //     const response = await signup(user);

    //     if (response.status === 200) {
    //       alert('Successfully added!');
    //     } else {
    //       console.log(response);
    //       alert('Process failed! Try again later');
    //     }

    //     handleClose();
    //     navigate('/dashboard/user', { replace: true });
    //     window.location.reload();
    //   } catch (err) {
    //     console.log(err.message);
    //     alert('Process failed! Try again later');
    //   }
    // } else {
    //   setErrors(newErrors);
    // }
  };

  const handleClose = () => {
    setOpen(false);
  };


  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <React.Fragment>
      <Button variant="outlined" startIcon={<Iconify icon="eva:minus-fill" />} onClick={handleClickOpen}>
       Delete
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure you want to Delete ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Transaction Type Id Id : <b> {transaction_type_id} </b> 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}