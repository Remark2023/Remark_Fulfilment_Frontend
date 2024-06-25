/* eslint-disable import/named */
import { addSubMenusDetails } from "../ApiServices";

export const addSubMenusService = async (submenus) => {
  console.log("people for admin page",submenus);
  const response = await addSubMenusDetails(submenus);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};