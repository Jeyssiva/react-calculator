import React , {useEffect, useState} from 'react';
import CommonButton from './CommonButton';

import { Box, Button, Popover, List, ListItem, ListItemText, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { saveHistoryData, getHistoryList, deleteHistoryData } from '../network';

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: '90vh',
        color: '#ffff'
    },
    textField: {
        marginTop: 10,
        marginBottom: 20,
        direction: 'rtl',
        borderRadius: 10,
        color: '#ffff'
    },
    inputStyle: {
        color: '#ffff',
        fontSize: 48
    },
    buttonBox: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 10,
        padding: 2,
        gap: 25
    },
    buttonSecondaryBox: {
        display: 'flex', 
        gap: 25
    },
    themeToggle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    customRadioButton: {
        width: 20,
        height: 20,
        border: '2px solid #444',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: 'calc(100% - 6px)',
        height: 'calc(100% - 6px)',
        backgroundColor: 'hsl(6, 63%, 50%)',
        borderRadius: '50%',
        display: 'inline-block',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    display: {
        display: 'flex',
        flexDirection: "column",
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '96%',
        height: '100px',
        marginBottom: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        padding: '10px',
        borderColor: 'black',
        borderStyle: 'groove'
      },
    historyButton: {
        display: 'flex',
        right: '84%',
        top: '20%'
      },
    result: {
        fontSize: '40px',
        marginBottom: '5px',
        color:'black'
      },
    input: {
        fontSize: '20px',
        color: '#999'
      },
    clearHistory:{
        left:'23%'
    }
}))

const Calculator = () => {
    const classes = useStyles();
    const [input, setInput] = useState('');
    const [display, setDisplay] = useState('')
    const [popOver, setPopOver] = React.useState(null);
    const [history, setHistory] = useState([])
    const [hisDisabled, setHisDisable] = useState(true)
    const [equalTo, setEqualTo] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        getHistoryList().then((historyList) => {
            if(historyList.success){
                setHistory(historyList.data)
                setHisDisable(false)
            } else {
                setHistory([])
                setHisDisable(true)
               
            }
        }).catch((result) =>{
             if(result.data.message === 'Failed to fetch'){
                setErrMsg('No Backend Connection, Please connect and Refresh page')
             }
        });
    }, [])

    const performOperation = (op) => {
        setInput(input + op)
        setEqualTo(false)
    }
    const handleClick = (num) => {
        if(equalTo){
            setInput(num + '')
            setDisplay('')
            setEqualTo(false)
        } else {     
            setInput(input + num)
        }
    }

    const handleHistory = (event) => {
      setPopOver(event.currentTarget);
    };
  
    const handleClose = () => {
      setPopOver(null);
    };

    const getResult = () => { 
        let numbers = input.split(/[\\+\-\\*\\/]/).map(num => parseFloat(num));
        let operators = input.replace(/[0-9\\.\s]/g, '').split('');
        let result = numbers[0];

        numbers.forEach((item, i) => {
            switch(operators[i - 1]) {
                case '+':
                    result += numbers[i];
                    break;
                  case '-':
                    result -= numbers[i];
                    break;
                  case '*':
                    result *= numbers[i];
                    break;
                  case '/':
                    result /= numbers[i];
                    break;
                  default:
                    break;
            }
        })
     
        const displayValue = input + '='
        setDisplay(displayValue)
        setInput(result + '');
        setEqualTo(true)
        saveHistoryData(displayValue, result)
        .then(saveData => {
            if(saveData.success){
                setHistory(oldHistory => [...oldHistory, {...saveData.data}])
                setHisDisable(false)
            } 
        }).catch((resultData) =>{
            if(resultData.data.message === 'Failed to fetch'){
                setErrMsg('No Backend Connection, Please connect and Refresh page')
                setHistory(oldHistory => [...oldHistory, {key: displayValue, result}])
                setHisDisable(false)
            }
       })
    }
    const onClear = () => {
        setInput('')
        setDisplay('')
        setEqualTo(false)
    }

    const onClearHistory = () => {
        deleteHistoryData().then(data => {
            if(data.success) {
                setHistory([])
                setHisDisable(true)
                setPopOver(false)
                setInput('')
                setDisplay('')
                setEqualTo(false)
            } 
        }).catch((result) =>{
            if(result.data.message === 'Failed to fetch'){
                setErrMsg('No Backend Connection, Please connect and Refresh page')
            }
       })
    }
    
    const open = Boolean(popOver);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
        <Box display='flex' color={ errMsg !== '' ? 'red' :'black'}>
            <Typography variant='h4'>
                {
                    errMsg !== '' ? errMsg : 'Calculator'
                }
            </Typography>
        </Box>
        <Box className={classes.root}>   
            <Box disply='flex' flexDirection='column' width={540}>
                <Box className={classes.display}>
                    <Button className={classes.historyButton} disabled={hisDisabled} onClick = {handleHistory}>History</Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={popOver}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                    >
                        <List>
                            {
                                history.map(({key, result}) => {
                                   return <ListItem button onClick={() => {
                                    setDisplay(key)
                                    setInput(result)
                                   }}>
                                        <ListItemText primary={key + result} />
                                    </ListItem>
                                })
                            }
                        </List>
                        <Button onClick={onClearHistory} className={classes.clearHistory}>Clear</Button>
                    </Popover>
                    <div className={classes.result}>{display === '' ? '0' : display}</div>
                    <div className={classes.input}>{input === '' ? '0' : input}</div>
                </Box>
                <Box className={classes.buttonBox}>
                    <Box className={classes.buttonSecondaryBox}>
                        <CommonButton onClick={onClear} buttonprops='reset' uncommon>CLEAR</CommonButton>
                        <CommonButton onClick={() => performOperation('/')}>/</CommonButton>
                        <CommonButton onClick={() => performOperation('*')}>×</CommonButton>
                    </Box>
                    <Box className={classes.buttonSecondaryBox}>
                        <CommonButton onClick={() => handleClick(7)}>7</CommonButton>
                        <CommonButton onClick={() => handleClick(8)}>8</CommonButton>
                        <CommonButton onClick={() => handleClick(9)}>9</CommonButton>
                        <CommonButton onClick={() => performOperation('-')}>-</CommonButton>
                    </Box>
                    <Box className={classes.buttonSecondaryBox}>  
                        <CommonButton onClick={() => handleClick(4)}>4</CommonButton>
                        <CommonButton onClick={() => handleClick(5)}>5</CommonButton>
                        <CommonButton onClick={() => handleClick(6)}>6</CommonButton>
                        <CommonButton onClick={() => performOperation('+')}>+</CommonButton>    
                    </Box>
                    <Box className={classes.buttonSecondaryBox}>
                        <CommonButton onClick={() => handleClick(1)}>1</CommonButton>
                        <CommonButton onClick={() => handleClick(2)}>2</CommonButton>
                        <CommonButton onClick={() => handleClick(3)}>3</CommonButton>
                        <CommonButton onClick={() => handleClick('.')}>.</CommonButton>
                    </Box>
                    <Box className={classes.buttonSecondaryBox}>
                        <CommonButton onClick={() => handleClick(0)} buttonprops='zero' uncommon>0</CommonButton>
                        <CommonButton onClick={getResult} buttonprops='equalsTo' uncommon>=</CommonButton>
                    </Box>
                </Box>
            </Box>  
        </Box>
        </>
    )
}

export default Calculator;