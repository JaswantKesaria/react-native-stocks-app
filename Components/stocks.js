import React, { Component } from 'react';
import {ActivityIndicator, StyleSheet, View, TouchableOpacity,Text, Alert} from 'react-native';
import ChartView from 'react-native-highcharts-wrapper';
import axios from 'axios';
import moment from 'moment';
 
class Stocks extends Component {
     state = {
    stocksData: [],
    chartOptions: null,
    stockSymbol: 'AAPL'
  }

  navigateTo(path) {
    this.props.navigation.navigate(path)
  }
  extractData(stocksData) {
        this.setState({stocksData})
        var x= Object.keys(stocksData["Time Series (1min)"]);
        var y = [];
        for(var i=0;i<x.length;i++){
          var d = moment(x[i]).valueOf();
          var e2 = stocksData["Time Series (1min)"][x[i]]["1. open"]
          var e3 = stocksData["Time Series (1min)"][x[i]]["2. high"]
          var e4 = stocksData["Time Series (1min)"][x[i]]["3. low"]
          var e5 = stocksData["Time Series (1min)"][x[i]]["4. close"]
          y.push([d,parseFloat(e2),parseFloat(e3),parseFloat(e4),parseFloat(e5)]);
        }
        this.setState({chartOptions: y.reverse()})
  }
   getChartDetails() {
    this.setState({chartOptions: null,stocksData:[]})
    if (this.props.route?.params) {
      let value = this.props.route.params["stockSymbol"];
      this.extractData(this.props.route.params["stocksData"]);
      this.setState({stockSymbol: value})
      return;
   } else{
    console.log("Printing bfore api call")
    console.log(this.state.stockSymbol)
     axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=` + this.state.stockSymbol + `&interval=1min&apikey=JOEWDN0F51E3X1GU&outputsize=full`)
     .then(res => {
       console.log(res)
       if(!res.data["Note"]){
       this.extractData(res.data)
       } else{
         Alert.alert("Error Occured","API Frequency Reached, Please try again after some time");
       }
      
     }).catch(err =>{
       console.log(err);
     })
   }
  
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getChartDetails();
    });
      
    
  }
  componentWillUnmount(){
    this._unsubscribe();
  }

  render = () => {
  console.log(this.state.stockSymbol)
  if(this.state.chartOptions){
    const options = {
        global: { useUTC: false },
        lang: { decimalPoint: '.', thousandsSep: ',' },
       };
      let conf = {
        title: {
            text: this.state.stockSymbol+' stock price by minute'
        },
    
        subtitle: {
            text: 'Using ordinal X axis'
        },
    
        xAxis: {
            gapGridLineWidth: 0
        },
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1h',
                
            }, {
                type: 'day',
                count: 1,
                text: '1D'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 2,
            inputEnabled: false
        },
    
        series: [{
            name: this.state.stockSymbol,
            type: 'area',
            data: this.state.chartOptions,
            gapSize: 5,
            tooltip: {
                valueDecimals: 2
            },
            dataGrouping: {
                enabled: false
              },
            threshold: null
        }]
      };
    return(
        <>
      <View style={styles.container}>
      <ChartView style={{ flex:1, alignItems: 'stretch', justifyContent:'center'}} config={conf} options={options} stock={true}  />
  
      <View style={styles.ImageContainer}>
            <TouchableOpacity style={styles.notNowStyle} onPress={() => {this.navigateTo('stt')}}>
                <Text style={styles.notNowtext}>
                    Search Records
                </Text>
            </TouchableOpacity>
        </View>
        </View>
        </>
        );
      
  } 
  else {
    return(
        <>
        <View style={[styles.container, styles.horizontal]}>
           <ActivityIndicator size="large" color="#0000ff" />
           </View>
        </>
        );
      
      
  }
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
    ImageContainer: {
        flex:0.5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      notNowStyle:{
        marginVertical: 10,
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderStyle:'solid',
        borderColor: '#413174',
      },
      notNowtext: {
        textAlign:'center',
        color: '#413174',
        fontSize: 15,
        fontWeight: 'bold',
      },
  });
 
export default Stocks;