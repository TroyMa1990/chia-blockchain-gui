import Web3 from 'web3';
export  function getWeb3() {
  if (!window.web3) {
    window.web3 = new Web3('http://node.dort.pro');
  }
  return window.web3
}
 