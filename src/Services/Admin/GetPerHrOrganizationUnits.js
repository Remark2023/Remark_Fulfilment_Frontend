/* eslint-disable camelcase */
import { getPerHrOrganizationUnits } from '../ApiServices';

export const getPerHrOrganizationUnitsService = async ( organization_id ) => {
  console.log("getper",organization_id);
  const response = await getPerHrOrganizationUnits( organization_id );

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};