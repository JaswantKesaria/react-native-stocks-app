import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  AppRegistry,
  TouchableOpacity,
} from 'react-native';
import Voice from 'react-native-voice';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
export default class SpeechToText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: '',
      value: '',
      searchResult: [],
      searchSymbol: '',
      showStockChart: false,
      stocksData: [],
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  };
onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  };
  onSpeechEnd(e) {
    if (Platform.OS === 'ios') {
      this.setValueOfTextInput();
    }
  }
onSpeechResults(e) {
    if (e.value?.length > 0) {
        let text = e.value[0];
        this.setState({
          results: text,
        });
      }
      if (Platform.OS === 'android') {
        this.setValueOfTextInput();
      }
     this.processOutput();
  }
  getStockPrice() {
    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`+ this.state.searchSymbol + `&interval=1min&apikey=JOEWDN0F51E3X1GU&outputsize=full`)
    .then(res => {
      const stocksData = res.data;
      this.setState({ stocksData });
      var x= Object.keys(stocksData["Time Series (1min)"]);
      var stockprice = stocksData["Time Series (1min)"][x[0]]["4. close"]
      Toast.show("The stock Price of "+ this.state.searchSymbol +" is " +stockprice ,Toast.LONG);
      this.setState({showStockChart: true});
    })
  }
  processOutput() {
    console.log(this.state.value);
    var part = this.state.value.toLowerCase().match(/show trends of(.*$)/) || this.state.value.toLowerCase().match(/current price of(.*$)/)
    console.log("Printing parts");
    console.log(part)
    if (!part){
        Toast.show("Invalid command",Toast.SHORT);
       return false
    } 
    console.log(part.length);
    if(part.length> 0){
        var stockName = part[1]
        axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=`+ stockName.trim() +`&apikey=JOEWDN0F51E3X1GU`)
        .then(res => {
          this.setState({ searchResult: res.data["bestMatches"] });
          if(this.state.searchResult.length > 0){
            let name = this.state.searchResult[0];
            this.setState({searchSymbol : name["1. symbol"]})
            this.getStockPrice();
          } else {
            Toast.show("Invalid command",Toast.SHORT);
            return false
          }
          
        })
    }
    else{
        Toast.show("Invalid command",Toast.SHORT);
        return false
    }
     
  
  }
async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: '',
      value: ''
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  setValueOfTextInput() {
    let textInput = this.state.value?.length > 0
      ?  this.state.value + ' ' + this.state.results
      : this.state.value + '' + this.state.results;
  this.setState({value: textInput});
  }
  clearState() {
    this.setState({
        recognized: '',
        started: '',
        results: '',
        value: ''
      });
  }
 
  navigateTo(path) {
    let stockDetails ={
      stockSymbol: this.state.searchSymbol,
      stocksData: this.state.stocksData
    }
    this.props.navigation.navigate(path, stockDetails);
  }
render () {
    return (
      <View style={styles.container}>
        <View style={{flex:0.5}}>
        <Text style={styles.textStyles}>Ask Jarvix any question</Text>
        <Text style={styles.textStyles}>about your business</Text>
        </View>
        <View styles={{ flex:0.5}}>
            <TouchableOpacity onPress={this._startRecognition.bind(this)}>
                <Image source={require('../assests/speech.png')} />
           </TouchableOpacity>
           <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={this._startRecognition.bind(this)}>
                <Image source={require('../assests/ref.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.clearState.bind(this)}>
                <Image source={require('../assests/cross.png')} />
            </TouchableOpacity>
           

           </View>
          { (this.state.showStockChart) ?<TouchableOpacity onPress={() =>{this.navigateTo('stocks')}} style={styles.signInBackground}>
            <Text style={styles.googleStyles}> 
             Show Chart </Text> 
            </TouchableOpacity> : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#413174',
        justifyContent:'center',
        alignItems:'center'
      },
      textStyles:{
          color: '#746999',
          fontWeight:'bold',
          fontSize:28,
          textAlign:'center',
          marginVertical: 5,
      },
      signInBackground: {
        zIndex: 999,
        backgroundColor:'#756B95',
        borderRadius:25, 
        width:140,
        padding: 12,
        alignSelf:'center'
    },
    googleStyles:{
      fontWeight:'bold',
      fontSize:19,
      color:'white',
      textAlign:'center'
  }
});
AppRegistry.registerComponent('VoiceNative', () => VoiceNative);