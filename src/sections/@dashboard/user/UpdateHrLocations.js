/* eslint-disable camelcase */
/* eslint-disable no-undef */
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPerHrLocationsDetailsService } from '../../../Services/Admin/GetPerHrLocation';

export default function UpdateHrLocations() {
  const { location_id } = useParams();
  const navigate = useNavigate();
  console.log('update page ', location_id);
  const [open, setOpen] = useState(false);

  const [location, setLocation] = useState({
    locationId: '',
    locationCode: '',
    businessGroupId: 5,
    description: '',
    shipToLocationId: 3,
    inventoryOrganizationId: 4,

    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    townOrCity: '',
    country: '',
    postalCode: '',
    telephoneNumber1: '',
    telephoneNumber2: '01533581070 ',
    telephoneNumber3: '01533581070',
    lastUpdateDate: '08-08-2023',
    lastUpdatedBy: 1,
    createdBy: 2,
    creationDate: '07-08-2023',
  });

  const onValueChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { location_id });
        console.log('without', location_id);
        const result = await getPerHrLocationsDetailsService(location_id);
        console.log(
          'Eiii',
          result.data[0].location_id,
          result.data[0].location_code,
          result.data[0].description,
          result.data[0].postal_code
        );
        setLocation({
          ...location,
          locationId: result.data[0].location_id,
          locationCode: result.data[0].location_code,
          description: result.data[0].description,
          addressLine1: result.data[0].address_line_1,
          addressLine2: result.data[0].address_line_2,
          addressLine3: result.data[0].address_line_3,
          townOrCity: result.data[0].town_or_city,
          country: result.data[0].country,
          postalCode: result.data[0].postal_code,
          telephoneNumber1: result.data[0].telephone_number_1,
        });

        console.log('location Details', location);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      console.log('loc', location);
      const response = await axios.put(
        `http://182.160.114.100:5001/update-hr-locations-all/${location.locationId}`,
        location
      );

      console.log('Pass to home after request ');
      handleClose();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    navigate('/dashboard/showlocationsall');
    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <h3 style={{ marginLeft: '50px' }}>Update {location.description} Location</h3>
      <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
                <th>
                  Location Code <span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  Description <span style={{ color: 'red' }}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <td style={{ width: '100px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="locationCode"
                  label="Location Code"
                  value={location.locationCode}
                  onChange={(e) => onValueChange(e)}
                  //  onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '550px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  label="Description"
                  value={location.description}
                  onChange={(e) => onValueChange(e)}
                  // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
            </tbody>
          </table>

          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
                <th>
                  Address Line1 <span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  Address Line2 <span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  Address Line3 <span style={{ color: 'red' }}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="addressLine1"
                  label="Address Line1"
                  value={location.addressLine1}
                  onChange={(e) => onValueChange(e)}
                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="addressLine2"
                  label="Address Line2"
                  value={location.addressLine2}
                  onChange={(e) => onValueChange(e)}
                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="addressLine3"
                  label="Address Line3"
                  value={location.addressLine3}
                  onChange={(e) => onValueChange(e)}
                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
            </tbody>
          </table>

          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
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
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="townOrCity"
                  label="Town Or City"
                  value={location.townOrCity}
                  onChange={(e) => onValueChange(e)}

                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  label="Country"
                  value={location.country}
                  onChange={(e) => onValueChange(e)}
                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="postalCode"
                  label="Postal Code"
                  value={location.postalCode}
                  onChange={(e) => onValueChange(e)}
                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '250px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="telephoneNumber1"
                  label="Telephone Number1"
                  value={location.telephoneNumber1}
                  onChange={(e) => onValueChange(e)}
                  //   onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
            </tbody>
          </table>
        </div>

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
      </form>
    </div>
  );
}
