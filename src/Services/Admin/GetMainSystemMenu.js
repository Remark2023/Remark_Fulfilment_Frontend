/* eslint-disable import/named */
import { getMainSystemMenuDetails } from '../ApiServices';

export const getMainSystemMenuService = async () => {
  const response = await getMainSystemMenuDetails();

  if(!response) return null;



  return response;
};