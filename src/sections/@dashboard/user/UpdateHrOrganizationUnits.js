/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getPerHrOrganizationUnitsService } from '../../../Services/Admin/GetPerHrOrganizationUnits';

export default function UpdateHrOrganizationUnits() {
  const { organization_id } = useParams();
  const navigate = useNavigate();
  console.log('update page ', organization_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [organization, setOrganization] = useState({
    organizationId: '',
    businessGroupId: '',
    locationId: '',

    dateFrom: '',
    name: '',
    dateTo: '',

    lastUpdateDate: '08-08-2023',
    lastUpdatedBy: '1',
    createdBy: '2',
    creationDate: '07-08-2023',
  });

  const onValueChange = (e) => {
    setOrganization({ ...organization, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { organization_id });
        console.log('without', organization_id);
        const result = await getPerHrOrganizationUnitsService(organization_id);
        const dateTimeString1 = result.data[0].date_from;
        const datefrom = dateTimeString1.split('T')[0];
        const dateTimeString2 = result.data[0].date_to;
        const dateto = dateTimeString2.split('T')[0];

        setOrganization({
          ...organization,
          organizationId: result.data[0].organization_id,
          businessGroupId: result.data[0].business_group_id,
          locationId: result.data[0].location_id,

          dateFrom: datefrom,
          name: result.data[0].name,
          dateTo: dateto,
        });

        console.log('location Details', organization);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      console.log('loc', organization);
      const response = await axios.put(
        `http://182.160.114.100:5001/update-hr-organization-units/${organization.organizationId}`,
        organization
      );

      console.log('Pass to home after request ');
      handleClose();
    } catch (err) {
      console.log(err.message);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    navigate('/dashboard/showorganizationunits');
    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <div>
        <h3 style={{ marginLeft: '50px' }}>Update {organization.name} Organization</h3>
        <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-highlight">
              <thead>
                <tr>
              
                  <th>
                    Business Group Id <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Location ID <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Date From <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Name <span style={{ color: 'red' }}>*</span>
                  </th>
                  <th>
                    Date To <span style={{ color: 'red' }}>*</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                
                <td style={{ width: '400px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="businessGroupId"
                    label="Business Group Id "
                    value={organization.businessGroupId}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>

                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="locationId"
                    label="Location ID"
                    value={organization.locationId}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="dateFrom"
                    label="Date From"
                    value={organization.dateFrom}
                  //  onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '750px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    label="Name"
                    value={organization.name}
                    onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
                <td style={{ width: '350px' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="dateTo"
                    label="Date To"
                    value={organization.dateTo}
                    // onChange={(e) => onValueChange(e)}
                    // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                  />
                </td>
              </tbody>
            </table>

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
          </div>
        </form>
      </div>
    </div>
  );
}
