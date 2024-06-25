import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
// components
import { useUser } from '../context/UserContext';
import {
  addBankDepositService,
  getBankAccountsViewService,
  getBankBranchesService,
  getBankListService,
  getCustomerListService,
  getDepositTypesService,
  getUserProfileDetails,
  uploadBankDepositAttachmentService,
} from '../Services/ApiServices';

// external css
// import '../../../_css/LoginPage.css';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [deposit, setDeposit] = useState({
    depositorBank: {},
    depositorBranch: {},
    companyBankAccount: {},
    payFromCustomer: {},
  });

  const navigate = useNavigate();

  const { user } = useUser();
  console.log(user);

  const [account, setAccount] = useState({});
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

  const [customerList, setCustomerList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          const response = await getCustomerListService(user); // Call your async function here
          console.log(account.user_name);

          const self = {
            account_number: account.user_name,
            cust_account_id: account.user_id,
            full_name: account.full_name,
            ship_to_address: account.ship_to_address,
          };
          response.data.push(self);

          if (response.status === 200) setCustomerList(response.data); // Set the account details in the component's state
        }
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, [account]);
  console.log(customerList);

  const [bankList, setBankList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankListService(user); // Call your async function here
        if (response.status === 200) setBankList(response.data); // Set the account details in the component's state
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []);
  console.log(bankList);

  const [bankBranchList, setBankBranchList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const bankId = deposit.depositorBank.bank_id;
        if (bankId) {
          console.log(bankId);
          const response = await getBankBranchesService(user, bankId); // Call your async function here
          if (response.status === 200) setBankBranchList(response.data); // Set the account details in the component's state
        }
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, [deposit.depositorBank.bank_id]);
  console.log(bankBranchList);

  const [depositTypeList, setDepositTypeList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDepositTypesService(user); // Call your async function here
        if (response.status === 200) setDepositTypeList(response.data); // Set the account details in the component's state
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []);
  console.log(depositTypeList);

  const [bankAccountView, setBankAccountView] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankAccountsViewService(user);
        if (response.status === 200) setBankAccountView(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []);
  console.log(bankAccountView);

  const onValueChange = (e) => {
    console.log(e.target.name, e.target.value);
    setDeposit({ ...deposit, [e.target.name]: e.target.value });
  };

  const { loginUser } = useUser();
  console.log(loginUser);

  const handleClick = async () => {
    try {
      const requestBody = {
        customerBankAccountId: deposit.companyBankAccount.bank_account_id,
        customerBankBranchId: deposit.depositorBranch.bank_branch_id,
        receiptNumber: deposit.receiptNumber,
        depositDate: deposit.depositDate,
        amount: deposit.amount,
        legalEntityId: deposit.companyBankAccount.company_id,
        uploadedFilename: deposit.depositAttachment,
        depositorBank: deposit.depositorBank.bank_id,
        depositType: deposit.depositType,
        remarks: deposit.remarks,
        lastUpdatedBy: account.user_id,
        createdBy: account.user_id,
        payFromCustomer: deposit.payFromCustomer.cust_account_id,
        depositor: deposit.depositor,
      };
      console.log(requestBody);

      const response = await addBankDepositService(user, requestBody);

      if (response.request.status === 200) {
        navigate('/dashboard/dashclone', { replace: true });
      } else {
        alert('Process failed! Try again');
      }
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again');
    }
  };

  const [showBankList, setShowBankList] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showAccountList, setAccountShowList] = useState(false);
  const [showCustomerList, setCustomerShowList] = useState(false);

  // select depositor bank service required methods
  const [filteredBankList, setFilteredBankList] = useState([]);
  const handleInputBankChange = (event) => {
    const input = event.target.value;
    setShowBankList(true);

    setDeposit({ ...deposit, [event.target.name]: { bank_name: event.target.value } });

    const filtered = bankList.filter((item) => item.bank_name.toLowerCase().includes(input.toLowerCase()));
    setFilteredBankList(filtered);
  };

  const handleBankClick = (index, item) => {
    const name1 = 'depositorBank';

    setDeposit({ ...deposit, [name1]: item });
    setShowBankList(false);
  };

  // select pay from customer service required methods
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const handleInputCustomerChange = (event) => {
    const input = event.target.value;
    setCustomerShowList(true);

    setDeposit({ ...deposit, [event.target.name]: { full_name: event.target.value } });

    const filtered = customerList.filter((item) => item.full_name.toLowerCase().includes(input.toLowerCase()));
    console.log(filtered);
    setFilteredCustomerList(filtered);
  };

  const handleCustomerClick = (index, item) => {
    const name1 = 'payFromCustomer';

    setDeposit({ ...deposit, [name1]: item });
    setCustomerShowList(false);
  };

  // select depositor bank branch service required methods
  const [filteredBankBranchList, setFilteredBankBranchList] = useState([]);
  const handleInputBankBranchChange = (event) => {
    const input = event.target.value;
    setShowList(true);

    setDeposit({ ...deposit, [event.target.name]: { bank_branch_name: event.target.value } });

    const filtered = bankBranchList.filter((item) => item.bank_branch_name.toLowerCase().includes(input.toLowerCase()));
    setFilteredBankBranchList(filtered);
  };

  const handleBankBranchClick = (index, item) => {
    const name = 'depositorBranch';

    setDeposit({ ...deposit, [name]: item });
    setShowList(false);
  };

  // select bank accounts service required methods
  const [filteredBankAccountList, setFilteredBankAccountList] = useState([]);
  const handleInputBankAccountChange = (event) => {
    const input = event.target.value;
    setAccountShowList(true);

    setDeposit({ ...deposit, [event.target.name]: { bank_account_num: event.target.value } });

    const filtered = bankAccountView.filter((item) =>
      item.bank_account_num.toLowerCase().includes(input.toLowerCase())
    );
    console.log(filtered);
    setFilteredBankAccountList(filtered);
  };

  const handleBankAccountClick = (index, item) => {
    const name = 'companyBankAccount';

    setDeposit({ ...deposit, [name]: item });
    setAccountShowList(false);
  };

  // image upload method
  const uplodPhoto = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      console.log('Selected file:', selectedFile);

      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log(formData);

      const response = await uploadBankDepositAttachmentService(user, formData);

      const name = 'depositAttachment';

      setDeposit({ ...deposit, [name]: response.data.value });
    }
  };

  return (
    <>
      <Container sx={{ mt: -3.5 }}>
        <Container sx={{ my: 3 }}>
          <Typography variant="h4" gutterBottom>
            Deposit Entry Form
          </Typography>
        </Container>

        <Container sx={{ my: 3 }}>
          <Stack spacing={3} direction={'row'}>
            <TextField
              required
              type="date"
              name="depositDate"
              label="Deposit Date"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => onValueChange(e)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              required
              name="payFromCustomer"
              label="Pay From Customer"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => handleInputCustomerChange(e)}
              value={deposit.payFromCustomer.full_name ? deposit.payFromCustomer.full_name : ''}
              InputLabelProps={{ shrink: true }}
            />
            {showCustomerList && (
              <ul
                style={{
                  // position: 'absolute',
                  // top: '100%',
                  // left: 0,
                  // width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  zIndex: 1,
                }}
              >
                {filteredCustomerList.map((suggestion, index) => (
                  <MenuItem key={index} onClick={() => handleCustomerClick(index, suggestion)}>
                    {suggestion.full_name}
                  </MenuItem>
                ))}
              </ul>
            )}

            <TextField
              name="depositor"
              label="Depositor"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => onValueChange(e)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              required
              name="depositorBank"
              label="Depositor Bank"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => handleInputBankChange(e)}
              value={deposit.depositorBank.bank_name ? deposit.depositorBank.bank_name : ''}
              InputLabelProps={{ shrink: true }}
            />
            {showBankList && (
              <ul
                style={{
                  // position: 'absolute',
                  // top: '100%',
                  // left: 0,
                  // width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  zIndex: 1,
                }}
              >
                {filteredBankList.map((suggestion, index) => (
                  <MenuItem key={index} onClick={() => handleBankClick(index, suggestion)}>
                    {suggestion.bank_name}
                  </MenuItem>
                ))}
              </ul>
            )}

            <TextField
              required
              name="depositorBranch"
              label="Depositor Branch"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              value={deposit.depositorBranch.bank_branch_name ? deposit.depositorBranch.bank_branch_name : ''}
              onChange={(e) => handleInputBankBranchChange(e)}
              InputLabelProps={{ shrink: true }}
            />
            {showList && (
              <ul
                style={{
                  // position: 'absolute',
                  // top: '100%',
                  // left: 0,
                  // width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  zIndex: 1,
                }}
              >
                {filteredBankBranchList.map((suggestion, index) => (
                  <MenuItem key={index} onClick={() => handleBankBranchClick(index, suggestion)}>
                    {suggestion.bank_branch_name}
                  </MenuItem>
                ))}
              </ul>
            )}
          </Stack>
        </Container>

        <Container sx={{ my: 3 }}>
          <Stack spacing={3} direction={'row'}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Deposit Type *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="depositType"
                value={deposit.depositType}
                label="Deposit Type"
                onChange={(e) => onValueChange(e)}
                InputLabelProps={{ shrink: true }}
              >
                {depositTypeList.map((item) => (
                  <MenuItem key={item.deposit_type_id} value={item.deposit_type_id}>
                    {item.deposit_type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              required
              type="number"
              name="amount"
              label="Amount"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => onValueChange(e)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              type="file"
              name="depositAttachment"
              label="Deposit Attachment"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => uplodPhoto(e)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="receiptNumber"
              label="Receipt Number"
              autoComplete="given-name"
              placeholder="Optional"
              fullWidth
              style={{ backgroundColor: 'white' }}
              onChange={(e) => onValueChange(e)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Container>

        <Container sx={{ my: 3 }}>
          <Stack spacing={3} direction={'row'}>
            <TextField
              required
              name="companyBankAccount"
              label="Company Bank Account"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              value={deposit.companyBankAccount.bank_account_num ? deposit.companyBankAccount.bank_account_num : ''}
              onChange={(e) => handleInputBankAccountChange(e)}
              InputLabelProps={{ shrink: true }}
            />
            {showAccountList && (
              <ul
                style={{
                  // position: 'absolute',
                  // top: '100%',
                  // left: 0,
                  // width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  zIndex: 1,
                }}
              >
                {filteredBankAccountList.map((suggestion, index) => (
                  <MenuItem key={index} onClick={() => handleBankAccountClick(index, suggestion)}>
                    {suggestion.bank_account_num}
                  </MenuItem>
                ))}
              </ul>
            )}

            <TextField
              required
              disabled
              name="bankName"
              label="Bank Name"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              value={deposit.companyBankAccount.bank_name ? deposit.companyBankAccount.bank_name : ''}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              disabled
              name="companyName"
              label="Company Name"
              autoComplete="given-name"
              fullWidth
              style={{ backgroundColor: 'white' }}
              value={deposit.companyBankAccount.company_name ? deposit.companyBankAccount.company_name : ''}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Container>

        <Container sx={{ my: 3 }}>
          <TextareaAutosize
            name="remarks"
            placeholder="Remarks"
            style={{ width: '100%', height: '55px' }}
            onChange={(e) => onValueChange(e)}
          />
        </Container>

        <Container>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
            Submit
          </LoadingButton>
        </Container>
      </Container>
    </>
  );
}
