



/* eslint-disable import/named */
/* eslint-disable camelcase */
import { getperMainSystemMenuDetails } from '../ApiServices';

export const getperMainSystemMenuService = async ( system_menu_id ) => {
 
  const response = await getperMainSystemMenuDetails( system_menu_id );

  if(!response) return null;

//   const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data));

  return response;
};