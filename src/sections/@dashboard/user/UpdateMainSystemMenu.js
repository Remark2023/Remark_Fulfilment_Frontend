/* eslint-disable import/named */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getperMainSystemMenuService } from '../../../Services/Admin/GetperMainSystemMenu';

export default function UpdateMainSystemMenu() {
  const { system_menu_id } = useParams();
  const navigate = useNavigate();
  console.log('update page person', system_menu_id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [mainsystemmenu, setMainsystemmenu] = useState({
    systemMenuDescription: '',
    menuActive: '',
    iconPath: '',
  });

  const onValueChange = (e) => {
    setMainsystemmenu({ ...mainsystemmenu, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadUser();
  };
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('with brackets', { system_menu_id });
        console.log('without', system_menu_id);
        const result = await getperMainSystemMenuService(system_menu_id);
        console.log('Eiii', result.data[0].system_menu_id);
        setMainsystemmenu({
          ...mainsystemmenu,
          systemMenuDescription: result.data[0].system_menu_description,
          menuActive: result.data[0].menu_active,
          iconPath: result.data[0].icon_path,
        });
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      console.log('loc', mainsystemmenu);
      const response = await axios.put(
        `http://182.160.114.100:5001/update-main-system-menu/${system_menu_id}`,
        mainsystemmenu
      );

      console.log('Pass to home after request ');
      handleClose();
    } catch (err) {
      console.log(err.message.TextField);
      alert('Process failed! Try again later');
    }
  };

  const handleClose = () => {
    navigate('/dashboard/showmainsystemmenu');
    window.location.reload();
    setOpen(false);
  };

  return (
    <div>
      <h3 style={{ marginLeft: '50px' }}>Update {mainsystemmenu.systemMenuDescription} Menu</h3>
      <form className="form-horizontal" style={{ marginTop: '5%', marginLeft: '50px' }}>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
                <th>
                  System Menu Description<span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  Menu Active <span style={{ color: 'red' }}>*</span>
                </th>
                <th>
                  Icon Path <span style={{ color: 'red' }}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <td style={{ width: '100px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="systemMenuDescription"
                  label="System Menu Description"
                  value={mainsystemmenu.systemMenuDescription}
                  onChange={(e) => onValueChange(e)}
                  //  onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '550px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="menuActive"
                  label="Menu Active"
                  value={mainsystemmenu.menuActive}
                  onChange={(e) => onValueChange(e)}
                  // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                />
              </td>
              <td style={{ width: '550px' }}>
                <input
                  type="text"
                  className="form-control"
                  name="iconPath"
                  label="Icon Path"
                  value={mainsystemmenu.iconPath}
                  onChange={(e) => onValueChange(e)}
                  // onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
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
