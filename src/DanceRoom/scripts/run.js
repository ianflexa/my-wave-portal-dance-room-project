const main = async () => {
  const danceContractFactory = await hre.ethers.getContractFactory('DanceRoom');
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const danceContract = await danceContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await danceContract.deployed();
  console.log('Contract deployed to:', danceContract.address);
  console.log('Contract deployed by:', owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(danceContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));
  
      
  let danceCount;
  danceCount = await danceContract.getTotalDances();
  console.log(danceCount.toNumber());

  let mshakes;
  mshakes = await danceContract.myShakes();
  
  let shakeTxn = await danceContract.shake('Mister Lies - Lupine');
  await shakeTxn.wait();

  mshakes = await danceContract.myShakes();
 
  shakeTxn = await danceContract.shake('Daft Punk - Voyager');
  await shakeTxn.wait();
    
  mshakes = await danceContract.myShakes();

  shakeTxn = await danceContract.connect(randomPerson).shake('Flume - Warm Thoughts!');
  await shakeTxn.wait();
  
  mshakes = await danceContract.connect(randomPerson).myShakes();

  shakeTxn = await danceContract.connect(randomPerson).shake('Filipe Ret - Libertários não Morrem');
  await shakeTxn.wait();

  mshakes = await danceContract.connect(randomPerson).myShakes();

  let allDances = await danceContract.getAllDances();
  console.log(allDances);
  
  danceCount = await danceContract.getTotalDances();

  contractBalance = await hre.ethers.provider.getBalance(danceContract.address);
  console.log('Contract balance:',hre.ethers.utils.formatEther(contractBalance));
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
  
/*
  WavePortal == DanceRoom;
totalWaves == totalDances;
nWaves == nDances;
myWaves == myShakes
wave == shake;
getTotalWaves == getTotalDances
getAllWeves == getAllDances 

*/




