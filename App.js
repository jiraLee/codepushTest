/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, AppState} from 'react-native';
import codePush from 'react-native-code-push';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      syncMessage: null,
       progress: null
    }
  }

  codePushSync() {
    try{
      codePush.sync(
        {
          updateDialog: {
            title: '새로운 업데이트가 존재합니다.',
            optionalInstallButtonLabel: '지금 업데이트하시겠습니까?',
            mandatoryContinueButtonLabel: '계속',
            mandatoryUpdateMessage: '업데이트를 설치해야 사용할 수 있습니다.',
            optionalIgnoreButtonLabel: '나중에',
            optionalInstallButtonLabel: '업데이트'
          },
          installMode: codePush.InstallMode.IMMEDIATE
        },
        (syncStatus) => {
          switch(syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              this.setState({
                syncMessage: "Checking for update"
              });
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              this.setState({
                syncMessage: "Downloading package"
              });
              break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
              this.setState({
                syncMessage: "Awating user action"
              });
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              this.setState({
                syncMessage: "Installing update"
              });
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              this.setState({
                syncMessage: "App up to date",
                progress: false
              });
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              this.setState({
                syncMessage: " Update cancelled by user.",
                progress: false
              });
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              this.setState({
                syncMessage: "Update installed and willbe run when the app next resumes",
                progress: false
              });
              break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
              this.setState({
                syncMessage: "An unknown error occurred.",
                progress: false
              });
              break;
          }
        },
        (prgress) => {
          this.setState({
            progress: prgress
          });
        }
      );
    }
    catch (error) {
      Alert.alert('오류', '업데이트 과정에 오류가 발생했습니다.');
      codePush.log(error);
    }
  }

  componentDidMount() {
    this.codePushSync();
    AppState.addEventListener("change", (state) => {
      state == "active" && this.codePushSync();
    })
  }



  render() {
    if(!this.state.progress) {
      return null
    }

    let syncView, progressView;
    if(this.state.syncMessage) {
      syncView = (
        <View style = {styles.TitleWrap}>
          <Text style={styles.Title}>{this.state.syncMessage}</Text>
        </View>
      );
    }

    progressView = (
      <View style={styles.percentWrap}>
        <Text style={styles.percent}>{this.state.progress && parseInt((this.state.progress.recieveBytes/this.state.progress.totalBytles)*100)}%</Text>
      </View>
    )
    return (
      <View style={Style.Wrapper}>
        {progressView}
        {syncView}
      </View>
      /*<View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>*/
    );
  }
}

const styles = StyleSheet.create({
  Wrapper: {
    backgroundColor: '#3b5999',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleWrap: {
    marginTop : 10
  },
  Title: {
    color: '#fff',
    fontSize: 16,
  },
  percentWrap: {
    width: 144,
    height:144,
    borderRadius: 72,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  percent: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
