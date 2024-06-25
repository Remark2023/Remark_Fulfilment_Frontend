/* eslint-disable import/named */
import { addMainSystemMenuDetails } from "../ApiServices";

export const addMainSystemMenuService = async (mainsystemmenu) => {
  console.log("people for admin page",mainsystemmenu);
  const response = await addMainSystemMenuDetails(mainsystemmenu);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};