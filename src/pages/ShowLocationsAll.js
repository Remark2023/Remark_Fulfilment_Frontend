/* eslint-disable new-cap */

/* eslint-disable camelcase */
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { filter } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Checkbox,
  Container,
  IconButton,
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
import ImagesUpload from './ImagesUpload';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

import { getHrLocationsDetailsService } from '../Services/Admin/GetAllHrLocations';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'location_code', label: 'Location Code', alignRight: false },

  { id: 'description', label: 'Description', alignRight: false },

  { id: 'inactive_date', label: 'Inactive Date', alignRight: false },
  { id: 'address_line_1', label: 'Address Line1', alignRight: false },
  { id: 'address_line_2', label: 'Address Line2', alignRight: false },
  { id: 'address_line_3', label: 'Address Line3', alignRight: false },
  { id: 'town_or_city', label: 'Town Or City', alignRight: false },
  { id: 'country', label: 'Country', alignRight: false },
  { id: 'postal_code', label: 'Postal Code', alignRight: false },
  { id: 'telephone_number_1', label: 'Telephone Number1', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },

  { id: '' },
];
const selectedUsers = [];
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    fontSize: 20,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row'
  },
  cell: {
    padding: 5
  }
});
const PDFDocument = ({ users }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Locations</Text>
        <View style={styles.row}>
          <Text style={styles.cell}>Location Code</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Inactive Date</Text>
          {/* Add more headers here */}
        </View>
        {users.map(user => (
          <View key={user.location_id} style={styles.row}>
            <Text style={styles.cell}>{user.location_code}</Text>
            <Text style={styles.cell}>{user.description}</Text>
            <Text style={styles.cell}>{user.inactive_date}</Text>
            {/* Add more user data cells here */}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
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

export default function ShowLocationsAll() {
  const pdfRef = useRef();
  const navigate = useNavigate();
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
        const usersDetails = await getHrLocationsDetailsService();
        console.log('Hola', usersDetails.data[0].location_id);
        if (usersDetails) setUserList(usersDetails.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  const downloadPDF = () => {
    const pdfData = (
      <PDFDocument users={USERLIST} />
    );
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };
  const handleCloseMenu = () => {
    setOpen(null);
    window.location.reload();
  };

  const approveUser = async () => {
    const body = {
      status: 'approved',
      email: selectedUserEmail,
    };

    handleCloseMenu();
    window.location.reload();
  };

  const banUser = async () => {
    const body = {
      status: 'banned',
      email: selectedUserEmail,
    };

    handleCloseMenu();
    window.location.reload();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.location_id);
      setSelected(newSelecteds);

      return;
    }
    console.log('allselectedUsers : ', selectedUsers);
    setSelected([]);
  };

  // const downloadPDF = () => {
  //   const input = pdfRef.current;
  
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  
  //     const pdf = new jsPDF('p', 'mm', '04', true);
  
  //     const pdfwidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  
  //     const imgWidth = canvas.width;
  
  //     const imgHeight = canvas.height;
  
  //     const ratio = Math.min(pdfwidth / imgWidth, pdfHeight / imgHeight);
  
  //     const imgx = (pdfwidth - imgWidth * ratio) / 2;
  
  //     const imgy = 30;
  
  //     pdf.addImage(imgData, 'PNG', imgx, imgy, imgWidth * ratio, imgHeight * ratio);
  
  //     pdf.save('invoice.pdf');
  //   });
  // };
  

  // const downloadPDF = () => {
  //   const input = pdfRef.current;

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('p', 'mm', '04', true);

  //     const pdfwidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();

  //     const imgWidth = canvas.width;

  //     const imgHeight = canvas.height;

  //     const ratio = Math.min(pdfwidth / imgWidth, pdfHeight / imgHeight);

  //     const imgx = (pdfwidth - imgWidth * ratio) / 2;

  //     const imgy = 30;

  //     pdf.addImage(imgData, 'PNG', imgx, imgy, imgWidth * ratio, imgHeight * ratio);

  //     pdf.save('invoice.pdf');
  //   });
  // };
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
    console.log('toselectedUsers : ', selectedUsers);
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
        <title> HR Locations | COMS </title>
      </Helmet>

      <Container ref={pdfRef}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Locations
          </Typography>
          <div>
            <Button
              style={{ backgroundColor: 'lightgray', color: 'black', padding: '9px' }}
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              variant="text"
              onClick={() => {
                navigate(`/dashboard/addhrlocations/null`);
              }}
            >
              Add Location
            </Button>
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
                    const {
                      location_id,
                      location_code,

                      description,

                      inactive_date,
                      address_line_1,
                      address_line_2,
                      address_line_3,
                      town_or_city,
                      country,
                      postal_code,
                      telephone_number_1,
                    } = row;
                    const rowValues = [
                      location_id,
                      location_code,

                      description,

                      inactive_date,
                      address_line_1,
                      address_line_2,
                      address_line_3,
                      town_or_city,
                      country,
                      postal_code,
                      telephone_number_1,
                    ];

                    const selectedUser = selected.indexOf(location_id) !== -1;

                    return (
                      <TableRow hover key={location_id} tabIndex={-1} role="checkbox" >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, location_id)} />
                        </TableCell>
                      
                        <TableCell align="left">{location_code}</TableCell>

                        <TableCell align="left">{description}</TableCell>

                        <TableCell align="left">{inactive_date}</TableCell>
                        <TableCell align="left">{address_line_1}</TableCell>
                        <TableCell align="left">{address_line_2}</TableCell>
                        <TableCell align="left">{address_line_3}</TableCell>
                        <TableCell align="left">{town_or_city}</TableCell>
                        <TableCell align="left">{country}</TableCell>
                        <TableCell align="left">{postal_code}</TableCell>
                        <TableCell align="left">{telephone_number_1}</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="primary"
                            onClick={() => {
                              const locationId = location_id;
                              navigate(`/dashboard/addhrlocations/${locationId}`);
                            }}
                          >
                            <Iconify icon={'tabler:edit'} />
                          </IconButton>
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
        <Button
          style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
        <ImagesUpload />
      </Container>
    </>
  );
}
