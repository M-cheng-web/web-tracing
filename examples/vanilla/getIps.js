function is_ipv4(d) {
  return regex_v4.test(d)
}
function is_ipv6(d) {
  return regex_v6.test(d)
}
const simpleIPRegex =
  /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
const regex_v4 =
    /((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])/,
  regex_v6 =
    /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))/,
  ip_regex_array = [regex_v6, regex_v4]
function peer(d) {
  let e,
    t =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection
  function n() {
    ;((e = new t({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })).onicecandidate = d => f(d)),
      e.createDataChannel('fake_data_channel')
  }
  function a() {
    return e.createOffer().then(d => e.setLocalDescription(d))
  }
  function f(e) {
    e &&
      e.candidate &&
      e.candidate.candidate &&
      d(e && e.candidate && e.candidate.candidate)
  }
  return {
    start: function () {
      n(), a()
    },
    stop: function () {
      if (e)
        try {
          e.close()
        } finally {
          ;(e.onicecandidate = () => ({})), (e = null)
        }
    },
    createConnection: n,
    createStunRequest: a,
    handleCandidates: f
  }
}
function publicIPs(d) {
  if (d && d < 100)
    throw new Error('Custom timeout cannot be under 100 milliseconds.')
  const e = [],
    t = peer(function (d) {
      const t = []
      for (const e of ip_regex_array) {
        const n = [],
          a = e.exec(d)
        if (a) {
          for (let d = 0; d < a.length; d++)
            (is_ipv4(a[d]) || is_ipv6(a[d])) && n.push(a[d])
          t.push(n)
        }
      }
      !(function (d) {
        e.includes(d) || e.push(n(d.flat(1 / 0)))
      })(t.flat(1 / 0))
    })
  function n(d) {
    return Array.from(new Set(d))
  }
  return new Promise(function (a, f) {
    t.start(),
      setTimeout(() => {
        e && e !== [] ? a(n(e.flat(1 / 0))) : f('No IP addresses were found.'),
          t.stop()
      }, d || 500)
  })
}
function getIPTypes(d) {
  return new Promise(function (e, t) {
    const n = []
    publicIPs(d)
      .then(d => {
        d.forEach(d => {
          d.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)
            ? n.push({ ip: d, type: 'private', IPv4: !0 })
            : d.match(
                /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))/
              )
            ? n.push({ ip: d, type: 'IPv6', IPv4: !1 })
            : n.push({ ip: d, type: 'public', IPv4: !0 })
        }),
          e(n)
      })
      .catch(t)
  })
}
function getIPv4(d) {
  return getIPTypes(d).then(d => {
    const e = d.filter(d => d.IPv4)
    for (let d = 0; d < e.length; d++) e[d] = e[d].ip
    return e || ''
  })
}
function getIPv6(d) {
  return getIPTypes(d).then(d => {
    const e = d.filter(d => 'IPv6' === d.type)
    for (let d = 0; d < e.length; d++) e[d] = e[d].ip
    return e ? e.ip : ''
  })
}
function getIPs(d) {
  return Object.assign(publicIPs(d), {
    types: getIPTypes,
    public: publicIPs,
    IPv4: getIPv4,
    IPv6: getIPv6
  })
}

export { getIPs }

window.getIPs = getIPs
