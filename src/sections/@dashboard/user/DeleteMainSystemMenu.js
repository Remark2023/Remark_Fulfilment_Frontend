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
import { getperMainSystemMenuService } from '../../../Services/Admin/GetperMainSystemMenu';
import Iconify from '../../../components/iconify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteFndUser({ system_menu_id }) {
  const navigate = useNavigate();
  console.log('delete page ', system_menu_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [mainsystemmenu, setMainsystemmenu] = useState({
    systemMenuId: '',
  });
  const onValueChange = (e) => {
    setMainsystemmenu({ ...mainsystemmenu, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };
  const loadUser = async () => {
    console.log('with brackets', { system_menu_id });
    console.log('without', system_menu_id);
    const result = await getperMainSystemMenuService(system_menu_id);

    setMainsystemmenu({
      ...mainsystemmenu,
      systemMenuId: result.data[0].system_menu_id,
    });

    console.log('people Details', mainsystemmenu);
  };

  const handleClick = async () => {
    try {
      console.log('loc', mainsystemmenu);
      const response = await axios.delete(
        `http://localhost:5001/delete-main-system-menu/${mainsystemmenu.systemMenuId}`
      );

      console.log('Pass to home after request ');
      handleClose();
      navigate('/showmainsystemmenu');
      window.location.reload();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <DialogTitle>{'Are you sure you want to Delete ?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            System Menu Id : <b> {system_menu_id} </b>
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
