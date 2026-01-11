import React, { useEffect, useState } from 'react'
import { Button, Alert, message } from 'antd'
import axios from 'axios'
import CTable from '../../components/CTable'
import { formatDate } from '../../utils/tools'

const Http: React.FC = () => {
  const [data, setData] = useState([])

  const config = [
    { label: '序号', prop: 'index', width: '50', isTemplate: true },
    { label: '事件ID', prop: 'eventId' },
    { label: '事件类型', prop: 'eventType' },
    { label: '请求地址', prop: 'requestUrl', width: '200' },
    { label: '请求类型', prop: 'requestType' },
    { label: '请求方式', prop: 'requestMethod' },
    { label: '事件参数', prop: 'params', width: '180' },
    { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
    { label: '请求返回代码', prop: 'responseStatus', width: '100' },
    { label: '请求消耗时间(ms)', prop: 'duration', width: '120' },
    {
      label: '事件发送时间',
      prop: 'sendTime',
      isTemplate: true,
      width: '140'
    },
    {
      label: '事件发生时间',
      prop: 'triggerTime',
      isTemplate: true,
      width: '140'
    }
  ]

  const getAllTracingList = () => {
    axios
      .get('/getAllTracingList', { params: { eventType: 'performance' } })
      .then(res => {
        const successList = res.data.data.filter(
          (item: any) => item.eventId === 'server'
        )
        axios
          .get('/getAllTracingList', { params: { eventType: 'error' } })
          .then(res => {
            const errorList = res.data.data.filter(
              (item: any) => item.eventId === 'server'
            )
            setData(errorList.concat(successList))
            message.success('成功查询最新数据 - 请求事件')
          })
      })
  }

  useEffect(() => {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
    getAllTracingList()
  }, [])

  // Axios Handlers
  const onClickAxiosGet = () => axios.get('/axios/get', { params: { id: 123 } })
  const onClickAxiosPost = () => axios.post('/axios/post', { id: 123 })
  const onClickAxiosError = () =>
    axios.get('/axios/error', { params: { id: 123 } })
  const onClickAxiosPostError = () =>
    axios.post('/axios/post/error', { id: 123 })

  // XHR Handlers
  const sendXhr = (method: string, url: string) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.send()
  }
  const onClickXhrGet = () => sendXhr('GET', '/xhr/get')
  const onClickXhrPost = () => sendXhr('POST', '/xhr/post')
  const onClickXhrGetError = () => sendXhr('GET', '/xhr/error')
  const onClickXhrPostError = () => sendXhr('POST', '/xhr/post/error')

  // Fetch Handlers
  const onClickFetchGet = () => fetch('/fetch/get')
  const onClickFetchPost = () => fetch('/fetch/post', { method: 'POST' })
  const onClickFetchGetError = () => fetch('/fetch/error')
  const onClickFetchPostError = () =>
    fetch('/fetch/post/error', { method: 'POST' })

  return (
    <div className="http">
      <div className="mb">
        <Alert
          type="warning"
          message="注意"
          description="axios的错误请求需要手动加上cache，否则错误会暴露导致错误模块会监听到此错误，从而造成错误的重复"
          className="mb"
          showIcon={false}
        />
        <div className="mb">
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={onClickAxiosGet}
          >
            axios正常请求-get
          </Button>
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={onClickAxiosPost}
          >
            axios正常请求-post
          </Button>
          <Button
            className="ant-btn-danger ant-btn-background-ghost"
            onClick={onClickAxiosError}
          >
            axios异常请求-get
          </Button>
          <Button
            className="ant-btn-danger ant-btn-background-ghost"
            onClick={onClickAxiosPostError}
          >
            axios异常请求-post
          </Button>
        </div>
        <div className="mb">
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={onClickXhrGet}
          >
            xhr正常请求-get
          </Button>
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={onClickXhrPost}
          >
            xhr正常请求-post
          </Button>
          <Button
            className="ant-btn-danger ant-btn-background-ghost"
            onClick={onClickXhrGetError}
          >
            xhr异常请求-get
          </Button>
          <Button
            className="ant-btn-danger ant-btn-background-ghost"
            onClick={onClickXhrPostError}
          >
            xhr异常请求-post
          </Button>
        </div>
        <div className="mb">
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={onClickFetchGet}
          >
            Fetch正常请求-get
          </Button>
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={onClickFetchPost}
          >
            Fetch正常请求-post
          </Button>
          <Button
            className="ant-btn-danger ant-btn-background-ghost"
            onClick={onClickFetchGetError}
          >
            Fetch异常请求-get
          </Button>
          <Button
            className="ant-btn-danger ant-btn-background-ghost"
            onClick={onClickFetchPostError}
          >
            Fetch异常请求-post
          </Button>
        </div>
      </div>

      <Button
        type="primary"
        onClick={getAllTracingList}
        className="mb"
      >
        获取最新采集数据
      </Button>

      <CTable
        data={data}
        tableHeight={400}
        config={config}
        renderers={{
          index: (_record: any, index: number) => index + 1,
          sendTime: record => formatDate(record.sendTime),
          triggerTime: record => formatDate(record.triggerTime),
          params: record => JSON.stringify(record.params)
        }}
      />
    </div>
  )
}

export default Http
