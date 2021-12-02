import React, { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import './App.css';
import DanceRoom from "./utils/DanceRoom.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  
  const [allDances, setAllDances] = useState([]);
  const [allmyShakes, setAllmyShakes] = useState([]);
  const [song, setSong] = useState('');
  const [message, setMessage] = useState(''); 
  const contractAddress = "0x7b5e0adB1c65812e8DeA7ED6daDFe4B5B29055d1";

  const getAllDances = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider
        const signer = provider.getSigner();
        const danceContract = new ethers.Contract(contractAddress, DanceRoom.abi, signer);

        const shakes = await danceContract.getAllDances();

        let shakesCleaned = [];
        shakes.forEach(shake => {
          shakesCleaned.push({
            address: shake.shaker,
            timestamp: new Date(shake.timestamp * 1000),
            song: shake.song
          });
        });
    
        setAllDances(shakesCleaned);

        danceContract.on("abc", (from, timestamp, song) => {
          console.log("abc", from, timestamp, song);

          setAllDances(prevState =>[...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            song: song
          }]);
        });

        let myShakesCleaned = [];
        shakes.forEach(myShakes => {
          myShakesCleaned.push({
            address: shake.shaker,
            message: myShakes.message,
            xmyShakes: myShakes.xmyShakes
          });
        });

        setAllmyShakes(myShakesCleaned);

        danceContract.on("xyz", (from, message, xmyShakes) => {
          console.log("xyz", from, message, xmyShakes);

          setAllmyShakes(prevState => [...prevState, {
            address: from,  
            message: message,
            xmyShakes: xmyShakes
          }]);
      });


      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
    console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        const shakes = await danceContract.getAllDances();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const shake = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const danceContract = new ethers.Contract(contractAddress, DanceRoom.abi, signer);
        setSong(song);

        let count = await danceContract.getTotalDances();
        console.log("Retrieved total dance count...", count.toNumber());

        const shakeTxn = await danceContract.shake(song, { gasLimit: 300000 });
        console.log("Mining...", shakeTxn.hash);

        await shakeTxn.wait(song);
        console.log("Mined -- ", shakeTxn.hash);
        
        count = await danceContract.getTotalDances();
        console.log("Retrieved total dance count...", count.toNumber());        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}
  
  const myShakes = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const danceContract = new ethers.Contract(contractAddress, DanceRoom.abi, signer);
        setMessage(message);

        let mcount = await danceContract.getTotalDances();
        console.log("Retrieved total dance count...", mcount.toNumber());
        
        const mshakesTxn = await danceContract.myShakes();
        console.log("Mining...", mshakesTxn.hash);

        await mshakesTxn.wait();
        console.log("Mined -- ", mshakesTxn.hash);

        mcount = await danceContract.getTotalDances();
        console.log("Retrieved total dance count...", mcount.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}
  


  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
  let danceContract;// = new ethers.Contract(contractAddress, DanceRoom.abi, signer);

  const onabc = (from, timestamp, song) => {
    console.log('abc', from, timestamp, song);
    setAllDances(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        song: song,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    danceContract = new ethers.Contract(contractAddress, DanceRoom.abi, signer);
    danceContract.on('abc',onabc);
  }

  return () => {
    if (danceContract) {
      danceContract.off('abc', onabc);
    }
  };
}, []);

  useEffect(() => {
  let danceContract;// = new ethers.Contract(contractAddress, DanceRoom.abi, signer);
  
  const onxyz = (from, message, xmyShakes) => {
    console.log('xyz', from, message, xmyShakes);
    setAllmyShakes(prevState => [
      ...prevState,
      {
        address: from,
        message: message,
        myShake: xmyShakes,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    danceContract = new ethers.Contract(contractAddress, DanceRoom.abi, signer);
    danceContract.on('xyz', onxyz);
  }

        
  return () => {
    if (danceContract) {
      danceContract.off('xyz', onxyz);
    }
  };
}, []);


  
  return (
    
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        Hey there!
        
        <div className = "nyan"> </div>
        </div>

          

        <div className="bio">
        I am Ian a Brazilian dude that's love learning new stuff!<br />
        Today I'm show you my Dance Room!<br /> Connect your Ethereum wallet and shake your body!
        <br />
        <p> </p>
        </div>
        

        <input onChange={e => setSong(e.target.value)} value={song} />

        <button className="shakeButton" onClick={shake}>
          Shake on the Dance floor!
        </button>

        <button className="myShakesButton" onClick={myShakes}>
          Check your shakes!
        </button>

        {!currentAccount && (
          <button className="shakeveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allDances.map((shake, index) => {
          return (
            <div key={index} style={{ backgroundColor: "Black", marginTop: "16px", padding: "10px" }}>
              <div>Address: {shake.address}</div>
              <div>Time: {shake.timestamp.toString()}</div>
              <div>Song: {shake.song}</div>
            </div>)
        })}

        {allmyShakes.map((myShakes, index) => {
        return (
          <div key={index} style={{ backgroundColor: "Green", marginTop: "19px", padding: "9px" }}>
            <div>Address: {myShakes.address}</div>
            <div>Message: {myShakes.message}</div>
            <div>MyShakes: {myShakes.xmyShakes * 1}</div>
          </div>)
        })}
        
                
        <div className="Leaderboards">
        Leaderboards
        </div>
        
      </div>
    </div>
  );
}

export default App