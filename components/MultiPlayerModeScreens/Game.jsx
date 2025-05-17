import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import winnerGif from '../assets/winner.gif';
import Background from '../component/Background';
import socket from '../context/socket';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../context/Data';
import { AuthContext } from '../context/Auth';

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Game = ({ route,navigation }) => {
  const { setLocalRoomId, setStep, setError, setTossResult, setPlayer,friendinfo,setroomtype,setLiveRequest,setFriendInfo} = useContext(DataContext);
  const { userinfo } = useContext(AuthContext);
  // const navigation = useNavigation();
  const Player1 = friendinfo?.host?.username;
  const Player2 = friendinfo?.joined?.username;

  const { roomId, player: tossWinner, roomType } = route?.params || {};
  console.log({ roomId, player: tossWinner, roomType })
  const player  = roomType==="create"?"Player1":roomType==="join"?"Player2":"Player1";
  console.log(player);

  const [board, setBoard] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState(tossWinner);
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState(null);

  const checkWinner = (updatedBoard) => {
    for (const [a, b, c] of winningCombinations) {
      if (updatedBoard[a] && updatedBoard[a] === updatedBoard[b] && updatedBoard[a] === updatedBoard[c]) {
        const winnerPlayer = updatedBoard[a] === 'X' ? 'Player2' : 'Player1';
        setWinner(winnerPlayer);
        setMessage(winnerPlayer === player ? 'You Won' : 'You Lose');
        return;
      }
    }
  };

  const handleBoxPress = (index) => {
    if (board[index] || message) return;

    const newBoard = [...board];
    newBoard[index] = player === 'Player1' ? 'O' : 'X';

    checkWinner(newBoard);
    socket.emit('makeMove', { roomId, board: newBoard });
  };
  const handlePlayerleft = ()=>{
    socket.emit("PlayerLeft");
  }

  const resetGame = () => {
    const emptyBoard = Array(9).fill('');
    setBoard(emptyBoard);
    setTurn(tossWinner);
    setMessage('');
    setWinner(null);
    socket.emit('makeMove', { roomId, board: emptyBoard });
  };

  const refreshGameStates = () => {
    setLocalRoomId('');
    setStep('');
    setError('');
    setTossResult('');
    setPlayer('');
    if(!message){
      handlePlayerleft();
    }
    setMessage('');
    setroomtype('');
    setLiveRequest();
    setFriendInfo('');
    navigation.popToTop();
  };

  const renderBox = ({ item, index }) => (
    <Pressable
      disabled={player !== turn || !!message}
      onPress={() => handleBoxPress(index)}
      style={styles.box}>
      <Text style={styles.boxText}>{item}</Text>
    </Pressable>
  );

  useEffect(() => {
    if (!roomId || !tossWinner || !roomType) {
      navigation.navigate('GameType');
      return;
    }

    const handleBoardUpdate = (updatedBoard) => {
      setBoard(updatedBoard);
      if (!winner) checkWinner(updatedBoard);

      if (!updatedBoard.includes('') && !winner) {
        setMessage('Match is Draw');
      }

      setTurn(prev => (prev === 'Player1' ? 'Player2' : 'Player1'));
    };

    const handleDisconnect = (msg) => {
      setMessage(msg);
    };
    

    socket.on('updateBoard', handleBoardUpdate);
    socket.on('listenPlayerLeft', handleDisconnect);
    socket.on('disconnected', handleDisconnect);

    return () => {
      socket.off('updateBoard', handleBoardUpdate);
      socket.off('playerDisconnected', handleDisconnect);
      socket.off('disconnected', handleDisconnect);
    };
  }, [roomId, tossWinner, roomType, winner]);

  return (
    <>
      <Background />
      {message?.includes('Won') && <ImageBackground source={winnerGif} style={styles.winnerGif} />}
      {message?.includes('Lose') && <Text>You Lose</Text>}
      {message?.includes('Draw') && <Text>Match is Draw</Text>}

      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.heading}>
          Tic Tac Toe{'\n'}
          {player}
        </Text>

        <View
          style={{
            backgroundColor: 'gray',
            borderWidth: player === turn ? 4 : 1,
            borderColor: player === turn ? 'white' : 'purple',
            backgroundColor: player === turn ? 'black' : 'gray',
            borderRadius: 12,
            marginLeft: 12,
            marginRight: 12,
          }}>
          <Text
            style={{
              padding: 20,
              fontWeight: 'bold',
              color: 'white',
              fontSize: 20,
              textAlign: 'center',
            }}>
            {player === turn ? 'Your turn' : "Opponent's turn"}
          </Text>
        </View>

        <FlatList
          data={board}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBox}
          contentContainerStyle={styles.board}
        />

        <Text style={styles.messageText}>{message}</Text>
      </SafeAreaView>

      <Modal visible={!!message} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>{message}</Text>
            <Text style={styles.modalText}>Game over.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={refreshGameStates}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            {!message?.toLowerCase().includes('disconnect') && (
              <TouchableOpacity
                style={[styles.modalButton, { marginTop: 5, backgroundColor: 'gray' }]}
                onPress={resetGame}>
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Game;

const styles = StyleSheet.create({
  winnerGif: {
    position: 'absolute',
    bottom: -120,
    width: '120%',
    height: '50%',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    padding: 12,
  },
  board: {
    marginTop: 15,
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'rgba(215, 18, 107, 0.33)',
    borderWidth: 2,
    borderColor: 'rgb(197, 199, 92)',
    height: 110,
    width: 110,
    borderRadius: 3,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
  },
  messageText: {
    padding: 20,
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: "center",
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color:"white"
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
     color:"white"
  },
  modalButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
