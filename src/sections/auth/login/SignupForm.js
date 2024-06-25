import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// services
import { compareOtp, sendOtp, signup, userProcess } from '../../../Services/ApiServices';
// components
import Iconify from '../../../components/iconify';
// external css
import '../../../_css/SignupPage.css';

// ----------------------------------------------------------------------

export default function SignupForm() {
  const initialUser = {
    userName: '',
    password: '',
    userType: 'Private',
    name: '',
    nid: '',
    age: null,
    gender: '',
    profession: '',
    orgaization: '',
    address: '',
  };
  const [user, setUser] = useState(initialUser);
  const [selectedType, setSelectedType] = useState('');

  const navigate = useNavigate();
  const [responseInfo, setResponseInfo] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const onVerify = async () => {
    // const verifyUser = {
    //   verificationCode: otp,
    //   id: user.id,
    //   password: user.password,
    // };
    const requestBody = {
      verificationCode: otp,
      userName: user.userName,
      password: user.password,
      userType: user.userType,
      name: user.name,
      nid: user.nid,
      age: user.age,
      address: user.address,
      gender: user.gender,
      profession: user.profession,
      orgaization: user.orgaization,
    };

    const response = await compareOtp(requestBody);

    if (response.status === 200) {
      if (response.data.isMatched) {
        // const type = user.userType === 'Public' ?
        const processBody = {
          userType: selectedType,
          userName: user.userName,
          userPassword: user.password,
          custName: user.name ? user.name : '',
          custNid: user.nid ? user.nid : '',
          custAddress: user.address ? user.address : '',
          custAge: user.age ? parseInt(user.age, 10) : 0,
          custGender: user.gender ? user.gender : '',
          custProfession: user.profession ? user.profession : '',
          custOrganization: user.orgaization ? user.orgaization : '',
        };

        const result = await userProcess(processBody);
        const alertMessage = result.status === 200 ? 'Signup completed!' : 'Process Failed! Try Again';
        alert(alertMessage);
      } else {
        alert('OTP does not match! Try Again');
      }

      navigate('/login', { replace: true });
    } else {
      alert('Process Failed! Try Again');
    }

    handleClose();
  };

  const validatePassword = (password) => password.length >= 6;

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const validatePhoneNumber = (number) => {
    // Regular expression for Bangladeshi phone number validation
    const bdPhoneNumberRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return bdPhoneNumberRegex.test(number);
  };

  const onValueChange = (e) => {
    if (e.target) setUser({ ...user, [e.target.name]: e.target.value });
    else setUser({ ...user, role: e.value });
  };

  const handleResend = async () => {
    try {
      const reqBody = {
        email: responseInfo.email,
        userId: responseInfo.userId,
      };

      const sendOtpService = await sendOtp(reqBody);

      if (sendOtpService.status === 200) {
        // Update the resendAttempts count

        alert('OTP resent successfully!');
      } else {
        alert('Resend failed! Try again');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Resend failed! Try again');
    }
  };

  const handleClick = async () => {
    const { userName, password, confirmPassword } = user;
    const newErrors = {};

    // Validate userName
    if (user.userType === 'Public' && !validateEmail(user.userName) && !validatePhoneNumber(user.userName)) {
      newErrors.userName = !user.userName ? 'User name is required' : 'Please enter valid email or phone number';
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
        let requestBody = {};
        if (user.userType === 'Private') {
          requestBody = {
            userName: user.userName,
            password: user.password,
            userType: user.userType,
          };
        } else {
          requestBody = {
            userName: user.userName,
            password: user.password,
            userType: user.userType,
            name: user.name,
            nid: user.nid,
            age: user.age,
            address: user.address,
            gender: user.gender,
            profession: user.profession,
            orgaization: user.orgaization,
          };
        }
        // const newUser = {
        //   id: user.id,
        //   password: user.password,
        // };
        const response = await signup(requestBody);

        if (response.status === 200 || response.status === 204) {
          console.log(response.data.user);
          setSelectedType(response.data.user);
          console.log(selectedType);

          if (response.data.authenticationMethod.flag === 'email') {
            const reqBody = {
              email: response.data.authenticationMethod.value,
              userId: userName,
            };
            console.log(reqBody);
            setResponseInfo(reqBody);

            const sendOtpService = await sendOtp(reqBody);

            if (sendOtpService.status === 200) {
              handleOpen();
            } else {
              alert('Signup failed! Try again');
              window.location.reload();
            }
          } else {
            const processBody = {
              // userType: selectedType,
              userType: response.data.user,
              userName: user.userName,
              userPassword: user.password,
              custName: user.name ? user.name : '',
              custNid: user.nid ? user.nid : '',
              custAddress: user.address ? user.address : '',
              custAge: user.age ? parseInt(user.age, 10) : 0,
              custGender: user.gender ? user.gender : '',
              custProfession: user.profession ? user.profession : '',
              custOrganization: user.orgaization ? user.orgaization : '',
            };

            const result = await userProcess(processBody);
            const alertMessage =
              result.status === 200
                ? 'Signup completed!! Plese contact with HR for your signup approval'
                : 'Signup failed! Try again';
            // alert('Plese contact with HR for your signup approval!');
            alert(alertMessage);
            navigate('/login', { replace: true });
          }
        } else {
          console.log(response);
          alert('Signup failed! Try again later');
        }
      } catch (err) {
        alert('Signup failed! Try again later');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });

    const display = event.target.value === 'Public' ? 'none' : 'block';
    setSelectedValue(display);
    // Add any additional logic you want to perform when the selection changes
    console.log(selectedValue);
  };

  return (
    <>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="userType"
        value={user.userType}
        onChange={handleChange}
      >
        <FormControlLabel value="Private" control={<Radio />} label="Private" />
        <FormControlLabel value="Public" control={<Radio />} label="Public" />
      </RadioGroup>
      {user.userType === 'Private' && (
        <Stack spacing={3} mt={1.25}>
          <TextField
            required
            name="userName"
            label="User name"
            placeholder="Code/ID"
            autoComplete="given-name"
            onChange={(e) => onValueChange(e)}
            className="hover-hint"
            InputLabelProps={{
              shrink: true,
            }}
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
        </Stack>
      )}

      {user.userType === 'Public' && (
        <Stack spacing={3} mt={1.25}>
          <TextField
            required
            name="userName"
            label="User name"
            autoComplete="given-name"
            placeholder="Phone/Email"
            onChange={(e) => onValueChange(e)}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.userName}
            helperText={errors.userName}
          />
          <Stack spacing={2} direction={'row'}>
            <TextField
              autoComplete="new-password"
              required
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => onValueChange(e)}
              style={{ width: '50%' }}
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
              style={{ width: '50%' }}
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
          </Stack>
          <Stack spacing={2} direction={'row'}>
            <TextField name="name" label="Name" autoComplete="given-name" onChange={(e) => onValueChange(e)} />
            <TextField name="nid" label="NID" autoComplete="given-name" onChange={(e) => onValueChange(e)} />
          </Stack>
          <TextField name="address" label="Address" autoComplete="given-name" onChange={(e) => onValueChange(e)} />
          <Stack spacing={2} direction={'row'}>
            <TextField
              name="age"
              type="number"
              label="Age"
              autoComplete="given-name"
              onChange={(e) => onValueChange(e)}
            />
            <TextField select name="gender" label="Gender" id="gender" onChange={(e) => onValueChange(e)} fullWidth>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            {/* <TextField name="gender" label="Gender" autoComplete="given-name" onChange={(e) => onValueChange(e)} /> */}
          </Stack>
          <Stack spacing={2} direction={'row'}>
            <TextField
              name="profession"
              label="Profession"
              autoComplete="given-name"
              onChange={(e) => onValueChange(e)}
            />
            <TextField
              name="orgaization"
              label="Orgaization"
              autoComplete="given-name"
              onChange={(e) => onValueChange(e)}
            />
          </Stack>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Sign up
        </LoadingButton>
      </Stack>

      <Dialog
        style={{ textAlign: 'center' }}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{'OTP VERIFICATIONS'}</DialogTitle>
        <DialogContent>
          <DialogContentText>A code has been sent to your official email provided by Remark HB.</DialogContentText>

          <DialogContentText style={{ color: 'crimson', margin: '15px' }}>
            Please enter the otp to verify your signup.
          </DialogContentText>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span> </span>}
            inputType="tel"
            containerStyle={{ display: 'unset' }}
            inputStyle={{ width: '3rem', height: '3.5rem' }}
            renderInput={(props) => <input {...props} className="otp-input" />}
          />

          <DialogContentText style={{ margin: '5px' , cursor: 'pointer' }} >
            Didn't get the code?{' '}
            <span
              style={{ color: 'crimson' }}
              onClick={handleResend}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleResend();
                }
              }}
              role="button"
              tabIndex={0}
            >
              Resend{' '}
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton autoFocus onClick={onVerify}>
            Verify
          </LoadingButton>
          <LoadingButton onClick={handleClose} autoFocus>
            Cancel
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
