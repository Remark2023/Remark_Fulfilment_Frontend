/* eslint-disable import/named */
import { addFndUserDetails } from "../ApiServices";

export const addFndUserService = async (fnduser) => {
  console.log("people for admin page",fnduser);
  const response = await addFndUserDetails(fnduser);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};