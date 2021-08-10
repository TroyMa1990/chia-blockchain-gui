import React, { useState, useEffect } from 'react';
import isElectron from 'is-electron';
import styled from 'styled-components';
import { Trans } from '@lingui/macro';
import { useHistory } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { CardHero,AlertDialog } from '@chia/core';
import { Pool as PoolIcon } from '@chia/icons';
import useOpenDialog from '../../hooks/useOpenDialog';
import LayoutLoading from '../layout/LayoutLoading';
const StyledPoolIcon = styled(PoolIcon)`
  font-size: 4rem;
`;

export default function PoolHero() {

  const openDialog = useOpenDialog();
  const [minerstatus, setMinerstatus] = useState("stop")
  const [loadingStatus, setloadingStatus] = useState(false)
  let mstatus = localStorage.getItem('minerstatus')
 

  let wallet = localStorage.getItem('accountNow')
  let walletJson = wallet ? JSON.parse(wallet) : {}
  let address = ""
  if(wallet){
    address=walletJson.address
  }
  useEffect(() => {
  
    if (isElectron()) {

      // @ts-ignore
      window.ipcRenderer?.on("mine-change", function (event, arg) {

        if (arg === "starttrue") {
          localStorage.setItem('minerstatus', "start")
          setMinerstatus("start")
          openDialog(<AlertDialog> <Trans>加入矿池耕作挖矿成功，正在耕作挖矿中</Trans></AlertDialog>);
        }
        if (arg === "startfalse") {
          openDialog(<AlertDialog> <Trans>加入矿池耕作挖矿失败，请稍后重试</Trans></AlertDialog>);
        }
        if (arg === "stoptrue") {
          setMinerstatus("stop")
          localStorage.setItem('minerstatus', "stop")
          openDialog(<AlertDialog> <Trans>已停止矿池耕作挖矿</Trans></AlertDialog>);
        }
        if (arg === "stopfalse") {
          openDialog(<AlertDialog> <Trans>停止矿池耕作挖矿失败</Trans></AlertDialog>);
        }
      });
    }

}, []);

  useEffect(() => {
    mstatus = mstatus?mstatus:"stop"
    setMinerstatus(mstatus)
  }, [mstatus]);

  async function handleJoinPool() {
    setloadingStatus(true)
    let res 
    try{
      res = await fetch('http://api.dort.pro/pool?version=v1');
    }catch(e){
      openDialog(<AlertDialog> <Trans>加入矿池耕作挖矿出现异常</Trans></AlertDialog>);
      setloadingStatus(false)
      return
    }
    console.log("res--",res)
    if(!res.ok){
      openDialog(<AlertDialog> <Trans>加入矿池耕作挖矿出现异常</Trans></AlertDialog>);
      setloadingStatus(false)
      return
    }
    let data = res?await res.json():{};



    if (res) {
      window.ipcRenderer?.send('dort-pool', { status: "start", pool: data.pool, wallet: walletJson.address });
    }else{
      openDialog(<AlertDialog> <Trans>加入矿池耕作挖矿出现异常</Trans></AlertDialog>);
    }
    setloadingStatus(false)
  }
  async function handleLeavePool() {
    // history.push('/dashboard/pool/add');
    setloadingStatus(true)
    
    let res 
    try{
      res = await fetch('http://api.dort.pro/pool?version=v1');
    }catch(e){
      openDialog(<AlertDialog> <Trans>停止矿池耕作挖矿出现异常</Trans></AlertDialog>);
      setloadingStatus(false)
      return
    }
    console.log("res--",res)
    if(!res.ok){
      openDialog(<AlertDialog> <Trans>停止矿池出现异常</Trans></AlertDialog>);
      setloadingStatus(false)
      return
    }
    window.ipcRenderer?.send('dort-pool', { status: "stop" });
    setloadingStatus(false)
  }

  return (
    <Grid container>
      {loadingStatus?(<LayoutLoading> <Trans>正在执行中</Trans></LayoutLoading>):(
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
      )}
      
    </Grid>
  );
}
 
