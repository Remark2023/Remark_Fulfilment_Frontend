/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-restricted-globals */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
// eslint-disable-next-line 
import { addMainSystemMenuService } from '../../../COMS-frontend/src/Services/Admin/AddMainSystemMenu';
import { addSubMenusService } from "../Services/Admin/AddSubMenus";
import { addMenusService } from "../Services/Admin/AssMenus";

// eslint-disable-next-line import/order
import {
    Button,
    ButtonGroup,
    Container,
    Grid,
    Stack,
    TextField,
    Typography
} from '@mui/material';
// import {
//   addTxnRequestHeader,
//   addTxnRequestLines,
//   deleteTxnRequestHeader,
//   deleteTxnRequestLines,
//   getInventoryItemIdList,
//   getOrganizationIdList,
//   getTransactionTypeList,
//   getUomCodeList,
// } from '../Services/ApiServices';
// ----------------------------------------------------------------------


export default function MenuCreation() {
  const [transactionTypeIds, setTransactionTypeIds] = useState([]);
  const [open, setOpen] = useState(false);
let systemMenuIdd;
let menuIdd;
let smenuIdd;

  const navigate = useNavigate();
  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const response = await getTransactionTypeList();
  //         if (response) setTransactionTypeIds(response.data);
  //       } catch (error) {
  //         console.error('Error fetching account details:', error);
  //       }
  //     }

  //     fetchData();
  //   }, []);

  const [organizationIds, setOrganizationIds] = useState([]);
  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const response = await getOrganizationIdList();
  //         if (response) setOrganizationIds(response.data);
  //       } catch (error) {
  //         console.error('Error fetching account details:', error);
  //       }
  //     }

  //     fetchData();
  //   }, []);

  //   const [uomCodes, setUomCodes] = useState([]);
  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const response = await getUomCodeList();
  //         if (response) setUomCodes(response.data);
  //       } catch (error) {
  //         console.error('Error fetching account details:', error);
  //       }
  //     }

  //     fetchData();
  //   }, []);

  //   const [inventoryItemIds, setInventoryItemIds] = useState([]);
  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const response = await getInventoryItemIdList();
  //         if (response) setInventoryItemIds(response.data);
  //       } catch (error) {
  //         console.error('Error fetching account details:', error);
  //       }
  //     }

  //     fetchData();
  //   }, []);
  const mainSystemMenuDetails = {
    systemMenuDescription: '',
    menuActive: '',
    iconPath: '',
  };


  const [mainSystemMenu, setMainSystemMenu] = useState(mainSystemMenuDetails);
  const onChangeMainSystem = (e) => {
    setMainSystemMenu({ ...mainSystemMenu, [e.target.name]: e.target.value });
  };

  const menusDetails = {
    menuDescription:'',
    menuActive: '',
    systemMenuId: systemMenuIdd,
   
  };

  const [menus, setMenus] = useState(menusDetails);
  const onChangeMenus = (e) => {
    setMenus({ ...menus, [e.target.name]: e.target.value });
  };

  const subMenusDetails = {
    subMenuDescription:'',
    subMenuAction: '',
    subMenuActive:'',
    subMenuType:'',
    slno:'',
    menuId: smenuIdd,
   
  };

  const [submenus, setSubMenus] = useState(subMenusDetails);
  const onChangeMenuss = (e) => {
    setSubMenus({ ...submenus, [e.target.name]: e.target.value });
  };


  const handleClick = async () => {
    try {
      console.log(mainSystemMenu);
      const response = await addMainSystemMenuService(mainSystemMenu);
      console.log('Pass to home after request ');
      systemMenuIdd=response.data[0].system_menu_id;
      console.log(systemMenuIdd);
      handleClose();
      navigate('/menucreation');
      

     // window.location.reload();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
   
  };

  const handleClicks = async () => {
    try {
      console.log("systemMenuId : ", systemMenuIdd);
      console.log(menus);
      const response = await addMenusService(menus);
      console.log('Pass to home after request ');
      menuIdd=response.data[0].menu_id;
      console.log("systemMenuId : ", menuIdd);
      handleClose();
     navigate('/menucreation');
     // window.location.reload();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
   
  };

  const handleClickss = async () => {
    try {
      console.log(submenus);
      const response = await addSubMenusService(submenus);
      console.log('Pass to home after request ');
      smenuIdd=response.data[0].sub_menu_id;
      console.log("systemMenuId : ", smenuIdd);
      handleClose();
      navigate('/menucreation');
     // window.location.reload();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
   
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [showLines, setShowLines] = useState(false);
  // const [showHeaderDetails, setShowHeaderDetails] = useState(false);
  const [headerDetails, setHeaderDetails] = useState({});

  //   const saveHeader = async () => {
  //     const response = await addTxnRequestHeader(headerInfo);
  //     if (response.status === 200) {
  //       // setShowHeaderDetails(true);
  //       setHeaderDetails({
  //         headerId: response.data.headerInfo[0].header_id,
  //         organizationId: response.data.headerInfo[0].organization_id,
  //         requestNumber: response.data.headerInfo[0].request_number,
  //         status: response.data.headerInfo[0].header_status,
  //         createdBy: response.data.headerInfo[0].created_by,
  //       });
  //     } else {
  //       alert('Process failed! Try again');
  //     }
  //   };

  const [rows, setRows] = useState([
    {
      inventoryItemId: '',
      fromSubinventoryCode: '',
      uomCode: '',
      requiredQuantity: '',
      dateRequired: '',
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        inventoryItemId: null,
        fromSubinventoryCode: '',
        uomCode: '',
        requiredQuantity: null,
        dateRequired: '',
      },
    ]);
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
      window.location.reload();
    }
  };

  //   const deleteRequest = async () => {
  //     console.log('aaaa');
  //     await deleteTxnRequestLines(headerDetails.headerId);
  //     await deleteTxnRequestHeader(headerDetails.headerId);

  //     if (confirm('Are you sure to delete this requisition?')) {
  //       window.location.reload();
  //     }
  //   };

  const saveLines = async () => {
    const filteredArray = rows.filter((item) => Object.values(item).some((value) => value !== ''));

    filteredArray.forEach(async (lineInfo, index) => {
      const requestBody = {
        headerId: headerDetails.headerId,
        organizationId: headerDetails.organizationId,
        lineNumber: index + 1,
        inventoryItemId: lineInfo.inventoryItemId,
        uomCode: lineInfo.uomCode,
        dateRequired: lineInfo.dateRequired,
        requiredQuantity: lineInfo.requiredQuantity,
      };

      //   const response = await addTxnRequestLines(requestBody);

      //   if (response.status === 200) {
      //     setShowApprovalButton(true);
      //   } else {
      //     setShowApprovalButton(false);
      //   }
    });
  };

  return (
    <>
      <Helmet>
        <title> COMS | User Management </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            System Menu
          </Typography>
        </Stack>
        <Grid container spacing={2}>
        <Grid item xs={2}>
            <TextField
              type="text"
              name="systemMenuDescription"
              label="System Menu Description"
              autoComplete="given-name"
              onChange={(e) => onChangeMainSystem(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="text"
              name="menuActive"
              label="Menu Active"
              autoComplete="given-name"
              onChange={(e) => onChangeMainSystem(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="iconPath"
              label="Icon Path"
              autoComplete="given-name"
              onChange={(e) => onChangeMainSystem(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={6}>
          <Button autoFocus onClick={handleClick}>
            Submit
          </Button>
          </Grid>
         
          <Grid item xs={2}>
            <TextField
              fullWidth
              name="systemMenuId"
              label="System Menu Id"
              value={systemMenuIdd}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="text"
              name="menuDescription"
              label="Menu Description"
              autoComplete="given-name"
              onChange={(e) => onChangeMenus(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="menuActive"
              label="Menu Active"
              autoComplete="given-name"
              onChange={(e) => onChangeMenus(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>

          <Grid item xs={6}>
          <Button autoFocus onClick={handleClicks}>
            Submit
          </Button>
          </Grid>

          <Grid item xs={2}>
            <TextField
              fullWidth
              name="submenus"
              label=" Menus Id"
              value={smenuIdd}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="text"
              name="subMenuDescription"
              label="SUB MENU DESCRIPTION"
              autoComplete="given-name"
              onChange={(e) => onChangeMenuss(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="subMenuAction"
              label="SUB MENU ACTION"
              autoComplete="given-name"
              onChange={(e) => onChangeMenuss(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="subMenuActive"
              label="SUB MENU ACTIVE"
              autoComplete="given-name"
              onChange={(e) => onChangeMenuss(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="subMenuType"
              label="SUB MENU TYPE"
              autoComplete="given-name"
              onChange={(e) => onChangeMenuss(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="slno"
              label="SLNO"
              autoComplete="given-name"
              onChange={(e) => onChangeMenuss(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>

          <Grid item xs={2}>
          <Button autoFocus onClick={handleClickss}>
            Submit
          </Button>
          </Grid>

          

          {/* <Grid item xs={2}>
            <TextField
              fullWidth
              name="requestNumber"
              label="Request Number"
              value={headerDetails.requestNumber}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ height: '25px', padding: '5px' }}
            />
          </Grid> */}
          {/* <Grid item xs={2}>
            <TextField
              fullWidth
              name="createdBy"
              label="Create dBy"
              value={headerDetails.createdBy}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              name="status"
              label="Status"
              value={headerDetails.status}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid> */}
          {/* <Grid item xs={2}>
            <TextField
              select
              fullWidth
              name="transactionTypeId"
              label="Transaction Type ID"
              autoComplete="given-name"
              onChange={(e) => onChangeHeader(e)}
              // error={!!errors.uomCode}
              // helperText={errors.uomCode}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            >
              <MenuItem value={null}>
                <em />
              </MenuItem>
              {transactionTypeIds.map((id, index) => (
                <MenuItem key={index} value={id.transaction_type_id}>
                  {id.transaction_type_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
          {/* <Grid item xs={2}>
            <TextField
              type="number"
              name="moveOrderType"
              label="Move Order Type"
              autoComplete="given-name"
              onChange={(e) => onChangeHeader(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid> */}
         
          {/* <Grid item xs={2}>
            <TextField
              fullWidth
              name="fromSubinventoryCode"
              label="From Subinventory Code"
              autoComplete="given-name"
              onChange={(e) => onChangeHeader(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid> */}
          {/* <Grid item xs={2}>
            <TextField
              fullWidth
              name="toSubinventoryCode"
              label="To Subinventory Code"
              autoComplete="given-name"
              onChange={(e) => onChangeHeader(e)}
              // error={!!errors.uomClass}
              // helperText={errors.uomClass}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid> */}
          {/* <Grid item xs={2}>
            <TextField
              type="date"
              name="dateRequired"
              label="Date Required"
              onChange={(e) => onChangeHeader(e)}
              //   error={!!errors.startDateActive}
              //   helperText={errors.startDateActive}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid> */}
          {/* <Grid item xs={3}>
            <TextareaAutosize
              name="description"
              placeholder="Description.."
              autoComplete="given-name"
              onChange={(e) => onChangeHeader(e)}
              // error={!!errors.description}
              // helperText={errors.description}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid> */}
         
        </Grid>

        {/* <form className="form-horizontal" style={{ marginTop: '20px' }}>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-highlight">
              <thead>
                <tr>
                  <th>
                    Inventory Item ID <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>From Subinventory Code</th>
                  <th>
                    Uom Code <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Required Quantity <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Date Required <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {showLines &&
                  rows.map((row, index) => (
                    <tr key={index}>
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
                          name="fromSubinventoryCode"
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="uomCode"
                          defaultValue={''}
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        >
                          <option />
                          {uomCodes.map((code, index) => (
                            <option key={index} value={code.uom_code}>
                              {code.unit_of_measure}
                            </option>
                          ))}
                        </select>
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
                          onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                        />
                      </td>
                      <td>
                        <Button>
                          <AddIcon onClick={handleAddRow} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form> */}
        {showLines && (
          <Grid item xs={3}>
            <Button variant="contained" style={{ marginRight: '10px' }} onClick={saveLines}>
              Save
            </Button>
            {showApprovalButton && (
              <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
                <Button style={{ marginRight: '10px', display: { showApprovalButton } }} onClick={submitRequisition}>
                  Approval
                </Button>
                <Button onClick={deleteRequest}>Delete</Button>
              </ButtonGroup>
            )}
          </Grid>
        )}
      </Container>
          
    </>
  );
}
