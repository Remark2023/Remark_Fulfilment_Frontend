
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
  deleteBankBranchService,
  deleteSalesOrderLinesService,
  getApprovalSequenceService,
  getBankHeaderService,
  getBankLinesService,
  getCustomerListService,
  getInventoryItemIdList,
  getUserProfileDetails,
  updateBankOrderLineService,
} from '../Services/ApiServices';

// import { UserListHead } from '../sections/@dashboard/user';
import { useUser } from '../context/UserContext';
// ----------------------------------------------------------------------

export default function UpdateBankFormPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { bank_id } = useParams();
  console.log('bankId', bank_id);

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getFormattedDate(value) {
    const date = new Date(value);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  function getFormattedPrice(value) {
    const formattedPrice = new Intl.NumberFormat().format(value);
    console.log(parseInt(formattedPrice, 10));

    return formattedPrice;
  }

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

  const [soHeaderDetails, setSoHeaderDetails] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankHeaderService(parseInt(bank_id, 10));
        console.log(response);
        if (response) setSoHeaderDetails(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log('soHeaderDetails', soHeaderDetails);

  const [soLineDetails, setSoLineDetails] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBankLinesService(bank_id);
        console.log(response);
        // const updatedData = response.data.map((line) => ({
        //   ...line,
        //   selectedItemName: line.ordered_item,
        //   selectedItem: {},
        //   showList: false,
        // }));
        // console.log(updatedData);
        // if (response) setSoLineDetails(response.data);
        if (response) setSoLineDetails(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log('soLineDetails', soLineDetails);

  const [approvalSequenceDetails, setApprovalSequence] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getApprovalSequenceService(parseInt(bank_id, 10)); // Call your async function here
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
  const onChangeHeader = (e) => {
    setSoHeaderDetails({ ...soHeaderDetails, [e.target.name]: e.target.value });
  };
  const [showLines, setShowLines] = useState(true);
  const [headerDetails, setHeaderDetails] = useState({
    headerId: null,
    orderNumber: null,
  });

  //   let sumTotalPrice = 0;
  //   soLineDetails.forEach((element) => {
  //     sumTotalPrice +=
  //       (element.selectedItem.unit_price ? element.selectedItem.unit_price : element.unit_selling_price) *
  //       element.ordered_quantity;
  //   });
  //   // row.selectedItem.unit_price ? row.selectedItem.unit_price : row.unit_selling_price
  //   console.log(sumTotalPrice);

  // const saveHeader = async () => {
  //   const shipToValue = soHeaderDetails.ship_to ? soHeaderDetails.ship_to : '';
  //   const requestBody = {
  //     lastUpdatedBy: account.user_id,
  //     shippingMethodCode: soHeaderDetails.shipping_method_code ? soHeaderDetails.shipping_method_code : '',
  //     description: soHeaderDetails.description ? soHeaderDetails.description : '',
  //     // shipTo: soHeaderDetails.ship_to ? soHeaderDetails.ship_to : '',
  //     shipTo: customerRows.ship_to_address ? customerRows.ship_to_address : shipToValue,
  //     specialDiscount: parseInt(soHeaderDetails.special_discount, 10),
  //     specialAdjustment: parseInt(soHeaderDetails.special_adjustment, 10),
  //     // totalPrice: soHeaderDetails.total_price,
  //     // totalPrice: sumTotalPrice,
  //     distributor: customerRows.accountName ? customerRows.accountName : account.full_name,
  //     soldToOrgId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     shipToOrgId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     invoiceToOrgId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     deliverToOrgId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     soldToContactId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     shipToContactId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     invoiceToContactId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //     deliverToContactId: customerRows.custAccountId ? customerRows.custAccountId : account.ship_to_org_id,
  //   };
  //   console.log(requestBody);

  //   const response = await updateSalesOrderHeaderService(soHeaderDetails.header_id, requestBody);
  //   if (response.status === 200) {
  //     console.log(response.data);
  //     saveLines();
  //   } else {
  //     alert('Process failed! Try again');
  //   }
  // };

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

  //   const handleInputChange = (index, name, value) => {
  //     setShowSaveLine(false);
  //     const updatedRows = [...rows];
  //     updatedRows[index][name] = value;
  //     setRows(updatedRows);
  //   };

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
    console.log(soLineDetails);
    // const filteredArray = rows.filter((item) => Object.values(item).some((value) => value !== ''));
    const filteredArray = soLineDetails.filter((item) => Object.values(item).some((value) => value !== ''));
    console.log(filteredArray);

    filteredArray.forEach(async (lineInfo, index) => {
      console.log(lineInfo);

      if (lineInfo.bank_branch_id) {
        console.log(lineInfo.bank_branch_id);
        const requestBody = {
          bankId: lineInfo.bank_id,
          bankBranchId: lineInfo.bank_branch_id,
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
        console.log(soLineDetails.bank_branch_id);
        // const response = await addSalesOrderLinesService(requestBody);
        const response = await updateBankOrderLineService(lineInfo.bank_branch_id, requestBody);

        if (response.status === 200) {
          console.log(response.data);
          navigate(`/dashboard/managebankformpage`);
          // setShowApprovalButton(true);
          // handleInputChange(index, 'lineId', response.data.headerInfo[0].line_id);
          // setShowSaveLine(true);
        } else {
          setShowApprovalButton(false);
        }
      } else {
        console.log(lineInfo);
        const requestBody = {
          //   headerId: soHeaderDetails.header_id,
          //   lineNumber: index + 1,
          //   inventoryItemId: lineInfo.selectedItem.inventory_item_id,
          //   // inventoryItemId: lineInfo.selectedItem.inventory_item_id
          //   //   ? lineInfo.selectedItem.inventory_item_id
          //   //   : lineInfo.inventory_item_id,
          //   // creationDate: getCurrentDate(),
          //   createdBy: account.user_id,
          //   orderedItem: lineInfo.selectedItem.description,
          //   // orderedItem: lineInfo.selectedItem.description ? lineInfo.selectedItem.description : lineInfo.description,
          //   orderQuantityUom: lineInfo.selectedItem.primary_uom_code,
          //   orderedQuantity: lineInfo.ordered_quantity,
          //   soldFromOrgId: lineInfo.sold_from_org_id,
          //   // unitSellingPrice: lineInfo.unit_selling_price,
          //   // totalPrice: lineInfo.unit_selling_price * lineInfo.ordered_quantity,
          //   unitSellingPrice: lineInfo.selectedItem.unit_price
          //     ? lineInfo.selectedItem.unit_price
          //     : lineInfo.unit_selling_price,
          //   totalPrice:
          //     (lineInfo.selectedItem.unit_price ? lineInfo.selectedItem.unit_price : lineInfo.unit_selling_price) *
          //     lineInfo.ordered_quantity,
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
          navigate(`/dashboard/managebankformpage`);
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

  //   const handleDeleteRows = () => {
  //     const updatedRows = rows.filter((_, index) => !selectedRows.includes(index));
  //     setRows(updatedRows);
  //     setSelectedRows([]);
  //   };

  //   const onChecked = (event) => {
  //     setHeaderInfo({ ...headerInfo, [event.target.name]: event.target.checked });
  //   };

  const handleDeleteLines = () => {
    console.log(selectedLines);
    selectedLines.forEach(async (line) => {
      console.log(line);
      await deleteSalesOrderLinesService(line);
    });
    setSelectedLines([]);
  };

  const onClickDelete = async () => {
    console.log(soLineDetails);
    // const isEmptyObject =
    //   Object.values(soLineDetails[0]).every((value) => value === null || value === '') &&
    //   !Object.values(headerDetails).every((value) => value === null);
    // console.log(isEmptyObject);

    if (
      selectedLines.length === 0 &&
      soLineDetails.length > 0 &&
      !Object.values(soLineDetails[0]).every((value) => value === null || value === '')
    ) {
      alert('Please select lines to delete');
    } else if (selectedLines.length === 0 && soLineDetails.length === 0) {
      if (confirm('Are you sure to delete the requisition?')) {
        console.log(soLineDetails.bank_branch_id);
        await deleteBankBranchService(parseInt(soLineDetails.bank_branch_id, 10));
        window.location.reload();
      }
    } else if (selectedLines.length > 0 && soLineDetails.length > 0) {
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

    const updatedRows = [...soLineDetails];
    updatedRows[index][name] = input;
    updatedRows[index][show] = true;
    setSoLineDetails(updatedRows);
    console.log(soLineDetails);

    // Filter the original list based on the input
    console.log(inventoryItemIds);
    const filtered = inventoryItemIds.filter((item) => item.description.toLowerCase().includes(input.toLowerCase()));
    setFilteredItemList(filtered);
  };

  //   const handleInputItemChange = (index, event) => {
  //     const input = event.target.value;
  //     const name = 'selectedItemName';
  //     const show = 'showList';

  //     const updatedRows = [...rows];
  //     updatedRows[index][name] = input;
  //     updatedRows[index][show] = true;
  //     setRows(updatedRows);
  //     console.log(rows);

  //     // Filter the original list based on the input
  //     console.log(inventoryItemIds);
  //     const filtered = inventoryItemIds.filter((item) => item.description.toLowerCase().includes(input.toLowerCase()));
  //     setFilteredItemList(filtered);
  //   };

  const handleMenuItemClick = (index, item) => {
    const name = 'selectedItemName';
    const selected = 'selectedItem';
    const show = 'showList';

    const updatedRows = [...soLineDetails];
    updatedRows[index][name] = item.description;
    updatedRows[index][selected] = item;
    updatedRows[index][show] = false;
    setSoLineDetails(updatedRows);
    console.log(soLineDetails);
    inputRef.current.focus();
  };

  //   const handleMenuItemClick = (index, item) => {
  //     const name = 'selectedItemName';
  //     const selected = 'selectedItem';
  //     const show = 'showList';

  //     const updatedRows = [...rows];
  //     updatedRows[index][name] = item.description;
  //     updatedRows[index][selected] = item;
  //     updatedRows[index][show] = false;
  //     setRows(updatedRows);
  //     console.log(rows);
  //   };

  const TABLE_HEAD_Approval_Seq = [
    // { id: '' },
    { id: 'unit_of_measure', label: 'SL Num', alignRight: false },
    { id: 'uom_code', label: 'Action Code', alignRight: false },
    { id: 'uom_class', label: 'Action Date', alignRight: false },
    { id: 'disable_date', label: 'Name', alignRight: false },
    { id: 'description', label: 'Note', alignRight: false },
  ];

  const shipToChangable = soHeaderDetails.authorization_status === null;

  // const onApprove = async () => {
  //   const requestBody = {
  //     pHierarchyId: 1,
  //     pTransactionID: headerDetails.header_id,
  //     pTransactionNum: headerDetails.order_number.toString(),
  //     pAppsUsername: account.full_name,
  //     pNotificationID: wfNotifications.notification_id,
  //     pApprovalType: 'A',
  //     pEmpid: 1,
  //     pNote: 'A',
  //   };
  //   const response = await callReqApprovalFromPanelService(requestBody);

  //   console.log(response);
  // };

  // const onReject = async () => {
  //   const requestBody = {
  //     pHierarchyId: 1,
  //     pTransactionID: headerDetails.header_id,
  //     pTransactionNum: headerDetails.order_number.toString(),
  //     pAppsUsername: account.full_name,
  //     pNotificationID: wfNotifications.notification_id,
  //     pApprovalType: 'R',
  //     pEmpid: 1,
  //     pNote: 'R',
  //   };
  //   const response = await callReqApprovalFromPanelService(requestBody);

  //   console.log(response);
  // };

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
        <title> COMS | Update Bank Form </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Update Bank Form
          </Typography>
        </Stack>
        <div className="row g-3 align-items-center">
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
            <div className="col-auto" style={{ width: '360px', marginRight: '15px' }}>
              <label htmlFor="orderNumber" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
                Bank Name
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  className="form-control"
                  style={{ marginLeft: '7px' }}
                  // value={headerDetails.orderNumber}
                  value={soHeaderDetails.bank_name}
                  readOnly
                />
              </label>
            </div>
            <div className="col-auto" style={{ width: '460px', marginRight: '15px' }}>
              <label htmlFor="orderedDate" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
                Description
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  style={{ marginLeft: '7px' }}
                  value={soHeaderDetails.description}
                  readOnly
                />
              </label>
            </div>
          </Stack>
          {/* <Stack direction="row" alignItems="center" justifyContent="flex-start">
            <div className="col-auto" style={{ width: '430px' }}>
              <label htmlFor="ship_to" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
                Address Line 1
                <input
                  type="text"
                  id="address_line1"
                  name="address_line1"
                  className="form-control"
                  style={{ marginLeft: '5px' }}
                  // value={soHeaderDetails.ship_to ship_to_address}
                  value={soHeaderDetails.address_line1}
                  readOnly
                />
              </label>
            </div>
            <div className="col-auto" style={{ width: '430px' }}>
              <label
                htmlFor="ship_to"
                className="col-form-label"
                style={{ display: 'flex', fontSize: '13px', marginLeft: '10px' }}
              >
                City
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-control"
                  style={{ marginLeft: '5px' }}
                  // value={soHeaderDetails.ship_to ship_to_address}
                  value={soHeaderDetails.city}
                  readOnly
                />
              </label>
            </div>
          </Stack> */}
        </div>
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
                        const allRowsSelected = selectedRows.length === soLineDetails.length;
                        const newSelectedRows = allRowsSelected ? [] : soLineDetails.map((_, index) => index);
                        // const allRowsSelected = selectedRows.length === rows.length;
                        // const newSelectedRows = allRowsSelected ? [] : rows.map((_, index) => index);
                        setSelectedRows(newSelectedRows);
                      }}
                      checked={selectedRows.length === soLineDetails.length && soLineDetails.length !== 0}
                      //   checked={selectedRows.length === rows.length && rows.length !== 0}
                    />
                  </th>
                  {/* <th>Line Number</th> */}
                  <th style={{ width: '220px' }}>
                    Bank Branch Name <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th style={{ width: '50px', textAlign: 'right' }}>Description</th>
                  <th style={{ textAlign: 'right', width: '220px' }}>Address Line 1</th>
                  <th style={{ textAlign: 'right' }}>City</th>
                  <th style={{ textAlign: 'right' }}>Bank Admin Email</th>
                </tr>
              </thead>
              <tbody>
                {showLines &&
                  soLineDetails.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleRowSelect(index, row)}
                          checked={selectedRows.includes(index)}
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bank_branch_name"
                          value={row.bank_branch_name}
                          // style={{ width: '80px', textAlign: 'center' }}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // defaultValue={row.order_quantity_uom}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={row.description}
                          // style={{ width: '80px', textAlign: 'center' }}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // defaultValue={row.order_quantity_uom}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="address_line1"
                          value={row.address_line1}
                          // style={{ width: '80px', textAlign: 'center' }}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // defaultValue={row.order_quantity_uom}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={row.city}
                          // style={{ width: '80px', textAlign: 'center' }}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // defaultValue={row.order_quantity_uom}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bank_admin_email"
                          value={row.bank_admin_email}
                          // style={{ width: '80px', textAlign: 'center' }}
                          style={{
                            textAlign: 'center',
                            width: '200px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // defaultValue={row.order_quantity_uom}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>

                      {/* <td>
                        <input
                          type="number"
                          className="form-control"
                          name="ordered_quantity"
                          defaultValue={row.ordered_quantity}
                          // style={{ textAlign: 'right' }}
                          style={{
                            textAlign: 'right',
                            width: '78px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                          ref={inputRef}
                        />
                      </td> */}
                      {/* <td>
                        <input
                          type="number"
                          className="form-control"
                          name="soldFromOrgId"
                          defaultValue={row.sold_from_org_id}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td> */}
                      {/* <td>
                        <input
                          type="number"
                          className="form-control"
                          name="offer_quantity"
                          style={{
                            textAlign: 'right',
                            width: '100%',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          defaultValue={row.offer_quantity ? row.ordered_quantity : 0}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td> */}
                      {/* <td>
                        <input
                          type="number"
                          className="form-control"
                          name="totalQuantity"
                          style={{
                            textAlign: 'right',
                            width: '100%',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          // value={row.selectedItem.unit_price ? row.selectedItem.unit_price : row.unit_selling_price}
                          value={
                            parseInt(row.offer_quantity ? row.offer_quantity : 0, 10) +
                            parseInt(row.ordered_quantity ? row.ordered_quantity : 0, 10)
                          }
                          // value={parseInt(row.offer_quantity, 10) + parseInt(row.ordered_quantity, 10)}
                          readOnly
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td> */}
                      {/* <td>
                        <input
                          type="number"
                          className="form-control"
                          name="unit_selling_price"
                          value={row.selectedItem.unit_price ? row.selectedItem.unit_price : row.unit_selling_price}
                          // style={{ textAlign: 'right' }}
                          style={{
                            textAlign: 'right',
                            width: '90px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          readOnly
                          //   onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td> */}
                      {/* <td style={{ textAlign: 'right', height: '50%' }}>
                        <input
                          type="text"
                          className="form-control"
                          name="unitOfferPrice"
                          style={{
                            textAlign: 'right',
                            width: '100px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          value={
                            // getFormattedPrice(
                            //   (row.ordered_quantity *
                            //     (row.selectedItem.unit_price ? row.selectedItem.unit_price : row.unit_selling_price)) /
                            //     (parseInt(row.offer_quantity ? row.offer_quantity : 0, 10) +
                            //       parseInt(row.ordered_quantity ? row.ordered_quantity : 0, 10))
                            // )
                            row.ordered_quantity
                              ? getFormattedPrice(
                                  (row.ordered_quantity *
                                    (row.selectedItem.unit_price
                                      ? row.selectedItem.unit_price
                                      : row.unit_selling_price)) /
                                    (parseInt(row.offer_quantity ? row.offer_quantity : 0, 10) +
                                      parseInt(row.ordered_quantity, 10))
                                )
                              : row.selectedItem.unit_price
                              ? row.selectedItem.unit_price
                              : 0
                          }
                          readOnly
                        />
                      </td> */}
                      {/* <td>
                        <input
                          type="text"
                          className="form-control"
                          name="unitSellingPrice"
                          // style={{ textAlign: 'right' }}
                          style={{
                            textAlign: 'right',
                            width: '100px',
                            height: '50%',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                          }}
                          value={getFormattedPrice(
                            row.ordered_quantity *
                              (row.selectedItem.unit_price ? row.selectedItem.unit_price : row.unit_selling_price)
                          )}
                          readOnly
                        />
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
        <Grid container spacing={2}>
          <Grid item xs={3} style={{ marginTop: '10px' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
              <Button
                style={{ whiteSpace: 'nowrap', marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                onClick={saveLines}
              >
                Save
              </Button>
              <Button
                style={{ whiteSpace: 'nowrap', marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                onClick={onClickDelete}
              >
                Delete
              </Button>
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
                onClick={handleAddRow}
              >
                Add Lines
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}