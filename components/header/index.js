'use client'

import React from 'react'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import { makeStyles } from '@mui/styles'

// スタイルの定義
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    color: 'black',
  },
}))

const Header = () => {
  const classes = useStyles()

  return (
    <AppBar position="static" sx={{ backgroundColor: 'whitesmoke' }}>
      <Container>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            HEAT
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
