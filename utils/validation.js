function getRandomProfilePicture() {
    // Base directory path
    const basePath = 'uploads/profile/';
    
    const profilePictures = [
      'profile1.png',
      'profile2.png',
      'profile3.png',
      'profile4.png',
      'profile5.png',
      'profile6.png',
      'profile7.png',
      'profile8.png',
      'profile9.png',
      'profile10.png',
    ];
  
    const randomIndex = Math.floor(Math.random() * profilePictures.length);
  
    return basePath + profilePictures[randomIndex];
  }
  
  
  module.exports = getRandomProfilePicture;