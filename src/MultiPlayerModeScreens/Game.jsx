import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';

import winnerGif from '../assets/winner.gif';
import Background from '../component/Background';
import socket from '../context/socket';
import { DataContext } from '../context/Data';
import { AuthContext } from '../context/Auth';

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Game = ({ route, navigation }) => {
  const { userinfo } = useContext(AuthContext);
  const {
    friendinfo,
    setLocalRoomId,
    setStep,
    setTossResult,
    setPlayer,
    setroomtype,
    setLiveRequest,
    setFriendInfo,
  } = useContext(DataContext);

  const { roomId, player: tossWinner, roomType } = route.params;

  const player =
    roomType === 'create'
      ? 'Player1'
      : roomType === 'join'
      ? 'Player2'
      : 'Player1';

  const Player1 = friendinfo?.host?.username;
  const Player2 = friendinfo?.joined?.username;

  const [board, setBoard] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState(tossWinner); // who plays first
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState(null);

  // ---------------------------------------------
  // 🔥 CHECK WINNER
  // ---------------------------------------------
  const checkWinner = updatedBoard => {
    for (const [a, b, c] of winningCombos) {
      if (
        updatedBoard[a] &&
        updatedBoard[a] === updatedBoard[b] &&
        updatedBoard[a] === updatedBoard[c]
      ) {
        const winPlayer = updatedBoard[a] === 'X' ? 'Player2' : 'Player1';
        setWinner(winPlayer);

        if (winPlayer === player) setMessage('You Won 🎉');
        else setMessage('You Lose 😞');

        return;
      }
    }
  };

  // ---------------------------------------------
  // 🔥 HANDLE BOX PRESS
  // ---------------------------------------------
  const handleBoxPress = index => {
    if (board[index] || message) return;
    if (turn !== player) return;

    const newBoard = [...board];
    newBoard[index] = player === 'Player1' ? 'O' : 'X';

    checkWinner(newBoard);

    socket.emit('makeMove', { roomId, board: newBoard });
  };
  const resetGameRequest = () => {
    socket.emit('requestRematch', { roomId });
  };

  // ---------------------------------------------
  // 🔥 SERVER LISTENERS
  // ---------------------------------------------
  useEffect(() => {
    if (!roomId) {
      navigation.navigate('GameType');
      return;
    }

    const handleBoardUpdate = updatedBoard => {
      setBoard(updatedBoard);

      if (!winner) checkWinner(updatedBoard);

      if (!updatedBoard.includes('') && !winner) {
        setMessage('Match Draw 🤝');
      }

      setTurn(prev => (prev === 'Player1' ? 'Player2' : 'Player1'));
    };

    const handleDisconnect = msg => {
      setMessage(msg);
    };

    socket.on('updateBoard', handleBoardUpdate);
    socket.on('listenPlayerLeft', handleDisconnect);
    socket.on('disconnected', handleDisconnect);
    socket.on('startRematch', ({ board, turn }) => {
      setBoard(board);
      setMessage('');
      setWinner(null);
      setTurn(turn);
    });

    return () => {
      socket.off('updateBoard', handleBoardUpdate);
      socket.off('startRematch');
      socket.off('listenPlayerLeft', handleDisconnect);
      socket.off('disconnected', handleDisconnect);
    };
  }, [winner]);

  // ---------------------------------------------
  // 🔥 RESET GAME (PLAY AGAIN)
  // ---------------------------------------------
  const resetGame = () => {
    const empty = Array(9).fill('');
    setBoard(empty);
    setMessage('');
    setWinner(null);
    setTurn(tossWinner);
    socket.emit('makeMove', { roomId, board: empty });
  };

  // ---------------------------------------------
  // 🔥 EXIT GAME (BACK)
  // ---------------------------------------------
  const exitGame = () => {
    if (!message) {
      socket.emit('PlayerLeft');
    }

    setLocalRoomId('');
    setStep('');
    setTossResult('');
    setPlayer('');
    setroomtype('');
    setLiveRequest('');
    setFriendInfo('');

    navigation.popToTop();
  };

  // ---------------------------------------------
  // 🔥 RENDER BOX
  // ---------------------------------------------
  const renderBox = ({ item, index }) => (
    <Pressable onPress={() => handleBoxPress(index)} style={styles.box}>
      <Text
        style={[
          styles.boxText,
          { color: item === 'X' ? 'rgb(40, 37, 27)' : 'yellow' },
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );

  return (
    <>
      <Background />

      {message.includes('Won') && (
        <ImageBackground source={winnerGif} style={styles.winnerGif} />
      )}

      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.heading}>
          Tic Tac Toe{'\n'}
          {player === 'Player1' ? "O" : "X"}
        </Text>

        <View
          style={[
            styles.turnBox,
            { backgroundColor: turn === player ? '#55aa55' : '#d9534f' },
          ]}
        >
          <Text style={styles.turnText}>
            {turn === player ? 'Your Turn' : "Opponent's Turn"}
          </Text>
        </View>

        <FlatList
          data={board}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBox}
          scrollEnabled={false}
          contentContainerStyle={styles.board}
        />

        <Text style={styles.messageText}>{message}</Text>
      </SafeAreaView>

      {/* GAME OVER MODAL */}
      <Modal visible={!!message} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>{message}</Text>
            <Text style={styles.modalText}>Game Over</Text>

            <TouchableOpacity style={styles.modalButton} onPress={exitGame}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>

            {!message.toLowerCase().includes('disconnect') && (
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={resetGameRequest}
              >
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

// -------------------------------------------------------------

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
    color: 'white',
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
    borderRadius: 4,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  turnBox: {
    marginHorizontal: 12,
    borderRadius: 12,
  },
  turnText: {
    padding: 20,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    width: '60%',
    marginTop: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
