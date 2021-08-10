import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { Trans } from '@lingui/macro';
import { useHistory } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { CardHero } from '@chia/core';
import { Pool as PoolIcon } from '@chia/icons';

const StyledPoolIcon = styled(PoolIcon)`
  font-size: 4rem;
`;

export default function PoolHero() {

  const [minerstatus, setMinerstatus] = useState("stop")
  let mstatus = localStorage.getItem('minerstatus')
  let wallet = localStorage.getItem('accountNow')
  let walletJson = wallet ? JSON.parse(wallet) : {}
  let address = ""
  if(wallet){
    address=walletJson.address
  }
  window.ipcRenderer?.on("mine-change", function (event, arg) {
    console.log("mine-change event", event);
    console.log("mine-change arg", arg);
    if (arg === "starttrue") {
      localStorage.setItem('minerstatus', "start")
      setMinerstatus("start")
    }
    if (arg === "stoptrue") {
      setMinerstatus("stop")
      localStorage.setItem('minerstatus', "stop")
    }
  });
 
  useEffect(() => {

    if (mstatus && (mstatus === "stop" || mstatus === "start")) {
      setMinerstatus(mstatus)
    }
  }, [mstatus]);

  async function handleJoinPool() {
    // history.push('/dashboard/pool/add');
    let res = await fetch('http://127.0.0.1:9000/pool?version=v1');
    let data = await res.json();


    if (wallet) {
      window.ipcRenderer?.send('dort-pool', { status: "start", pool: data.pool, wallet: walletJson.address });

    }
  }
  function handleLeavePool() {
    // history.push('/dashboard/pool/add');

    window.ipcRenderer?.send('dort-pool', { status: "stop" });

  }

  return (
    <Grid container>
      <Grid xs={12} md={6} lg={5} item>
        {minerstatus && minerstatus === "stop" ? (
          <CardHero>
            <StyledPoolIcon color="primary" />
            <Typography variant="body1">
              <Trans>
              {address} Smooth out your DTC farming rewards by joining a pool.
              </Trans>
            </Typography>
            <Button onClick={handleJoinPool} variant="contained" color="primary">
              <Trans>Start Dort Pool Mine</Trans>
            </Button>

          </CardHero>

        ) : (
          <CardHero>
            <StyledPoolIcon color="primary" />
            <Typography variant="body1">
              <Trans>
                {address} Mining in the Dort Pool
              </Trans>
            </Typography>
            <Button onClick={handleLeavePool} variant="contained" color="secondary">
              <Trans>Stop Dort Pool Mine</Trans>
            </Button>

          </CardHero>

        )}
      </Grid>
    </Grid>
  );
}
 
