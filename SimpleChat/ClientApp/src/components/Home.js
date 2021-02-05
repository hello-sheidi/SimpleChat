import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useRef  } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Card, CardContent} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#33c9dc',
    },
  },
});

const useStyles = makeStyles({
  root: {
    background: '#33c9dc'
  },
  chat: {
    height: '500px',
    width: '100%',
    marginBottom: '20px',
    overflowY: 'auto'
  },
  message: {
      margin: '8px',
      padding: '10px',
  },
  messageText: {
    marginLeft: '10px',
    marginTop: '8px'
  },
  button: {
    marginTop: '7px',
    marginLeft: '20px',
    background: 'white',
    height: '40px'
  },
  textBox: {
    background: 'white',
  },
  messageInputContainer: {
    marginBottom: '20px',
    background: 'white',
    padding: '10px',
    borderRadius: '5px'
  }
});

const NickInput = (props) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
return (
  <div>
    <TextField className={classes.textBox} label="Twoj nick" variant="outlined" value={input} onChange={e => setInput(e.target.value)} />
    <Button disabled={input.length === 0} color="primary" className={classes.button} onClick={() => props.onButtonClick(input)} variant="outlined">Wejdz</Button>
  </div>
)
}

const Message = (props) => {
  const classes = useStyles();
  return (
    <Paper  key={props.index} className={classes.message}>
    <Grid container wrap="nowrap">
      <Grid item>
        <Avatar style={{color: 'white', backgroundColor: props.color }}>{props.nick}</Avatar>
      </Grid>
      <Grid item xs zeroMinWidth>
        <Typography className={classes.messageText} noWrap>{props.message}</Typography>
      </Grid>
    </Grid>
  </Paper>
  )
}

const Chat = (props) => {
  const classes = useStyles();

  return (
    <Grid lg={12}  item>
      <Card className={classes.chat} >
        <CardContent>
        {props.messages && props.messages.map((m, index) => <Message key={index} nick={m.nick} message={m.message} color={m.color} />)}
        </CardContent>
      </Card>
    </Grid>
  )
}

const MessageInput = (props) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  return (
    <div>
      <TextField className={classes.textBox} label="Wiadomość" variant="outlined" value={input} onChange={e => setInput(e.target.value)} />
      <Button disabled={input.length === 0}  color="primary" className={classes.button} onClick={() => props.onButtonClick(input)} variant="outlined">Wyślij</Button>
    </div>
  )
}

export const Home = () => {
  const classes = useStyles();

   const [messagesState, setMessagesState] = useState({
    messages: [],
   });

   const [connectionState, setConnectionState] = useState(null);

  const [nick, setNick] = useState('');
  const [nickColor, setNickColor] = useState('');

  const addMessage = (message) => {
    const state = {...messagesState};
    state.messages.push(message);

    setMessagesState(state);
  }

  useEffect(() => {
    const connection = new HubConnectionBuilder()
    .withUrl(`${window.location.origin}/chathub`)
    .configureLogging(LogLevel.Information)
    .build();


    setConnectionState(connection);
  }, []);

  useEffect(() => {
      if (connectionState) {
        connectionState.start()
        .then(result => {
          connectionState.on("ColorAssigned", (color) => {
          setNickColor(color);
        });

        connectionState.on("ReceiveMessage", (user, message, color) => {
          const messageObject = {nick: user, message: message, color: color};

          addMessage(messageObject);
        });
      });
    }
  }, [connectionState])

  const onButtonClick = (nick) => {
    
    const nickShorcut = nick && nick.length > 0 ? nick[0].toUpperCase(): 'X';
    setNick(nickShorcut)
  }

  const onSendMessageClick = async(message) => {
    const messageObject = { nick: nick, message: message, color: nickColor};
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageObject)
  };

    const response = await fetch(`${window.location.origin}/api/chat/message`, requestOptions);
  }

    return (
      <ThemeProvider theme={theme}>
        <Grid justify="center" container className={classes.root}> 
          <Grid item lg={12} xs={12}>
            <Typography variant="h3" component="h2" style={{color: 'white'}}>
              Let's chat
            </Typography>
              <Chat messages={messagesState.messages} />
              <div className={classes.messageInputContainer}>
                {!nick ? <NickInput onButtonClick={onButtonClick}/> : <MessageInput onButtonClick={onSendMessageClick}/>}
              </div>          
          </Grid>    
        </Grid>
      </ThemeProvider>
    );
}
