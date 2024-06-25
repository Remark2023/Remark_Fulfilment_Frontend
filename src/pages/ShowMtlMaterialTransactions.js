/* eslint-disable camelcase */
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
    Card,
    Checkbox,
    Container,
    MenuItem,
    Paper,
    Popover,
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
// import { getLoggedInUserDetails, updateUserStatus } from '../Services/ApiServices';
//  import { getUsersDetailsService } from '../Services/GetAllUsersDetails';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

import { getAllMtlTransactionsService } from '../Services/Admin/GetAllMtlMaterialTransactions';
import AddMtlTransactionTypes from '../sections/@dashboard/user/AddMtlTransactionTypes';
import DeleteMtlTransactionTypes from '../sections/@dashboard/user/DeleteMtlTransactionTypes';
import UpdateMtlTransactionTypes from '../sections/@dashboard/user/UpdateMtlTransactionTypes';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'transactionId', label: 'Transaction ID', alignRight: false },
    { id: 'inventoryItemId', label: 'Inventory Item ID', alignRight: false },
    { id: 'organizationId', label: 'Organization ID', alignRight: false },
    { id: 'subinventoryCode', label: 'Subinventory Code', alignRight: false },
    { id: 'transactionTypeId', label: 'Transaction Type ID', alignRight: false },
    { id: 'transactionQuantity', label: 'Transaction Quantity', alignRight: false },
    { id: 'transactionUom', label: 'Transaction Uom', alignRight: false },
    { id: 'transactionDate', label: 'Transaction Date', alignRight: false },
    { id: 'transaction_cost', label: 'Transaction Cost', alignRight: false },
    { id: 'currencyCode', label: 'Currency Code', alignRight: false },
    { id: 'shipmentNumber', label: 'Shipment Number', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },

  { id: '' },
];
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
    return filter(array, (_user) => _user.location_code.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ShowMtlMaterialTransactions() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [USERLIST, setUserList] = useState([]);

  const [isDisableApprove, setIsDisableApprove] = useState(false);

  const [isDisableBan, setIsDisableBan] = useState(false);

  const [selectedUserEmail, setSelectedUserEmail] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const usersDetails = await getAllMtlTransactionsService();
        console.log('Hola', usersDetails.data[0].transaction_id);
        if (usersDetails) setUserList(usersDetails.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  //   const [loggedInUser, setLoggedInUser] = useState({});

  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const usersDetails = await getLoggedInUserDetails();
  //         if (usersDetails) setLoggedInUser(usersDetails.data);
  //       } catch (error) {
  //         console.error('Error fetching account details:', error);
  //       }
  //     }

  //     fetchData();
  //   }, []);

  //   const displayAddUser = loggedInUser.role === 1 ? 'block' : 'none';

  const handleOpenMenu = (event, status, email) => {
    if (status === 'approved') setIsDisableApprove(true);
    else setIsDisableApprove(false);

    if (status === 'banned') setIsDisableBan(true);
    else setIsDisableBan(false);

    setSelectedUserEmail(email);

    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const approveUser = async () => {
    const body = {
      status: 'approved',
      email: selectedUserEmail,
    };

    // const response = await updateUserStatus(body);

    // const alertMessage = response.status === 200 ? response.data.message : 'Process failed ! Try again';
    // alert(alertMessage);

    handleCloseMenu();
    window.location.reload();
  };

  const banUser = async () => {
    const body = {
      status: 'banned',
      email: selectedUserEmail,
    };

    // const response = await updateUserStatus(body);

    // const alertMessage = response.status === 200 ? response.data.message : 'Process failed ! Try again';
    // alert(alertMessage);

    handleCloseMenu();
  
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.email);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> HR Mtl Transaction Type | COMS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Mtl Transaction Type
          </Typography>
          <div>
            <AddMtlTransactionTypes/>
          </div>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selectedUsers={selected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
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
                    const { transaction_type_id, transaction_type_name, description } = row;
                    const selectedUser = selected.indexOf(transaction_type_id) !== -1;

                    return (
                      <TableRow hover key={transaction_type_id} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, transaction_type_id)} />
                        </TableCell>
                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell> */}
                        <TableCell align="left">{transaction_type_id}</TableCell>
                        <TableCell align="left">{transaction_type_name}</TableCell>

                        <TableCell align="left">{ description}</TableCell>

                   

                        {/* <TableCell align="left">
                          <Label
                            color={(status === 'banned' && 'error') || (status === 'pending' && 'warning') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <div style={{ marginTop: '22px' }}>
                          <UpdateMtlTransactionTypes transaction_type_id={transaction_type_id} />
                        </div>
                        <TableCell align="right">
                        <DeleteMtlTransactionTypes transaction_type_id={transaction_type_id} />
                        </TableCell>

                        <Popover
                          open={Boolean(open)}
                          anchorEl={open}
                          onClose={handleCloseMenu}
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          PaperProps={{
                            sx: {
                              p: 1,
                              width: 140,
                              '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                              },
                            },
                          }}
                        >
                          <MenuItem sx={{ color: 'success.main' }} disabled={isDisableApprove} onClick={approveUser}>
                            <Iconify icon={'mdi:approve'} sx={{ mr: 2 }} />
                            Appoved
                          </MenuItem>

                          <MenuItem sx={{ color: 'error.main' }} disabled={isDisableBan} onClick={banUser}>
                            <Iconify icon={'mdi:ban'} sx={{ mr: 2 }} />
                            Banned
                          </MenuItem>
                        </Popover>
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
