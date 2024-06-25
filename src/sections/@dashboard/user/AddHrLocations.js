/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { Container, Grid, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
// import { useDownloadExcel } from 'react-export-table-to-excel';
import { useNavigate, useParams } from 'react-router-dom';
import { addHrLocationsDetailsService } from '../../../Services/Admin/AddHrLocations';
import { getPerHrLocationsDetailsService } from '../../../Services/Admin/GetPerHrLocation';

export default function AddHrLocations() {
  const tableref = useRef(null);
  const navigate = useNavigate();
  const { location_id } = useParams();
  console.log(location_id);
  console.log(location_id === 'null');
  const [e, setE] = useState();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showMenuLines, setShowMenuLines] = useState(!(location_id === 'null'));
  console.log(showMenuLines);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [clonelocation, setClonelocation] = useState([{}]);

  // const { onDownload } = useDownloadExcel({
  //   currentTableRef: tableref.current,
  //   filename: 'sales_order_data',
  //   sheet: 'SalesOrderData',
  // });

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { location_id });
        console.log('without', typeof location_id);

        console.log(typeof location_id);
        if (location_id !== 'null') {
          const result = await getPerHrLocationsDetailsService(parseInt(location_id, 10));

          setClonelocation(result.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log(clonelocation);

  const handleMenuChange = (index, name, value) => {
    const updatedRows = [...clonelocation];
    updatedRows[index][name] = value;
    setClonelocation(updatedRows);
    console.log(clonelocation);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [count, setCount] = useState(0);
  const handleClick = async () => {
    try {
      console.log('clone', clonelocation.location_id);

      const filteredArray = clonelocation.filter((item) => Object.values(item).some((value) => value !== ''));

      let c;
      for (c = 0; c < filteredArray.length; c++) {
        const lineInfo = filteredArray[c];
        console.log('line info ', lineInfo);
        if (location_id === 'null' || lineInfo.location_id === '') {
          const requestBody = {
            locationCode: lineInfo.location_code,
            businessGroupId: '5',
            description: lineInfo.description,
            shipToLocationId: '3',
            inventoryOrganizationId: '4',

            addressLine1: lineInfo.address_line_1,
            addressLine2: lineInfo.address_line_2,
            addressLine3: lineInfo.address_line_3,
            townOrCity: lineInfo.town_or_city,
            country: lineInfo.country,
            postalCode: lineInfo.postal_code,
            telephoneNumber1: lineInfo.telephone_number_1,
            telephoneNumber2: '01533581070 ',
            telephoneNumber3: '01533581070',
            lastUpdateDate: '08-08-2023',
            lastUpdatedBy: '1',
            createdBy: '2',
            creationDate: '07-08-2023',
          };

          const response = await addHrLocationsDetailsService(requestBody);
          console.log('Pass to home after request ');
          handleClose();
        } else {
          const requestBody = {
            locationId: lineInfo.location_id,
            locationCode: lineInfo.location_code,
            businessGroupId: '5',
            description: lineInfo.description,
            shipToLocationId: '3',
            inventoryOrganizationId: '4',

            addressLine1: lineInfo.address_line_1,
            addressLine2: lineInfo.address_line_2,
            addressLine3: lineInfo.address_line_3,
            townOrCity: lineInfo.town_or_city,
            country: lineInfo.country,
            postalCode: lineInfo.postal_code,
            telephoneNumber1: lineInfo.telephone_number_1,
            telephoneNumber2: '01533581070 ',
            telephoneNumber3: '01533581070',
            lastUpdateDate: '08-08-2023',
            lastUpdatedBy: '1',
            createdBy: '2',
            creationDate: '07-08-2023',
          };

          const response = await axios.put(
            `http://182.160.114.100:5001/update-hr-locations-all/${lineInfo.location_id}`,
            requestBody
          );
          console.log('Pass to home after request ');
          handleClose();
        }
      }
      setClonelocation([]);
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };
  const handleAddRow = () => {
    console.log('ll', clonelocation.length);
    if (clonelocation.length === 1) setShowMenuLines(true);

    console.log(clonelocation);
    if (showMenuLines) {
      console.log('dd', showMenuLines);
      setClonelocation([
        ...clonelocation,
        {
          location_id: '',
          location_code: '',
          business_group_id: '5',
          description: '',
          ship_to_location_id: '3',
          inventory_organization_id: '4',

          address_line_1: '',
          address_line_2: '',
          address_line_3: '',
          town_or_city: '',
          country: '',
          postal_code: '',
          telephone_number_1: '',
          telephone_number_2: '01533581070 ',
          telephone_number_3: '01533581070',
          last_update_date: '08-08-2023',
          last_updated_by: '1',
          created_by: '2',
          creation_date: '07-08-2023',
        },
      ]);
    }
    console.log(clonelocation);
  };

  const handleClose = () => {
    navigate('/dashboard/showlocationsall');

    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Location Add
          </Typography>
        </Stack>
        <Grid item xs={3}>
          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={() => {
              handleAddRow();
            }}
          >
            Add Location
          </Button>

          <Button
            style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Grid>

        <div>
          <form className="form-horizontal" style={{ marginTop: '5%' }}>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-highlight" ref={tableref}>
                <thead>
                  <tr>
                    <th>
                      Location Code <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Description <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Address Line1 <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Address Line2 <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Address Line3 <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Town Or City <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Country <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Postal Code <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Telephone Number1 <span style={{ color: 'red' }}>*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showMenuLines &&
                    clonelocation.map((row, index) => (
                      <tr key={index}>
                        <td style={{ width: '150px' }}>
                          <input
                            type="text"
                            className="form-control"
                            name="location_code"
                            value={row.location_code}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="description"
                            value={row.description}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="address_line_1"
                            value={row.address_line_1}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="address_line_2"
                            value={row.address_line_2}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="address_line_3"
                            value={row.address_line_3}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '200px' }}
                            type="text"
                            className="form-control"
                            name="town_or_city"
                            value={row.town_or_city}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="country"
                            value={row.country}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '150px' }}
                            type="text"
                            className="form-control"
                            name="postal_code"
                            value={row.postal_code}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: '350px' }}
                            type="text"
                            className="form-control"
                            name="telephone_number_1"
                            value={row.telephone_number_1}
                            onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {showMenuLines && (
              <Grid item xs={3} style={{ marginTop: '20px' }}>
                <Button
                  style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
                  onClick={handleClick}
                >
                  Submit
                </Button>
                <Button
                  style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                {/* <Button
                  style={{ marginRight: '10px', fontWeight: 'bold', color: 'black', backgroundColor: 'lightgray' }}
                  onClick={onDownload}
                >
                  Export
                </Button> */}
              </Grid>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}
