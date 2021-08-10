import React, { ReactNode } from 'react';
import exec from 'child_process';  
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { Trans } from '@lingui/macro';
import { ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { Flex } from '@chia/core';
import { createPlotNFT } from '../../modules/plotNFT';
import PlotNFTState from '../../constants/PlotNFTState';
import useUnconfirmedPlotNFTs from '../../hooks/useUnconfirmedPlotNFTs';
import PlotNFTSelectPool, { SubmitData } from './select/PlotNFTSelectPool';

type Props = {
  headerTag?: ReactNode;
};

export default function PlotNFTAdd(props: Props) {
  const { headerTag: HeaderTag } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const unconfirmedNFTs = useUnconfirmedPlotNFTs();

  async function handleSubmit() {
    // const {
    //   fee,
    //   initialTargetState,
    //   initialTargetState: { state },
    // } = data;
    // const { success, transaction } = await dispatch(
    //   createPlotNFT(initialTargetState, fee),
    // );
    // if (success) {
    //   unconfirmedNFTs.add({
    //     transactionId: transaction.name,
    //     state:
    //       state === 'SELF_POOLING'
    //         ? PlotNFTState.SELF_POOLING
    //         : PlotNFTState.FARMING_TO_POOL,
    //     poolUrl: initialTargetState.pool_url,
    //   });

     
    // }
    console.log("dort-pool")
    // fetch获取矿池地址
    let res = await fetch('http://127.0.0.1:9000/pool?version=v1');
    let data = await res.json();

    let wallet =  localStorage.getItem('accountNow')
    let walletJson = wallet?JSON.parse(wallet):{}
    if(wallet){
      window.ipcRenderer?.send('dort-pool', {status:"start",pool:data.pool,wallet:walletJson.address});
    }

    // exec.exec(`./dortpool.bat 8.210.193.17:8008 0x5C90B95AEc4C4844e86A372092AbBb3C113Ea932`, (error, stdout, stderr)=>{ 
    //   if ( !error ) {
    //     console.log("dortpool.bat stdout", stdout);
    //   } else {
    //     console.log("dortpool.bat error", error);
    //   }
    // });
    history.push('/dashboard/pool');
  }

  return (
    <>
      {HeaderTag && (
        <HeaderTag>
          <Flex alignItems="center">
            <ChevronRightIcon color="secondary" />
            <Trans>Add a Plot NFT</Trans>
          </Flex>
        </HeaderTag>
      )}
      <PlotNFTSelectPool
        onSubmit={handleSubmit}
        title={<Trans>Want to Join a Pool? Create a Plot NFT</Trans>}
        description={
          <Trans>
            Join a pool and get consistent XCH farming rewards. The average
            returns are the same, but it is much less volatile. Assign plots to
            a plot NFT. You can easily switch pools without having to re-plot.
          </Trans>
        }
      />
    </>
  );
}

PlotNFTAdd.defaultProps = {
  step: undefined,
  onCancel: undefined,
};
