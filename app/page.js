'use client'

import styles from './page.module.css'
import {
  FormGroup,
  Stack,
  Select,
  InputLabel,
  MenuItem,
  Box,
  Typography,
} from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import Graph from '@/components/graph'
import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [data, setData] = useState([])
  const [hotTopics, setHotTopics] = useState({})
  const [category, setCategory] = useState(10)
  const [range, setRange] = useState()
  const [duration, setDuration] = useState(1)
  const [loading, setLoading] = useState(true)
  const [t, setT] = useState(0)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [ranking, setRanking] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    fetch(`/api/parse-json?duration=${duration}`)
      .then((res) => res.json())
      .then(({ data, hotTopics }) => {
        setData(data)
        setHotTopics(hotTopics)
        setLoading(false)
      })
  }, [])

  const handleChange = (event) => {
    setCategory(event.target.value)
  }

  const handleRange = (newValue) => {
    setRange(newValue)
    setLoading(true)
    fetch(
      `/api/parse-json?duration=${duration}&start=${new Date(
        newValue[0]
      ).toISOString()}&end=${new Date(newValue[1]).toISOString()}`
    )
      .then((res) => res.json())
      .then(({ data, hotTopics }) => {
        setData(data)
        setHotTopics(hotTopics)
        setLoading(false)
      })
  }

  const handleDuration = (event) => {
    setDuration(event.target.value)

    const start = range ? new Date(range[0]).toISOString() : ''
    const end = range ? new Date(range[1]).toISOString() : ''

    setLoading(true)
    fetch(
      `/api/parse-json?duration=${event.target.value}&start=${start}&end=${end}`
    )
      .then((res) => res.json())
      .then(({ data, hotTopics }) => {
        setData(data)
        setHotTopics(hotTopics)
        setLoading(false)
      })
  }

  const marks = Object.keys(hotTopics).map((key) => {
    return {
      value: key,
      label: '🔥',
    }
  })

  useEffect(() => {
    const hotTopic = hotTopics[t]
    if (hotTopic) {
      ref.current.scrollTo(0, 0)
      setTitle(hotTopic.title)
      setSummary(hotTopic.summary)
      setRanking(hotTopic.comments)
    }
  }, [t])

  return (
    <main className={styles.main}>
      <Box sx={{ width: '100%', height: '10px' }} />
      <Stack
        direction={'row'}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        spacing={5}
      >
        <Box
          sx={{
            width: '20%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormGroup sx={{ width: '100%' }}>
            <Typography
              variant="h6"
              sx={{ color: '#1976d2', fontWeight: 'bold' }}
            >
              検索
            </Typography>
            <Box sx={{ height: '5px' }} />
            <InputLabel id="demo-simple-select-label">トピック</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="検索トピック"
              onChange={handleChange}
            >
              <MenuItem value={10}>松本人志</MenuItem>
            </Select>
            <Box sx={{ height: '10px' }} />
            <InputLabel id="demo-simple-select-label">期間</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateRangePicker']}>
                <DateRangePicker
                  localeText={{ start: '開始', end: '終了' }}
                  value={range}
                  onChange={handleRange}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Box sx={{ height: '10px' }} />
            <InputLabel id="demo-simple-select-label">間隔</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={duration}
              label="間隔"
              onChange={handleDuration}
            >
              <MenuItem value={1}>1日</MenuItem>
              <MenuItem value={7}>1週間</MenuItem>
            </Select>
          </FormGroup>
          <Box
            sx={{ height: '300px', marginTop: '30px', overflow: 'scroll' }}
            ref={ref}
          >
            <Typography
              variant="h6"
              sx={{ color: '#1976d2', fontWeight: 'bold' }}
            >
              ホットトピック
            </Typography>
            <Box sx={{ height: '5px' }} />
            <InputLabel id="demo-simple-select-label">タイトル</InputLabel>
            <Typography>{title}</Typography>
            <Box sx={{ height: '5px' }} />
            <InputLabel id="demo-simple-select-label">要約</InputLabel>
            <Typography>{summary}</Typography>
            <Box sx={{ height: '5px' }} />
            <InputLabel id="demo-simple-select-label">
              コメントランキング
            </InputLabel>
            {ranking.map((rank, index) => {
              return (
                <Typography key={index}>
                  {index + 1}位: {rank}
                </Typography>
              )
            })}
          </Box>
        </Box>
        <Graph
          data={data}
          loading={loading}
          setLoading={setLoading}
          t={t}
          setT={setT}
          marks={marks}
        />
      </Stack>
    </main>
  )
}
