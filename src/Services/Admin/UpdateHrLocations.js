/* eslint-disable camelcase */


import { updateHrLocationsDetails } from '../ApiServices';

export const updateHrLocationsService = async (location) => {
  console.log("location in ",location.location_id);
  const response = await updateHrLocationsDetails( location);

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};