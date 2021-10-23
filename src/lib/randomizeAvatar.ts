const randomizeAvatar = () => {
  const avatars = [
    "https://res.cloudinary.com/dyytoyiwr/image/upload/v1634981115/breezeStories/defaultAvatars/orange_uchgab.png",
    "https://res.cloudinary.com/dyytoyiwr/image/upload/v1634981115/breezeStories/defaultAvatars/pink_e1f8ws.png",
    "https://res.cloudinary.com/dyytoyiwr/image/upload/v1634981115/breezeStories/defaultAvatars/blue_v3pyhe.png",
    "https://res.cloudinary.com/dyytoyiwr/image/upload/v1634981115/breezeStories/defaultAvatars/red_mhy3hl.png",
  ];

  return avatars[Math.floor(Math.random() * avatars.length)];
};

export default randomizeAvatar;
