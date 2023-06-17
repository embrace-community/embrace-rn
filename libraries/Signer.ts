import React, { useCallback, useMemo, useState } from 'react';
import { getAccountPrivateKey } from './Account';
import { ethers } from 'ethers';
import {
  CHAIN_ID,
  RPC_URL_LOCALHOST,
  RPC_URL_MUMBAI,
} from 'react-native-dotenv';

export async function getSigner() {
  const privateKey: string | boolean = await getAccountPrivateKey();

  if (!privateKey) {
    console.log('useSigner: No privateKey found');
    return;
  }

  const url = getRpcUrl();

  const provider = new ethers.providers.JsonRpcProvider(url);
  const signer = new ethers.Wallet(privateKey, provider);

  return signer;
}

function getRpcUrl() {
  switch (CHAIN_ID) {
    case '1337':
      return RPC_URL_LOCALHOST;

    case '80001':
      return RPC_URL_MUMBAI;

    default:
      return RPC_URL_LOCALHOST;
  }
}
