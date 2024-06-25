import { logoutService } from './ApiServices';

const logout = async () => {
  const logoutDetails = await logoutService();
  console.log(logoutDetails);
};

export default logout;
