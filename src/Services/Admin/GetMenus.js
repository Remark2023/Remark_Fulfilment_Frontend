/* eslint-disable import/named */
import { getMenusDetails } from '../ApiServices';

export const getMenusService = async () => {
  const response = await getMenusDetails();

  if(!response) return null;



  return response;
};