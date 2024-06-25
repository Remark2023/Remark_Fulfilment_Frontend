/* eslint-disable camelcase */
import { getperPerAllPeoplesDetails } from '../ApiServices';

export const getperPerAllPeoplesService = async ( person_id ) => {
 
  const response = await getperPerAllPeoplesDetails( person_id );

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};