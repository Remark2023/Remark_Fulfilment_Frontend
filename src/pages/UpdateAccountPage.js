/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Button, ButtonGroup, Container, Grid, Stack, Typography } from '@mui/material';
import {
  addbankFormLinesService,
  callReqApprovalFromPanelService,
  callSoApprovalService,
  deleteAccountsService,
  deleteSalesOrderLinesService,
  getAccountsService,
  getApprovalSequenceService,
  getBankBranchService,
  getBankHeaderService,
  getCustomerListService,
  getUserProfileDetails,
  updateAccountsService,
  updateBankOrderLineService,
} from '../Services/ApiServices';

// import { UserListHead } from '../sections/@dashboard/user';
import { useUser } from '../context/UserContext';
// ----------------------------------------------------------------------

export default function UpdateAccountPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { bank_account_id } = useParams();
  console.log('bankId', bank_account_id);

  const [account, setAccount] = useState({});
  const { user } = useUser();
  console.log(user);

  useEffect(() => {
    async function fetchData() {
      try {
        if (user) {
          const accountDetails = await getUserProfileDetails(user); // Call your async function here
          if (accountDetails.status === 200) setAccount(accountDetails.data); // Set the account details in the component's state
        }
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, [user]);
  console.log(account);

  const [soHeaderDetails, setSoHeaderDetails] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAccountsService(parseInt(bank_account_id, 10));
        console.log('Type of response.data:', typeof response.data);
        console.log(response);
        if (response && response.data) {
          setSoHeaderDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [bank_account_id]);
  console.log('soHeaderDetails', soHeaderDetails);

  const [soLineDetails, setSoLineDetails] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankBranchService(soHeaderDetails.bank_branch_id);
        console.log(response);

        if (response && response.data) setSoLineDetails(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [soHeaderDetails.bank_branch_id]);
  console.log('soLineDetails', soLineDetails);

  const [soLinesDetails, setSoLinesDetails] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankHeaderService(soHeaderDetails.bank_id);
        console.log(response);

        if (response && response.data) setSoLinesDetails(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [soHeaderDetails.bank_id]);
  console.log('soLineDetails', soLinesDetails);

  const [approvalSequenceDetails, setApprovalSequence] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getApprovalSequenceService(parseInt(bank_account_id, 10)); // Call your async function here
        if (response.status === 200) setApprovalSequence(response.data); // Set the account details in the component's state
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []);
  console.log(approvalSequenceDetails);

  const [filteredItemList, setFilteredItemList] = useState([]);

  //   const [headerInfo, setHeaderInfo] = useState({});

  const onValueChange = (e) => {
    setSoHeaderDetails({ ...soHeaderDetails, [e.target.name]: e.target.value });
  };
  const [showLines, setShowLines] = useState(true);

  const saveHeader = async () => {
    // const shipToValue = soHeaderDetails.ship_to ? soHeaderDetails.ship_to : '';
    const requestBody = {
      bankAccountName: soHeaderDetails.bank_account_name,
      bankAccountNum:soHeaderDetails.bank_account_num,
      bankBranchId: soHeaderDetails.bank_branch_id,
      bankId: parseInt(soHeaderDetails.bank_id, 10),
      accountClassification: soHeaderDetails.account_classification,
      lastUpdateDate: date,
      lastUpdatedBy: account.user_id,
      lastUpdateLogin: account.user_id,
      creationDate: date,
      createdBy: account.user_id,
    };
    console.log(requestBody);

    const response = await updateAccountsService(soHeaderDetails.bank_account_id, requestBody);
    if (response.status === 200) {
      console.log(response.data);
      alert('Data Updated');
      navigate(`/dashboard/manageaccountpage`);
      //   saveLines();
    } else {
      alert('Process failed! Try again');
    }
  };

  const handleAddRow = () => {
    // if (rows.length === 1) setShowLines(true);
    if (showLines) {
      setSoLineDetails([
        ...soLineDetails,
        {
          bankBranchName: '',
          description: '',
          addressLine1: '',
          city: '',
          bankAdminEmail: '',
        },
      ]);
    }
  };

  const handleInputChange = (index, name, value) => {
    setShowSaveLine(false);
    const updatedRows = [...soLineDetails];
    updatedRows[index][name] = value;
    setSoLineDetails(updatedRows);
    console.log(soLineDetails);
  };

  const [showApprovalButton, setShowApprovalButton] = useState(false);

  const submitRequisition = async () => {
    if (confirm('Are you sure for this requisition?')) {
      if (
        soHeaderDetails.authorization_status === 'Incomplete' ||
        soHeaderDetails.authorization_status === 'APPROVED'
      ) {
        const requestBody = {
          pHierarchyId: 1,
          pTransactionId: soHeaderDetails.header_id,
          pTransactionNum: soHeaderDetails.order_number.toString(),
          pAppsUsername: account.user_name,
          pNotificationId: 1,
          pApprovalType: 'A',
          pEmpid: 1,
          pNote: 'A',
          pAuthorizationStatus: soHeaderDetails.authorization_status,
        };
        const response = await callSoApprovalService(requestBody);

        if (response.status === 200) {
          navigate('/dashboard/dashclone', { replace: true });
        } else {
          alert('Process failed! Please try later');
        }
      } else {
        const requestBody = {
          pHierarchyId: 1,
          pTransactionID: soHeaderDetails.header_id,
          pTransactionNum: soHeaderDetails.order_number.toString(),
          pAppsUsername: account.user_name,
          pNotificationID: 1,
          pApprovalType: 'A',
          pEmpid: 1,
          pNote: 'test',
        };
        const response = await callReqApprovalFromPanelService(requestBody);

        if (response.status === 200) {
          navigate('/dashboard/dashclone', { replace: true });
        } else {
          alert('Process failed! Please try later');
        }
      }

      // window.location.reload();
    }
  };

  const rejectRequisition = async () => {
    if (confirm('Are you sure for this requisition?')) {
      const requestBody = {
        pHierarchyId: 1,
        pTransactionID: soHeaderDetails.header_id,
        pTransactionNum: soHeaderDetails.order_number.toString(),
        pAppsUsername: account.user_name,
        pNotificationID: 1,
        pApprovalType: 'R',
        pEmpid: 1,
        pNote: 'test',
      };
      const response = await callReqApprovalFromPanelService(requestBody);

      if (response.status === 200) {
        alert('Successfull!');
        navigate('/dashboard/dashclone', { replace: true });
      } else {
        alert('Process failed! Please try later');
      }
      // window.location.reload();
    }
  };
  const date = new Date();

  const saveLines = async () => {
    // const filteredArray = rows.filter((item) => Object.values(item).some((value) => value !== ''));
    const filteredArray = soLineDetails.filter((item) => Object.values(item).some((value) => value !== ''));
    console.log(filteredArray);

    filteredArray.forEach(async (lineInfo, index) => {
      console.log(lineInfo);
      if (lineInfo.bank_branch_id) {
        console.log(lineInfo);
        const requestBody = {
          bankId: soHeaderDetails.bank_id,
          bankBranchName: lineInfo.bank_branch_name,
          description: lineInfo.description,
          addressLine1: lineInfo.address_line1,
          city: lineInfo.city,
          bankAdminEmail: lineInfo.bank_admin_email,
          lastUpdateDate: date,
          lastUpdatedBy: account.user_id,
          lastUpdateLogin: account.user_id,
          creationDate: date,
          createdBy: account.user_id,
        };
        console.log(requestBody);

        // const response = await addSalesOrderLinesService(requestBody);
        const response = await updateBankOrderLineService(lineInfo.bank_branch_id, requestBody);

        if (response.status === 200) {
          console.log(response.data);
          navigate(`/dashboard/managebankformpage`);
        } else {
          setShowApprovalButton(false);
        }
      } else {
        console.log(lineInfo);
        const requestBody = {
          bankId: soHeaderDetails.bank_id,
          bankBranchName: lineInfo.bank_branch_name,
          description: lineInfo.description,
          addressLine1: lineInfo.address_line1,
          city: lineInfo.city,
          bankAdminEmail: lineInfo.bank_admin_email,
          lastUpdateDate: date,
          lastUpdatedBy: account.user_id,
          lastUpdateLogin: account.user_id,
          creationDate: date,
          createdBy: account.user_id,
        };
        console.log(requestBody);

        const response = await addbankFormLinesService(requestBody);

        if (response.status === 200) {
          navigate(`/dashboard/manageaccountpage`);
          console.log(response.data);

          //   setShowApprovalButton(true);
          //   handleInputChange(index, 'lineId', response.data.headerInfo[0].line_id);
          //   setShowSaveLine(true);
        } else {
          setShowApprovalButton(false);
        }
      }
    });
  };

  const onClickDelete = async () => {
    const response = await deleteAccountsService(bank_account_id);
    if (response.status === 200) {
      alert('Data Deleted');
      navigate(`/dashboard/manageaccountpage`);
      console.log(response.data);
    } else {
      alert('Process Failed');
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedLines, setSelectedLines] = useState([]);
  const [showSaveLine, setShowSaveLine] = useState(false);

  // Function to handle row selection
  const handleRowSelect = (index, row) => {
    console.log(row);
    console.log(index);
    const updatedSelectedLines = [...selectedLines];
    const lineIndex = updatedSelectedLines.indexOf(row.lineId);
    console.log(lineIndex);

    const updatedSelectedRows = [...selectedRows];
    const rowIndex = updatedSelectedRows.indexOf(index);

    if (rowIndex === -1) {
      updatedSelectedRows.push(index);
    } else {
      updatedSelectedRows.splice(rowIndex, 1);
    }

    if (lineIndex === -1) {
      updatedSelectedLines.push(row.line_id);
    } else {
      updatedSelectedLines.splice(lineIndex, 1);
    }

    setSelectedRows(updatedSelectedRows);
    setSelectedLines(updatedSelectedLines);

    console.log(updatedSelectedLines);
    console.log(updatedSelectedRows);

    console.log(selectedLines);
  };

  const handleDeleteRows = () => {
    const updatedRows = soLineDetails.filter((_, index) => !selectedRows.includes(index));
    setSoLineDetails(updatedRows);
    setSelectedRows([]);
  };

  const handleDeleteLines = () => {
    console.log(selectedLines);
    selectedLines.forEach(async (line) => {
      console.log(line);
      await deleteSalesOrderLinesService(line);
    });
    setSelectedLines([]);
  };

  const [customerRows, setCustomerRows] = useState([
    {
      custAccountId: null,
      accountNumber: '',
      accountName: '',
      ship_to_address: '',
      showList: false,
    },
  ]);

  const [customerList, setCustomerList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCustomerListService(user); // Call your async function here
        if (response.status === 200) setCustomerList(response.data); // Set the account details in the component's state
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []);
  console.log(customerList);

  const [filteredCustomerList, setFilteredCustomerList] = useState([]);

  return (
    <>
      <Helmet>
        <title> COMS | Update Account Form </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Update Account Form
          </Typography>
        </Stack>

        <form className="form-horizontal" style={{ marginTop: '20px' }}>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-highlight">
              <thead>
                <tr>
                  {/* <th>
                    <input
                      type="checkbox"
                      onChange={() => {
                        // Select or deselect all rows
                        const allRowsSelected = selectedRows.length === soLineDetails.length;
                        const newSelectedRows = allRowsSelected ? [] : soLineDetails.map((_, index) => index);
                        // const allRowsSelected = selectedRows.length === rows.length;
                        // const newSelectedRows = allRowsSelected ? [] : rows.map((_, index) => index);
                        setSelectedRows(newSelectedRows);
                      }}
                      checked={selectedRows.length === soLineDetails.length && soLineDetails.length !== 0}
                      //   checked={selectedRows.length === rows.length && rows.length !== 0}
                    />
                  </th> */}
                  {/* <th>Line Number</th> */}
                  <th style={{ width: '220px' }}>Bank Account Name</th>
                  <th style={{ width: '50px', textAlign: 'right' }}>Bank Branch Name</th>
                  <th style={{ textAlign: 'right', width: '220px' }}>Bank Name</th>
                  <th style={{ width: '200px', textAlign: 'right' }}>Account Classification</th>
                </tr>
              </thead>
              <tbody>
                {
                  showLines && (
                    //   soHeaderDetails.map((row, index) => (
                    <tr>
                      {/* <td>
                        <input
                          type="checkbox"
                          onChange={() => handleRowSelect(index, row)}
                          checked={selectedRows.includes(index)}
                        />
                      </td> */}
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bank_account_name"
                          value={soHeaderDetails.bank_account_name}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          onChange={(e) => onValueChange(e)}
                          //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bank_branch_id"
                          value={soLineDetails.bank_branch_name}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          readOnly
                          // onChange={(e) => onValueChange(e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bank_id"
                          value={soLinesDetails.bank_name}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // onChange={(e) => onValueChange(e)}
                          readOnly
                          //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="account_classification"
                          value={soHeaderDetails.account_classification}
                          style={{
                            textAlign: 'center',
                            width: '400px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          onChange={(e) => onValueChange(e)}
                          //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                    </tr>
                  )
                  //   ))
                }
              </tbody>
            </table>
          </div>
        </form>
        <Grid container spacing={2}>
          <Grid item xs={3} style={{ marginTop: '10px' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
              <Button
                style={{ whiteSpace: 'nowrap', marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                onClick={saveHeader}
              >
                Save
              </Button>
              {/* <Button
                style={{ whiteSpace: 'nowrap', marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                onClick={onClickDelete}
              >
                Delete
              </Button> */}
              {/* <Button
                style={{
                  whiteSpace: 'nowrap',
                  display: shipToChangable ? 'block' : 'none',
                  backgroundColor: 'lightgray',
                  marginRight: '10px',
                  color: 'black',
                }}
                // disabled={showApprovalButton === 'none'}
                onClick={submitRequisition}
              >
                Approval
              </Button> */}
              {/* <Button
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: 'lightgray',
                  marginRight: '10px',
                  color: 'black',
                  display: shipToChangable ? 'none' : 'block',
                }}
                onClick={submitRequisition}
              >
                Approve
              </Button> */}
              {/* <Button
                style={{
                  whiteSpace: 'nowrap',
                  // display: showApprovalButton,
                  backgroundColor: 'lightgray',
                  marginRight: '10px',
                  color: 'black',
                  display: shipToChangable ? 'none' : 'block',
                }}
                // disabled={showApprovalButton === 'none'}
                onClick={rejectRequisition}
                disabled={soHeaderDetails.authorization_status === 'Incomplete'}
              >
                Reject
              </Button> */}
              <Button
                style={{ whiteSpace: 'nowrap', backgroundColor: 'lightgray', color: 'black' }}
                onClick={onClickDelete}
              >
                Delete Account
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
