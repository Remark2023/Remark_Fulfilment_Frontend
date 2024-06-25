/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { sentenceCase } from 'change-case';
import { format } from 'date-fns';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Card,
    // Checkbox,
    Container,
    DialogTitle,
    // IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { getUserProfileDetails, updateUomDetails } from '../Services/ApiServices';
// import UomListToolbar from '../sections/@dashboard/uom/UomListToolbar';
import RequisitionListHead from '../sections/@dashboard/requisitions/RequisitionListHead';

import { useUser } from '../context/UserContext';
// ----------------------------------------------------------------------

const selectedUsers = [];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.request_number.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [USERLIST, setUserList] = useState([]);

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (account) {
  //         const requisitionDetails = await getUserwiseTxnRequestHeader(account.user_id);

  //         // Assuming `requisitionDetails.data` is an array, modify as needed
  //         if (requisitionDetails.data && requisitionDetails.data.length > 0) {
  //           // Assuming `updateUomInfo` is a function to process data
  //           setUserList(requisitionDetails.data);
  //         } else {
  //           // Handle the case when requisitionDetails.data is empty or undefined
  //           setUserList([]);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching account details:', error);
  //       // Handle the error as needed, e.g., set an error state or display a message
  //     }
  //   };

  //   fetchData();
  // }, [account]);
  // console.log(USERLIST);

  function updateUomInfo(uom) {
    if (uom.last_update_date) {
      const date = new Date(uom.last_update_date);

      uom.last_update_date = format(date, 'dd-MM-yyyy');
    }

    if (uom.creation_date) {
      const date = new Date(uom.creation_date);

      uom.creation_date = format(date, 'dd-MM-yyyy');
    }

    if (uom.header_status) {
      const date = new Date(uom.header_status);

      uom.header_status = format(date, 'dd-MM-yyyy');
    }

    return uom;
  }

  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const onValueChange = (e) => {
    console.log(rowData);
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const handleClickOpen = (row) => {
    console.log(row);
    setRowData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isDisable = true;

  const handleEdit = async () => {
    const {
      request_number,
      transaction_type_id,
      organization_id,
      last_update_date,
      last_updated_by,
      created_by,
      creation_date,
    } = rowData;
    try {
      const uomBody = {
        unitOfMeasure: request_number,
        uomCode: transaction_type_id,
        uomClass: organization_id,
        lastUpdateDate: last_update_date,
        lastUpdatedBy: last_updated_by,
        createdBy: created_by,
        creationDate: creation_date,
        description: rowData.description ? rowData.description : '',
      };

      const response = await updateUomDetails(uomBody);

      if (response.status === 200) {
        alert('Successfully updated!');
      } else {
        console.log(response);
        alert('Process failed! Try again later');
      }

      handleClose();
      navigate('/dashboard/uom', { replace: true });
      // window.location.reload();
      console.log(uomBody);
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };

  // const TABLE_HEAD = Object.keys(USERLIST[0]).map((column => ({id: column, label: sentenceCase(column), alignRight: false})));
  // TABLE_HEAD.push({id: ''})
  const TABLE_HEAD = [
    // { id: '' },
    { id: 'request_number', label: sentenceCase('request_number'), alignRight: false },
    { id: 'transaction_type_id', label: sentenceCase('transaction_type_id'), alignRight: false },
    { id: 'organization_id', label: sentenceCase('organization_id'), alignRight: false },
    { id: 'description', label: sentenceCase('description'), alignRight: false },
    { id: 'header_status', label: sentenceCase('status'), alignRight: false },
    // { id: '' },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.request_number);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    selectedUsers.push(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
    console.log(typeof selectedUsers);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const addUom = () => {
    // navigate('/dashboard/add-uom');
    navigate('/dashboard/requisition', { replace: true });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> COMS | UOM </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Requisitions
          </Typography>
          <Button
            variant="text"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color="primary"
            onClick={addUom}
            style={{ backgroundColor: 'lightgray', color: 'black', padding: '9px' }}
          >
            Add Requisitions
          </Button>
        </Stack>

        <Card>
          {/* <UomListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selectedUsers={selected}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RequisitionListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { request_number, transaction_type_id, organization_id, header_status, description } = row;
                    const rowValues = [
                      request_number,
                      transaction_type_id,
                      organization_id,
                      description,
                      header_status,
                    ];
                    const selectedUser = selected.indexOf(request_number) !== -1;

                    return (
                      <TableRow hover key={request_number} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, request_number)} />
                        </TableCell> */}

                        {rowValues.map((value) => (
                          <TableCell align="left">{value}</TableCell>
                        ))}

                        {/* <TableCell padding="checkbox">
                          <IconButton size="large" color="primary" onClick={() => handleClickOpen(row)}>
                            <Iconify icon={'tabler:edit'} />
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {rowData && (
                  <Dialog fullScreen open={open} onClose={handleClose}>
                    <DialogTitle>Edit UOM</DialogTitle>
                    <Stack />
                    <DialogContent>
                      <Stack
                        spacing={1.5}
                        direction="row" // Set the direction to "row" for horizontal alignment
                      >
                        <div>
                          <label htmlFor="request_number">Unit of Measure: </label>
                          <input
                            required
                            id="request_number"
                            name="request_number"
                            title="Maximum 25 characters are allowed."
                            value={rowData.request_number}
                            onChange={(e) => onValueChange(e)}
                            disabled={isDisable}
                          />
                        </div>

                        <div>
                          <label htmlFor="transaction_type_id">UOM Code: </label>
                          <input
                            required
                            id="transaction_type_id"
                            name="transaction_type_id"
                            title="Maximum 3 characters are allowed."
                            value={rowData.transaction_type_id}
                            onChange={(e) => onValueChange(e)}
                          />
                        </div>

                        <div>
                          <label htmlFor="organization_id">UOM Class: </label>
                          <input
                            required
                            id="organization_id"
                            name="organization_id"
                            title="Maximum 10 characters are allowed."
                            value={rowData.organization_id}
                            onChange={(e) => onValueChange(e)}
                          />
                        </div>

                        <div>
                          <label htmlFor="description">Description: </label>
                          <textarea
                            id="description"
                            name="description"
                            title="Maximum 50 characters are allowed."
                            style={{ height: '30px' }}
                            value={rowData.description}
                            onChange={(e) => onValueChange(e)}
                          />
                        </div>
                      </Stack>
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleEdit}>
                        Submit
                      </Button>
                      <Button onClick={handleClose} autoFocus>
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
