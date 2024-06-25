/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Container, Stack, Typography } from '@mui/material';
import { dowloadBankDepositReceiptService, getBankDepositDetailsViewService } from '../Services/ApiServices';
import { useUser } from '../context/UserContext';

// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();
  const { cash_receipt_id } = useParams();

  function getFormattedDate(value) {
    const dateObject = new Date(value);

    // Extract date and time components
    const formattedDate = dateObject.toLocaleDateString();
    const formattedTime = dateObject.toLocaleTimeString();
    const date = new Date(formattedDate);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}    ${formattedTime}`;
  }

  const { user } = useUser();
  console.log(user);

  //   const [account, setAccount] = useState({});
  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         if (user) {
  //           const accountDetails = await getUserProfileDetails(user); // Call your async function here
  //           if (accountDetails.status === 200) setAccount(accountDetails.data); // Set the account details in the component's state
  //         }
  //       } catch (error) {
  //         // Handle any errors that might occur during the async operation
  //         console.error('Error fetching account details:', error);
  //       }
  //     }

  //     fetchData(); // Call the async function when the component mounts
  //   }, [user]);
  //   console.log(account);

  const [depositDetails, setDepositDetails] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        console.log(cash_receipt_id);
        if (cash_receipt_id) {
          const response = await getBankDepositDetailsViewService(user, cash_receipt_id); // Call your async function here
          if (response.status === 200) setDepositDetails(response.data); // Set the account details in the component's state
        }
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, [cash_receipt_id]);
  console.log(depositDetails);

  const dowloadBankDepositReceipt = async () => {
    try {
      const filename = depositDetails.uploaded_filename;
      console.log(filename);

      const requestBody = {
        fileName: filename,
      };
      const response = await dowloadBankDepositReceiptService(user, requestBody);

      if (response.status === 200) {
        const byteArray = response.data;
        const contentType = response.headers['content-type'];

        const blob = new Blob([byteArray], { type: contentType });
        console.log(blob);

        saveAs(blob, filename);
      } else {
        console.log('Image download failed. Server returned status:', response.status);
      }
    } catch (error) {
      console.error('Error during image download:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> OSMS | Sales Order Form </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          style={{ marginBottom: '2px', marginTop: '10px' }}
        >
          <Typography variant="h5" gutterBottom>
            Bank Deposit Details
          </Typography>
        </Stack>
        <div className="row g-3 align-items-center" style={{ boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)' }}>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="orderNumber" className="col-form-label" style={{ display: 'flex' }}>
              Deposit Date :<span style={{ marginLeft: '10px' }}>{getFormattedDate(depositDetails.deposit_date)}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="orderedDate" className="col-form-label" style={{ display: 'flex' }}>
              Depositor Bank :<span style={{ marginLeft: '10px' }}>{depositDetails.depositor_bank}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="distributor" className="col-form-label" style={{ display: 'flex' }}>
              Depositor Branch :<span style={{ marginLeft: '10px' }}>{depositDetails.customer_bank_branch_id}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="ship_to" className="col-form-label" style={{ display: 'flex' }}>
              Deposit Type :<span style={{ marginLeft: '10px' }}>{depositDetails.deposit_type}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="shippingMethodCode" className="col-form-label" style={{ display: 'flex' }}>
              Amount :<span style={{ marginLeft: '10px' }}>{depositDetails.amount}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="special_discount" className="col-form-label" style={{ display: 'flex' }}>
              Deposit Attachment :
              <span style={{ marginLeft: '10px' }}>
                {/* <img
                  src="https://us.remarkhb.com/wp-content/uploads/2022/01/remark-200x190.png"
                  alt="deposit attachment"
                /> */}
                <button onClick={dowloadBankDepositReceipt}>download attachment</button>
              </span>
              {/* Deposit Attachment :<span style={{ marginLeft: '10px' }}><img src='../Resources/Images/Deposits/deposit_13-fotor-bg-remover-20230919163920.png' alt='deposit attachment'></img> {depositDetails.uploaded_filename}</span> */}
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="special_adjustment" className="col-form-label" style={{ display: 'flex' }}>
              Receipt Number :<span style={{ marginLeft: '10px' }}>{depositDetails.receipt_number}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="total_price" className="col-form-label" style={{ display: 'flex' }}>
              Company Bank Account :<span style={{ marginLeft: '10px' }}>{depositDetails.bank_account_num}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="salesPerson" className="col-form-label" style={{ display: 'flex' }}>
              Bank Name :<span style={{ marginLeft: '10px' }}>{depositDetails.bank_name}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="salesPerson" className="col-form-label" style={{ display: 'flex' }}>
              Company Name :<span style={{ marginLeft: '10px' }}>{depositDetails.company_name}</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '33%' }}>
            <label htmlFor="salesPerson" className="col-form-label" style={{ display: 'flex' }}>
              Remarks :<span style={{ marginLeft: '10px' }}>{depositDetails.remarks}</span>
            </label>
          </div>
        </div>
      </Container>
    </>
  );
}
