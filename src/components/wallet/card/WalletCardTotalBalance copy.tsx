import React from 'react';
import { Trans } from '@lingui/macro';
// import styled from 'styled-components';
// import WalletGraph from '../WalletGraph';
import FarmCard from '../../farm/card/FarmCard';
// import useWallet from '../../../hooks/useWallet';
// import useCurrencyCode from '../../../hooks/useCurrencyCode';
import { mojo_to_chia_string } from '../../../util/chia';
import { getWeb3 } from '../../../util/web3';

// const StyledGraphContainer = styled.div`
//   margin-left: -1rem;
//   margin-right: -1rem;
//   margin-top: 1rem;
//   margin-bottom: -1rem;
// `;

// type Props = {
//   wallet_id: number;
// };

export default async function WalletCardTotalBalance() {
  // const wallet_id  = 1;
  // const { wallet_id } = props;

  // const { wallet, loading } = useWallet(wallet_id);
  // const currencyCode = useCurrencyCode();

  // const value = getWeb3..;
  const json = localStorage.getItem('account1')
  const object = json?JSON.parse(json):{}
 
  let loading = false
  const value = await getWeb3().eth.getBalance(object.address) 
  console.log("value--",value)
  loading = true
  return (
    <FarmCard
      loading={loading}
      title={<Trans>Total Balance</Trans>}
      tooltip={
        <Trans>
          This is the total amount of Dortin the blockchain at the current peak
          sub block that is controlled by your private keys. It includes frozen
          farming rewards, but not pending incoming and outgoing transactions.
        </Trans>
      }
      value={
        <>
          {1} DTC
        </>
      }
      // description={
      //   <StyledGraphContainer>
      //     <WalletGraph walletId={wallet_id} height={114} />
      //   </StyledGraphContainer>
      // }
    />
  );
}
