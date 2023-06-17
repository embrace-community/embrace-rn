import getContract from '../Contracts';

export async function createProfile(handle: string, metadataUri: string) {
  const profileContract = await getProfileContract();

  profileContract.filters.ProfileCreated(null, null, null, null, null);

  const tx = await profileContract.createProfile(handle, metadataUri, {
    gasLimit: 1000000,
  });

  const outcome = await tx.wait();

  console.log('Outcome', outcome);
}

async function getProfileContract() {
  return await getContract('Profile');
}
