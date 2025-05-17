import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import winnerGif from '../assets/winner.gif';
import Background from '../component/Background';
import Ionicons from 'react-native-vector-icons/Ionicons';
const android = Platform.OS ==="android";
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

const Home = ({navigation}) => {
  const [boxes, setBoxes] = useState(Array(9).fill(''));
  const [isCrossTurn, setIsCrossTurn] = useState(false);
  const [message, setMessage] = useState('');

  const checkWinner = board => {
    for (let [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleBoxPress = index => {
    if (boxes[index] !== '' || message.includes('Winner')) return;

    const newBoard = [...boxes];
    newBoard[index] = isCrossTurn ? 'X' : 'O';

    const winner = checkWinner(newBoard);
    if (winner) {
      setMessage(`Winner is ${winner}`);
    } else if (!newBoard.includes('')) {
      setMessage('Match is Draw');
    }

    setBoxes(newBoard);
    setIsCrossTurn(!isCrossTurn);
  };

  const resetGame = () => {
    setBoxes(Array(9).fill(''));
    setIsCrossTurn(false);
    setMessage('');
  };

  const renderBox = ({item, index}) => (
    <Pressable
      disabled={!!message}
      onPress={() => handleBoxPress(index)}
      style={styles.box}>
      <Text style={[styles.boxText,{color:item==="O"?"rgb(183, 201, 16)":"rgb(81, 47, 47)"}]}>{item}</Text>
    </Pressable>
  );

  return (
    <>
      <Background />
      {message?.includes('Winner') && (
        <ImageBackground source={winnerGif} style={styles.winnerGif} />
      )}

      <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{paddingHorizontal:20,marginTop:5}}>
            <Ionicons name='arrow-back-circle-outline' size={50} color={"#fff"}/>
          </TouchableOpacity>
        <Text style={styles.heading}>Tic Tac Toe{'\n'}</Text>
        <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:25,marginRight:25,marginBottom:15}}>
          <View style={{backgroundColor:isCrossTurn?"rgba(251, 225, 168, 0.5)":"rgba(150, 176, 47, 0.77)",borderWidth:isCrossTurn?1:4,borderColor:isCrossTurn?"white":"yellow",borderRadius:12}}>
            <Text style={{padding:android?15:30,fontWeight:"bold",color:"white",fontSize:20}}>Player O</Text>
          </View>
          <View style={{backgroundColor:isCrossTurn?"rgb(58, 35, 27)":"rgba(251, 225, 168, 0.5)",borderWidth:isCrossTurn?3:1,borderColor:isCrossTurn?"yellow":"",borderRadius:12}}>
            <Text style={{padding:android?15:30,fontWeight:"bold",color:"white",fontSize:20}}>Player X</Text>
          </View>
        </View>
      <View style={{marginBottom:5}}>
      <FlatList
          data={boxes}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBox}
          contentContainerStyle={styles.board}
        />
      </View>
        

        <Text style={styles.messageText}>{message}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Restart Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => ""}>
            <Text style={styles.buttonText}>View Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Made By Badge */}
      {/* <View style={styles.madeByContainer}>
        <Text style={styles.madeByText}>
          Made by: Aryan Dhiman {'\n'}Roll no: 252202086
        </Text>
      </View> */}

      {/* Leaderboard Modal */}
      <Modal
        visible={!!message}
        transparent
        animationType="slide"
        onRequestClose={() => setGameEndModel(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>{message}</Text>
            <Text style={styles.modalText}>
              {
                !message.includes("Draw")?message.includes("O")?"X lose the game.":"O lose the game.":"Restart new game."
              }
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {setMessage();resetGame()}}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  winnerGif: {
    position: 'absolute',
    bottom: -120,
    width: '120%',
    height: '50%',
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(252, 249, 71)',
    textShadowColor:"rgb(17, 20, 14)",
    textShadowRadius:5,
    textShadowOffset:50,
  },
  board: {
   
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'rgba(215, 18, 179, 0.2)',
    borderWidth: 2,
    borderColor: 'rgb(249, 208, 5)',
    height: android? 100:110,
    width: android? 100:110,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom:10
  },
  button: {
    padding: 10,
    backgroundColor: 'rgb(95, 62, 230)',
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    borderWidth:2,
    borderColor:"white"
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  madeByContainer: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    borderWidth: 1,
    borderColor: 'white',
    padding: 12,
    borderRadius: 12,
  },
  madeByText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
});
