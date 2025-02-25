import React, { DragEvent, useState, useEffect } from 'react';
import { push } from 'connected-react-router';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';
import {
  Box,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  TextField,
  TextareaAutosize
} from '@material-ui/core';
import {
  ButtonSelected,
  CardStep,
  Loading,
  AlertDialog
} from '@chia/core';
import useOpenDialog from '../../hooks/useOpenDialog';

import { ArrowBackIos as ArrowBackIosIcon, FlashAutoOutlined } from '@material-ui/icons';
import useSelectFile from '../../hooks/useSelectDirectoryFile';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Flex, Link } from '@chia/core';
import LayoutLoading from '../layout/LayoutLoading';
import {
  add_new_key_action,
  add_and_restore_from_backup,
  login_and_skip_action,
  get_backup_info_action,
  log_in_and_import_backup_action,
} from '../../modules/message';
import {
  changeBackupView,
  presentMain,
  presentBackupInfo,
  setBackupInfo,
  selectFilePath,
} from '../../modules/backup';
import { unix_to_short_date } from '../../util/utils';
import { getWeb3 } from '../../util/web3';
import type { RootState } from '../../modules/rootReducer';
import Wallet from '../../types/Wallet';
import myStyle from '../../constants/style';
import LayoutHero from '../layout/LayoutHero';
import fs from 'fs';
import FarmLastAttemptedProof from '../farm/FarmLastAttemptedProof';
import { trTR } from '@material-ui/core/locale';

const StyledDropPaper = styled(Paper)`
  background-color: ${({ theme }) =>
    theme.palette.type === 'dark' ? '#424242' : '#F0F0F0'};
  height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function WalletHeader() {
  const classes = myStyle();

  return (
    <Box display="flex" style={{ minWidth: '100%' }}>
      <Box className={classes.column_three} flexGrow={1}>
        <Typography variant="subtitle2"> id</Typography>
      </Box>
      <Box className={classes.column_three} flexGrow={1}>
        <div className={classes.align_center}>
          {' '}
          <Typography variant="subtitle2"> name</Typography>
        </div>
      </Box>
      <Box className={classes.column_three} flexGrow={1}>
        <div className={classes.align_right}>
          {' '}
          <Typography variant="subtitle2"> type</Typography>
        </div>
      </Box>
    </Box>
  );
}

type WalletRowProps = {
  wallet: Wallet;
};

function WalletRow(props: WalletRowProps) {
  const {
    wallet: {
      id,
      name,
      // @ts-ignore
      type_name: type,
    },
  } = props;
  const classes = myStyle();

  return (
    <Box display="flex" style={{ minWidth: '100%' }}>
      <Box className={classes.column_three} flexGrow={1}>
        {id}
      </Box>
      <Box className={classes.column_three} flexGrow={1}>
        <div className={classes.align_center}> {name}</div>
      </Box>
      <Box className={classes.column_three} flexGrow={1}>
        <div className={classes.align_right}> {type}</div>
      </Box>
    </Box>
  );
}

function UIPart() {
  const dispatch = useDispatch();
  const selectDirectory = useSelectFile();
  const classes = myStyle();
  let password_input = null
  let keystore_input = null
  const openDialog = useOpenDialog();
  const [hasWorkspaceLocation, setHasWorkspaceLocation] = useState(false)
  const [locationPath, setLocationPath] = useState("")
  const [loadingStatus, setloadingStatus] = useState(false)
  let mstatus = false
  useEffect(() => {
    if (!mstatus) {
      setHasWorkspaceLocation(mstatus)
    }
  }, [mstatus]);

  let words = useSelector(
    (state: RootState) => state.mnemonic_state.mnemonic_input,
  );
  const fingerprint = useSelector(
    (state: RootState) => state.wallet_state.selected_fingerprint,
  );

  words.forEach((word) => {
    if (word === '') {
      // @ts-ignore
      words = null;
    }
  });

  async function handleSelect() {
    const location = await selectDirectory();
    if (location) {
      console.log("location", location)
      setHasWorkspaceLocation(true)
      setLocationPath(location)
    }
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function handleImport() {
    // console.log(12222)
    // if (fingerprint !== null) {
    // dispatch(login_and_skip_action(fingerprint));
    // } else if (words !== null) {
    //   dispatch(add_new_key_action(words));
    // }

    let check = false
    let password = password_input.value
    let keystore = keystore_input.value
    if (!keystore) {
      openDialog(<AlertDialog> <Trans>Please input keystore</Trans></AlertDialog>);
      return
    }
    if (!password) {
      openDialog(<AlertDialog> <Trans>Please input password</Trans></AlertDialog>);
      return
    }
    setloadingStatus(true)
    // fs.readFile(locationPath, 'utf8', async (err, data) => {
    // if (err) {
    //   openDialog(<AlertDialog>{err}</AlertDialog>);
    // }
    await sleep(3000)
    let account
    try {
      account = await getWeb3().eth.accounts.decrypt(keystore, password)

    } catch (e) {
      openDialog(<AlertDialog>{e.message}</AlertDialog>)
      setloadingStatus(false)
      return

    }
    console.log("locationPath---", account);
    //设置为当前账户
    localStorage.setItem('accountNow', JSON.stringify(account))
    //同时推入数组
    let arr = localStorage.getItem('accountList')
    if (!arr) {
      let arrList = [account]
      localStorage.setItem('accountList', JSON.stringify(arrList))
    } else {
      let arrObject = JSON.parse(arr)

      for (let a = 0; a < arrObject.length; a++) {
        let item = arrObject[a]
        if (item.address === account.address) {
          check = true
        }
      }
      if (!check) {
        arrObject.unshift(account)
      } else {
        openDialog(<AlertDialog>账户已存在，请勿重复导入</AlertDialog>)
      }

      localStorage.setItem('accountList', JSON.stringify(arrObject))
    }
    setloadingStatus(false)
    if (!check) {
      dispatch(push('/wallet/add'));
    }

    // console.log('account--test1-localStorage-', localStorage.getItem('account1'))
    // this.importInfo.alert = {
    //   content: this.$t('page_home.msg_info.imported_success'),
    //   type: 'success'
    // }
    // })


  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file_path = e.dataTransfer.files[0].path;
    console.log(123);
    fs.readFile(file_path, 'utf8', (err, data) => {
      if (err) {
        console.log("err--", err);
        // this.$message.error(this.$t('page_home.msg_info.error')+':' + err)
      }
      console.log("privateKey---", data);
      const account1 = getWeb3().eth.accounts.privateKeyToAccount(data)

      localStorage.setItem('accountNow', JSON.stringify(account1))
      console.log('account--test1-localStorage-', localStorage.getItem('account1'))
      // this.importInfo.alert = {
      //   content: this.$t('page_home.msg_info.imported_success'),
      //   type: 'success'
      // }
    })
    // 
    // if (fingerprint !== null) {
    //   dispatch(get_backup_info_action(file_path, fingerprint, null));
    // } else if (words !== null) {
    //   dispatch(get_backup_info_action(file_path, null, words));
    // }
  };

  return (

    <LayoutHero
      header={
        <Link to="/">
          <ArrowBackIosIcon fontSize="large" color="secondary" />
        </Link>
      }
    >
      {loadingStatus ? (<LayoutLoading> <Trans>Keystore Importing</Trans></LayoutLoading>) : (<Container maxWidth="lg">
        <Flex flexDirection="column" gap={3} alignItems="center">
          <Typography variant="h5" component="h1" gutterBottom>
            <Trans>
              Import your keystore and password
            </Trans>
          </Typography>

          {/* <StyledDropPaper
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDragEnter={(e) => handleDragEnter(e)}
            onDragLeave={(e) => handleDragLeave(e)}
          >
            <Typography variant="subtitle1">
              <Trans>Drag and drop your backup file</Trans>
            </Typography>
          </StyledDropPaper> */}
          {/* <CardStep step="1" title={<Trans>Select Keystore Directory</Trans>}>
            <Typography variant="subtitle1">
              <Trans>
                Select Keystore File Path Is {locationPath}
              </Trans>
            </Typography>

            <Flex gap={2}>

              <ButtonSelected
                onClick={handleSelect}
                size="large"
                variant="outlined"
                selected={hasWorkspaceLocation}
                nowrap
              >
                {hasWorkspaceLocation ? (
                  <Trans>Selected</Trans>
                ) : (
                  <Trans>Browse</Trans>
                )}
              </ButtonSelected>
            </Flex>



          </CardStep> */}

          <Container maxWidth="xs">
            <TextField
              fullWidth
              id="filled-multiline-static"
              required
              multiline
              rows={4}
              inputRef={(input) => {
                keystore_input = input;
              }}
              label={<Trans>Keystore</Trans>}
              variant="filled"
            />
          </Container>
          <Container maxWidth="xs">

            <TextField
              fullWidth
              name="workspaceLocation"
              variant="filled"
              inputRef={(input) => {
                password_input = input;
              }}
              type="password"
              label={<Trans>Keystore Password</Trans>}
              required
            />
            <Button
              onClick={handleImport}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              <Trans>Import</Trans>
            </Button>

          </Container>
        </Flex>
      </Container>)}

    </LayoutHero>
  );
}

function BackupDetails() {
  const history = useHistory();
  const classes = myStyle();
  const dispatch = useDispatch();
  const file_path = useSelector(
    (state: RootState) => state.backup_state.selected_file_path,
  );
  const backupInfo = useSelector(
    (state: RootState) => state.backup_state.backup_info,
  );
  const selected_file_path = useSelector(
    (state: RootState) => state.backup_state.selected_file_path,
  );

  const {
    timestamp,
    version,
    wallets,
    downloaded,
    backup_host: host,
    fingerprint: backup_fingerprint,
  } = backupInfo;

  const date = unix_to_short_date(timestamp);

  let words = useSelector(
    (state: RootState) => state.mnemonic_state.mnemonic_input,
  );
  const fingerprint = useSelector(
    (state: RootState) => state.wallet_state.selected_fingerprint,
  );

  words.forEach((word) => {
    if (word === '') {
      // @ts-ignore
      words = null;
    }
  });

  function handleGoBack() {
    dispatch(changeBackupView(presentMain));
    history.push('/');
  }

  function goBackBackup() {
    dispatch(changeBackupView(presentMain));
    dispatch(setBackupInfo({}));
    // @ts-ignore
    dispatch(selectFilePath(null));
  }

  function next() {
    if (fingerprint !== null) {
      dispatch(log_in_and_import_backup_action(fingerprint, file_path));
    } else if (words !== null) {
      dispatch(add_and_restore_from_backup(words, file_path));
    }
  }

  return (
    <div className={classes.root}>
      <ArrowBackIosIcon onClick={handleGoBack} className={classes.navigator}>
        {' '}
      </ArrowBackIosIcon>
      <div className={classes.grid_wrap}>
        <Container className={classes.grid} maxWidth="lg">
          <Typography className={classes.title} component="h4" variant="h4">
            Restore From Backup
          </Typography>
        </Container>
      </div>
      <div className={classes.dragContainer}>
        <Paper
          className={classes.drag}
          style={{
            position: 'relative',
            width: '80%',
            margin: 'auto',
            padding: '20px',
          }}
        >
          <Box
            display="flex"
            onClick={goBackBackup}
            style={{ cursor: 'pointer', minWidth: '100%' }}
          >
            <Box>
              {' '}
              <ArrowBackIosIcon
                style={{ cursor: 'pointer' }}
                onClick={goBackBackup}
              />
            </Box>
            <Box className={classes.align_left} flexGrow={1}>
              <Typography variant="subtitle2">Import Backup File</Typography>
            </Box>
          </Box>
          <Grid container spacing={3} style={{ marginBottom: 10 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Backup info:</Typography>
              <Box display="flex" style={{ minWidth: '100%' }}>
                <Box flexGrow={1}>Date: </Box>
                <Box className={classes.align_right} flexGrow={1}>
                  {date}
                </Box>
              </Box>
              <Box display="flex" style={{ minWidth: '100%' }}>
                <Box flexGrow={1}>Version: </Box>
                <Box className={classes.align_right} flexGrow={1}>
                  {version}
                </Box>
              </Box>
              <Box display="flex" style={{ minWidth: '100%' }}>
                <Box flexGrow={1}>Fingerprint: </Box>
                <Box className={classes.align_right} flexGrow={1}>
                  {backup_fingerprint}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" style={{ minWidth: '100%' }}>
                <Box flexGrow={1}>Downloaded: </Box>
                <Box className={classes.align_right} flexGrow={1}>
                  {`${downloaded}`}
                </Box>
              </Box>
              <Box display="flex" style={{ minWidth: '100%' }}>
                <Box flexGrow={1}>
                  {downloaded ? 'Backup Host:' : 'File Path'}
                </Box>
                <Box className={classes.align_right} flexGrow={1}>
                  {downloaded ? host : selected_file_path}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="subtitle1">Smart wallets</Typography>
          <WalletHeader />
          {!!wallets &&
            wallets.map((wallet: Wallet) => <WalletRow wallet={wallet} />)}
        </Paper>
      </div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Button
            onClick={next}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Continue
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default function RestoreBackup() {
  const view = useSelector((state: RootState) => state.backup_state.view);
  // if (view === presentBackupInfo) {
  //   return <BackupDetails />;
  // }
  return <UIPart />;
}

