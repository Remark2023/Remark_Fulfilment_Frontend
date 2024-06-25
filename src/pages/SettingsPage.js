import { LoadingButton } from '@mui/lab';
import { Container, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { MDBAccordion } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// component
import { changePasswordService, comparePasswordService, getUserProfileDetails } from '../Services/ApiServices';
import Iconify from '../components/iconify';

import { useUser } from '../context/UserContext';
// import { comparePasswordService } from '../Services/ApiServices';

export default function SettingsPage() {
  // const [user, setUser] = useState({});

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const accountDetails = await getAccountDetailsService();
  //       setUser(accountDetails);
  //     } catch (error) {
  //       console.error('Error fetching account details:', error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  const [account, setAccount] = useState({});
  const { user } = useUser();
  console.log(user);

  useEffect(() => {
    async function fetchData() {
      try {
        if (user) {
          const accountDetails = await getUserProfileDetails(user); // Call your async function here
          if (accountDetails.status === 200) {
            setAccount(accountDetails.data);
          } // Set the account details in the component's state
        }
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, [user]);
  console.log(account);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [oldPassword, setOldPassword] = useState('');

  const validatePhone = (phone) => phone.length >= 11;

  const validateOldPassword = async (passwordInfo) => {
    const response = await comparePasswordService(user, passwordInfo);

    return response.status === 200 ? response.data.value : false;
  };

  const validatePassword = (password) => password.length >= 6;

  const options = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' },
    { value: 'Not to mention', label: 'Not to mention' },
  ];

  const initialSecurityDetails = {
    password: '',
    confirmPassword: '',
  };
  const [securityDetails, setSecurityDetails] = useState(initialSecurityDetails);

  // on value change functions
  // const onValueChangeProfileDetails = (e) => {
  //   if (e.target) setUser({ ...user, [e.target.name]: e.target.value });
  //   else setUser({ ...user, gender: e.value });
  // };

  const onValueChangeOldPassword = (e) => {
    setOldPassword(e.target.value);
  };

  const onValueChangeSecurityDetails = (e) => {
    setSecurityDetails({ ...securityDetails, [e.target.name]: e.target.value });
  };

  // const onValueChangeAccountDetails = (e) => {
  //   setUser({ ...user, name: e.target.value });
  // };

  // on submit functions
  // const submitProfileDetails = async () => {
  //   // form validation
  //   const { phone } = user;
  //   const newErrors = {};

  //   // Validate phone
  //   if (phone && !validatePhone(phone)) {
  //     newErrors.phone = 'Invalid phone number';
  //   }

  //   // Check if there are any errors
  //   if (Object.keys(newErrors).length === 0) {
  //     console.log(user);
  //     try {
  //       const profileDetails = {
  //         profession: user.profession ? user.profession : '',
  //         address: user.address ? user.address : '',
  //         phone: user.phone ? user.phone : '',
  //         age: user.age ? user.age : '',
  //         gender: user.gender ? user.gender : '',
  //       };
  //       const response = await updateProfileDetails(user.email, profileDetails);

  //       const alertMessage =
  //         response.status === 200 ? 'Profile updated successfully!' : 'Service failed! Try again later';

  //       alert(alertMessage);
  //     } catch (err) {
  //       alert('Service failed! Try again later');
  //     }

  //     navigate('/dashboard/profile', { replace: true });
  //   } else {
  //     setErrors(newErrors);
  //   }
  // };

  const updateSecurityDetails = async () => {
    const { password, confirmPassword } = securityDetails;
    const newErrors = {};

    const oldPasswordInfo = {
      password: oldPassword,
    };
    const isValidOldPassword = await validateOldPassword(oldPasswordInfo);

    // Validate oldPassword
    if (!isValidOldPassword) {
      newErrors.oldPassword = !oldPassword ? 'Password is required' : 'Wrong password';
    }

    // Validate password
    if (!validatePassword(password)) {
      newErrors.password = !password ? 'Password is required' : 'Password must be at least 6 characters long';
    }

    // Validate confirmPassword
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const newPasswordInfo = {
          // email: user.email,
          newPassword: password,
        };

        const response = await changePasswordService(user, newPasswordInfo);

        const alertMessage = response.status === 200 ? response.data.message : 'Service failed! Try again later';

        alert(alertMessage);
      } catch (error) {
        console.log(error.message);

        alert('Service failed! Try again later');
      }

      navigate('/dashboard/', { replace: true });
    } else {
      setErrors(newErrors);
    }
  };

  // const updateAccountDetails = async () => {
  //   try {
  //     const usernameInfo = {
  //       email: user.email,
  //       name: user.name,
  //     };

  //     const response = await updateUsername(usernameInfo);

  //     const alertMessage = response.status === 200 ? response.data.message : 'Service failed! Try again later';

  //     alert(alertMessage);
  //   } catch (err) {
  //     console.log(err.message);

  //     alert('Service failed! Try again later');
  //   }

  //   navigate('/dashboard/profile', { replace: true });
  //   window.location.reload();
  // };

  return (
    <Container>
      <MDBAccordion initialActive={1}>
        {/* <MDBAccordionItem collapseId={1} headerTitle="Profile Settings">
        <Stack spacing={3}>
          <TextField
            name="profession"
            label="Profession"
            value={user.profession}
            onChange={(e) => onValueChangeProfileDetails(e)}
          />
          <TextField
            name="address"
            label="Address"
            value={user.address}
            onChange={(e) => onValueChangeProfileDetails(e)}
          />
          <TextField
            name="phone"
            label="Phone"
            value={user.phone}
            onChange={(e) => onValueChangeProfileDetails(e)}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField name="age" label="Age" value={user.age} onChange={(e) => onValueChangeProfileDetails(e)} />

          <Select
            name="gender"
            placeholder="Gender"
            options={options}
            onChange={(e) => onValueChangeProfileDetails(e)}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={submitProfileDetails}>
            Update
          </LoadingButton>
        </Stack>
      </MDBAccordionItem> */}
        <Container>
          {/* <MDBAccordionItem collapseId={2} headerTitle="Security Settings"> */}
          <Stack spacing={3} mt={3}>
            <TextField
              autoComplete="new-password"
              required
              name="oldPassword"
              label="Old Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => onValueChangeOldPassword(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
            />
            <TextField
              autoComplete="new-password"
              required
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => onValueChangeSecurityDetails(e)}
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
              onChange={(e) => onValueChangeSecurityDetails(e)}
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={updateSecurityDetails}>
              Update
            </LoadingButton>
          </Stack>
          {/* </MDBAccordionItem> */}
        </Container>
        {/* <MDBAccordionItem collapseId={3} headerTitle="Account Settings">
        <Stack spacing={3}>
          <TextField name="name" label="Name" value={user.name} onChange={(e) => onValueChangeAccountDetails(e)} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={updateAccountDetails}>
            Update
          </LoadingButton>
        </Stack>
      </MDBAccordionItem> */}
      </MDBAccordion>
    </Container>
  );
}
