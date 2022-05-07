'use strict';


const selector_has_text = (selector, text) => {
  const e = document.querySelector(selector)
  if (e === null || e.textContent.trim() !== text) return false
  return true
}


const is_sindan_visualization_site = () => {
  const brand_path = "body > div.navbar.navbar-inverse.navbar-fixed-top > div > div.navbar-header > a"
  const brand_text = "SINDAN VISUALIZATION"
  return selector_has_text(brand_path, brand_text)
}


const is_campaign_page = () => {
  const header_path = "body > div.container > div > div > div > h1"
  const header_text = "ログキャンペーン一覧"
  return is_sindan_visualization_site() && selector_has_text(header_path, header_text)
}


const parse_campaign_list = () => {
  let i = 1
  let data = {}

  while (true) {
    const row = `body > div.container > div > div > table > tbody > tr:nth-child(${i})`
    const em = document.querySelector(`${row} > td:nth-child(3) > a`)
    const et = document.querySelector(`${row} > td:nth-child(5) > a`)

    if (em === null || et === null) break

    const mac = em.textContent.trim()
    const timestamp = et.textContent.trim()

    if (mac in data) {
      data[mac].push(timestamp)
    } else {
      data[mac] = [timestamp]
    }

    i += 1
  }

  return data
}


const replace_campaign_list = (hosts) => {
  let i = 1

  while (true) {
    const row = `body > div.container > div > div > table > tbody > tr:nth-child(${i})`
    const em = document.querySelector(`${row} > td:nth-child(3) > a`)

    if (em === null) break

    const mac = em.textContent.trim()
    if (mac in hosts) em.textContent = `${hosts[mac]} (${mac})`

    i += 1
  }
}


const is_dead = (timestamps, thr_min) => {
  const current = new Date().getTime()
  const last = new Date(timestamps[0])
  const thr_ms = thr_min * 60 * 1000

  if (current - last >= thr_ms) return true
  return false
}


const extract_dead_macs = (parsed_campaigns, thr_min) => {
  let dead_macs = []

  for (const [mac, timestamps] of Object.entries(parsed_campaigns)) {
    if (is_dead(timestamps, thr_min)) {
      dead_macs.push(mac)
    }
  }

  return dead_macs
}


const dead_thr_min = 10

if (is_campaign_page()) {
  const e = document.querySelector("body > div.container > div > div > div")
  const data = parse_campaign_list()
  const macs = extract_dead_macs(data, dead_thr_min)

  const mac_to_host = {
    "dc:a6:32:cd:1a:ab": "sindan.pod4",
    "00:22:cf:fd:6f:76": "sindan.pod5-1"
  }
  replace_campaign_list(mac_to_host)

  for (var mac of macs) {
    let name = mac
    if (mac in mac_to_host) name = `${mac_to_host[mac]} (${mac})`
    e.insertAdjacentHTML("afterend", `<p class="alert alert-warning" style="margin-bottom: 5px !important;"><strong>死んだかも：</strong> ${name} からの計測データが${dead_thr_min}分以上途絶しています</p>`)
    chrome.runtime.sendMessage({title: "死んだかも？", message: `${name} からの計測データが${dead_thr_min}分以上途絶しています`})
  }
}

