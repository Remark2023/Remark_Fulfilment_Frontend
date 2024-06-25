import { getUsersDetails } from './ApiServices';

export const getUsersDetailsService = async () => {
  const response = await getUsersDetails();

  if(!response) return null;

  const updatedResponse = response.data.filter(data => data.status !== 'deleted').map(data => updateAccountInfo(data))

  return updatedResponse;
};

function updateAccountInfo(response) {
  switch (response.role) {
    case 1:
      response.role = 'Admin';
      break;
    case 2:
      response.role = 'Writer';
      break;
    case 3:
      response.role = 'Viewer';
      break;
    default:
  }

  response.name = !response.name ? 'User' : response.name;

  const dpLocation = '/assets/images/dp/';

  if (response.dpurl) {
    response.dpurl = `${dpLocation}${response.dpurl}`;
  } else {
    let defaultProfilePhotoUrl = '';
    switch (response.gender) {
      case 'Male':
        defaultProfilePhotoUrl = `${dpLocation}avatar_male.jpg`;
        break;
      case 'Female':
        defaultProfilePhotoUrl = `${dpLocation}avatar_female.jpg`;
        break;
      default:
        defaultProfilePhotoUrl = `${dpLocation}avatar_default.jpg`;
    }

    response.dpurl = defaultProfilePhotoUrl;
  }

  // eslint-disable-next-line consistent-return
  return response;
}