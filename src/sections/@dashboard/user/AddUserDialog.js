import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { signup } from '../../../Services/ApiServices';
import Iconify from '../../../components/iconify';

export default function ResponsiveDialog() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const initialUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  };
  const [user, setUser] = useState(initialUser);

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
    if (e.target) setUser({ ...user, [e.target.name]: e.target.value });
    else setUser({ ...user, role: e.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClick = async () => {
    const { email, password, confirmPassword } = user;
    const newErrors = {};

    // Validate email
    if (!validateEmail(email)) {
      newErrors.email = !email ? 'Email is required' : 'Invalid email address';
    }

    // Validate password
    if (!validatePassword(password)) {
      newErrors.password = !password ? 'Password is required' : 'Password must be at least 6 characters long';
    }

    // Validate confirmPassword
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if there are any errors
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await signup(user);

        if (response.status === 200) {
          alert('Successfully added!');
        } else {
          console.log(response);
          alert('Process failed! Try again later');
        }

        handleClose();
        navigate('/dashboard/user', { replace: true });
        window.location.reload();
      } catch (err) {
        console.log(err.message);
        alert('Process failed! Try again later');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
        Add UOM
      </Button>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'Add New Users'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField name="name" label="Name" autoComplete="given-name" onChange={(e) => onValueChange(e)} />

            <TextField
              required
              name="email"
              label="Email address"
              autoComplete="given-name"
              onChange={(e) => onValueChange(e)}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              autoComplete="new-password"
              required
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => onValueChange(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              autoComplete="new-password"
              required
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => onValueChange(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Select
              name="role"
              placeholder="User role"
              autoComplete="given-name"
              onChange={(e) => onValueChange(e)}
              options={options}
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
