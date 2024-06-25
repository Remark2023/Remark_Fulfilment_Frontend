/* eslint-disable import/named */
/* eslint-disable camelcase */
import { getPerFndUserDetails } from '../ApiServices';

export const getPerFndUserService = async ( user_id ) => {
 
  const response = await getPerFndUserDetails( user_id );

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};