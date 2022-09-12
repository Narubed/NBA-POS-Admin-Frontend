function OwnerName({ ownerId, isOwners }) {
  const findOwners = isOwners.find((item) => item._id === ownerId);
  return <div>{findOwners?.owner_name}</div>;
}

export default OwnerName;
