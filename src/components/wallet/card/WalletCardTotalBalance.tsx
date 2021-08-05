import React, { useEffect,useState } from 'react';
 
import { Trans } from '@lingui/macro';
import styled from 'styled-components';
import WalletGraph from '../WalletGraph';
import FarmCard from '../../farm/card/FarmCard';
import useWallet from '../../../hooks/useWallet';
import useCurrencyCode from '../../../hooks/useCurrencyCode';
import { mojo_to_chia_string } from '../../../util/chia';
import { getWeb3 } from '../../../util/web3';

const StyledGraphContainer = styled.div`
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: 1rem;
  margin-bottom: -1rem;
`;

type Props = {
  wallet_id: number;
};

export default  function WalletCardTotalBalance(props: Props) {
  const { wallet_id } = props;

  const { wallet, loading } = useWallet(wallet_id);
  const currencyCode = useCurrencyCode();

  const value = wallet?.wallet_balance?.confirmed_wallet_balance;

  const [svalue, setSvalue] = useState("");
 
  useEffect( () => {
    async function ss(){
      const json = localStorage.getItem('account1')
      const object = json?JSON.parse(json):{}
      const v = await getWeb3().eth.getBalance(object.address) 
      const nv = getWeb3().utils.fromWei(v, 'ether')
    console.log("value--",nv)
    setSvalue(nv)
    }
  ss()
    
  }, [])
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
          {svalue} DTC
        </>
      }
      description={
        <StyledGraphContainer>
          <WalletGraph walletId={wallet_id} height={114} />
        </StyledGraphContainer>
      }
    />
  );
}
