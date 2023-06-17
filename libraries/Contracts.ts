import { getSigner } from './Signer';
import { Wallet, Contract } from 'ethers';
import { CONTRACT_ADDRESS_PROFILE } from 'react-native-dotenv';

import ProfileAbi from '../abi/Profile.json';

export type ContractName = 'Profile' | 'Community';

export default async function getContract(contractName: ContractName) {
  const signer: Wallet = await getSigner();

  const address = await signer.getAddress();

  if (!signer) return null;

  const contractInfo = await getContractInfo(contractName);

  const contract = new Contract(contractInfo.address, contractInfo.abi, signer);

  return contract;
}

async function getContractInfo(contractName: ContractName) {
  switch (contractName) {
    case 'Profile':
      return {
        address: CONTRACT_ADDRESS_PROFILE,
        abi: ProfileAbi,
      };

    default:
      return null;
  }
}
