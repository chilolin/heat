import fs from 'fs'

function hotTopic(id) {
  const jsonObject = JSON.parse(
    fs.readFileSync('assets/hot_topic.json', 'utf8')
  )
  const news = jsonObject.news
  const topic = news.find((topic) => topic.id === id)

  return topic ?? null
}

function splitString(inputString) {
  return inputString.match(/.{1,30}/g).join('<br>')
}

function sentiment(content) {
  if (
    content.sentiment.positive > content.sentiment.negative &&
    content.sentiment.positive > content.sentiment.neutral
  ) {
    return 'positive'
  }
  if (content.sentiment.negative > content.sentiment.neutral) {
    return 'negative'
  }
  return 'neutral'
}

// TODO: 感情毎に分割する
function splitBySentiment(contents, duration, start, end) {
  const obj = {}

  const colors = { positive: 'red', negative: 'blue', nuetral: 'green' }

  let prevTimestamp = null
  const hotTopics = {}

  contents
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .filter((content) => {
      if (content.topic_label === -1) return false
      if (start && end && new Date(start) < new Date(end)) {
        return (
          new Date(content.timestamp) >= new Date(start) &&
          new Date(content.timestamp) <= new Date(end)
        )
      }
      return true
    })
    .forEach((content) => {
      const key = sentiment(content)

      if (Object.keys(obj).length === 0) {
        ;['positive', 'negative', 'neutral'].forEach((key) => {
          obj[key] = [
            {
              x: [11],
              y: [11],
              z: [11],
              text: [''],
              timestamp: [''],
              mode: 'markers',
              type: 'scatter3d',
              name: key,
              marker: {
                color: colors[key],
                size: [0],
              },
            },
          ]
        })
      } else {
        const diff =
          prevTimestamp !== null
            ? (new Date(content.timestamp) - prevTimestamp) /
              (100 * 60 * 60 * 24)
            : 0
        if (diff >= duration) {
          ;['positive', 'negative', 'neutral'].forEach((key) => {
            obj[key].push({
              x: [11],
              y: [11],
              z: [11],
              text: [''],
              timestamp: [''],
              mode: 'markers',
              name: key,
              type: 'scatter3d',
              marker: {
                color: colors[key],
                size: [0],
              },
            })
          })
        }
      }
      prevTimestamp = new Date(content.timestamp)

      obj[key][obj[key].length - 1].x.push(content.cordinate.x)
      obj[key][obj[key].length - 1].y.push(content.cordinate.y)
      obj[key][obj[key].length - 1].z.push(content.cordinate.z)
      obj[key][obj[key].length - 1].text.push(splitString(content.text))
      obj[key][obj[key].length - 1].timestamp.push(new Date(content.timestamp))
      obj[key][obj[key].length - 1].marker.size.push(4)

      const got = hotTopic(content.pageId)
      if (
        got !== null &&
        Object.values(hotTopics).find((topic) => topic.id === got.id) ===
          undefined
      ) {
        hotTopics[obj[key].length - 1] = got
      }
    })

  return [Object.values(obj), hotTopics]
}

export async function GET(req) {
  const url = new URL(req.url)
  const params1 = new URLSearchParams(url.search)
  const jsonObject = JSON.parse(fs.readFileSync('assets/data_all.json', 'utf8'))

  const [data, hotTopics] = splitBySentiment(
    jsonObject.content,
    params1.get('duration'),
    params1.get('start'),
    params1.get('end')
  )

  console.log(hotTopics)

  return Response.json({
    data,
    hotTopics,
  })
}
