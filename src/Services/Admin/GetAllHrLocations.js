import { getHrLocationsDetails } from '../ApiServices';

export const getHrLocationsDetailsService = async () => {
  const response = await getHrLocationsDetails();

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};