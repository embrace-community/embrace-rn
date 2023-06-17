export async function updateProfile(polybase: any, localProfile: any) {
  const profileCollection = await getProfileCollection(polybase);

  // TODO: We should use the account address as the profile ID instead of the handle
  const pbProfile = await profileCollection.record(localProfile.handle).get();

  if (pbProfile.exists()) {
    const updateData = [localProfile.displayName, localProfile.metadataUri];

    if (localProfile.avatarUri?.length) {
      updateData.push(localProfile.avatarUri);
    }

    pbProfile
      .call('update', updateData)
      .then(() => {
        console.log(
          'Profile updated in Polybase',
          localProfile.handle,
          updateData,
        );
      })
      .catch((err: string) => {
        console.log('ERROR UPDATING PROFILE IN POLYBASE', err);
      });
  } else {
    const newProfile = profileCollection.create([
      localProfile.handle,
      localProfile.displayName,
      localProfile.metadataUri,
      localProfile.avatarUri,
    ]);

    console.log('Profile created in Polybase', newProfile);
  }
}

export async function setTokenId(
  polybase: any,
  handle: string,
  tokenId: number,
) {
  const profileCollection = await getProfileCollection(polybase);

  const pbProfile = await profileCollection.record(handle).get();

  // Profile should exist before setting the tokenId
  if (pbProfile.exists()) {
    pbProfile
      .call('setTokenId', [tokenId])
      .then(() => {
        console.log('Token ID set in Polybase', handle, tokenId);
      })
      .catch((err: string) => {
        console.log('ERROR SETTING TOKEN ID IN POLYBASE', err);
      });
  }
}

async function getProfileCollection(polybase: any) {
  return polybase.collection('Profile');
}
