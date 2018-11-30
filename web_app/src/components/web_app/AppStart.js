import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
  Input,
} from 'reactstrap';
import SweetAlert from 'sweetalert-react';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import * as MyAPI from '../../utils/MyAPI'
import Meyda from 'meyda'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

let mfcc_list = []

// AppStart
class AppStart extends Component {

  state = {
    loading: false,
    sweet_alert_show: false,
    sweet_alert_title: '',
    sweet_alert_message: '',

    meyda_data: [],
    py_data: [],
    meyda_cli_data: [],

    wave_file_name: 'test.wav',
    show_code_flg: false,
  }

  componentDidMount () {

  }

  // init audio context
  _init_audioContext = ({ audio }) => {

    return new Promise((resolve, reject) => {

      if (this.audioContext) {
        this.audioContext.close()
        this.audioContext = null
      }
      if (this.source) {
        this.source = null
      }

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Meyda
      this.source = this.audioContext.createMediaElementSource(audio);
      this.source.connect(this.audioContext.destination);

      resolve()
    })
  }

  _prepare_data_for_chart = () => {

    const data2 = []

    for (let i=0; i<mfcc_list.length; i++) {
      const data1 = {
        a1: mfcc_list[i][0],
        a2: mfcc_list[i][1],
        a3: mfcc_list[i][2],
        a4: mfcc_list[i][3],
        a5: mfcc_list[i][4],
        a6: mfcc_list[i][5],
        a7: mfcc_list[i][6],
        a8: mfcc_list[i][7],
        a9: mfcc_list[i][8],
        a10: mfcc_list[i][9],
        a11: mfcc_list[i][10],
        a12: mfcc_list[i][11],
        a13: mfcc_list[i][12],
      }
      data2.push(data1)
    }

    this.setState({
      meyda_data: data2
    })
  }


  // check audio
  _checkAudioWithMeyda = () => {

    const { wave_file_name } = this.state

    const sound_url = wave_file_name
    const audio = new Audio();
    audio.src = sound_url
    audio.onended = () => {

      // stop meyda_analyzer
      this.meyda_analyzer.stop()

      this._prepare_data_for_chart()
    }
    audio.onerror = (err) => {

      // stop meyda_analyzer
      this.meyda_analyzer.stop()
    };

    // init audioContext
    this._init_audioContext({
      audio: audio
    })

    // prepare
    this.meyda_analyzer = Meyda.createMeydaAnalyzer({
      "audioContext": this.audioContext,
      "source": this.source,
      "featureExtractors": ["mfcc"],
      "callback": features => {
        mfcc_list.push(features.mfcc)
      },
    });

    // start meyda_analyzer
    this.meyda_analyzer.start()

    // play audio
    audio.play()
  }

  // call api which return mfcc form python_speech_features
  _getPythonMFCC = async () => {

    const { wave_file_name } = this.state
    const results_1 = await MyAPI.getPythonMFCC({
      'wav_file_name': wave_file_name,
    })

    if (results_1.success !== true) {
      return;
    }

    this.setState({
      py_data: results_1.mfcc
    })
  }

  // call api which return mfcc from meyda cli
  _getMeydaCliMFCC = async () => {
    const { wave_file_name } = this.state
    const results_1 = await MyAPI.getMeydaCliMFCC({
      'wav_file_name': wave_file_name,
    })

    if (results_1.success !== true) {
      return;
    }

    this.setState({
      meyda_cli_data: results_1.mfcc
    })
  }

  // handle inputs
  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })

    mfcc_list = []
    this.setState({
      py_data: [],
      meyda_data: [],
      meyda_cli_data: [],
    })
  }

  _show_code = () => {
    this.setState({
      show_code_flg: this.state.show_code_flg === true ? false : true,
    })
  }

  render() {

    const {
      loading,
      sweet_alert_show,
      sweet_alert_title,
      sweet_alert_message,
      meyda_data,
      py_data,
      meyda_cli_data,
    } = this.state

    return(

      <Container className='home' style={{
        textAlign: 'center',
      }}>

        <Row style={{
          marginTop: 60,
          marginBottom: 20,
        }}>
          <Col md="2" xs="12" />
          <Col md="8" xs="12">
            <span style={{ fontSize: 18, textAlign: 'left', }}>
              meyda.js python_speech_features comparison
            </span>
          </Col>
          <Col md="2" xs="12" />
        </Row>

        {/* select audio file */}
        <Row style={{
          marginTop: 10,
          marginBottom: 20,
        }}>
          <Col md="2" xs="12" />
          <Col md="8" xs="12">
            <Input onChange={this._handleChange} type="select" name="wave_file_name">
              <option value="test.wav">test.wav</option>
              <option value="hi.wav">hi.wav</option>
              <option value="whatsup.wav">whatsup.wav</option>
            </Input>
          </Col>
          <Col md="2" xs="12" />
        </Row>

        {/* buttons */}
        <Row style={{
          marginTop: 10,
          marginBottom: 20,
        }}>
          <Col md="4" xs="12" style={{
              textAlign: 'left',
            }}>

            <Button
              onClick={this._checkAudioWithMeyda}
              color="success"
              style={{
                cursor: 'pointer',
              }}>
              Play sound and get MFCC with Meyda.js
            </Button>

          </Col>

          <Col md="4" xs="12" style={{
              textAlign: 'left',
            }}>

            <Button
              onClick={this._getMeydaCliMFCC}
              color="primary"
              style={{
                cursor: 'pointer',
              }}>
              Get MFCC from Meyda CLI
            </Button>

          </Col>

          <Col md="4" xs="12" style={{
              textAlign: 'right',
            }}>

            <Button
              onClick={this._getPythonMFCC}
              color="info"
              style={{
                cursor: 'pointer',
              }}>
              Get MFCC from Python
            </Button>

          </Col>

        </Row>

        {/* charts */}
        <div>
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md="2" xs="12" />
            <Col md="8" xs="12" style={{ textAlign: 'left' }}>
              MFCC from Meyda.js:
            </Col>
            <Col md="2" xs="12" />
          </Row>

          {/* meyda from browser directly */}
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md="2" xs="12" />
            <Col md="8" xs="12" style={{
                textAlign: 'center',
              }}>

              <LineChart width={600} height={300} data={meyda_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line dot={false} type="monotone" dataKey="a1" stroke="#800000" />
                <Line dot={false} type="monotone" dataKey="a2" stroke="#e6194B" />
                <Line dot={false} type="monotone" dataKey="a3" stroke="#fabebe" />
                <Line dot={false} type="monotone" dataKey="a4" stroke="#808000" />
                <Line dot={false} type="monotone" dataKey="a5" stroke="#ffe119" />
                <Line dot={false} type="monotone" dataKey="a6" stroke="#fffac8" />
                <Line dot={false} type="monotone" dataKey="a7" stroke="#469990" />
                <Line dot={false} type="monotone" dataKey="a8" stroke="#42d4f4" />
                <Line dot={false} type="monotone" dataKey="a9" stroke="#911eb4" />
                <Line dot={false} type="monotone" dataKey="a10" stroke="#e6beff" />
                <Line dot={false} type="monotone" dataKey="a11" stroke="#f032e6" />
                <Line dot={false} type="monotone" dataKey="a12" stroke="#a9a9a9" />
                <Line dot={false} type="monotone" dataKey="a13" stroke="#3cb44b" />
                <CartesianGrid strokeDasharray="5 5"/>

                <YAxis type="number" domain={[-100, 160]} />
                <XAxis />
              </LineChart>
            </Col>
            <Col md="2" xs="12" />
          </Row>

          {/* meyda cli */}
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md="2" xs="12" />
            <Col md="8" xs="12" style={{ textAlign: 'left' }}>
              MFCC from Meyda CLI:
            </Col>
            <Col md="2" xs="12" />
          </Row>
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md="2" xs="12" />
            <Col md="8" xs="12" style={{
                textAlign: 'center',
              }}>

              <LineChart width={600} height={300} data={meyda_cli_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line dot={false} type="monotone" dataKey="a1" stroke="#800000" />
                <Line dot={false} type="monotone" dataKey="a2" stroke="#e6194B" />
                <Line dot={false} type="monotone" dataKey="a3" stroke="#fabebe" />
                <Line dot={false} type="monotone" dataKey="a4" stroke="#808000" />
                <Line dot={false} type="monotone" dataKey="a5" stroke="#ffe119" />
                <Line dot={false} type="monotone" dataKey="a6" stroke="#fffac8" />
                <Line dot={false} type="monotone" dataKey="a7" stroke="#469990" />
                <Line dot={false} type="monotone" dataKey="a8" stroke="#42d4f4" />
                <Line dot={false} type="monotone" dataKey="a9" stroke="#911eb4" />
                <Line dot={false} type="monotone" dataKey="a10" stroke="#e6beff" />
                <Line dot={false} type="monotone" dataKey="a11" stroke="#f032e6" />
                <Line dot={false} type="monotone" dataKey="a12" stroke="#a9a9a9" />
                <Line dot={false} type="monotone" dataKey="a13" stroke="#3cb44b" />
                <CartesianGrid strokeDasharray="5 5"/>

                <YAxis type="number" domain={[-100, 160]} />
                <XAxis />
              </LineChart>

            </Col>
            <Col md="2" xs="12" />
          </Row>

          {/* python_speech_features */}
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md="2" xs="12" />
            <Col md="8" xs="12" style={{ textAlign: 'left' }}>
              MFCC from python_speech_features:
            </Col>
            <Col md="2" xs="12" />
          </Row>
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col md="2" xs="12" />
            <Col md="8" xs="12" style={{
                textAlign: 'center',
              }}>

              <LineChart width={600} height={300} data={py_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line dot={false} type="monotone" dataKey="a1" stroke="#800000" />
                <Line dot={false} type="monotone" dataKey="a2" stroke="#e6194B" />
                <Line dot={false} type="monotone" dataKey="a3" stroke="#fabebe" />
                <Line dot={false} type="monotone" dataKey="a4" stroke="#808000" />
                <Line dot={false} type="monotone" dataKey="a5" stroke="#ffe119" />
                <Line dot={false} type="monotone" dataKey="a6" stroke="#fffac8" />
                <Line dot={false} type="monotone" dataKey="a7" stroke="#469990" />
                <Line dot={false} type="monotone" dataKey="a8" stroke="#42d4f4" />
                <Line dot={false} type="monotone" dataKey="a9" stroke="#911eb4" />
                <Line dot={false} type="monotone" dataKey="a10" stroke="#e6beff" />
                <Line dot={false} type="monotone" dataKey="a11" stroke="#f032e6" />
                <Line dot={false} type="monotone" dataKey="a12" stroke="#a9a9a9" />
                <Line dot={false} type="monotone" dataKey="a13" stroke="#3cb44b" />
                <CartesianGrid strokeDasharray="5 5"/>

                <YAxis type="number" domain={[-100, 160]} />
                <XAxis />
              </LineChart>

            </Col>
            <Col md="2" xs="12" />
          </Row>

        </div>


        {/* loading */}
        <Loader fullPage={true} loading={loading} />

        {/* sweet alert */}
        <SweetAlert
          onOutsideClick={() => {}}
          onEscapeKey={() => {}}
          show={sweet_alert_show}
          title={sweet_alert_title}
          text={sweet_alert_message}
          showCancelButton={false}
          onCancel={() => this.setState({ sweet_alert_show: false })}
          onConfirm={this._alertConfirmed}
        />

      </Container>

    )
  }
}

export default withRouter( connect(null, null )(AppStart) )
