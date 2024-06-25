/* eslint-disable import/named */
import { addMenusDetails } from "../ApiServices";

export const addMenusService = async (menus) => {
  console.log("people for admin page",menus);
  const response = await addMenusDetails(menus);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};