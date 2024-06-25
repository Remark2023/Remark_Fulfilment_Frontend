import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Container, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Iconify from '../components/iconify';
// api services
import { compareOtp, forgetPasswordService, getUserEmailAddress, sendOtp } from '../Services/ApiServices';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const initialUser = {
    id: '',
    password: '',
  };
  const [user, setUser] = useState(initialUser);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const onValueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const [otp, setOtp] = useState('');

  const handleResend = async () => {
    try {
      //   const reqBody = {
      //     email: responseInfo.email,
      //     userId: responseInfo.userId,
      //   };
      //   const sendOtpService = await sendOtp(reqBody);
      //   if (sendOtpService.status === 200) {
      //     // Update the resendAttempts count
      //     alert('OTP resent successfully!');
      //   } else {
      //     alert('Resend failed! Try again');
      //   }
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Resend failed! Try again');
    }
  };

  const onVerify = async () => {
    try {
      const requestBody = {
        verificationCode: otp,
        userName: user.id,
      };
      const response = await compareOtp(requestBody);

      if (response.status === 200) {
        if (response.data.isMatched) {
          setIsVerified(true);
          handleClose();
        } else {
          alert('OTP does not match! Try again');
        }
      } else {
        alert('Process failed! Try again');
      }
    } catch (error) {
      alert('Process failed! Try again');
    }
    // handleClose();
  };

  const handleClick = async () => {
    try {
      console.log(isVerified);
      if (!isVerified) {
        const userEmail = await getUserEmailAddress(user.id);

        if (userEmail.status === 200) {
          // handleOpen();
          if (userEmail.data.email_address) {
            const reqBody = {
              email: userEmail.data.email_address,
              userId: user.id,
            };
            const sendOtpService = await sendOtp(reqBody);

            if (sendOtpService.status === 200) {
              // alert('OTP resent successfully!');
              handleOpen();
            } else {
              alert('Process failed! Try again');
            }
          } else {
            alert('User not found! Please enter valid username');
          }
        } else {
          alert('Process failed! Try again');
        }
      } else {
        console.log(isVerified);
        // setIsVerified(true);
        // handleClose();
        const newPasswordInfo = {
          userName: user.id,
          newPassword: user.password,
        };
        const response = await forgetPasswordService(newPasswordInfo);

        if (response.status === 200) {
          navigate('/login', { replace: true });
        } else {
          alert('Process failed! Try again');
        }
      }
    } catch (err) {
      console.log(err.message);
      alert('Authentication failed! Try again');
    }
  };

  return (
    <>
      <Container>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} pt={2}>
            <Typography variant="h4" gutterBottom>
              Enter your username here
            </Typography>
          </Stack>
        </Container>
        <Container>
          <Stack spacing={3}>
            <TextField
              required
              //   className="hover-hint"
              name="id"
              label="User name"
              autoComplete="given-name"
              onChange={(e) => onValueChange(e)}
              disabled={isVerified}
            />
            {isVerified && (
              <Stack spacing={3}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  autoComplete="new-password"
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
                />
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  autoComplete="new-password"
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
                />
              </Stack>
            )}
          </Stack>
        </Container>

        <Container style={{ marginTop: '25px' }}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
            Submit
          </LoadingButton>
        </Container>

        <Container>
          <Stack align="center" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {'Copyright © '}
              {new Date().getFullYear()}{' '}
              <Link color="inherit" target="_blank" href="https://us.remarkhb.com/">
                Remark HB Limited
              </Link>{' '}
              <span> All rights reserved.</span>
            </Typography>
          </Stack>
        </Container>
      </Container>

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

          <DialogContentText style={{ margin: '5px', cursor: 'pointer' }}>
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
