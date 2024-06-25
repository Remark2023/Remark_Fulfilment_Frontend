/* eslint-disable camelcase */
import { getPerHrLocationsDetails } from '../ApiServices';

export const getPerHrLocationsDetailsService = async ( location_id ) => {


  const response = await getPerHrLocationsDetails( location_id );

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};