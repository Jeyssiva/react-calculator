import React from 'react';
import { Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    button: {
      width: 190,
      height: 65,
      borderRadius: 10,
      boxShadow: 'inset 0px -4px 0px #3a4663',
      '&.zero': {
        width: 255
      },
      '&.reset': {
        width: 450
      },
      '&.equalsTo': {
        width: 255
      }
    },
    buttonText: {
      color: '#ffff'
    }
  
}))

const ButtonCompo = ({ onClick, children, buttonprops, uncommon}) => {
    const classes = useStyles();
    return (
      <Button variant='contained' className={`${classes.button} ${buttonprops}`} onClick={onClick}>
        <Typography variant={'h4'} className={uncommon ? classes.buttonText : ''}><b>{children}</b></Typography>
      </Button>
    )
}

export default ButtonCompo;