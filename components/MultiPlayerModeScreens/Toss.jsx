import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState, useRef} from 'react';
import socket from '../context/socket';

import {DataContext} from '../context/Data';
import CustomButton from '../elements/CustomButton';

const Toss = ({roomId,disconnectMsg}) => {
  const opponentRef = useRef(null);

  const { setStep, tossResult, setTossResult,localRoomId,friendinfo,roomtype} = useContext(DataContext);

  const [message, setMessage] = useState('');
  const [tossStep, setTossStep] = useState('choose');
  const [loading, setloading] = useState(false);
  const [disablebtn,setdisablebtn] =useState(false);
  const playerWon  = tossResult==="Player1"?friendinfo?.host?.username: tossResult==="Player2" &&friendinfo?.joined?.username;

  // const processTossResult = (me, opponent) => {
  //   // setloading(true);
  //   // if (me === opponent.selection) {
  //   //   console.log('draw');
  //   // } else if (
  //   //   (me === 'stone' && opponent.selection === 'scissor') ||
  //   //   (me === 'paper' && opponent.selection === 'stone') ||
  //   //   (me === 'scissor' && opponent.selection === 'paper')
  //   // ) {
  //   //   socket.emit('tossResult', { roomId, winner: username });
  //   // } else {
  //   //   socket.emit('tossResult', { roomId, winner: opponent.username });
  //   // }

  //   // setloading(false);
  //   // setMessage('');
  //   setTossResult('Player2');
  // };

  const handleToss = () => {
    // myselection.current = selection;
    // socket.emit('toss', { roomId, selection });
    setloading(true);
    socket.emit('toss',localRoomId);
    // console.log(localRoomId);
    // setTossResult("Player2");
    // setTimeout(() => setStep('game'), 2000);
    
  };

  useEffect(() => {
    // socket.on('opponent', opponent => {
    //   if (!myselection.current) {
    //     opponentRef.current = opponent;
    //     console.log('Opponent responded first. Waiting for your choice...');
    //   } else {
    //     processTossResult(myselection.current, opponent);
    //   }
    // });

    socket.on('tossWinner', winner => {
      console.log(winner);
      setloading(false);
      setTossResult(winner);
      setTimeout(() => setStep('game'), 2000);
    });

    return () => {
      // socket.off('opponent');
      socket.off('tossWinner');
      // setSelection('');
      setTossResult('');
    };
  }, []);

  return (
    // <>
    //   {tossStep === 'choose' && (
    //     <>
    //       <Text style={styles.heading}>Choose One</Text>

    //       <View style={styles.choicesContainer}>
    //         <TouchableOpacity style={styles.button} onPress={() => setSelection('stone')}>
    //           <Image
    //             source={stone}
    //             style={[
    //               styles.image,
    //               {
    //                 borderColor: 'rgb(247, 152, 93)',
    //                 height: selection === 'stone' ? 90 : 80,
    //                 width: selection === 'stone' ? 90 : 80,
    //               },
    //             ]}
    //           />
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.button} onPress={() => setSelection('paper')}>
    //           <Image
    //             source={paper}
    //             style={[
    //               styles.image,
    //               {
    //                 borderColor: 'yellow',
    //                 height: selection === 'paper' ? 90 : 80,
    //                 width: selection === 'paper' ? 90 : 80,
    //               },
    //             ]}
    //           />
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.button} onPress={() => setSelection('scissor')}>
    //           <Image
    //             source={scissor}
    //             style={[
    //               styles.image,
    //               {
    //                 borderColor: 'cyan',
    //                 height: selection === 'scissor' ? 90 : 80,
    //                 width: selection === 'scissor' ? 90 : 80,
    //               },
    //             ]}
    //           />
    //         </TouchableOpacity>
    //       </View>

    //       {selection && (
    //         <>
    //           <CustomButton
    //             onPress={handleToss}
    //             loading={loading}
    //             disabled={loading}
    //             loadingColor="black"
    //             marginBottom={12}
    //             title="Lock Choice"
    //             borderRadius={12}
    //             bg="rgb(207, 249, 145)"
    //             marginH={14}
    //             marginV={10}
    //             textColor="black"
    //             fontSize={16}
    //           />
    //           {loading && (
    //             <Text style={styles.message}>
    //               {message}
    //             </Text>
    //           )}
    //         </>
    //       )}
    //     </>
    //   )}
    // </>
    <>
    <Text style={{fontSize: 14, marginTop: 20, fontWeight: '600',textTransform:"capitalize"}}>{!disconnectMsg?`${roomtype==='joined'?friendinfo?.host?.username:friendinfo?.joined.username} joined successfully.`:disconnectMsg}</Text>
    <Text style={{fontSize: 14, marginTop: 20, fontWeight: '600',textTransform:"capitalize"}}>{playerWon && playerWon + " Won the toss."} </Text>
    <CustomButton
                onPress={handleToss}
                loading={loading}
                disabled={disablebtn}
                loadingColor="black"
                marginBottom={12}
                title="Start toss"
                borderRadius={12}
                bg="rgb(207, 249, 145)"
                marginH={14}
                marginV={10}
                textColor="black"
                fontSize={16}
              />
    </>
   
  );
};

export default Toss;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 40,
    fontWeight: '800',
    color: 'rgb(246, 224, 24)',
    textShadowColor: 'black',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 12,
  },
  choicesContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  button: {},
  image: {
    borderWidth: 4,
    borderRadius: 100,
    padding: 5,
  },
  message: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
  },
});
