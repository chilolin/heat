'use client'

import React from 'react'
import { AppBar, Toolbar, Typography, Container } from '@mui/material'
import { makeStyles } from '@mui/styles'

// スタイルの定義
const useStyles = makeStyles((theme) => ({
  logo: {
    height: 60,
  },
}))

const Header = () => {
  const classes = useStyles()

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'gray' }}>
      <Container>
        <Toolbar>
          <img src="/logo.png" alt="Logo" className={classes.logo} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
