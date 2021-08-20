import React,{useState,useEffect} from 'react';
import { Trans } from '@lingui/macro';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, ConfirmDialog, Flex, Logo,AlertDialog} from '@chia/core';
import { Alert } from '@material-ui/lab';
import {
  Card,
  Typography,
  Container,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons';
import LayoutHero from '../layout/LayoutHero';
import {
  login_action,
  delete_key,
  get_private_key,
  delete_all_keys,
  check_delete_key_action
} from '../../modules/message';
import { resetMnemonic } from '../../modules/mnemonic';
import type { RootState } from '../../modules/rootReducer';
import type Fingerprint from '../../types/Fingerprint';
import useOpenDialog from '../../hooks/useOpenDialog';
import { openProgress, closeProgress } from '../../modules/progress';

const StyledFingerprintListItem = styled(ListItem)`
  padding-right: ${({ theme }) => `${theme.spacing(11)}px`};
`;

export default function SelectKey() {
  const dispatch = useDispatch();
  const openDialog = useOpenDialog();
  const publicKeyFingerprintsAll = useSelector(
    (state: RootState) => state.wallet_state.public_key_fingerprints,
  );
  console.log("publicKeyFingerprints",publicKeyFingerprintsAll)
  const hasFingerprints =
  publicKeyFingerprintsAll && !!publicKeyFingerprintsAll.length;
  let publicKeyFingerprints =[]
  // let publicKeyFingerprintsNew =[]
  // if(hasFingerprints){
  //   publicKeyFingerprintsNew.push(publicKeyFingerprints[0])
  // }
  // const [keysArrAll, setKeysArrAll] = useState([])
  // const [hasFingerprintsAll, setHasFingerprintsAll] = useState(false)
  const keys = localStorage.getItem("accountList")
  const keysArr = keys?JSON.parse(keys):[]
  if(hasFingerprints){
    for(let i=0;i<keysArr.length;i++){
      publicKeyFingerprints.push({
        fingerprint:publicKeyFingerprintsAll[i],
        account:keysArr[i]
      })
    }
  }
  
  // useEffect(() => {
  //   if (keysArr) {
  //     setKeysArrAll(keysArr)
  //   }
  //   setHasFingerprintsAll(hasFingerprints)
  // }, [keysArr,hasFingerprints]);
  async function handleClick(data) {
    let currentAccount = localStorage.getItem("accountNow")
    let currentAccountObj = currentAccount?JSON.parse(currentAccount):{}
    let minerStatus =  localStorage.getItem('minerstatus')
    if(currentAccount&&currentAccountObj.address&& data.account&&data.account.address&&currentAccountObj.address ==data.account.address&&minerStatus&&minerStatus=="start"){
      window.ipcRenderer?.send('dort-pool', { status: "stop" });
      localStorage.setItem('minerstatus', "stop")
      openDialog(<AlertDialog> <Trans>切换钱包地址，已停止矿池耕作挖矿</Trans></AlertDialog>);
    }

    localStorage.setItem("accountNow",JSON.stringify(data.account)) 
    await dispatch(resetMnemonic());
    await dispatch(login_action(data.fingerprint));
  }

  function handleShowKey(fingerprint: Fingerprint) {
    dispatch(get_private_key(fingerprint));
  }

  async function handleDeletePrivateKey(data) {

    dispatch(openProgress());
    const response: any = await dispatch(check_delete_key_action(data.fingerprint));
    dispatch(closeProgress());
    // console.log("newarr",data)
    localStorage.removeItem("accountNow")

    let arr = localStorage.getItem('accountList')
        if(arr){
          let newarr =[]
          let arrObject = JSON.parse(arr)
          for(let a =0;a<arrObject.length;a++){
            let item = arrObject[a]
            if(item.address!==data.account.address){
              newarr.push(item)
            }
          }
          localStorage.setItem('accountList', JSON.stringify(newarr))
          // setKeysArrAll(newarr)
        }

    const deletePrivateKey = await openDialog(
      <ConfirmDialog
        title={<Trans>Delete key {data.fingerprint}</Trans>}
        confirmTitle={<Trans>Delete</Trans>}
        cancelTitle={<Trans>Back</Trans>}
        confirmColor="danger"
      >
        {response.used_for_farmer_rewards && (<Alert severity="warning">
          <Trans>
            Warning: This key is used for your farming rewards address. 
            By deleting this key you may lose access to any future farming rewards
            </Trans>
        </Alert>)}

        {response.used_for_pool_rewards && (<Alert severity="warning">
          <Trans>
            Warning: This key is used for your pool rewards address. 
            By deleting this key you may lose access to any future pool rewards
          </Trans>
        </Alert>)}

        {response.wallet_balance && (<Alert severity="warning">
          <Trans>
            Warning: This key is used for a wallet that may have a non-zero balance. 
            By deleting this key you may lose access to this wallet
          </Trans>
        </Alert>)}

        <Trans>
          Deleting the key will permanently remove the key from your computer,
          make sure you have backups. Are you sure you want to continue?
        </Trans>
      </ConfirmDialog>,
    );

    // @ts-ignore
    if (deletePrivateKey) {
      dispatch(delete_key(data.fingerprint));
    }
  }

  async function handleDeleteAllKeys() {
    localStorage.removeItem("accountNow")
    localStorage.removeItem("accountList")
    const deleteAllKeys = await openDialog(
      <ConfirmDialog
        title={<Trans>Delete all keys</Trans>}
        confirmTitle={<Trans>Delete</Trans>}
        cancelTitle={<Trans>Back</Trans>}
        confirmColor="danger"
      >
        <Trans>
          Deleting all keys will permanently remove the keys from your computer,
          make sure you have backups. Are you sure you want to continue?
        </Trans>
      </ConfirmDialog>,
    );

    // @ts-ignore
    if (deleteAllKeys) {
      dispatch(delete_all_keys());
    }
  }

  return (
    <LayoutHero>
      <Container maxWidth="xs">
        <Flex flexDirection="column" alignItems="center" gap={3}>
          <Logo width={130} />
          {hasFingerprints ? (
            <Typography variant="h5" component="h1" gutterBottom>
              <Trans>Select Key</Trans>
            </Typography>
          ) : (
            <>
              <Typography variant="h5" component="h1" gutterBottom>
                <Trans>Sign In</Trans>
              </Typography>
              <Typography variant="subtitle1">
                <Trans>
                  Welcome to Dort. Please log in with an existing key, or create
                  a new key.
                </Trans>
              </Typography>
            </>
          )}
          <Flex
            flexDirection="column"
            gap={3}
            alignItems="stretch"
            alignSelf="stretch"
          >
            {hasFingerprints && (
              <Card>
                <List>
                  {publicKeyFingerprints.map((data) => (
                    <StyledFingerprintListItem
                      onClick={() => handleClick(data)}
                      key={data.account.address}
                      button
                    >
                      <ListItemText
                        primary={
                          <Trans>
                            Wallet address {data.account.address.slice(0,30)+"..."}
                          </Trans>
                        }
                        secondary={
                          <Trans>Can be mining account</Trans>
                        }
                      />
                      <ListItemSecondaryAction>
                        {/* <Tooltip title={<Trans>See private key</Trans>}>
                          <IconButton
                            edge="end"
                            aria-label="show"
                            onClick={() => handleShowKey(fingerprint.address)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip
                          title={
                            <Trans>
                              DANGER: permanently delete private key
                            </Trans>
                          }
                        >
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeletePrivateKey(data)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </StyledFingerprintListItem>
                  ))}
                </List>
              </Card>
            )}
            <Button
              to="/wallet/restore"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              <Trans>Import Keystore</Trans>
            </Button>
            {/* <Button
              to="/wallet/restore"
              type="submit"
              variant="outlined"
              size="large"
              fullWidth
            >
              <Trans>Import from Mnemonics (24 words)</Trans>
            </Button> */}
            <Button
              onClick={handleDeleteAllKeys}
              variant="outlined"
              color="danger"
              size="large"
              fullWidth
            >
              <Trans>Delete all keys</Trans>
            </Button>
          </Flex>
        </Flex>
      </Container>
    </LayoutHero>
  );
}
