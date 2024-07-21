'use client'

import { useCallback, useEffect, useState } from 'react'
import Plotly from 'plotly.js-dist'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'

const layout = {
  autosize: false,
  height: 700,
  scene: {
    aspectratio: {
      x: 1,
      y: 1,
      z: 1,
    },
    camera: {
      center: {
        x: 0,
        y: 0,
        z: 0,
      },
      eye: {
        x: 1.25,
        y: 1.25,
        z: 1.25,
      },
      up: {
        x: 0,
        y: 0,
        z: 1,
      },
    },
    xaxis: {
      type: 'linear',
      zeroline: false,
    },
    yaxis: {
      type: 'linear',
      zeroline: false,
    },
    zaxis: {
      type: 'linear',
      zeroline: false,
    },
  },
  width: 700,
}

function Graph({ data, loading, setLoading, t, setT, marks }) {
  const [intervalId, setIntervalId] = useState(null)

  useEffect(() => {
    const graphElement = document.getElementById('Graph')
    if (graphElement && data.length > 0) {
      let newT = t
      if (t >= data[0].length) {
        newT = 0
        setT(0)
      }
      let tdata = []
      tdata = tdata.concat(data[0][newT])
      tdata = tdata.concat(data[1][newT])
      tdata = tdata.concat(data[2][newT])
      tdata = tdata.concat({
        alphahull: 0.1,
        opacity: 0.1,
        type: 'mesh3d',
        x: [7, 13],
        y: [6, 13],
        z: [-1, 13],
      })
      const timestamp =
        data[0][newT]?.timestamp?.[1] ??
        data[1][newT]?.timestamp?.[1] ??
        data[2][newT]?.timestamp?.[1]
      const date = new Date(timestamp)
      layout.title = `${date.getFullYear()}年${
        date.getMonth() + 1
      }月${date.getDate()}日`
      Plotly.newPlot('Graph', tdata, layout)
      setLoading(false)
    }
  }, [t, data])

  const handleRestart = useCallback(() => {
    const intervalId = setInterval(() => {
      setT((prevT) => (prevT + 1) % data[0].length)
    }, 100)
    setIntervalId(intervalId)
  }, [setIntervalId, data])

  const handlePose = () => {
    clearInterval(intervalId)
  }

  useEffect(() => {
    return () => clearInterval(intervalId)
  }, [])

  const handleChange = (_, newValue) => {
    setT(newValue)
    clearInterval(intervalId)
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        sx={{
          width: 700,
          height: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box id="Graph"></Box>
        {loading && <CircularProgress />}
      </Box>
      <Box
        sx={{ width: 700, display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <Box sx={{ display: 'flex', gap: '4px', paddingRight: '12px' }}>
          <LoadingButton
            variant="outlined"
            onClick={handleRestart}
            loading={loading}
            sx={{ textAlign: 'center' }}
          >
            再生
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            onClick={handlePose}
            loading={loading}
            color="error"
            sx={{ alignItems: 'center', justifyItems: 'center' }}
          >
            停止
          </LoadingButton>
        </Box>
        <Slider
          defaultValue={0}
          value={t}
          onChange={handleChange}
          aria-label="Default"
          max={data[0]?.length - 1 ?? 0}
          marks={marks}
        />
      </Box>
    </Box>
  )
}

export default Graph
