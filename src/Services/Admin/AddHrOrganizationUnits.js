/* eslint-disable import/named */
import { addHrOrganizationUnitsDetails } from "../ApiServices";

export const addHrOrganizationUnits = async (organization) => {
  console.log("organization for admin page",organization);
  const response = await addHrOrganizationUnitsDetails(organization);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};