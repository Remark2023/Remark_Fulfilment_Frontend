/* eslint-disable import/named */
/* eslint-disable camelcase */
/* eslint-disable no-undef */

import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteMtlCategory, getPerMtlCategoriesDetails, updateMtlCategory } from '../Services/ApiServices';
import { useUser } from '../context/UserContext';

export default function UpdateMtlCategories() {
  const { category_id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState({});
  const { user } = useUser();
  console.log(user);
  const date = new Date();
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

  const [mtlcategories, setMtlcategories] = useState({
    description: '',
    segment1: '',
    segment2: '',
    lastUpdateDate: date,
    lastUpdatedBy: 1,
    lastUpdateLogin: 1,
    creationDate: date,
    createdBy: 1,
  });

  const onValueChange = (e) => {
    setMtlcategories({ ...mtlcategories, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getPerMtlCategoriesDetails(category_id);
        console.log('Eiii', result);
        setMtlcategories({
          ...mtlcategories,
          description: result.data.description,
          segment1: result.data.segment1,
          segment2: result.data.segment2,
        });
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      console.log('loc', mtlcategories);
      const response = await updateMtlCategory(category_id, mtlcategories);

      console.log('Pass to home after request ');
      // alert('Data Updated');
      handleClose();
    } catch (err) {
      console.log(err.message.TextField);
      // alert('Process failed! Try again later');
    }
  };
  const handleClickDelete = async () => {
    try {
      const response = await deleteMtlCategory(category_id);

      console.log('Pass to home after request ');

      handleCloseDelete();
    } catch (err) {
      console.log(err.message.TextField);
    }
  };

  const handleClose = () => {
    alert('Data Updated');
    navigate('/dashboard/managemtlcategoriesb');
    window.location.reload();
    setOpen(false);
  };
  const handleCloseDelete = () => {
    alert('Data Deleted');
    navigate('/dashboard/managemtlcategoriesb');
    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <h3 style={{ marginLeft: '50px' }}>Update Mtl Categories</h3>
      <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
                <th>Description</th>
                <th>Segment1</th>
                <th>Segment2</th>
              </tr>
            </thead>
            <tbody>
              <td style={{ width: '400px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={mtlcategories.description}
                  onChange={(e) => onValueChange(e)}
                  //  onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '350px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="segment1"
                  value={mtlcategories.segment1}
                  onChange={(e) => onValueChange(e)}
                  // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>

              <td style={{ width: '350px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="segment2"
                  value={mtlcategories.segment2}
                  onChange={(e) => onValueChange(e)}
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
            onClick={handleClickDelete}
          >
            Delete Categories
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
  );
}
