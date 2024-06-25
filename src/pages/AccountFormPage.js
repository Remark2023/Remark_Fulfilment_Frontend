/* eslint-disable no-restricted-globals */
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Button, ButtonGroup, Container, Grid, MenuItem, Stack, Typography } from '@mui/material';
import {
  addaccountsfromService,
  addbankFormLinesService,
  callSoApprovalService,
  createSalesOrderNumberService,
  deleteBankFormLinesService,
  getBankBranchAllService,
  getCustomerListService,
  getInventoryItemIdList,
  getUserProfileDetails,
} from '../Services/ApiServices';

import { useUser } from '../context/UserContext';
// ----------------------------------------------------------------------

export default function AccountFormPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [transporttype, setTransporttype] = useState('');
  const handleChange = (event) => {
    setTransporttype(event.target.value);
  };

  function getCurrentDate() {
    const now = new Date();
    // const year = now.getFullYear();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    // return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
  }
  function getFormattedPrice(value) {
    const formattedPrice = new Intl.NumberFormat().format(value);
    console.log(parseInt(formattedPrice, 10));

    return formattedPrice;
  }

  function getFormattedDate(value) {
    const date = new Date(value);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  // const [showSaveLine, setShowSaveLine] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedLines, setSelectedLines] = useState([]);

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

  const [salesOrderNumber, setSalesOrderNumber] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await createSalesOrderNumberService(); // Call your async function here
        if (response.status === 200) setSalesOrderNumber(response.data.fn_create_so_number); // Set the account details in the component's state
      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error fetching account details:', error);
      }
    }

    fetchData(); // Call the async function when the component mounts
  }, []);
  console.log(salesOrderNumber);

  const [inventoryItemIds, setInventoryItemIds] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getInventoryItemIdList();
        if (response) setInventoryItemIds(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log(inventoryItemIds);

  const [inventoryItemPrice, setInventoryItemPrice] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getInventoryItemIdList();
        if (response) setInventoryItemIds(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log(inventoryItemIds);

  const [filteredItemList, setFilteredItemList] = useState([]);

  const [bankBranchIds, setBankBranchIds] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankBranchAllService();
        if (response) setBankBranchIds(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log(bankBranchIds);

  const [headerInfo, setHeaderInfo] = useState({});

  const onChangeHeader = (e) => {
    setHeaderInfo({ ...headerInfo, [e.target.name]: e.target.value });
  };
  const [showLines, setShowLines] = useState(true);
  const [headerDetails, setHeaderDetails] = useState({
    bankId: null,
    // orderNumber: null,
    // authorizationStatus: '',
  });

  const saveLines = async (value) => {
    console.log(value);
    const filteredArray = rows.filter((item) => Object.values(item).some((value) => value !== ''));
    console.log(filteredArray);

    filteredArray.forEach(
      async (lineInfo, index) => {
    
        const requestBody = {
          bankId: parseInt(headerDetails.bankId, 10),
          bankBranchName: lineInfo.bankBranchName,
          description: lineInfo.description,
          addressLine1: lineInfo.addressLine1,
          city: lineInfo.city,
          bankAdminEmail: lineInfo.bankAdminEmail,
          lastUpdateDate: date,
          lastUpdatedBy: account.user_id,
          lastUpdateLogin: account.user_id,
          creationDate: date,
          createdBy: account.user_id,
       
        };
        console.log(requestBody);

        const response = await addbankFormLinesService(requestBody);

        if (response.status === 200) {
          setShowApprovalButton(false);
          handleInputChange(index, 'lineId', response.data.headerInfo[0].line_id);
          // setShowSaveLine(true);
        } else {
          setShowApprovalButton(true);
        }
      }
      // }
    );
  };
  const date = new Date();
  let responseValue;
  const saveHeader = async () => {
    console.log(rows);
    rows.forEach(async (lineInfo, index) => {
      const requestBody = {
        bankAccountName: lineInfo.bankAccountName,
        bankAccountNum: lineInfo.bankAccountNum,
        bankBranchId: lineInfo.bankBranchId,
        bankId: parseInt(lineInfo.bankId, 10),
        accountClassification: lineInfo.accountClassification,
        lastUpdateDate: date,
        lastUpdatedBy: account.user_id,
        lastUpdateLogin: account.user_id,
        creationDate: date,
        createdBy: account.user_id,
      };
      console.log('accounts', requestBody);

      const response = await addaccountsfromService(requestBody, user);
      if (response.status === 200) {
        alert('Data Saved!');
        navigate(`/dashboard/manageaccountpage`);
      } else {
        alert('Process failed! Try again');
      }
    });
  };

  const [rows, setRows] = useState([
    {
      bankAccountName: '',
      bankAccountNum: '',
      bankBranchId: '',
      bankId: '',
      accountClassification: '',
      selectedItemName: '',
      selectedItem: {},
      showList: false,
    },
  ]);

  const handleAddRow = () => {
    if (rows.length === 1) setShowLines(true);
    if (showLines) {
      setRows([
        ...rows,
        {
          bankAccountName: '',
          bankAccountNum: '',
          bankBranchId: '',
          bankId: '',
          accountClassification: '',
          selectedItemName: '',
          selectedItem: {},
          showList: false,
        },
      ]);
    }
    console.log(rows);
  };

  const handleInputChange = (index, name, value) => {
    // setShowSaveLine(false);
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const [showApprovalButton, setShowApprovalButton] = useState(true);

  const submitRequisition = async () => {
    if (confirm('Are you sure for this requisition?')) {
      const requestBody = {
        pHierarchyId: 1,
        pTransactionId: headerDetails.headerId,
        pTransactionNum: headerDetails.orderNumber.toString(),
        pAppsUsername: account.user_name,
        pNotificationId: 1,
        pApprovalType: 'A',
        pEmpid: 1,
        pNote: 'A',
        pAuthorizationStatus: headerDetails.authorizationStatus,
      };
      const response = await callSoApprovalService(requestBody);

      if (response.status === 200) {
        setShowApprovalButton(true);
        navigate('/dashboard/manageSalesOrderForm', { replace: true });
        // window.location.reload();
      } else {
        // alert('Process failed! Please try later');
        alert('Process failed! Please try later');
      }
    }
  };

  // Function to handle row selection
  const handleRowSelect = (index, row) => {
    console.log(row);
    const updatedSelectedLines = [...selectedLines];
    const lineIndex = updatedSelectedLines.indexOf(row.lineId);

    const updatedSelectedRows = [...selectedRows];
    const rowIndex = updatedSelectedRows.indexOf(index);

    if (rowIndex === -1) {
      updatedSelectedRows.push(index);
    } else {
      updatedSelectedRows.splice(rowIndex, 1);
    }

    if (lineIndex === -1) {
      updatedSelectedLines.push(row.lineId);
    } else {
      updatedSelectedLines.splice(lineIndex, 1);
    }

    setSelectedRows(updatedSelectedRows);
    setSelectedLines(updatedSelectedLines);

    console.log(selectedLines);
  };

  const handleDeleteRows = () => {
    const updatedRows = rows.filter((_, index) => !selectedRows.includes(index));
    setRows(updatedRows);
    setSelectedRows([]);
  };

  // const onChecked = (event) => {
  //   setHeaderInfo({ ...headerInfo, [event.target.name]: event.target.checked });
  // };

  const handleDeleteLines = () => {
    console.log(selectedLines);
    selectedLines.forEach(async (line) => {
      console.log(line);
      await deleteBankFormLinesService(line);
    });
    setSelectedLines([]);
  };

  const onClickDelete = async () => {
    // const isEmptyObject =
    //   Object.values(rows[0]).every((value) => value === null || value === '') &&
    //   !Object.values(headerDetails).every((value) => value === null);

    // console.log(isEmptyObject);
    console.log(selectedRows);

    if (
      selectedLines.length === 0 &&
      rows.length > 0 &&
      !Object.values(rows[0]).every((value) => value === null || value === '' || value === false)
    ) {
      alert('Please select lines to delete');
    } else if (selectedLines.length === 0 && rows.length === 0) {
      if (confirm('Are you sure to delete the requisition?')) {
        await deleteBankFormLinesService(headerDetails.bankId);
        window.location.reload();
      }
    } else if (selectedLines.length > 0 && rows.length > 0) {
      if (confirm('Are you sure to delete the lines?')) {
        handleDeleteLines();
        handleDeleteRows();
      }
    }
  };

  // const [isReadOnly, setIsReadOnly] = useState(false);

  const handleInputItemChange = (index, event) => {
    const input = event.target.value;
    const name = 'selectedItemName';
    const show = 'showList';

    const updatedRows = [...rows];
    updatedRows[index][name] = input;
    updatedRows[index][show] = true;
    setRows(updatedRows);
    console.log(rows);

    // Filter the original list based on the input
    console.log(bankBranchIds);
    const filtered = bankBranchIds.filter((item) => item.bank_branch_name.toLowerCase().includes(input.toLowerCase()));
    setFilteredItemList(filtered);
  };

  const [filteredCustomerList, setFilteredCustomerList] = useState([]);

  // const [customerRows, setCustomerRows] = useState([
  //   {
  //     custAccountId: null,
  //     accountNumber: '',
  //     accountName: selectedCustomer,

  //     showList: false,
  //   },
  // ]);
  // console.log('account', customerRows);

  // const [customerRows, setCustomerRows] = useState(customer);
  // setCustomerRows(customer);
  console.log('customer', customerRows);

  const handleInputCustomerChange = (event) => {
    const input = event.target.value;
    console.log(input);

    const username = 'accountName';
    const show = 'showList';

    const updatedRows = [...customerRows];
    updatedRows[username] = input;
    updatedRows[show] = true;

    setCustomerRows(updatedRows);
    console.log(customerRows);

    const filtered = customerList.filter((item) => item.full_name.toLowerCase().includes(input.toLowerCase()));
    setFilteredCustomerList(filtered);
    console.log(filteredCustomerList);
  };

  const handleCustomerClick = (item) => {
    console.log(item);
    const name = 'accountName';
    const selected = 'custAccountId';
    const address = 'ship_to_address';
    const show = 'showList';

    const updatedRows = [...customerRows];
    updatedRows[name] = item.full_name;
    // setSelectedCustomer(item.full_name);
    updatedRows[selected] = item.cust_account_id;
    updatedRows[address] = item.ship_to_address;
    updatedRows[show] = false;

    setCustomerRows(updatedRows);
    const headerShipTo = 'shipTo';
    setHeaderInfo({ ...headerInfo, [headerShipTo]: item.ship_to_address });

    console.log(customerRows);
  };

  const handleMenuItemClick = (index, item) => {
    console.log(item);
    const name = 'selectedItemName';
    const selected = 'selectedItem';
    const branchId = 'bankBranchId';
    const bankId = 'bankId';
    const show = 'showList';

    const updatedRows = [...rows];
    updatedRows[index][name] = item.bank_branch_name;
    updatedRows[index][selected] = item;
    updatedRows[index][branchId] = item.bank_branch_id;
    updatedRows[index][bankId] = item.bank_id;
    updatedRows[index][show] = false;
    setRows(updatedRows);
    console.log(rows);
    inputRef.current.focus();
  };

  console.log(showApprovalButton);
  // const value =

  return (
    <>
      <Helmet>
        <title> COMS | Account Form </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Create Account Form
          </Typography>
        </Stack>

        <form className="form-horizontal" style={{ marginTop: '20px' }}>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-highlight">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={() => {
                        // Select or deselect all rows
                        const allRowsSelected = selectedRows.length === rows.length;
                        const newSelectedRows = allRowsSelected ? [] : rows.map((_, index) => index);
                        setSelectedRows(newSelectedRows);
                      }}
                      checked={selectedRows.length === rows.length && rows.length !== 0}
                    />
                  </th>
                  {/* <th>Line Number</th> */}
                  <th style={{ width: '420px' }}>
                    Account Name <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th style={{ width: '150px', textAlign: 'right' }}>
                    Bank Account Number <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th style={{ width: '50px', textAlign: 'right' }}>Bank Branch ID</th>
                  <th style={{ textAlign: 'right' }}>Account Classification</th>
                  {/* <th style={{ textAlign: 'right' }}>City</th>
                  <th style={{ textAlign: 'right' }}>Bank Admin Email</th> */}
                  {/* <th>Sold From Org ID</th> */}
                  {/* <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Unit Offer Price</th>
                  <th style={{ textAlign: 'right' }}>Total Price</th> */}
                </tr>
              </thead>
              <tbody>
                {showLines &&
                  rows.map((row, index) => (
                    <tr key={index}>
                      <td style={{ height: '50%' }}>
                        <input
                          type="checkbox"
                          onChange={() => handleRowSelect(index, row)}
                          checked={selectedRows.includes(index)}
                        />
                      </td>
                      {/* <td>
                        <input type="number" className="form-control" name="lineNumber" value={index + 1} readOnly />
                      </td> */}
                      <td style={{ textAlign: 'center', height: '50%' }}>
                        <input
                          type="text"
                          className="form-control"
                          name="bankAccountName"
                          style={{
                            height: '50%',
                            textAlign: 'inherit',
                            width: '200px',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          //   value={row.selectedItem.primary_uom_code}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: 'center', height: '50%' }}>
                        <input
                          type="text"
                          className="form-control"
                          name="bankAccountNum"
                          style={{
                            height: '50%',
                            textAlign: 'inherit',
                            width: '300px',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          //   value={row.selectedItem.primary_uom_code}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: 'left', height: '50%' }}>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            textAlign: 'inherit',
                            width: '320px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          value={row.selectedItemName}
                          onChange={(e) => handleInputItemChange(index, e)}
                        />
                        {row.showList && (
                          <ul style={{ marginTop: '0px' }}>
                            {filteredItemList.map((item, itemIndex) => (
                              <>
                                <MenuItem key={itemIndex} value={item} onClick={() => handleMenuItemClick(index, item)}>
                                  {item.bank_branch_name}
                                </MenuItem>
                              </>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', height: '50%' }}>
                        <input
                          type="text"
                          className="form-control"
                          name="accountClassification"
                          style={{
                            height: '50%',
                            textAlign: 'inherit',
                            width: '250px',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          //   value={row.selectedItem.primary_uom_code}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
              <Button
                style={{ whiteSpace: 'nowrap', marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                onClick={saveHeader}
              >
                Save
              </Button>
              <Button
                style={{ whiteSpace: 'nowrap', marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                onClick={onClickDelete}
              >
                Delete
              </Button>
              <Button
                style={{ whiteSpace: 'nowrap', backgroundColor: 'lightgray', color: 'black' }}
                onClick={handleAddRow}
              >
                Add Lines
              </Button>
              <Button
                style={{
                  whiteSpace: 'nowrap',
                  // display: showApprovalButton,
                  marginLeft: '10px',
                  backgroundColor: 'lightgray',
                  color: 'black',
                }}
                // disabled={showApprovalButton}
                onClick={submitRequisition}
              >
                Approve
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        {/* {showLines && (
          <Grid item xs={3}>
            <Button
              style={{ marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
              onClick={saveLines}
              disabled={showSaveLine}
            >
              Save
            </Button>
            {showApprovalButton && (
              <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
                <Button
                  style={{ display: { showApprovalButton }, backgroundColor: 'lightgray', color: 'black' }}
                  onClick={submitRequisition}
                >
                  Approval
                </Button>
              </ButtonGroup>
            )}
          </Grid>
        )} */}
      </Container>
    </>
  );
}
