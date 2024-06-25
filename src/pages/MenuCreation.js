/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-const-assign */
/* eslint-disable no-var */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-restricted-globals */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Button, ButtonGroup, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { addMainSystemMenuDetails, addMenusDetails, addSubMenusDetails } from '../Services/ApiServices';

// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [ischecked, setIsChecked] = useState(false);
  const [ismenuchecked, setIsMenuChecked] = useState(false);
  const [issubmenuchecked, setIsSubMenuChecked] = useState(false);

  const [systemMenuId, setSystemMenuId] = useState(' ');

  const handleChange = (event) => {
    console.log('check', event.target.checked);

    setIsChecked(event.target.checked);

    console.log(ischecked);
    updateMenuActive(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const mainSystemMenuDetails = {
    systemMenuDescription: '',
    menuActive: 'n',
    iconPath: '',
  };

  const [mainSystemMenu, setMainSystemMenu] = useState(mainSystemMenuDetails);
  const onChangeMainSystem = (e) => {
    setMainSystemMenu({ ...mainSystemMenu, [e.target.name]: e.target.value });
  };
  const updateMenuActive = (checked) => {
    console.log('asas', checked);
    if (checked === true) {
      setMainSystemMenu((prevMenu) => ({
        ...prevMenu,
        menuActive: 'y',
      }));
    } else {
      setMainSystemMenu((prevMenu) => ({
        ...prevMenu,
        menuActive: 'n',
      }));
    }
  };

  const [menurows, setMenuRows] = useState([
    {
      menuDescription: '',
      menuActive: 'n',
      systemMenuId: systemMenuId,
    },
  ]);
  const handleClickMainMenu = async () => {
    console.log(mainSystemMenu);
    const response = await addMainSystemMenuDetails(mainSystemMenu);
    console.log('Pass to home after request ', response);
    const aa = response.data;
    // systemMenuIdd=JSON.stringify(response.data.system_menu_id);
    console.log('aa', aa);
    // console.log('ss in ', systemMenuIdd);
    if (aa) setSystemMenuId(JSON.stringify(response.data.system_menu_id));

    // console.log('b+', systemMenuId);
    // console.log(systemMenuId.setId);
    handleClose();

    // window.location.reload();
  };

  console.log('ss out', systemMenuId);

  const [showMenuLines, setShowMenuLines] = useState(false);
  const [showSubMenuLines, setShowSubMenuLines] = useState(false);
  const [menuId, setMenuId] = useState(' ');

  const saveMenu = async () => {
    // const filteredArray = rows.filter((item) => Object.values(item).some((value) => value !== ''));
    console.log('rows', menurows);
    const index = menurows.length - 1;
    const requestBody = {
      menuDescription: menurows[index].menuDescription,
      menuActive: menurows[index].menuActive,
      systemMenuId: systemMenuId,
    };
    console.log('requestBody', requestBody);
    const response = await addMenusDetails(requestBody);
    const aa = response.data;
    console.log(aa);
    if (aa.menu_id) {
      console.log(typeof JSON.stringify(response.data.menu_id));
      setMenuId(JSON.stringify(response.data.menu_id));
    }

    console.log(menuId);
  };

  const [count, setCount] = useState(0);
  const saveSubMenus = async () => {
    console.log('submenurows:', submenurows.length);

    const filteredArray = submenurows.filter((item) => Object.values(item).some((value) => value !== ''));

    let c;
    for (c = count; c < filteredArray.length; c++) {
      const lineInfo = filteredArray[c];

      const requestBody = {
        subMenuDescription: lineInfo.subMenuDescription,
        subMenuAction: lineInfo.subMenuAction,
        subMenuActive: lineInfo.subMenuActive,
        subMenuType: lineInfo.subMenuType,
        slno: lineInfo.slno,
        menuId: menuId,
      };

      const response = await addSubMenusDetails(requestBody);

      if (response === 200) {
        setSubMenuRows([]);
      }
    }
    setCount(c);
    alert("Successfully added");
    navigate('/dashboard/showmenus');
    window.location.reload();
  };

  console.log('mm out', menuId);

  const handleAddMenuRow = () => {
    if (menurows.length === 1) setShowMenuLines(true);

    if (showMenuLines) {
      setMenuRows([
        ...menurows,
        {
          menuDescription: '',
          menuActive: 'n',
          systemMenuId: systemMenuId,
        },
      ]);
    }
    console.log(menurows);
  };

  const handleMenuChange = (index, name, value) => {
    const updatedRows = [...menurows];
    updatedRows[index][name] = value;
    setMenuRows(updatedRows);
    console.log(menurows);
  };
  const handleMenuCheckChange = (index, name, value) => {
    setIsMenuChecked(value);
    console.log('name', name);
    console.log('value', value);
    const updatedRows = [...menurows];
    if (value === true) {
      updatedRows[index][name] = 'y';
      setMenuRows(updatedRows);
      console.log(menurows);
    } else {
      updatedRows[index][name] = 'n';
      setMenuRows(updatedRows);
      console.log(menurows);
    }
  };

  const [submenurows, setSubMenuRows] = useState([
    {
      subMenuDescription: '',
      subMenuAction: '',
      subMenuActive: 'n',
      subMenuType: '',
      slno: null,
      menuId: menuId,
    },
  ]);

  const handleAddSubMenuRow = () => {
    console.log(submenurows.menuId);
    if (submenurows.length === 1) setShowSubMenuLines(true);
    // else
    // setShowLiness(true);
    if (showSubMenuLines) {
      setSubMenuRows([
        ...submenurows,
        {
          subMenuDescription: '',
          subMenuAction: '',
          subMenuActive: 'n',
          subMenuType: '',
          slno: null,
          menuId: menuId,
        },
      ]);
    }

    console.log(submenurows);
  };

  const handleSubMenuChange = (index, name, value) => {
    console.log(submenurows);
    const updatedRows = [...submenurows];
    updatedRows[index][name] = value;
    setSubMenuRows(updatedRows);
  };

  const handleSubMenuCheckChange = (index, name, value) => {
    setIsSubMenuChecked(value);
    console.log('subname', name);
    console.log('subvalue', value);
    const updatedRows = [...submenurows];
    if (value === true) {
      updatedRows[index][name] = 'y';
      setSubMenuRows(updatedRows);
      console.log(submenurows);
    } else {
      updatedRows[index][name] = 'n';
      setSubMenuRows(updatedRows);
      console.log('submenurows', submenurows);
    }
  };

  return (
    <>
      <Helmet>
        <title> COMS | System Menu </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Main System Menu
          </Typography>
      
        </Stack>

        
        <Grid container spacing={2} style={{ marginTop: '10px' }}>
          <Grid item xs={2}>
            <TextField
              type="text"
              name="systemMenuDescription"
              label="System Menu Description"
              autoComplete="given-name"
              onChange={(e) => onChangeMainSystem(e)}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>

          <Grid item xs={2}>
            <label>
              Menu Active
              <Checkbox
                checked={ischecked}
                label="Menu Active"
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </label>
          </Grid>

          <Grid item xs={2}>
            <TextField
              type="text"
              name="iconPath"
              label="Icon Path"
              autoComplete="given-name"
              onChange={(e) => onChangeMainSystem(e)}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={3}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
              <Button style={{ marginRight: '10px' }} onClick={handleClickMainMenu}>
                Save
              </Button>
              <Button
                onClick={() => {
                  handleAddMenuRow();
                }}
              >
                Add Menus
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <form className="form-horizontal" style={{ marginTop: '5%' }}>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-highlight">
                <thead>
                  <tr>
                    <th>
                      Menu Description <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Menu Active <span style={{ color: 'red' }}>*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showMenuLines &&
                    menurows.map((row, index) => {
                      const ismenuchecked = row.menuActive === 'y';
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              style={{ width: '150px' }}
                              type="text"
                              className="form-control"
                              name="menuDescription"
                              onChange={(e) => handleMenuChange(index, e.target.name, e.target.value)}
                            />
                          </td>
                          <td>
                            <Checkbox
                              checked={ismenuchecked}
                              label="Menu Active"
                              name="menuActive"
                              onChange={(e) => {
                                handleMenuCheckChange(index, e.target.name, e.target.checked);
                              }}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {showMenuLines && (
              <Grid item xs={3}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group" spacing={2}>
                  <Button variant="contained" style={{ marginRight: '10px' }} onClick={saveMenu}>
                    Save Menu
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddSubMenuRow();
                    }}
                  >
                    Add Sub Menus
                  </Button>
                </ButtonGroup>
              </Grid>
            )}
          </form>

          <form className="form-horizontal" style={{ marginTop: '5%' }}>
            <div className="table-responsive">
              <table
                className="table table-bordered table-striped table-highlight"
                style={{ width: '90%', marginLeft: '8%' }}
              >
                <thead>
                  <tr>
                    <th>
                      SL NO <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Sub Menu Description <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Sub Menu Action <span style={{ color: 'red' }}>*</span>
                    </th>

                    <th>
                      Sub Menu Type <span style={{ color: 'red' }}>*</span>
                    </th>
                    <th>
                      Sub Menu Active <span style={{ color: 'red' }}>*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showSubMenuLines &&
                    submenurows.map((row, index) => {
                      const issubmenuchecked = row.subMenuActive === 'y';
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              style={{ width: '60px' }}
                              type="text"
                              className="form-control"
                              name="slno"
                              onChange={(e) => handleSubMenuChange(index, e.target.name, e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              style={{ width: '240px' }}
                              type="text"
                              className="form-control"
                              name="subMenuDescription"
                              onChange={(e) => handleSubMenuChange(index, e.target.name, e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              style={{ width: '250px' }}
                              type="text"
                              className="form-control"
                              name="subMenuAction"
                              onChange={(e) => handleSubMenuChange(index, e.target.name, e.target.value)}
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="subMenuType"
                              onChange={(e) => handleSubMenuChange(index, e.target.name, e.target.value)}
                            />
                          </td>

                          <td>
                            <Checkbox
                              checked={issubmenuchecked}
                              label="Sub Menu Active"
                              name="subMenuActive"
                              onChange={(e) => {
                                handleSubMenuCheckChange(index, e.target.name, e.target.checked);
                              }}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {showSubMenuLines && (
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  style={{ marginLeft: '8%' }}
                  onClick={(e) => {
                    saveSubMenus();
                  }}
                >
                  Save SubMenus
                </Button>
              </Grid>
            )}
          </form>
        </div>
      </Container>
          
    </>
  );
}
