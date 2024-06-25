/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Button, ButtonGroup, Container, Grid, Stack, Typography } from '@mui/material';
import {
    addTxnRequestHeader,
    addTxnRequestLines,
    deleteTxnRequestHeader,
    deleteTxnRequestLines,
    getInventoryItemIdList,
    getOrganizationIdList,
    getTransactionTypeList,
    getUomCodeList,
    getUserProfileDetails,
} from '../Services/ApiServices';

import { useUser } from '../context/UserContext';
// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const [transactionTypeIds, setTransactionTypeIds] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getTransactionTypeList();
        if (response) setTransactionTypeIds(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const [organizationIds, setOrganizationIds] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getOrganizationIdList();
        if (response) setOrganizationIds(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const [uomCodes, setUomCodes] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUomCodeList();
        if (response) setUomCodes(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

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

  const [headerInfo, setHeaderInfo] = useState({});
  const onChangeHeader = (e) => {
    setHeaderInfo({ ...headerInfo, [e.target.name]: e.target.value });
  };
  const [showLines, setShowLines] = useState(false);
  // const [showHeaderDetails, setShowHeaderDetails] = useState(false);
  const [headerDetails, setHeaderDetails] = useState({});

  const saveHeader = async () => {
    const requestBody = { ...headerInfo, createdBy: account.user_id };
    console.log(requestBody);

    const response = await addTxnRequestHeader(requestBody);
    if (response.status === 200) {
      // setShowHeaderDetails(true);
      setIsReadOnly(true);
      setHeaderDetails({
        headerId: response.data.headerInfo[0].header_id,
        organizationId: response.data.headerInfo[0].organization_id,
        requestNumber: response.data.headerInfo[0].request_number,
        status: response.data.headerInfo[0].header_status,
        createdBy: response.data.headerInfo[0].created_by,
      });
    } else {
      alert('Process failed! Try again');
    }
  };

  const [rows, setRows] = useState([
    {
      inventoryItemId: null,
      fromSubinventoryCode: '',
      uomCode: 'PCs',
      requiredQuantity: null,
      dateRequired: getCurrentDate(),
      lineId: null,
    },
  ]);

  const handleAddRow = () => {
    if (rows.length === 1) setShowLines(true);
    if (showLines) {
      setRows([
        ...rows,
        {
          inventoryItemId: null,
          fromSubinventoryCode: '',
          uomCode: 'PCs',
          requiredQuantity: null,
          dateRequired: getCurrentDate(),
          lineId: null,
        },
      ]);
    }
    console.log(rows);
  };

  const handleInputChange = (index, name, value) => {
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const [showApprovalButton, setShowApprovalButton] = useState(false);

  const submitRequisition = () => {
    if (confirm('Are you sure for this requisition?')) {
      // window.location.reload();
      navigate('/dashboard/allRequisitions', { replace: true });
    }
  };

  const saveLines = async () => {
    const filteredArray = rows.filter((item) => Object.values(item).some((value) => value !== ''));

    filteredArray.forEach(async (lineInfo, index) => {
      const requestBody = {
        headerId: headerDetails.headerId,
        lineId: lineInfo.lineId,
        organizationId: headerDetails.organizationId,
        lineNumber: index + 1,
        inventoryItemId: lineInfo.inventoryItemId,
        uomCode: lineInfo.uomCode,
        dateRequired: lineInfo.dateRequired,
        requiredQuantity: lineInfo.requiredQuantity,
      };

      const response = await addTxnRequestLines(requestBody);

      if (response.status === 200) {
        console.log(response.data.lineInfo.line_id);

        setShowApprovalButton(true);
        handleInputChange(index, 'lineId', response.data.lineInfo.line_id);
      } else {
        setShowApprovalButton(false);
      }
    });
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedLines, setSelectedLines] = useState([]);

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
  };

  const handleDeleteRows = () => {
    const updatedRows = rows.filter((_, index) => !selectedRows.includes(index));
    setRows(updatedRows);
    setSelectedRows([]);
  };

  const handleDeleteLines = () => {
    selectedLines.forEach(async (line) => {
      console.log(line);
      await deleteTxnRequestLines(line);
    });
    setSelectedLines([]);
  };

  const onClickDelete = async () => {
    const isEmptyObject =
      Object.values(rows[0]).every((value) => value === null || value === '') &&
      !Object.values(headerDetails).every((value) => value === null || value === '');

    if (
      selectedLines.length === 0 &&
      rows.length > 0 &&
      !Object.values(rows[0]).every((value) => value === null || value === '')
    ) {
      alert('Please select lines to delete');
    } else if ((selectedLines.length === 0 && rows.length === 0) || isEmptyObject) {
      if (confirm('Are you sure to delete the requisition?')) {
        await deleteTxnRequestHeader(headerDetails.headerId);
        window.location.reload();
      }
    } else if (selectedLines.length > 0 && rows.length > 0) {
      if (confirm('Are you sure to delete the lines?')) {
        handleDeleteLines();
        handleDeleteRows();
      }
    }
  };

  // const isReadOnly = true;
  const [isReadOnly, setIsReadOnly] = useState(false);

  return (
    <>
      <Helmet>
        <title> COMS | Requisition </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Requisition Form
          </Typography>
        </Stack>
        <div className="row g-3 align-items-center">
          <div className="col-auto" style={{ width: '180px' }}>
            <label htmlFor="requestNumber" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
              Request Number
              <input
                type="number"
                id="requestNumber"
                className="form-control"
                readOnly
                value={headerDetails.requestNumber}
              />
            </label>
          </div>
          <div className="col-auto" style={{ width: '200px' }}>
            <label htmlFor="createdBy" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
              Create By
              <input
                type="text"
                id="createdBy"
                className="form-control"
                style={{ marginLeft: '7px' }}
                readOnly
                // value={headerDetails.createdBy}
                defaultValue={account.full_name}
              />
            </label>
          </div>
          <div className="col-auto" style={{ width: '180px' }}>
            <label htmlFor="status" className="col-form-label" style={{ display: 'flex', fontSize: '14px' }}>
              Status
              <input
                type="text"
                id="status"
                className="form-control"
                style={{ marginLeft: '7px' }}
                readOnly
                value={headerDetails.status}
              />
            </label>
          </div>

          <div className="col-auto" style={{ width: '180px' }}>
            <label htmlFor="transactionTypeId" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
              Transaction Type ID
              <select
                className="form-control"
                name="transactionTypeId"
                id="transactionTypeId"
                style={{ backgroundColor: 'white' }}
                onChange={(e) => {
                  onChangeHeader(e);
                }}
                readOnly={isReadOnly}
              >
                <option value="null" />
                {transactionTypeIds.map((id, index) => (
                  <option key={index} value={id.transaction_type_id}>
                    {id.transaction_type_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* <div className="col-auto" style={{ width: '180px' }}>
            <label htmlFor="moveOrderType" className="col-form-label" style={{ display: 'flex', fontSize: '11px' }}>
              Move Order Type
              <input
                type="number"
                id="moveOrderType"
                name="moveOrderType"
                className="form-control"
                onChange={(e) => {
                  onChangeHeader(e);
                }}
                readOnly={isReadOnly}
              />
            </label>
          </div> */}
          <div className="col-auto" style={{ width: '180px' }}>
            <label htmlFor="organizationId" className="col-form-label" style={{ display: 'flex', fontSize: '13px' }}>
              Organization ID
              <select
                className="form-control"
                name="organizationId"
                id="organizationId"
                style={{ backgroundColor: 'white' }}
                onChange={(e) => {
                  onChangeHeader(e);
                }}
                readOnly={isReadOnly}
              >
                <option value="null" />
                {organizationIds.map((id, index) => (
                  <option key={index} value={parseInt(id.organization_id, 10)}>
                    {id.name}
                  </option>
                ))}
              </select>
              <span style={{ color: 'red' }}>*</span>
            </label>
          </div>
          <div className="col-auto" style={{ width: '241px' }}>
            <label htmlFor="description" className="col-form-label" style={{ display: 'flex', fontSize: '14px' }}>
              Description
              <textarea
                id="description"
                name="description"
                className="form-control"
                style={{ marginLeft: '7px', height: '30px' }}
                onChange={(e) => {
                  onChangeHeader(e);
                }}
                readOnly={isReadOnly}
              />
            </label>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
                <Button
                  style={{ marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                  onClick={saveHeader}
                >
                  Save
                </Button>
                <Button
                  style={{ marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }}
                  onClick={onClickDelete}
                >
                  Delete
                </Button>
                <Button style={{ backgroundColor: 'lightgray', color: 'black' }} onClick={handleAddRow}>
                  Add Lines
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
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
                        const allRowsSelected = selectedRows.length === rows.length;
                        const newSelectedRows = allRowsSelected ? [] : rows.map((_, index) => index);
                        setSelectedRows(newSelectedRows);
                      }}
                      checked={selectedRows.length === rows.length && rows.length !== 0}
                    />
                  </th>
                  <th>
                    Inventory Item ID <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Uom Code <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Required Quantity <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Date Required <span style={{ color: 'red' }}>*</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {showLines &&
                  rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleRowSelect(index, row)}
                          checked={selectedRows.includes(index)}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="inventoryItemId"
                          defaultValue={null}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        >
                          <option />
                          {inventoryItemIds.map((id, index) => (
                            <option key={index} value={parseInt(id.inventory_item_id, 10)}>
                              {id.inventory_item_code}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="uomCode"
                          // onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                          // defaultValue={'PCs'}
                          defaultValue={row.uomCode}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          name="requiredQuantity"
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          name="dateRequired"
                          defaultValue={getCurrentDate()}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
        {showLines && (
          <Grid item xs={3}>
            <Button style={{ marginRight: '10px', backgroundColor: 'lightgray', color: 'black' }} onClick={saveLines}>
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
        )}
      </Container>
    </>
  );
}
