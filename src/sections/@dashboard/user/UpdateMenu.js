/* eslint-disable import/named */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import { Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getperMenuDetails } from '../../../Services/ApiServices';
import Iconify from '../../../components/iconify';

export default function UpdateMenu({ menu_id }) {
  const navigate = useNavigate();
  console.log('update page person', menu_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [mmenu, setMenu] = useState({
    menuDescription: '',
    menuActive: '',

  });

  const onValueChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };
  const loadUser = async () => {
    console.log('with brackets', { menu_id });
    console.log('without', menu_id);
    const result = await getperMenuDetails(menu_id);
    console.log('Eiii', result.data[0].system_menu_id);
    setMmenu({
      ...menu,
      menuDescription: result.data[0].menu_description,
      menuActive: result.data[0].menu_active,

    });
  };

  const handleClick = async () => {
    try {
      console.log('loc', mainsystemmenu);
      const response = await axios.put(
        `http://182.160.114.100:5001/update-main-system-menu/${system_menu_id}`,
        mainsystemmenu
      );

      console.log('Pass to home after request ');
      handleClose();
      navigate('/showmainsystemmenu');
      window.location.reload();
    } catch (err) {
      console.log(err.message.TextField);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
        Update
      </Button>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'Add New Locations'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField type={'text'} name="system_menu_id" label="System Menu Id" value={system_menu_id} />
            <TextField
              type={'text'}
              name="systemMenuDescription"
              label="System Menu Description"
              value={mainsystemmenu.systemMenuDescription}
              onChange={(e) => onValueChange(e)}
            />

            <TextField
              type={'text'}
              name="menuActive"
              label="Menu Active"
              value={mainsystemmenu.menuActive}
              onChange={(e) => onValueChange(e)}
            />

            <TextField
              type={'text'}
              name="  iconPath"
              label="  Icon Path"
              value={mainsystemmenu.iconPath}
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
    </div>
  );
}
