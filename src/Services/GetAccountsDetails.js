import { getAccountDetails, getLoggedInUserDetails } from './ApiServices';

export const getAccountDetailsService = async () => {
  const loggedInUser = await getLoggedInUserDetails();

  if (!(loggedInUser.status === 200)) {
    return null;
  }

  const response = await getAccountDetails(loggedInUser.data.email);
  if(!response) return null;
  
  updateAccountInfo(response);

  return response.data;
};

function updateAccountInfo(response) {
  switch (response.data.role) {
    case 1:
      response.data.role = 'Admin';
      break;
    case 2:
      response.data.role = 'Writer';
      break;
    case 3:
      response.data.role = 'Viewer';
      break;
    default:
  }

  response.data.name = !response.data.name ? 'User' : response.data.name;

  const dpLocation = '/assets/images/dp/';

  if (response.data.dpurl) {
    response.data.dpurl = `${dpLocation}${response.data.dpurl}`;
  } else {
    let defaultProfilePhotoUrl = '';
    switch (response.data.gender) {
      case 'Male':
        defaultProfilePhotoUrl = `${dpLocation}avatar_male.jpg`;
        break;
      case 'Female':
        defaultProfilePhotoUrl = `${dpLocation}avatar_female.jpg`;
        break;
      default:
        defaultProfilePhotoUrl = `${dpLocation}avatar_default.jpg`;
    }

    response.data.dpurl = defaultProfilePhotoUrl;
  }
}