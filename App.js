import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Image, Dimensions } from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default function App() {
  const [amount, setAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [result, setResult] = useState('');

  const myHeaders = new Headers();
  myHeaders.append("apikey", "xWK4Cg0q5T5sJjIdpp1kYZZagkIqxdHO");

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };
  
  useEffect (() => {
    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=EUR`, requestOptions)
    .then(response => response.json())
    .then(result => {
      setCurrencies(Object.keys(result.rates));
    })
    .catch(error => console.log('error', error));
  }, []);

  const convertAmount = () => {
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selectedCurrency}&amount=${amount}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      setResult(data.result.toFixed(2));
      console.log(data);
    })
    .catch(error => console.log('error', error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={require('./assets/euro-logo.jpg')} style={{width: 150, height: 150}}/>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginVertical: 20}}>{result} €</Text>
        <View style={styles.inputs}>
          <TextInput
            style={{fontSize: 18, width: 100, height: 40, borderBottomColor: 'grey', borderBottomWidth: 1, marginBottom: 5}}
            placeholder='amount'
            value={amount}
            onChangeText={text => setAmount(text)}
          />
          <Picker
            style={styles.picker}
            selectedValue={selectedCurrency}
            onValueChange={(itemValue, itemIndex) =>{
              setSelectedCurrency(itemValue);
            }}>
            {currencies.map((item, index) => {
              return (< Picker.Item label={item} value={item} key={index} />);
            })}   
          </Picker>
        </View>
      <Button title="Convert" onPress={convertAmount} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputs: {
    flexDirection: 'row'
  },
  picker: {
    width: 100,
  },
});
